import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n}from"./blocks-D1qLjfJS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{i,r as a}from"./react-qN2cStNd.js";function o(e){let t={a:`a`,code:`code`,em:`em`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...i(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`Getting started/Themes`}),`
`,(0,c.jsx)(t.h1,{id:`themes`,children:`Themes`}),`
`,(0,c.jsxs)(t.p,{children:[`The UI Kit ships with Base (light) and Dark themes. Styling is `,(0,c.jsx)(t.strong,{children:`SCSS Modules plus CSS
custom properties`}),` — there is no runtime CSS-in-JS. `,(0,c.jsx)(t.code,{children:`ThemeProvider`}),` resolves the active
theme, stamps it on the document, and sets the custom properties that every component's
stylesheet reads.`]}),`
`,(0,c.jsx)(t.h2,{id:`setting-up-themeprovider`,children:`Setting up ThemeProvider`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { ThemeProvider } from "@onlyoffice/apps-ui-kit/providers/theme";
import { ThemeKeys } from "@onlyoffice/apps-ui-kit/enums";

<ThemeProvider initialTheme={ThemeKeys.BaseStr} locale="en">
  <App />
</ThemeProvider>
`})}),`
`,(0,c.jsxs)(t.p,{children:[`There is also a composite `,(0,c.jsx)(t.code,{children:`Providers`}),` component, which mounts `,(0,c.jsx)(t.code,{children:`ApiProvider`}),` and fetches portal
settings on mount. `,(0,c.jsx)(t.strong,{children:`It is for the portal, not for an application of your own`}),`: it requires a
ONLYOFFICE Apps URL and an API key, and without a portal behind them every request it makes fails. It
is deliberately not re-exported from `,(0,c.jsx)(t.code,{children:`providers`}),`. Compose `,(0,c.jsx)(t.code,{children:`ThemeProvider`}),` and
`,(0,c.jsx)(t.code,{children:`TranslationProvider`}),` yourself instead — see
`,(0,c.jsx)(t.a,{href:`?path=/docs/getting-started-welcome--docs`,children:`Getting started`}),`.`]}),`
`,(0,c.jsx)(t.h3,{id:`provider-props`,children:`Provider props`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`initialTheme`})}),` (`,(0,c.jsx)(t.code,{children:`ThemeKeys`}),`) — starting theme: `,(0,c.jsx)(t.code,{children:`BaseStr`}),`, `,(0,c.jsx)(t.code,{children:`DarkStr`}),`, or `,(0,c.jsx)(t.code,{children:`SystemStr`})]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`systemTheme`})}),` (`,(0,c.jsx)(t.code,{children:`ThemeKeys`}),`) — override detected OS preference`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`colorTheme`})}),` (`,(0,c.jsx)(t.code,{children:`CustomColorThemesSettingsDto`}),`) — the portal's accent palette. `,(0,c.jsx)(t.strong,{children:`Pass it.`}),`
Omitted, the provider calls the ONLYOFFICE Apps REST API on mount to ask for one; outside a portal that
request fails, the rejection is not caught, and it is never retried. `,(0,c.jsx)(t.code,{children:`{ themes: [], selected: 0 }`}),`
says "no portal, no accent override".`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`locale`})}),` (`,(0,c.jsx)(t.code,{children:`string`}),`) — language code for RTL detection and font selection`]}),`
`]}),`
`,(0,c.jsx)(t.h3,{id:`themekeys-enum`,children:`ThemeKeys enum`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`import { ThemeKeys } from "@onlyoffice/apps-ui-kit/enums";

ThemeKeys.BaseStr    // "Base" — light theme
ThemeKeys.DarkStr    // "Dark" — dark theme
ThemeKeys.SystemStr  // "System" — follow OS preference
`})}),`
`,(0,c.jsx)(t.h2,{id:`theme-resolution-order`,children:`Theme resolution order`}),`
`,(0,c.jsx)(t.p,{children:`The hook resolves the active theme in this order:`}),`
`,(0,c.jsxs)(t.ol,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.code,{children:`initialTheme`}),` if explicitly set to `,(0,c.jsx)(t.code,{children:`BaseStr`}),` or `,(0,c.jsx)(t.code,{children:`DarkStr`})]}),`
`,(0,c.jsxs)(t.li,{children:[`If `,(0,c.jsx)(t.code,{children:`initialTheme`}),` is `,(0,c.jsx)(t.code,{children:`SystemStr`}),`, detect via `,(0,c.jsx)(t.code,{children:`window.matchMedia("(prefers-color-scheme: dark)")`})]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.code,{children:`systemTheme`}),` fallback`]}),`
`,(0,c.jsx)(t.li,{children:`Default to Base (light)`}),`
`]}),`
`,(0,c.jsxs)(t.p,{children:[`When `,(0,c.jsx)(t.code,{children:`SystemStr`}),` is used, a `,(0,c.jsx)(t.code,{children:`matchMedia`}),` listener automatically switches the theme when the OS preference changes.`]}),`
`,(0,c.jsx)(t.h2,{id:`where-a-components-colours-come-from`,children:`Where a component's colours come from`}),`
`,(0,c.jsxs)(t.p,{children:[`Nothing reads the theme object to paint a component. Each component has its own
`,(0,c.jsx)(t.code,{children:`*.module.scss`}),`, and that stylesheet declares its tokens under the theme class and reads
them back through `,(0,c.jsx)(t.code,{children:`var()`}),`:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-scss`,children:`:global(.light) {
  :local {
    .card {
      --card-background: #{colors.$white};
      --card-text-color: #{colors.$black};
    }
  }
}

.card {
  background-color: var(--card-background);
  color: var(--card-text-color);
}
`})}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`ThemeProvider`}),` only decides `,(0,c.jsx)(t.em,{children:`which`}),` theme is active; the values come from the stylesheet
that ships next to the component. An undefined token fails silently, so add both halves
together.`]}),`
`,(0,c.jsx)(t.h3,{id:`theme-object`,children:`Theme object`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`Base`}),` and `,(0,c.jsx)(t.code,{children:`Dark`}),` are still exported from `,(0,c.jsx)(t.code,{children:`@onlyoffice/apps-ui-kit/providers/theme`}),`, and
`,(0,c.jsx)(t.code,{children:`useTheme`}),` still resolves one of them. Only three of their fields drive anything today —
`,(0,c.jsx)(t.code,{children:`isBase`}),`, `,(0,c.jsx)(t.code,{children:`interfaceDirection`}),` and `,(0,c.jsx)(t.code,{children:`fontFamily`}),`, which `,(0,c.jsx)(t.code,{children:`ThemeProvider`}),` turns into the DOM
attributes below. The remaining ~130 per-component categories are a leftover from the
CSS-in-JS era; no component in the package reads them:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`{
  isBase: true,                    // true for Base, false for Dark
  interfaceDirection: "ltr",       // "ltr" or "rtl"
  fontFamily: "Open Sans, ...",
  color: "#333333",
  backgroundColor: "#FFFFFF",

  text: { color, disableColor, fontWeight, ... },
  heading: { fontSize: { xlarge, large, medium, small }, ... },
  button: { padding, color, backgroundColor, ... },
  input: { color, borderColor, ... },
  checkbox: { ... },
  tabs: { ... },
  tooltip: { ... },
  contextMenu: { ... },
  modal: { ... },
  table: { ... },
  // ... and many more
}
`})}),`
`,(0,c.jsx)(t.h2,{id:`usetheme-context-hook`,children:`useTheme context hook`}),`
`,(0,c.jsx)(t.p,{children:`Read the current theme state from any component:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { useTheme } from "@onlyoffice/apps-ui-kit/context/ThemeContext";

