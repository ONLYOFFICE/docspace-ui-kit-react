import React from "react";

import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button";
import { DropDownItem } from "../drop-down-item";

import { DropDown } from ".";

const meta = {
  title: "UI/Overlays/DropDown",
  component: DropDown,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    layout: "centered",
  },
  argTypes: {
    open: {
      control: "boolean",
      description:
        "Whether the menu is shown; while it is off the menu stays in the page, hidden",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    directionX: {
      control: "select",
      options: ["left", "right"],
      description:
        "Which edge of the anchor the menu lines up with: `right` opens it towards the right from the anchor's left edge, `left` towards the left from its right edge",
      table: {
        defaultValue: { summary: "right" },
      },
    },
    directionY: {
      control: "select",
      options: ["top", "bottom", "both"],
      description:
        "Whether the menu opens below the anchor, above it, or (`both`) below unless there is no room left under it",
      table: {
        defaultValue: { summary: "bottom" },
      },
    },
    maxHeight: {
      control: "number",
      description:
        "Height of the list in pixels; it also turns on the scrollbar, the virtualised list and the arrow keys, none of which happen without it",
    },
    manualWidth: {
      control: "text",
      description:
        "Exact width of the menu as a CSS length, for example `300px` or `100%`",
    },
    offsetX: {
      control: "number",
      description:
        "Shifts the menu inwards from the anchor's edge by this many pixels; portal mode only",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    zIndex: {
      control: "number",
      description: "Stacking order of the menu",
      table: {
        defaultValue: { summary: "400" },
      },
    },
    showDisabledItems: {
      control: "boolean",
      description:
        "Keeps items whose `disabled` prop is true in the list, greyed out; by default they are dropped",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDefaultMode: {
      control: "boolean",
      description:
        "Renders the menu in a portal on the page body, positioned against `forwardedRef`; off, it renders in place inside the nearest positioned ancestor",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    fixedDirection: {
      control: "boolean",
      description:
        "Keeps `directionX` and `directionY` as given instead of flipping them when the menu would not fit the window",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    enableKeyboardEvents: {
      control: "boolean",
      description:
        "Whether the Up and Down arrows move the highlight and Enter clicks the highlighted item; read only with `maxHeight`, and while it is on every key press on the page has its default action prevented",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    withBackdrop: {
      control: "boolean",
      description:
        "Puts a transparent layer behind the open menu that catches the next click and calls `clickOutsideAction`",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    withBackground: {
      control: "boolean",
      description: "Dims the page behind the open menu",
    },
    withoutBackground: {
      control: "boolean",
      description:
        "Keeps the layer behind the menu transparent, even with `withBackground` or `isAside` and on a phone, where it is dimmed otherwise",
    },
    usePortalBackdrop: {
      control: "boolean",
      description:
        "Renders the backdrop inside the portal, above the rest of the page, instead of beneath the menu",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    shouldShowBackdrop: {
      control: "boolean",
      description:
        "Renders the backdrop even when another one is already open on the page, which it otherwise leaves to catch the click",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isAside: {
      control: "boolean",
      description:
        "Dims the page behind the menu and opens its backdrop over up to two others, for a menu inside a side panel",
    },
    backDrop: {
      control: false,
      description:
        "An element rendered in place of the backdrop that `withBackdrop` builds",
    },
    isMobileView: {
      control: "boolean",
      description:
        "Pins the menu to the bottom edge of the screen at full width when the window is taller than it is wide",
    },
    isNoFixedHeightOptions: {
      control: "boolean",
      description:
        "With `maxHeight`, scrolls the items as they are instead of in the virtualised list, for items taller or shorter than 32px",
    },
    useFlexibleHeight: {
      control: "boolean",
      description:
        "With `isNoFixedHeightOptions`, lets the list shrink below `maxHeight` when its items take less room",
    },
    disableScrollbarPadding: {
      control: "boolean",
      description:
        "With `isNoFixedHeightOptions`, removes the space kept for the scrollbar, so an item's hover fill reaches the menu's edge",
    },
    withDynamicScrollbar: {
      control: "boolean",
      description:
        "Caps the menu at the room left between the anchor and the window edge on every open, and scrolls the rest",
    },
    topSpace: {
      control: "number",
      description:
        "With `withDynamicScrollbar`, pixels to keep free between the menu and the top of the window",
    },
    bottomSpace: {
      control: "number",
      description:
        "With `withDynamicScrollbar`, pixels to keep free between the menu and the bottom of the window",
    },
    manualX: {
      control: "text",
      description:
        "Distance from the anchor's edge as a CSS length; inline mode only",
    },
    manualY: {
      control: "text",
      description:
        "Distance from the anchor's top or bottom as a CSS length, instead of the anchor's full height; inline mode only",
    },
    forwardedRef: {
      control: false,
      description:
        "Ref of the element the menu belongs to; in portal mode the menu is positioned against it, and without it the menu goes to the corner of the window",
    },
    appendTo: {
      control: false,
      description:
        "Element the portal renders the menu into instead of the page body",
    },
    clickOutsideAction: {
      action: "clickOutsideAction",
      description:
        "Called when the backdrop or a listed outside event is clicked, with the event and the state being asked for: the opposite of `open`",
    },
    enableOnClickOutside: {
      action: "enableOnClickOutside",
      description: "Called once each time the menu opens",
    },
    eventTypes: {
      control: "object",
      description:
        "DOM event names listened for on the window while the menu is open; one outside the menu calls `clickOutsideAction`",
    },
    forceCloseClickOutside: {
      control: "boolean",
      description: "Stops the outside-event listeners from being added at all",
    },
    children: {
      control: false,
      description: "Items of the menu, normally `DropDownItem`s",
    },
    className: {
      control: "text",
      description: "Class added to the menu element",
    },
    style: {
      control: "object",
      description: "Inline style merged into the menu element's own",
    },
    dataTestId: {
      control: "text",
      description: "Value of the menu element's `data-testid`",
      table: {
        defaultValue: { summary: "dropdown" },
      },
    },
    id: {
      control: false,
      description: "Ignored; no `id` reaches the page",
    },
    columnCount: {
      control: false,
      description: "Ignored; nothing reads it",
    },
    disableOnClickOutside: {
      control: false,
      description: "Ignored; nothing reads it",
    },
    withBlur: {
      control: false,
      description: "Ignored; nothing reads it",
    },
  },
} satisfies Meta<typeof DropDown>;

type Story = StoryObj<ComponentProps<typeof DropDown>>;

export default meta;

const BasicTemplate = (args: ComponentProps<typeof DropDown>) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const parentRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div style={{ padding: "20px" }}>
      <Button
        ref={parentRef}
        label="Open Dropdown"
        onClick={() => setIsOpen(true)}
      />
      <DropDown
        {...args}
        open={args.open ?? isOpen}
        forwardedRef={parentRef}
        clickOutsideAction={(e, next) => {
          args.clickOutsideAction?.(e, next);
          setIsOpen(false);
        }}
      >
        <DropDownItem label="Option 1" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Option 2" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Option 3" onClick={() => setIsOpen(false)} />
      </DropDown>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <BasicTemplate {...args} />,
  args: {
    directionX: "right",
    directionY: "bottom",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The everyday case: a short menu opened from a button and closed by the next click anywhere else. Press **Open Dropdown**, then change any other prop live in the Controls panel below and open it again.",
      },
      source: {
        code: `const [isOpen, setIsOpen] = useState(false);
const buttonRef = useRef<HTMLButtonElement>(null);

<Button ref={buttonRef} label="Open Dropdown" onClick={() => setIsOpen(true)} />
<DropDown
  open={isOpen}
  forwardedRef={buttonRef}
  clickOutsideAction={() => setIsOpen(false)}
>
  <DropDownItem label="Option 1" onClick={() => setIsOpen(false)} />
  <DropDownItem label="Option 2" onClick={() => setIsOpen(false)} />
  <DropDownItem label="Option 3" onClick={() => setIsOpen(false)} />
</DropDown>`,
      },
    },
  },
};

const WithHeadersTemplate = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const parentRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div style={{ padding: "20px" }}>
      <Button
        ref={parentRef}
        label="File Actions"
        onClick={() => setIsOpen(true)}
      />
      <DropDown
        open={isOpen}
        forwardedRef={parentRef}
        clickOutsideAction={() => setIsOpen(false)}
      >
        <DropDownItem isHeader label="File" />
        <DropDownItem label="Open" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Download" onClick={() => setIsOpen(false)} />
        <DropDownItem isSeparator />
        <DropDownItem isHeader label="Edit" />
        <DropDownItem label="Rename" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Move" onClick={() => setIsOpen(false)} />
        <DropDownItem isSeparator />
        <DropDownItem label="Delete" onClick={() => setIsOpen(false)} />
      </DropDown>
    </div>
  );
};

export const WithHeadersAndSeparators: Story = {
  render: () => <WithHeadersTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Dropdowns can include headers and separators to organize items into logical groups.",
      },
      source: {
        code: `<DropDown open={isOpen} forwardedRef={buttonRef} clickOutsideAction={() => setIsOpen(false)}>
  <DropDownItem isHeader label="File" />
  <DropDownItem label="Open" onClick={handleClick} />
  <DropDownItem label="Download" onClick={handleClick} />
  <DropDownItem isSeparator />
  <DropDownItem isHeader label="Edit" />
  <DropDownItem label="Rename" onClick={handleClick} />
  <DropDownItem label="Move" onClick={handleClick} />
</DropDown>`,
      },
    },
  },
};

