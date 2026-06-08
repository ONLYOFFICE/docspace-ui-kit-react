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

import React from "react";

import DocumentsIcon from "../../../../../../../../../assets/icons/16/catalog.documents.react.svg";
import UniverseIcon from "../../../../../../../../../assets/universe.react.svg";
import ExternalLinkIcon from "../../../../../../../../../assets/external.link.svg";

import { TToolCallContent } from "../../../../../../../../../types/ai";
import { useMessageStore } from "../../../../../../../store/messageStore";
import {
  getToolResultData,
  hasToolResultError,
} from "../../tool-call/ToolCall.utils";
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
  const { webCrawlingToolName } = useMessageStore();

  const url =
    typeof content.arguments?.url === "string" ? content.arguments.url : "";

  const resultTitle = getToolResultData(content)?.title;
  const toolInfo =
    (typeof resultTitle === "string" && resultTitle) || url;

  const hasError = hasToolResultError(content, [webCrawlingToolName]);

  const handleClick = (e: React.MouseEvent) => {
    if (openLink && url) {
      e.preventDefault();
      openLink(url);
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
      href={url}
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
  const toolInfo =
    typeof content.arguments?.query === "string"
      ? content.arguments.query
      : "";

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
  const toolInfo =
    typeof content.arguments?.query === "string"
      ? content.arguments.query
      : "";

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
