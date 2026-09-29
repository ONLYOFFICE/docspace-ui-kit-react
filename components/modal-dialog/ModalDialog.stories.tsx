import type { ComponentProps, CSSProperties } from "react";
import { useEffect, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, ButtonSize } from "../button";
import { InputType, TextInput } from "../text-input";

import { ModalDialog } from ".";
import { ModalDialogType } from "./ModalDialog.enums";
import type { ModalDialogProps } from "./ModalDialog.types";

const meta = {
  title: "UI/Overlays/ModalDialog",
  component: ModalDialog,
  parameters: {
    docs: {
      description: {
        component: `ModalDialog displays content in a layer above the page, requiring user interaction before returning.

### Features

- **Two Display Types**: Shows as a centered modal or as a panel sliding in from the side, and can switch between them per screen size with \`displayTypeDetailed\`
- **Compound Components**: Lays out the dialog from Header, Body, Footer and Container slots passed as direct children
- **Size Variants**: Widens the modal to a large or huge size, or lets it grow with its content in width and height
- **Scroll Control**: Scrolls a long body inside the side panel, or keeps it still with scroll locking
- **Loading State**: Replaces the whole content with a skeleton shaped like the current display type while data loads
- **Keyboard Support**: Closes on Escape and goes back on Backspace pressed outside a text field
- **Form Support**: Optional form wrapper that hands the submit event to \`onSubmit\` with the page reload already prevented
- **Footer Border**: Optional line between body and footer, drawn by default in the side panel only

### Accessibility

The dialog surface carries the dialog role; naming it and moving focus are left to the caller.

- \`Escape\` closes the dialog, and \`Backspace\` outside a field triggers \`onBackClick\`
- Backdrop click closes it, unless \`closeOnBackdropClick\` is false
- The header's close cross is announced as "close" (\`aria-label\`); \`isCloseable={false}\` removes it and stops Escape and the backdrop as well
- \`role="dialog"\` and \`aria-modal\` sit on the dialog surface. Name it with \`aria-labelledby\` pointing at your header's \`id\`, or with \`aria-label\`; a dialog with neither is announced unnamed
- **Focus is not managed.** The dialog neither moves focus into itself when it opens nor traps it, and its markup stays in the document while \`visible\` is false — so render the dialog conditionally, or its controls stay in the page's tab order behind it

### Usage

\`\`\`tsx
import {
  ModalDialog,
  ModalDialogType,
} from "@onlyoffice/apps-ui-kit/components/modal-dialog";

<ModalDialog
  visible={isVisible}
  onClose={handleClose}
  aria-labelledby="dialog-title"
>
  <ModalDialog.Header>
    <span id="dialog-title">Title</span>
  </ModalDialog.Header>
  <ModalDialog.Body>Content here</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Save" primary onClick={handleSave} />
    <Button label="Cancel" onClick={handleClose} />
  </ModalDialog.Footer>
</ModalDialog>

// A side panel with a back arrow
<ModalDialog
  visible={isVisible}
  displayType={ModalDialogType.aside}
  isBackButton
  onBackClick={handleBack}
  onClose={handleClose}
  aria-label="Settings"
>
  <ModalDialog.Header>Settings</ModalDialog.Header>
  <ModalDialog.Body>Content here</ModalDialog.Body>
</ModalDialog>
\`\`\``,
      },
    },
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
        "Whether the dialog is a centered modal or a panel attached to the side of the window",
      table: {
        defaultValue: { summary: "modal" },
      },
    },
    visible: {
      control: "boolean",
      description:
        "Whether the dialog is shown; its markup stays in the document either way",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isCloseable: {
      control: "boolean",
      description:
        "Whether the user can close the dialog at all: false removes the close cross and stops Escape and the backdrop click",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isLoading: {
      control: "boolean",
      description:
        "Replaces the header, body and footer with a skeleton of the current display type",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLarge: {
      control: "boolean",
      description:
        "Makes the modal 520px wide and up to 400px tall instead of 400px and 280px (modal only)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isHuge: {
      control: "boolean",
      description:
        "Caps the width at 730px; takes effect only together with autoMaxWidth, which lets the modal grow with its content (modal only)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    autoMaxHeight: {
      control: "boolean",
      description:
        "Removes the 280px height cap, so the modal grows with its content (modal only)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    autoMaxWidth: {
      control: "boolean",
      description:
        "Sizes the modal to its content instead of a fixed 400px width (modal only)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withFooterBorder: {
      control: "boolean",
      description: "Draws a line between the body and the footer",
      table: {
        defaultValue: { summary: "true for aside, false for modal" },
      },
    },
    withBodyScroll: {
      control: "boolean",
      description:
        "Wraps the body in the kit's scrollbar, so long content scrolls inside the panel (aside only)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isScrollLocked: {
      control: "boolean",
      description:
        "Stops the scrollable body from scrolling, together with withBodyScroll (aside only)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    zIndex: {
      control: "number",
      description: "Stacking order of the backdrop and the dialog on it",
      table: {
        defaultValue: { summary: "310" },
      },
    },
    displayTypeDetailed: {
      control: "object",
      description:
        "A display type for each of mobile, tablet and desktop widths, re-read when the window is resized; overrides displayType",
    },
    onClose: {
      action: "onClose",
      description:
        "Called by the close cross, Escape, a backdrop click and a downward swipe of the header on a phone",
    },
    onBackClick: {
      action: "onBackClick",
      description:
        "Called by the back arrow and by Backspace pressed outside a text field",
    },
    isBackButton: {
      control: "boolean",
      description: "Shows a back arrow before the title",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    closeOnBackdropClick: {
      control: "boolean",
      description:
        "Whether a click on the backdrop closes the dialog; the close cross and Escape keep working",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    backdropVisible: {
      control: "boolean",
      description:
        "Whether the backdrop dims the page; a hidden backdrop still catches clicks",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    withForm: {
      control: "boolean",
      description:
        "Wraps the header, body and footer in a form, so a submit button in the footer submits it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onSubmit: {
      action: "onSubmit",
      description:
        "Called with the submit event of the form added by withForm; the page does not reload",
    },
    withoutPadding: {
      control: "boolean",
      description: "Removes the padding around the body",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutHeaderMargin: {
      control: "boolean",
      description:
        "Removes the 16px gap between the header and the body (modal only)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDoubleFooterLine: {
      control: "boolean",
      description:
        "Stacks the footer's children in a column, each child a row of its own",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hideContent: {
      control: "boolean",
      description: "Shows the backdrop with no dialog on it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    embedded: {
      control: "boolean",
      description:
        "Removes the close cross and makes Escape and the backdrop click do nothing, whatever isCloseable says",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    containerVisible: {
      control: "boolean",
      description:
        "Shows the ModalDialog.Container slot in place of the header, body and footer (aside only)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withBorder: {
      control: "boolean",
      description:
        "Draws a one-pixel border on the edge where the side panel meets the page",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withBodyScrollForcibly: {
      control: "boolean",
      description:
        "Wraps the body in the kit's scrollbar in either display type",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    scrollbarCreateContext: {
      control: "boolean",
      description:
        "Lets content inside the scrollable body reach its scrollbar, to scroll it from code",
    },
    isInvitePanelLoader: {
      control: "boolean",
      description:
        "Shapes the side panel's loading skeleton as a list of people to invite (aside only, with isLoading)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    headerIcons: {
      control: false,
      description:
        "Extra icon buttons between the title and the close cross, each with a key, an onClick and an icon",
    },
    headerComponent: {
      control: false,
      description:
        "Any node rendered after the header icons and before the close cross",
    },
    withoutBorder: {
      control: "boolean",
      description: "Hides the line under the header",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    headerHeight: {
      control: "text",
      description: "Height of the header as a CSS length",
      table: {
        defaultValue: { summary: "53px" },
      },
    },
    blur: {
      control: false,
      description: "Accepted but not read: it changes nothing on screen",
    },
    "aria-label": {
      control: "text",
      description:
        "Accessible name of the dialog, for a dialog with no visible title",
    },
    "aria-labelledby": {
      control: "text",
      description: "id of the element naming the dialog, usually its title",
    },
    "aria-describedby": {
      control: "text",
      description:
        "id of the element describing the dialog, announced after its name",
    },
    id: {
      control: "text",
      description: "id of the outer element rendered into the page",
    },
    className: {
      control: "text",
      description: "Class added to the layer the dialog is centered on",
    },
    style: {
      control: "object",
      description: "Inline style of the layer the dialog is centered on",
    },
    dataTestId: {
      control: "text",
      description: "data-testid of the outer element",
      table: {
        defaultValue: { summary: "modal" },
      },
    },
    ref: {
      control: false,
      description: "Ref to the outer element",
    },
    sheetRef: {
      control: false,
      description: "Ref to the dialog surface itself",
    },
    children: {
      control: false,
      description:
        "The ModalDialog.Header, Body, Footer and Container slots; any other child is dropped",
    },
  },
} satisfies Meta<typeof ModalDialog>;

type Story = StoryObj<ComponentProps<typeof ModalDialog>>;

export default meta;

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
  parameters: {
    docs: {
      description: {
        story:
          "The centered modal, for a short task that needs an answer before the page is used again. Click Show to open it and close it with the cross, Escape or a click on the dimmed page; change any other prop live in the Controls panel below.",
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
  render: (args) => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    children: <>test</>,
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
  render: (args) => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    isLoading: true,
    children: <>test</>,
  },
  parameters: {
    docs: {
      description: {
        story:
          "While the content is being fetched, the header, body and footer give way to a skeleton of the same size (`isLoading`), so the dialog does not jump when the data arrives.",
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
  render: (args) => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    isLoading: true,
    children: <>test</>,
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
  render: (args) => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    isLarge: true,
    children: <>test</>,
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
  render: (args) => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    isHuge: true,
    autoMaxWidth: true,
    autoMaxHeight: true,
    children: <>test</>,
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
  render: (args) => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    autoMaxWidth: true,
    autoMaxHeight: true,
    children: <>test</>,
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
  render: (args) => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    withFooterBorder: true,
    children: <>test</>,
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
  render: (args) => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    isCloseable: false,
    children: <>test</>,
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
  render: (args) => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    withBodyScroll: true,
    isScrollLocked: true,
    children: <>test</>,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same long panel with its scrolling switched off (`isScrollLocked`), for a moment when the content must stay where it is, such as while a menu inside it is open.",
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
  render: (args) => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    withBodyScroll: true,
    children: <>test</>,
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
  render: (args) => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    isCloseable: false,
    children: <>test</>,
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
  render: (args) => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    isBackButton: true,
    children: <>test</>,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A panel reached from another one gets a back arrow before its title (`isBackButton`). The arrow and Backspace pressed outside a text field both call `onBackClick`; watch the Actions panel.",
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
  render: (args) => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    closeOnBackdropClick: false,
    children: <>test</>,
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
  render: (args) => <FormTemplate {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    withForm: true,
    children: <>test</>,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A dialog that collects a value: Enter in the field or the Save button submits it (`withForm`), and `onSubmit` receives the event with the page reload already prevented; watch the Actions panel.",
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
  render: (args) => <DoubleFooterTemplate {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    isDoubleFooterLine: true,
    children: <>test</>,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Three actions do not fit one row of a 400px dialog, so the footer stacks its children (`isDoubleFooterLine`): each `<div>` inside it becomes a row of its own, here the main action above the other two.",
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
  render: (args) => <ContainerTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    children: <>test</>,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A side panel that swaps in a second view without closing: Open details shows the `ModalDialog.Container` slot in place of the header, body and footer (`containerVisible`), and Back returns. The slot is ignored in the centered modal.",
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
  render: (args) => (
    <div dir="rtl">
      <AsideTemplate {...args} />
    </div>
  ),
  globals: { direction: "rtl" },
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
          "The side panel under a right-to-left interface: it is attached to the left edge and slides in from there, the back arrow points the other way and the close cross sits on the left of the header. The dialog renders outside the story's `<div dir=\"rtl\">`, so it takes the direction from the theme's `interfaceDirection` (the Direction toolbar).",
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
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
| --- | --- | --- |
| \`--modal-dialog-bg\` | Background of the dialog | theme-based |
| \`--modal-dialog-color\` | Text color of the dialog | theme-based |
| \`--modal-dialog-divider\` | Line between the body and the footer, with \`withFooterBorder\` | theme-based |
| \`--modal-dialog-aside-border\` | Border on the edge where the panel meets the page, with \`withBorder\` | theme-based |
| \`--modal-dialog-backdrop\` | Background of the dimmed page behind the dialog. Page-level | theme-based |
| \`--modal-dialog-radius\` | Corner radius of the modal; on a phone, of its top corners only. Page-level | \`6px\` |
| \`--modal-dialog-horizontal-padding\` | Side padding of the body and the footer. Page-level | \`16px\` |
| \`--modal-dialog-vertical-padding\` | Top and bottom padding of the footer and bottom padding of the modal's body. Page-level | \`16px\` |
| \`--modal-dialog-buttons-gap\` | Gap between the footer buttons; at tablet width and below it is always 10px. Page-level | \`8px\` |
| \`--modal-dialog-header-offset\` | Gap between the modal's header and body. Page-level | \`16px\` |
| \`--modal-dialog-default-width\` | Width of the modal. Page-level | \`400px\` |
| \`--modal-dialog-default-max-height\` | Height cap of the modal. Page-level | \`280px\` |
| \`--modal-dialog-lg-width\` | Width of the modal with \`isLarge\`. Page-level | \`520px\` |
| \`--modal-dialog-lg-max-height\` | Height cap of the modal with \`isLarge\`. Page-level | \`400px\` |
| \`--modal-dialog-xl-max-width\` | Width cap of the modal with \`isHuge\` and \`autoMaxWidth\`. Page-level | \`730px\` |
| \`--modal-dialog-aside-default-width\` | Width of the side panel above phone width. Page-level | \`480px\` |
| \`--modal-dialog-header-justify\` | How the header's items are spread along it. Page-level | \`space-between\` |
| \`--modal-dialog-header-border-display\` | \`none\` hides the line under the header. Page-level | \`""\` (shown) |
| \`--modal-dialog-header-title-position\` | CSS position of the title, \`absolute\` to center it. Page-level | \`static\` |
| \`--modal-dialog-header-title-inset\` | Distance of an absolute title from the header's start edge. Page-level | \`auto\` |
| \`--modal-dialog-header-title-transform\` | Transform of the title, such as \`translateX(-50%)\` to center it. Page-level | \`none\` |
| \`--modal-dialog-header-title-text-align\` | Text alignment of the title. Page-level | \`start\` |

The first four are read inside the dialog and can go on its \`style\` prop. The ones marked page-level are read on the dialog's outer element, above the layer \`style\` and \`className\` reach, and the dialog renders into \`document.body\`, so a wrapper around it cannot carry them either: set them on \`body\` or \`:root\`. This example sets them on \`body\` while a dialog is open.

- **Show** — the modal with \`withFooterBorder\`: colors from its \`style\` prop, and radius, width, height cap, paddings, gaps, backdrop and a centered title with no line under it from the page
- **Show Aside** — the side panel with \`withBorder\`, for \`--modal-dialog-aside-border\` and \`--modal-dialog-aside-default-width\``,
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
