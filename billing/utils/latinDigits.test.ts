import { describe, it, expect } from "vitest";

import {
  formatCompactNumber,
  formatCurrencyValue,
  formatNumber,
  formatPercentValue,
} from "./common";
import {
  formattedBalanceTokens,
  formatterCurrencyWithoutTranction,
} from "../wallet/utils";

const ARABIC_INDIC_DIGIT = /[٠-٩]/;

describe("billing formatters in Arabic", () => {
  it("still gets Arabic-Indic digits from Intl by default", () => {
    expect(new Intl.NumberFormat("ar-SA").format(20)).toMatch(
      ARABIC_INDIC_DIGIT,
    );
  });

  it.each([
    ["formatCurrencyValue", formatCurrencyValue("ar-SA", 20, "EUR", 2)],
    ["formatPercentValue", formatPercentValue("ar-SA", 5.5)],
    ["formatNumber", formatNumber("ar-SA", 1250)],
    ["formatCompactNumber", formatCompactNumber(2_500_000, "ar-SA")],
    [
      "formatterCurrencyWithoutTranction",
      formatterCurrencyWithoutTranction("ar-SA", 0.125, "USD"),
    ],
    [
      "formattedBalanceTokens",
      formattedBalanceTokens("ar-SA", 20, "EUR", 2)
        .map(({ value }) => value)
        .join(""),
    ],
  ])("%s writes Western digits", (_, formatted) => {
    expect(formatted).toMatch(/\d/);
    expect(formatted).not.toMatch(ARABIC_INDIC_DIGIT);
  });

  it("keeps the grouping and decimal separators", () => {
    expect(formatCurrencyValue("ar-SA", 1234.5, "EUR", 2)).toContain(
      "1,234.50",
    );
  });
});
