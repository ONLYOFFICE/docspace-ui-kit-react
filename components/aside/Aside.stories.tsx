import { useEffect, useState } from "react";
import type { ComponentProps, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";

import { Aside } from ".";
import type { AsideProps } from "./Aside.types";
import { Button, ButtonSize } from "../button";
import { TextInput, InputSize, InputType } from "../text-input";
import { ToggleButton } from "../toggle-button";
import { Avatar, AvatarSize, AvatarRole } from "../avatar";
import { Text } from "../text";
import { Label } from "../label";
import { Backdrop } from "../backdrop";
import DefaultUserPhotoUrl from "../../assets/default_user_photo_size_82-82.png";

import styles from "./Aside.stories.module.scss";

const meta = {
  title: "UI/Overlays/Aside",
  component: Aside,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    layout: "fullscreen",
    // Every story framed on Docs. Inline, the scene's `100vh` is the whole
    // Docs window, and Storybook's zoom wrapper carries a transform, which
    // makes the panel's `position: fixed` relative to the story block: the
    // closed panel, moved off to the right, then widens the block and it
    // scrolls sideways. In its own frame the panel is fixed to that frame.
    docs: { story: { inline: false, height: "600px" } },
    // The scene pads itself; the preview's own 20px would push it past the
    // bottom of the frame.
    noPadding: true,
  },
  argTypes: {
    visible: {
      control: "boolean",
      description:
        "Whether the panel is slid into view; the panel and its children stay mounted either way. Required",
    },
    scale: {
      control: "boolean",
      description:
        "Makes the panel take the full width of the window instead of 480px",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    zIndex: {
      control: "number",
      description:
        "Stacking order of the panel; a backdrop of your own needs a lower value",
      table: {
        defaultValue: { summary: "400" },
      },
    },
    withoutHeader: {
      control: "boolean",
      description:
        "Renders no header at all, which also removes the close cross, the only control that calls `onClose`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutBodyScroll: {
      control: "boolean",
      description:
        "Renders the children directly instead of inside the kit's scrollbar; it does not lock the page's scroll",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    header: {
      control: "text",
      description:
        "Title of the panel: a string is shown as bold 21px text, any other node inside a heading that cuts off with an ellipsis",
    },
    isBackButton: {
      control: "boolean",
      description:
        "Shows a back arrow before the title, which calls `onBackClick`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isCloseable: {
      control: "boolean",
      description: "Shows the close cross, which calls `onClose`",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isLoading: {
      control: "boolean",
      description:
        "Replaces the whole header, title, icons and close cross alike, with a skeleton bar",
      table: {
        defaultValue: { summary: "false" },
      },
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
      description:
        "Height of the header as a CSS length, such as `70px`; without it the header is 53px tall",
    },
    headerIcons: {
      control: false,
      description:
        "Extra icon buttons between the title and the close cross, each with a `key`, an `onClick` and an `iconNode` or a `url`",
    },
    headerComponent: {
      control: false,
      description:
        "Any node shown in the header after the icons and before the close cross",
    },
    onClose: {
      action: "close clicked",
      description:
        "Called when the close cross is clicked; nothing else closes the panel",
    },
    onBackClick: {
      action: "back clicked",
      description: "Called when the back arrow is clicked",
    },
    className: {
      control: "text",
      description: "Class name added to the `<aside>` element",
    },
    children: {
      control: false,
      description: "Content of the panel, shown below the header",
    },
  },
  args: {
    onClose: fn(),
    onBackClick: fn(),
  },
} satisfies Meta<typeof Aside>;

type Story = StoryObj<ComponentProps<typeof Aside>>;

export default meta;

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

// The panel is always mounted; closed, it sits just outside the window.
const slidIn = (aside: HTMLElement) =>
  waitFor(() => {
    const { left, right } = aside.getBoundingClientRect();
    expect(left).toBeGreaterThanOrEqual(-1);
    expect(right).toBeLessThanOrEqual(window.innerWidth + 1);
  });

const slidOut = (aside: HTMLElement) =>
  waitFor(() => {
    const { left, right } = aside.getBoundingClientRect();
    expect(left >= window.innerWidth - 1 || right <= 1).toBe(true);
  });

const openPanel = async ({ canvas, userEvent }: PlayContext) => {
  const aside = canvas.getByTestId("aside");
  await userEvent.click(canvas.getByRole("button", { name: "Open Panel" }));
  await slidIn(aside);
  return aside;
};

const closeButton = (aside: HTMLElement) =>
  within(aside).getByTestId("aside_header_close_icon_button");

const pageStyles: React.CSSProperties = {
  // Exactly one window tall, padding included.
  boxSizing: "border-box",
  height: "100vh",
  padding: "32px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  fontFamily: "'Open Sans', sans-serif",
  backgroundColor: "var(--aside-story-page)",
};

const cardStyles: React.CSSProperties = {
  backgroundColor: "var(--aside-story-card)",
  borderRadius: "6px",
  padding: "20px",
  border: "1px solid var(--aside-story-border)",
};

const Template = (args: AsideProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!!args.visible);
  }, [args.visible]);

  const open = () => setIsVisible(true);
  const close = () => {
    setIsVisible(false);
    args.onClose?.();
  };

  return (
    <div className={styles.scene} style={pageStyles}>
      <div style={cardStyles}>
        <Text fontSize="22px" fontWeight={600}>
          Documents
        </Text>
        <Text
          fontSize="13px"
          style={{ marginTop: "8px", color: "var(--aside-story-muted)" }}
        >
          Click the button below to open the side panel.
        </Text>
        <Button
          label="Open Panel"
          primary
          size={ButtonSize.medium}
          onClick={open}
          style={{ marginTop: "16px" }}
        />
      </div>

      <div
        style={{
          ...cardStyles,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--aside-story-faint)",
          fontSize: "14px",
        }}
      >
        Main content area
      </div>

      <Backdrop visible={isVisible} onClick={close} zIndex={399} isAside />
      <Aside {...args} visible={isVisible} onClose={close}>
        {args.children}
      </Aside>
    </div>
  );
};

