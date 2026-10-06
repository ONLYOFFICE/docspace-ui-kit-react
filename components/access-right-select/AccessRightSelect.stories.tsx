import type { ComponentProps, CSSProperties, ReactNode } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import { ShareAccessRights } from "../../enums";
import { ComboBoxSize } from "../combobox";
import { Toast, toastr } from "../toast";

import { AccessRightSelect } from "./AccessRightSelect";

import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";

import { data as options } from "./data";

// The icon is attached here: data.ts ships in the package, and Rollup cannot load `?url`.
const data = options.map((option) =>
  option.isSeparator ? option : { ...option, icon: CatalogFolderReactSvgUrl },
);

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      height: "420px",
    }}
  >
    {children}
  </div>
);

const Row = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-start",
      gap: "24px",
    }}
  >
    {children}
  </div>
);

const meta = {
  title: "UI/Form controls/AccessRightSelect",
  component: AccessRightSelect,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    accessOptions: {
      // The icon is a data URI too long to edit, and it stretches the table.
      control: false,
      description:
        "The access levels to choose from, each drawn as a row with its icon, label, description and paid badge; an entry marked as a separator becomes a divider",
    },
    selectedOption: {
      // The icon is a data URI too long to edit, and it stretches the table.
      control: false,
      description:
        "The level shown in the button; keep it in your own state and set it from `onSelect`",
    },
    scaledOptions: {
      control: "boolean",
      description:
        "Makes the list as wide as the button instead of `manualWidth`",
      table: { defaultValue: { summary: "false" } },
    },
    scaled: {
      control: "boolean",
      description:
        "Makes the button take the full width of its parent, which overrides `size`",
      table: { defaultValue: { summary: "true" } },
    },
    directionX: {
      control: { type: "select" },
      options: ["right", "left"],
      description: "Horizontal direction in which the dropdown opens",
      table: { defaultValue: { summary: "right" } },
    },
    size: {
      control: { type: "select" },
      options: Object.values(ComboBoxSize),
      description:
        "One of the fixed button widths — 173, 300, 350 or 500px, or the content's own; applies only when `scaled` is off",
      table: { defaultValue: { summary: "base" } },
    },
    manualWidth: {
      control: "text",
      description:
        "Width of the list as a CSS length; the button's width is set by `size` and `scaled`",
      table: { defaultValue: { summary: "200px" } },
    },
    isDisabled: {
      control: "boolean",
      description: "Greys the button out and stops it opening",
      table: { defaultValue: { summary: "false" } },
    },
    isLoading: {
      control: "boolean",
      description:
        "Shows a spinner in place of the button's label and icon, and stops the button opening",
      table: { defaultValue: { summary: "false" } },
    },
    withoutBackground: {
      control: "boolean",
      description: "Makes the backdrop behind the open list transparent",
      table: { defaultValue: { summary: "false" } },
    },
    withBlur: {
      control: "boolean",
      description: "Accepted but ignored: nothing blurs",
      table: { defaultValue: { summary: "false" } },
    },
    directionY: {
      control: { type: "select" },
      options: ["top", "bottom", "both"],
      description: "Vertical direction in which the dropdown opens",
      table: { defaultValue: { summary: "bottom" } },
    },
    isAside: {
      control: "boolean",
      description:
        "Marks the backdrop behind the open list as belonging to a side panel",
      table: { defaultValue: { summary: "false" } },
    },
    isMobileView: {
      control: "boolean",
      description:
        "Pins the open list to the bottom of the screen, full width, on a phone in portrait",
      table: { defaultValue: { summary: "false" } },
    },
    manualY: {
      control: "text",
      description:
        "Exact vertical offset of the list from the button, when the list renders in place",
    },
    fixedDirection: {
      control: "boolean",
      description:
        "Prevents the dropdown from flipping direction when near viewport edges",
      table: { defaultValue: { summary: "false" } },
    },
    withBackground: {
      control: "boolean",
      description: "Dims the page behind the open list",
      table: { defaultValue: { summary: "false" } },
    },
    shouldShowBackdrop: {
      control: "boolean",
      description:
        "Renders the backdrop behind the open list even when another one is already on screen",
      table: { defaultValue: { summary: "false" } },
    },
    withBackdrop: {
      control: "boolean",
      description:
        "Whether the open list puts a backdrop behind itself to catch the next click",
      table: { defaultValue: { summary: "true" } },
    },
    noBorder: {
      control: "boolean",
      description: "Removes the border from the select element",
      table: { defaultValue: { summary: "false" } },
    },
    noSelect: {
      control: "boolean",
      description:
        "Whether the button's text cannot be selected with the mouse",
      table: { defaultValue: { summary: "true" } },
    },
    isSelectionDisabled: {
      control: "boolean",
      description:
        "Refuses every level other than the current one and those in `availableAccess`; a refused pick shows `selectionErrorText` in a toast and the selection stays",
      table: { defaultValue: { summary: "false" } },
    },
    availableAccess: {
      control: "object",
      description:
        "The `access` values that may still be picked while `isSelectionDisabled` is on",
    },
    selectionErrorText: {
      control: "text",
      description: "The toast text shown when a refused level is picked",
    },
    displaySelectedOption: {
      control: "boolean",
      description: "Keeps the current level highlighted in the list",
      table: { defaultValue: { summary: "false" } },
    },
    showDisabledItems: {
      control: "boolean",
      description:
        "Accepted but ignored: disabled options are always kept in the list",
    },
    title: {
      control: "text",
      description:
        "Hover tooltip for the whole control; it needs `RootTooltip` mounted",
    },
    topSpace: {
      control: "number",
      description: "Additional top spacing in pixels for the dropdown",
    },
    modernView: {
      control: "boolean",
      description: "Switches the button to its compact presentation",
      table: { defaultValue: { summary: "false" } },
    },
    fillIcon: {
      control: "boolean",
      description:
        "Recolours the icon in the button to the theme's icon colour",
      table: { defaultValue: { summary: "false" } },
    },
    isDefaultMode: {
      control: "boolean",
      description:
        "Renders the open list in a portal at the end of the page, positioned against the button; turn it off to render the list in place, next to the button",
      table: { defaultValue: { summary: "true" } },
    },
    comboIcon: {
      control: "text",
      description: "URL of an icon shown in place of the arrow in the button",
    },
    usePortalBackdrop: {
      control: "boolean",
      description: "Whether to render the backdrop using a React portal",
      table: { defaultValue: { summary: "false" } },
    },
    type: {
      control: { type: "select" },
      options: [undefined, "badge", "onlyIcon", "descriptive"],
      description:
        "How the button shows the chosen level: `descriptive` adds its description under the label, `onlyIcon` shows the icon alone, `badge` draws the label as a badge",
    },
    dataTestId: {
      control: "text",
      description: "`data-testid` of the button",
    },
    onSelect: {
      description:
        "Called with the level that was picked; not called for a refused one",
    },
    setIsOpenItemAccess: {
      control: false,
      description: "Told `true` when the list opens and `false` when it closes",
    },
    className: {
      control: "text",
      description:
        "Class added to the element that wraps the button and the list",
    },
    advancedOptions: {
      control: false,
      description:
        "An element whose children replace the rows built from `accessOptions`",
    },
  },
  args: {
    usePortalBackdrop: true,
    onSelect: fn(),
  },
} satisfies Meta<typeof AccessRightSelect>;