const WithDisabledItemsTemplate = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const parentRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div style={{ padding: "20px" }}>
      <Button
        ref={parentRef}
        label="Actions Menu"
        onClick={() => setIsOpen(true)}
      />
      <DropDown
        open={isOpen}
        forwardedRef={parentRef}
        showDisabledItems
        clickOutsideAction={() => setIsOpen(false)}
      >
        <DropDownItem isHeader label="Available Actions" />
        <DropDownItem label="Edit" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Share" onClick={() => setIsOpen(false)} />
        <DropDownItem
          label="Move (no permission)"
          onClick={() => {}}
          disabled
        />
        <DropDownItem isSeparator />
        <DropDownItem
          label="Delete (no permission)"
          onClick={() => {}}
          disabled
        />
      </DropDown>
    </div>
  );
};

export const WithDisabledItems: Story = {
  render: () => <WithDisabledItemsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Use `showDisabledItems` to display disabled items. By default, disabled items are hidden.",
      },
      source: {
        code: `<DropDown open={isOpen} showDisabledItems>
  <DropDownItem label="Edit" onClick={handleClick} />
  <DropDownItem label="Move (no permission)" disabled />
  <DropDownItem label="Delete (no permission)" disabled />
</DropDown>`,
      },
    },
  },
};

const ScrollableTemplate = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const parentRef = React.useRef<HTMLButtonElement>(null);

  const items = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    label: `Option ${i + 1}`,
  }));

  return (
    <div style={{ padding: "20px" }}>
      <Button
        ref={parentRef}
        label="Long List"
        onClick={() => setIsOpen(true)}
      />
      <DropDown
        open={isOpen}
        forwardedRef={parentRef}
        maxHeight={200}
        clickOutsideAction={() => setIsOpen(false)}
        style={{ width: "100px" }}
      >
        {items.map((item) => (
          <DropDownItem
            key={item.id}
            label={item.label}
            onClick={() => setIsOpen(false)}
          />
        ))}
      </DropDown>
    </div>
  );
};

