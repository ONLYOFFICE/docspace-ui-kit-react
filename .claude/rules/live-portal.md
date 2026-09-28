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

So "point this at my portal" is filling `.env` or adding a provider in the toolbar. Nothing in
`docs/samples/` should re-implement that.

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

- **The portal's session**, when the application is served from the portal's own origin and the
  browser sends the cookie. Nothing to configure, nothing that works in Storybook.
- **OAuth.** `utils/get-oauth-token` polls `localStorage.code` while a popup completes the flow;
  it assumes an OAuth client registered on the portal with a redirect URI pointing back at the
  application. The helper is the small half of that work.

## Traps

- **CORS, not 401.** A portal that does not allow the Storybook origin fails the request at the
  browser, so the error carries no status and reads as a network failure. Check the portal's
  CORS settings before debugging the token.
- **Never commit a URL or a key.** They belong in `.env`, in the toolbar's `localStorage`, or in
  the reader's own head — a sample that ships a working key ships an open portal.
- **Anything committed here has to render with no portal at all.** CI, the static build and a
  reader who has never seen a DocSpace all run these pages. A screen that talks to a portal
  carries demo data behind the same shape and an explicit "not connected" state; a screen that
  throws or hangs on a missing portal is a broken page, not a strict one.
