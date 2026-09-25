/**
 * PKCE (RFC 7636) for a public OAuth client: the proof that the code coming
 * back is being redeemed by the page that asked for it.
 *
 * The portal takes it on an OAuth app with "Allow public client (PKCE)" ticked:
 * the token request then carries `code_verifier` instead of a client secret,
 * which is the only way a browser application can sign a user in -- a secret
 * shipped in a bundle is not a secret.
 *
 * Web Crypto, not a library: `crypto.getRandomValues` and `crypto.subtle` are
 * in every browser this kit supports and in Node, so this needs no dependency.
 * The challenge is base64url without padding, which is what S256 specifies --
 * the portal's own docs show a crypto-js snippet producing plain base64, but
 * their example value is base64url, and base64url is what the standard asks.
 */
const base64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const randomToken = (byteLength: number) => {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
};

/** The S256 challenge for a verifier. */
export const challengeFor = async (verifier: string) => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return base64Url(new Uint8Array(digest));
};

export type PkcePair = { verifier: string; challenge: string };

/** 32 random bytes give a 43-character verifier, the shortest RFC 7636 allows. */
export const createPkcePair = async (): Promise<PkcePair> => {
  const verifier = randomToken(32);
  return { verifier, challenge: await challengeFor(verifier) };
};

/** The `state` parameter: a nonce that ties the answer to this request. */
export const createState = () => randomToken(24);
