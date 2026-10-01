// The prose of the category pages. Storybook has groups but nothing to say
// about them, so what a category is for is written here, keyed by its
// Storybook path. A published category missing from this map fails a strict
// run: a new Storybook group needs a paragraph before it reaches the site.
//
// `title` is the H1 of the category page and the sidebar label; it defaults
// to the last segment of the key. `description` is Markdown.

/**
 * @typedef {Object} Section
 * @property {string} [title]
 * @property {string} description
 * @property {string} [tableCaption]
 * @property {string} [tableHeader]
 */

/** The landing page of the whole section. */
export const ROOT_SECTION = {
  title: "UI Kit",
  description:
    "`@onlyoffice/apps-ui-kit` is the React component library every ONLYOFFICE Apps " +
    "product is built with, and the UI a DocSpace plugin renders its screens in. " +
    "Start with **Getting started** for the two providers and the import forms, then " +
    "pick a component by what it does.",
  tableCaption: "The reference is organised into these sections:",
  tableHeader: "Section",
};

/** @type {Record<string, Section>} */
export const SECTIONS = {
  "Getting started": {
    description:
      "What the kit is, how to install it, and the pieces every application sets up " +
      "once: the theme and translation providers, the API client, and the hooks, " +
      "utilities and constants the components share.",
    tableCaption: "The following pages are available:",
    tableHeader: "Page",
  },
  UI: {
    title: "UI",
    description:
      "The components themselves, grouped by what they do on a page: controls, " +
      "overlays, data display, navigation, feedback and layout.",
    tableCaption: "The groups are:",
    tableHeader: "Group",
  },
  Components: {
    title: "Components",
    description:
      "The composites built from the UI components for the portal's screens. " +
      "Of these, the providers are public; the rest need DocSpace context.",
    tableCaption: "The groups are:",
    tableHeader: "Group",
  },
  "Components/Providers": {
    description:
      "The providers an application mounts above the components. `ThemeProvider` and " +
      "`TranslationProvider` are required -- without them components render unstyled " +
      "and without text -- and `ErrorBoundary` catches a render failure below it.",
    tableHeader: "Provider",
  },
  "UI/Data display": {
    description:
      "Components that show a value rather than take one: text and headings, avatars, " +
      "badges and tags, room icons and logos, and cards.",
  },
  "UI/Feedback": {
    description:
      "Components that tell the user what happened or what is happening: toasts and " +
      "snack bars, status messages, info bars and progress for long operations.",
  },
  "UI/Form controls": {
    description:
      "Inputs, pickers and the containers that label them. Every control here is " +
      "controlled: it renders the value it is given and reports changes through its " +
      "callback.",
  },
  "UI/Interactive elements": {
    description:
      "Buttons in their variants -- plain, icon, floating, main-menu -- and the " +
      "drag-and-drop surfaces: components whose job is to be clicked or dragged.",
  },
  "UI/Layout": {
    description:
      "The page's plumbing: portals, scroll areas, the selection rectangle and " +
      "the theme wrapper.",
  },
  "UI/Layout components": {
    description:
      "Screens for the moments a view has nothing to show: an empty folder, a search " +
      "with no results, an error.",
  },
  "UI/Navigation": {
    description:
      "Links, tabs, paging and the side menu that moves the user between views.",
  },
  "UI/Overlays": {
    description:
      "Everything drawn above the page: modal dialogs and side panels, drop-downs and " +
      "context menus, tooltips and the selector.",
  },
  "UI/Rows": {
    description:
      "The row-based list the portal shows files and rooms in, with its container and " +
      "content layout.",
  },
  "UI/Skeletons": {
    description:
      "Placeholder shapes shown while content loads, so the layout does not jump when " +
      "it arrives.",
  },
  "UI/Status components": {
    description:
      "Loaders and progress: spinners, the full-screen application loader, the " +
      "infinite-scroll loader and the progress bar.",
  },
  "UI/Table": {
    description:
      "The data table with resizable columns, its header, rows and group menu.",
  },
  "UI/Tiles": {
    description:
      "The tile grid: a container, the base tile and the file, folder, room and " +
      "template tiles built on it.",
  },
};

export const DEFAULT_TABLE_CAPTION = "The following components are available:";
export const DEFAULT_TABLE_HEADER = "Component";
