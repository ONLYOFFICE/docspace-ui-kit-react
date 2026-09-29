import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

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
    docs: {
      description: {
        component: `A component for displaying empty states in the application with images, headers, descriptions, and action buttons.

### Features

- **Image Display**: Shows the illustration at a fixed 200×140, or 150×105 on windows up to 600px wide, unless \`imageStyle\` resizes it
- **Header**: Puts a bold 19px line of text under the illustration
- **Explanation Lines**: Adds an optional semibold subheading and a muted 12px description, which may be any React node
- **Action Buttons**: Stacks the actions in a centred column with 16px between them, in the theme's link colour
- **Top Offset**: Starts the content lower with \`withoutFilter\`, for a screen that has no filter bar above it
- **Responsive Width**: Keeps a 640px width on windows wider than 1424px and below that shrinks to its content, up to 640px, 480px on tablets and 343px on phones
- **Theme Colours**: Takes the header, description and action colours from the light or dark theme, each replaceable through a CSS variable

### Usage

\`\`\`tsx
import { EmptyScreenContainer } from "@onlyoffice/apps-ui-kit/components/empty-screen-container";

// With filter reset button
<EmptyScreenContainer
  imageSrc={emptyImage}
  imageAlt="No results"
  headerText="No results matching your search"
  descriptionText="Try adjusting your filters"
  buttons={<ResetFilterButton />}
/>

// Welcome screen without filter styling
<EmptyScreenContainer
  imageSrc={welcomeImage}
  imageAlt="Welcome"
  headerText="Welcome to your workspace"
  withoutFilter
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    imageSrc: {
      control: "text",
      description: "URL source for the empty state image",
    },
    imageAlt: {
      control: "text",
      description: "Alternative text for the image for accessibility",
    },
    headerText: {
      control: "text",
      description: "Main header text displayed below the image",
    },
    subheadingText: {
      control: "text",
      description: "Optional subheading text displayed below the header",
    },
    descriptionText: {
      control: "text",
      description:
        "Optional description text or React node displayed below the subheading",
    },
    buttons: {
      description: "Optional action buttons or interactive elements",
      control: false,
    },
    withoutFilter: {
      control: "boolean",
      description:
        "Adds the height of a filter bar to the space above the image, 91px instead of 52px on desktop, for a screen that has no filter bar above it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    imageStyle: {
      control: "object",
      description:
        "Inline styles for the image and the only way past its fixed size; ignored on windows between 601px and 1023px wide",
    },
    buttonStyle: {
      control: "object",
      description: "Custom CSS styles for the buttons container",
    },
    className: {
      control: "text",
      description: "Additional CSS class name",
    },
    id: {
      control: false,
      description: "Accepted by the type but ignored: it never reaches the DOM",
    },
    style: {
      control: false,
      description:
        "Accepted by the type but ignored; style the outer element through `className`",
    },
  },
} satisfies Meta<typeof EmptyScreenContainer>;

type Story = StoryObj<ComponentProps<typeof EmptyScreenContainer>>;

export default meta;

const ResetFilterButton = () => (
  <div className={styles.resetFilterButton}>
    <CrossReactSvg
      className={styles.crossIcon}
      data-size={IconSizeType.small}
    />
    <Link type={LinkType.action} isHovered>
      Reset filter
    </Link>
  </div>
);

const HomeButton = () => (
  <Link type={LinkType.action} isHovered>
    Go to home
  </Link>
);

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
  parameters: {
    docs: {
      description: {
        story:
          "The full layout, for a list a filter has emptied: a header, a subheading and a description explain why nothing is shown, and a reset action under them offers the way back.",
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
  render: (args) => <EmptyScreenContainer {...args} />,
  args: {
    imageSrc: EmptyImageReactSvg,
    imageAlt: "Empty search results",
    headerText: "No results found",
    buttons: <HomeButton />,
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
  parameters: {
    docs: {
      description: {
        story:
          "For a screen with no filter bar above it, such as a first-run view: the content starts 91px from the top instead of 52px (`withoutFilter`), so it sits as low as it would under a filter bar.",
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
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--empty-screen-header-color\` | Header text colour | theme-based |
| \`--empty-screen-description-color\` | Description text colour | theme-based |
| \`--empty-screen-link-color\` | Colour of links and icons in the actions area | theme-based |
| \`--empty-screen-text-color\` | Colour of plain text (\`span\`) in the actions area; a \`Button\` label keeps its own colour | theme-based |
| \`--empty-screen-width\` | Width on windows wider than 1424px; below that the container shrinks to its content | \`640px\` |

The example sets every variable on one wrapper. The reset action shows the link colour on both its icon and its text, the line under it the plain-text colour; the width applies only on a window wider than 1424px.`,
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