export const ScrollableList: Story = {
  render: () => <ScrollableTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "For a list longer than the screen can hold: the menu stays 200px tall and scrolls (`maxHeight`). Open it and press the Down and Up arrows to move the highlight, then Enter to pick the highlighted option.",
      },
      source: {
        code: `<DropDown open={isOpen} maxHeight={200}>
  {items.map((item) => (
    <DropDownItem key={item.id} label={item.label} onClick={handleClick} />
  ))}
</DropDown>`,
      },
    },
  },
};

const DirectionsTemplate = () => {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const bottomRightRef = React.useRef<HTMLButtonElement>(null);
  const bottomLeftRef = React.useRef<HTMLButtonElement>(null);
  const topRightRef = React.useRef<HTMLButtonElement>(null);
  const topLeftRef = React.useRef<HTMLButtonElement>(null);

  const handleOpen = (id: string) => setOpenDropdown(id);
  const handleClose = () => setOpenDropdown(null);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "100px",
        padding: "100px 20px",
      }}
    >
      <div>
        <Button
          ref={bottomRightRef}
          label="Bottom Right"
          onClick={() => handleOpen("bottomRight")}
        />
        <DropDown
          open={openDropdown === "bottomRight"}
          forwardedRef={bottomRightRef}
          directionX="right"
          directionY="bottom"
          clickOutsideAction={handleClose}
        >
          <DropDownItem label="Option 1" onClick={handleClose} />
          <DropDownItem label="Option 2" onClick={handleClose} />
        </DropDown>
      </div>

      <div>
        <Button
          ref={bottomLeftRef}
          label="Bottom Left"
          onClick={() => handleOpen("bottomLeft")}
        />
        <DropDown
          open={openDropdown === "bottomLeft"}
          forwardedRef={bottomLeftRef}
          directionX="left"
          directionY="bottom"
          clickOutsideAction={handleClose}
        >
          <DropDownItem label="Option 1" onClick={handleClose} />
          <DropDownItem label="Option 2" onClick={handleClose} />
        </DropDown>
      </div>

      <div>
        <Button
          ref={topRightRef}
          label="Top Right"
          onClick={() => handleOpen("topRight")}
        />
        <DropDown
          open={openDropdown === "topRight"}
          forwardedRef={topRightRef}
          directionX="right"
          directionY="top"
          clickOutsideAction={handleClose}
        >
          <DropDownItem label="Option 1" onClick={handleClose} />
          <DropDownItem label="Option 2" onClick={handleClose} />
        </DropDown>
      </div>

      <div>
        <Button
          ref={topLeftRef}
          label="Top Left"
          onClick={() => handleOpen("topLeft")}
        />
        <DropDown
          open={openDropdown === "topLeft"}
          forwardedRef={topLeftRef}
          directionX="left"
          directionY="top"
          clickOutsideAction={handleClose}
        >
          <DropDownItem label="Option 1" onClick={handleClose} />
          <DropDownItem label="Option 2" onClick={handleClose} />
        </DropDown>
      </div>
    </div>
  );
};

