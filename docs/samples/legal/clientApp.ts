/**
 * The OAuth app the legal-practice samples sign clients in with: registered
 * once, in "Who is signed in", and used by every later screen that shows a
 * client their own view.
 *
 * None of this is secret. A client id is public by design -- a PKCE app has no
 * secret at all -- and the redirect URI is this Storybook's own page. The id is
 * kept in this browser only because it belongs to the reader's portal, not to
 * the repository.
 */
const CLIENT_ID_KEY = "legal-samples-oauth-client-id";

/** What a client cabinet reads and writes, and nothing more. */
export const CLIENT_SCOPES = [
  "openid",
  "accounts.self:read",
  "rooms:read",
  "files:read",
  "files:write",
];

export const readClientId = () => {
  try {
    return localStorage.getItem(CLIENT_ID_KEY) ?? "";
  } catch {
    return "";
  }
};

export const writeClientId = (value: string) => {
  try {
    localStorage.setItem(CLIENT_ID_KEY, value);
  } catch {
    // A private window: the id simply is not remembered.
  }
};

/** The callback page next to the preview, so it is right under a path prefix too. */
export const callbackUrl = () =>
  new URL("oauth-callback.html", document.baseURI).toString();
