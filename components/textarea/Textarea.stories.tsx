import type React from "react";
import type { CSSProperties, ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toast } from "../toast";

import { Textarea } from ".";

const meta = {
  title: "UI/Form controls/Textarea",
  component: Textarea,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    value: {
      control: "text",
      description: "Textarea value",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    placeholder: {
      control: "text",
      description:
        "Placeholder text. Defaults to a single space so an empty field still counts as showing a placeholder, which the Firefox minimum-height rules rely on",
      table: {
        defaultValue: { summary: '" "' },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Disable the textarea",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isReadOnly: {
      control: "boolean",
      description: "Make the textarea read-only",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasError: {
      control: "boolean",
      description: "Show error state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    maxLength: {
      control: "number",
      description: "Maximum character length",
    },
    heightTextArea: {
      control: "text",
      description: "Custom height of the textarea",
    },
    fontSize: {
      control: "number",
      description: "Font size in pixels",
      table: {
        defaultValue: { summary: "13" },
      },
    },
    color: {
      control: "color",
      description: "Text color",
    },
    enableCopy: {
      control: "boolean",
      description: "Show copy icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasNumeration: {
      control: "boolean",
      description: "Show line numbers",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isJSONField: {
      control: "boolean",
      description:
        "Pretty-prints the value as JSON and shows the error border while it is empty or not valid JSON; pair with hasNumeration for line numbers",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    heightScale: {
      control: "boolean",
      description:
        "Makes the field 65% of the browser window height instead of a fixed height, so it stretches and shrinks with the window",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isFullHeight: {
      control: "boolean",
      description:
        "Makes the field exactly as tall as its text: every new line makes it taller and every removed line shorter, down to the 89px default height",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    copyInfoText: {
      control: "text",
      description:
        "Text of the success toast shown after the copy button is clicked; without it no toast appears",
    },
    onCopy: {
      action: "onCopy",
      description:
        "Called with the copied text after the copy button is clicked",
    },
    tabIndex: {
      control: "number",
      description:
        "Tab order of the field; left out, the field takes its natural place in the Tab sequence, and -1 makes the keyboard skip it",
    },
    autoFocus: {
      control: "boolean",
      description: "Focuses the field when it mounts",
    },
    areaSelect: {
      control: "boolean",
      description:
        "Selects the whole text whenever it turns on, for a field the reader is expected to copy from",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onChange: {
      description:
        "Called with the native change event on every edit; the stories wire it themselves to keep the field controlled",
    },
    onKeyDown: {
      action: "onKeyDown",
      description: "Called with the native keyboard event on every key press",
    },
    isChatMode: {
      control: "boolean",
      description:
        "Moves the border, background and state colors from the scroll container to the outer frame",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    id: {
      control: "text",
      description:
        "HTML id of the textarea element, the target for `<label htmlFor>`",
    },
    name: {
      control: "text",
      description: "HTML name of the textarea element for form submission",
    },
    className: {
      control: "text",
      description:
        "Class added to the scroll container that carries the border",
    },
    wrapperClassName: {
      control: "text",
      description: "Class added to the outer frame",
    },
    classNameCopyIcon: {
      control: "text",
      description: "Class added to the copy button",
    },
    style: {
      control: "object",
      description:
        "Inline styles applied to the scroll container that carries the border",
    },
    "aria-label": {
      control: "text",
      description:
        "Accessible name of the field, for when no `<label>` points at it",
    },
    "aria-labelledby": {
      control: "text",
      description:
        "id of the element on screen that names the field, such as a visible caption",
    },
    "aria-describedby": {
      control: "text",
      description:
        "id of the element describing the field, such as a hint or an error line below it; announced after the name",
    },
    dataTestId: {
      control: "text",
      description: "Value of data-testid on the textarea element",
      table: {
        defaultValue: { summary: '"textarea"' },
      },
    },
  },
} satisfies Meta<typeof Textarea>;

type Story = StoryObj<ComponentProps<typeof Textarea>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gridGap: "16px",
        alignItems: "start",
      }}
    >
      {props.children}
    </div>
  );
};

const ControlledTextarea = (
  props: Partial<ComponentProps<typeof Textarea>> & { initialValue?: string },
) => {
  const { initialValue, ...rest } = props;
  const [val, setValue] = useState(initialValue || rest.value || "");

  return (
    <Textarea
      {...rest}
      value={val}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Default: Story = {
  render: (args) => <ControlledTextarea {...args} />,
  args: {
    placeholder: "Enter text here",
    isDisabled: false,
    isReadOnly: false,
    hasError: false,
    heightTextArea: "150px",
    value: "",
  },
  parameters: {
    docs: {
      description: {
        story:
          "An empty field with a placeholder and a fixed height, the shape most forms start from (`placeholder`, `heightTextArea`); change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<Textarea
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter text here"
  heightTextArea="150px"
/>`,
      },
    },
  },
};

const StatesTemplate = () => {
  return (
    <Wrapper>
      <ControlledTextarea
        initialValue="Normal textarea"
        placeholder="Normal"
        heightTextArea="100px"
      />
      <ControlledTextarea
        initialValue="Error state"
        hasError
        heightTextArea="100px"
      />
      <ControlledTextarea
        initialValue="Disabled textarea"
        isDisabled
        heightTextArea="100px"
      />
      <ControlledTextarea
        initialValue="Read-only textarea"
        isReadOnly
        heightTextArea="100px"
      />
    </Wrapper>
  );
};

export const States: Story = {
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story: `Four copies of the same field, one per state a form puts it in:

- **Normal textarea** — the plain field
- **Error state** — the red border a form shows after failed validation (\`hasError\`)
- **Disabled textarea** — greyed out and unfocusable (\`isDisabled\`)
- **Read-only textarea** — looks like the plain one but rejects typing (\`isReadOnly\`)`,
      },
      source: {
        code: `<Textarea value="Normal textarea" />
<Textarea value="Error state" hasError />
<Textarea value="Disabled textarea" isDisabled />
<Textarea value="Read-only textarea" isReadOnly />`,
      },
    },
  },
};

const WithCopyTemplate = () => {
  return (
    <div style={{ width: "400px" }}>
      <ControlledTextarea
        initialValue="This text can be copied using the copy button."
        enableCopy
        copyInfoText="Text copied to clipboard!"
        heightTextArea="100px"
      />
      <Toast />
    </div>
  );
};

export const WithCopy: Story = {
  render: () => <WithCopyTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "The copy button in the corner puts the whole text on the clipboard and confirms it with a toast (`enableCopy`, `copyInfoText`); clicking the frame or the button also selects all the text. The toast renders only where a `Toast` container is mounted, so the story mounts one.",
      },
      source: {
        code: `<Textarea
  value="This text can be copied"
  enableCopy
  copyInfoText="Text copied to clipboard!"
/>
<Toast />`,
      },
    },
  },
};

const WithNumerationTemplate = () => {
  return (
    <div style={{ width: "400px" }}>
      <ControlledTextarea
        initialValue={`Line 1: First line of text\nLine 2: Second line of text\nLine 3: Third line of text\nLine 4: Fourth line of text\nLine 5: Fifth line of text`}
        hasNumeration
        heightTextArea="150px"
      />
    </div>
  );
};

export const WithNumeration: Story = {
  render: () => <WithNumerationTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Line numbers beside the text for values read as code or configuration, so a reader can point to a line (`hasNumeration`).",
      },
      source: {
        code: `<Textarea
  value="Line 1\\nLine 2\\nLine 3"
  hasNumeration
/>`,
      },
    },
  },
};

const sampleJSON = JSON.stringify(
  {
    title: "Quarterly report",
    pages: 12,
    tags: ["draft", "shared"],
  },
  null,
  2,
);

const brokenJSON = '{"title": "Quarterly report", "pages": 12,';

const JSONFieldTemplate = () => {
  return (
    <Wrapper>
      <ControlledTextarea
        initialValue={sampleJSON}
        isJSONField
        hasNumeration
        heightTextArea="200px"
      />
      <ControlledTextarea
        initialValue={brokenJSON}
        isJSONField
        hasNumeration
        heightTextArea="200px"
      />
    </Wrapper>
  );
};

export const JSONField: Story = {
  render: () => <JSONFieldTemplate />,
  parameters: {
    docs: {
      description: {
        story: `Two JSON fields, for values a reader edits as configuration:

- **Left** — a valid object, pretty-printed with line numbers (\`isJSONField\`, \`hasNumeration\`)
- **Right** — a truncated object, which keeps the red border until the text parses as JSON`,
      },
      source: {
        code: `<Textarea
  value='{"title": "Quarterly report", "pages": 12}'
  isJSONField
  hasNumeration
/>
<Textarea value='{"title": "Quarterly report",' isJSONField hasNumeration />`,
      },
    },
  },
};

const CustomHeightTemplate = () => {
  return (
    <Wrapper>
      <ControlledTextarea
        initialValue="Small textarea"
        heightTextArea="80px"
        placeholder="80px height"
      />
      <ControlledTextarea
        initialValue="Medium textarea"
        heightTextArea="150px"
        placeholder="150px height"
      />
      <ControlledTextarea
        initialValue="Large textarea"
        heightTextArea="250px"
        placeholder="250px height"
      />
    </Wrapper>
  );
};

export const CustomHeights: Story = {
  render: () => <CustomHeightTemplate />,
  parameters: {
    docs: {
      description: {
        story: `Three heights of the same field, to pick the one that fits the surrounding form (\`heightTextArea\`):

- **Small textarea** — 80px
- **Medium textarea** — 150px
- **Large textarea** — 250px`,
      },
      source: {
        code: `<Textarea value="Small" heightTextArea="80px" />
<Textarea value="Medium" heightTextArea="150px" />
<Textarea value="Large" heightTextArea="250px" />`,
      },
    },
  },
};

const GrowsWithContentTemplate = () => {
  return (
    <div style={{ width: "400px" }}>
      <ControlledTextarea
        initialValue={`First line\nSecond line\nThird line\nFourth line\nFifth line\nSixth line`}
        isFullHeight
      />
    </div>
  );
};

export const GrowsWithContent: Story = {
  render: () => <GrowsWithContentTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "The frame is as tall as its text: add a line and it grows, delete one and it shrinks, never below the default height (`isFullHeight`).",
      },
      source: {
        code: `<Textarea value={value} onChange={handleChange} isFullHeight />`,
      },
    },
  },
};

