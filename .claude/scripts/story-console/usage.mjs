// Prints a script's usage: the `//` comment block it opens with, which already
// lists its flags with examples. Kept in the file rather than duplicated here,
// so the two cannot drift apart.

import fs from "node:fs";
import { fileURLToPath } from "node:url";

export const printUsage = (moduleUrl) => {
  const lines = fs.readFileSync(fileURLToPath(moduleUrl), "utf8").split("\n");
  const header = [];
  for (const line of lines) {
    if (!line.startsWith("//")) break;
    header.push(line.replace(/^\/\/ ?/, ""));
  }
  console.log(header.join("\n"));
};
