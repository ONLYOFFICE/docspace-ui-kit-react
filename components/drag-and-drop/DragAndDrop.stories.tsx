import type React from "react";
import type { ComponentProps, CSSProperties } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { DragAndDrop } from ".";

const meta = {
  title: "UI/Interactive elements/DragAndDrop",
  component: DragAndDrop,
  parameters: {
    docs: {
      description: {
        component: `Wrapper that makes an existing element — a row, a tile, a panel — accept dropped files, with no interface of its own.

### Features

- **Drop Target**: Turns whatever it wraps into a target for dropped files without adding a border, a prompt or a file dialog
- **Drag Highlight**: Paints the drag background only while you pass \`dragging\`, and a stronger accept colour while files are held over the element
- **Unfiltered Drops**: Hands every dropped file to \`onDrop\` with no type or size filter, and stays silent when a drop carries no files
- **Drag Callbacks**: Reports each drag-over with the drag-active flag, and each moment the dragged files leave the element
- **Nested Targets**: Keeps a drop to itself by default, and with \`isDropZone\` hands it to the target around it, whose \`onDrop\` fires instead
- **Faded Look**: Fades the element to 40% with \`isDragDisabled\` while the drop still goes through, so the host guards \`onDrop\` itself
- **Custom Styling**: Accepts a class name and inline style on the outer element, where the drag colours and the faded opacity can be overridden

### Accessibility

The drop library turns the element into a focusable button that has no action of its own.

- **Button role**: The element is announced as a button (\`role="button"\`) and sits in the tab order (\`tabIndex="0"\`)
- **Space and Enter**: Try to open a file dialog, but there is no file input, so nothing happens
- **Keyboard upload**: Needs a separate button that opens an \`<input type="file">\`, since dragging is the only way in here

### Usage

\`\`\`tsx
import { DragAndDrop } from "@onlyoffice/apps-ui-kit/components/drag-and-drop";

// A folder row that takes dropped files and highlights during a drag
<DragAndDrop
  dragging={dragging}
  onDragOver={() => setDragging(true)}
  onDragLeave={() => setDragging(false)}
  onDrop={(files) => upload(files)}
>
  <div>Contracts</div>
</DragAndDrop>

// A read-only folder: faded, and the drop is ignored by the host
<DragAndDrop isDragDisabled onDrop={() => {}}>
  <div>Archive</div>
</DragAndDrop>
\`\`\``,
      },
    },
  },
  argTypes: {
    isDropZone: {
      control: "boolean",
      description:
        "Passes drag events on to a drop target around this one, which then takes the drop in place of this element's `onDrop`. Without it the events stop here",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dragging: {
      control: "boolean",
      description:
        "Your own flag that a drag is in progress. The element is highlighted only while it is set, and gets the stronger accept colour while files are held over it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDragDisabled: {
      control: "boolean",
      description:
        "Fades the element to 40%. The drop is not blocked: `onDrop` still fires",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onDrop: {
      action: "dropped",
      description:
        "Called with the dropped files; not called when the drop carried none",
    },
    onDragOver: {
      action: "dragOver",
      description:
        "Called on every drag-over with the drag-active flag from the last render, which is still `false` on the first event of a drag",
    },
    onDragLeave: {
      action: "dragLeave",
      description: "Called when the dragged files leave the element",
    },
    onMouseDown: {
      action: "mouseDown",
      description: "Called when the pointer is pressed on the element",
    },
    children: {
      description:
        "What the drop target wraps; the element fills its parent's height around it",
    },
    className: {
      control: "text",
      description:
        "Added after the component's own classes on the outer element",
    },
    style: {
      description:
        "Inline style of the outer element, also the place to override the drag colours and the faded opacity",
    },
    value: {
      control: false,
      description: "Ignored: nothing reads it",
    },
    targetFile: {
      control: false,
      description: "Ignored: nothing calls it",
    },
    forwardedRef: {
      control: false,
      description:
        "Ignored: the element's ref belongs to the drop library, and this one is never attached",
    },
  },
} satisfies Meta<typeof DragAndDrop>;

type Story = StoryObj<ComponentProps<typeof DragAndDrop>>;

export default meta;

const InteractiveDropZone = (args: ComponentProps<typeof DragAndDrop>) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (
    isDragActive: boolean,
    e: React.DragEvent<HTMLElement>,
  ) => {
    setIsDragging(isDragActive);
    args.onDragOver?.(isDragActive, e);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    setIsDragging(false);
    args.onDragLeave?.(e);
  };

  const handleDrop = (files: File[]) => {
    setIsDragging(false);
    args.onDrop?.(files);
  };

  const dropZoneStyle: React.CSSProperties = {
    width: "100%",
    height: "200px",
    border: `2px dashed ${isDragging ? "#2DA7DB" : "#D0D5DA"}`,
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  };

  const textStyle: React.CSSProperties = {
    margin: 0,
    color: "var(--text-color)",
    textAlign: "center",
  };

  return (
    <DragAndDrop
      {...args}
      dragging={args.dragging ?? isDragging}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div style={dropZoneStyle}>
        <p style={textStyle}>
          {isDragging ? "Drop files here" : "Drag files here"}
        </p>
      </div>
    </DragAndDrop>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveDropZone {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "The usual setup: the host keeps its own drag flag and passes it back. Drag files from your desktop over the box to see the background change and the dropped files arrive in the Actions panel (`onDragOver`, `dragging`, `onDrop`).",
      },
      source: {
        code: `const [dragging, setDragging] = useState(false);

<DragAndDrop
  dragging={dragging}
  onDragOver={(isDragActive) => setDragging(isDragActive)}
  onDragLeave={() => setDragging(false)}
  onDrop={(files) => {
    setDragging(false);
    upload(files);
  }}
>
  <div>Drag files here</div>
</DragAndDrop>`,
      },
    },
  },
};

