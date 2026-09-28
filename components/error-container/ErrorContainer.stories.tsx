import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import ErrorContainer from "./ErrorContainer";

const meta = {
  title: "UI/Layout components/ErrorContainer",
  component: ErrorContainer,
  parameters: {
    docs: {
      description: {
        component: `A full-page error display component with animated decorative SVGs, portal logo, and customizable error messaging.

### Features

- **Animated Background**: Decorative SVG elements with CSS animations (birds, clouds, mountains, balloon)
- **Message Lines**: Shows a centred heading, an explanation line and an optional third line in the muted colour, each only when its text is set
- **Action Button**: Adds one full-width recovery button, filled or outlined, once both its label and its click handler are set
- **Editor Mode**: Lays the page over its host at full width instead of taking a place in the page flow
- **Portal Logo**: Shows the portal logo above the illustration unless it is hidden
- **Extra Content**: Renders any children last, below the button, for a support link or a details block
- **Full-Screen Page**: Fills the whole viewport height and scrolls within itself when the content is taller
- **Responsive Layout**: Stretches the button to the full width and tightens the spacing on screens narrower than 1024px

### Usage

\`\`\`tsx
import { ErrorContainer } from "@onlyoffice/apps-ui-kit/components/error-container";

// Basic error page
<ErrorContainer
  headerText="Something went wrong"
  bodyText="Please try again later"
/>

// With retry button
<ErrorContainer
  headerText="Server Error"
  bodyText="An error occurred while processing your request"
  buttonText="Retry"
  onClickButton={handleRetry}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    headerText: {
      control: "text",
      description: "The heading, rendered as an `h1` at 23px",
    },
    bodyText: {
      control: "text",
      description: "The line under the heading, 14px and no wider than 560px",
    },
    buttonText: {
      control: "text",
      description:
        "Label of the action button. The button appears only when `onClickButton` is set as well",
    },
    customizedBodyText: {
      control: "text",
      description:
        "A third line under `bodyText`, 13px and 600-weight, in the muted colour. It takes plain text: markup in the string is shown as typed",
    },
    isPrimaryButton: {
      control: "boolean",
      description:
        "Whether the action button is the filled accent one rather than the outlined one",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isEditor: {
      control: "boolean",
      description:
        "Takes the container out of the page flow and lays it over the whole width of its positioned parent, for a host that mounts it over a layout of its own",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hideLogo: {
      control: "boolean",
      description: "Hides the portal logo above the illustration",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onClickButton: {
      action: "clicked",
      description:
        "Called when the action button is clicked. The button appears only when `buttonText` is set as well",
    },
    children: {
      control: false,
      description:
        "Rendered last, below the button: the place for a support link or a details block",
    },
    id: {
      control: "text",
      description:
        "Value of `id` on the outer element. It does not rename the fixed ids of the parts inside",
    },
    className: {
      control: "text",
      description:
        "Added after the component's own classes on the outer element",
    },
    style: {
      control: "object",
      description: "Inline style of the outer element",
    },
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
  parameters: {
    docs: {
      description: {
        story:
          "The plain error page: the heading says what happened (`headerText`), the line under it says what to do (`bodyText`), and the muted third line carries a detail such as an error code (`customizedBodyText`). Change any other prop live in the Controls panel below.",
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
  render: (args) => <ErrorContainer {...args} />,
  args: {
    bodyText: "An error occurred while processing your request",
    headerText: "Some error has happened",
    buttonText: "Retry",
    isPrimaryButton: true,
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
  render: (args) => <ErrorContainer {...args} />,
  args: {
    isEditor: true,
    bodyText: "Editor mode error message",
    buttonText: "Close Editor",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same page laid over its host instead of pushing it down (`isEditor`), for a screen such as a document editor that mounts the error on top of a layout of its own.",
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
            color: "var(--gray)",
            fontStyle: "italic",
          }}
        >
          Error Code: ERR_CONNECTION_REFUSED
        </p>
      </div>
    ),
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
  render: (args) => <ErrorContainer {...args} />,
  args: {
    headerText: "Some error has happened",
    bodyText: "The file could not be opened",
    buttonText: "Go back",
    isPrimaryButton: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Go back** — the same button, outlined (`isPrimaryButton` off), for a page where leaving is the way out rather than an action the user is expected to take.",
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
  render: (args) => <ErrorContainer {...args} />,
  args: {
    headerText: "Some error has happened",
    bodyText: "Try again later",
    hideLogo: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The page starts with the illustration, with no logo above it (`hideLogo`), for a host that already shows its own brand or has no portal to take the logo from.",
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

export const CssCustomization = {
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
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--error-container-bg\` | Background of the page | white; black in the dark theme |
| \`--error-container-text\` | Colour of the \`customizedBodyText\` line | theme-based |

The heading, \`bodyText\` and the button take their colours from Heading, Text and Button.`,
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
