export interface BaseToken {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  isNative?: boolean;
  logo?: string;
}

export const NATIVE_ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export const BASE_TOKENS: BaseToken[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: NATIVE_ETH_ADDRESS,
    decimals: 18,
    isNative: true,
    logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    logo: "https://assets.coingecko.com/coins/images/2518/large/weth.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
    logo: "https://assets.coingecko.com/coins/images/6319/large/usdc.png",
  },
  {
    symbol: "cbETH",
    name: "Coinbase Wrapped Staked ETH",
    address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
    decimals: 18,
    logo: "https://assets.coingecko.com/coins/images/27008/large/cbeth.png",
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    decimals: 18,
    logo: "https://assets.coingecko.com/coins/images/9956/large/Badge_Dai.png",
  },
  {
    symbol: "USDbC",
    name: "USD Base Coin",
    address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
    decimals: 6,
    logo: "https://assets.coingecko.com/coins/images/31164/large/baseusdc.jpg",
  },
];

export function getToken(symbolOrAddress: string): BaseToken | undefined {
  const lower = symbolOrAddress.toLowerCase();
  return BASE_TOKENS.find(
    (t) => t.symbol.toLowerCase() === lower || t.address.toLowerCase() === lower,
  );
}

export const AAVE_V3_POOL_BASE = "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5";
