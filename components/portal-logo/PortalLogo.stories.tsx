import React, { type ComponentProps, type CSSProperties } from "react";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";

import PortalLogo from "./PortalLogo";

const PLACEHOLDER_LOGO = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="386" height="44" viewBox="0 0 386 44"><rect width="386" height="44" rx="6" fill="#d0d5da"/><text x="193" y="28" font-family="sans-serif" font-size="16" text-anchor="middle" fill="#555f65">Portal logo</text></svg>',
)}`;

// No portal serves logo.ashx here; catch the failed load before the component sees it.
const withPlaceholderLogo: Decorator = (Story, context) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const keepFallback = Boolean(context.parameters.keepFallback);

  React.useEffect(() => {
    if (keepFallback) return;

    const onError = (event: Event) => {
      const img = event.target;
      if (!(img instanceof HTMLImageElement)) return;
      if (!img.src.includes("logo.ashx") || !ref.current?.contains(img)) return;
      event.stopPropagation();
      img.src = PLACEHOLDER_LOGO;
    };

    window.addEventListener("error", onError, true);
    return () => window.removeEventListener("error", onError, true);
  }, [keepFallback]);

  return (
    <div ref={ref} style={{ display: "contents" }}>
      <Story />
    </div>
  );
};

// Docs ignores the viewport preset; give the story a window of its own there.
const withFrame =
  (width: number, height: number): Decorator =>
  (Story, context) => {
    if (context.viewMode !== "docs") return <Story />;

    return (
      <iframe
        title={context.name}
        src={`iframe.html?viewMode=story&id=${context.id}`}
        style={{ width, height, border: 0 }}
      />
    );
  };

const meta = {
  title: "UI/Data display/PortalLogo",
  component: PortalLogo,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    className: {
      control: "text",
      description:
        "Added to the `<img>`, or to the fallback logo, next to the component's own `logo-wrapper` class. It never reaches the wrapper around it.",
    },
    isResizable: {
      control: "boolean",
      description:
        "Watches the window width and swaps to the small logo in a fixed bar at 600px and narrower. Without it the logo is hidden at those widths.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    alt: {
      control: "text",
      description:
        "Accessible name of the logo: the `alt` of the image, and the `aria-label` of the bundled mark shown when the image fails to load. Pass the portal or product name, translated. An empty string marks the logo as decorative.",
      table: {
        defaultValue: { summary: '"portal logo"' },
      },
    },
    dataTestId: {
      control: "text",
      description:
        "Value of `data-testid` on the wrapper, or on the fallback logo that replaces it.",
      table: {
        defaultValue: { summary: '"portal-logo"' },
      },
    },
  },
  decorators: [withPlaceholderLogo],
} satisfies Meta<typeof PortalLogo>;

type Story = StoryObj<ComponentProps<typeof PortalLogo>>;

export default meta;

// The layout follows the window: 600px and narrower counts as a phone.
const isPhoneWidth = () => window.innerWidth <= 600;

// The image once the placeholder has replaced the failed portal request.
const findLogo = async (canvasElement: HTMLElement) => {
  let img: HTMLImageElement | null = null;
  await waitFor(() => {
    img = canvasElement.querySelector<HTMLImageElement>("img.logo-wrapper");
    expect(img?.src).toMatch(/^data:image\/svg\+xml/);
  });
  return img as unknown as HTMLImageElement;
};

export const Default: Story = {
  name: "Default",
  render: (args) => <PortalLogo {...args} />,
  args: {
    isResizable: false,
  },
  play: async ({ canvasElement }) => {
    const img = await findLogo(canvasElement);
    await expect(img).toHaveAttribute("alt", "portal logo");
    // The phone bar's colour has a default of its own and yields to the
    // portal's --header-background-color set above it.
    const wrapper = img.parentElement as HTMLElement;
    const holder = wrapper.parentElement as HTMLElement;
    const barColor = () =>
      getComputedStyle(wrapper)
        .getPropertyValue("--portal-logo-mobile-bg-value")
        .trim();
    await expect(barColor()).not.toBe("");
    holder.style.setProperty("--header-background-color", "rgb(1, 2, 3)");
    await expect(barColor()).toBe("rgb(1, 2, 3)");
    holder.style.removeProperty("--header-background-color");
    // Without isResizable the logo is hidden, not shrunk, on a phone.
    if (isPhoneWidth()) {
      await expect(img).not.toBeVisible();
    } else {
      await expect(img).toBeVisible();
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "The logo at its full desktop size. No portal serves the image here, so a grey placeholder stands in for it.",
      },
      source: {
        code: `<PortalLogo />`,
      },
    },
  },
};

export const Resizable: Story = {
  name: "Resizable",
  render: (args) => <PortalLogo {...args} />,
  args: {
    isResizable: true,
  },
  play: async ({ canvasElement }) => {
    const img = await findLogo(canvasElement);
    // Resizable: visible at any width, in the fixed bar on a phone.
    await expect(img).toBeVisible();
    const wrapper = img.parentElement as HTMLElement;
    await expect(wrapper.className).toMatch(/resizable/);
    // On a phone width it becomes a bar fixed across the top.
    await expect(getComputedStyle(wrapper).position === "fixed").toBe(
      isPhoneWidth(),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same logo, following the window width (`isResizable`). At 600px and narrower it moves into a bar fixed across the top, as the phone story shows.",
      },
      source: {
        code: `<PortalLogo isResizable />`,
      },
    },
  },
};

export const WithClassName: Story = {
  name: "With class name",
  render: (args) => <PortalLogo {...args} />,
  args: {
    className: "custom-logo-class",
    isResizable: false,
  },
  play: async ({ canvasElement }) => {
    // The class lands on the image, not on the wrapper around it.
    const img = await findLogo(canvasElement);
    await expect(img).toHaveClass("custom-logo-class");
    await expect(img.parentElement).not.toHaveClass("custom-logo-class");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Styling the logo from outside: the class lands on the image itself, not on the wrapper around it (`className`).",
      },
      source: {
        code: `<PortalLogo className="custom-logo-class" />`,
      },
    },
  },
};

export const OnPhone: Story = {
  name: "On a phone",
  render: (args) => <PortalLogo {...args} />,
  decorators: [withFrame(414, 120)],
  globals: { viewport: { value: "mobile2", isRotated: false } },
  args: {
    isResizable: true,
  },
  play: async ({ canvasElement }) => {
    // Resizable keeps the logo on screen at a phone width; in a frame wider
    // than a phone it stays an ordinary logo.
    const img = await findLogo(canvasElement);
    await expect(img).toBeVisible();
    const wrapper = img.parentElement as HTMLElement;
    await expect(wrapper.className).toMatch(/resizable/);
    if (isPhoneWidth()) {
      await expect(getComputedStyle(wrapper).position).toBe("fixed");
      await expect(Math.round(wrapper.getBoundingClientRect().height)).toBe(48);
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "On a phone the logo moves into a 48px bar fixed across the top of the window, at a smaller size (`isResizable`). Without `isResizable` nothing is shown at this width.",
      },
      source: {
        code: `<PortalLogo isResizable />`,
      },
    },
  },
};

export const FallbackLogo: Story = {
  name: "Fallback logo",
  render: (args) => <PortalLogo {...args} />,
  args: {
    isResizable: false,
    alt: "Acme portal",
  },
  play: async ({ canvasElement }) => {
    // The failed request swaps the whole component for the bundled logo.
    await waitFor(() =>
      expect(canvasElement.querySelector("svg.logo-wrapper")).not.toBeNull(),
    );
    await expect(canvasElement.querySelector("img")).toBeNull();
    // The bundled mark keeps the logo's accessible name.
    const mark = within(canvasElement).getByRole("img", {
      name: "Acme portal",
    });
    await expect(mark).toBe(canvasElement.querySelector("svg.logo-wrapper"));
  },
  parameters: {
    keepFallback: true,
    docs: {
      description: {
        story:
          "The bundled logo in place of a portal logo that failed to load, at its own size. It keeps the name passed in `alt`, so a screen reader still hears which portal this is.",
      },
      source: {
        code: `// /logo.ashx fails to load
<PortalLogo alt="Acme portal" />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS variables",
  render: () => (
    <div
      style={
        {
          "--portal-logo-mobile-bg": "#e6f3fb",
          "--portal-logo-mobile-height": "56px",
          "--portal-logo-mobile-img-height": "28px",
          "--portal-logo-desktop-img-height": "36px",
          "--portal-logo-desktop-img-width": "320px",
        } as CSSProperties
      }
    >
      <PortalLogo isResizable />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const img = await findLogo(canvasElement);
    if (isPhoneWidth()) {
      await expect(
        getComputedStyle(img.parentElement as HTMLElement).height,
      ).toBe("56px");
    } else {
      await expect(getComputedStyle(img).height).toBe("36px");
    }
  },
  parameters: {
    docs: {
      description: {
        story: `One resizable logo with all five variables set on an ancestor. A wide screen shows the two desktop ones: a 320×36 logo. At 600px and narrower the three bar variables set the bar and the height of the logo in it.`,
      },
    },
  },
};
