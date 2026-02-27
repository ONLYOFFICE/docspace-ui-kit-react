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

import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, Heading, HeadingSize, Text } from "../";
import { LoaderWrapper } from ".";

const meta = {
  title: "UI/Status components/LoaderWrapper",
  component: LoaderWrapper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "LoaderWrapper blurs children and disables pointer events when isLoading is true.",
      },
    },
    layout: "centered",
  },
  argTypes: {
    children: {
      control: false,
      description: "Content to render inside the wrapper.",
    },
    isLoading: {
      control: "boolean",
      description: "Toggles the loading overlay style and interaction lock.",
    },
    testId: {
      control: "text",
      description:
        "Optional testing identifier applied to the wrapper element.",
    },
  },
} satisfies Meta<typeof LoaderWrapper>;

export default meta;

type Story = StoryObj<typeof LoaderWrapper>;

const cardContent = (
  <div
    style={{
      padding: "24px 32px",
      borderRadius: "16px",
      border: "1px solid var(--stroke-light, #e1e6eb)",
      background: "var(--background-surface, #fff)",
      minWidth: 320,
      maxWidth: 420,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    <Heading size={HeadingSize.medium}>Lorem ipsum</Heading>
    <Text color="var(--text-secondary, #4f5d75)" lineHeight="22px">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </Text>
    <Button primary label="Lorem ipsum" />
  </div>
);

export const IdleContent: Story = {
  args: {
    isLoading: false,
    children: cardContent,
  },
};

export const LoadingContent: Story = {
  args: {
    isLoading: true,
    children: cardContent,
  },
};
