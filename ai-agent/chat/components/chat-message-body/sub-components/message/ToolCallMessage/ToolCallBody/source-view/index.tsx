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

import React, { useId, useState } from "react";
import classNames from "classnames";

import UniverseIcon from "../../../../../../../../../assets/universe.react.svg";
import ExternalLinkIcon from "../../../../../../../../../assets/external.link.svg";

import type {
  TToolCallContent,
  TToolCallResultSourceData,
} from "../../../../../../../../../types/ai";
import { Link, LinkTarget } from "../../../../../../../../../components/link";
import { Text } from "../../../../../../../../../components/text";
import { Tooltip } from "../../../../../../../../../components/tooltip";
import { useApi } from "../../../../../../../../../providers/api";
import { combineUrl } from "../../../../../../../../../utils/combineUrl";

import styles from "../../../../../ChatMessageBody.module.scss";
import {
  getKnowledgeDocumentIconByFileName,
  getRootDomain,
} from "../../tool-call/ToolCall.utils";

const SourceItem = ({
  source,
  openLink,
  openFile,
}: {
  source: TToolCallResultSourceData;
  openLink?: (url: string) => void;
  openFile?: (fileId: string) => void;
}) => {
  const tooltipId = useId();
  const [faviconLoadError, setFaviconLoadError] = useState(false);
  const { baseUrl } = useApi();

  const isKnowledgeSource = !!source.fileId;

  const linkHref =
    isKnowledgeSource && source.fileId
      ? combineUrl(baseUrl, source.relativeUrl || "")
      : source.url;

  const sourceContent = isKnowledgeSource
    ? source.text
    : getRootDomain(source.url || "");

  const content = (
    <>
      {faviconLoadError ? (
        <UniverseIcon className={styles.sourceFallbackIcon} />
      ) : isKnowledgeSource ? (
        getKnowledgeDocumentIconByFileName(source.title)
      ) : (
        <img
          src={source.faviconUrl}
          onError={() => setFaviconLoadError(true)}
          alt="source icon"
          width={16}
          height={16}
        />
      )}
      <Text
        className={styles.sourceTitle}
        fontSize="14px"
        fontWeight={600}
        lineHeight="20px"
        truncate
        title={source.title}
      >
        {source.title}
      </Text>
      {sourceContent ? (
        <Text
          data-tooltip-id={tooltipId}
          className={styles.sourceContent}
          fontSize="13px"
          fontWeight={600}
          lineHeight="20px"
          truncate
          title={!isKnowledgeSource ? sourceContent : undefined}
        >
          {sourceContent}
        </Text>
      ) : null}

      {isKnowledgeSource ? (
        <Tooltip
          id={tooltipId}
          maxWidth="700px"
          getContent={() => (
            <Text className={styles.sourceContentTooltipText} fontSize="12px">
              {sourceContent}
            </Text>
          )}
        />
      ) : null}

      <ExternalLinkIcon className={styles.externalLinkIcon} />
    </>
  );

  const handleClick = (e: React.MouseEvent) => {
    // For knowledge base sources, use openFile with fileId
    if (isKnowledgeSource && source.fileId && openFile) {
      e.preventDefault();
      openFile(source.fileId.toString());
    }
    // For web search sources, use openLink with URL
    else if (!isKnowledgeSource && linkHref && openLink) {
      e.preventDefault();
      openLink(linkHref);
    }
  };

  return (
    <Link
      className={styles.sourceItem}
      href={linkHref}
      target={LinkTarget.blank}
      textDecoration="none"
      truncate
      onClick={handleClick}
      data-testid="source-item"
    >
      {content}
    </Link>
  );
};

export const SourceView = ({
  content,
  openLink,
  openFile,
}: {
  content: TToolCallContent;
  openLink?: (url: string) => void;
  openFile?: (fileId: string) => void;
}) => {
  if (!content.result) return null;

  const sources: TToolCallResultSourceData[] = Array.isArray(
    content.result?.data,
  )
    ? content.result?.data
    : [content.result?.data];

  return (
    <div className={styles.sourceView} data-testid="source-view">
      <div className={styles.sourceViewList}>
        {sources.map((source, index) => (
          <SourceItem
            key={`${source.fileId || source.title}_${index * 2}`}
            source={source}
            openLink={openLink}
            openFile={openFile}
          />
        ))}
      </div>
    </div>
  );
};
