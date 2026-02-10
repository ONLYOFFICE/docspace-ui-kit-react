/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 */

import React from "react";
import { Meta, StoryObj } from "@storybook/react-vite";

import { DialogModalSkeleton } from "./Dialog.modal";
import { DialogAsideSkeleton } from "./Dialog.aside";
import { DialogInvitePanelSkeleton } from "./Dialog.invite";
import { DialogReassignmentSkeleton } from "./Dialog.reassignment";

const meta = {
  title: "Components/Skeletons/Dialog",
  parameters: {
    docs: {
      description: {
        component: "Loading skeleton components for various dialog types",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultDialog: Story = {
  name: "Default Dialog",
  render: () => <DialogModalSkeleton isLarge={false} withFooterBorder={false} />,
  parameters: {
    docs: {
      description: {
        story:
          "Default dialog skeleton with standard size and no footer border",
      },
    },
  },
};

export const LargeDialog: Story = {
  name: "Large Dialog",
  render: () => <DialogModalSkeleton isLarge withFooterBorder />,
  parameters: {
    docs: {
      description: {
        story: "Large dialog skeleton with footer border",
      },
    },
  },
};

export const AsideDialog: Story = {
  name: "Aside Dialog",
  render: () => (
    <div style={{ height: "500px", position: "relative" }}>
      <DialogAsideSkeleton
        isPanel={false}
        withoutAside={false}
        withFooterBorder
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Aside dialog skeleton with footer border",
      },
    },
  },
};

export const PanelDialog: Story = {
  name: "Panel Dialog",
  render: () => (
    <div style={{ height: "500px", position: "relative" }}>
      <DialogAsideSkeleton isPanel withoutAside={false} withFooterBorder />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Panel dialog skeleton with footer border",
      },
    },
  },
};

export const InvitePanel: Story = {
  name: "Invite Panel",
  render: () => (
    <div style={{ height: "500px", position: "relative" }}>
      <DialogInvitePanelSkeleton />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Invite panel skeleton with external links and input sections",
      },
    },
  },
};

export const ReassignmentDialog: Story = {
  name: "Reassignment Dialog",
  render: () => <DialogReassignmentSkeleton />,
  parameters: {
    docs: {
      description: {
        story:
          "Data reassignment dialog skeleton showing user and new owner sections",
      },
    },
  },
};
