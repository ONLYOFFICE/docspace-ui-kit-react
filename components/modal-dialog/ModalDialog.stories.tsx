import type { ComponentProps, CSSProperties } from "react";
import { useEffect, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import { Button, ButtonSize } from "../button";
import { InputType, TextInput } from "../text-input";

import { ModalDialog } from ".";
import { ModalDialogType } from "./ModalDialog.enums";
import type { ModalDialogProps } from "./ModalDialog.types";

const meta = {
  title: "UI/Overlays/ModalDialog",
  component: ModalDialog,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=62-3582&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    displayType: {
      control: "select",
      options: [ModalDialogType.modal, ModalDialogType.aside],
      description:
        "Shows the dialog as a centred modal or a side panel at every width. `displayTypeDetailed` wins over it.",
      table: {
        defaultValue: { summary: "modal" },
      },
    },
    visible: {
      control: "boolean",
      description:
        "Shows the dialog. It stays mounted either way, so render it conditionally to remove it.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isCloseable: {
      control: "boolean",
      description:
        "Whether the user may close the dialog at all. The cross, Escape and a backdrop click share one guard, so `false` stops all three.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isLoading: {
      control: "boolean",
      description:
        "Replaces the header, body and footer with a skeleton of the current display type.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLarge: {
      control: "boolean",
      description: "**`MODAL-ONLY`** Sets width: 520px and max-height: 400px",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isHuge: {
      control: "boolean",
      description: "**`MODAL-ONLY`** Sets predefined huge size",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    autoMaxHeight: {
      control: "boolean",
      description:
        "**`MODAL-ONLY`** Lifts the height cap, so the modal grows with its content.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    autoMaxWidth: {
      control: "boolean",
      description:
        "**`MODAL-ONLY`** Lets the width follow the content instead of the fixed 400px.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withFooterBorder: {
      control: "boolean",
      description: "**`MODAL-ONLY`** Displays border between body and footer",
      table: {
        defaultValue: { summary: "true for aside, false for modal" },
      },
    },
    withBodyScroll: {
      control: "boolean",
      description:
        "**`ASIDE-ONLY`** Wraps the side panel's body in the kit's scrollbar.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isScrollLocked: {
      control: "boolean",
      description: "**`ASIDE-ONLY`** Locks the scroll in body section",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    zIndex: {
      control: "number",
      description: "Stacking order of the backdrop, which holds the dialog.",
      table: {
        defaultValue: { summary: "310" },
      },
    },
    displayTypeDetailed: {
      control: "object",
      description: "Detailed display type for each dimension",
    },
    onClose: {
      action: "onClose",
      description:
        "Called by the cross, Escape, a backdrop click or a swipe down.",
    },
    onBackClick: {
      action: "onBackClick",
      description: "Called by the back arrow.",
    },
    isBackButton: {
      control: "boolean",
      description:
        "Whether a back arrow is rendered before the title. It is mirrored in RTL.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    closeOnBackdropClick: {
      control: "boolean",
      description:
        "Whether a click on the backdrop closes the dialog. Unlike `isCloseable`, this stops only that one route; the cross and Escape keep working.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    backdropVisible: {
      control: "boolean",
      description: "Controls the visibility of the backdrop overlay",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    withForm: {
      control: "boolean",
      description: "Wraps content in form element",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onSubmit: {
      action: "onSubmit",
      description: "Form submit handler",
    },
    withoutPadding: {
      control: "boolean",
      description: "Removes default padding from body",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutHeaderMargin: {
      control: "boolean",
      description: "Removes default margin from header",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDoubleFooterLine: {
      control: "boolean",
      description:
        "Stacks the footer in a column, so each `<div>` in it becomes a row of buttons.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hideContent: {
      control: "boolean",
      description:
        "Renders the backdrop without the dialog surface, so none of the content mounts.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    embedded: {
      control: "boolean",
      description:
        "Turns closing off: no cross, and neither Escape nor the backdrop calls `onClose`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    containerVisible: {
      control: "boolean",
      description:
        "**`ASIDE-ONLY`** Allows embedding modal as aside dialog inside parent container",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withBorder: {
      control: "boolean",
      description:
        "Draws a one-pixel border on the dialog's inline-start edge, where an aside meets the page. Set `--modal-dialog-aside-border` to recolour it.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withBodyScrollForcibly: {
      control: "boolean",
      description: "Forces body scroll regardless of display type",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    scrollbarCreateContext: {
      control: "boolean",
      description:
        "Makes the body's scrollbar publish itself through `ScrollbarContext`, so a descendant can scroll it. Off unless something inside needs that.",
    },
    isInvitePanelLoader: {
      control: "boolean",
      description:
        "Draws the invite panel's skeleton while the side panel is loading.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    headerIcons: {
      control: false,
      description:
        "Extra icon buttons between the title and the close cross. Each needs a `key`, an `onClick`, and an `iconNode` or a `url` fetched at runtime; its optional `label` is the button's accessible name.",
    },
    headerComponent: {
      control: false,
      description:
        "Arbitrary node rendered after the icons and before the close cross, for a control that is not an icon.",
    },
    withoutBorder: {
      control: "boolean",
      description:
        "Hides the bottom border, which otherwise spans the full width of the panel regardless of the header's own side margins.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    headerHeight: {
      control: "text",
      description:
        "Height of the header as a CSS length, such as `70px`. Without it the header is 53px tall.",
      table: {
        defaultValue: { summary: "53px" },
      },
    },
    "aria-label": {
      control: "text",
      description:
        'Accessible name of the dialog, landing on the element that carries `role="dialog"`. Prefer `aria-labelledby` when the heading is already on screen; a dialog with neither is announced as an unnamed dialog.',
    },
    "aria-labelledby": {
      control: "text",
      description:
        "`id` of the element naming the dialog — usually the heading passed to `ModalDialog.Header`, given an `id` of its own.",
    },
    "aria-describedby": {
      control: "text",
      description:
        "`id` of the element describing the dialog, announced after the name.",
    },
    id: {
      control: "text",
      description: "Applied to the dialog's outer element.",
    },
    className: {
      control: "text",
      description:
        "Added to the click-to-close layer around the dialog surface.",
    },
    style: {
      control: "object",
      description:
        "Applied to the click-to-close layer around the dialog surface.",
    },
    dataTestId: {
      control: "text",
      description: "Test id",
      table: {
        defaultValue: { summary: "modal" },
      },
    },
    ref: {
      control: false,
      description: "Reference to the modal element",
    },
    sheetRef: {
      control: false,
      description:
        'Reference to the inner sheet/content element (`<div id="modal-dialog">`)',
    },
    children: {
      control: false,
      description: "Displays the child elements",
    },
  },
  args: {
    onClose: fn(),
    onBackClick: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof ModalDialog>;

type Story = StoryObj<ComponentProps<typeof ModalDialog>>;

export default meta;

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

// The dialog is always mounted, in a portal; closed, it is hidden.
const dialog = () => screen.getByTestId("modal-dialog");

const shown = () => waitFor(() => expect(dialog()).toBeVisible());
const hidden = () => waitFor(() => expect(dialog()).not.toBeVisible());

const open = async ({ canvas, userEvent }: PlayContext, label = "Show") => {
  await userEvent.click(canvas.getByRole("button", { name: label }));
  await shown();
  return dialog();
};

const closeCross = (root: HTMLElement) =>
  within(root).queryByTestId("aside_header_close_icon_button");

// The layer around the dialog that a click on the dimmed page lands on.
const backdropLayer = () =>
  document.getElementById("modal-onMouseDown-close") as HTMLElement;

const Template = ({ ...args }: ModalDialogProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const openModal = () => setIsVisible(true);
  const closeModal = () => setIsVisible(false);

  const blocksCount = args.displayType === ModalDialogType.modal ? 1 : 20;

  useEffect(() => {
    setIsVisible(!!args.visible);
  }, [args.visible]);

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "auto";
  }, [isVisible]);

  return (
    <>
      <Button
        label="Show"
        primary
        size={ButtonSize.medium}
        onClick={openModal}
      />
      <ModalDialog
        {...args}
        visible={isVisible}
        onClose={(e) => {
          args.onClose?.(e);
          closeModal();
        }}
      >
        <ModalDialog.Header>Change password</ModalDialog.Header>

        <ModalDialog.Body>
          {Array(blocksCount)
            .fill(null)
            .map((_, index) => (
              <div key={`section-${String(index)}`}>
                <h3>Section {index + 1}</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            ))}
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <Button
            key="SendBtn"
            label="Send"
            primary
            size={ButtonSize.normal}
            onClick={closeModal}
            scale
          />
          <Button
            key="CloseBtn"
            label="Cancel"
            size={ButtonSize.normal}
            onClick={closeModal}
            scale
          />
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    children: <>test</>,
  },
  play: async (context) => {
    const { args, userEvent } = context;
    await expect(dialog()).not.toBeVisible();
    // Closed, it is mounted but no dialog to assistive technology, and its
    // controls are out of the Tab order.
    await expect(screen.queryByRole("dialog")).toBeNull();
    await expect(screen.getByTestId("modal")).toHaveAttribute("inert");
    await expect(dialog()).not.toHaveAttribute("aria-modal");

    const modal = await open(context);
    await expect(modal).toHaveAttribute("aria-modal", "true");
    await expect(screen.getByRole("dialog")).toBe(modal);
    await expect(within(modal).getByText("Change password")).toBeVisible();
    await expect(within(modal).getAllByText(/^Section \d+$/)).toHaveLength(1);

    // The cross, Escape and the dimmed page all close it through onClose.
    await userEvent.click(closeCross(modal) as HTMLElement);
    await hidden();
    await expect(args.onClose).toHaveBeenCalledTimes(1);

    await open(context);
    await userEvent.keyboard("{Escape}");
    await hidden();
    await expect(args.onClose).toHaveBeenCalledTimes(2);

    await open(context);
    await userEvent.click(backdropLayer());
    await hidden();
    await expect(args.onClose).toHaveBeenCalledTimes(3);

    // A footer button closes it without onClose.
    await open(context);
    await userEvent.click(within(modal).getByRole("button", { name: "Send" }));
    await hidden();
    await expect(args.onClose).toHaveBeenCalledTimes(3);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The centred modal, for a short task that needs an answer before the page is used again. **Show** opens it; the cross, Escape or a click on the dimmed page closes it.",
      },
      source: {
        code: `<ModalDialog visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Change password</ModalDialog.Header>
  <ModalDialog.Body>
    <p>Modal body content</p>
  </ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Send" primary onClick={closeModal} />
    <Button label="Cancel" onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>`,
      },
    },
  },
};

const AsideTemplate = ({ ...args }: ModalDialogProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const openModal = () => setIsVisible(true);
  const closeModal = () => setIsVisible(false);

  useEffect(() => {
    setIsVisible(!!args.visible);
  }, [args.visible]);

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "auto";
  }, [isVisible]);

  return (
    <>
      <Button
        label="Show Aside"
        primary
        size={ButtonSize.medium}
        onClick={openModal}
      />
      <ModalDialog
        {...args}
        visible={isVisible}
        onClose={(e) => {
          args.onClose?.(e);
          closeModal();
        }}
      >
        <ModalDialog.Header>Settings</ModalDialog.Header>

        <ModalDialog.Body>
          {Array(20)
            .fill(null)
            .map((_, index) => (
              <div key={`aside-section-${String(index)}`}>
                <h3>Section {index + 1}</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            ))}
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <Button
            label="Save"
            primary
            size={ButtonSize.normal}
            onClick={closeModal}
            scale
          />
          <Button
            label="Cancel"
            size={ButtonSize.normal}
            onClick={closeModal}
            scale
          />
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );
};

export const AsideDisplay: Story = {
  name: "Side panel",
  render: (args) => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    children: <>test</>,
  },
  play: async (context) => {
    const panel = await open(context, "Show Aside");
    // Against the right edge of the window, 480px wide.
    await waitFor(() =>
      expect(
        Math.abs(panel.getBoundingClientRect().right - window.innerWidth),
      ).toBeLessThanOrEqual(1),
    );
    await expect(panel.getBoundingClientRect().width).toBe(480);
    await expect(within(panel).getAllByText(/^Section \d+$/)).toHaveLength(20);
    await context.userEvent.click(
      within(panel).getByRole("button", { name: "Save" }),
    );
    await hidden();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A panel that slides in from the side of the window, for longer content such as settings (`displayType`). On a phone-sized window it rises from the bottom instead.",
      },
      source: {
        code: `<ModalDialog displayType={ModalDialogType.aside} visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Settings</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Save" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>`,
      },
    },
  },
};

export const LoadingState: Story = {
  name: "Loading",
  render: (args) => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    isLoading: true,
    children: <>test</>,
  },
  play: async (context) => {
    const modal = await open(context);
    // A skeleton in place of the header, body and footer.
    await expect(within(modal).queryByText("Change password")).toBeNull();
    await expect(
      within(modal).getAllByTestId("rectangle-skeleton").length,
    ).toBeGreaterThan(0);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A skeleton of the same size in place of the header, body and footer while the content loads (`isLoading`). The dialog does not jump when the data arrives.",
      },
      source: {
        code: `<ModalDialog visible={isVisible} isLoading onClose={closeModal}>
  <ModalDialog.Header>Loading...</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>`,
      },
    },
  },
};

