import type {
  IConfig,
  DocumentEditorProps as OODocumentEditorProps,
} from "@onlyoffice/document-editor-react";

export type { IConfig };

type EditorProps = Omit<OODocumentEditorProps, "documentServerUrl" | "config">;

/**
 * The editor given everything by the caller: where the document server is
 * and the configuration the portal (or anything else) produced for the file.
 */
type WithConfig = {
  /** URL of the ONLYOFFICE Document Server the editor script is loaded from. */
  documentServerUrl: string;
  /** Editor configuration, as the document server's API defines it. */
  config: IConfig;
  fileId?: never;
  fileVersion?: never;
  isView?: never;
};

/**
 * The editor given a file: the wrapper asks the portal behind the nearest
 * `ApiProvider` for the document server's address and for this file's
 * configuration, so both are minted for whoever that provider speaks for.
 */
type ByFileId = {
  /** ID of the file to open in the editor */
  fileId: number;
  /** Version of the file to open in the editor */
  fileVersion?: number;
  /** Whether the file is opened in view mode */
  isView?: boolean;
  documentServerUrl?: never;
  config?: never;
};

export type DocumentEditorProps = EditorProps & (WithConfig | ByFileId);
