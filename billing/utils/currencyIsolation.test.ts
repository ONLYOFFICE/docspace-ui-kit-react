import { describe, it, expect } from "vitest";

import { formatCurrencyValue, getCurrencySymbol } from "./common";
import { getCurrencySymbol as getLimitCurrencySymbol } from "../shared/service-limits/common/utils";
import {
  formattedBalanceTokens,
  formatterCurrencyWithoutTranction,
} from "../wallet/utils";

const FIRST_STRONG_ISOLATE = "\u2068";
const ISOLATED_USD = `${FIRST_STRONG_ISOLATE}US$\u2069`;

describe("currency symbol in right-to-left languages", () => {
  it.each([
    ["formatCurrencyValue", formatCurrencyValue("ar-SA", 22.77, "USD", 2)],
    [
      "formatterCurrencyWithoutTranction",
      formatterCurrencyWithoutTranction("ar-SA", 0.15, "USD"),
    ],
    [
      "formattedBalanceTokens",
      formattedBalanceTokens("ar-SA", 22.77, "USD", 2)
        .map(({ value }) => value)
        .join(""),
    ],
    ["getCurrencySymbol", getCurrencySymbol("USD", "ar-SA")],
    [
      "service limits getCurrencySymbol",
      getLimitCurrencySymbol("ar-SA", "USD"),
    ],
  ])("%s keeps US$ in one piece", (_, formatted) => {
    expect(formatted).toContain(ISOLATED_USD);
  });

  it("keeps the amount next to the isolated symbol", () => {
    expect(formatCurrencyValue("ar-SA", 22.77, "USD", 2)).toContain("22.77");
  });

  it("leaves left-to-right languages untouched", () => {
    expect(formatCurrencyValue("en", 22.77, "USD", 2)).toBe("$22.77");
    expect(getCurrencySymbol("USD", "en")).toBe("$");
    expect(getLimitCurrencySymbol("es", "USD")).toBe("US$");
    expect(formatCurrencyValue("es", 22.77, "USD", 2)).not.toContain(
      FIRST_STRONG_ISOLATE,
    );
  });
});