type Story = StoryObj<ComponentProps<typeof AccessRightSelect>>;

export default meta;

// A row of the list, which may be portalled out of the story root.
const accessOption = (key: string) =>
  screen.getByTestId(`access_right_option_${key}`);

const listShown = () =>
  waitFor(() => expect(accessOption("key1")).toBeVisible());

const listHidden = () =>
  waitFor(() => {
    const row = screen.queryByTestId("access_right_option_key1");
    expect(!row || !row.checkVisibility()).toBe(true);
  });

export const Default: Story = {
  args: {
    accessOptions: data,
    selectedOption: data[0],
    scaledOptions: false,
    scaled: false,
    directionX: "right",
    size: ComboBoxSize.content,
    manualWidth: "fit-content",
  },
  render: (args) => (
    <Wrapper>
      <AccessRightSelect {...args} />
    </Wrapper>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const combobox = canvas.getByTestId("combobox");
    await expect(combobox).toHaveTextContent("Full access");

    await userEvent.click(canvas.getByRole("button", { expanded: false }));
    await listShown();
    // Each level with its description; the paid one with its badge.
    await expect(accessOption("key1")).toHaveTextContent("paid");
    await expect(accessOption("key2")).toHaveTextContent(
      "Can edit and share files",
    );
    await expect(accessOption("key1")).toHaveAttribute("aria-selected", "true");

    await userEvent.click(accessOption("key5"));
    await expect(args.onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ key: "key5", label: "Viewer" }),
    );
    await listHidden();
    await expect(combobox).toHaveTextContent("Viewer");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The drop-down as it is placed next to a person or a link: open it to see each level's icon, description and paid badge, and pick one to see the button follow (`onSelect`, logged in the Actions panel). Change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<AccessRightSelect
  accessOptions={options}
  selectedOption={options[0]}
  scaledOptions={false}
  scaled={false}
  directionX="right"
  size="content"
  manualWidth="fit-content"
  onSelect={(option) => setAccess(option)}
