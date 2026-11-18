import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import CrossReactSvg from "../../assets/icons/12/cross.react.svg";
import EmptyImageReactSvg from "../../assets/emptyview/empty.rooms.root.light.svg?url";

import { IconSizeType } from "../../utils";
import { Link, LinkType } from "../link";
import { EmptyScreenContainer } from ".";

import styles from "./EmptyScreenContainer.stories.module.scss";

const meta = {
  title: "UI/Layout components/EmptyScreenContainer",
  component: EmptyScreenContainer,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    imageSrc: {
      control: "text",
      description:
        "Source of the illustration. The stylesheet pins the image to 200×140, and to 150×105 below 600px, so supply artwork of that shape.",
    },
    imageAlt: {
      control: "text",
      description:
        "Alternative text for the illustration. Pass an empty string when the artwork repeats what the text below already says.",
    },
    headerText: {
      control: "text",
      description:
        "The heading under the image, 19px and bold, rendered as an `<h3>` unless `headingLevel` says otherwise.",
    },
    subheadingText: {
      control: "text",
      description:
        "Optional 600-weight line between the header and the description. It has no styling of its own beyond that weight.",
    },
    descriptionText: {
      control: "text",
      description: "Optional explanatory line at 12px, in the muted colour.",
    },
    buttons: {
      description:
        "Actions under the text, stacked in a 16px column and centred.",
      control: false,
    },
    withoutFilter: {
      control: "boolean",
      description:
        "Adds the height of a filter bar to the top padding, for a screen with no filter above it. It removes nothing.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    imageStyle: {
      control: "object",
      description:
        "Inline style of the `<img>`, and the only way past its fixed size. It is dropped between 601px and 1023px, where the component passes an empty object instead.",
    },
    buttonStyle: {
      control: "object",
      description: "Inline style of the row that holds `buttons`.",
    },
    className: {
      control: "text",
      description:
        "Added after the component's own classes on the outer element.",
    },
    id: {
      control: false,
      description: "Value of `id` on the outer element.",
    },
    style: {
      control: false,
      description: "Inline style of the outer element.",
    },
  },
} satisfies Meta<typeof EmptyScreenContainer>;

type Story = StoryObj<ComponentProps<typeof EmptyScreenContainer>>;

export default meta;

const onResetFilter = fn().mockName("Reset filter");
const onGoHome = fn().mockName("Go to home");

const ResetFilterButton = () => (
  <div className={styles.resetFilterButton}>
    <CrossReactSvg
      className={styles.crossIcon}
      data-size={IconSizeType.small}
    />
    <Link type={LinkType.action} isHovered onClick={onResetFilter}>
      Reset filter
    </Link>
  </div>
);

const HomeButton = () => (
  <Link type={LinkType.action} isHovered onClick={onGoHome}>
    Go to home
  </Link>
);

// Padding above the image with withoutFilter, per breakpoint:
// desktop, tablet, mobile.
const WITHOUT_FILTER_PADDING = ["91px", "109px", "69px"];

export const Default: Story = {
  render: (args) => <EmptyScreenContainer {...args} />,
  args: {
    imageSrc: EmptyImageReactSvg,
    imageAlt: "Empty Screen Filter image",
    headerText: "No results matching your search could be found",
    subheadingText: "No files to be displayed in this section",
    descriptionText:
      "No people matching your filter can be displayed in this section. Please select other filter options or clear filter to view all the people in this section.",
    buttons: <ResetFilterButton />,
  },
  play: async ({ canvas, userEvent }) => {
    await expect(
      canvas.getByRole("img", { name: "Empty Screen Filter image" }),
    ).toBeVisible();
    // The header is a real heading, at the stylesheet's 19px.
    const heading = canvas.getByRole("heading", {
      level: 3,
      name: "No results matching your search could be found",
    });
    await expect(heading).toBeVisible();
    await expect(getComputedStyle(heading).fontSize).toBe("19px");
    await expect(
      canvas.getByText("No files to be displayed in this section"),
    ).toBeVisible();
    // The page is not a live region: it mounts with its text.
    await expect(canvas.queryByRole("status")).toBeNull();

    await userEvent.click(canvas.getByText("Reset filter"));
    await expect(onResetFilter).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The full layout, for a list a filter has emptied. A header, a subheading and a description explain why nothing is shown; a reset action below offers the way back.",
      },
      source: {
        code: `<EmptyScreenContainer
  imageSrc={emptyImage}
  imageAlt="Empty Screen Filter image"
  headerText="No results matching your search could be found"
  subheadingText="No files to be displayed in this section"
  descriptionText="No people matching your filter can be displayed..."
  buttons={<ResetFilterButton />}
/>`,
      },
    },
  },
};