export const DirectionVariants: Story = {
  render: () => <DirectionsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "To open the menu where there is room for it: each button opens its menu to the side and edge its label names (`directionX`, `directionY`). A menu that would run past the side of the window opens towards the other side instead.",
      },
      source: {
        code: `<DropDown directionX="right" directionY="bottom">...</DropDown>
<DropDown directionX="left" directionY="bottom">...</DropDown>
<DropDown directionX="right" directionY="top">...</DropDown>
<DropDown directionX="left" directionY="top">...</DropDown>`,
      },
    },
  },
};

const CustomWidthTemplate = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const parentRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div style={{ padding: "20px" }}>
      <Button
        ref={parentRef}
        label="Wide Dropdown"
        onClick={() => setIsOpen(true)}
      />
      <DropDown
        open={isOpen}
        forwardedRef={parentRef}
        manualWidth="300px"
        clickOutsideAction={() => setIsOpen(false)}
      >
        <DropDownItem
          label="This is a longer option text"
          onClick={() => setIsOpen(false)}
        />
        <DropDownItem
          label="Another long option"
          onClick={() => setIsOpen(false)}
        />
        <DropDownItem label="Short" onClick={() => setIsOpen(false)} />
      </DropDown>
    </div>
  );
};

export const CustomWidth: Story = {
  render: () => <CustomWidthTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Use `manualWidth` to set a custom width for the dropdown.",
      },
      source: {
        code: `<DropDown open={isOpen} manualWidth="300px">
  <DropDownItem label="This is a longer option text" />
  <DropDownItem label="Another long option" />
  <DropDownItem label="Short" />
</DropDown>`,
      },
    },
  },
};

const SeparatorsTemplate = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const parentRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div style={{ padding: "20px" }}>
      <Button
        ref={parentRef}
        label="Edit Menu"
        onClick={() => setIsOpen(true)}
      />
      <DropDown
        open={isOpen}
        forwardedRef={parentRef}
        clickOutsideAction={() => setIsOpen(false)}
      >
        <DropDownItem label="Cut" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Copy" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Paste" onClick={() => setIsOpen(false)} />
        <DropDownItem isSeparator />
        <DropDownItem label="Select All" onClick={() => setIsOpen(false)} />
        <DropDownItem isSeparator />
        <DropDownItem label="Undo" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Redo" onClick={() => setIsOpen(false)} />
      </DropDown>
    </div>
  );
};