const SettingsContent = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const sectionStyle: React.CSSProperties = {
    padding: "16px 20px",
    borderBottom: "1px solid var(--aside-story-border)",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
  };

  return (
    <div>
      <div style={sectionStyle}>
        <Text fontWeight={600} fontSize="14px">
          Notifications
        </Text>
        <div style={rowStyle}>
          <Text fontSize="13px">Email notifications</Text>
          <ToggleButton
            isChecked={emailNotifications}
            onChange={() => setEmailNotifications((v) => !v)}
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <Text fontWeight={600} fontSize="14px">
          Appearance
        </Text>
        <div style={rowStyle}>
          <Text fontSize="13px">Dark mode</Text>
          <ToggleButton
            isChecked={darkMode}
            onChange={() => setDarkMode((v) => !v)}
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <Text fontWeight={600} fontSize="14px">
          Editor
        </Text>
        <div style={rowStyle}>
          <Text fontSize="13px">Auto-save</Text>
          <ToggleButton
            isChecked={autoSave}
            onChange={() => setAutoSave((v) => !v)}
          />
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <Button label="Save Changes" primary size={ButtonSize.normal} scale />
      </div>
    </div>
  );
};

const UserProfileContent = () => (
  <div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 20px",
        borderBottom: "1px solid var(--aside-story-border)",
        gap: "12px",
      }}
    >
      <Avatar
        size={AvatarSize.big}
        source={DefaultUserPhotoUrl}
        role={AvatarRole.none}
      />
      <div style={{ textAlign: "center" }}>
        <Text fontSize="16px" fontWeight={700}>
          Team member
        </Text>
        <Text
          fontSize="13px"
          style={{ marginTop: "4px", color: "var(--aside-story-muted)" }}
        >
          member@example.com
        </Text>
      </div>
    </div>

    <div
      style={{
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div>
        <Label text="First Name" />
        <TextInput
          value="Team"
          type={InputType.text}
          size={InputSize.base}
          scale
          onChange={() => {}}
        />
      </div>
      <div>
        <Label text="Last Name" />
        <TextInput
          value="Member"
          type={InputType.text}
          size={InputSize.base}
          scale
          onChange={() => {}}
        />
      </div>
      <div>
        <Label text="Email" />
        <TextInput
          value="member@example.com"
          type={InputType.email}
          size={InputSize.base}
          scale
          onChange={() => {}}
        />
      </div>
    </div>

    <div style={{ padding: "16px 20px", display: "flex", gap: "8px" }}>
      <Button label="Save" primary size={ButtonSize.normal} scale />
      <Button label="Cancel" size={ButtonSize.normal} scale />
    </div>
  </div>
);

const FileDetailsContent = () => (
  <div>
    <div
      style={{
        padding: "20px",
        borderBottom: "1px solid var(--aside-story-border)",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <Text fontSize="15px" fontWeight={600}>
        Quarterly Report.docx
      </Text>
      <Text fontSize="12px" style={{ color: "var(--aside-story-muted)" }}>
        Last modified: Feb 10, 2026
      </Text>
    </div>

    <div style={{ padding: "16px 20px" }}>
      <Text fontWeight={600} fontSize="14px" style={{ marginBottom: "12px" }}>
        Details
      </Text>
      {[
        { label: "Type", value: "Document" },
        { label: "Size", value: "2.4 MB" },
        { label: "Owner", value: "Team member" },
        { label: "Created", value: "Jan 15, 2026" },
        { label: "Location", value: "My Documents" },
      ].map((item) => (
        <div
          key={item.label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 0",
            borderBottom: "1px solid var(--aside-story-row)",
          }}
        >
          <Text fontSize="13px" style={{ color: "var(--aside-story-muted)" }}>
            {item.label}
          </Text>
          <Text fontSize="13px">{item.value}</Text>
        </div>
      ))}
    </div>

    <div style={{ padding: "16px 20px" }}>
      <Text fontWeight={600} fontSize="14px" style={{ marginBottom: "12px" }}>
        Shared with
      </Text>
      {["Member one", "Member two", "Member three"].map((name) => (
        <div
          key={name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 0",
          }}
        >
          <Avatar
            size={AvatarSize.min}
            userName={name}
            role={AvatarRole.none}
          />
          <Text fontSize="13px">{name}</Text>
        </div>
      ))}
    </div>
  </div>
);

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    visible: false,
    header: "Panel Title",
    children: (
      <div style={{ padding: "20px" }}>
        <Text fontSize="14px">
          This is example content inside the Aside panel.
        </Text>
      </div>
    ),
  },
  play: async (context) => {
    const { args, canvas, userEvent } = context;
    const aside = canvas.getByTestId("aside");
    await expect(aside.tagName).toBe("ASIDE");
    await slidOut(aside);

    await openPanel(context);
    await expect(Math.round(aside.getBoundingClientRect().width)).toBe(480);
    await expect(within(aside).getByText("Panel Title")).toBeVisible();
    await expect(
      within(aside).getByText(
        "This is example content inside the Aside panel.",
      ),
    ).toBeVisible();

    // The cross closes it.
    await userEvent.click(closeButton(aside));
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await slidOut(aside);

    // So does the story's backdrop.
    await openPanel(context);
    await userEvent.click(canvas.getByTestId("backdrop"));
    await expect(args.onClose).toHaveBeenCalledTimes(2);
    await slidOut(aside);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The panel with a title and a short text, opened by the button on the page. Close it with the cross or by clicking the dimmed page — that dimming is a `Backdrop` of the story's own, since `Aside` renders none. Change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<Aside visible={isVisible} header="Panel Title" onClose={handleClose}>
  <div style={{ padding: "20px" }}>
    <Text>Content here</Text>
  </div>
</Aside>`,
      },
    },
  },
};

export const Settings: Story = {
  render: (args) => <Template {...args} />,
  args: {
    visible: false,
    header: "Settings",
    children: <SettingsContent />,
  },
  play: async (context) => {
    const aside = await openPanel(context);
    const toggles = within(aside).getAllByRole("checkbox");
    await expect(toggles).toHaveLength(3);
    await expect(toggles[0]).toBeChecked();
    await context.userEvent.click(toggles[0]);
    await expect(toggles[0]).not.toBeChecked();
    await expect(
      within(aside).getByRole("button", { name: "Save Changes" }),
    ).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A short settings form with switches and a save button — the kind of form a side panel holds beside the page it configures.",
      },
      source: {
        code: `<Aside visible={isVisible} header="Settings" onClose={handleClose}>
  <SettingsContent />
</Aside>`,
      },
    },
  },
};

export const UserProfile: Story = {
  render: (args) => <Template {...args} />,
  args: {
    visible: false,
    header: "Profile",
    children: <UserProfileContent />,
  },
  play: async (context) => {
    const aside = await openPanel(context);
    await expect(within(aside).getByText("Team member")).toBeVisible();
    await expect(within(aside).getByDisplayValue("Team")).toBeVisible();
    await expect(within(aside).getByDisplayValue("Member")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "An edit form with an avatar, labelled text fields and two buttons, for changing an item without leaving the page.",
      },
      source: {
        code: `<Aside visible={isVisible} header="Profile" onClose={handleClose}>
  <UserProfileContent />
</Aside>`,
      },
    },
  },
};

export const FileDetails: Story = {
  render: (args) => <Template {...args} />,
  args: {
    visible: false,
    header: "File Info",
    children: <FileDetailsContent />,
  },
  play: async (context) => {
    const aside = await openPanel(context);
    await expect(
      within(aside).getByText("Quarterly Report.docx"),
    ).toBeVisible();
    await expect(within(aside).getByText("2.4 MB")).toBeVisible();
    await expect(within(aside).getByText("Member three")).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The details of a selected file — its properties and the people it is shared with — the most common content of a side panel next to a list.",
      },
      source: {
        code: `<Aside visible={isVisible} header="File Info" onClose={handleClose}>
  <FileDetailsContent />
</Aside>`,
      },
    },
  },
};

export const WithBackButton: Story = {
  render: (args) => <Template {...args} />,
  args: {
    visible: false,
    header: "Details",
    isBackButton: true,
    children: <FileDetailsContent />,
  },
  play: async (context) => {
    const { args, userEvent } = context;
    const aside = await openPanel(context);
    // The arrow calls its own handler and leaves the panel open.
    await userEvent.click(
      within(aside).getByTestId("aside_header_back_icon_button"),
    );
    await expect(args.onBackClick).toHaveBeenCalledTimes(1);
    await expect(args.onClose).not.toHaveBeenCalled();
    await slidIn(aside);
    await userEvent.click(closeButton(aside));
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A back arrow before the title, for a panel with several levels: the arrow calls `onBackClick`, logged in the Actions panel, while the cross still closes the panel (`isBackButton`).",
      },
      source: {
        code: `<Aside visible={isVisible} header="Details" isBackButton onBackClick={handleBack} onClose={handleClose}>
  <FileDetailsContent />
</Aside>`,
      },
    },
  },
};

export const WithoutHeader: Story = {
  render: (args) => <Template {...args} />,
  args: {
    visible: false,
    withoutHeader: true,
    children: <UserProfileContent />,
  },
  play: async (context) => {
    const { args, canvas, userEvent } = context;
    const aside = await openPanel(context);
    // No header and no cross: only the page can close it.
    await expect(within(aside).queryByTestId("aside-header")).toBeNull();
    await userEvent.click(canvas.getByTestId("backdrop"));
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await slidOut(aside);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A panel with no header, for content that brings its own title bar. The close cross goes with the header, so the page has to close the panel itself — here a click on the dimmed page does (`withoutHeader`).",
      },
      source: {
        code: `<Aside visible={isVisible} withoutHeader onClose={handleClose}>
  <UserProfileContent />
</Aside>`,
      },
    },
  },
};

export const Scaled: Story = {
  render: (args) => <Template {...args} />,
  args: {
    visible: false,
    scale: true,
    header: "Full Width Panel",
    children: <SettingsContent />,
  },
  play: async (context) => {
    const aside = await openPanel(context);
    await expect(Math.round(aside.getBoundingClientRect().width)).toBe(
      window.innerWidth,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The panel across the full width of the window instead of 480px, for content that needs the room (`scale`).",
      },
      source: {
        code: `<Aside visible={isVisible} scale header="Full Width Panel" onClose={handleClose}>
  <SettingsContent />
</Aside>`,
      },
    },
  },
};

const RightToLeftTemplate = (args: AsideProps) => (
  <div dir="rtl">
    <Template {...args} />
  </div>
);

// Framed on Docs: the theme provider stamps the direction on the page, which would flip the whole Docs page.
export const RightToLeft: Story = {
  render: (args) => <RightToLeftTemplate {...args} />,
  globals: { direction: "rtl" },
  play: async ({ canvas }) => {
    const aside = canvas.getByTestId("aside");
    // Opened against the left edge.
    await waitFor(() =>
      expect(Math.abs(aside.getBoundingClientRect().left)).toBeLessThanOrEqual(
        1,
      ),
    );
    const back = within(aside)
      .getByTestId("aside_header_back_icon_button")
      .getBoundingClientRect();
    await expect(closeButton(aside).getBoundingClientRect().right).toBeLessThan(
      back.left,
    );
  },
  args: {
    visible: true,
    header: "Details",
    isBackButton: true,
    children: <FileDetailsContent />,
  },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "600px" },
      description: {
        story:
          'The same panel under a right-to-left interface: it is attached to the left edge instead of the right and slides in from there, the back arrow points the other way and the close cross sits on the left of the header. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.',
      },
      source: {
        code: `<div dir="rtl">
  <Aside visible header="Details" isBackButton onBackClick={handleBack} onClose={handleClose}>
    <FileDetailsContent />
  </Aside>
</div>`,
      },
    },
  },
};

const CssCustomizationTemplate = () => (
  <div
    style={
      {
        // === Aside — panel background and size ===
        "--aside-bg": "#e6f3fb",
        "--aside-width": "360px",
        "--aside-transition": "transform 0.2s ease",
        "--aside-mobile-footer-height": "32px",
        // === AsideHeader — title and border ===
        "--aside-header-color": "#004f82",
        "--aside-header-border": "#0082c9",
        "--aside-header-font-size": "18px",
        "--aside-header-height": "60px",
        "--aside-header-gap": "12px",
      } as CSSProperties
    }
  >
    {/* A node title, not a string: a string title ignores the color and font-size variables */}
    <Aside visible header={<span>Settings</span>} isBackButton onClose={fn()}>
      <div style={{ padding: "20px" }}>
        <p style={{ margin: "0 0 12px", fontWeight: 600, color: "#004f82" }}>
          Custom styled panel
        </p>
        <p style={{ margin: 0, fontSize: "13px", color: "#5aa9d0" }}>
          Background, width, header color and border customized via CSS vars.
        </p>
      </div>
    </Aside>
  </div>
);

// Framed on Docs: the panel is fixed to the window and has no height of its own inline.
export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  play: async ({ canvas }) => {
    const aside = canvas.getByTestId("aside");
    await slidIn(aside);
    await expect(Math.round(aside.getBoundingClientRect().width)).toBe(360);
    await expect(getComputedStyle(aside).backgroundColor).toBe(
      "rgb(230, 243, 251)",
    );
    await expect(
      getComputedStyle(within(aside).getByTestId("aside-header")).height,
    ).toBe("60px");
  },
  parameters: {
    docs: {
      story: { inline: false, height: "500px" },
      description: {
        story: `The panel and its header restyled through CSS variables on one wrapper -- the variables are listed under CSS variables on this page, and the header's on the AsideHeader page.

The title here is a node rather than a string, so the color and font-size variables reach it. The back arrow is on to show the gap between it and the title; the phone footer offset shows only in a phone-width window. The margin is left alone because the border does not follow it.`,
      },
      source: {
        code: `<div
  style={{
    "--aside-bg": "#e6f3fb",
    "--aside-width": "360px",
    "--aside-transition": "transform 0.2s ease",
    "--aside-mobile-footer-height": "32px",
    "--aside-header-color": "#004f82",
    "--aside-header-border": "#0082c9",
    "--aside-header-font-size": "18px",
    "--aside-header-height": "60px",
    "--aside-header-gap": "12px",
  }}
>
  <Aside visible header={<span>Settings</span>} isBackButton onClose={handleClose}>
    {children}
  </Aside>
</div>`,
      },
    },
  },
};
