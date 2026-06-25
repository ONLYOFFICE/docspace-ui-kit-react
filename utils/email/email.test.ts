import { describe, it, expect } from "vitest";

import {
  Email,
  EmailSettings,
  getParts,
  isEqualEmail,
  isValidDomainName,
  parseAddress,
  parseAddresses,
} from ".";

const createSettingsWithNameAllowed = () => {
  const settings = new EmailSettings();
  settings.allowName = true;
  return settings;
};

describe("email utils", () => {
  it("returns error when no email parsed", () => {
    const parsed = parseAddress("");

    expect(parsed).toBeInstanceOf(Email);
    expect(parsed.parseErrors?.[0]?.errorKey).toBe("EmptyEmail");
    expect(parsed.parseErrors?.[0]?.type).toBe(1); // ParseErrorTypes.EmptyRecipients
    expect(parsed.isValid()).toBe(false);
  });

  it("returns error when more than one email provided", () => {
    const parsed = parseAddress("a@b.com, c@d.com");

    expect(parsed.parseErrors?.[0]?.errorKey).toBe("ManyEmails");
    expect(parsed.parseErrors?.[0]?.type).toBe(2); // ParseErrorTypes.IncorrectEmail
  });

  it("parses single email with name when allowed", () => {
    const parsed = parseAddress(
      '"John Doe" <john@doe.com>',
      createSettingsWithNameAllowed(),
    );

    expect(parsed.name).toBe("John Doe");
    expect(parsed.email).toBe("john@doe.com");
    expect(parsed.isValid()).toBe(true);
  });

  it("throws on invalid options for parseAddresses", () => {
    expect(() => parseAddresses("test@foo.bar", {})).toThrow(TypeError);
  });

  it("splits parts respecting quoted commas", () => {
    const parts = getParts('"A, B" <a@b.com>, c@d.com;');

    expect(parts).toEqual(['"A, B" <a@b.com>', "c@d.com"]);
  });

  it("validates domain names", () => {
    expect(isValidDomainName("example.com")).toBe(true);
    expect(isValidDomainName("localhost")).toBe(false);
    expect(isValidDomainName("xn--punycode")).toBe(false);
  });

  it("compares emails ignoring name when both valid", () => {
    expect(isEqualEmail('"John" <a@b.com>', "a@b.com")).toBe(true);
    expect(isEqualEmail("invalid", "a@b.com")).toBe(false);
  });

  it("compares Email instances", () => {
    const email1 = parseAddress("a@b.com");
    const normalizedErrors = email1.parseErrors?.map((err) => ({
      ...err,
      message: err.message ?? "",
    }));
    const email2 = new Email(email1.name, email1.email, normalizedErrors);

    expect(email1.equals(email2)).toBe(true);
    expect(email1.equals({ email: "a@b.com" })).toBe(false);
  });

  it("returns original string when getParts finds no separators", () => {
    expect(getParts("single")).toEqual(["single"]);
  });

  it("adds error for domain as ip when not allowed", () => {
    const parsed = parseAddress("user@[127.0.0.1]");

    expect(
      parsed.parseErrors?.some((e) => e.errorKey === "DomainIpAddress"),
    ).toBe(true);
  });

  it("adds error for punycode local part when not allowed", () => {
    const parsed = parseAddress("xn--local@test.com");

    expect(
      parsed.parseErrors?.some((e) => e.errorKey === "PunycodeLocalPart"),
    ).toBe(true);
  });

  it("adds error for non-ascii local part when strict localpart is enabled", () => {
    const parsed = parseAddress("iñvalid@test.com");

    expect(
      parsed.parseErrors?.some((e) => e.errorKey === "IncorrectLocalPart"),
    ).toBe(true);
  });

  it("adds error when local part contains spaces", () => {
    const parsed = parseAddress('"a b"@test.com');

    expect(
      parsed.parseErrors?.some((e) => e.errorKey === "SpacesInLocalPart"),
    ).toBe(true);
  });

  it("adds error when local part exceeds 64 characters", () => {
    const longLocal = "a".repeat(65);
    const parsed = parseAddress(`${longLocal}@test.com`);

    expect(
      parsed.parseErrors?.some((e) => e.errorKey === "MaxLengthExceeded"),
    ).toBe(true);
  });
});
