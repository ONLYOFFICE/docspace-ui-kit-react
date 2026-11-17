import React from "react";

import type { CopyToRoomFile } from "./copy-to-room-dialog";

/** A document a tool of a reply created, as its card shows it. */
export type CreatedDocument = {
  /** The portal file id, which opens and copies it. */
  id: number | string;
  /** The saved name, extension included ("Proposal (1).docx"). */
  title: string;
  /** The extension with its dot (".docx"), for the type icon. */
  fileExst: string;
};

const extensionOf = (title: string) => {
  const dot = title.lastIndexOf(".");
  return dot > 0 ? title.slice(dot).toLowerCase() : "";
};

const toDocument = (entry: unknown): CreatedDocument | null => {
  if (!entry || typeof entry !== "object") return null;
  const { id, title, fileExst } = entry as Record<string, unknown>;
  const fileId =
    typeof id === "number" || (typeof id === "string" && id !== "") ? id : null;
  if (fileId === null || typeof title !== "string" || !title) return null;
  return {
    id: fileId,
    title,
    fileExst:
      typeof fileExst === "string" && fileExst
        ? fileExst.toLowerCase()
        : extensionOf(title),
  };
};

/**
 * The documents a tool's stored result names:
 *
 * - the document agent (`document_agent`) answers `{ data: { summary,
 *   files: [{ id, title, url, folderId?, fileExst?, webUrl? }] } }`, and
 *   `{ error, data: { files } }` when its task did not finish, listing the
 *   files saved before the failure;
 * - the editor's generate tools (`onlyoffice_generate_docx` and their kind)
 *   answer `{ data: { id, title, parentId, parentTitle, url } }`.
 *
 * A failure before anything was saved (a plain string, or `{ error }` with
 * no file) names none.
 */
export const createdDocumentsOf = (result: unknown): CreatedDocument[] => {
  if (!result || typeof result !== "object") return [];
  const { data } = result as { data?: unknown };
  if (!data || typeof data !== "object") return [];
  const { files } = data as { files?: unknown };
  const entries = Array.isArray(files) ? files : [data];
  return entries
    .map(toDocument)
    .filter((file): file is CreatedDocument => file !== null);
};

/** What the cards of created documents take from the chat around them. */
export type CreatedDocumentsContextValue = {
  /**
   * The name of the agent the chat runs on, for the "created by" line;
   * `null` for the default agent, whose cards have no such line.
   */
  agentName: string | null;
  /** "Save to room...": the folder selector, then a copy of the file. */
  onSaveToRoom?: (file: CopyToRoomFile) => void;
};

export const CreatedDocumentsContext =
  React.createContext<CreatedDocumentsContextValue>({ agentName: null });
