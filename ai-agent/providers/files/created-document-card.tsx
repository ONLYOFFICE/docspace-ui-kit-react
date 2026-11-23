"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import type {
  ToolResultRenderProps,
  ToolResultRenderer,
} from "@onlyoffice/ai-chat";

import { Button, ButtonSize } from "../../../components/button";
import { iconSize32 } from "../../../utils/image-helpers";

import {
  CreatedDocumentsContext,
  createdDocumentsOf,
  type CreatedDocument,
} from "./created-documents";
import { openAttachedFile } from "./open-file";
import styles from "./created-document-card.module.scss";

const iconOf = (fileExst: string) =>
  iconSize32.get(`${fileExst.replace(/^\./, "")}.svg`) ??
  iconSize32.get("file.svg");

type CreatedDocumentCardProps = {
  file: CreatedDocument;
  /** The agent the chat runs on; `null` leaves the "created by" line out. */
  agentName: string | null;
  onSaveToRoom?: (file: { id: number | string; title: string }) => void;
};

/**
 * A document a reply created: its type icon and name, "created by <agent>"
 * in a chat on an agent, and "Save to room...". A click on the card opens
 * the document; no page count is stated.
 */
export const CreatedDocumentCard = ({
  file,
  agentName,
  onSaveToRoom,
}: CreatedDocumentCardProps) => {
  const { t } = useTranslation(["Common"]);
  const Icon = iconOf(file.fileExst);

  return (
    <div className={styles.card} data-testid="created-document-card">
      <button
        type="button"
        className={styles.open}
        title={file.title}
        data-testid="created-document-open"
        onClick={() => openAttachedFile(`${file.id}/${file.title}`, file.title)}
      >
        {Icon ? <Icon className={styles.icon} aria-hidden="true" /> : null}
        <span className={styles.text}>
          <span className={styles.name}>{file.title}</span>
          {agentName ? (
            <span
              className={styles.createdBy}
              data-testid="created-document-author"
            >
              {t("Common:CreatedByAgent", {
                name: agentName,
                defaultValue: "created by {{name}}",
              })}
            </span>
          ) : null}
        </span>
      </button>
      {onSaveToRoom ? (
        <Button
          size={ButtonSize.small}
          className={styles.action}
          label={t("Common:SaveToRoom", { defaultValue: "Save to room..." })}
          testId="created-document-save-to-room"
          onClick={() => onSaveToRoom({ id: file.id, title: file.title })}
        />
      ) : null}
    </div>
  );
};

/**
 * The chat's drawing of a tool that creates documents
 * (`WidgetConfig.toolResultRenderers`): a card for each document its stored
 * result names, under the tool call's row, drawn again from the stored
 * result when the conversation is opened later. Nothing while the call
 * runs, or when it saved no file.
 */
export const CreatedDocumentsRenderer: ToolResultRenderer = ({
  parsedResult,
  isRunning,
}: ToolResultRenderProps) => {
  const { agentName, onSaveToRoom } = React.useContext(CreatedDocumentsContext);
  if (isRunning) return null;
  const files = createdDocumentsOf(parsedResult);
  if (files.length === 0) return null;
  return (
    <div className={styles.list} data-testid="created-documents">
      {files.map((file) => (
        <CreatedDocumentCard
          key={String(file.id)}
          file={file}
          agentName={agentName}
          onSaveToRoom={onSaveToRoom}
        />
      ))}
    </div>
  );
};
