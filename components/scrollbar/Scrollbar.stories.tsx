import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor } from "storybook/test";

import { Scrollbar } from ".";

const meta = {
  title: "UI/Layout/Scrollbar",
  component: Scrollbar,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    autoHide: {
      control: "boolean",
      description:
        "Hides the tracks until a scroll or a pointer move over the content, and fades them out three seconds later. `false` keeps them on screen.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    fixedSize: {
      control: "boolean",
      description:
        "Keeps the thumb 8px thick on desktop. Without it the thumb is 4px and thickens only under the pointer.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    paddingAfterLastItem: {
      control: "text",
      description: "Space below the last item, as a CSS length.",
    },
    paddingInlineEnd: {
      control: "text",
      description:
        "Space between the content and the side the vertical track is on, as a CSS length. It replaces the default at every screen width.",
    },
    noScrollY: {
      control: "boolean",
      description: "Stops the content scrolling vertically.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noScrollX: {
      control: "boolean",
      description: "Stops the content scrolling horizontally.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    rtl: {
      control: "boolean",
      description:
        "Which side the vertical track is on. It follows the interface direction unless set.",
    },
    tabIndex: {
      control: "number",
      description:
        "Tab order of the content element. The default keeps it out of the tab order, so the keyboard cannot reach the region; `null` drops the attribute.",
      table: {
        defaultValue: { summary: "-1" },
      },
    },
    autoFocus: {
      control: "boolean",
      description:
        "Focuses the content element after mount, so the arrow keys scroll it straight away.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    translateContentSizeYToHolder: {
      control: "boolean",
      description:
        "Gives the outer element the content's own height, so the scrollbar grows with its content instead of filling its parent.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    translateContentSizeXToHolder: {
      control: "boolean",
      description: "The same on the horizontal axis.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    translateContentSizesToHolder: {
      control: "boolean",
      description:
        "Gives the outer element both the content's height and its width.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    createContext: {
      control: "boolean",
      description:
        "Publishes the scrollbar on a React context for the components inside it.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onScroll: {
      action: "onScroll",
      description: "Called as the content scrolls, with the native event.",
    },
    id: {
      control: "text",
      description: "Applied to the outermost element.",
    },
    className: {
      control: "text",
      description: "Applied to the outermost element.",
    },
    style: {
      control: "object",
      description: "Applied to the outermost element.",
    },
    scrollClass: {
      control: "text",
      description:
        "Extra class on the inner element that scrolls, the `.scroller`.",
    },
    scrollBodyClassName: {
      control: "text",
      description:
        "Extra class on the element that holds the content, the `.scroll-body`.",
    },
    ref: {
      control: false,
      description:
        "Receives the scrollbar instance, with its scroll methods and elements.",
    },
    contentRef: {
      control: false,
      description:
        "Receives the element that holds the content, once it is mounted.",
    },
    children: {
      control: false,
      description: "The content to scroll.",
    },
  },
} satisfies Meta<typeof Scrollbar>;

type Story = StoryObj<ComponentProps<typeof Scrollbar>>;

export default meta;

const part = (root: HTMLElement, className: string) =>
  root.querySelector<HTMLElement>(`.${className}`) as HTMLElement;

// A track is drawn only when its axis overflows.
const isShown = (track: HTMLElement | null) =>
  !!track && track.checkVisibility() && track.getBoundingClientRect().width > 0;

const scrollTo = (scroller: HTMLElement, top: number) => {
  scroller.scrollTop = top;
  scroller.dispatchEvent(new Event("scroll"));
};

const LongContent = () => (
  <>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </p>
    <p>
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
    <p>
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
      doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
      inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
    </p>
    <p>
      Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
      fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
      sequi nesciunt.
    </p>
  </>
);

