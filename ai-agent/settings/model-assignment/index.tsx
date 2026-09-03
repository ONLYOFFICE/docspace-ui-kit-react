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

import { useTranslation } from "react-i18next";

import { ModelAssignmentPage } from "@onlyoffice/ai-chat";

import { Heading } from "../../../components/heading";
import { Text } from "../../../components/text";

import styles from "./ModelAssignment.module.scss";

const ModelAssignment = () => {
  const { t } = useTranslation(["Common"]);

  return (
    <ModelAssignmentPage
      hideHeader
      noPadding
      className={styles.modelAssignment}
      // The field sits right under the "Default AI model" heading, so its own
      // caption is redundant. `FieldContainer` requires a `header`, and the
      // page falls back to its own label only on `undefined` — an empty
      // string is the supported way to render the row without a caption.
      defaultModelLabel=""
      defaultSetupHeader={
        <>
          <Heading
            level={3}
            fontWeight={700}
            fontSize="16px"
            lineHeight="22px"
            className={styles.defaultSetupTitle}
          >
            {t("Common:DefaultAISetupTitle")}
          </Heading>
          <Text lineHeight="20px" className={styles.defaultSetupDescription}>
            {t("Common:DefaultAISetupDescription")}
          </Text>
        </>
      }
    />
  );
};

export default ModelAssignment;