export const WithSeparators: Story = {
  render: () => <SeparatorsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "To group a short menu without titles: thin lines split the editing commands into three groups (`isSeparator` on a `DropDownItem`).",
      },
      source: {
        code: `<DropDown open={isOpen}>
  <DropDownItem label="Cut" onClick={handleClick} />
  <DropDownItem label="Copy" onClick={handleClick} />
  <DropDownItem label="Paste" onClick={handleClick} />
  <DropDownItem isSeparator />
  <DropDownItem label="Select All" onClick={handleClick} />
</DropDown>`,
      },
    },
  },
};

const RightToLeftTemplate = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const parentRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div dir="rtl" ref={setContainer} style={{ padding: "20px" }}>
      <Button ref={parentRef} label="القائمة" onClick={() => setIsOpen(true)} />
      {container ? (
        <DropDown
          open={isOpen}
          forwardedRef={parentRef}
          appendTo={container}
          manualWidth="200px"
          clickOutsideAction={() => setIsOpen(false)}
        >
          <DropDownItem label="فتح" onClick={() => setIsOpen(false)} />
          <DropDownItem label="تنزيل" onClick={() => setIsOpen(false)} />
          <DropDownItem
            label="إعادة التسمية"
            onClick={() => setIsOpen(false)}
          />
        </DropDown>
      ) : null}
    </div>
  );
};

export const RightToLeft: Story = {
  render: () => <RightToLeftTemplate />,
  globals: { direction: "rtl" },
  parameters: {
    layout: "fullscreen",
    noPadding: true,
    docs: {
      // Framed, because an inline RTL story flips the whole Docs page.
      story: { inline: false, height: "220px" },
      description: {
        story:
          "The menu in a right-to-left interface, open from the start: the button sits at the right, the menu lines up with the button's right edge and extends towards the left, and the labels are aligned to the right. The menu renders into the right-to-left container (`appendTo`), because on its own it goes to the end of the page body, outside any `dir` wrapper.",
      },
      source: {
        code: `<div dir="rtl" ref={setContainer}>
  <Button ref={buttonRef} label="القائمة" onClick={() => setIsOpen(true)} />
  <DropDown
    open={isOpen}
    forwardedRef={buttonRef}
    appendTo={container}
    manualWidth="200px"
    clickOutsideAction={() => setIsOpen(false)}
  >
    <DropDownItem label="فتح" onClick={handleClick} />
    <DropDownItem label="تنزيل" onClick={handleClick} />
  </DropDown>
</div>`,
      },
    },
  },
};

const CssCustomizationTemplate = () => {
  const parentRef = React.useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div
      style={
        {
          "--dropdown-radius": "12px",
          "--dropdown-bg": "#f5f3ff",
          "--dropdown-border-style": "1px solid #7c3aed",
          "--dropdown-shadow": "0 4px 20px rgba(124, 58, 237, 0.25)",
          "--dropdown-inner-padding": "12px 0",
          position: "relative",
        } as CSSProperties
      }
    >
      <Button
        ref={parentRef}
        label="Dropdown trigger"
        onClick={() => setIsOpen((v) => !v)}
      />
      <DropDown
        open={isOpen}
        isDefaultMode={false}
        forwardedRef={parentRef}
        directionY="bottom"
        fixedDirection
        clickOutsideAction={() => setIsOpen(false)}
      >
        <DropDownItem label="Option 1" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Option 2" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Option 3" onClick={() => setIsOpen(false)} />
      </DropDown>
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `The variables are listed under CSS variables on this page. Press **Dropdown trigger** to open the menu. It renders inline here (\`isDefaultMode={false}\`), inside the wrapper that sets the variables; in the default portal mode the menu is on the page body, outside any wrapper, so set them through the DropDown's own \`style\` prop instead.`,
      },
      source: {
        code: `<div style={{
  "--dropdown-radius": "12px",
  "--dropdown-bg": "#f5f3ff",
  "--dropdown-border-style": "1px solid #7c3aed",
  "--dropdown-shadow": "0 4px 20px rgba(124,58,237,0.25)",
  "--dropdown-inner-padding": "12px 0",
  position: "relative",
}}>
  <DropDown open isDefaultMode={false} forwardedRef={ref}>
    <DropDownItem label="Option 1" />
    <DropDownItem label="Option 2" />
  </DropDown>
</div>`,
      },
    },
  },
};