export const Default: Story = {
  name: "Track always shown",
  render: (args) => (
    <Scrollbar {...args}>
      <LongContent />
    </Scrollbar>
  ),
  args: {
    style: { width: 300, height: 200 },
    autoHide: false,
    onScroll: fn(),
  },
  play: async ({ args, canvas, canvasElement }) => {
    // A web font arriving late re-wraps the paragraphs and makes the content
    // taller: a scroll to the end taken before that stops short of the end.
    await document.fonts.ready;
    const scroller = canvas.getByTestId("scroller");
    const trackY = part(canvasElement, "track-vertical");
    const thumbY = part(canvasElement, "thumb-vertical");
    await expect(isShown(trackY)).toBe(true);
    await expect(getComputedStyle(trackY).opacity).toBe("1");
    // Until the first measure the scroller has no width, and the horizontal
    // track counts as needed; it goes once the sizes are in.
    await waitFor(() =>
      expect(isShown(part(canvasElement, "track-horizontal"))).toBe(false),
    );
    // The thumb is 4px until the pointer is over the track.
    await expect(getComputedStyle(thumbY).width).toBe("4px");

    // Scrolling the content moves the thumb and reports the native event.
    const before = thumbY.getBoundingClientRect().top;
    scrollTo(scroller, scroller.scrollHeight);
    await waitFor(() =>
      expect(thumbY.getBoundingClientRect().top).toBeGreaterThan(before),
    );
    await expect(args.onScroll).toHaveBeenCalled();
    // The thumb reaches the bottom of the track.
    await waitFor(() =>
      expect(
        trackY.getBoundingClientRect().bottom -
          thumbY.getBoundingClientRect().bottom,
      ).toBeLessThanOrEqual(5),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tall content in a fixed-size box, with the vertical track always on screen (`autoHide={false}`).",
      },
      source: {
        code: `<Scrollbar autoHide={false} style={{ width: 300, height: 200 }}>
  <p>Scrollable content...</p>
</Scrollbar>`,
      },
    },
  },
};

export const WithAutoHide: Story = {
  name: "Auto-hiding track",
  render: (args) => (
    <Scrollbar {...args}>
      <LongContent />
    </Scrollbar>
  ),
  args: {
    style: { width: 300, height: 200 },
    autoHide: true,
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const trackY = part(canvasElement, "track-vertical");
    await expect(getComputedStyle(trackY).opacity).toBe("0");
    // Moving the pointer over the content marks the tracks for showing;
    // the CSS shows them under a real :hover, which a synthetic pointer
    // does not set.
    await userEvent.hover(canvas.getByTestId("scroll-body"));
    const root = canvas.getByTestId("scrollbar");
    await waitFor(() => expect(root.className).toMatch(/scrollVisible/));
  },
  parameters: {
    docs: {
      description: {
        story:
          "The default, with the track hidden until a scroll or a pointer move over the content (`autoHide`). It fades out three seconds later, for content where a permanent track would distract.",
      },
      source: {
        code: `<Scrollbar autoHide style={{ width: 300, height: 200 }}>
  <p>Content...</p>
</Scrollbar>`,
      },
    },
  },
};

export const WithFixedSize: Story = {
  name: "Fixed thumb size",
  render: (args) => (
    <Scrollbar {...args}>
      <LongContent />
    </Scrollbar>
  ),
  args: {
    style: { width: 300, height: 200 },
    autoHide: false,
    fixedSize: true,
  },
  play: async ({ canvasElement }) => {
    await expect(
      getComputedStyle(part(canvasElement, "thumb-vertical")).width,
    ).toBe("8px");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A thumb that stays 8px thick on desktop, so it is easier to find and grab (`fixedSize`). Without the prop it thickens only under the pointer.",
      },
      source: {
        code: `<Scrollbar fixedSize autoHide={false} style={{ width: 300, height: 200 }}>
  <p>Content...</p>
</Scrollbar>`,
      },
    },
  },
};

export const WithHorizontalScroll: Story = {
  name: "Horizontal scroll",
  render: (args) => (
    <Scrollbar {...args}>
      <div
        style={{
          whiteSpace: "nowrap",
          padding: "10px",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <LongContent />
      </div>
    </Scrollbar>
  ),
  args: {
    style: { width: 300, height: 100 },
    autoHide: false,
  },
  play: async ({ canvas, canvasElement }) => {
    const scroller = canvas.getByTestId("scroller");
    await expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
    const trackX = part(canvasElement, "track-horizontal");
    await expect(isShown(trackX)).toBe(true);
    // Along the bottom edge.
    await expect(
      canvas.getByTestId("scrollbar").getBoundingClientRect().bottom -
        trackX.getBoundingClientRect().bottom,
    ).toBeLessThanOrEqual(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Content that overflows sideways gets a horizontal track along the bottom edge, drawn the same way as the vertical one.",
      },
      source: {
        code: `<Scrollbar autoHide={false} style={{ width: 300, height: 100 }}>
  <div style={{ whiteSpace: "nowrap" }}>Wide content...</div>
</Scrollbar>`,
      },
    },
  },
};

export const WithBothScrollbars: Story = {
  name: "Both tracks",
  render: (args) => (
    <Scrollbar {...args}>
      <div style={{ width: "500px" }}>
        <LongContent />
      </div>
    </Scrollbar>
  ),
  args: {
    style: { width: 300, height: 200 },
    autoHide: false,
  },
  play: async ({ canvasElement }) => {
    const trackY = part(canvasElement, "track-vertical");
    const trackX = part(canvasElement, "track-horizontal");
    await expect(isShown(trackY)).toBe(true);
    await expect(isShown(trackX)).toBe(true);
    // Each is 16px short, leaving the corner free.
    await expect(trackY.getBoundingClientRect().height).toBe(184);
    await expect(trackX.getBoundingClientRect().width).toBe(284);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Content taller and wider than the box shows both tracks, each shortened by 16px so they do not overlap in the corner.",
      },
      source: {
        code: `<Scrollbar autoHide={false} style={{ width: 300, height: 200 }}>
  <div style={{ width: "500px" }}>Tall and wide content...</div>
</Scrollbar>`,
      },
    },
  },
};

