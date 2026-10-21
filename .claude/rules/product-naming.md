---
paths:
  - "**/*.md"
  - "**/*.mdx"
  - "**/*.stories.tsx"
  - "**/*.tsx"
  - "**/*.types.ts"
  - "package.json"
  - "scripts/lib/readme-tables.mjs"
---

# Product naming: DocSpace is now ONLYOFFICE Apps

The product formerly called DocSpace is **ONLYOFFICE Apps**. Every piece of user-facing text
uses that name: UI strings, prop defaults that render, JSDoc that reaches Storybook's docs
tab, the `description` in `package.json`, the text `scripts/lib/readme-tables.mjs` generates
into every README, stories, the samples and other `.mdx` pages, and the READMEs the package
ships. Nothing checks this — the old name keeps coming back through copy-pasted docs, so look
before you commit.

## What changes

The product name in prose, wherever it means the product rather than a codebase:

| Was                         | Now                                            |
| --------------------------- | ---------------------------------------------- |
| ONLYOFFICE DocSpace         | ONLYOFFICE Apps                                |
| a DocSpace portal           | an ONLYOFFICE Apps portal                      |
| a DocSpace plugin           | an ONLYOFFICE Apps plugin                      |
| the DocSpace API / REST API | the ONLYOFFICE Apps API / REST API             |
| DocSpace's left panel       | the ONLYOFFICE Apps left panel                 |
| outside DocSpace            | outside ONLYOFFICE Apps (or: outside a portal) |

Mind the article: it is **an** ONLYOFFICE Apps portal. Link text and `alt` text are text —
change them; the URL behind them is not.

- **Where space is tight — buttons, links, badges — `ONLYOFFICE` alone is enough**: "Sign in
  with ONLYOFFICE", "Open in ONLYOFFICE".
- **Roles use the product's own words**, which carry no product name: Owner, Full admin, Room
  admin, Power user, User, Guest.
- **Inside a component the name comes from `getBrandName("ProductName")`**, because a
  white-label portal renames the product again; `t("Common:ProductName")` is refused by the
  `no-constants-via-i18n` lint plugin. Samples and documentation write the name out.

## What stays

Names of things are not copy, and renaming them breaks a link, a key or an import:

- the `DocSpace-client` and `DocSpace` repositories, their paths and checkouts
  ("a DocSpace-client checkout", `packages/shared/...`, `@docspace/shared`);
- `@onlyoffice/docspace-api-sdk` and any other package name;
- URLs — `github.com/ONLYOFFICE/DocSpace`, Figma file names (`UI-Kit-DocSpace-1.0.0`),
  `your-docspace.com` in samples, API routes;
- storage, environment and config keys (`useDocSpace`, `DOCSPACE_CLIENT_ROOT`), CSS classes,
  test ids, identifiers in code;
- `CHANGELOG.md` entries already released — history describes what was true then.

Engineering notes (`CLAUDE.md`, `.claude/`) keep "DocSpace" where it names that codebase.

## Finding the leftovers

```bash
git grep -n 'DocSpace' -- '*.md' '*.mdx' '*.tsx' '*.ts' ':!locales' ':!.claude' ':!CLAUDE.md' ':!CHANGELOG.md' \
  | grep -v 'DocSpace-client\|DocSpace client\|DocSpace/client\|docspace-api-sdk\|UI-Kit-DocSpace\|useDocSpace\|@docspace/'
```

Every remaining hit is either one of the names above or something to rename. Changing a
rendered default (a prop default, a story `args` value) changes what consumers see, so say so
in `CHANGELOG.md`.
