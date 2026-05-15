// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type { ComponentProps, CSSProperties } from "react";
import { useEffect, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, ButtonSize } from "../button";

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

- **Two Display Types**: Modal (centered overlay) and Aside (slide-in panel)
- **Compound Components**: Uses Header, Body, and Footer sub-components for structured layout
- **Size Variants**: Support for large, huge, and auto-sized modals
- **Scroll Control**: Configurable body scroll and scroll locking for aside mode
- **Loading State**: Built-in loading indicator for async content
- **Keyboard Support**: Escape key to close, Backspace for back navigation
- **Form Support**: Optional form wrapper with submit handling
- **Footer Border**: Optional visual separator between body and footer

### Accessibility

- \`Escape\` key closes the modal
- Focus is trapped within the modal while open
- Backdrop click closes the modal (configurable)

### Usage

\`\`\`tsx
import { ModalDialog } from "@docspace/ui-kit/components/modal-dialog";

<ModalDialog visible={isVisible} onClose={handleClose}>
  <ModalDialog.Header>Title</ModalDialog.Header>
  <ModalDialog.Body>Content here</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Save" primary onClick={handleSave} />
    <Button label="Cancel" onClick={handleClose} />
  </ModalDialog.Footer>
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
      description: "Type of modal display (modal or aside)",
      table: {
        defaultValue: { summary: "modal" },
      },
    },
    visible: {
      control: "boolean",
      description: "Controls modal visibility",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isCloseable: {
      control: "boolean",
      description: "Whether the modal can be closed via close button or backdrop",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isLoading: {
      control: "boolean",
      description: "Shows loading state in the modal body",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLarge: {
      control: "boolean",
      description: "Sets width: 520px and max-height: 400px (modal only)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isHuge: {
      control: "boolean",
      description: "Sets predefined huge size (modal only, requires autoMaxWidth)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    autoMaxHeight: {
      control: "boolean",
      description: "Automatically adjusts max height (modal only)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    autoMaxWidth: {
      control: "boolean",
      description: "Automatically adjusts max width (modal only)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withFooterBorder: {
      control: "boolean",
      description: "Adds a border between body and footer (modal only)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withBodyScroll: {
      control: "boolean",
      description: "Enables body scrolling (aside only)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isScrollLocked: {
      control: "boolean",
      description: "Locks scrolling in the body section (aside only)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    zIndex: {
      control: "number",
      description: "CSS z-index for modal layering",
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
      <ModalDialog {...args} visible={isVisible} onClose={closeModal}>
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
          "Default modal dialog displayed as a centered overlay. Click the button to open.",
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
      <ModalDialog {...args} visible={isVisible} onClose={closeModal}>
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
          "Modal dialog displayed as a slide-in aside panel from the right side.",
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
          "Modal with a loading indicator displayed in the body. Use for async content loading.",
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
        story: "Aside panel with loading state enabled.",
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
          "Modal without close button or backdrop click dismissal. Can only be closed programmatically.",
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
          "Aside panel with body scroll enabled but scroll locked. Prevents content scrolling.",
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
          "Aside panel without close button. Must be closed programmatically via footer actions.",
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

const CssCustomizationTemplate = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <Button
        label="Show"
        primary
        size={ButtonSize.medium}
        onClick={() => setIsVisible(true)}
      />
      <ModalDialog
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        displayType={ModalDialogType.modal}
        style={
          {
            "--modal-dialog-radius": "16px",
            "--modal-dialog-bg": "#1e1b4b",
            "--modal-dialog-color": "#e0e7ff",
            "--modal-dialog-default-width": "460px",
            "--modal-dialog-horizontal-padding": "24px",
            "--modal-dialog-buttons-gap": "12px",
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
            onClick={() => setIsVisible(false)}
          />
          <Button
            label="Cancel"
            size={ButtonSize.normal}
            scale
            onClick={() => setIsVisible(false)}
          />
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization. Pass via the \`style\` prop on \`<ModalDialog>\`:

\`\`\`css
--modal-dialog-bg                    /* background color */
--modal-dialog-color                 /* text color */
--modal-dialog-backdrop              /* backdrop background */
--modal-dialog-divider               /* footer border / header border color */
--modal-dialog-aside-border          /* aside panel inline-start border */
--modal-dialog-radius                /* border-radius (default: 6px) */
--modal-dialog-horizontal-padding    /* body/footer horizontal padding (default: 16px) */
--modal-dialog-vertical-padding      /* body/footer vertical padding (default: 16px) */
--modal-dialog-buttons-gap           /* footer button gap (default: 8px) */
--modal-dialog-header-offset         /* header margin-bottom (default: 16px) */
--modal-dialog-default-width         /* modal width (default: 400px) */
--modal-dialog-default-max-height    /* modal max-height (default: 280px) */
--modal-dialog-lg-width              /* large modal width (default: 520px) */
--modal-dialog-lg-max-height         /* large modal max-height (default: 400px) */
--modal-dialog-xl-max-width          /* huge modal max-width (default: 730px) */
--modal-dialog-aside-default-width   /* aside width (default: 480px) */
--modal-dialog-header-border-display /* show/hide header bottom border (default: block) */
--modal-dialog-header-title-position /* header title position (default: static) */
--modal-dialog-header-title-inset    /* header title inset for centered layout */
--modal-dialog-header-title-transform /* header title transform for centered layout */
--modal-dialog-header-title-text-align /* header title text alignment */
\`\`\``,
      },
      source: {
        code: `<ModalDialog
  visible
  style={{
    "--modal-dialog-radius": "16px",
    "--modal-dialog-bg": "#1e1b4b",
    "--modal-dialog-color": "#e0e7ff",
    "--modal-dialog-horizontal-padding": "24px",
  }}
>
  ...
</ModalDialog>`,
      },
    },
  },
};
