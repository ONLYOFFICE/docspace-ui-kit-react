// No `/// <reference types="vite/client" />` here: tsconfig.json already
// lists "vite/client" in `types`, and the directive in a file the type-check
// reaches (docs/ imports this through the decorators) makes Vite's `*.svg`
// declaration -- a URL string -- win over types/svg.d.ts, which types an SVG
// import as a component, and fails every icon in the kit.

export const DEFAULT_API_URL = import.meta.env.VITE_PROVIDER_API_URL || "";
export const DEFAULT_API_KEY = import.meta.env.VITE_PROVIDER_API_KEY || "";

const globalTypes = {
  direction: {
    name: "Direction",
    description: "UI direction (LTR/RTL)",
    defaultValue: "ltr",
    toolbar: {
      icon: "transfer" as const,
      items: [
        { value: "ltr", title: "LTR" },
        { value: "rtl", title: "RTL" },
      ],
      dynamicTitle: true,
    },
  },
};

export default globalTypes;
