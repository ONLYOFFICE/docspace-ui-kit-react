import React from "react";
import copy from "copy-to-clipboard";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
// @ts-expect-error file not inside global exports
import a11yLight from "react-syntax-highlighter/dist/cjs/styles/prism/a11y-one-light";

import CopyIcon from "../../../assets/icons/16/copy.react.svg";

import { useTheme } from "../../../context/ThemeContext";

import { Text } from "../../../components/text";
import { IconButton } from "../../../components/icon-button";
import { Scrollbar } from "../../../components/scrollbar";
import { toastr } from "../../../components/toast";

import styles from "../Markdown.module.scss";

import { MessageCodeBlockProps } from "../Markdown.types";
import { useCommonTranslation } from "../../../utils/i18n";

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
