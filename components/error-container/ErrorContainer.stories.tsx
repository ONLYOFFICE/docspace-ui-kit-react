import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import ErrorContainer from "./ErrorContainer";

const meta = {
  title: "UI/Layout components/ErrorContainer",
  component: ErrorContainer,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    headerText: {
      control: "text",
      description: "The heading, rendered as an `h1` at 23px.",
    },
    bodyText: {
      control: "text",
      description: "The line under the heading, 14px and no wider than 560px.",
    },
    buttonText: {
      control: "text",
      description:
        "Label of the action button. The button appears only when `onClickButton` is set as well.",
    },
    customizedBodyText: {
      control: "text",
      description:
        "A third line under `bodyText`, 13px and 600-weight, in the muted colour. It takes plain text, not markup.",
    },
    isPrimaryButton: {
      control: "boolean",
      description:
        "Whether the action button is the filled accent one rather than the outlined one.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isEditor: {
      control: "boolean",
      description:
        "Lays the page over its positioned parent at full width instead of in the flow, for a host such as the document editor.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hideLogo: {
      control: "boolean",
      description:
        "Hides the portal logo above the illustration. Set it outside an ONLYOFFICE Apps portal, where the logo endpoint does not resolve.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onClickButton: {
      action: "clicked",
      description:
        "Called when the action button is clicked. The button appears only when `buttonText` is set as well.",
    },
    children: {
      control: false,
      description:
        "Rendered last, below the button: the place for a support link or a details block.",
    },
    id: {
      control: "text",
      description:
        "Value of `id` on the outer element. It does not rename the four fixed ids inside (`container-inner`, `header`, `text`, `customized-text`).",
    },
    className: {
      control: "text",
      description:
        "Added after the component's own classes on the outer element.",
    },
    style: {
      control: "object",
      description: "Inline style of the outer element.",
    },
  },
  args: {
    onClickButton: fn(),
  },
} satisfies Meta<typeof ErrorContainer>;

type Story = StoryObj<ComponentProps<typeof ErrorContainer>>;

export default meta;

export const Default: Story = {
  render: (args) => <ErrorContainer {...args} />,
  args: {
    bodyText: "Try again later",
    headerText: "Some error has happened",
    customizedBodyText: "Customized body",
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", {
        level: 1,
        name: "Some error has happened",
      }),
    ).toBeVisible();
    await expect(canvas.getByText("Try again later")).toBeVisible();
    await expect(canvas.getByText("Customized body")).toBeVisible();
    await expect(canvas.getByAltText("ONLYOFFICE Apps")).toBeInTheDocument();
    // No buttonText, so no button even though onClickButton is set.
    await expect(canvas.queryByRole("button")).toBeNull();
    // The illustration is decorative: every SVG sits under aria-hidden.
    // Only the four ids the portal's stylesheets select are written.
    const root = canvas.getByTestId("ErrorContainer");
    const svgs = Array.from(root.querySelectorAll("svg"));
    await expect(svgs.length).toBeGreaterThan(0);
    for (const svg of svgs) {
      await expect(svg.closest('[aria-hidden="true"]')).not.toBeNull();
    }
    const ids = Array.from(root.querySelectorAll("[id]"), (e) => e.id);
    await expect(
      ids.every((id) =>
        ["container-inner", "header", "text", "customized-text"].includes(id),
      ),
    ).toBe(true);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The plain error page. The heading says what happened (`headerText`), and the line under it what to do (`bodyText`). The muted third line carries a detail such as an error code (`customizedBodyText`).",
      },
      source: {
        code: `<ErrorContainer
  headerText="Some error has happened"
  bodyText="Try again later"
  customizedBodyText="Customized body"
/>`,
      },
    },
  },
};

export const WithPrimaryButton: Story = {
  name: "With an action",
  render: (args) => <ErrorContainer {...args} />,
  args: {
    bodyText: "An error occurred while processing your request",
    headerText: "Some error has happened",
    buttonText: "Retry",
    isPrimaryButton: true,
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Retry" }));
    await expect(args.onClickButton).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Retry** — a filled button under the message, for the one action that gets the user out of the error (`buttonText` with `onClickButton`). Without the handler the button is not rendered at all.",
      },
      source: {
        code: `<ErrorContainer
  headerText="Some error has happened"
  bodyText="An error occurred while processing your request"
  buttonText="Retry"
  isPrimaryButton
  onClickButton={handleRetry}
/>`,
      },
    },
  },
};