export const AsideLoadingState: Story = {
  name: "Side panel loading",
  render: (args) => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    isLoading: true,
    children: <>test</>,
  },
  play: async (context) => {
    const panel = await open(context, "Show Aside");
    await expect(within(panel).queryByText("Settings")).toBeNull();
    await expect(
      within(panel).getAllByTestId("rectangle-skeleton").length,
    ).toBeGreaterThan(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The side panel's own skeleton, a header bar and rows of placeholders, shown while its content loads (`isLoading`).",
      },
      source: {
        code: `<ModalDialog displayType={ModalDialogType.aside} isLoading visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Loading...</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>`,
      },
    },
  },
};

export const LargeModal: Story = {
  name: "Large",
  render: (args) => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    isLarge: true,
    children: <>test</>,
  },
  play: async (context) => {
    const modal = await open(context);
    await expect(modal.getBoundingClientRect().width).toBe(520);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Large modal variant with increased width (520px) and max-height (400px).",
      },
      source: {
        code: `<ModalDialog visible={isVisible} isLarge onClose={closeModal}>
  <ModalDialog.Header>Large Modal</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="OK" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>`,
      },
    },
  },
};

export const HugeModal: Story = {
  name: "Huge",
  render: (args) => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    isHuge: true,
    autoMaxWidth: true,
    autoMaxHeight: true,
    children: <>test</>,
  },
  play: async (context) => {
    const modal = await open(context);
    // Sized by its content, up to 730px.
    const { width } = modal.getBoundingClientRect();
    await expect(width).toBeGreaterThan(400);
    await expect(width).toBeLessThanOrEqual(730);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Huge modal variant with auto max width and height. Requires autoMaxWidth to be enabled.",
      },
      source: {
        code: `<ModalDialog visible={isVisible} isHuge autoMaxWidth autoMaxHeight onClose={closeModal}>
  <ModalDialog.Header>Huge Modal</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="OK" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>`,
      },
    },
  },
};

