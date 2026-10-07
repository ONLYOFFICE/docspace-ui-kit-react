import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

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

export const Default: Story = {
  args: {
    children: (
      <div style={{ padding: "16px" }}>
        <p>Children are rendered normally when no error occurs.</p>
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
          "Default usage where children render normally without any errors.",
      },
      source: {
        code: `<ErrorBoundary>
  <div style={{ padding: "16px" }}>
    <p>Children are rendered normally when no error occurs.</p>
  </div>
</ErrorBoundary>`,
      },
    },
  },
};

const ThrowingComponent = () => {
  throw new Error("Something broke!");
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
