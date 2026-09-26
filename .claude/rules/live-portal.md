---
paths:
  - "providers/api/**"
  - "api/**"
  - "selectors/**"
  - "uploader/**"
  - "document-editor/**"
  - "billing/**"
  - "ai-agent/**"
  - ".storybook/decorators/**"
  - ".storybook/globals/**"
  - "docs/samples/**"
---

# Talking to a real DocSpace portal

The plumbing already exists — do not build a second one. `providers/api/ApiProvider` creates the
typed clients once and hands them out through `useApi()`:

`profilesApi`, `commonSettingsApi`, `foldersApi`, `roomsApi`, `filesApi`, `filesSettingsApi`,
`operationsApi`, `groupApi`, `peopleSearchApi`, `groupSearchApi`, `thirdPartyApi`, `paymentApi`,
`portalQuotaApi`, `aiApi`, plus `apiClient` / `rawApiClient` (axios) and `baseUrl`.

Every one of them answers in the portal's envelope, so the payload is two levels down:

```ts
const { profilesApi } = useApi();
const me = (await profilesApi.getSelfProfile()).data.response; // EmployeeFullDto
```

`docs/API.mdx` is the reference page for this; keep the two in step when the surface changes.

## Storybook is already connected

`.storybook/decorators/withApiProvider.tsx` wraps **every** story in `ApiProvider`. It reads
`VITE_PROVIDER_API_URL` / `VITE_PROVIDER_API_KEY` from `.env` (gitignored; `.env.example` shows
the shape, and the `VITE_` prefix is what exposes them to the browser), and the `apiConfig`
toolbar global switches between portals saved in `localStorage` by
`.storybook/utils/apiProviders.ts`. Two deliberate settings there:

- `initSocket={false}` — the socket would otherwise connect to the portal from every story.
- `useBearerForRawClient` — the raw client sends `Bearer <key>`, which is what an API key needs
  and what the portal's own cookie session does not.

So "point this at my portal" is adding a provider in the toolbar — the only way on the published
static Storybook — or, locally, filling `.env`, which production builds deliberately ignore (see
the traps below). Nothing in `docs/samples/` should re-implement that.

## Which modules need the provider

`selectors/Files`, `selectors/People`, `selectors/Room`, `selectors/Groups`, `uploader` and the
billing flows all call `useApi()` themselves. **They need no MobX for that path** — the stores
`CLAUDE.md` mentions are the portal's own, and the data these fetch comes through the hooks.
`document-editor` needs `filesSettingsApi.getDocServiceUrl()` plus a file id and config.

Rendering one of them without a provider throws `useApi must be used within an ApiProvider`,
which in a story shows as an error boundary, not as an empty screen.

## Whose identity the call runs as

An API key is one identity — the key's owner. It is right for an admin or back-office screen and
wrong for anything that claims to be "the client's own view": filtering rooms by a client's name
is a demonstration, not an authorisation, and the text next to it must say so.

The two honest alternatives:

- **The portal's session**, when the application is served from the portal's own origin. This
  is what the DocSpace client itself does: `packages/client/src/App.js` mounts this package's
  `ApiProvider` with `apiKey={getCookie("asc_auth_key")}` and `url` built from
  `ClientConfig.api.origin || location.origin` plus `ClientConfig.proxy.url`. The session
  token is the key. Nothing to configure there, and nothing that works in Storybook.
- **OAuth**, the only route that lets a client use an application hosted elsewhere as
  themselves. `docs/samples/legal/useOAuthSignIn.ts` is the working form. What it rests on, all
  checked against a live portal:
  - the app is created under Developer Tools → OAuth with **Allow public client (PKCE)**.
    Without it the token endpoint wants `client_secret_post`, and a secret in a browser bundle is
    not one; with it the exchange sends `code_verifier` instead;
  - endpoints come from `/.well-known/openid-configuration` (`/oauth2/authorize`,
    `/oauth2/token`); discovery and the token endpoint both answer any origin, so a static page
    needs no server;
  - authorize takes `response_type=code`, `client_id`, `redirect_uri`, space-separated `scope`,
    `state`, `code_challenge_method=S256`, `code_challenge` — base64url, whatever the portal
    docs' crypto-js snippet implies; `pkce.test.ts` pins it to RFC 7636's own example;
  - the scopes a client cabinet needs: `openid accounts.self:read rooms:read files:read
files:write`;
  - **`scope` goes last** in the authorize URL. On a person's first consent the login app's
    consent page (`packages/login` in DocSpace-client, `getRedirectURL`) re-sends the browser
    to authorize with a URL rebuilt as everything before `&scope=` plus the scopes, so any
    parameter after `scope` — `state`, `code_challenge` — is silently dropped. The symptom is a
    code arriving without `state`, once per person, never on the second try.
    `authorizeUrl` in `useOAuthSignIn.ts` fixes the order and its test pins it;
  - the token goes to a nested `ApiProvider` as `apiKey`; it stays in memory.

  The app itself can be registered with the API key, but not from a browser:
  `GET /api/2.0/security/oauth2/token` (key) returns a five-minute JWT, and
  `POST /api/2.0/oauth2/clients` — the path the client uses; the docs' `/api/2.0/clients`
  answers too — takes it in `x-signature`. The identity service behind the second refuses every
  CORS preflight, 403 even for the portal's own origin, so it is reachable only server-side:
  `.storybook/oauth-app-proxy.ts` does it for `storybook dev`, and a static build links to the
  portal's form (`/developer-tools/oauth/create`; an app's page is `/developer-tools/oauth/:id`)
  instead. The portal's form also demands an icon, a website, terms and privacy URLs and an
  allowed origin, and so does the API behind it, whatever its reference page implies.

  The registry validates them (`CreateClientRequest` in `server/common/ASC.Identity/registration`
  of the DocSpace repository). `website_url`,
  `terms_url`, `policy_url` and `logout_redirect_uri` must match a pattern that wants a dotted
  host or an IPv4 address, so **`localhost` gets 400** — while `redirect_uris` and
  `allowed_origins` are checked as plain URLs and accept it. The logo is a base64 `data:` URI
  (png, jpeg or svg+xml) of at most 256 000 decoded bytes; the name is 3–256 characters, the
  description at most 255. A refusal is an RFC 9457 problem whose `detail` is only "Validation
  failed"; what to change is in `errors[]` as `{ field, code, message }`, so surface that, not the
  status.

  `utils/get-oauth-token` is the older half of this: it polls `localStorage.code` and checks no
  `state`, so the sample answers by `postMessage` from its own origin instead.