export const AutoSizeModal: Story = {
  name: "Sized to content",
  render: (args) => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    autoMaxWidth: true,
    autoMaxHeight: true,
    children: <>test</>,
  },
  play: async (context) => {
    const modal = await open(context);
    // The fixed 400px gives way to the width of the content.
    await expect(modal.getBoundingClientRect().width).toBeGreaterThan(400);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Modal with automatic max width and height that adjusts to content size.",
      },
      source: {
        code: `<ModalDialog visible={isVisible} autoMaxWidth autoMaxHeight onClose={closeModal}>
  <ModalDialog.Header>Auto Size</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>`,
      },
    },
  },
};

export const WithFooterBorder: Story = {
  name: "With a footer border",
  render: (args) => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    withFooterBorder: true,
    children: <>test</>,
  },
  play: async (context) => {
    const modal = await open(context);
    const footer = modal.querySelector(".modal-footer") as HTMLElement;
    await expect(getComputedStyle(footer).borderTopWidth).toBe("1px");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Modal with a visible border between the body and footer sections for visual separation.",
      },
      source: {
        code: `<ModalDialog visible={isVisible} withFooterBorder onClose={closeModal}>
  <ModalDialog.Header>With Footer Border</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="OK" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>`,
      },
    },
  },
};

export const NonCloseable: Story = {
  name: "Not closable",
  render: (args) => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    isCloseable: false,
    children: <>test</>,
  },
  play: async (context) => {
    const { args, userEvent } = context;
    const modal = await open(context);
    await expect(closeCross(modal)).toBeNull();
    // Neither Escape nor the dimmed page close it.
    await userEvent.keyboard("{Escape}");
    await userEvent.click(backdropLayer());
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expect(modal).toBeVisible();
    await expect(args.onClose).not.toHaveBeenCalled();
    await userEvent.click(
      within(modal).getByRole("button", { name: "Cancel" }),
    );
    await hidden();
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a choice the user has to make: there is no close cross, and Escape and a click on the dimmed page do nothing (`isCloseable={false}`). Only the footer buttons close it here.",
      },
      source: {
        code: `<ModalDialog visible={isVisible} isCloseable={false} onClose={closeModal}>
  <ModalDialog.Header>Non-Closeable</ModalDialog.Header>
  <ModalDialog.Body>Must use footer button to close</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Close" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>`,
      },
    },
  },
};

