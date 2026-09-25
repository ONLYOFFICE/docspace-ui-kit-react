import { useCallback, useEffect, useRef, useState } from "react";

import { createPkcePair, createState } from "./pkce";

/**
 * "Sign in with ONLYOFFICE" for a client who should see only their own matters.
 *
 * The flow, as the portal documents it for a public client with PKCE:
 *
 *   1. open a popup at the portal's authorize endpoint, carrying the app's
 *      client id, the redirect URI registered for it, the scopes, a `state`
 *      nonce and the S256 `code_challenge`;
 *   2. the client signs in on the portal and allows the app;
 *   3. the portal sends the popup to the redirect URI with `?code&state`;
 *      that page (`.storybook/public/oauth-callback.html` here) posts
 *      both back to this window and closes;
 *   4. this window checks `state`, then trades the code and the
 *      `code_verifier` for an access token at the token endpoint.
 *
 * The token goes to `ApiProvider` as `apiKey`, which sends it as `Bearer`, and
 * everything below it runs as the client. It stays in memory: storage that
 * survives a reload is storage any script on the page can read.
 *
 * Four details that decide whether it works at all:
 *
 *   - the popup is opened synchronously in the click, before any `await`,
 *     and pointed at the portal afterwards. Opening it after hashing the
 *     verifier loses the click and the browser blocks it;
 *   - the answer comes by `postMessage`, accepted only from this origin and
 *     only with the `state` this request made. The kit's `getOAuthToken`
 *     polls `localStorage` instead and checks no `state`;
 *   - the endpoints come from the portal's discovery document, which, like
 *     the token endpoint, answers any origin;
 *   - `scope` is the last parameter of the authorize URL, or the portal's
 *     consent page drops `state` and the challenge -- see `authorizeUrl`.
 */
export type OAuthStatus =
  "idle" | "waiting" | "exchanging" | "signed-in" | "error";

export type OAuthSignIn = {
  status: OAuthStatus;
  token: string;
  error: string;
  signIn: () => void;
  signOut: () => void;
};

type Endpoints = { authorize: string; token: string };

const CALLBACK_SOURCE = "docspace-oauth-callback";

/**
 * The authorize URL, with `scope` deliberately last.
 *
 * The order matters on a real portal. Its consent page keeps the authorize URL
 * in a cookie, and when it has to send the browser round once more -- the
 * first time a person consents, before their signature cookie exists -- it
 * rebuilds the URL as everything before `&scope=` plus the scopes it
 * understood. Whatever came after `scope` is gone: with `state` there, the
 * code comes back without it; with `code_challenge` there, the exchange has
 * nothing to check the verifier against.
 */
export const authorizeUrl = (
  endpoint: string,
  params: {
    clientId: string;
    redirectUri: string;
    state: string;
    codeChallenge: string;
    scopes: string[];
  },
) => {
  const url = new URL(endpoint);
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    state: params.state,
    code_challenge_method: "S256",
    code_challenge: params.codeChallenge,
    scope: params.scopes.join(" "),
  }).toString();
  return url.toString();
};

const discover = async (portalUrl: string): Promise<Endpoints> => {
  const fallback = {
    authorize: new URL("/oauth2/authorize", portalUrl).toString(),
    token: new URL("/oauth2/token", portalUrl).toString(),
  };

  try {
    const response = await fetch(
      new URL("/.well-known/openid-configuration", portalUrl),
    );
    if (!response.ok) return fallback;
    const config = await response.json();
    return {
      authorize: config.authorization_endpoint ?? fallback.authorize,
      token: config.token_endpoint ?? fallback.token,
    };
  } catch {
    return fallback;
  }
};

export const useOAuthSignIn = ({
  portalUrl,
  clientId,
  redirectUri,
  scopes,
}: {
  portalUrl: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
}): OAuthSignIn => {
  const [status, setStatus] = useState<OAuthStatus>("idle");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  // Everything the answer has to be checked against lives here, and only here.
  const pending = useRef<{
    state: string;
    verifier: string;
    endpoints: Endpoints;
    popup: Window | null;
  } | null>(null);

  const fail = useCallback((message: string) => {
    pending.current?.popup?.close();
    pending.current = null;
    setError(message);
    setStatus("error");
  }, []);

  useEffect(() => {
    const onMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.source !== CALLBACK_SOURCE) return;

      const request = pending.current;
      if (!request) return;

      const {
        code,
        state,
        error: denied,
      } = event.data as {
        code?: string;
        state?: string;
        error?: string;
      };

      if (denied) return fail(`The portal answered "${denied}".`);
      if (!code) return fail("The portal sent no authorization code back.");
      if (!state) {
        return fail(
          "The code came back without the state this request sent, so it was ignored.",
        );
      }
      if (state !== request.state) {
        return fail(
          "The code came back for a different request, so it was ignored.",
        );
      }

      pending.current = null;
      setStatus("exchanging");

      try {
        const response = await fetch(request.endpoints.token, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            code_verifier: request.verifier,
          }),
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok || !payload.access_token) {
          return fail(
            payload.error_description ??
              payload.error ??
              `The token endpoint answered ${response.status}.`,
          );
        }

        setToken(payload.access_token);
        setStatus("signed-in");
      } catch (exception) {
        fail((exception as Error).message ?? "The token request failed.");
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [clientId, redirectUri, fail]);

  // A popup the user closes answers nothing; notice, and stop waiting.
  useEffect(() => {
    if (status !== "waiting") return;

    const timer = window.setInterval(() => {
      if (pending.current?.popup?.closed) {
        pending.current = null;
        setStatus("idle");
      }
    }, 500);

    return () => window.clearInterval(timer);
  }, [status]);

  const signIn = useCallback(() => {
    if (!portalUrl || !clientId) return;

    // Synchronously, inside the click -- see the note above.
    const popup = window.open(
      "",
      "docspace-oauth",
      "popup,width=520,height=720",
    );

    if (!popup) {
      fail(
        "The browser blocked the sign-in window. Allow pop-ups for this page.",
      );
      return;
    }

    setError("");
    setStatus("waiting");

    (async () => {
      const [endpoints, pkce] = await Promise.all([
        discover(portalUrl),
        createPkcePair(),
      ]);
      const state = createState();

      pending.current = { state, verifier: pkce.verifier, endpoints, popup };

      popup.location.href = authorizeUrl(endpoints.authorize, {
        clientId,
        redirectUri,
        state,
        codeChallenge: pkce.challenge,
        scopes,
      });
    })().catch((exception) => fail((exception as Error).message));
  }, [portalUrl, clientId, redirectUri, scopes, fail]);

  const signOut = useCallback(() => {
    pending.current = null;
    setToken("");
    setError("");
    setStatus("idle");
  }, []);

  return { status, token, error, signIn, signOut };
};
