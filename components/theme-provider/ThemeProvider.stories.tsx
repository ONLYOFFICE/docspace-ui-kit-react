import type { ComponentProps, ReactNode } from "react";
import { useEffect, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor } from "storybook/test";
import { useDarkMode } from "@vueless/storybook-dark-mode";

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
        "The theme object. `isBase` picks light or dark, `interfaceDirection` the writing direction, and `fontFamily` the font of every element. Other keys are ignored, and the type checks none of them.",
      table: { defaultValue: { summary: "required" } },
    },
    currentColorScheme: {
      control: "object",
      description:
        "The accent colours and the text drawn on them. They reach the page only when `main` is present; leaving the scheme out later takes them off.",
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
      <Slider min={0} max={100} value={60} withPouring onChange={fn()} />
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

const ToolbarTheme = (args: ComponentProps<typeof ThemeProviderComponent>) => {
  const isDark = useDarkMode();
  return <Template {...args} theme={{ ...args.theme, isBase: !isDark }} />;
};

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

// The panel reads back what the provider wrote onto the page.
const readsBack = ({ canvas }: PlayContext, line: string | RegExp) =>
  waitFor(() => expect(canvas.getByText(line)).toBeVisible());

// Framed on Docs: the component writes to the whole document, so inline stories would overwrite each other.
const framed = { inline: false, height: "250px" };

export const Default: Story = {
  name: "Default",
  render: (args) => <ToolbarTheme {...args} />,
  args: {
    theme: defaultTheme,
    children: null,
  },
  play: async (context) => {
    const theme = document.body.classList.contains("dark") ? "dark" : "light";
    await readsBack(context, `data-theme: ${theme}`);
    await readsBack(context, "data-dir: ltr");
    await readsBack(context, new RegExp(`^body class: .*\\b${theme}\\b`));
    await expect(getComputedStyle(document.body).fontFamily).toMatch(
      /Open Sans/,
    );
  },
  parameters: {
    noPadding: true,
    docs: {
      story: framed,
      description: {
        story:
          "A panel in the theme the toolbar picks, left to right, reading back what the component wrote onto the page. Its background and text take the theme's colours, and `isBase` follows the toolbar.",
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
  name: "Dark theme",
  render: (args) => <Template {...args} />,
  args: {
    theme: { ...defaultTheme, isBase: false },
    children: null,
  },
  play: async (context) => {
    await readsBack(context, "data-theme: dark");
    await readsBack(context, /^body class: .*\bdark\b/);
  },
  parameters: {
    noPadding: true,
    docs: {
      story: framed,
      description: {
        story:
          "The page in the dark theme (`isBase: false`). The panel turns dark with light text, the body class reads `dark`, and the slider takes its dark look.",
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
  name: "Accent colours",
  render: (args) => <Template {...args} />,
  args: {
    theme: defaultTheme,
    currentColorScheme: greenScheme,
    children: null,
  },
  play: async (context) => {
    await readsBack(context, /^accent: #2DB482$/i);
  },
  parameters: {
    noPadding: true,
    docs: {
      story: framed,
      description: {
        story:
          "A green accent passed in `currentColorScheme`. The slider's thumb and filled track turn green, and the panel reads the accent back.",
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
  name: "Right to left",
  render: (args) => (
    <div dir="rtl">
      <Template {...args} />
    </div>
  ),
  args: {
    theme: { ...defaultTheme, interfaceDirection: "rtl" },
    children: null,
  },
  play: async (context) => {
    await readsBack(context, "data-dir: rtl");
    await readsBack(context, /^body class: .*\brtl\b/);
  },
  globals: { direction: "rtl" },
  parameters: {
    noPadding: true,
    docs: {
      story: framed,
      description: {
        story:
          'The page in a right-to-left interface (`interfaceDirection: "rtl"`). The panel sits at the right edge, its lines align right, the slider fills from the right, and `data-dir` reads `rtl`.',
      },
      source: {
        code: `<ThemeProviderComponent theme={{ isBase: true, interfaceDirection: "rtl" }}>
  <App />
</ThemeProviderComponent>`,
      },
    },
  },
};