export const AsideScrollLocked: Story = {
  name: "Side panel, scroll locked",
  render: (args) => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    withBodyScroll: true,
    isScrollLocked: true,
    children: <>test</>,
  },
  play: async (context) => {
    const panel = await open(context, "Show Aside");
    const scroller = within(panel).getByTestId("scroller");
    await expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight);
    await expect(getComputedStyle(scroller).overflowY).toBe("hidden");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same long panel with its scrolling switched off (`isScrollLocked`). It suits a moment when the content must stay put, such as while a menu inside is open.",
      },
      source: {
        code: `<ModalDialog displayType={ModalDialogType.aside} withBodyScroll isScrollLocked visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Scroll Locked</ModalDialog.Header>
  <ModalDialog.Body>Scrollable content</ModalDialog.Body>
</ModalDialog>`,
      },
    },
  },
};

export const AsideWithBodyScroll: Story = {
  name: "Side panel, scrolling body",
  render: (args) => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    withBodyScroll: true,
    children: <>test</>,
  },
  play: async (context) => {
    const panel = await open(context, "Show Aside");
    // The body scrolls inside the panel; header and footer stay.
    const scroller = within(panel).getByTestId("scroller");
    await expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight);
    await expect(getComputedStyle(scroller).overflowY).not.toBe("hidden");
    const footer = (
      panel.querySelector(".modal-footer") as HTMLElement
    ).getBoundingClientRect();
    await expect(footer.bottom).toBeLessThanOrEqual(window.innerHeight + 1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Aside panel with body scroll enabled, allowing content to scroll within the panel.",
      },
      source: {
        code: `<ModalDialog displayType={ModalDialogType.aside} withBodyScroll visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Scrollable Aside</ModalDialog.Header>
  <ModalDialog.Body>Long scrollable content</ModalDialog.Body>
</ModalDialog>`,
      },
    },
  },
};

