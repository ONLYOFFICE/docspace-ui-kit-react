import { afterEach, describe, expect, it } from "vitest";

import { setBrandLookup } from "../../constants/brands";
import { parseLocaleConstants } from "../../utils/parse-locale-constants";
import brandsData from "../../test/fixtures/brands.json";

import { systemServerLabel } from "./MCPServers.utils";

const brands = (values: Record<string, string>) =>
  setBrandLookup((key) => values[key] ?? key);

describe("systemServerLabel", () => {
  // Put back the lookup test/setup.ts registers.
  afterEach(() => {
    setBrandLookup(
      parseLocaleConstants(brandsData as Record<string, string>).get,
    );
  });

  it("names organisation and product when they differ", () => {
    brands({ OrganizationName: "ONLYOFFICE", ProductName: "DocSpace" });
    expect(systemServerLabel()).toBe("ONLYOFFICE DocSpace");
  });

  it("does not repeat a brand the product name already carries", () => {
    brands({ OrganizationName: "ONLYOFFICE", ProductName: "ONLYOFFICE" });
    expect(systemServerLabel()).toBe("ONLYOFFICE");

    brands({ OrganizationName: "ONLYOFFICE", ProductName: "ONLYOFFICE Apps" });
    expect(systemServerLabel()).toBe("ONLYOFFICE Apps");
  });

  it("matches whole words only", () => {
    brands({ OrganizationName: "Acme", ProductName: "Acmeware" });
    expect(systemServerLabel()).toBe("Acme Acmeware");

    brands({ OrganizationName: "Acme Corp", ProductName: "Acme Corp Files" });
    expect(systemServerLabel()).toBe("Acme Corp Files");
  });

  it("falls back to whichever name is set", () => {
    brands({ OrganizationName: "", ProductName: "Files" });
    expect(systemServerLabel()).toBe("Files");

    brands({ OrganizationName: "Acme", ProductName: "" });
    expect(systemServerLabel()).toBe("Acme");
  });
});
