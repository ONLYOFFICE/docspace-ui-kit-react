/// <reference types="vite/client" />

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
