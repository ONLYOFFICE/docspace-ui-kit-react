import type {
  IConfig,
  DocumentEditorProps as OODocumentEditorProps,
} from "@onlyoffice/document-editor-react";

export type { IConfig };

export type DocumentEditorProps = OODocumentEditorProps & {
  /** ID of the file to open in the editor */
  fileId?: number;
  /** Version of the file to open in the editor */
  fileVersion?: number;
  /** Whether the file is in view mode */
  isView?: boolean;
};