/>`,
      },
    },
  },
};

const DisplayTypesTemplate = () => (
  <Wrapper>
    <Row>
      <AccessRightSelect
        accessOptions={data}
        selectedOption={data[1]}
        scaled={false}
        size={ComboBoxSize.content}
        manualWidth="fit-content"
      />
      <AccessRightSelect
        accessOptions={data}
        selectedOption={data[1]}
        type="descriptive"
        scaled={false}
        size={ComboBoxSize.content}
        manualWidth="fit-content"
      />
      <AccessRightSelect
        accessOptions={data}
        selectedOption={data[1]}
        type="onlyIcon"
        scaled={false}
        size={ComboBoxSize.content}
        manualWidth="fit-content"
      />
    </Row>
  </Wrapper>
);

export const DisplayTypes: Story = {
  render: () => <DisplayTypesTemplate />,
  play: async ({ canvas }) => {
    const [plain, descriptive, onlyIcon] = canvas.getAllByTestId("combobox");
    await expect(plain).toHaveTextContent("Editor");
    await expect(plain).not.toHaveTextContent("Can edit and share files");
    await expect(descriptive).toHaveTextContent("Can edit and share files");
    // The icon alone: no label at all.
    await expect(onlyIcon).not.toHaveTextContent("Editor");
    await expect(onlyIcon.querySelector("svg")).not.toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story: `How much of the chosen level the button shows, from the most room to the least:

- **Editor** — the label alone, the usual form (no \`type\`)
- **Editor, Can edit and share files** — the label with the description underneath, for a form where the choice needs explaining (\`type="descriptive"\`)
- **The folder icon** — the icon alone, for a row with no room for text; the list still shows every label (\`type="onlyIcon"\`)`,
      },
      source: {
        code: `<AccessRightSelect accessOptions={options} selectedOption={access} />
<AccessRightSelect accessOptions={options} selectedOption={access} type="descriptive" />
<AccessRightSelect accessOptions={options} selectedOption={access} type="onlyIcon" />`,
      },
    },
  },
};

const RestrictedChoicesTemplate = () => (
  <Wrapper>
    <AccessRightSelect
      accessOptions={data}
      selectedOption={data[4]}
      isSelectionDisabled
      availableAccess={[ShareAccessRights.Comment, ShareAccessRights.ReadOnly]}
      selectionErrorText="This access level is not available"
      scaled={false}
      size={ComboBoxSize.content}
      manualWidth="fit-content"
    />
    <Toast />
  </Wrapper>
);

export const RestrictedChoices: Story = {
  render: () => <RestrictedChoicesTemplate />,
  beforeEach: () => {
    toastr.clear();
  },
  play: async ({ canvas, userEvent }) => {
    const combobox = canvas.getByTestId("combobox");
    await userEvent.click(canvas.getByRole("button", { expanded: false }));
    await listShown();
    // A level outside availableAccess is refused with a toast.
    await userEvent.click(accessOption("key1"));
    await expect(
      await screen.findByText("This access level is not available"),
    ).toBeVisible();
    await expect(combobox).toHaveTextContent("Viewer");

    // One inside it is picked as usual.
    await userEvent.click(canvas.getByRole("button", { expanded: false }));
    await listShown();
    await userEvent.click(accessOption("key4"));
    await waitFor(() => expect(combobox).toHaveTextContent("Commenter"));
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a level the viewer may see but not grant. Open the list and pick **Full access**: a toast explains why, and the button keeps **Viewer**; **Commenter** and **Viewer** can still be picked (`isSelectionDisabled`, `availableAccess`, `selectionErrorText`). The toast needs `Toast` mounted once in the app.",
      },
      source: {
        code: `<AccessRightSelect
  accessOptions={options}
  selectedOption={access}
  isSelectionDisabled
  availableAccess={[ShareAccessRights.Comment, ShareAccessRights.ReadOnly]}
  selectionErrorText="This access level is not available"
  onSelect={(option) => setAccess(option)}
/>
<Toast />`,
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    ...Default.args,
    isDisabled: true,
  },
  play: async ({ canvas, userEvent }) => {
    const button = within(canvas.getByTestId("combobox")).getByRole("button");
    await expect(button).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(button);
    await new Promise((resolve) => setTimeout(resolve, 200));
    await listHidden();
  },
  render: (args) => (
    <Wrapper>
      <AccessRightSelect {...args} />
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "For an access level that cannot be changed right now, such as while the person is being removed: the button is greyed out and clicking it does not open the list (`isDisabled`).",
      },
      source: {
        code: `<AccessRightSelect
  accessOptions={options}
  selectedOption={access}
  isDisabled
/>`,
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
  play: async ({ canvas, userEvent }) => {
    // A spinner instead of the label; the list does not open.
    const combobox = canvas.getByTestId("combobox");
    await expect(within(combobox).getByTestId("loader")).toBeVisible();
    await expect(within(combobox).getByText("Full access")).not.toBeVisible();
    await userEvent.click(within(combobox).getByRole("button"));
    await new Promise((resolve) => setTimeout(resolve, 200));
    await listHidden();
  },
  render: (args) => (
    <Wrapper>
      <AccessRightSelect {...args} />
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "For the moment a new level is being saved: a spinner takes the place of the label and icon, and the list cannot be opened until the save finishes (`isLoading`).",
      },
      source: {
        code: `<AccessRightSelect
  accessOptions={options}
  selectedOption={access}
  isLoading={isSaving}
/>`,
      },
    },
  },
};

