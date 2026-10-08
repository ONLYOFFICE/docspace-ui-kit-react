import { useCallback, useEffect, useState } from "react";

import { useApi } from "../../../providers/api";
import { demoPortal } from "./demo-portal";
import { explainPortalError } from "./explain";
import {
  CLIENT_FOLDER,
  FIRM_FOLDER,
  type FolderContents,
  type FolderLike,
  type MatterRoom,
  readMatterRoom,
} from "./matterRoom";

/**
 * A matter's room, read through whatever the nearest `ApiProvider` may see:
 * the lawyer's key or the client's token, like `useMatters`.
 *
 * Two writes, both a lawyer's: `ask` adds a line to the checklist by creating
 * a subfolder, and `setUp` gives a plain room its two folders. Nothing else
 * changes on the portal from here -- a client's upload is the next screen.
 *
 * With no portal the same walk runs over the demo portal, which every screen
 * shares, so the writes made here are there when the next screen looks.
 */
export type MatterRoomState =
  | { status: "loading" }
  | { status: "ready"; room: MatterRoom; demo: boolean }
  | { status: "error"; message: string };

const PAGE = 100;

export const useMatterRoom = (roomId: number) => {
  const { baseUrl, foldersApi } = useApi();
  const [state, setState] = useState<MatterRoomState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  const read = useCallback(
    async (folderId: number): Promise<FolderContents> => {
      if (!baseUrl) return demoPortal.listFolder(folderId);
      const page = (
        await foldersApi.getFolderByFolderId({ folderId, count: PAGE })
      ).data.response;
      return {
        folders: (page?.folders ?? []) as FolderLike[],
        files: (page?.files ?? []) as FolderContents["files"],
      };
    },
    [baseUrl, foldersApi],
  );

  const create = useCallback(
    async (parentId: number, title: string) => {
      if (!baseUrl) {
        demoPortal.createFolder(parentId, title);
        return;
      }
      await foldersApi.createFolder({
        folderId: parentId,
        createFolder: { title },
      });
    },
    [baseUrl, foldersApi],
  );

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    readMatterRoom(roomId, read)
      .then((room) => {
        if (!cancelled) setState({ status: "ready", room, demo: !baseUrl });
      })
      .catch((error) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: explainPortalError(error, "open this room"),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [roomId, read, baseUrl, attempt]);

  const run = useCallback(
    async (action: () => Promise<void>, denied: string) => {
      setBusy(true);
      setActionError("");
      try {
        await action();
        reload();
      } catch (error) {
        setActionError(explainPortalError(error, denied));
      } finally {
        setBusy(false);
      }
    },
    [reload],
  );

  /** Add a line to the checklist: a subfolder of "From the client". */
  const ask = useCallback(
    (title: string) => {
      if (state.status !== "ready" || state.room.layout !== "matter") return;
      const parentId = state.room.clientFolderId;
      return run(() => create(parentId, title), "add a folder here");
    },
    [state, create, run],
  );

  /** Give a plain room its two folders. */
  const setUp = useCallback(
    () =>
      run(async () => {
        await create(roomId, CLIENT_FOLDER);
        await create(roomId, FIRM_FOLDER);
      }, "add folders to this room"),
    [roomId, create, run],
  );

  /**
   * A request has been answered: files landed in its folder. On a portal
   * the upload itself is the kit's `Uploader`, so there is only the re-read
   * to do; with no portal the files go into the demo map first, as the
   * portal would hold them.
   */
  const receive = useCallback(
    (requestId: number, files: File[]) => {
      if (!baseUrl) {
        for (const file of files) {
          demoPortal.addFile(requestId, {
            title: file.name,
            bytes: file.size,
            by: "You",
          });
        }
      }
      reload();
    },
    [baseUrl, reload],
  );

  return { state, reload, ask, setUp, receive, busy, actionError };
};
