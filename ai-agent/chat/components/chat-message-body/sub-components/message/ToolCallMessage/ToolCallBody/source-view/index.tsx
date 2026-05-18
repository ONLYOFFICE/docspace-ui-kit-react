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
