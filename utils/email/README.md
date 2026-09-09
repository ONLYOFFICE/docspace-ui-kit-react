# email

Email address parsing and validation, built on [email-addresses](https://www.npmjs.com/package/email-addresses) with configurable strictness.

## What It Does

- `parseAddress(str, options?)` — parses a single email address string into an `Email` instance
- `parseAddresses(str, options?)` — splits a comma/semicolon-separated string and parses each address
- `isValidDomainName(domain, options?)` — checks whether a domain is valid under the given settings
- `isEqualEmail(email1, email2)` — compares two address strings for equality (ignoring display name formatting)
- `getParts(str)` — splits a raw string into individual address parts, respecting quoted sections
- `Email` — result class: `.email`, `.name`, `.parseErrors`, `.isValid()`, `.equals(other)`
- `EmailSettings` — validation options class (see below)

## Import

```ts
import { parseAddress, parseAddresses, isValidDomainName, Email, EmailSettings } from "../../utils/email";
```

## Usage

```ts
const result = parseAddress("Jane Doe <jane@example.com>");
result.isValid(); // => true
result.email;     // => "jane@example.com"

const settings = new EmailSettings();
settings.allowLocalDomainName = true;
parseAddress("user@localhost", settings).isValid(); // => true
```

### `EmailSettings` options

All default to `false` except `allowStrictLocalPart` (`true`):

| Option | Description |
|--------|-------------|
| `allowDomainPunycode` | Allow `xn--` punycode domains |
| `allowLocalPartPunycode` | Allow `xn--` punycode in the local part |
| `allowDomainIp` | Allow `[IP]`-style domains |
| `allowStrictLocalPart` | Enforce the strict local-part character set |
| `allowSpaces` | Allow spaces in the local part |
| `allowName` | Allow a display name (`"Name" <addr>`) |
| `allowLocalDomainName` | Allow domains without a `.` (e.g. `localhost`) |

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | Barrel re-exporting `email.ts` and `emailSettings.ts` |
| `email.ts` | `parseAddress`, `parseAddresses`, `isValidDomainName`, `isEqualEmail`, `Email` |
| `emailSettings.ts` | `EmailSettings` options class |
| `email.test.ts`, `emailSettings.test.ts` | Unit tests (Vitest) |
