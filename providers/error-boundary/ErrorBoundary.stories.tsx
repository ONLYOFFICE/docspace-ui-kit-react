import React, { type ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor } from "storybook/test";

import { Button, ButtonSize } from "../../components/button";
import { Text } from "../../components/text";

import ErrorBoundary from "./ErrorBoundary";

const meta = {
  title: "Components/Providers/ErrorProvider",
  component: ErrorBoundary,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    children: {
      control: false,
      description: "Child components to render inside the error boundary",
    },
    fallback: {
      control: false,
      description:
        "Custom fallback UI as a ReactNode or a render function `(error: Error) => ReactNode`",
    },
    onError: {
      control: false,
      description:
        "Callback fired when an error is caught `(error: Error, errorInfo: ErrorInfo) => void`",
    },
  },
  args: {
    onError: fn(),
  },
} satisfies Meta<typeof ErrorBoundary>;

type Story = StoryObj<ComponentProps<typeof ErrorBoundary>>;

export default meta;

const ThrowingComponent = () => {
  throw new Error("Something broke!");
};

const BreakablePanel = () => {
  const [broken, setBroken] = React.useState(false);

  if (broken) throw new Error("Something broke!");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
        padding: "16px",
      }}
    >
      <Text fontSize="13px">
        This panel renders inside the boundary. Break it and the boundary
        replaces it with its fallback.
      </Text>
      <Button
        label="Break this panel"
        size={ButtonSize.small}
        onClick={() => setBroken(true)}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    children: <BreakablePanel />,
  },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText(/This panel renders inside/)).toBeVisible();
    await expect(args.onError).not.toHaveBeenCalled();

    await userEvent.click(
      canvas.getByRole("button", { name: "Break this panel" }),
    );
    await waitFor(() =>
      expect(
        canvas.getByRole("heading", { name: "Something went wrong" }),
      ).toBeVisible(),
    );
    await expect(canvas.queryByText(/This panel renders inside/)).toBeNull();
    await expect(args.onError).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The panel renders as usual until it throws. Press **Break this panel** and the boundary swaps it for the kit's error page and calls `onError`.",
      },
      source: {
        code: `const Panel = () => {
  const [broken, setBroken] = useState(false);
  if (broken) throw new Error("Something broke!");
  return <Button label="Break this panel" onClick={() => setBroken(true)} />;
};

<ErrorBoundary onError={(error) => report(error)}>
  <Panel />
</ErrorBoundary>`,
      },
    },
  },
};

export const WithoutError: Story = {
  args: {
    children: (
      <div style={{ padding: "16px" }}>
        <Text fontSize="13px">
          Children are rendered normally when no error occurs.
        </Text>
      </div>
    ),
  },
  play: async ({ args, canvas }) => {
    await expect(
      canvas.getByText("Children are rendered normally when no error occurs."),
    ).toBeVisible();
    await expect(args.onError).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "With nothing thrown the boundary adds nothing: its children render as they would without it.",
      },
      source: {
        code: `<ErrorBoundary>
  <Text>Children are rendered normally when no error occurs.</Text>
</ErrorBoundary>`,
      },
    },
  },
};

export const WithError: Story = {
  args: {
    children: <ThrowingComponent />,
  },
  play: async ({ args, canvas }) => {
    // The kit's own error page, with the message under its heading.
    await expect(
      canvas.getByRole("heading", { name: "Something went wrong" }),
    ).toBeVisible();
    await expect(canvas.getByText("Something broke!")).toBeVisible();
    // Called with the error and React's error info.
    await expect(args.onError).toHaveBeenCalledTimes(1);
    const [error, errorInfo] = (args.onError as ReturnType<typeof fn>).mock
      .calls[0] as [Error, unknown];
    await expect(error.message).toBe("Something broke!");
    await expect(errorInfo).toBeDefined();
  },
  parameters: {
    docs: {
      description: {
        story:
          "When a child component throws, the default ErrorContainer fallback is rendered.",
      },
      source: {
        code: `const ThrowingComponent = () => {
  throw new Error("Something broke!");
};

<ErrorBoundary>
  <ThrowingComponent />
</ErrorBoundary>`,
      },
    },
  },
};

export const WithCustomFallback: Story = {
  args: {
    fallback: (
      <div style={{ padding: "16px", color: "red" }}>
        <h3>Custom Error UI</h3>
        <p>Something went wrong. Please try again.</p>
      </div>
    ),
    children: <ThrowingComponent />,
  },
  play: async ({ args, canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "Custom Error UI" }),
    ).toBeVisible();
    await expect(canvas.queryByText("Something broke!")).toBeNull();
    await expect(args.onError).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A custom ReactNode can be provided as fallback for a fully customized error UI.",
      },
      source: {
        code: `<ErrorBoundary
  fallback={
    <div style={{ padding: "16px", color: "red" }}>
      <h3>Custom Error UI</h3>
      <p>Something went wrong. Please try again.</p>
    </div>
  }
>
  <ThrowingComponent />
</ErrorBoundary>`,
      },
    },
  },
};

export const WithRenderFunctionFallback: Story = {
  args: {
    fallback: (error: Error) => (
      <div style={{ padding: "16px", color: "red" }}>
        <h3>Error Details</h3>
        <p>{error.message}</p>
      </div>
    ),
    children: <ThrowingComponent />,
  },
  play: async ({ canvas }) => {
    // The function receives the caught error.
    await expect(
      canvas.getByRole("heading", { name: "Error Details" }),
    ).toBeVisible();
    await expect(canvas.getByText("Something broke!")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A render function receives the caught error, enabling dynamic fallback UI based on the error.",
      },
      source: {
        code: `<ErrorBoundary
  fallback={(error) => (
    <div style={{ padding: "16px", color: "red" }}>
      <h3>Error Details</h3>
      <p>{error.message}</p>
    </div>
  )}
>
  <ThrowingComponent />
</ErrorBoundary>`,
      },
    },
  },
};
