import type { ComponentProps, ReactNode } from "react";
import { useEffect, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Slider } from "../slider";
import { Text } from "../text";

import { ThemeProviderComponent } from ".";

const meta = {
  title: "UI/Layout/ThemeProviderComponent",
  component: ThemeProviderComponent,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    theme: {
      control: "object",
      description:
        "The theme object. `isBase` picks the light (`true`) or dark (`false`) theme, `interfaceDirection` sets the writing direction (`ltr` or `rtl`), and `fontFamily` sets the font of every element on the page. Other keys are ignored.",
      table: { defaultValue: { summary: "required" } },
    },
    currentColorScheme: {
      control: "object",
      description:
        "The accent colours: `main.accent` and `main.buttons` are the colours, `text.accent` and `text.buttons` the text drawn on them. Written onto the page only when `main` is present; leaving it out or removing it later keeps the colours already there.",
      table: { defaultValue: { summary: "undefined" } },
    },
    children: {
      control: false,
      description:
        "The tree that receives the theme and direction context. The theme, direction and colours themselves apply to the whole page, not only to these children.",
    },
  },
} satisfies Meta<typeof ThemeProviderComponent>;

type Story = StoryObj<ComponentProps<typeof ThemeProviderComponent>>;

export default meta;

const defaultTheme = {
  isBase: true,
  interfaceDirection: "ltr",
  fontFamily: "Open Sans, sans-serif, Arial",
};

const greenScheme = {
  id: 1,
  name: "Green",
  main: { accent: "#2DB482", buttons: "#2DB482" },
  text: { accent: "#FFFFFF", buttons: "#FFFFFF" },
};

// Mounts after the preview's own provider, whose effects would otherwise run last and win.
const AfterPreviewProvider = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready ? children : null;
};

const readDocument = () => ({
  theme: document.documentElement.getAttribute("data-theme") ?? "",
  dir: document.documentElement.getAttribute("data-dir") ?? "",
  bodyClass: [...document.body.classList]
    .filter((name) => ["light", "dark", "ltr", "rtl"].includes(name))
    .join(" "),
  accent: getComputedStyle(document.body)
    .getPropertyValue("--color-scheme-main-accent")
    .trim(),
});

const DocumentState = () => {
  const [state, setState] = useState(readDocument);

  useEffect(() => {
    const update = () => setState(readDocument());
    const observer = new MutationObserver(update);
    const options = { attributes: true, attributeFilter: ["class", "style"] };
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-dir", "style"],
    });
    observer.observe(document.body, options);
    update();
    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 16,
        maxWidth: 320,
        backgroundColor: "var(--background-color)",
        color: "var(--text-color)",
        border: "1px solid var(--info-panel-members-subtitle-color)",
        borderRadius: 6,
      }}
    >
      <Text fontWeight={600}>Document settings</Text>
      <Text>data-theme: {state.theme}</Text>
      <Text>data-dir: {state.dir}</Text>
      <Text>body class: {state.bodyClass}</Text>
      <Text>accent: {state.accent}</Text>
      <Slider min={0} max={100} value={60} withPouring onChange={() => {}} />
    </div>
  );
};

const Template = (args: ComponentProps<typeof ThemeProviderComponent>) => (
  <AfterPreviewProvider>
    <ThemeProviderComponent {...args}>
      <DocumentState />
    </ThemeProviderComponent>
  </AfterPreviewProvider>
);

// Framed on Docs: the component writes to the whole document, so inline stories would overwrite each other.
const framed = { inline: false, height: "250px" };

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    theme: defaultTheme,
    children: null,
  },
  parameters: {
    noPadding: true,
    docs: {
      story: framed,
      description: {
        story:
          "The light theme in the left-to-right direction: the panel reads back what the component wrote onto the page, and its background and text take the theme's colours. Change the theme object live in the Controls panel below; the toolbar's theme and direction switches write over it until the story reloads.",
      },
      source: {
        code: `<ThemeProviderComponent
  theme={{ isBase: true, interfaceDirection: "ltr", fontFamily: "Open Sans, sans-serif, Arial" }}
>
  <App />
</ThemeProviderComponent>`,
      },
    },
  },
};

export const DarkTheme: Story = {
  render: (args) => <Template {...args} />,
  args: {
    theme: { ...defaultTheme, isBase: false },
    children: null,
  },
  parameters: {
    noPadding: true,
    docs: {
      story: framed,
      description: {
        story:
          "Use it to switch the page to the dark theme: the panel turns dark with light text, the body class reads `dark`, and the slider switches to its dark look (`isBase: false`).",
      },
      source: {
        code: `<ThemeProviderComponent theme={{ isBase: false, interfaceDirection: "ltr" }}>
  <App />
</ThemeProviderComponent>`,
      },
    },
  },
};

export const WithAccentColors: Story = {
  render: (args) => <Template {...args} />,
  args: {
    theme: defaultTheme,
    currentColorScheme: greenScheme,
    children: null,
  },
  parameters: {
    noPadding: true,
    docs: {
      story: framed,
      description: {
        story:
          "Use it to give accented components your own colour: the slider's thumb and filled track turn green, and the panel reads the new accent back (`currentColorScheme`).",
      },
      source: {
        code: `<ThemeProviderComponent
  theme={{ isBase: true, interfaceDirection: "ltr" }}
  currentColorScheme={{
    id: 1,
    name: "Green",
    main: { accent: "#2DB482", buttons: "#2DB482" },
    text: { accent: "#FFFFFF", buttons: "#FFFFFF" },
  }}
>
  <App />
</ThemeProviderComponent>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <Template {...args} />
    </div>
  ),
  args: {
    theme: { ...defaultTheme, interfaceDirection: "rtl" },
    children: null,
  },
  globals: { direction: "rtl" },
  parameters: {
    noPadding: true,
    docs: {
      story: framed,
      description: {
        story:
          'Use it for a right-to-left interface: the panel moves to the right edge, its lines align right, the slider fills from the right, and `data-dir` reads `rtl` (`interfaceDirection: "rtl"`).',
      },
      source: {
        code: `<ThemeProviderComponent theme={{ isBase: true, interfaceDirection: "rtl" }}>
  <App />
</ThemeProviderComponent>`,
      },
    },
  },
};