export const AsideNonCloseable: Story = {
  name: "Side panel, not closable",
  render: (args) => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    isCloseable: false,
    children: <>test</>,
  },
  play: async (context) => {
    const { args, userEvent } = context;
    const panel = await open(context, "Show Aside");
    await expect(closeCross(panel)).toBeNull();
    await userEvent.keyboard("{Escape}");
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expect(panel).toBeVisible();
    await expect(args.onClose).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The side panel with no close cross; Escape and a click on the dimmed page do nothing either (`isCloseable={false}`). Only the footer buttons close it here.",
      },
      source: {
        code: `<ModalDialog displayType={ModalDialogType.aside} isCloseable={false} visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Non-Closeable Aside</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Close" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>`,
      },
    },
  },
};

export const WithBackButton: Story = {
  name: "With a back arrow",
  render: (args) => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    isBackButton: true,
    children: <>test</>,
  },
  play: async (context) => {
    const { args, userEvent } = context;
    const panel = await open(context, "Show Aside");
    await userEvent.click(
      within(panel).getByTestId("aside_header_back_icon_button"),
    );
    await expect(args.onBackClick).toHaveBeenCalledTimes(1);
    // Backspace outside a text field goes back too.
    await userEvent.keyboard("{Backspace}");
    await expect(args.onBackClick).toHaveBeenCalledTimes(2);
    await expect(panel).toBeVisible();
    await expect(args.onClose).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A panel reached from another one gets a back arrow before its title (`isBackButton`). The arrow and Backspace outside a text field both call `onBackClick`.",
      },
      source: {
        code: `<ModalDialog
  displayType={ModalDialogType.aside}
  isBackButton
  onBackClick={handleBack}
  visible={isVisible}
  onClose={closeModal}
>
  <ModalDialog.Header>Settings</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>`,
      },
    },
  },
};

export const BackdropClickDisabled: Story = {
  name: "Backdrop click ignored",
  render: (args) => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    closeOnBackdropClick: false,
    children: <>test</>,
  },
  play: async (context) => {
    const { args, userEvent } = context;
    const modal = await open(context);
    await userEvent.click(backdropLayer());
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expect(modal).toBeVisible();
    await expect(args.onClose).not.toHaveBeenCalled();
    // Escape still closes it.
    await userEvent.keyboard("{Escape}");
    await hidden();
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A click on the dimmed page leaves the dialog open (`closeOnBackdropClick={false}`), so a stray click cannot throw away what the user typed. The close cross and Escape still close it.",
      },
      source: {
        code: `<ModalDialog visible={isVisible} closeOnBackdropClick={false} onClose={closeModal}>
  <ModalDialog.Header>Change password</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>`,
      },
    },
  },
};

