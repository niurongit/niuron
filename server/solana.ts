// Migrated to Base (Ethereum L2). This module previously wrapped Solana RPC +
// Jupiter aggregator. It now exposes Base-compatible stubs so the rest of the
// server keeps compiling while the matching endpoints (jupiter-swap, escrow,
// stealth-deposit, etc.) are explicitly deprecated in routes.ts.
//
// No `@solana/web3.js` or `@solana/spl-token` imports remain.

export const TOKEN_MINTS: Record<string, { mint: string; decimals: number; symbol: string; name: string }> = {
  ETH:   { mint: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18, symbol: "ETH",   name: "Ethereum" },
  WETH:  { mint: "0x4200000000000000000000000000000000000006", decimals: 18, symbol: "WETH",  name: "Wrapped Ether" },
  USDC:  { mint: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6,  symbol: "USDC",  name: "USD Coin" },
  USDbC: { mint: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", decimals: 6,  symbol: "USDbC", name: "Bridged USD Coin" },
  DAI:   { mint: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", decimals: 18, symbol: "DAI",   name: "Dai Stablecoin" },
  cbETH: { mint: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22", decimals: 18, symbol: "cbETH", name: "Coinbase Wrapped Staked ETH" },
};

export const MINT_TO_SYMBOL: Record<string, string> = Object.entries(TOKEN_MINTS).reduce(
  (acc, [symbol, info]) => {
    acc[info.mint.toLowerCase()] = symbol;
    acc[info.mint] = symbol;
    return acc;
  },
  {} as Record<string, string>,
);

// Connection placeholder — Base reads happen client-side via viem. Server code
// that still references `connection` will get a clearly-failing object.
export const connection = {
  rpcEndpoint: "https://mainnet.base.org",
} as const;

export async function getSolBalance(_walletAddress: string): Promise<number> {
  return 0;
}

export async function getTokenBalances(_walletAddress: string): Promise<Map<string, number>> {
  return new Map();
}

export async function getTokenPrices(_mints: string[]): Promise<Map<string, number>> {
  return new Map();
}

export async function getWalletTokenData(_walletAddress: string) {
  return {
    holdings: [] as Array<{ mint: string; symbol: string; name: string; balance: number; valueUsd: number; price: number; change24h: number }>,
    prices: new Map<string, number>(),
  };
}

export function getTokenInfo(mintOrSymbol: string) {
  const bySymbol = TOKEN_MINTS[mintOrSymbol];
  if (bySymbol) return bySymbol;
  const sym = MINT_TO_SYMBOL[mintOrSymbol] || MINT_TO_SYMBOL[mintOrSymbol.toLowerCase?.() ?? ""];
  return sym ? TOKEN_MINTS[sym] : null;
}

// --- Deprecated on Base. Throw so callers see an obvious error. ----------
function deprecated(name: string): never {
  throw new Error(`${name} is not available on Base; this endpoint is deprecated.`);
}

export async function getJupiterQuote(): Promise<never> { return deprecated("getJupiterQuote"); }
export async function getJupiterSwapTransaction(): Promise<never> { return deprecated("getJupiterSwapTransaction"); }
export async function confirmTransaction(): Promise<never> { return deprecated("confirmTransaction"); }
export async function getRecentBlockhash(): Promise<never> { return deprecated("getRecentBlockhash"); }
export function getEscrowPublicKey(): string | null { return null; }
export async function buildStealthDepositTransaction(): Promise<never> { return deprecated("buildStealthDepositTransaction"); }
export async function buildClaimTransaction(): Promise<never> { return deprecated("buildClaimTransaction"); }
export async function executeClaimTransaction(): Promise<never> { return deprecated("executeClaimTransaction"); }
export async function getEscrowBalance(_tokenMint: string): Promise<number> { return 0; }
