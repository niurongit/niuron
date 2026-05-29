import express from "express";
import request from "supertest";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { expectWalletTransactionPayload } from "../helpers/baseTransaction";

process.env.DATABASE_URL ||= "postgresql://niuron:niuron@localhost:5432/niuron_test";
process.env.SESSION_SECRET ||= "test-session-secret-00000000000000000000000000000000";

vi.mock("../../server/storage", () => ({
  storage: {
    getPortfolioStats: vi.fn(async () => ({ totalValue: 0, shadowValue: 0, publicValue: 0, change24h: 0 })),
    getPortfolioHoldings: vi.fn(),
    getDefiPositions: vi.fn(),
    getShadowBalances: vi.fn(),
    moveToShadow: vi.fn(),
    moveFromShadow: vi.fn(),
    getActivities: vi.fn(),
    getBatchedActions: vi.fn(),
    createBatchedAction: vi.fn(),
    updateBatchedActionStatus: vi.fn(),
    addActivity: vi.fn(),
    executeBatch: vi.fn(),
    createSwapOrder: vi.fn(),
    getSwapOrders: vi.fn(),
    getDisclosureProofs: vi.fn(),
    createDisclosureProof: vi.fn(),
    revokeDisclosureProof: vi.fn(),
    getYieldStrategies: vi.fn(),
    createYieldStrategy: vi.fn(),
    getComplianceRules: vi.fn(),
    createComplianceRule: vi.fn(),
    getComplianceRuleById: vi.fn(),
    updateComplianceRule: vi.fn(),
    deleteComplianceRule: vi.fn(),
    addAuditEntry: vi.fn(),
    getAuditTrail: vi.fn(),
    exportAuditTrail: vi.fn(),
    savePortfolioSnapshot: vi.fn(),
    getZkProofs: vi.fn(),
    createZkProof: vi.fn(async (proof) => ({ id: "proof-1", ...proof })),
    verifyZkProof: vi.fn(),
    revokeZkProof: vi.fn(),
    getZkProofByNullifier: vi.fn(),
  },
}));

const { registerRoutes } = await import("../../server/routes");

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  return app;
}

describe("Niuron API integration baseline", () => {
  let app: express.Express;
  let server: Awaited<ReturnType<typeof registerRoutes>>;

  beforeAll(async () => {
    app = createTestApp();
    server = await registerRoutes(app);

    return async () => {
      if (!server.listening) return;
      await new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
    };
  });

  it("validates /api/swap/quote required parameters", async () => {
    const res = await request(app).get("/api/swap/quote").expect(400);

    expect(res.body.error).toContain("Missing required parameters");
  });

  it("builds a wallet-signable Base swap transaction from an aggregator quote", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          code: 200,
          data: {
            inAmount: "1.5",
            outAmount: "1498.250000",
            minOutAmount: "1490.758750",
            estimatedGas: "185000",
            to: "0x111111125421ca6dc452d289314280a0f8842a65",
            data: "0x12aa3caf0000000000000000000000000000000000000000000000000000000000000000",
            value: "0",
            gasPrice: "1000000",
            price_impact: "0.02",
          },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );

    const res = await request(app)
      .get("/api/swap/quote")
      .query({
        sellToken: "0x4200000000000000000000000000000000000006",
        buyToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        amount: "1.5",
        slippage: "0.5",
        taker: "0x0000000000000000000000000000000000000001",
      })
      .expect(200);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const quoteUrl = new URL(String(fetchMock.mock.calls[0][0]));
    expect(quoteUrl.hostname).toBe("open-api.openocean.finance");
    expect(quoteUrl.pathname).toBe("/v3/base/swap_quote");
    expect(quoteUrl.searchParams.get("amount")).toBe("1.5");
    expect(quoteUrl.searchParams.get("account")).toBe("0x0000000000000000000000000000000000000001");

    expect(res.body).toEqual(
      expect.objectContaining({
        router: "OpenOcean",
        inAmount: "1.5",
        value: "0",
        priceImpact: 0.02,
      }),
    );
    expectWalletTransactionPayload(res.body);
  });

  it("returns Base Aave reserve metadata", async () => {
    const res = await request(app).get("/api/yield/aave/reserves").expect(200);

    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          symbol: "USDC",
          address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
          decimals: 6,
        }),
      ]),
    );
  });

  it("generates and verifies a balance proof", async () => {
    const res = await request(app)
      .post("/api/zk/generate/balance")
      .send({
        walletAddress: "0x0000000000000000000000000000000000000001",
        balance: 42,
        tokenSymbol: "USDC",
        threshold: 10,
      })
      .expect(201);

    expect(res.body.proof).toEqual(
      expect.objectContaining({
        walletAddress: "0x0000000000000000000000000000000000000001",
        proofType: "balance",
      }),
    );
    expect(res.body.cryptographic.proofHash).toMatch(/^[a-f0-9]{128}$/);
    expect(res.body.cryptographic.commitment).toMatch(/^[a-f0-9]{64}$/);
  });

  it("keeps wallet-scoped portfolio reads isolated at the API boundary", async () => {
    const emptyWallet = await request(app).get("/api/portfolio/stats").expect(200);
    const evmWallet = await request(app)
      .get("/api/portfolio/stats")
      .query({ wallet: "0x0000000000000000000000000000000000000002" })
      .expect(200);

    expect(emptyWallet.body).toEqual(expect.objectContaining({ totalValue: expect.any(Number) }));
    expect(evmWallet.body).toEqual({ totalValue: 0, shadowValue: 0, publicValue: 0, change24h: 0 });
  });
});