## Traps

- **CORS, not 401.** A portal that does not allow the Storybook origin fails the request at the
  browser, so the error carries no status and reads as a network failure. Check the portal's
  CORS settings before debugging the token.
- **Pictures from the portal are relative _and_ protected.** Avatars
  (`/storage/userPhotos/...`), room logos and thumbnails are paths on the portal that answer
  **403** without a signed-in request. The client renders them raw and gets away with it only
  because it is same-origin, so the browser sends the session cookie. Elsewhere, resolving the
  path against `baseUrl` fixes the host and nothing else — an `<img>` cannot carry a header. Fetch
  it through `useApi().apiClient.instance` with `responseType: "blob"` and hand `<img>` an object
  URL: `docs/samples/legal/usePortalImage.ts` does exactly that. Send the key only to the
  portal's own origin, revoke the object URL on change, fall back to `""` so `Avatar` draws
  initials. Resolve with `new URL(path, baseUrl)`, not `combineUrl`, which prefixes the host even
  to a URL that already has one.
- **CORS is permissive, credentials are not.** The portal answers `/api/2.0` and `/storage`
  with `Access-Control-Allow-Origin: *` and echoes the requested headers (checked against a
  live portal, preflight and actual response). That is why the key must travel as a header and
  the request must not set `withCredentials`: a wildcard origin refuses cookies.
- **A static build inlines `VITE_*`.** `import.meta.env.VITE_PROVIDER_API_KEY` is baked into
  `assets/iframe-*.js` by `storybook build` — verified with a canary key. `.storybook/main.ts`
  blanks both provider variables when `configType === "PRODUCTION"`, so the published
  Storybook starts in demo mode and readers connect from the toolbar. Do not remove that guard,
  and do not add a new `VITE_*` secret without the same treatment.
- **A popup must open inside the click.** Any `await` before `window.open` — hashing a PKCE
  verifier is enough — loses the user gesture and the browser blocks it. Open a blank popup
  synchronously, navigate it once the challenge is ready.
- **The OAuth callback is a plain `.html` in `.storybook/public/`**, served at the root by
  `staticDirs`. Storybook's dev server serves a static file only by its full path — a directory
  index 404s — and `serve` redirects `*.html` to a clean URL, dropping the query and the `code`
  with it. `.storybook/public/serve.json` sets `"cleanUrls": false`, which also keeps
  `iframe.html?id=…` deep links alive under `pnpm storybook-serve`. `serve` validates that file
  strictly: an unknown key such as `$comment` makes it refuse to start.
- **Rooms: what the SDK types say and what arrives differ.** `updated` (and `created`) is typed
  `ApiDateTime` with `utcTime`, and comes over the wire as a plain ISO string — accept both, as
  `docs/samples/legal/matter.ts` does. A room's `logo` is either a `cover` with inline SVG
  `data`, which `RoomIcon` recolours, or a protected `/storage/...` picture for
  `usePortalImage`; with neither, pass `RoomIcon` `showDefault`, or it draws an empty `<img>`
  instead of the initials. The SDK's `Logo` is not the kit's `TLogo` (`cover.data` may be
  `null`), so build one. A room's page is `/rooms/shared/<id>/filter?folder=<id>`, for a guest
  too, and the same shape opens a folder inside a room.
- **A folder's contents come one folder per call.** `foldersApi.getFolderByFolderId({ folderId })`
  answers `{ folders, files, total }` for that folder only, both arrays typed as
  `FileEntryBaseDto` though the wire carries full folder and file DTOs (`filesCount`, `created`,
  `pureContentLength`, `webUrl`, a relative path). Walking a room is therefore one call per level;
  `docs/samples/legal/matterRoom.ts` does it with the "read one folder" step injected, and skips
  folders whose `filesCount` is 0. Creating a folder is `createFolder({ folderId, createFolder: { title } })`.
- **Never commit a URL or a key.** They belong in `.env`, in the toolbar's `localStorage`, or in
  the reader's own head — a sample that ships a working key ships an open portal.
- **Anything committed here has to render with no portal at all.** CI, the static build and a
  reader who has never seen a DocSpace all run these pages. A screen that talks to a portal
  carries demo data behind the same shape and an explicit "not connected" state; a screen that
  throws or hangs on a missing portal is a broken page, not a strict one.
