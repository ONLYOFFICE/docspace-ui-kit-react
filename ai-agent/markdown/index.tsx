import React, { PropsWithChildren, useCallback } from "react";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

import type { MessageMarkdownFieldProps } from "./Markdown.types";

import styles from "./Markdown.module.scss";

import Think from "./Think";

import {
  Anchor,
  Blockquote,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Table,
  Hr,
  Th,
  Td,
  Tr,
  Paragraph,
  Ol,
  Ul,
  Li,
  Code,
} from "./Markdown.utils";

// // Function to replace <think> tags with a placeholder before markdown processing
// const preprocessChatMessage = (text: string): string => {
//   // Replace <think> tags with `<span class="think-tag">think:</span>`
//   return text
//     .replace(/<think>/g, "`<think>`")
//     .replace(/<\/think>/g, "`</think>`");
// };

const LATEX_COMMAND_RE =
  /\\(?:frac|sum|int|prod|lim|left|right|sqrt|over|partial|nabla|infty|Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|Omega|alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega|mathbf|mathrm|mathcal|mathbb|text|begin|end|cdot|times|pm|mp|leq|geq|neq|approx|equiv|sim|propto|forall|exists|in|notin|subset|supset|cup|cap|wedge|vee|neg|hat|vec|bar|tilde|dot|ddot|overline|underbrace|overbrace|binom|pmatrix|bmatrix|vmatrix)[^a-zA-Z]/;

// Normalize all common LaTeX delimiters to remark-math format
const normalizeMathDelimiters = (text: string): string =>
  text
    // \[...\] → $$...$$
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, inner) => `$$${inner}$$`)
    // \(...\) → $...$
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, inner) => `$${inner}$`)
    // Lines that look like bare LaTeX (no delimiters) → $$...$$
    .replace(/^([^\n$]*\\[A-Za-z]+[^\n$]*)$/gm, (line) =>
      LATEX_COMMAND_RE.test(line) ? `$$${line}$$` : line,
    );

const MarkdownField = React.memo(
  ({
    chatMessage,
    propLanguage,
    isFirst,
    successCopyMessage,
    openLink,
    openFile,
  }: MessageMarkdownFieldProps) => {
    // Process the chat message to handle <think> tags
    // const processedChatMessage = preprocessChatMessage(chatMessage);

    const withThinkBlock = chatMessage.includes("<think>");
    const splitedMsg = withThinkBlock
      ? chatMessage.split("</think>\n")
      : [chatMessage];

    const thinkBlock = withThinkBlock
      ? normalizeMathDelimiters(splitedMsg[0].replace("<think>\n", ""))
      : "";

    const CodeWithProps = useCallback(
      (props: PropsWithChildren<{ className?: string }>) => (
        <Code
          {...props}
          propLanguage={propLanguage}
          successCopyMessage={successCopyMessage}
        />
      ),
      [propLanguage, successCopyMessage],
    );

    const AnchorWithProps = useCallback(
      (props: PropsWithChildren<{ href?: string }>) => (
        <Anchor {...props} openLink={openLink} openFile={openFile} />
      ),
      [openLink, openFile],
    );

    const components = {
      h1: H1,
      h2: H2,
      h3: H3,
      h4: H4,
      h5: H5,
      h6: H6,
      a: AnchorWithProps,
      blockquote: Blockquote,
      hr: Hr,
      table: Table,
      th: Th,
      td: Td,
      tr: Tr,
      p: Paragraph,
      ol: Ol,
      ul: Ul,
      li: Li,
      code: CodeWithProps,
    };

    const processedChatMessage = normalizeMathDelimiters(
      (withThinkBlock ? splitedMsg[1] : chatMessage) ?? "",
    );

    return (
      <div style={{ width: "100%" }} className={styles.markdownField}>
        {thinkBlock ? (
          <Think
            isFinished={chatMessage.includes("</think>")}
            isFirst={isFirst}
          >
            <Markdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeKatex]}
              components={components}
            >
              {thinkBlock}
            </Markdown>
          </Think>
        ) : null}
        <Markdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={components}
        >
          {processedChatMessage}
        </Markdown>
      </div>
    );
  },
);

export default MarkdownField;
