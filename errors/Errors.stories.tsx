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

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Error401 } from "./Error401";
import { Error403 } from "./Error403";
import Error404 from "./Error404";
import { ErrorOfflineContainer } from "./ErrorOffline";
import { ErrorInvalidLink } from "./ErrorInvalidLink";
import ErrorUnavailable from "./ErrorUnavailable";
import { AccessRestricted } from "./AccessRestricted";

const setupI18n = () => {
  (window as unknown as Record<string, unknown>).i18n = {
    loaded: {
      "en/Common.json": {
        data: {
          Error401Text: "You are not authorized (401)",
          Error403Text: "Access forbidden (403)",
          Error404Text: "Page not found (404)",
          ErrorOfflineText: "You are offline",
          InvalidLink: "Invalid link",
          LinkDoesNotExist: "This link does not exist or has expired",
          ErrorDeactivatedText:
            "This {{productName}} portal has been deactivated",
          ProductName: "DocSpace",
          AccessDenied: "Access denied",
          PortalRestriction:
            "Access to {{productName}} is restricted for your account",
        },
      },
    },
  };
};

const meta: Meta = {
  title: "Error Pages",
  parameters: {
    docs: {
      description: {
        component:
          "Pre-built error page components that wrap ErrorContainer with common error messages",
      },
    },
  },
  decorators: [
    (Story) => {
      setupI18n();
      return <Story />;
    },
  ],
};

export default meta;

export const Unauthorized: StoryObj = {
  render: () => <Error401 />,
};

export const Forbidden: StoryObj = {
  render: () => <Error403 />,
};

export const NotFound: StoryObj = {
  render: () => <Error404 />,
};

export const Offline: StoryObj = {
  render: () => <ErrorOfflineContainer />,
};

export const InvalidLink: StoryObj = {
  render: () => <ErrorInvalidLink />,
};

export const Unavailable: StoryObj = {
  render: () => <ErrorUnavailable />,
};

export const Restricted: StoryObj = {
  render: () => <AccessRestricted />,
};