function MyComponent() {
  const { theme, isBase, currentColorScheme } = useTheme();

  return <div>{isBase ? "Light mode" : "Dark mode"}</div>;
}
`})}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`theme`})}),` (`,(0,c.jsx)(t.code,{children:`"Base" | "Dark"`}),`) — current theme name`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`isBase`})}),` (`,(0,c.jsx)(t.code,{children:`boolean`}),`) — `,(0,c.jsx)(t.code,{children:`true`}),` if light theme is active`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:(0,c.jsx)(t.code,{children:`currentColorScheme`})}),` (`,(0,c.jsx)(t.code,{children:`CustomColorThemesSettingsItem`}),`) — active color scheme (accent colors)`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`custom-color-themes`,children:`Custom color themes`}),`
`,(0,c.jsx)(t.p,{children:`Custom color themes override the accent colors used across the UI.`}),`
`,(0,c.jsx)(t.h3,{id:`type`,children:`Type`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`type CustomColorThemesSettingsDto = {
  selected: string;  // ID of the active color theme
  themes?: CustomColorThemesSettingsItem[];
};

type CustomColorThemesSettingsItem = {
  id: string;
  name?: string;
  main?: { accent?: string; buttons?: string };
  text?: { accent?: string; buttons?: string };
};
`})}),`
`,(0,c.jsx)(t.h3,{id:`passing-a-custom-color-theme`,children:`Passing a custom color theme`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`const colorTheme = {
  selected: "1",
  themes: [
    {
      id: "1",
      name: "Brand",
      main: { accent: "#4781D1", buttons: "#5299E0" },
      text: { accent: "#FFFFFF", buttons: "#FFFFFF" },
    },
  ],
};

