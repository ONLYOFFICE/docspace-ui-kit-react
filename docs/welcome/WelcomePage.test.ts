import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { license, version } from "../../package.json";

const root = path.join(__dirname, "..", "..");

// Pages that state the package version. They read it from package.json or
// say `<version>`, so a release bumps package.json alone. The licence on
// the Welcome page comes from package.json the same way.
const pages = [
  "docs/welcome/WelcomePage.tsx",
  "docs/Welcome.mdx",
  "docs/getting-started.md",
  "README.md",
];

describe("WelcomePage", () => {
  it("reads the version and licence from package.json", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "WelcomePage.tsx"),
      "utf8",
    );
    expect(source).toContain(
      'import { license, version } from "../../package.json";',
    );
    expect(source).toContain("Version {version} &bull; {license} &bull;");
    expect(source).toContain('{ label: "Version", value: version }');
    expect(source).toContain('{ label: "Licence", value: license }');
  });

  it.each(pages)("%s hardcodes no package version or licence", (page) => {
    const source = fs.readFileSync(path.join(root, page), "utf8");
    expect(source).not.toMatch(/onlyoffice-apps-ui-kit-\d/);
    expect(source).not.toContain(`Version ${version}`);
    expect(source).not.toContain(`\`@onlyoffice/apps-ui-kit\` ${version}`);
    expect(source).not.toContain(`&bull; ${license} &bull;`);
    expect(source).not.toContain(`— ${license}.`);
  });
});
