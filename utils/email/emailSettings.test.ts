import { describe, it, expect } from "vitest";

import { EmailSettings } from "./emailSettings";

describe("EmailSettings", () => {
  it("disables all settings via helper", () => {
    const settings = new EmailSettings();
    settings.disableAllSettings();

    expect(settings.toObject()).toEqual({
      allowDomainPunycode: true,
      allowLocalPartPunycode: true,
      allowDomainIp: true,
      allowStrictLocalPart: false,
      allowSpaces: true,
      allowName: true,
      allowLocalDomainName: true,
    });
  });

  it("throws TypeError on non-boolean setter input", () => {
    const settings = new EmailSettings();
    const invalidValue = "yes";
    const setters = [
      "allowDomainPunycode",
      "allowLocalPartPunycode",
      "allowDomainIp",
      "allowStrictLocalPart",
      "allowSpaces",
      "allowName",
      "allowLocalDomainName",
    ] as const;

    setters.forEach((setter) => {
      expect(() => Reflect.set(settings as object, setter, invalidValue)).toThrow(TypeError);
    });
  });

  it("parses plain object into settings instance", () => {
    const parsed = EmailSettings.parse({ allowSpaces: true, allowName: true });

    expect(parsed).toBeInstanceOf(EmailSettings);
    expect(parsed.allowSpaces).toBe(true);
    expect(parsed.allowName).toBe(true);
    expect(parsed.allowStrictLocalPart).toBe(true);
  });

  it("returns same instance when parse receives EmailSettings", () => {
    const instance = new EmailSettings();
    const result = EmailSettings.parse(instance as unknown as Record<string, boolean>);

    expect(result).toBe(instance);
  });

  it("throws on invalid parse argument type", () => {
    expect(() => EmailSettings.parse(null as unknown as Record<string, boolean>)).toThrow(TypeError);
  });

  it("compares settings objects with equals", () => {
    const settings1 = { allowSpaces: true, allowName: true };
    const settings2 = EmailSettings.parse(settings1).toObject() as Record<string, boolean>;

    expect(EmailSettings.equals(settings1, settings2)).toBe(true);

    const settings3 = { allowSpaces: false };
    expect(EmailSettings.equals(settings1, settings3)).toBe(false);
  });

  it("ignores unknown properties when parsing", () => {
    const parsed = EmailSettings.parse({ allowSpaces: true, unknownFlag: true });

    expect(parsed.allowSpaces).toBe(true);
    expect((parsed as unknown as Record<string, unknown>).unknownFlag).toBeUndefined();
  });
});
