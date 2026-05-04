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

import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TopLoaderService } from "./index";

const meta = {
  title: "UI/Layout components/TopLoader",
  parameters: {
    docs: {
      description: {
        component: `A lightweight top-of-page progress bar service for indicating page loading state. Uses direct DOM manipulation for performance.

### Features

- **Smooth Animation**: Linear progress to 50% in the first second, then 10% increments capped at 90%
- **Completion Animation**: Smoothly animates from current position to 100% when \`end()\` is called
- **Cancel Support**: Immediately resets the bar to 0% via \`cancel()\`
- **No React Dependency**: Pure DOM manipulation service, works anywhere

### Accessibility

- \`role="progressbar"\` with \`aria-valuemin\`, \`aria-valuemax\`, \`aria-valuenow\`

### Usage

\`\`\`tsx
import { TopLoaderService } from "@docspace/ui-kit/components/top-loading-indicator";

// Prerequisite: add <div id="ipl-progress-indicator" /> to your HTML

// Start loading
TopLoaderService.start();

// Complete loading
TopLoaderService.end();

// Cancel loading
TopLoaderService.cancel();
\`\`\``,
      },
    },
  },
} satisfies Meta;

type Story = StoryObj;

export default meta;

// Helper that mounts a styled #ipl-progress-indicator and cleans up on unmount
const useProgressBar = (styles: Partial<CSSStyleDeclaration>) => {
  useEffect(() => {
    const bar = document.createElement("div");
    bar.id = "ipl-progress-indicator";
    Object.assign(bar.style, styles);
    document.body.appendChild(bar);
    return () => {
      if (document.body.contains(bar)) document.body.removeChild(bar);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

// ─── CSS Customization ───────────────────────────────────────────────────────

const CssCustomizationTemplate = () => {
  // Progress bar 1 — Nextcloud blue, 4 px height, glow shadow (65% progress)
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
        Progress bar at 65% — styled via inline CSS on{" "}
        <code>#ipl-progress-indicator</code>
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
Style the element freely via CSS — the service only sets \`width\` and ARIA attributes at runtime.

**Recommended inline style properties:**

| Property | Description | Example |
|----------|-------------|---------|
| \`height\` | Bar thickness | \`4px\` (default \`2px\`) |
| \`backgroundColor\` | Bar fill color | \`#0082c9\` |
| \`borderRadius\` | Right-edge rounding | \`0 2px 2px 0\` |
| \`boxShadow\` | Glow / elevation | \`0 0 8px rgba(0,130,201,0.5)\` |
| \`transition\` | Smooth width animation | \`width 0.2s ease-in-out\` |
| \`zIndex\` | Stacking order | \`9999\` |`,
      },
    },
  },
};

// ─── Default ─────────────────────────────────────────────────────────────────

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
          "Interactive demo with Start, End, and Cancel buttons. A thin blue progress bar appears at the top of the viewport.",
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