const CssCustomizationTemplate = () => {
  return (
    <div
      style={
        {
          // === AccessRightSelect — item icon and text ===
          "--access-right-select-text": "#0082c9",
          "--access-right-select-disabled-icon": "#a8cfe6",
          "--access-right-select-icon": "#0082c9",
          "--access-right-select-description": "#5aa9d0",
          "--access-right-select-description-size": "12px",
          "--access-right-select-gap": "12px",
          "--access-right-select-item-padding": "10px 0",
          // === Combobox (trigger button) ===
          "--combobox-radius": "8px",
          // === DropDown (options panel) ===
          "--dropdown-bg": "#e6f3fb",
          "--dropdown-border-style": "1px solid #0082c9",
          "--dropdown-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
          "--dropdown-radius": "12px",
        } as CSSProperties
      }
    >
      <div style={{ height: "420px" }}>
        <Row>
          <AccessRightSelect
            accessOptions={data}
            selectedOption={data[0]}
            scaledOptions={false}
            scaled={false}
            directionX="right"
            size={ComboBoxSize.content}
            manualWidth="320px"
            isDefaultMode={false}
          />
          <AccessRightSelect
            accessOptions={data}
            selectedOption={data[0]}
            type="onlyIcon"
            scaled={false}
            size={ComboBoxSize.content}
            manualWidth="320px"
            isDefaultMode={false}
          />
          <AccessRightSelect
            accessOptions={data}
            selectedOption={data[0]}
            type="onlyIcon"
            isDisabled
            scaled={false}
            size={ComboBoxSize.content}
            manualWidth="320px"
            isDefaultMode={false}
          />
        </Row>
      </div>
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  play: async ({ canvas, userEvent }) => {
    // Each instance renders its list in place.
    const [first] = canvas.getAllByTestId("combobox");
    await userEvent.click(
      within(first).getByRole("button", { expanded: false }),
    );
    const editor = within(first).getByTestId("access_right_option_key2");
    await waitFor(() => expect(editor).toBeVisible());
    const description = within(editor).getByText("Can edit and share files");
    await expect(getComputedStyle(description).color).toBe("rgb(90, 169, 208)");
    await expect(getComputedStyle(description).fontSize).toBe("12px");
    const panel = editor.closest('[data-testid="dropdown"]') as HTMLElement;
    await expect(getComputedStyle(panel).backgroundColor).toBe(
      "rgb(230, 243, 251)",
    );
    await expect(getComputedStyle(panel).borderTopLeftRadius).toBe("12px");
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. Open any of the instances to see the row and panel variables; they render the list in place (\`isDefaultMode={false}\`), because a portalled list is out of reach of a wrapper's variables. The three instances share one wrapper:

- **Full access** — the usual button, for the button radius and everything in the list
- **The first icon** — \`type="onlyIcon"\`, for \`--access-right-select-text\`
- **The second icon** — \`type="onlyIcon"\` and \`isDisabled\`, for \`--access-right-select-disabled-icon\``,
      },
      source: {
        code: `<div
  style={{
    "--access-right-select-text": "#0082c9",
    "--access-right-select-disabled-icon": "#a8cfe6",
    "--access-right-select-icon": "#0082c9",
    "--access-right-select-description": "#5aa9d0",
    "--access-right-select-description-size": "12px",
    "--access-right-select-gap": "12px",
    "--access-right-select-item-padding": "10px 0",
    "--combobox-radius": "8px",
    "--dropdown-bg": "#e6f3fb",
    "--dropdown-border-style": "1px solid #0082c9",
    "--dropdown-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
    "--dropdown-radius": "12px",
  }}
>
  <AccessRightSelect accessOptions={options} selectedOption={access} isDefaultMode={false} />
  <AccessRightSelect accessOptions={options} selectedOption={access} type="onlyIcon" isDefaultMode={false} />
  <AccessRightSelect accessOptions={options} selectedOption={access} type="onlyIcon" isDisabled isDefaultMode={false} />
</div>`,
      },
    },
  },
};