const FormTemplate = ({ ...args }: ModalDialogProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");

  const closeModal = () => setIsVisible(false);

  return (
    <>
      <Button
        label="Show"
        primary
        size={ButtonSize.medium}
        onClick={() => setIsVisible(true)}
      />
      <ModalDialog
        {...args}
        visible={isVisible}
        onClose={(e) => {
          args.onClose?.(e);
          closeModal();
        }}
        onSubmit={(e) => {
          args.onSubmit?.(e);
          closeModal();
        }}
      >
        <ModalDialog.Header>Rename folder</ModalDialog.Header>
        <ModalDialog.Body>
          <TextInput
            type={InputType.text}
            value={name}
            placeholder="Folder name"
            onChange={(e) => setName(e.target.value)}
            scale
          />
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            label="Save"
            type="submit"
            primary
            size={ButtonSize.normal}
            scale
          />
          <Button
            label="Cancel"
            size={ButtonSize.normal}
            onClick={closeModal}
            scale
          />
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );
};

export const FormDialog: Story = {
  name: "Form",
  render: (args) => <FormTemplate {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    withForm: true,
    children: <>test</>,
  },
  play: async (context) => {
    const { args, userEvent } = context;
    const modal = await open(context);
    // Enter in the field submits.
    await userEvent.type(
      within(modal).getByPlaceholderText("Folder name"),
      "Reports{Enter}",
    );
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
    await hidden();
    // So does the Save button.
    await open(context);
    await userEvent.click(within(modal).getByRole("button", { name: "Save" }));
    await expect(args.onSubmit).toHaveBeenCalledTimes(2);
    await hidden();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A dialog that collects a value (`withForm`). Enter in the field or the Save button submits it, and `onSubmit` gets the event with the page reload already prevented.",
      },
      source: {
        code: `<ModalDialog visible={isVisible} withForm onSubmit={handleSubmit} onClose={closeModal}>
  <ModalDialog.Header>Rename folder</ModalDialog.Header>
  <ModalDialog.Body>
    <TextInput type={InputType.text} value={name} onChange={handleChange} scale />
  </ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Save" type="submit" primary scale />
    <Button label="Cancel" onClick={closeModal} scale />
  </ModalDialog.Footer>
</ModalDialog>`,
      },
    },
  },
};

const DoubleFooterTemplate = ({ ...args }: ModalDialogProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const closeModal = () => setIsVisible(false);

  return (
    <>
      <Button
        label="Show"
        primary
        size={ButtonSize.medium}
        onClick={() => setIsVisible(true)}
      />
      <ModalDialog
        {...args}
        visible={isVisible}
        onClose={(e) => {
          args.onClose?.(e);
          closeModal();
        }}
      >
        <ModalDialog.Header>Leave without saving?</ModalDialog.Header>
        <ModalDialog.Body>
          <p>Your changes to this document will be lost.</p>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <div>
            <Button
              label="Save and leave"
              primary
              size={ButtonSize.normal}
              onClick={closeModal}
              scale
            />
          </div>
          <div>
            <Button
              label="Leave"
              size={ButtonSize.normal}
              onClick={closeModal}
              scale
            />
            <Button
              label="Cancel"
              size={ButtonSize.normal}
              onClick={closeModal}
              scale
            />
          </div>
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );
};

export const TwoFooterRows: Story = {
  name: "Two footer rows",
  render: (args) => <DoubleFooterTemplate {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    isDoubleFooterLine: true,
    children: <>test</>,
  },
  play: async (context) => {
    const modal = await open(context);
    const main = within(modal)
      .getByRole("button", { name: "Save and leave" })
      .getBoundingClientRect();
    const leave = within(modal)
      .getByRole("button", { name: "Leave" })
      .getBoundingClientRect();
    const cancel = within(modal)
      .getByRole("button", { name: "Cancel" })
      .getBoundingClientRect();
    // The main action on a row above the other two, which share one.
    await expect(main.bottom).toBeLessThanOrEqual(leave.top);
    await expect(leave.top).toBe(cancel.top);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A footer of two rows: the main action above the other two (`isDoubleFooterLine`). Three actions do not fit one row of a 400px dialog, so each `<div>` becomes a row.",
      },
      source: {
        code: `<ModalDialog visible={isVisible} isDoubleFooterLine onClose={closeModal}>
  <ModalDialog.Header>Leave without saving?</ModalDialog.Header>
  <ModalDialog.Body>Your changes to this document will be lost.</ModalDialog.Body>
  <ModalDialog.Footer>
    <div>
      <Button label="Save and leave" primary scale />
    </div>
    <div>
      <Button label="Leave" scale />
      <Button label="Cancel" scale />
    </div>
  </ModalDialog.Footer>
</ModalDialog>`,
      },
    },
  },
};

