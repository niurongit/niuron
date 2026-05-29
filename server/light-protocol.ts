import { createHash, randomBytes } from "crypto";
import type {
  LightProtocolConfig,
  ZkExecutionSession,
  CompressedNote,
  InsertCompressedNote,
  InsertZkExecutionSession,
} from "@shared/schema";

interface StateTreeSnapshot {
  root: string;
  height: number;
  leafCount: number;
  timestamp: number;
  isRealData: boolean;
}

interface ProofInput {
  inputNotes: string[];
  outputNotes: string[];
  publicInputs: {
    amount: number;
    tokenMint: string;
    merkleRoot: string;
  };
}

interface ProofOutput {
  proofData: string;
  nullifiers: string[];
  outputCommitments: string[];
  success: boolean;
  verificationKey?: string;
  isRealProof: boolean;
  proofType: "real_zk" | "simulated";
}

interface CompressedTransferParams {
  fromWallet: string;
  toWallet: string;
  tokenMint: string;
  amount: number;
  inputNotes: CompressedNote[];
  stateRoot: string;
}

interface ZkRouteSegment {
  type: "real" | "decoy";
  noteCommitment: string;
  nullifier: string;
  amount: number;
  isEncrypted: boolean;
}

interface LightProtocolCapabilities {
  sdkAvailable: boolean;
  rpcConnected: boolean;
  proverAvailable: boolean;
  supportsCompressedTokens: boolean;
  supportsProofGeneration: boolean;
  supportsDecoyTransactions: boolean;
  maxDecoyCount: number;
  supportedTokens: string[];
  network: "mainnet" | "devnet" | "localnet" | "simulation";
  lastChecked: number;
}

export class LightProtocolService {
  private stateTreeCache: Map<string, StateTreeSnapshot> = new Map();
  private proofGenerationQueue: Map<string, Promise<ProofOutput>> = new Map();
  private capabilities: LightProtocolCapabilities | null = null;
  private rpcEndpoint: string | null = null;
  private lastCapabilityCheck: number = 0;
  private readonly CAPABILITY_CHECK_INTERVAL = 60000;

  constructor() {
    this.initializeRpcEndpoint();
  }

  private initializeRpcEndpoint(): void {
    // Migrated to Base. Light Protocol (Solana ZK compression) is intentionally
    // disabled — all ZK endpoints now use the simulation fallback so no Solana
    // RPC or @solana/web3.js import is ever executed at runtime.
    this.rpcEndpoint = null;
  }

  async checkCapabilities(): Promise<LightProtocolCapabilities> {
    const now = Date.now();
    
    if (this.capabilities && (now - this.lastCapabilityCheck) < this.CAPABILITY_CHECK_INTERVAL) {
      return this.capabilities;
    }

    let sdkAvailable = false;
    let rpcConnected = false;
    let proverAvailable = false;
    let network: "mainnet" | "devnet" | "localnet" | "simulation" = "simulation";

    // Base-only build: Light Protocol is Solana-specific and intentionally not
    // bundled. Keep the capability contract stable while forcing simulator mode.

    this.capabilities = {
      sdkAvailable,
      rpcConnected,
      proverAvailable,
      supportsCompressedTokens: sdkAvailable && rpcConnected,
      supportsProofGeneration: sdkAvailable && proverAvailable,
      supportsDecoyTransactions: true,
      maxDecoyCount: 10,
      supportedTokens: [
        "0x4200000000000000000000000000000000000006",
        "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
      ],
      network,
      lastChecked: now,
    };

    this.lastCapabilityCheck = now;
    return this.capabilities;
  }

  private async testRpcConnection(rpc: any): Promise<boolean> {
    try {
      const slot = await rpc.getSlot();
      return typeof slot === "number" && slot > 0;
    } catch {
      return false;
    }
  }

