// Migrated to Base (Ethereum L2). Previous Marinade / Raydium / Orca
// integration removed — yield UI now talks to Aave V3 on Base directly from
// the client via wagmi (see /api/yield/aave/reserves in routes.ts).
//
// No `@solana/web3.js` or `@marinade.finance` imports remain.

export interface YieldProtocol {
  id: string;
  name: string;
  category: string;
  chain: string;
  apy: number;
  logo: string;
  website: string;
  tvl: number;
  description?: string;
}

export interface YieldPool {
  id: string;
  protocol: string;
  pair: string;
  apy: number;
  tvl: number;
  chain: string;
}

async function notSupported(): Promise<never> {
  throw new Error("Marinade/Solana yield endpoints are deprecated on Base. Use Aave V3 via /api/yield/aave/reserves.");
}

export const yieldProtocolsService = {
  async getAllProtocols(): Promise<YieldProtocol[]> {
    return [];
  },
  async getAllPools(): Promise<YieldPool[]> {
    return [];
  },
  async getMarinadeInfo() {
    return { apy: 0, tvl: 0, msolPrice: 0, dataSource: "deprecated" as const };
  },
  async getMsolBalance(_walletAddress: string): Promise<number> {
    return 0;
  },
  async buildMarinadeStakeTransaction(_walletAddress: string, _amount: number): Promise<never> {
    return notSupported();
  },
  async buildMarinadeUnstakeTransaction(
    _walletAddress: string,
    _amount: number,
    _instant: boolean,
  ): Promise<never> {
    return notSupported();
  },
};

export default yieldProtocolsService;
