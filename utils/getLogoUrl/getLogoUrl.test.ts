import { describe, it, expect, vi, afterEach } from "vitest";
import { getLogoUrl } from "./index";
import { WhiteLabelLogoType } from "../../enums";

describe("getLogoUrl", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return correct URL with default parameters", () => {
    const url = getLogoUrl(WhiteLabelLogoType.LightSmall);
    expect(url).toBe("/logo.ashx?logotype=1&dark=false&default=false");
  });

  it("should return correct URL with dark parameter", () => {
    const url = getLogoUrl(WhiteLabelLogoType.LoginPage, true);
    expect(url).toBe("/logo.ashx?logotype=2&dark=true&default=false");
  });

  it("should return correct URL with default flag", () => {
    const url = getLogoUrl(WhiteLabelLogoType.Favicon, false, true);
    expect(url).toBe("/logo.ashx?logotype=3&dark=false&default=true");
  });

  it("should return correct URL with culture", () => {
    const url = getLogoUrl(
      WhiteLabelLogoType.DocsEditor,
      false,
      false,
      "en-US",
    );
    expect(url).toBe(
      "/logo.ashx?logotype=4&dark=false&default=false&culture=en-US",
    );
  });

  it("should return correct URL with update flag and no timestamp in sessionStorage", () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockReturnValue(null);
    const url = getLogoUrl(
      WhiteLabelLogoType.LeftMenu,
      false,
      false,
      undefined,
      true,
    );
    expect(url).toBe("/logo.ashx?logotype=6&dark=false&default=false");
    expect(getItemSpy).toHaveBeenCalledWith("logoUpdateTimestamp");
  });

  it("should return correct URL with update flag and timestamp in sessionStorage", () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockReturnValue("123456789");
    const url = getLogoUrl(
      WhiteLabelLogoType.AboutPage,
      false,
      false,
      undefined,
      true,
    );
    expect(url).toBe(
      "/logo.ashx?logotype=7&dark=false&default=false&t=123456789",
    );
    expect(getItemSpy).toHaveBeenCalledWith("logoUpdateTimestamp");
  });
});
