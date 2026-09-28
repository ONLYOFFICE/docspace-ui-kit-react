import Dropzone from "../../../../components/dropzone";
import { toastr } from "../../../../components/toast";
import { useApi } from "../../../../providers/api";
import { Uploader } from "../../../../uploader";
import { roomUrl } from "../matter";
import type { Request } from "../matterRoom";
import styles from "../legal.module.scss";

/**
 * How a client answers a request: a file dropped straight into the request's
 * folder on the portal. The kit's `Uploader` does the whole thing -- a
 * chunked upload session, the chunks in parallel, the finalise -- against
 * whatever token the nearest `ApiProvider` holds, which here is the client's.
 * The folder is the request, so `targetId` is all it needs to know.
 *
 * With no portal there is no session to open, so the `Dropzone` the uploader
 * is built on takes the file and hands it to `onSent`, which puts it where
 * the portal would have.
 */
const ACCEPT = ".pdf,.jpg,.jpeg,.png,.docx,.xlsx,.zip";
const SHORT = "PDF, JPG, PNG, DOCX";
const FULL = "PDF, JPG, JPEG, PNG, DOCX, XLSX, ZIP";

export const SendDocument = ({
  request,
  demo,
  onSent,
}: {
  request: Request;
  demo: boolean;
  /** Called once the files are in the folder; in demo, with the files. */
  onSent: (files: File[]) => void;
}) => {
  const { baseUrl } = useApi();

  return (
    <div className={styles.sendBox}>
      {demo ? (
        <Dropzone
          accept={ACCEPT}
          isLoading={false}
          isMultipleUpload
          linkMainText="Choose a file"
          linkSecondaryText="or drop it here"
          exstsText={SHORT}
          fullExstsText={FULL}
          formatsPlusBadgeValue={3}
          onDrop={(files) => onSent(files)}
          onDropRejected={() =>
            toastr.error("That kind of file is not accepted.")
          }
        />
      ) : (
        <Uploader
          targetId={request.id}
          accept={ACCEPT}
          shortText={SHORT}
          fullText={FULL}
          badgeValue={3}
          linkMainText="Choose a file"
          secondaryText="or drop it here"
          isMultipleUpload
          maxPerUploadSize="25MB"
          onUploadSuccess={() => onSent([])}
          onUploadError={({ error }) => toastr.error(error)}
          getFolderUrl={(folderId) => roomUrl(baseUrl, Number(folderId))}
        />
      )}
    </div>
  );
};