const ContainerTemplate = ({ ...args }: ModalDialogProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showContainer, setShowContainer] = useState(false);

  const closeModal = () => {
    setIsVisible(false);
    setShowContainer(false);
  };

  return (
    <>
      <Button
        label="Show Aside"
        primary
        size={ButtonSize.medium}
        onClick={() => setIsVisible(true)}
      />
      <ModalDialog
        {...args}
        visible={isVisible}
        containerVisible={showContainer}
        onClose={(e) => {
          args.onClose?.(e);
          closeModal();
        }}
      >
        <ModalDialog.Header>Settings</ModalDialog.Header>
        <ModalDialog.Body>
          <p>The panel's own content.</p>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            label="Open details"
            primary
            size={ButtonSize.normal}
            onClick={() => setShowContainer(true)}
            scale
          />
        </ModalDialog.Footer>
        <ModalDialog.Container>
          <div style={{ padding: 16 }}>
            <p>Details replace the whole panel.</p>
            <Button
              label="Back"
              size={ButtonSize.normal}
              onClick={() => setShowContainer(false)}
            />
          </div>
        </ModalDialog.Container>
      </ModalDialog>
    </>
  );
};

export const AsideWithContainer: Story = {
  name: "Side panel with a second view",
  render: (args) => <ContainerTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    children: <>test</>,
  },
  play: async (context) => {
    const { userEvent } = context;
    const panel = await open(context, "Show Aside");
    await userEvent.click(
      within(panel).getByRole("button", { name: "Open details" }),
    );
    // The container replaces the header, body and footer.
    await expect(
      within(panel).getByText("Details replace the whole panel."),
    ).toBeVisible();
    await expect(within(panel).queryByText("Settings")).toBeNull();
    await userEvent.click(within(panel).getByRole("button", { name: "Back" }));
    await expect(within(panel).getByText("Settings")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A side panel that swaps in a second view without closing (`containerVisible`). Open details shows the `ModalDialog.Container` slot in place of the rest, and Back returns. The centred modal ignores the slot.",
      },
      source: {
        code: `<ModalDialog
  displayType={ModalDialogType.aside}
  containerVisible={showDetails}
  visible={isVisible}
  onClose={closeModal}
>
  <ModalDialog.Header>Settings</ModalDialog.Header>
  <ModalDialog.Body>The panel's own content.</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Open details" primary onClick={() => setShowDetails(true)} />
  </ModalDialog.Footer>
  <ModalDialog.Container>
    <DetailsView onBack={() => setShowDetails(false)} />
  </ModalDialog.Container>
</ModalDialog>`,
      },
    },
  },
};

// Framed on Docs: the theme provider stamps the direction on the page, which would flip the whole Docs page.
export const RightToLeft: Story = {
  name: "Right to left",
  render: (args) => (
    <div dir="rtl">
      <AsideTemplate {...args} />
    </div>
  ),
  globals: { direction: "rtl" },
  play: async (context) => {
    const panel = await open(context, "Show Aside");
    // Against the left edge; the close cross left of the back arrow.
    await waitFor(() =>
      expect(Math.abs(panel.getBoundingClientRect().left)).toBeLessThanOrEqual(
        1,
      ),
    );
    const back = within(panel)
      .getByTestId("aside_header_back_icon_button")
      .getBoundingClientRect();
    await expect(
      (closeCross(panel) as HTMLElement).getBoundingClientRect().right,
    ).toBeLessThan(back.left);
  },
  args: {
    displayType: ModalDialogType.aside,
    isBackButton: true,
    children: <>test</>,
  },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "420px" },
      description: {
        story:
          "The side panel under a right-to-left interface, attached to the left edge and sliding in from there. The back arrow points the other way, and the cross sits on the left. The direction comes from the theme's `interfaceDirection`.",
      },
      source: {
        code: `<ModalDialog
  displayType={ModalDialogType.aside}
  isBackButton
  onBackClick={handleBack}
  visible={isVisible}
  onClose={closeModal}
>
  <ModalDialog.Header>Settings</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>`,
      },
    },
  },
};

// Read on the dialog's outer element, above the layer its `style` prop reaches, so they go on the page.
const PAGE_VARIABLES: Record<string, string> = {
  "--modal-dialog-backdrop": "rgba(30, 27, 75, 0.4)",
  "--modal-dialog-radius": "16px",
  "--modal-dialog-horizontal-padding": "24px",
  "--modal-dialog-vertical-padding": "20px",
  "--modal-dialog-buttons-gap": "12px",
  "--modal-dialog-header-offset": "8px",
  "--modal-dialog-default-width": "460px",
  "--modal-dialog-default-max-height": "320px",
  "--modal-dialog-aside-default-width": "360px",
  "--modal-dialog-header-justify": "flex-end",
  "--modal-dialog-header-border-display": "none",
  "--modal-dialog-header-title-position": "absolute",
  "--modal-dialog-header-title-inset": "50%",
  "--modal-dialog-header-title-transform": "translateX(-50%)",
  "--modal-dialog-header-title-text-align": "center",
};