export const MinimalContent: Story = {
  name: "Heading and one action",
  render: (args) => <EmptyScreenContainer {...args} />,
  args: {
    imageSrc: EmptyImageReactSvg,
    imageAlt: "Empty search results",
    headerText: "No results found",
    buttons: <HomeButton />,
  },
  play: async ({ canvas, userEvent }) => {
    // Lines that are not given are not rendered.
    const container = canvas.getByTestId("empty-screen-container");
    await expect(container.querySelector(".ec-subheading")).toBeNull();
    await expect(container.querySelector(".ec-desc")).toBeNull();

    await userEvent.click(canvas.getByText("Go to home"));
    await expect(onGoHome).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The least a screen needs, for a place where there is nothing to explain: the image, one header line and a single way out.",
      },
      source: {
        code: `<EmptyScreenContainer
  imageSrc={emptyImage}
  imageAlt="Empty search results"
  headerText="No results found"
  buttons={<Link type={LinkType.action}>Go to home</Link>}
/>`,
      },
    },
  },
};

export const CustomStyles: Story = {
  name: "Custom styles",
  render: (args) => <EmptyScreenContainer {...args} />,
  args: {
    imageSrc: EmptyImageReactSvg,
    imageAlt: "Empty Screen Filter image",
    headerText: "Custom styled empty state",
    descriptionText: "This example shows custom styles for image and buttons",
    buttons: <HomeButton />,
    imageStyle: { width: "150px", height: "150px" },
    buttonStyle: { marginTop: "32px" },
  },
  play: async ({ canvas }) => {
    const container = canvas.getByTestId("empty-screen-container");
    // imageStyle is dropped on tablet widths, so only the button style is
    // checked unconditionally.
    const buttons = container.querySelector(".ec-buttons") as HTMLElement;
    await expect(getComputedStyle(buttons).marginTop).toBe("32px");
    if (window.innerWidth <= 600 || window.innerWidth >= 1024) {
      await expect(getComputedStyle(canvas.getByRole("img")).width).toBe(
        "150px",
      );
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "For artwork of another shape: the image is resized past its fixed 200×140 box (`imageStyle`) and the actions sit further down (`buttonStyle`). On windows between 601px and 1023px wide the image falls back to its fixed size.",
      },
      source: {
        code: `<EmptyScreenContainer
  imageSrc={emptyImage}
  imageAlt="Empty Screen Filter image"
  headerText="Custom styled empty state"
  descriptionText="This example shows custom styles for image and buttons"
  buttons={<HomeButton />}
  imageStyle={{ width: "150px", height: "150px" }}
  buttonStyle={{ marginTop: "32px" }}
/>`,
      },
    },
  },
};

export const WithoutFilter: Story = {
  name: "No filter above",
  render: (args) => <EmptyScreenContainer {...args} />,
  args: {
    imageSrc: EmptyImageReactSvg,
    imageAlt: "Welcome image",
    headerText: "Welcome to your workspace",
    descriptionText:
      "Get started by creating your first document or uploading files to this folder.",
    buttons: <HomeButton />,
    withoutFilter: true,
  },
  play: async ({ canvas }) => {
    // withoutFilter adds the filter bar's height above the image.
    const { paddingTop } = getComputedStyle(
      canvas.getByTestId("empty-screen-container"),
    );
    await expect(WITHOUT_FILTER_PADDING).toContain(paddingTop);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A screen with no filter bar above it, such as a first-run view (`withoutFilter`). The content starts 91px from the top instead of 52px, as low as under a filter bar.",
      },
      source: {
        code: `<EmptyScreenContainer
  imageSrc={welcomeImage}
  imageAlt="Welcome image"
  headerText="Welcome to your workspace"
  descriptionText="Get started by creating your first document..."
  buttons={<HomeButton />}
  withoutFilter
/>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS variables",
  play: async ({ canvas }) => {
    await expect(canvas.getByText("No files found")).toHaveStyle({
      color: "rgb(0, 130, 201)",
    });
    await expect(
      canvas.getByText("Create your first file to get started."),
    ).toHaveStyle({ color: "rgb(29, 45, 68)" });
    await expect(
      canvas.getByText("Filters are kept for this folder"),
    ).toBeVisible();
  },
  render: () => (
    <div
      style={
        {
          "--empty-screen-header-color": "#0082c9",
          "--empty-screen-description-color": "#1d2d44",
          "--empty-screen-link-color": "#0082c9",
          "--empty-screen-text-color": "#6a6a6a",
          "--empty-screen-width": "480px",
        } as CSSProperties
      }
    >
      <EmptyScreenContainer
        imageSrc={EmptyImageReactSvg}
        imageAlt="Empty"
        headerText="No files found"
        descriptionText="Create your first file to get started."
        buttons={
          <>
            <ResetFilterButton />
            <span>Filters are kept for this folder</span>
          </>
        }
        withoutFilter
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper. The reset action shows the link colour on its icon and text, and the line under it the plain-text colour. The width applies only above 1424px.`,
      },
      source: {
        code: `<div
  style={{
    "--empty-screen-header-color": "#0082c9",
    "--empty-screen-description-color": "#1d2d44",
    "--empty-screen-link-color": "#0082c9",
    "--empty-screen-text-color": "#6a6a6a",
    "--empty-screen-width": "480px",
  }}
>
  <EmptyScreenContainer
    imageSrc={emptyImage}
    imageAlt="Empty"
    headerText="No files found"
    descriptionText="Create your first file to get started."
    buttons={
      <>
        <ResetFilterButton />
        <span>Filters are kept for this folder</span>
      </>
    }
    withoutFilter
  />
</div>`,
      },
    },
  },
};
