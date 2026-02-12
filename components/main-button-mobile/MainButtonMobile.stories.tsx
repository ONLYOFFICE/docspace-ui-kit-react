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

import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import classNames from "classnames";

import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";
import DownloadReactSvgUrl from "../../assets/icons/16/download.react.svg?url";

import { MainButtonMobile } from ".";
import styles from "./MainButtonMobile.stories.module.scss";

const meta = {
  title: "Components/Interactive elements/MainButtonMobile",
  component: MainButtonMobile,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A mobile-friendly floating action button with dropdown menu and progress indicators",
      },
    },
  },
  argTypes: {
    percent: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Upload progress percentage",
    },
    opened: {
      control: "boolean",
      description: "Controls whether the dropdown menu is open",
    },
    alert: {
      control: "boolean",
      description: "Shows an alert indicator on the button",
    },
    withMenu: {
      control: "boolean",
      description: "Whether to show the dropdown menu",
      defaultValue: true,
    },
  },
} satisfies Meta<typeof MainButtonMobile>;

type Story = StoryObj<typeof meta>;

export default meta;

const actionOptions = [
  {
    key: "1",
    label: "New document",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: "2",
    label: "New presentation",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: "3",
    label: "New spreadsheet",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: "4",
    label: "New folder",
    icon: CatalogFolderReactSvgUrl,
  },
];

const Template = ({ ...args }) => {
  const [isOpenButton, setIsOpenButton] = useState(false);

  const buttonOptions = [
    {
      key: "1",
      label: "Import files",
      icon: DownloadReactSvgUrl,
      onClick: () => setIsOpenButton(false),
    },
    {
      key: "2",
      label: "Import folder",
      icon: DownloadReactSvgUrl,
      onClick: () => setIsOpenButton(false),
    },
    {
      key: "4",
      label: "Upload from cloud",
      icon: DownloadReactSvgUrl,
      onClick: () => setIsOpenButton(false),
    },
  ];

  const isAutoDocs =
    typeof window !== "undefined" && window?.location?.href.includes("docs");

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.isAutoDocs]: isAutoDocs,
      })}
    >
      <MainButtonMobile
        {...args}
        style={{
          position: "fixed",
          bottom: "24px",
          insetInlineEnd: "24px",
        }}
        actionOptions={actionOptions}
        dropdownStyle={
          {
            "--main-button-mobile-dropdown-position": "absolute",
            "--main-button-mobile-dropdown-right": "60px",
            "--main-button-mobile-dropdown-bottom": "60px",
          } as React.CSSProperties
        }
        buttonOptions={buttonOptions}
        withButton
        isOpenButton={isOpenButton}
        opened={false}
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    title: "Upload",
    opened: false,
    alert: false,
    withMenu: true,
    actionOptions,
  },
};
