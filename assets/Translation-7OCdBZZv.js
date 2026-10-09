import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n}from"./blocks-D1qLjfJS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{i,r as a}from"./react-qN2cStNd.js";function o(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...i(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`Getting started/Translation`}),`
`,(0,c.jsx)(t.h1,{id:`translation`,children:`Translation`}),`
`,(0,c.jsxs)(t.p,{children:[`The UI Kit uses `,(0,c.jsx)(t.strong,{children:`i18next`}),` and `,(0,c.jsx)(t.strong,{children:`react-i18next`}),` for internationalization. Translation resources are passed in at the application level via `,(0,c.jsx)(t.code,{children:`TranslationProvider`}),`.`]}),`
`,(0,c.jsx)(t.h2,{id:`translation-files`,children:`Translation files`}),`
`,(0,c.jsx)(t.p,{children:`The package ships English only, one file per namespace:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`locales/
└── en/
    ├── Common.json
    ├── Payments.json
    └── Settings.json
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Every other language comes from the host application: it loads its own resources and
hands them to `,(0,c.jsx)(t.code,{children:`TranslationProvider`}),`, which is why the same component reads Russian in
the portal and English in Storybook without the package carrying either.`]}),`
`,(0,c.jsx)(t.p,{children:`Each JSON file is a flat key-value map. Keys use PascalCase:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-json`,children:`{
  "SaveButton": "Save",
  "CancelButton": "Cancel",
  "DeleteMessage": "Are you sure you want to delete {{name}}?"
}
`})}),`
`,(0,c.jsx)(t.h2,{id:`setting-up-translationprovider`,children:`Setting up TranslationProvider`}),`
`,(0,c.jsxs)(t.p,{children:[`Wrap your application with `,(0,c.jsx)(t.code,{children:`TranslationProvider`}),` and pass translation resources as a nested `,(0,c.jsx)(t.code,{children:`Map`}),`:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { TranslationProvider } from "@onlyoffice/apps-ui-kit/providers/translation";
import type { TTranslations } from "@onlyoffice/apps-ui-kit/providers/translation";

import enCommon from "@onlyoffice/apps-ui-kit/locales/en/Common.json";
import frCommon from "./locales/fr/Common.json"; // your own resources: the package ships English only

const translations: TTranslations = new Map([
  ["en", new Map([["Common", enCommon]])],
  ["fr", new Map([["Common", frCommon]])],
]);

<TranslationProvider translations={translations} locale="en">
  <App />
</TranslationProvider>
`})}),`
`,(0,c.jsx)(t.h3,{id:`provider-props`,children:`Provider props`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`translations`})}),` (`,(0,c.jsx)(t.code,{children:`TTranslations`}),`) — nested Map: language → namespace → key-value records`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`locale`})}),` (`,(0,c.jsx)(t.code,{children:`string`}),`) — current language code (highest priority)`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`user`})}),` (`,(0,c.jsx)(t.code,{children:`{ cultureName?: string }`}),`) — optional; cultureName used as fallback locale`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`settings`})}),` (`,(0,c.jsx)(t.code,{children:`{ culture?: string; timezone?: string }`}),`) — optional; culture used as second fallback`]}),`
`]}),`
`,(0,c.jsxs)(t.p,{children:[`Language resolution order: `,(0,c.jsx)(t.code,{children:`locale`}),` → `,(0,c.jsx)(t.code,{children:`user.cultureName`}),` → `,(0,c.jsx)(t.code,{children:`settings.culture`}),` → `,(0,c.jsx)(t.code,{children:`"en"`})]}),`
`,(0,c.jsx)(t.h2,{id:`using-translations-in-components`,children:`Using translations in components`}),`
`,(0,c.jsxs)(t.p,{children:[`Use the `,(0,c.jsx)(t.code,{children:`useTranslation`}),` hook from `,(0,c.jsx)(t.code,{children:`react-i18next`}),`:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation(["Common"]);

  return <button>{t("Common:SaveButton")}</button>;
}
`})}),`
`,(0,c.jsx)(t.h3,{id:`multiple-namespaces`,children:`Multiple namespaces`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`const { t } = useTranslation(["Files", "Common"]);

t("Files:DeleteMessage")   // from Files namespace
t("Common:CancelButton")   // from Common namespace
`})}),`
`,(0,c.jsx)(t.h3,{id:`interpolation`,children:`Interpolation`}),`
`,(0,c.jsx)(t.p,{children:`Use double curly braces for variable substitution:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`// Common.json
// { "Greeting": "Hello, {{name}}!" }

t("Common:Greeting", { name: "Alice" })
// → "Hello, Alice!"
`})}),`
`,(0,c.jsx)(t.h3,{id:`jsx-inside-translations-trans-component`,children:`JSX inside translations (Trans component)`}),`
`,(0,c.jsxs)(t.p,{children:[`Use the `,(0,c.jsx)(t.code,{children:`Trans`}),` component when you need to embed React elements inside translated strings:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { Trans, useTranslation } from "react-i18next";

// Common.json
// { "Info": "Contact <1>support</1> for help." }

function HelpText() {
  const { t } = useTranslation(["Common"]);

  return (
    <Trans
      t={t}
      ns="Common"
      i18nKey="Info"
      components={{ 1: <a href="/support" /> }}
    />
  );
  // → Contact <a href="/support">support</a> for help.
}
`})}),`
`,(0,c.jsx)(t.h2,{id:`getcommontranslation`,children:`getCommonTranslation`}),`
`,(0,c.jsxs)(t.p,{children:[`For cases where you need a translation outside of React (event handlers, utility functions, MobX stores), use `,(0,c.jsx)(t.code,{children:`getCommonTranslation`}),` from `,(0,c.jsx)(t.code,{children:`@onlyoffice/apps-ui-kit/utils/i18n`}),`. It reads from the `,(0,c.jsx)(t.code,{children:`Common`}),` namespace only.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`import { getCommonTranslation } from "@onlyoffice/apps-ui-kit/utils/i18n";

// Simple key lookup
const label = getCommonTranslation("SaveButton");

// With interpolation
const message = getCommonTranslation("DeleteMessage", { name: "Report.docx" });
`})}),`
`,(0,c.jsx)(t.h3,{id:`how-it-works`,children:`How it works`}),`
`,(0,c.jsxs)(t.ol,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Tries `,(0,c.jsx)(t.code,{children:`window.i18n.t()`}),` first (set by `,(0,c.jsx)(t.code,{children:`TranslationProvider`}),`).`]}),`
`,(0,c.jsxs)(t.li,{children:[`Falls back to manual lookup from `,(0,c.jsx)(t.code,{children:`window.i18n.loaded`}),` using the language from the `,(0,c.jsx)(t.code,{children:`asc_language`}),` cookie.`]}),`
`,(0,c.jsx)(t.li,{children:`Logs an error if the key is not found and returns an empty string.`}),`
`]}),`
`,(0,c.jsxs)(t.p,{children:[`Many internal components use `,(0,c.jsx)(t.code,{children:`getCommonTranslation`}),` to provide default labels (buttons, empty screens, error pages) so that they work without an explicit `,(0,c.jsx)(t.code,{children:`t`}),` prop. If `,(0,c.jsx)(t.code,{children:`TranslationProvider`}),` is mounted, translations resolve automatically.`]}),`
`,(0,c.jsx)(t.h3,{id:`gettranslationready`,children:`getTranslationReady`}),`
`,(0,c.jsxs)(t.p,{children:[`Use `,(0,c.jsx)(t.code,{children:`getTranslationReady`}),` to check whether translations have been loaded before rendering:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`import { getTranslationReady } from "@onlyoffice/apps-ui-kit/utils/i18n";

if (getTranslationReady()) {
  // Safe to call getCommonTranslation
}
`})}),`
`,(0,c.jsx)(t.h2,{id:`adding-a-new-language`,children:`Adding a new language`}),`
`,(0,c.jsxs)(t.ol,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Create a new folder under `,(0,c.jsx)(t.code,{children:`locales/`}),` with the language code (e.g. `,(0,c.jsx)(t.code,{children:`locales/ja-JP/`}),`).`]}),`
`,(0,c.jsx)(t.li,{children:`Copy the English JSON files and translate the values.`}),`
`,(0,c.jsxs)(t.li,{children:[`Add the new language to the `,(0,c.jsx)(t.code,{children:`translations`}),` Map passed to `,(0,c.jsx)(t.code,{children:`TranslationProvider`}),`.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`adding-a-new-translation-key`,children:`Adding a new translation key`}),`
`,(0,c.jsxs)(t.ol,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Add the key to the English JSON file first (e.g. `,(0,c.jsx)(t.code,{children:`locales/en/Common.json`}),`).`]}),`
`,(0,c.jsx)(t.li,{children:`Add translations for other languages in their respective files.`}),`
`,(0,c.jsxs)(t.li,{children:[`Use the key in your component via `,(0,c.jsx)(t.code,{children:`t("Common:YourNewKey")`}),`.`]}),`
`]})]})}function s(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=r(),a(),t()})))()}l();export{s as default};