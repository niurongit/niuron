import { isAddress, isHex } from "viem";

export interface WalletTransactionPayload {
  to: string;
  data: string;
  value: string;
  estimatedGas?: string | number;
  gasPrice?: string | number;
}

export function expectWalletTransactionPayload(payload: WalletTransactionPayload) {
  if (!isAddress(payload.to)) {
    throw new Error(`Invalid transaction recipient: ${payload.to}`);
  }

  if (!isHex(payload.data) || payload.data.length < 10) {
    throw new Error("Transaction calldata must be non-empty hex with a function selector");
  }

  if (!/^\d+$/.test(String(payload.value))) {
    throw new Error(`Transaction value must be an unsigned integer string: ${payload.value}`);
  }

  if (payload.estimatedGas !== undefined && Number(payload.estimatedGas) <= 0) {
    throw new Error(`Estimated gas must be positive: ${payload.estimatedGas}`);
  }

  if (payload.gasPrice !== undefined && Number(payload.gasPrice) < 0) {
    throw new Error(`Gas price cannot be negative: ${payload.gasPrice}`);
  }
}
