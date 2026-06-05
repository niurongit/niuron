import { describe, expect, it } from "vitest";
import {
  AmountParseError,
  assertSafeBaseUnitString,
  formatBaseUnitsToDecimal,
  parseDecimalToBaseUnits,
} from "@shared/amounts";

describe("amount precision helpers", () => {
  it("parses decimal token amounts into exact base units", () => {
    expect(parseDecimalToBaseUnits("1", 18)).toBe(1_000_000_000_000_000_000n);
    expect(parseDecimalToBaseUnits("1.5", 6)).toBe(1_500_000n);
    expect(parseDecimalToBaseUnits("0.000001", 6)).toBe(1n);
    expect(parseDecimalToBaseUnits("000.10", 2)).toBe(10n);
  });

  it("formats base units back into canonical decimal strings", () => {
    expect(formatBaseUnitsToDecimal(1_000_000_000_000_000_000n, 18)).toBe("1");
    expect(formatBaseUnitsToDecimal(1_500_000n, 6)).toBe("1.5");
    expect(formatBaseUnitsToDecimal(1n, 6)).toBe("0.000001");
    expect(formatBaseUnitsToDecimal("0", 6)).toBe("0");
  });

  it("rejects float-unsafe or ambiguous amount input", () => {
    expect(() => parseDecimalToBaseUnits("1e18", 18)).toThrow(AmountParseError);
    expect(() => parseDecimalToBaseUnits("-1", 18)).toThrow(AmountParseError);
    expect(() => parseDecimalToBaseUnits("1.0000001", 6)).toThrow(AmountParseError);
    expect(() => parseDecimalToBaseUnits("", 18)).toThrow(AmountParseError);
  });

  it("validates persisted base-unit strings", () => {
    expect(assertSafeBaseUnitString("000123")).toBe("123");
    expect(assertSafeBaseUnitString("0")).toBe("0");
    expect(() => assertSafeBaseUnitString("1.23")).toThrow(AmountParseError);
    expect(() => assertSafeBaseUnitString("-1")).toThrow(AmountParseError);
  });
});
