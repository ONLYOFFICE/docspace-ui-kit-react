import { describe, expect, it } from "vitest";

import { authorizeUrl } from "./useOAuthSignIn";

const params = {
  clientId: "client-1",
  redirectUri: "http://localhost:6006/oauth-callback.html",
  state: "state-1",
  codeChallenge: "challenge-1",
  scopes: ["openid", "accounts.self:read", "files:read"],
};

describe("authorizeUrl", () => {
  it("carries everything the portal's authorize endpoint takes", () => {
    const url = new URL(
      authorizeUrl("https://portal.example.com/oauth2/authorize", params),
    );

    expect(url.origin + url.pathname).toBe(
      "https://portal.example.com/oauth2/authorize",
    );
    expect(Object.fromEntries(url.searchParams)).toEqual({
      response_type: "code",
      client_id: "client-1",
      redirect_uri: "http://localhost:6006/oauth-callback.html",
      state: "state-1",
      code_challenge_method: "S256",
      code_challenge: "challenge-1",
      scope: "openid accounts.self:read files:read",
    });
  });

  // The portal's consent page rebuilds the URL as everything before
  // `&scope=` plus the scopes; this is that rebuild.
  it("survives the consent page cutting the URL at &scope=", () => {
    const original = authorizeUrl(
      "https://portal.example.com/oauth2/authorize",
      params,
    );
    const [kept] = original.split("&scope=");
    const rebuilt = new URL(`${kept}&scope=openid%20files:read`);

    expect(rebuilt.searchParams.get("state")).toBe("state-1");
    expect(rebuilt.searchParams.get("code_challenge")).toBe("challenge-1");
    expect(rebuilt.searchParams.get("code_challenge_method")).toBe("S256");
  });
});
