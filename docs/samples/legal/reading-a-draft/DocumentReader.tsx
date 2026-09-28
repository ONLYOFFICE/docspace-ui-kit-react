import { useState } from "react";

import { Button, ButtonSize } from "../../../../components/button";
import { Loader, LoaderTypes } from "../../../../components/loader";
import { Text } from "../../../../components/text";
import { DocumentEditor } from "../../../../document-editor";
import { FileIcon } from "../../file-icon";
import type { Document } from "../matterRoom";
import styles from "../legal.module.scss";

/**
 * A document opened where the reader is, not downloaded. The kit's
 * `DocumentEditor` asks the portal for the document server's address and
 * for this file's editor configuration -- through `useApi()`, so under the
 * client's provider it asks as the client -- and mounts the editor with it.
 * `isView` asks for a read-only configuration; the portal decides the rest
 * from the reader's role in the room.
 *
 * With no portal there is no document server to load, so a page stands in:
 * the title, the mode, and a few lines that say what would be here.
 */
export const DocumentReader = ({
  document,
  mode,
  demo,
  onClose,
}: {
  document: Document;
  mode: "view" | "edit";
  demo: boolean;
  onClose: () => void;
}) => {
  const [status, setStatus] = useState<"loading" | "ready" | "failed">(
    demo ? "ready" : "loading",
  );
  const [problem, setProblem] = useState("");

  return (
    <div className={styles.reader}>
      <div className={styles.readerHeader}>
        <FileIcon fileExst={document.ext} />
        <div className={styles.matterBody}>
          <Text as="p" className={styles.matterTitle}>
            {document.title}
          </Text>
          <Text as="p" className={styles.matterMeta}>
            {mode === "view"
              ? "Read only. Comments are yours to add; the text is not."
              : "Editing, as the firm."}
          </Text>
        </div>
        <div className={styles.readerActions}>
          {status === "loading" ? (
            <Loader type={LoaderTypes.track} size="20px" />
          ) : null}
          <Button
            size={ButtonSize.extraSmall}
            label="Close"
            onClick={onClose}
          />
        </div>
      </div>

      {status === "failed" ? (
        <div className={styles.statusRow} role="alert">
          <Text as="span" className={`${styles.badge} ${styles.badgeError}`}>
            Did not open
          </Text>
          <Text fontSize="13px" lineHeight="20px">
            {problem}
          </Text>
        </div>
      ) : null}

      {demo ? (
        <div className={styles.paper}>
          <Text as="p" className={styles.paperTitle}>
            {document.title.replace(/\.[^.]+$/, "")}
          </Text>
          <Text as="p" className={styles.paperLine}>
            This is where the document opens, in the ONLYOFFICE editor the
            portal serves. With no portal configured there is no document server
            to load it from, so this page stands in for it.
          </Text>
          <Text as="p" className={styles.paperLine}>
            Connect a portal from the toolbar and press Read on a draft in a
            room you are a member of: the editor below is the real one, in
            read-only mode for a client and in editing mode for the firm.
          </Text>
        </div>
      ) : (
        <div className={styles.editorBox}>
          <DocumentEditor
            id={`draft-${document.id}`}
            fileId={document.id}
            isView={mode === "view"}
            height="100%"
            width="100%"
            events_onAppReady={() => setStatus("ready")}
            onLoadComponentError={(code, message) => {
              setStatus("failed");
              setProblem(
                `${message}${code ? ` (${code})` : ""}. The portal has to know this document server, and the reader has to be a member of the room.`,
              );
            }}
          />
        </div>
      )}
    </div>
  );
};
