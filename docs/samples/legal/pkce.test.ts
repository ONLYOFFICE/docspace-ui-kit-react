import { describe, it, expect } from "vitest";

import { challengeFor, createPkcePair, createState } from "./pkce";

describe("pkce", () => {
  it("derives the S256 challenge from RFC 7636 appendix B", async () => {
    // The worked example in the specification itself.
    await expect(
      challengeFor("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"),
    ).resolves.toBe("E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
  });

  it("makes a verifier within the RFC's 43-128 characters, url-safe", async () => {
    const { verifier, challenge } = await createPkcePair();

    expect(verifier.length).toBeGreaterThanOrEqual(43);
    expect(verifier.length).toBeLessThanOrEqual(128);
    expect(verifier).toMatch(/^[A-Za-z0-9\-_]+$/);
    expect(challenge).toBe(await challengeFor(verifier));
  });

  it("never repeats a verifier or a state", async () => {
    const [a, b] = await Promise.all([createPkcePair(), createPkcePair()]);

    expect(a.verifier).not.toBe(b.verifier);
    expect(createState()).not.toBe(createState());
  });
});
