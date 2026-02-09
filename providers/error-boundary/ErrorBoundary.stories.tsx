import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import ErrorBoundary from "./ErrorBoundary";

const meta: Meta<typeof ErrorBoundary> = {
  title: "Providers/ErrorBoundary",
  component: ErrorBoundary,
  parameters: {
    docs: {
      description: {
        component: `ErrorBoundary catches JavaScript errors in its child component tree and renders a fallback UI.

### Features

- Catches rendering errors in child components
- Supports custom fallback UI via \`fallback\` prop (ReactNode or render function)
- \`onError\` callback for error reporting/logging
- Default fallback uses ErrorContainer

### Usage

\`\`\`tsx
import { ErrorBoundary } from "@docspace/ui-kit/providers/error-boundary";

// With default fallback
<ErrorBoundary>
  <App />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary
  fallback={(error) => <div>Error: {error.message}</div>}
  onError={(error, errorInfo) => logError(error, errorInfo)}
>
  <App />
</ErrorBoundary>
\`\`\``,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {
  args: {
    children: (
      <div style={{ padding: "16px" }}>
        <p>Children are rendered normally when no error occurs.</p>
      </div>
    ),
  },
};

const ThrowingComponent = () => {
  throw new Error("Something broke!");
};

export const WithError: Story = {
  args: {
    children: <ThrowingComponent />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "When a child component throws, the default ErrorContainer fallback is rendered.",
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
  parameters: {
    docs: {
      description: {
        story:
          "A custom ReactNode can be provided as fallback for a fully customized error UI.",
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
  parameters: {
    docs: {
      description: {
        story:
          "A render function receives the caught error, enabling dynamic fallback UI based on the error.",
      },
    },
  },
};
