import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { version } from "../../package.json";

describe("WelcomePage", () => {
  it("states the version package.json carries", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "WelcomePage.tsx"),
      "utf8",
    );
    expect(source).toContain(`Version ${version} `);
    expect(source).toContain(`{ label: "Version", value: "${version}" }`);
  });
});
