/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--empty-screen-header-color": "#0082c9",
          "--empty-screen-description-color": "#1d2d44",
          "--empty-screen-link-color": "#0082c9",
          "--empty-screen-width": "480px",
        } as CSSProperties
      }
    >
      <EmptyScreenContainer
        imageSrc={EmptyImageReactSvg}
        imageAlt="Empty"
        headerText="No files found"
        descriptionText="Create your first file to get started."
        buttons={<HomeButton />}
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
| \`--empty-screen-header-color\` | Header text color | theme black/white |
| \`--empty-screen-description-color\` | Description text color | theme gray |
| \`--empty-screen-link-color\` | Button link/icon color | theme link |
| \`--empty-screen-width\` | Container max width | \`640px\` |`,
      },
    },
  },
};
