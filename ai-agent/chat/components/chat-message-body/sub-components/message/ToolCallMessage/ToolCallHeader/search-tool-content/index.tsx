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

import DocumentsIcon from "../../../../../../../../../assets/icons/16/catalog.documents.react.svg";
import UniverseIcon from "../../../../../../../../../assets/universe.react.svg";
import ExternalLinkIcon from "../../../../../../../../../assets/external.link.svg";

import {
  TToolCallContent,
  TToolCallResultSourceData,
} from "../../../../../../../../../types/ai";
import { useMessageStore } from "../../../../../../../store/messageStore";
import styles from "../../../../../ChatMessageBody.module.scss";
import { Text } from "../../../../../../../../../components/text";
import { Link, LinkTarget } from "../../../../../../../../../components/link";
import { useCommonTranslation } from "../../../../../../../../../utils/i18n";

const WebCrawlingToolContent = ({
  content,
  openLink,
}: {
  content: TToolCallContent;
  openLink?: (url: string) => void;
}) => {
  const t = useCommonTranslation();
  const toolInfo = ((content.result?.data as TToolCallResultSourceData)
    ?.title || content.arguments.url) as string;

  const hasError = !!content.result?.error;

  const handleClick = (e: React.MouseEvent) => {
    if (openLink && content.arguments?.url) {
      e.preventDefault();
      openLink(content.arguments.url as string);
    }
  };

  return hasError ? (
    <>
      <UniverseIcon
        className={styles.searchToolIcon}
        data-testid="universe-icon"
      />
      <Text fontSize="13px" lineHeight="20px" fontWeight={600} truncate>
        {t("WebCrawling")} |{" "}
        <span title={toolInfo}>{toolInfo}</span>
      </Text>
    </>
  ) : (
    <Link
      style={{ display: "contents" }}
      href={content.arguments?.url as string}
      target={LinkTarget.blank}
      textDecoration="none"
      onClick={handleClick}
    >
      <UniverseIcon
        className={styles.searchToolIcon}
        data-testid="universe-icon"
      />
      <Text fontSize="13px" lineHeight="20px" fontWeight={600} truncate>
        {t("WebCrawling")} |{" "}
        <span title={toolInfo}>{toolInfo}</span>
      </Text>
      <ExternalLinkIcon
        className={styles.externalLinkIcon}
        data-testid="external-link-icon"
      />
    </Link>
  );
};

const WebSearchToolContent = ({ content }: { content: TToolCallContent }) => {
  const t = useCommonTranslation();
  const toolInfo = content.arguments.query as string;

  return (
    <>
      <UniverseIcon
        className={styles.searchToolIcon}
        data-testid="universe-icon"
      />
      <Text fontSize="13px" lineHeight="20px" fontWeight={600} truncate>
        {t("WebSearch")} |{" "}
        <span title={toolInfo}>{toolInfo}</span>
      </Text>
    </>
  );
};

const KnowledgeSearchToolContent = ({
  content,
}: {
  content: TToolCallContent;
}) => {
  const t = useCommonTranslation();
  const toolInfo = content.arguments.query as string;

  return (
    <>
      <DocumentsIcon
        className={styles.searchToolIcon}
        data-testid="documents-icon"
      />
      <Text fontSize="13px" lineHeight="20px" fontWeight={600} truncate>
        {t("KnowledgeSearch")} |{" "}
        <span title={toolInfo}>{toolInfo}</span>
      </Text>
    </>
  );
};

export const SearchToolContent = ({
  content,
  openLink,
}: {
  content: TToolCallContent;
  openLink?: (url: string) => void;
}) => {
  const { knowledgeSearchToolName, webSearchToolName, webCrawlingToolName } =
    useMessageStore();

  return (
    <>
      {content.name === knowledgeSearchToolName ? (
        <KnowledgeSearchToolContent content={content} />
      ) : null}

      {content.name === webSearchToolName ? (
        <WebSearchToolContent content={content} />
      ) : null}

      {content.name === webCrawlingToolName ? (
        <WebCrawlingToolContent
          content={content}
          openLink={openLink}
        />
      ) : null}
    </>
  );
};
