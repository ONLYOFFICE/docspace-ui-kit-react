# cookie

Browser cookie helpers with special-cased handling for the `asc_language` cookie during invite-link confirmation.

## What It Does

- `getCookie(name)` — reads a cookie value; for the language cookie on `/confirm/LinkInvite`, reads the `culture` query param instead
- `setCookie(name, value, options?, disableEncoding?)` — writes a cookie, supports `expires` as a `Date` and any other `document.cookie` option
- `deleteCookie(name)` — expires a cookie immediately (`max-age: -1`)

## Import

```ts
import { getCookie, setCookie, deleteCookie } from "../../utils/cookie";
```

## Usage

```ts
setCookie("theme", "dark", { expires: new Date(Date.now() + 86400_000) });
getCookie("theme"); // => "dark"
deleteCookie("theme");
```

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | `getCookie`, `setCookie`, `deleteCookie` |
| `cookie.test.ts` | Unit tests (Vitest) |