export const WithPaddingAfterLastItem: Story = {
  name: "Space after the last item",
  render: (args) => (
    <Scrollbar {...args}>
      <LongContent />
    </Scrollbar>
  ),
  args: {
    style: { width: 300, height: 200 },
    autoHide: false,
    paddingAfterLastItem: "50px",
  },
  play: async ({ canvas }) => {
    await expect(
      getComputedStyle(canvas.getByTestId("scroll-body")).paddingBottom,
    ).toBe("50px");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Extra space below the last paragraph, inside the scrolling content (`paddingAfterLastItem`).",
      },
      source: {
        code: `<Scrollbar paddingAfterLastItem="50px" autoHide={false} style={{ width: 300, height: 200 }}>
  <p>Content with padding at bottom...</p>
</Scrollbar>`,
      },
    },
  },
};

export const WithPaddingInlineEnd: Story = {
  name: "Space before the track",
  render: (args) => (
    <Scrollbar {...args}>
      <LongContent />
    </Scrollbar>
  ),
  args: {
    style: { width: 300, height: 200 },
    autoHide: false,
    paddingInlineEnd: "100px",
  },
  play: async ({ canvas }) => {
    await expect(
      getComputedStyle(canvas.getByTestId("scroll-body")).paddingRight,
    ).toBe("100px");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A wide gap between the text and the track's side, on the right here and on the left in a right-to-left interface (`paddingInlineEnd`).",
      },
      source: {
        code: `<Scrollbar paddingInlineEnd="100px" autoHide={false} style={{ width: 300, height: 200 }}>
  <p>Content with inline-end padding...</p>
</Scrollbar>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  name: "Right to left",
  render: (args) => (
    <div dir="rtl">
      <Scrollbar {...args}>
        <LongContent />
      </Scrollbar>
    </div>
  ),
  globals: { direction: "rtl" },
  play: async ({ canvas, canvasElement }) => {
    const box = canvas.getByTestId("scrollbar").getBoundingClientRect();
    const trackY = part(
      canvasElement,
      "track-vertical",
    ).getBoundingClientRect();
    // The track is on the left edge, and the padding moves with it.
    await expect(trackY.left - box.left).toBeLessThanOrEqual(1);
    await expect(
      getComputedStyle(canvas.getByTestId("scroll-body")).paddingLeft,
    ).toBe("17px");
  },
  args: {
    style: { width: 300, height: 200 },
    autoHide: false,
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the direction of the whole Docs page
      story: { inline: false, height: "226px" },
      description: {
        story:
          "The same box in a right-to-left interface: the vertical track and the content's end padding move to the left edge. The bar takes the direction from the theme; the wrapper's `dir=\"rtl\"` aligns the text.",
      },
      source: {
        code: `<div dir="rtl">
  <Scrollbar autoHide={false} style={{ width: 300, height: 200 }}>
    <p>Scrollable content...</p>
  </Scrollbar>
</div>`,
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
          "--scrollbar-bg": "#7c3aed",
          "--scrollbar-bg-hover": "#5b21b6",
          "--scrollbar-bg-active": "#4c1d95",
          "--scrollbar-thumb-size": "6px",
          "--scrollbar-radius": "4px",
          "--scrollbar-track-padding": "2px",
          "--scrollbar-padding-end": "32px",
        } as CSSProperties
      }
    >
      <Scrollbar style={{ width: 300, height: 200 }} autoHide={false}>
        <LongContent />
      </Scrollbar>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const thumb = getComputedStyle(part(canvasElement, "thumb-vertical"));
    await expect(thumb.backgroundColor).toBe("rgb(124, 58, 237)");
    await expect(thumb.width).toBe("6px");
    const track = getComputedStyle(part(canvasElement, "track-vertical"));
    await expect(track.paddingTop).toBe("2px");
    await expect(track.borderTopLeftRadius).toBe("4px");
    await expect(
      getComputedStyle(canvas.getByTestId("scroll-body")).paddingRight,
    ).toBe("32px");
  },
  parameters: {
    docs: {
      description: {
        story: `A violet 6px thumb on a track with 2px of padding, and 32px of space before the track. A wrapper sets the variables; the hover and drag colours are set too.`,
      },
    },
  },
};
