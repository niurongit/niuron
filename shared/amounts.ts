const DECIMAL_AMOUNT_PATTERN = /^\d+(?:\.\d+)?$/;

export class AmountParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AmountParseError";
  }
}

export function parseDecimalToBaseUnits(amount: string, decimals: number): bigint {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) {
    throw new AmountParseError("Token decimals must be an integer between 0 and 255");
  }

  const normalized = amount.trim();
  if (!DECIMAL_AMOUNT_PATTERN.test(normalized)) {
    throw new AmountParseError("Amount must be a non-negative decimal string without exponent notation");
  }

  const [wholePart, fractionalPart = ""] = normalized.split(".");
  if (fractionalPart.length > decimals) {
    throw new AmountParseError(`Amount has more than ${decimals} decimal places`);
  }

  const paddedFractional = fractionalPart.padEnd(decimals, "0");
  const digits = `${wholePart}${paddedFractional}`.replace(/^0+(?=\d)/, "");
  return BigInt(digits || "0");
}

export function formatBaseUnitsToDecimal(baseUnits: bigint | string, decimals: number): string {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) {
    throw new AmountParseError("Token decimals must be an integer between 0 and 255");
  }

  const value = typeof baseUnits === "bigint" ? baseUnits : BigInt(baseUnits);
  if (value < 0n) {
    throw new AmountParseError("Base units amount cannot be negative");
  }

  if (decimals === 0) return value.toString();

  const raw = value.toString().padStart(decimals + 1, "0");
  const whole = raw.slice(0, -decimals);
  const fraction = raw.slice(-decimals).replace(/0+$/, "");
  return fraction.length > 0 ? `${whole}.${fraction}` : whole;
}

export function assertSafeBaseUnitString(value: string): string {
  if (!/^\d+$/.test(value)) {
    throw new AmountParseError("Base unit value must be an unsigned integer string");
  }
  return value.replace(/^0+(?=\d)/, "");
}
