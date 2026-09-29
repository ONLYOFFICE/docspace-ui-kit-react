import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TopLoaderService } from "./index";

const meta = {
  title: "UI/Feedback/TopLoader",
  parameters: {
    docs: {
      description: {
        component: `A thin progress bar at the top of the page for a wait of unknown length, driven by three static calls on an element the page supplies.

### Features

- **Smooth Animation**: Linear progress to 50% in the first second, then 10% increments capped at 90%
- **Completion Animation**: Smoothly animates from current position to 100% when \`end()\` is called
- **Cancel Support**: Immediately resets the bar to 0% via \`cancel()\`
- **No React Dependency**: Pure DOM manipulation service, works anywhere
- **Page-Supplied Element**: Drives the element with the id \`ipl-progress-indicator\` and does nothing, silently, when the page has none
- **Style Left To The Page**: Writes only the width, so the height, colour, position and transition come from the element's own style
- **One Bar Per Page**: Keeps its state in the module, so every caller shares one progression and the first \`end()\` finishes it
- **Safe On The Server**: Every call before the document exists does nothing instead of throwing

### Accessibility

The first \`start()\` turns the element into a progress bar for assistive technology.

- \`role="progressbar"\` with \`aria-valuemin="0"\` and \`aria-valuemax="100"\` announces the element as a progress bar from 0 to 100
- \`aria-valuenow\` is updated on every tick, so the announced value follows the bar's width, which comes from a timer, not from the work being done

### Usage

\`\`\`tsx
import { TopLoaderService } from "@onlyoffice/apps-ui-kit/components/top-loading-indicator";

// Render the element once, high in the tree, and style it yourself
<div id="ipl-progress-indicator" aria-label="Loading" />
\`\`\`

\`\`\`tsx
TopLoaderService.start();
try {
  await save();
  TopLoaderService.end();
} catch {
  TopLoaderService.cancel();
}
\`\`\``,
      },
    },
  },
} satisfies Meta;

type Story = StoryObj;

export default meta;

const DefaultTemplate = () => {
  useEffect(() => {
    const progressBar = document.createElement("div");
    progressBar.id = "ipl-progress-indicator";
    progressBar.style.position = "fixed";
    progressBar.style.top = "0";
    progressBar.style.left = "0";
    progressBar.style.height = "2px";
    progressBar.style.backgroundColor = "#2DA7DB";
    progressBar.style.transition = "width 0.2s ease-in-out";
    document.body.appendChild(progressBar);

    return () => {
      TopLoaderService.cancel();
      if (document.body.contains(progressBar)) {
        document.body.removeChild(progressBar);
      }
    };
  }, []);

  return (
    <div style={{ display: "flex", gap: "10px", padding: "20px" }}>
      <button type="button" onClick={() => TopLoaderService.start()}>
        Start Loading
      </button>
      <button type="button" onClick={() => TopLoaderService.end()}>
        End Loading
      </button>
      <button type="button" onClick={() => TopLoaderService.cancel()}>
        Cancel
      </button>
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Press **Start Loading** and a thin bar grows along the top of the viewport and stops at 90%; **End Loading** runs it to the full width and clears it, **Cancel** clears it at once (\`start\`, \`end\`, \`cancel\`). Use it to see how long a wait looks before the work finishes.",
      },
      source: {
        code: `// Add to HTML: <div id="ipl-progress-indicator" />

// Start loading
TopLoaderService.start();

// Complete loading
TopLoaderService.end();

// Cancel loading
TopLoaderService.cancel();`,
      },
    },
  },
};

// A different id from the service's, so the Docs page does not drive this bar from Default.
const useProgressBar = (styles: Partial<CSSStyleDeclaration>) => {
  useEffect(() => {
    const bar = document.createElement("div");
    bar.id = "top-loader-css-customization-demo";
    Object.assign(bar.style, styles);
    document.body.appendChild(bar);
    return () => {
      if (document.body.contains(bar)) document.body.removeChild(bar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

const CssCustomizationTemplate = () => {
  useProgressBar({
    position: "fixed",
    top: "0",
    left: "0",
    width: "65%",
    height: "4px",
    backgroundColor: "#0082c9",
    borderRadius: "0 2px 2px 0",
    boxShadow: "0 0 8px rgba(0, 130, 201, 0.5)",
    zIndex: "9999",
    transition: "width 0.2s ease-in-out",
  });

  return (
    <div style={{ padding: "40px 20px" }}>
      <p style={{ margin: 0, fontSize: "13px", color: "#555" }}>
        Progress bar at 65% — a static visual demo of the styles you would apply
        to <code>#ipl-progress-indicator</code> (rendered here under a different
        id so it doesn't collide with the live bar in the Default story)
      </p>
      <p style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>
        Customizable properties: <strong>height</strong>,{" "}
        <strong>backgroundColor</strong>, <strong>borderRadius</strong>,{" "}
        <strong>boxShadow</strong>, <strong>transition</strong>,{" "}
        <strong>zIndex</strong>
      </p>
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `\`TopLoaderService\` uses direct DOM manipulation on \`#ipl-progress-indicator\`.
It defines no CSS custom properties: style the element freely via CSS — the service only sets \`width\`, the ARIA attributes and \`data-test-id\` at runtime.
This story renders a static demo bar under a different id, purely for visual reference — it is not driven by \`TopLoaderService\`.

**Recommended inline style properties:**

| Property | Description | Example |
|----------|-------------|---------|
| \`height\` | Bar thickness | \`4px\` |
| \`backgroundColor\` | Bar fill color | \`#0082c9\` |
| \`borderRadius\` | Right-edge rounding | \`0 2px 2px 0\` |
| \`boxShadow\` | Glow / elevation | \`0 0 8px rgba(0,130,201,0.5)\` |
| \`transition\` | Smooth width animation | \`width 0.2s ease-in-out\` |
| \`zIndex\` | Stacking order | \`9999\` |`,
      },
      source: {
        code: `<div
  id="ipl-progress-indicator"
  style={{
    position: "fixed",
    top: 0,
    insetInlineStart: 0,
    width: 0,
    height: 4,
    backgroundColor: "#0082c9",
    borderRadius: "0 2px 2px 0",
    boxShadow: "0 0 8px rgba(0, 130, 201, 0.5)",
    transition: "width 0.2s ease-in-out",
    zIndex: 9999,
  }}
/>`,
      },
    },
  },
};
