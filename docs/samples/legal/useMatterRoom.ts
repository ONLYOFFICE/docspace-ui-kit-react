import { useCallback, useEffect, useRef, useState } from "react";

import { useApi } from "../../../providers/api";
import { DEMO_FOLDERS } from "./demo-matter-contents";
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
 * With no portal the same walk runs over the demo folders, kept in a map for
 * the life of the screen so the two writes work there too.
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

  // The demo portal: a copy of the demo folders this screen may add to.
  const demo = useRef<Record<number, FolderContents>>(
    structuredClone(DEMO_FOLDERS),
  );

  const read = useCallback(
    async (folderId: number): Promise<FolderContents> => {
      if (!baseUrl) {
        return demo.current[folderId] ?? { folders: [], files: [] };
      }
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
        const parent = (demo.current[parentId] ??= { folders: [], files: [] });
        const id = Date.now() % 1_000_000_000;
        const now = new Date().toISOString();
        parent.folders.push({
          id,
          title,
          filesCount: 0,
          foldersCount: 0,
          created: now,
          updated: now,
        });
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

  return { state, reload, ask, setUp, busy, actionError };
};