const RightToLeftTemplate = () => {
  return (
    <div dir="rtl" style={{ width: "400px" }}>
      <ControlledTextarea
        initialValue={`السطر الأول\nالسطر الثاني\nالسطر الثالث`}
        hasNumeration
        enableCopy
        heightTextArea="120px"
      />
    </div>
  );
};

// Framed on Docs: the theme provider stamps data-dir on <html>, which would flip the whole page.
export const RightToLeft: Story = {
  render: () => <RightToLeftTemplate />,
  globals: { direction: "rtl" },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "146px" },
      description: {
        story:
          'The same field under a right-to-left interface, mirroring the left-to-right layout: the line numbers move to the right edge, the copy button to the left one, and the text starts from the right. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.',
      },
      source: {
        code: `<div dir="rtl">
  <Textarea value={value} onChange={handleChange} hasNumeration enableCopy />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "300px",
          "--text-input-bg": "#f5f3ff",
          "--text-input-border-color": "#c4b5fd",
          "--text-input-border-hover": "#7c3aed",
          "--text-input-border-focus": "#4c1d95",
          "--text-input-color": "#4c1d95",
          "--text-input-radius": "8px",
          "--textarea-padding": "6px 12px 4px",
          "--textarea-height-custom": "120px",
          "--textarea-numeration-text-color": "#8b5cf6",
        } as CSSProperties
      }
    >
      <Textarea
        value="Custom styled textarea with CSS variables"
        onChange={() => {}}
      />
      <Textarea
        value={"First line\nSecond line\nThird line"}
        hasNumeration
        onChange={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Nine of the variables set on one wrapper -- every one is listed under CSS variables on this page. The first field shows the shared \`--text-input-*\` tokens, the padding and the custom height; hover and focus it to see the two border variables. The second adds \`hasNumeration\`, the only state in which \`--textarea-numeration-text-color\` has anything to color.`,
      },
      source: {
        code: `<div
  style={
    {
      "--text-input-bg": "#f5f3ff",
      "--text-input-border-color": "#c4b5fd",
      "--text-input-border-hover": "#7c3aed",
      "--text-input-border-focus": "#4c1d95",
      "--text-input-color": "#4c1d95",
      "--text-input-radius": "8px",
      "--textarea-padding": "6px 12px 4px",
      "--textarea-height-custom": "120px",
      "--textarea-numeration-text-color": "#8b5cf6",
    } as CSSProperties
  }
>
  <Textarea value="Custom styled textarea with CSS variables" onChange={() => {}} />
  <Textarea value={"First line\\nSecond line\\nThird line"} hasNumeration onChange={() => {}} />
</div>`,
      },
    },
  },
};