export const WithDraggingState: Story = {
  render: (args) => <InteractiveDropZone {...args} />,
  args: {
    dragging: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The drag background held on without an actual drag, to check how the highlight looks in each theme (`dragging`). Drag a file over it to see the stronger accept colour on top.",
      },
      source: {
        code: `<DragAndDrop dragging onDrop={(files) => upload(files)}>
  <div>Drop files here</div>
</DragAndDrop>`,
      },
    },
  },
};

export const Disabled: Story = {
  render: (args) => <InteractiveDropZone {...args} />,
  args: {
    isDragDisabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A target the user may not upload to, faded to 40% (`isDragDisabled`). The fade is only a look: drop a file and it still arrives in the Actions panel, so the host has to ignore it in `onDrop`.",
      },
      source: {
        code: `<DragAndDrop
  isDragDisabled
  onDrop={(files) => {
    if (canUpload) upload(files);
  }}
>
  <div>Drag files here</div>
</DragAndDrop>`,
      },
    },
  },
};

const NestedTargetsDemo = (args: ComponentProps<typeof DragAndDrop>) => {
  const [outerDrops, setOuterDrops] = useState(0);
  const [innerDrops, setInnerDrops] = useState(0);

  const boxStyle: React.CSSProperties = {
    padding: "16px",
    border: "2px dashed #D0D5DA",
    borderRadius: "6px",
    color: "var(--text-color)",
  };

  return (
    <DragAndDrop onDrop={() => setOuterDrops((n) => n + 1)}>
      <div style={boxStyle}>
        <p style={{ marginTop: 0 }}>Outer target: {outerDrops} drops</p>
        <DragAndDrop
          {...args}
          onDrop={(files) => {
            setInnerDrops((n) => n + 1);
            args.onDrop?.(files);
          }}
        >
          <div style={boxStyle}>Inner target: {innerDrops} drops</div>
        </DragAndDrop>
      </div>
    </DragAndDrop>
  );
};

export const NestedTargets: Story = {
  render: (args) => <NestedTargetsDemo {...args} />,
  args: {
    isDropZone: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A folder row inside a panel that also takes files. Drop a file on the inner box: with `isDropZone` on, the outer counter goes up and the inner one does not, because the drop is handed to the outer target. Turn `isDropZone` off in the Controls panel below and the inner box keeps the drop.",
      },
      source: {
        code: `<DragAndDrop onDrop={uploadToPanel}>
  <div>Panel</div>
  <DragAndDrop isDropZone onDrop={uploadToFolder}>
    <div>Folder</div>
  </DragAndDrop>
</DragAndDrop>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "400px",
      }}
    >
      <div
        style={
          {
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            "--dnd-dragging-bg": "#e6f3fb",
            "--dnd-accept-bg": "#cce5f6",
            "--dnd-disabled-opacity": "0.25",
          } as CSSProperties
        }
      >
        <DragAndDrop
          isDropZone
          dragging
          style={{ height: "120px", borderRadius: "8px" }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
            }}
          >
            Dragging — custom bg via --dnd-dragging-bg
          </div>
        </DragAndDrop>

        <DragAndDrop
          isDropZone
          isDragDisabled
          style={{
            height: "80px",
            borderRadius: "8px",
            border: "2px dashed #0082c9",
          }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
            }}
          >
            Disabled — reduced via --dnd-disabled-opacity: 0.25
          </div>
        </DragAndDrop>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--dnd-dragging-bg\` | Background while \`dragging\` is set | theme-based |
| \`--dnd-accept-bg\` | Background while \`dragging\` is set and files are held over the element | theme-based |
| \`--dnd-disabled-opacity\` | Opacity while \`isDragDisabled\` is set | \`0.4\` |

One wrapper sets all three. The first box is held in the dragging state for \`--dnd-dragging-bg\`; drag a file over it to see \`--dnd-accept-bg\`. The second box is there for \`--dnd-disabled-opacity\`, which only \`isDragDisabled\` switches on.`,
      },
      source: {
        code: `<div
  style={{
    "--dnd-dragging-bg": "#e6f3fb",
    "--dnd-accept-bg": "#cce5f6",
    "--dnd-disabled-opacity": "0.25",
  }}
>
  <DragAndDrop dragging>
    <div>Dragging</div>
  </DragAndDrop>
  <DragAndDrop isDragDisabled>
    <div>Disabled</div>
  </DragAndDrop>
</div>`,
      },
    },
  },
};
