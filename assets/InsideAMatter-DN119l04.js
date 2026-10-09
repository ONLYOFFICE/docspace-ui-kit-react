import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r}from"./blocks-D1qLjfJS.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{i as a,r as o}from"./react-qN2cStNd.js";import{n as s,t as c}from"./Source-CbxT880K.js";import{n as l,r as u,t as d}from"./InsideAMatter.stories-B7aBPMxQ.js";var f;function p(){return(p=e((()=>{f=`import type {
  FileDtoInteger,
  FolderDtoInteger,
} from "@onlyoffice/docspace-api-sdk";

import { isoOf, type PortalAuthor, type PortalTime } from "./matter";

/**
 * Inside a matter's room, two folders carry what the cabinet has to say:
 *
 *   From the client      the checklist. One subfolder per document the firm
 *                        asked for; empty means still needed, a file inside
 *                        means received -- on the day the file arrived, by
 *                        whoever uploaded it.
 *   From the firm        drafts and letters for the client to read.
 *
 * Folders, because a folder is what a client can be asked to put a file in,
 * what the portal already counts and dates, and what a lawyer can add from
 * ONLYOFFICE without this application. Anything else in the room is the
 * firm's working material and is left alone.
 *
 * The names are a convention, matched without regard to case or spacing so a
 * folder renamed by hand still counts.
 */
export const CLIENT_FOLDER = "From the client";
export const FIRM_FOLDER = "From the firm";

export type FolderLike = Pick<
  FolderDtoInteger,
  "id" | "title" | "filesCount" | "foldersCount"
> & {
  createdBy?: PortalAuthor;
  created?: PortalTime;
  updated?: PortalTime;
};

export type FileLike = Pick<
  FileDtoInteger,
  "id" | "title" | "fileExst" | "folderId" | "pureContentLength" | "webUrl"
> & {
  createdBy?: PortalAuthor;
  created?: PortalTime;
  updated?: PortalTime;
};

/** What one folder holds, as \`getFolderByFolderId\` answers. */
export type FolderContents = { folders: FolderLike[]; files: FileLike[] };

/** A file, told the way a person reads it. */
export type Document = {
  id: number;
  title: string;
  /** Extension with the dot, as the portal sends it: ".pdf". */
  ext: string;
  bytes: number;
  by: string;
  updated: string;
  /** The file's page on the portal, or "" when the portal sent none. */
  url: string;
};

/** One line of the checklist: a subfolder of "From the client". */
export type Request = {
  id: number;
  title: string;
  received: boolean;
  documents: Document[];
  /** When the firm asked: the folder's creation time. */
  asked: string;
  /** When the folder last changed, which for a received one is the upload. */
  updated: string;
};

export type MatterRoom =
  /** A room without the checklist folder: a room, not yet a matter's home. */
  | { layout: "plain"; folders: number; files: number }
  | {
      layout: "matter";
      clientFolderId: number;
      firmFolderId?: number;
      requests: Request[];
      drafts: Document[];
      /** Folders and loose files outside the two sections. */
      otherFolders: number;
      otherFiles: number;
    };

const fold = (title: string) => title.trim().replace(/\\s+/g, " ").toLowerCase();

export const isSection = (folder: FolderLike, name: string) =>
  fold(folder.title ?? "") === fold(name);

const newestFirst = (a: Document, b: Document) =>
  (Date.parse(b.updated) || 0) - (Date.parse(a.updated) || 0);

export const documentFrom = (file: FileLike): Document => ({
  id: file.id ?? 0,
  title: file.title ?? "Untitled",
  ext: file.fileExst ?? "",
  bytes: file.pureContentLength ?? 0,
  by: file.createdBy?.displayName ?? "",
  updated: isoOf(file.updated) || isoOf(file.created),
  url: file.webUrl ?? "",
});

export const requestFrom = (folder: FolderLike, files: FileLike[]): Request => {
  const documents = files.map(documentFrom).sort(newestFirst);
  return {
    id: folder.id ?? 0,
    title: folder.title ?? "Untitled",
    received: documents.length > 0 || (folder.filesCount ?? 0) > 0,
    documents,
    asked: isoOf(folder.created),
    // The newest file says when the request was answered; the folder's own
    // stamp is the fallback, for a slot whose files were not fetched.
    updated: documents[0]?.updated || isoOf(folder.updated),
  };
};

export const progressOf = (requests: Request[]) => {
  const total = requests.length;
  const received = requests.filter((request) => request.received).length;
  return {
    received,
    total,
    percent: total ? Math.round((received / total) * 100) : 0,
  };
};