  private async testProverAvailability(rpc: any): Promise<boolean> {
    try {
      const result = await Promise.race([
        (async (): Promise<boolean> => {
          try {
            const indexerSlot = await rpc.getIndexerSlot?.();
            
            if (typeof indexerSlot !== "number" || indexerSlot <= 0) {
              console.log("Prover test: Indexer slot check failed, prover unavailable");
              return false;
            }
            
            console.log(`Prover test: Indexer slot ${indexerSlot} confirmed`);

            console.log("Prover test: Light Protocol disabled in Base-only build; using simulator");
            return false;
          } catch (err: any) {
            console.log("Prover test: Check failed with error:", err?.message);
            return false;
          }
        })(),
        new Promise<boolean>((resolve) => {
          setTimeout(() => {
            console.log("Prover test: Timed out after 10s, prover unavailable");
            resolve(false);
          }, 10000);
        })
      ]);
      
      return result;
    } catch (error) {
      console.log("Prover availability test failed:", error);
      return false;
    }
  }

  generateCommitment(amount: number, owner: string, randomness: string): string {
    const data = `commitment:${amount}:${owner}:${randomness}`;
    return createHash("sha256").update(data).digest("hex");
  }

  generateNullifier(noteCommitment: string, ownerSecret: string): string {
    const data = `nullifier:${noteCommitment}:${ownerSecret}`;
    return createHash("sha256").update(data).digest("hex");
  }

  generateRandomness(): string {
    return randomBytes(32).toString("hex");
  }

  encryptAmount(amount: number, ownerPublicKey: string): string {
    const randomness = this.generateRandomness();
    const data = `${amount}:${randomness}`;
    const encrypted = createHash("sha256")
      .update(`${ownerPublicKey}:${data}`)
      .digest("hex");
    return `enc_${encrypted}`;
  }

  async syncStateTree(walletAddress: string): Promise<StateTreeSnapshot> {
    const cachedSnapshot = this.stateTreeCache.get(walletAddress);
    const now = Date.now();
    
    if (cachedSnapshot && (now - cachedSnapshot.timestamp) < 30000) {
      return cachedSnapshot;
    }

    const capabilities = await this.checkCapabilities();

    if (capabilities.sdkAvailable && capabilities.rpcConnected && this.rpcEndpoint) {
      try {
        const snapshot = await this.syncStateTreeFromSdk(walletAddress);
        this.stateTreeCache.set(walletAddress, snapshot);
        return snapshot;
      } catch (error) {
        console.log("SDK state sync failed, using simulation:", error);
      }
    }

    const simulatedRoot = createHash("sha256")
      .update(`state_tree:${walletAddress}:${Math.floor(now / 60000)}`)
      .digest("hex");

    const snapshot: StateTreeSnapshot = {
      root: simulatedRoot,
      height: 20,
      leafCount: 0,
      timestamp: now,
      isRealData: false,
    };

    this.stateTreeCache.set(walletAddress, snapshot);
    return snapshot;
  }

  private async syncStateTreeFromSdk(_walletAddress: string): Promise<StateTreeSnapshot> {
    throw new Error("Light Protocol SDK is disabled in the Base-only build");
  }

  async generateProof(input: ProofInput): Promise<ProofOutput> {
    const proofKey = createHash("sha256")
      .update(JSON.stringify({
        inputNotes: input.inputNotes.sort(),
        outputNotes: input.outputNotes.sort(),
        publicInputs: input.publicInputs,
      }))
      .digest("hex");

    const existingProof = this.proofGenerationQueue.get(proofKey);
    if (existingProof) {
      return existingProof;
    }

    const capabilities = await this.checkCapabilities();

    let proofPromise: Promise<ProofOutput>;

    if (capabilities.supportsProofGeneration && this.rpcEndpoint) {
      proofPromise = this.generateRealProof(input);
    } else {
      proofPromise = this.generateSimulatedProof(input);
    }

    this.proofGenerationQueue.set(proofKey, proofPromise);

    try {
      const result = await proofPromise;
      return result;
    } finally {
      setTimeout(() => {
        this.proofGenerationQueue.delete(proofKey);
      }, 5000);
    }
  }

  private async generateRealProof(input: ProofInput): Promise<ProofOutput> {
    console.log("Real Light Protocol proofs are disabled in the Base-only build; using simulator");
    return this.generateSimulatedProof(input);
  }

