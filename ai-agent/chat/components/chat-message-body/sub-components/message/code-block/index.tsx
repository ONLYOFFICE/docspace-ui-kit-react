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
import copy from "copy-to-clipboard";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
// @ts-expect-error file not inside global exports
import a11yLight from "react-syntax-highlighter/dist/cjs/styles/prism/a11y-one-light";

import CopyIcon from "../../../../../../../assets/icons/16/copy.react.svg";

import { useTheme } from "../../../../../../../context/ThemeContext";

import { Text } from "../../../../../../../components/text";
import { IconButton } from "../../../../../../../components/icon-button";
import { Scrollbar } from "../../../../../../../components/scrollbar";
import { toastr } from "../../../../../../../components/toast";

import styles from "../../../ChatMessageBody.module.scss";

import { MessageCodeBlockProps } from "../../../../../Chat.types";
import { useCommonTranslation } from "../../../../../../../utils/i18n";

const CodeBlock = ({
  language,
  content,
  successCopyMessage,
}: MessageCodeBlockProps) => {
  const t = useCommonTranslation();
  const { isBase } = useTheme();

  const onCopy = () => {
    copy(content);
    toastr.success(
      successCopyMessage ?? t("CopiedToClipboard"),
    );
  };

  return (
    <div className={styles.codeContainer} data-testid="code-block">
      <div className={styles.codeHeader}>
        {language ? <Text>{language}</Text> : null}
        <IconButton
          iconNode={<CopyIcon />}
          size={16}
          isClickable
          onClick={onCopy}
          aria-label="copy button"
        />
      </div>
      <Scrollbar
        className={styles.codeBlockScroll}
        translateContentSizeYToHolder
        rtl={false}
      >
        <SyntaxHighlighter
          language={language}
          style={isBase ? a11yLight : a11yDark}
          className={styles.codeBody}
          customStyle={isBase ? {} : { background: "none" }}
        >
          {content}
        </SyntaxHighlighter>
      </Scrollbar>
    </div>
  );
};

export default CodeBlock;