/** "1.2 MB", "380 KB", "" for nothing. Enough for a list; not a locale job. */
export const formatSize = (bytes: number) => {
  if (!bytes) return "";
  if (bytes < 1024) return \`\${bytes} B\`;
  if (bytes < 1024 * 1024) return \`\${Math.round(bytes / 1024)} KB\`;
  return \`\${(bytes / (1024 * 1024)).toFixed(1)} MB\`;
};

/**
 * Read a matter's room the way the portal lets it be read: one folder at a
 * time. The room's top level names the sections; the checklist folder lists
 * the requests; each request that holds something is opened for its files;
 * the firm's folder is opened for its drafts.
 *
 * \`read\` is whatever answers for a folder id -- the portal through the SDK,
 * or a map of demo folders -- so the walk is the same in both cases and can
 * be tested without either.
 */
export const readMatterRoom = async (
  roomId: number,
  read: (folderId: number) => Promise<FolderContents>,
): Promise<MatterRoom> => {
  const room = await read(roomId);
  const client = room.folders.find((folder) =>
    isSection(folder, CLIENT_FOLDER),
  );
  const firm = room.folders.find((folder) => isSection(folder, FIRM_FOLDER));

  if (client?.id === undefined) {
    return {
      layout: "plain",
      folders: room.folders.length,
      files: room.files.length,
    };
  }

  const [slots, sent] = await Promise.all([
    read(client.id),
    firm?.id !== undefined ? read(firm.id) : { folders: [], files: [] },
  ]);

  const requests = await Promise.all(
    slots.folders.map(async (slot) => {
      // Only a folder with something in it is worth another call.
      const files =
        slot.id !== undefined && (slot.filesCount ?? 0) > 0
          ? (await read(slot.id)).files
          : [];
      return requestFrom(slot, files);
    }),
  );

  return {
    layout: "matter",
    clientFolderId: client.id,
    firmFolderId: firm?.id,
    requests,
    drafts: sent.files.map(documentFrom).sort(newestFirst),
    otherFolders: room.folders.length - (firm ? 2 : 1),
    otherFiles: room.files.length,
  };
};
`})))()}var m;function h(){return(h=e((()=>{m=`import { useCallback, useEffect, useState } from "react";

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
 * A matter's room, read through whatever the nearest \`ApiProvider\` may see:
 * the lawyer's key or the client's token, like \`useMatters\`.
 *
 * Two writes, both a lawyer's: \`ask\` adds a line to the checklist by creating
 * a subfolder, and \`setUp\` gives a plain room its two folders. Nothing else
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
   * the upload itself is the kit's \`Uploader\`, so there is only the re-read
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
`})))()}var g;function _(){return(_=e((()=>{g=`import { type FormEvent, type ReactNode, useState } from "react";

import EmptyRoomsDarkSvg from "../../../../assets/emptyview/empty.rooms.root.user.dark.svg";
import EmptyRoomsLightSvg from "../../../../assets/emptyview/empty.rooms.root.user.light.svg";
import { Button, ButtonSize } from "../../../../components/button";
import { CollapsibleCard } from "../../../../components/collapsible-card";
import { ColumnarInfoBar } from "../../../../components/columnar-info-bar";
import { ComboBox, type TOption } from "../../../../components/combobox";
import { EmptyView } from "../../../../components/empty-view";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../../components/heading";
import { Link, LinkTarget, LinkType } from "../../../../components/link";
import { Loader, LoaderTypes } from "../../../../components/loader";
import { ProgressBar } from "../../../../components/progress-bar";
import { Text } from "../../../../components/text";
import {
  InputSize,
  InputType,
  TextInput,
} from "../../../../components/text-input";
import { toastr } from "../../../../components/toast";
import { useTheme } from "../../../../context/ThemeContext";
import { useApi } from "../../../../providers/api";
import { FileIcon } from "../../file-icon";
import { ClientSession } from "../ClientSession";
import {
  type KnownStage,
  type Matter,
  roomUrl,
  STAGE_FOR_CLIENT,
  updatedAgo,
} from "../matter";
import { MatterLogo, plural, StageBadge, Who } from "../matter-bits";
import {
  CLIENT_FOLDER,
  type Document,
  FIRM_FOLDER,
  formatSize,
  progressOf,
  type Request,
} from "../matterRoom";
import type { Persona } from "../persona";
import { DocumentReader } from "../reading-a-draft/DocumentReader";
import { SendDocument } from "../sending-a-document/SendDocument";
import { useMatterRoom } from "../useMatterRoom";
import { useMattersView } from "../useMattersView";
import styles from "../legal.module.scss";

/**
 * One matter, opened. What the firm still needs from the client, what has
 * arrived, and what the firm sent back -- all of it folders in the matter's
 * room, read through whichever token the nearest \`ApiProvider\` holds.
 *
 * The checklist is the folder "From the client": one subfolder per document
 * asked for, empty until it arrives. The portal already counts and dates a
 * folder's contents, so the state of every line is the portal's, not this
 * application's. A lawyer adds a line by adding a folder; the client, on the
 * next screen, answers one by dropping a file in it.
 */
const join = (parts: (string | false | undefined)[]) =>
  parts.filter(Boolean).join(" • ");

const OpenLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    type={LinkType.page}
    href={href}
    target={LinkTarget.blank}
    color="accent"
    isHovered
    fontSize="13px"
  >
    {label}
  </Link>
);

/** A file the firm sent: what it is, who last touched it, how big. */
const DocumentLine = ({
  document,
  onOpen,
  openLabel,
}: {
  document: Document;
  /** Given, the line gets a button that opens the file where the reader is. */
  onOpen?: (document: Document) => void;
  openLabel?: string;
}) => {
  const { baseUrl } = useApi();
  const href =
    document.url && baseUrl ? new URL(document.url, baseUrl).toString() : "";

  return (
    <li className={styles.matter}>
      <FileIcon fileExst={document.ext} />
      <div className={styles.matterBody}>
        <Text as="p" className={styles.matterTitle}>
          {document.title}
        </Text>
        <Text as="p" className={styles.matterMeta}>
          {join([
            document.by,
            updatedAgo(document.updated),
            formatSize(document.bytes),
          ])}
        </Text>
        {href ? <OpenLink href={href} label="Open in ONLYOFFICE" /> : null}
      </div>
      {onOpen ? (
        <Button
          size={ButtonSize.extraSmall}
          primary
          label={openLabel ?? "Open"}
          onClick={() => onOpen(document)}
        />
      ) : null}
    </li>
  );
};

/** One line of the checklist, told for whoever is reading it. */
const RequestLine = ({
  request,
  persona,
  send,
}: {
  request: Request;
  persona: Persona;
  /** Given, a request still needed gets a "Send it" that opens this. */
  send?: (request: Request) => ReactNode;
}) => {
  const { baseUrl } = useApi();
  const [sending, setSending] = useState(false);
  const href = baseUrl ? roomUrl(baseUrl, request.id) : "";
  const asked = updatedAgo(request.asked);
  const since = updatedAgo(request.updated);
  const canSend = Boolean(send) && !request.received;

  // One line per thing to say; a lawyer gets one per file received.
  const one = (text: string) => [{ key: "state", text }];
  let details: { key: string | number; text: string }[];
  if (!request.received) {
    details = one(
      persona === "client"
        ? "Your lawyer is waiting for this."
        : asked
          ? \`Asked \${asked}. Nothing yet.\`
          : "Nothing yet.",
    );
  } else if (persona === "client") {
    details = one(since ? \`Sent \${since}. Thank you.\` : "Sent.");
  } else if (request.documents.length) {
    details = request.documents.map((document) => ({
      key: document.id,
      text: join([
        document.title,
        formatSize(document.bytes),
        document.by && \`\${document.by}, \${updatedAgo(document.updated)}\`,
      ]),
    }));
  } else {
    details = one(since ? \`Received \${since}.\` : "Received.");
  }

  return (
    <li className={styles.matter}>
      <FileIcon fileExst="folder" />
      <div className={styles.matterBody}>
        <Text as="p" className={styles.matterTitle}>
          {request.title}
        </Text>
        {details.map((line) => (
          <Text key={line.key} as="p" className={styles.matterMeta}>
            {line.text}
          </Text>
        ))}
        {canSend ? (
          <>
            <div>
              <Button
                size={ButtonSize.extraSmall}
                primary={!sending}
                label={sending ? "Not now" : "Send it"}
                onClick={() => setSending((open) => !open)}
              />
            </div>
            {sending ? send?.(request) : null}
          </>
        ) : href ? (
          <OpenLink
            href={href}
            label={
              persona === "client" && !request.received
                ? "Upload it in ONLYOFFICE"
                : "Open in ONLYOFFICE"
            }
          />
        ) : null}
      </div>
      <Text
        as="span"
        className={\`\${styles.badge} \${request.received ? styles.badgeOk : ""}\`}
      >
        {request.received ? "Received" : "Still needed"}
      </Text>
    </li>
  );
};

/** The lawyer's one write on this screen: one more folder in the checklist. */
const AskForm = ({
  onAsk,
  busy,
}: {
  onAsk: (title: string) => void;
  busy: boolean;
}) => {
  const [title, setTitle] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = title.trim();
    if (!value) return;
    onAsk(value);
    setTitle("");
  };

  return (
    <form className={styles.askRow} onSubmit={submit}>
      <TextInput
        type={InputType.text}
        size={InputSize.base}
        scale
        value={title}
        placeholder="Ask for another document, e.g. Bank statements"
        onChange={(event) => setTitle(event.target.value)}
        isDisabled={busy}
      />
      <Button
        type="submit"
        size={ButtonSize.small}
        label="Ask for it"
        isLoading={busy}
        isDisabled={!title.trim()}
      />
    </form>
  );
};

const ActionError = ({ message }: { message: string }) =>
  message ? (
    <div className={styles.statusRow} role="alert">
      <Text as="span" className={\`\${styles.badge} \${styles.badgeError}\`}>
        Not done
      </Text>
      <Text fontSize="13px" lineHeight="20px">
        {message}
      </Text>
    </div>
  ) : null;

/** The room itself: its facts, then the checklist and the firm's folder. */
export const MatterRoomPanel = ({
  matter,
  persona,
  sending = false,
  reading = false,
}: {
  matter: Matter;
  persona: Persona;
  /** Lets a client answer a request from here, with the next screen's control. */
  sending?: boolean;
  /** Lets the reader open a draft here, in the editor, with screen 04's control. */
  reading?: boolean;
}) => {
  const { isBase } = useTheme();
  const { baseUrl } = useApi();
  const { state, reload, ask, setUp, receive, busy, actionError } =
    useMatterRoom(matter.id);
  const [openDraft, setOpenDraft] = useState<Document | null>(null);

  const send =
    sending && persona === "client" && state.status === "ready"
      ? (request: Request) => (
          <SendDocument
            request={request}
            demo={state.demo}
            onSent={(files) => {
              receive(request.id, files);
              if (state.demo) {
                toastr.success("Sent. Your lawyer sees it right away.");
              }
            }}
          />
        )
      : undefined;

  const facts = [
    { label: "Practice", value: matter.practice },
    { label: "Stage", value: matter.stage },
    {
      label: persona === "client" ? "Your lawyer" : "Lead",
      value: matter.lead || "Not recorded",
    },
    { label: "Last change", value: updatedAgo(matter.updated) || "Unknown" },
  ];

  let body: React.ReactNode;

  if (state.status === "loading") {
    body = (
      <div className={styles.statusRow}>
        <Loader type={LoaderTypes.track} size="20px" />
        <Text fontSize="13px">Opening the room...</Text>
      </div>
    );
  } else if (state.status === "error") {
    body = (
      <div className={styles.statusRow} role="alert">
        <Text as="span" className={\`\${styles.badge} \${styles.badgeError}\`}>
          No access
        </Text>
        <Text fontSize="13px">{state.message}</Text>
        <Button
          size={ButtonSize.extraSmall}
          label="Try again"
          onClick={reload}
        />
      </div>
    );
  } else if (state.room.layout === "plain") {
    const { folders, files } = state.room;
    body = (
      <>
        <EmptyView
          icon={isBase ? <EmptyRoomsLightSvg /> : <EmptyRoomsDarkSvg />}
          title={
            persona === "client"
              ? "Nothing to do yet"
              : "No checklist in this room yet"
          }
          description={
            persona === "client"
              ? "Your lawyer has not asked you for anything. When they do, the list appears here."
              : \`Two folders make a room a matter's home: "\${CLIENT_FOLDER}" for what you need from the client, "\${FIRM_FOLDER}" for what you send them. \${join([plural(folders, "folder"), plural(files, "file")])} already here stay as they are.\`
          }
          options={
            persona === "client"
              ? null
              : [
                  {
                    key: "set-up",
                    type: "button",
                    title: "Create the two folders",
                    primary: true,
                    isLoading: busy,
                    onClick: () => void setUp(),
                  },
                ]
          }
        />
        <ActionError message={actionError} />
      </>
    );
  } else {
    const { requests, drafts, otherFolders, otherFiles } = state.room;
    const progress = progressOf(requests);

    body = (
      <>
        <CollapsibleCard
          title={
            persona === "client"
              ? "What we need from you"
              : "Requested from the client"
          }
          description={
            progress.total
              ? \`\${progress.received} of \${progress.total} received\`
              : "Nothing asked for yet"
          }
          defaultOpen
        >
          {progress.total ? (
            <ProgressBar
              percent={progress.percent}
              label={
                persona === "client"
                  ? "Your documents"
                  : "The client's documents"
              }
            />
          ) : null}
          {requests.length ? (
            <ul className={styles.matterList}>
              {requests.map((request) => (
                <RequestLine
                  key={request.id}
                  request={request}
                  persona={persona}
                  send={send}
                />
              ))}
            </ul>
          ) : persona === "client" ? (
            <Text as="p" fontSize="13px" lineHeight="20px">
              Your lawyer has not asked you for anything yet.
            </Text>
          ) : null}
          {persona === "lawyer" ? (
            <>
              <AskForm onAsk={(title) => void ask(title)} busy={busy} />
              <ActionError message={actionError} />
            </>
          ) : null}
        </CollapsibleCard>

        <CollapsibleCard
          title={
            persona === "client" ? "From your lawyer" : "Sent to the client"
          }
          description={
            drafts.length ? plural(drafts.length, "document") : "Nothing yet"
          }
          defaultOpen={drafts.length > 0}
        >
          {drafts.length ? (
            <ul className={styles.matterList}>
              {drafts.map((document) => (
                <DocumentLine
                  key={document.id}
                  document={document}
                  onOpen={reading ? setOpenDraft : undefined}
                  openLabel={persona === "client" ? "Read" : "Open"}
                />
              ))}
            </ul>
          ) : (
            <Text as="p" fontSize="13px" lineHeight="20px">
              {persona === "client"
                ? "Nothing to read yet."
                : \`Put a draft in "\${FIRM_FOLDER}" and the client sees it here.\`}
            </Text>
          )}
          {openDraft ? (
            <DocumentReader
              key={openDraft.id}
              document={openDraft}
              mode={persona === "client" ? "view" : "edit"}
              demo={state.demo}
              onClose={() => setOpenDraft(null)}
            />
          ) : null}
        </CollapsibleCard>

        {persona === "lawyer" && (otherFolders || otherFiles) ? (
          <Text as="p" className={styles.matterMeta}>
            {\`\${join([otherFolders ? plural(otherFolders, "other folder") : "", otherFiles ? plural(otherFiles, "loose file") : ""])} in this room \${otherFolders + otherFiles === 1 ? "is" : "are"} outside the checklist. The client sees them in ONLYOFFICE, not here.\`}
          </Text>
        ) : null}
      </>
    );
  }

  return (
    <div className={styles.stack}>
      <div className={styles.roomHeader}>
        <MatterLogo matter={matter} size="48px" />
        <div className={styles.matterBody}>
          <Text as="p" className={styles.roomTitle}>
            {matter.title}
          </Text>
          {persona === "client" && matter.stageKnown ? (
            <Text as="p" fontSize="13px" lineHeight="20px">
              {STAGE_FOR_CLIENT[matter.stage as KnownStage]}
            </Text>
          ) : null}
        </div>
        <div className={styles.headerActions}>
          <StageBadge matter={matter} />
          {baseUrl ? (
            <Button
              size={ButtonSize.extraSmall}
              label="Refresh"
              isLoading={state.status === "loading"}
              onClick={reload}
            />
          ) : null}
        </div>
      </div>

      <ColumnarInfoBar variant="page" columns={facts} />

      {body}
    </div>
  );
};

/**
 * Whose matters, and which one: the list from the previous screen becomes a
 * picker, and the room of the chosen matter is opened under the same token.
 */
const MatterView = ({ demoAs }: { demoAs: Persona }) => {
  const view = useMattersView(demoAs);
  const [pickedId, setPickedId] = useState<number | null>(null);

  if (view.status === "loading") {
    return (
      <div className={styles.statusRow}>
        <Loader type={LoaderTypes.track} size="20px" />
        <Text fontSize="13px">Asking the portal for rooms...</Text>
      </div>
    );
  }

  if (view.status === "error") {
    return (
      <div className={styles.statusRow} role="alert">
        <Text as="span" className={\`\${styles.badge} \${styles.badgeError}\`}>
          No matters
        </Text>
        <Text fontSize="13px">{view.message}</Text>
        <Button
          size={ButtonSize.extraSmall}
          label="Try again"
          onClick={view.reload}
        />
      </div>
    );
  }

  const { matters, persona, label } = view;
  const name = view.demo ? \`\${view.name} (demo data)\` : view.name;

  const matter = matters.find((item) => item.id === pickedId) ?? matters[0];
  const options: TOption[] = matters.map((item) => ({
    key: item.id,
    label: item.title,
  }));

  return (
    <>
      <Who name={name} label={label} />

      {!matter ? (
        <Text as="p" fontSize="13px" lineHeight="20px">
          {persona === "client"
            ? "Nothing has been shared with you yet."
            : "No matters to open. Tag a room Practice: Employment and Stage: Intake in ONLYOFFICE, and it appears here."}
        </Text>
      ) : (
        <>
          {matters.length > 1 ? (
            <div className={styles.picker}>
              <ComboBox
                options={options}
                selectedOption={{ key: matter.id, label: matter.title }}
                onSelect={(option) => setPickedId(Number(option.key))}
                scaled
                scaledOptions
                displaySelectedOption
                dropDownMaxHeight={240}
                textOverflow
              />
            </div>
          ) : null}
          {/* Keyed, so a different matter starts from a fresh read. */}
          <MatterRoomPanel key={matter.id} matter={matter} persona={persona} />
        </>
      )}
    </>
  );
};

const TREE = \`Harper v. Northwind Logistics     room   Practice: Employment, Stage: Discovery
  From the client                 folder the checklist
    Passport                      folder received
    Employment contract           folder received
    Payslips, last 3 months       folder still needed: it is empty
  From the firm                   folder drafts and letters for the client
    Draft claim.docx              file
  Working files                   folder the firm's own, outside the cabinet\`;

export const InsideAMatter = () => {
  const { baseUrl } = useApi();

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeading}>
        <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
          Inside a matter
        </Heading>
        <Text as="p" className={styles.sectionSubtitle}>
          What the firm still needs, what has arrived, and what it sent back.
          All of it is folders in the matter&apos;s room.
        </Text>
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          The lawyer&apos;s view
        </Text>
        <Text as="p" className={styles.sectionSubtitle}>
          {baseUrl
            ? "With the API key: who sent what and when, and a way to ask for more."
            : "Who sent what and when, and a way to ask for more."}
        </Text>
        <MatterView demoAs="lawyer" />
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          The client&apos;s view
        </Text>
        <Text as="p" className={styles.sectionSubtitle}>
          {baseUrl
            ? "With the client's own OAuth token: what is still owed, and what there is to read."
            : "What is still owed, and what there is to read."}
        </Text>
        <ClientSession demo={<MatterView demoAs="client" />}>
          <MatterView demoAs="client" />
        </ClientSession>
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          How a room holds a matter
        </Text>
        <Text as="p" fontSize="13px" lineHeight="20px">
          Two folders, made in ONLYOFFICE like any other. A subfolder of{" "}
          <b>{CLIENT_FOLDER}</b> is a request; it is answered the moment a file
          lands in it. A file in <b>{FIRM_FOLDER}</b> is something for the
          client to read. Everything else in the room is the firm&apos;s.
        </Text>
        <pre className={styles.code}>{TREE}</pre>
      </div>
    </div>
  );
};
`;try{MatterRoomPanel.displayName=`MatterRoomPanel`,MatterRoomPanel.__docgenInfo={description:`The room itself: its facts, then the checklist and the firm's folder.`,displayName:`MatterRoomPanel`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/docs/samples/legal/inside-a-matter/InsideAMatter.tsx`,methods:[],props:{matter:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/inside-a-matter/InsideAMatter.tsx`,name:`TypeLiteral`}],description:``,name:`matter`,required:!0,tags:{},type:{name:`Matter`}},persona:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/inside-a-matter/InsideAMatter.tsx`,name:`TypeLiteral`}],description:``,name:`persona`,required:!0,tags:{},type:{name:`Persona`}},sending:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/inside-a-matter/InsideAMatter.tsx`,name:`TypeLiteral`}],description:`Lets a client answer a request from here, with the next screen's control.`,name:`sending`,required:!1,tags:{},type:{name:`boolean | undefined`}},reading:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/inside-a-matter/InsideAMatter.tsx`,name:`TypeLiteral`}],description:`Lets the reader open a draft here, in the editor, with screen 04's control.`,name:`reading`,required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}})))()}function v(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...a(),...e.components};return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(n,{of:l}),`
`,(0,b.jsx)(t.h1,{id:`02-inside-a-matter`,children:`02. Inside a matter`}),`
`,(0,b.jsx)(t.p,{children:`The screen the whole track exists for. A client opens a matter and sees what
the firm still needs from them and what has arrived; a lawyer sees who sent
what, when, and asks for one more thing without leaving the page.`}),`
`,(0,b.jsx)(r,{of:d}),`
`,(0,b.jsxs)(t.p,{children:[`With no portal, both views read the demo rooms. Connect a portal from the
`,(0,b.jsx)(t.strong,{children:`API`}),` control in the toolbar and the lawyer's view opens the key owner's
real matters; sign a client in with the app from
`,(0,b.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-setup-who-is-signed-in--docs`,children:`Who is signed in`}),`
and the client's view opens theirs. The picker lists the matters from
`,(0,b.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-screens-01-my-matters--docs`,children:`01. My matters`}),`.`]}),`
`,(0,b.jsx)(t.h2,{id:`the-checklist-is-a-folder`,children:`The checklist is a folder`}),`
`,(0,b.jsx)(t.p,{children:`A matter's room holds two folders with fixed names:`}),`
`,(0,b.jsxs)(t.table,{children:[(0,b.jsx)(t.thead,{children:(0,b.jsxs)(t.tr,{children:[(0,b.jsx)(t.th,{children:`Folder`}),(0,b.jsx)(t.th,{children:`What it is`})]})}),(0,b.jsxs)(t.tbody,{children:[(0,b.jsxs)(t.tr,{children:[(0,b.jsx)(t.td,{children:(0,b.jsx)(t.code,{children:`From the client`})}),(0,b.jsx)(t.td,{children:`the checklist. One subfolder per document asked for: empty means still needed, a file inside means received`})]}),(0,b.jsxs)(t.tr,{children:[(0,b.jsx)(t.td,{children:(0,b.jsx)(t.code,{children:`From the firm`})}),(0,b.jsx)(t.td,{children:`drafts and letters for the client to read`})]})]})]}),`
`,(0,b.jsxs)(t.p,{children:[`Nothing else is recorded anywhere. A request is a folder, so the portal
already says what this application needs to know: how many files it holds
(`,(0,b.jsx)(t.code,{children:`filesCount`}),`), when it was made (`,(0,b.jsx)(t.code,{children:`created`}),`, which is when the firm asked) and
when it last changed (`,(0,b.jsx)(t.code,{children:`updated`}),`, which for a received one is the upload).
Who uploaded is on the file. A lawyer can add a request from ONLYOFFICE by
making a folder, or from here, and the two agree because they are the same
thing.`]}),`
`,(0,b.jsx)(t.p,{children:`The names are matched without regard to case or spacing, so a folder renamed
by hand still counts. Everything else in the room — working files, drafts not
meant for the client — is left alone and, for the lawyer, counted at the
bottom.`}),`
`,(0,b.jsxs)(t.p,{children:[`To try it on your portal: open a matter's room in ONLYOFFICE, make a folder
`,(0,b.jsx)(t.code,{children:`From the client`}),` with a subfolder per document you want, and press
`,(0,b.jsx)(t.strong,{children:`Try again`}),` or reopen the matter. Or press `,(0,b.jsx)(t.strong,{children:`Create the two folders`}),` in a
room that has none.`]}),`
`,(0,b.jsx)(c,{code:f,language:`tsx`}),`
`,(0,b.jsx)(t.h2,{id:`reading-a-room-one-folder-at-a-time`,children:`Reading a room one folder at a time`}),`
`,(0,b.jsxs)(t.p,{children:[`The portal answers for one folder per call: `,(0,b.jsx)(t.code,{children:`getFolderByFolderId`}),` returns
that folder's subfolders and files. So the screen reads the room's top level
to find the two sections, the checklist folder for its requests, every request
that holds something for its files, and the firm's folder for its drafts. An
empty request costs no call, because `,(0,b.jsx)(t.code,{children:`filesCount`}),` already says it is empty.`]}),`
`,(0,b.jsxs)(t.p,{children:[(0,b.jsx)(t.code,{children:`readMatterRoom`}),` is that walk with the "read one folder" step passed in, so
the same function runs against the SDK, against the demo folders, and in the
test with a map. That is also why the demo is interactive: `,(0,b.jsx)(t.strong,{children:`Ask for it`}),` and
`,(0,b.jsx)(t.strong,{children:`Create the two folders`}),` write into the same map the walk reads.`]}),`
`,(0,b.jsx)(c,{code:m,language:`tsx`}),`
`,(0,b.jsx)(t.h2,{id:`the-components-and-why-these`,children:`The components, and why these`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.strong,{children:(0,b.jsx)(t.code,{children:`CollapsibleCard`})}),` for the two sections. Each has a title, a one-line
summary that is useful when the body is closed ("3 of 5 received"), and a
body the reader may not need — a client who has sent everything wants the
firm's drafts, not the checklist.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.strong,{children:(0,b.jsx)(t.code,{children:`ProgressBar`})}),` above the checklist, because "3 of 5" is a shape before
it is a number. `,(0,b.jsx)(t.code,{children:`label`}),` is its accessible name; without it the bar is
silent to a screen reader.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.strong,{children:(0,b.jsx)(t.code,{children:`ColumnarInfoBar`})}),` with `,(0,b.jsx)(t.code,{children:`variant="page"`}),` for the matter's facts. The
bar is label-and-value columns for context the reader does not act on,
which is exactly what practice, stage and lead are here.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.strong,{children:(0,b.jsx)(t.code,{children:`EmptyView`})}),` for a room that has no checklist folder yet. Its shape is
a picture, a title, a sentence and a list of ways out — for a lawyer, the
button that creates the two folders; for a client, no way out, because
there is nothing for them to do.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.strong,{children:(0,b.jsx)(t.code,{children:`ComboBox`})}),` to choose a matter. It keeps nothing: `,(0,b.jsx)(t.code,{children:`selectedOption`}),` is
the screen's state and `,(0,b.jsx)(t.code,{children:`onSelect`}),` reports a click, so the same list can be
driven from a URL later. `,(0,b.jsx)(t.code,{children:`scaledOptions`}),` matches the list's width to the
button's.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.strong,{children:(0,b.jsx)(t.code,{children:`TextInput`})}),` with `,(0,b.jsx)(t.code,{children:`scale`}),` and a `,(0,b.jsx)(t.code,{children:`Button`}),` of `,(0,b.jsx)(t.code,{children:`type="submit"`}),` in a form,
so Enter asks for the document as well as the button does.`]}),`
`,(0,b.jsxs)(t.li,{children:[`The rows themselves are a list of the screen's own: a folder or file icon,
a title, a line of detail and a badge. The kit's `,(0,b.jsx)(t.code,{children:`Rows`}),` is shaped around
the portal's virtualised file list and says so in its README; a handful of
lines is a flex column, not a component.`]}),`
`]}),`
`,(0,b.jsx)(t.h2,{id:`details-worth-copying`,children:`Details worth copying`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsxs)(t.strong,{children:[(0,b.jsx)(t.code,{children:`filesCount`}),` is the state.`]}),` A request is received when its folder is
not empty; there is no flag to keep in step with the files.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsxs)(t.strong,{children:[`The folder's `,(0,b.jsx)(t.code,{children:`created`}),` is when the firm asked`]}),`, and its `,(0,b.jsx)(t.code,{children:`updated`}),` is
when the client answered. Both arrive as ISO strings, whatever the SDK's
types say, and `,(0,b.jsx)(t.code,{children:`isoOf`}),` in `,(0,b.jsx)(t.code,{children:`matter.ts`}),` accepts either form.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.strong,{children:`Same URL shape for a folder as for a room.`}),`
`,(0,b.jsx)(t.code,{children:`/rooms/shared/<folderId>/filter?folder=<folderId>`}),` opens a subfolder on
the portal, which is where "Upload it in ONLYOFFICE" sends a client until
the next screen lets them do it here.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsxs)(t.strong,{children:[`A file's `,(0,b.jsx)(t.code,{children:`webUrl`}),` is relative`]}),`, resolved against the portal's base URL
the same way pictures are in
`,(0,b.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-setup-connect-to-a-portal--docs`,children:`Connect to a portal`}),`.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.strong,{children:`The client sees the whole room in ONLYOFFICE.`}),` Room membership is the
portal's unit of access; the two folders are what the cabinet shows, not a
wall. A working file the client must not see belongs in another room.`]}),`
`]}),`
`,(0,b.jsx)(t.h2,{id:`the-code`,children:`The code`}),`
`,(0,b.jsx)(c,{code:g,language:`tsx`})]})}function y(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,b.jsx)(t,{...e,children:(0,b.jsx)(v,{...e})}):v(e)}var b;function x(){return(x=e((()=>{b=i(),o(),t(),s(),u(),p(),h(),_()})))()}x();export{y as default};