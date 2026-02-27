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

import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import CrossReactSvg from "../../assets/icons/12/cross.react.svg";
import EmptyImageReactSvg from "../../assets/empty.rooms.root.light.svg?url";

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

- **Image Display**: Configurable empty state illustration with custom sizing
- **Text Content**: Header, subheading, and description text sections
- **Action Buttons**: Optional button area for filter reset or navigation actions
- **Filter Variant**: Styling variant for filter-related empty states via \`withoutFilter\`

### Usage

\`\`\`tsx
import { EmptyScreenContainer } from "@docspace/ui-kit/components/empty-screen-container";

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
      description: "Whether to display without filter styling",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    imageStyle: {
      control: "object",
      description: "Custom CSS styles for the image (desktop only)",
    },
    buttonStyle: {
      control: "object",
      description: "Custom CSS styles for the buttons container",
    },
    className: {
      control: "text",
      description: "Additional CSS class name",
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
          "Full-featured empty state with header, subheading, description, and a reset filter button.",
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
          "Minimal empty state with only header text and a navigation button.",
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
          "Empty state with custom image dimensions and button container spacing.",
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
          "Welcome screen variant without filter-related styling, suitable for onboarding views.",
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