export const InEditorMode: Story = {
  name: "Over the editor",
  render: (args) => <ErrorContainer {...args} />,
  args: {
    isEditor: true,
    bodyText: "Editor mode error message",
    buttonText: "Close Editor",
  },
  play: async ({ args, canvas, userEvent }) => {
    // isEditor takes the container out of the page flow.
    await expect(
      getComputedStyle(canvas.getByTestId("ErrorContainer")).position,
    ).not.toBe("static");
    await userEvent.click(canvas.getByRole("button", { name: "Close Editor" }));
    await expect(args.onClickButton).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same page laid over its host instead of pushing it down (`isEditor`). It suits a screen such as a document editor, which mounts the error over its own layout.",
      },
      source: {
        code: `<ErrorContainer
  isEditor
  bodyText="Editor mode error message"
  buttonText="Close Editor"
  onClickButton={handleClose}
/>`,
      },
    },
  },
};

export const WithChildren: Story = {
  name: "With your own content",
  render: (args) => <ErrorContainer {...args} />,
  args: {
    headerText: "Connection Error",
    bodyText: "Unable to connect to the server",
    children: (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p
          style={{
            fontSize: "14px",
            marginBottom: "12px",
            color: "var(--text-color)",
          }}
        >
          Please check the following:
        </p>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            fontSize: "14px",
            color: "var(--text-color)",
            lineHeight: "1.8",
          }}
        >
          <li>Your internet connection is active</li>
          <li>Server status at status.example.com</li>
          <li>Firewall or antivirus settings</li>
        </ul>
        <p
          style={{
            fontSize: "13px",
            marginTop: "16px",
            opacity: 0.7,
            fontStyle: "italic",
          }}
        >
          Error Code: ERR_CONNECTION_REFUSED
        </p>
      </div>
    ),
  },
  play: async ({ canvas }) => {
    // children render below the message.
    await expect(canvas.getAllByRole("listitem")).toHaveLength(3);
    await expect(
      canvas.getByText("Error Code: ERR_CONNECTION_REFUSED"),
    ).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Please check the following** — a checklist and an error code under the message (`children`), for guidance that does not fit into one line of text.",
      },
      source: {
        code: `<ErrorContainer
  headerText="Connection Error"
  bodyText="Unable to connect to the server"
>
  <div>
    <p>Please check the following:</p>
    <ul>
      <li>Your internet connection is active</li>
      <li>Server status</li>
      <li>Firewall settings</li>
    </ul>
  </div>
</ErrorContainer>`,
      },
    },
  },
};

export const WithSecondaryButton: Story = {
  name: "Outlined button",
  render: (args) => <ErrorContainer {...args} />,
  args: {
    headerText: "Some error has happened",
    bodyText: "The file could not be opened",
    buttonText: "Go back",
    isPrimaryButton: false,
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Go back" }));
    await expect(args.onClickButton).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Go back** — the same button, outlined (`isPrimaryButton` off). It suits a page where leaving is the way out, not an action the user is expected to take.",
      },
      source: {
        code: `<ErrorContainer
  headerText="Some error has happened"
  bodyText="The file could not be opened"
  buttonText="Go back"
  isPrimaryButton={false}
  onClickButton={handleBack}
/>`,
      },
    },
  },
};

export const WithoutLogo: Story = {
  name: "Without the logo",
  render: (args) => <ErrorContainer {...args} />,
  args: {
    headerText: "Some error has happened",
    bodyText: "Try again later",
    hideLogo: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByAltText("ONLYOFFICE Apps")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The page starts with the illustration, with no logo above it (`hideLogo`). It suits a host that shows its own brand or has no portal to take the logo from.",
      },
      source: {
        code: `<ErrorContainer
  headerText="Some error has happened"
  bodyText="Try again later"
  hideLogo
/>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS variables",
  play: async ({ canvas }) => {
    const header = canvas.getByText("Connection error");
    // The text variable colours customizedBodyText only.
    await expect(canvas.getByText("Error code: 503")).toHaveStyle({
      color: "rgb(29, 45, 68)",
    });
    // The background variable paints the page behind the illustration.
    const painted = (() => {
      for (let el: HTMLElement | null = header; el; el = el.parentElement) {
        if (getComputedStyle(el).backgroundColor === "rgb(230, 243, 251)") {
          return true;
        }
      }
      return false;
    })();
    await expect(painted).toBe(true);
  },
  render: () => (
    <div
      style={
        {
          "--error-container-bg": "#e6f3fb",
          "--error-container-text": "#1d2d44",
        } as CSSProperties
      }
    >
      <ErrorContainer
        headerText="Connection error"
        bodyText="Unable to connect to the server."
        customizedBodyText="Error code: 503"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Both overridable variables set on one wrapper -- the variables are listed under CSS variables on this page. The example tints the page background and the \`customizedBodyText\` line.`,
      },
      source: {
        code: `<div
  style={{
    "--error-container-bg": "#e6f3fb",
    "--error-container-text": "#1d2d44",
  }}
>
  <ErrorContainer
    headerText="Connection error"
    bodyText="Unable to connect to the server."
    customizedBodyText="Error code: 503"
  />
</div>`,
      },
    },
  },
};