<ThemeProvider initialTheme={ThemeKeys.BaseStr} colorTheme={colorTheme}>
  <App />
</ThemeProvider>
`})}),`
`,(0,c.jsx)(t.p,{children:`These colors are set as CSS custom properties on the document:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`--color-scheme-main-accent
--color-scheme-text-accent
--color-scheme-main-buttons
--color-scheme-text-buttons
`})}),`
`,(0,c.jsxs)(t.p,{children:[`If `,(0,c.jsx)(t.code,{children:`colorTheme`}),` is not provided, it is fetched automatically from the ONLYOFFICE Apps API.`]}),`
`,(0,c.jsx)(t.h2,{id:`dom-attributes`,children:`DOM attributes`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`ThemeProvider`}),` sets the following attributes on the document:`]}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:(0,c.jsx)(t.code,{children:`<html data-theme="light|dark">`})}),`
`,(0,c.jsx)(t.li,{children:(0,c.jsx)(t.code,{children:`<html data-dir="ltr|rtl">`})}),`
`,(0,c.jsx)(t.li,{children:(0,c.jsx)(t.code,{children:`<body class="light|dark ltr|rtl">`})}),`
`]}),`
`,(0,c.jsx)(t.p,{children:`CSS custom properties:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`<html> --interface-direction: "ltr" | "rtl"
<body> --font-family: "Open Sans, sans-serif, Arial"
`})}),`
`,(0,c.jsx)(t.h2,{id:`rtl-support`,children:`RTL support`}),`
`,(0,c.jsxs)(t.p,{children:[`RTL is detected automatically from the `,(0,c.jsx)(t.code,{children:`locale`}),` prop. Arabic, Hebrew, Urdu, Persian, and other RTL languages flip the interface direction.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`import {
  isLanguageRtl,
  getDirectionByLanguage,
  getCorrectTextAlign,
  getCorrectBorderRadius,
} from "@onlyoffice/apps-ui-kit/providers/theme";

isLanguageRtl("ar");           // true
getDirectionByLanguage("en");  // "ltr"
getDirectionByLanguage("he");  // "rtl"
`})}),`
`,(0,c.jsx)(t.p,{children:`Helper functions, for the cases a value has to be flipped in JavaScript rather than by a
CSS logical property:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`// Flip text-align for RTL
getCorrectTextAlign("left", "rtl");  // "right"

// Flip border-radius for RTL
getCorrectBorderRadius("4px 0 0 4px", "rtl");  // "0 4px 4px 0"

// Flip four-value styles (margin, padding)
getCorrectFourValuesStyle("0 8px 0 0", "rtl");  // "0 0 0 8px"
`})}),`
`,(0,c.jsx)(t.h2,{id:`global-color-tokens`,children:`Global color tokens`}),`
`,(0,c.jsxs)(t.p,{children:[`Available in `,(0,c.jsx)(t.code,{children:`@onlyoffice/apps-ui-kit/providers/theme`}),`:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-ts`,children:`import { globalColors } from "@onlyoffice/apps-ui-kit/providers/theme";

globalColors.white           // "#ffffff"
globalColors.black           // "#333333"
globalColors.lightBlueMain   // "#4781D1"
globalColors.mainGreen       // "#2DB482"
globalColors.mainRed         // "#F2675A"
globalColors.mainOrange      // "#F97A0B"
globalColors.grayLight       // "#F8F9F9"
`})})]})}function s(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=r(),a(),t()})))()}l();export{s as default};