const CssCustomizationTemplate = () => {
  const [openDialog, setOpenDialog] = useState<"modal" | "aside" | null>(null);

  useEffect(() => {
    if (!openDialog) return undefined;
    const { style } = document.body;
    Object.entries(PAGE_VARIABLES).forEach(([name, value]) =>
      style.setProperty(name, value),
    );
    return () => {
      Object.keys(PAGE_VARIABLES).forEach((name) => style.removeProperty(name));
    };
  }, [openDialog]);

  const close = () => setOpenDialog(null);

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button
        label="Show"
        primary
        size={ButtonSize.medium}
        onClick={() => setOpenDialog("modal")}
      />
      <Button
        label="Show Aside"
        size={ButtonSize.medium}
        onClick={() => setOpenDialog("aside")}
      />
      <ModalDialog
        visible={openDialog === "modal"}
        onClose={close}
        displayType={ModalDialogType.modal}
        withFooterBorder
        style={
          {
            "--modal-dialog-bg": "#1e1b4b",
            "--modal-dialog-color": "#e0e7ff",
            "--modal-dialog-divider": "#818cf8",
          } as CSSProperties
        }
      >
        <ModalDialog.Header>Custom styled dialog</ModalDialog.Header>
        <ModalDialog.Body>
          <p>This dialog uses CSS custom properties for theming.</p>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            label="Confirm"
            primary
            size={ButtonSize.normal}
            scale
            onClick={close}
          />
          <Button
            label="Cancel"
            size={ButtonSize.normal}
            scale
            onClick={close}
          />
        </ModalDialog.Footer>
      </ModalDialog>
      <ModalDialog
        visible={openDialog === "aside"}
        onClose={close}
        displayType={ModalDialogType.aside}
        withBorder
        style={
          {
            "--modal-dialog-bg": "#1e1b4b",
            "--modal-dialog-color": "#e0e7ff",
            "--modal-dialog-divider": "#818cf8",
            "--modal-dialog-aside-border": "#f59e0b",
          } as CSSProperties
        }
      >
        <ModalDialog.Header>Custom styled panel</ModalDialog.Header>
        <ModalDialog.Body>
          <p>The same variables on the side panel.</p>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            label="Close"
            primary
            size={ButtonSize.normal}
            scale
            onClick={close}
          />
        </ModalDialog.Footer>
      </ModalDialog>
    </div>
  );
};

export const CssCustomization: Story = {
  name: "CSS variables",
  render: () => <CssCustomizationTemplate />,
  play: async ({ canvas, userEvent }) => {
    const [modal, aside] = screen.getAllByTestId("modal-dialog");

    await userEvent.click(canvas.getByRole("button", { name: "Show" }));
    await waitFor(() => expect(modal).toBeVisible());
    const box = getComputedStyle(modal);
    await expect(box.backgroundColor).toBe("rgb(30, 27, 75)");
    await expect(box.width).toBe("460px");
    await expect(box.borderTopLeftRadius).toBe("16px");
    await userEvent.click(
      within(modal).getByRole("button", { name: "Cancel" }),
    );
    await waitFor(() => expect(modal).not.toBeVisible());

    await userEvent.click(canvas.getByRole("button", { name: "Show Aside" }));
    await waitFor(() => expect(aside).toBeVisible());
    await expect(getComputedStyle(aside).width).toBe("360px");
    await expect(getComputedStyle(aside).borderLeftColor).toBe(
      "rgb(245, 158, 11)",
    );
  },
  parameters: {
    docs: {
      description: {
        story: `The modal and side panel restyled. The colours sit on each dialog's \`style\`; the page-level variables go on \`body\`.

- **Show** — the modal (\`withFooterBorder\`): radius, size, paddings, gaps, backdrop and a centred title without its line.
- **Show Aside** — the side panel (\`withBorder\`): its border and width.`,
      },
      source: {
        code: `/* Page-level variables */
body {
  --modal-dialog-radius: 16px;
  --modal-dialog-default-width: 460px;
  --modal-dialog-horizontal-padding: 24px;
  --modal-dialog-buttons-gap: 12px;
}

<ModalDialog
  visible={isVisible}
  withFooterBorder
  style={{
    "--modal-dialog-bg": "#1e1b4b",
    "--modal-dialog-color": "#e0e7ff",
    "--modal-dialog-divider": "#818cf8",
  }}
  onClose={closeModal}
>
  ...
</ModalDialog>`,
      },
    },
  },
};