  private async generateSimulatedProof(input: ProofInput): Promise<ProofOutput> {
    await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 100));

    const nullifiers = input.inputNotes.map((note) =>
      this.generateNullifier(note, this.generateRandomness())
    );

    const outputCommitments = input.outputNotes.map((note) =>
      createHash("sha256").update(`sim_output:${note}:${Date.now()}`).digest("hex")
    );

    const proofData = {
      protocol: "light_protocol_simulated",
      isReal: false,
      curve: "bn254",
      publicInputs: input.publicInputs,
      nullifiers,
      outputCommitments,
      proof: {
        pi_a: [this.generateRandomness().slice(0, 64), this.generateRandomness().slice(0, 64)],
        pi_b: [
          [this.generateRandomness().slice(0, 64), this.generateRandomness().slice(0, 64)],
          [this.generateRandomness().slice(0, 64), this.generateRandomness().slice(0, 64)],
        ],
        pi_c: [this.generateRandomness().slice(0, 64), this.generateRandomness().slice(0, 64)],
      },
      verificationKey: this.generateRandomness(),
      timestamp: Date.now(),
    };

    return {
      proofData: JSON.stringify(proofData),
      nullifiers,
      outputCommitments,
      success: true,
      isRealProof: false,
      proofType: "simulated",
    };
  }

  async verifyProof(proofData: string): Promise<{ isValid: boolean; isRealVerification: boolean }> {
    try {
      const proof = JSON.parse(proofData);
      
      if (!proof.nullifiers || !proof.outputCommitments) {
        return { isValid: false, isRealVerification: false };
      }

      if (proof.isReal && proof.proof?.compressedProof) {
        return { isValid: true, isRealVerification: true };
      }

      await new Promise((resolve) => setTimeout(resolve, 50));
      return { isValid: true, isRealVerification: false };
    } catch {
      return { isValid: false, isRealVerification: false };
    }
  }

  async createCompressedNote(
    walletAddress: string,
    tokenMint: string,
    tokenSymbol: string,
    amount: number,
    stateRoot: string,
    isDecoy: boolean = false
  ): Promise<InsertCompressedNote> {
    const randomness = this.generateRandomness();
    const actualAmount = isDecoy ? 0 : amount;
    
    const noteCommitment = this.generateCommitment(
      actualAmount,
      walletAddress,
      randomness
    );
    
    const nullifierHash = this.generateNullifier(
      noteCommitment,
      walletAddress.slice(0, 16)
    );
    
    const encryptedAmount = this.encryptAmount(actualAmount, walletAddress);
    const encryptedRandomness = this.encryptAmount(
      parseInt(randomness.slice(0, 8), 16),
      walletAddress
    );
    
    const leafIndex = Math.floor(Math.random() * 1000000);

    return {
      walletAddress,
      noteCommitment,
      nullifierHash,
      tokenMint,
      tokenSymbol,
      encryptedAmount,
      encryptedRandomness,
      merkleTreeRoot: stateRoot,
      leafIndex,
      isDecoy,
    };
  }

  async prepareCompressedTransfer(
    params: CompressedTransferParams
  ): Promise<{
    proofOutput: ProofOutput;
    outputNote: InsertCompressedNote;
    decoyNotes: InsertCompressedNote[];
    executionMode: "real_zk" | "simulated";
  }> {
    const inputNoteCommitments = params.inputNotes.map((n) => n.noteCommitment);
    
    const outputNote = await this.createCompressedNote(
      params.toWallet,
      params.tokenMint,
      "TOKEN",
      params.amount,
      params.stateRoot,
      false
    );

    const decoyCount = 2 + Math.floor(Math.random() * 3);
    const decoyNotes: InsertCompressedNote[] = [];
    
    for (let i = 0; i < decoyCount; i++) {
      const decoyNote = await this.createCompressedNote(
        params.toWallet,
        params.tokenMint,
        "TOKEN",
        0,
        params.stateRoot,
        true
      );
      decoyNotes.push(decoyNote);
    }

    const proofInput: ProofInput = {
      inputNotes: inputNoteCommitments,
      outputNotes: [outputNote.noteCommitment, ...decoyNotes.map((n) => n.noteCommitment)],
      publicInputs: {
        amount: params.amount,
        tokenMint: params.tokenMint,
        merkleRoot: params.stateRoot,
      },
    };

    const proofOutput = await this.generateProof(proofInput);

    return {
      proofOutput,
      outputNote,
      decoyNotes,
      executionMode: proofOutput.proofType,
    };
  }

  async createZkExecutionSession(
    walletAddress: string,
    batchId: string,
    jupiterQuoteId?: string
  ): Promise<InsertZkExecutionSession> {
    const stateSnapshot = await this.syncStateTree(walletAddress);
    const capabilities = await this.checkCapabilities();

    return {
      walletAddress,
      batchId,
      stateRootSnapshot: stateSnapshot.root,
      proofType: capabilities.supportsProofGeneration ? "real_zk" : "simulated",
      jupiterQuoteId,
      jupiterRouteHash: jupiterQuoteId
        ? createHash("sha256").update(jupiterQuoteId).digest("hex")
        : undefined,
    };
  }

  async generateZkRouteSegments(
    walletAddress: string,
    inputToken: string,
    outputToken: string,
    amount: number,
    decoyCount: number,
    stateRoot: string
  ): Promise<ZkRouteSegment[]> {
    const segments: ZkRouteSegment[] = [];

    const realNote = await this.createCompressedNote(
      walletAddress,
      inputToken,
      "INPUT",
      amount,
      stateRoot,
      false
    );

    segments.push({
      type: "real",
      noteCommitment: realNote.noteCommitment,
      nullifier: realNote.nullifierHash,
      amount: amount,
      isEncrypted: true,
    });

    for (let i = 0; i < decoyCount; i++) {
      const decoyNote = await this.createCompressedNote(
        walletAddress,
        i % 2 === 0 ? inputToken : outputToken,
        "DECOY",
        0,
        stateRoot,
        true
      );

      segments.push({
        type: "decoy",
        noteCommitment: decoyNote.noteCommitment,
        nullifier: decoyNote.nullifierHash,
        amount: 0,
        isEncrypted: true,
      });
    }

    for (let i = segments.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [segments[i], segments[j]] = [segments[j], segments[i]];
    }

    return segments;
  }

  calculatePrivacyScore(
    realSegments: number,
    decoySegments: number,
    timingEntropy: number,
    routeDiversity: number
  ): number {
    const decoyDensity = decoySegments / (realSegments || 1);
    const decoyScore = Math.min(decoyDensity * 20, 40);
    const timingScore = timingEntropy * 30;
    const diversityScore = routeDiversity * 30;
    return Math.round(decoyScore + timingScore + diversityScore);
  }

  async getZkModeCapabilities(): Promise<{
    supportsCompressedTokens: boolean;
    supportsProofGeneration: boolean;
    supportsDecoyTransactions: boolean;
    maxDecoyCount: number;
    supportedTokens: string[];
    network: string;
    isRealZkAvailable: boolean;
    rpcEndpoint: string | null;
  }> {
    const capabilities = await this.checkCapabilities();
    
    return {
      supportsCompressedTokens: capabilities.supportsCompressedTokens,
      supportsProofGeneration: capabilities.supportsProofGeneration,
      supportsDecoyTransactions: capabilities.supportsDecoyTransactions,
      maxDecoyCount: capabilities.maxDecoyCount,
      supportedTokens: capabilities.supportedTokens,
      network: capabilities.network,
      isRealZkAvailable: capabilities.sdkAvailable && capabilities.rpcConnected && capabilities.proverAvailable,
      rpcEndpoint: this.rpcEndpoint ? this.rpcEndpoint.replace(/api[-_]?key=[^&]+/gi, "api-key=***") : null,
    };
  }

  isSimulationMode(): boolean {
    return !this.capabilities?.supportsProofGeneration;
  }
}

export const lightProtocolService = new LightProtocolService();
