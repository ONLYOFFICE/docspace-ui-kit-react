import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r}from"./blocks-D1qLjfJS.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{i as a,r as o}from"./react-qN2cStNd.js";import{n as s,t as c}from"./Source-CbxT880K.js";import{n as l,r as u,t as d}from"./SeedPortal.stories-BhynM-S5.js";var f;function p(){return(p=e((()=>{f=`import {
  FileShare,
  type RoomInvitation,
  RoomType,
  SearchArea,
} from "@onlyoffice/docspace-api-sdk";

import type { useApi } from "../../../providers/api";
import { DEMO_FOLDERS } from "./demo-matter-contents";
import { DEMO_ROOMS } from "./demo-matters";
import { explainPortalError } from "./explain";
import type { FileLike, FolderContents, FolderLike } from "./matterRoom";

/**
 * Put the demo practice on a real portal: the rooms, tags, folders and files
 * every screen shows with no portal, created for real so the screens can be
 * tried against them with one click instead of an afternoon in ONLYOFFICE.
 *
 * It creates and never deletes, and it can be pressed again. A room whose
 * title is already on the portal is opened rather than made, and whatever
 * the demo says should be inside and is not -- a folder, a file -- is added;
 * a room that has everything is left alone. So a run that failed halfway,
 * or a folder someone deleted, is put right by the next press. Rooms are
 * opened by whoever owns the API key, so the lead of every matter is that
 * person, not the demo's names.
 *
 * The calls are behind \`SeedClient\`, in the seeder's own words, so the test
 * stands a recorder in for the portal and \`sdkSeedClient\` is the only part
 * that knows the SDK.
 */
export type SeedStep = {
  label: string;
  /** done: made from nothing; completed: was there, missing pieces added. */
  status: "done" | "completed" | "skipped" | "failed";
  detail?: string;
};

export type SeedSummary = Record<SeedStep["status"], number>;

export type SeedClient = {
  /** The rooms already on the portal, as far as this key sees. */
  rooms: () => Promise<{ id: number; title: string; tags: string[] }[]>;
  /** What a folder holds, the same shape the screens read. */
  listFolder: (folderId: number) => Promise<FolderContents>;
  createRoom: (title: string, color: string) => Promise<number>;
  tagRoom: (id: number, tags: string[]) => Promise<void>;
  createFolder: (parentId: number, title: string) => Promise<number>;
  /** An office document the document server makes: .docx, .xlsx, .pptx. */
  createDocument: (folderId: number, title: string) => Promise<void>;
  /** Any other file, uploaded as bytes. */
  uploadFile: (
    folderId: number,
    title: string,
    bytes: Uint8Array,
    type: string,
  ) => Promise<void>;
  /** Add an email to a room as a content creator, so they can upload. */
  invite: (roomId: number, email: string) => Promise<void>;
};

/** The demo rooms the client is a member of. */
export const CLIENT_ROOM_IDS = DEMO_ROOMS.client.map((room) => room.id);

const OFFICE = new Set([".docx", ".xlsx", ".pptx"]);

const extOf = (title: string) =>
  title.slice(title.lastIndexOf(".")).toLowerCase();

const fold = (title: string) => title.trim().replace(/\\s+/g, " ").toLowerCase();

/**
 * A one-page PDF that says its own name, small enough to build in a string.
 * Offsets in the cross-reference table are computed, so a strict reader
 * accepts it; the body is ASCII, so character offsets are byte offsets.
 */
export const minimalPdf = (text: string) => {
  const safe = text.replace(/[\\\\()]/g, "");
  const content = \`BT /F1 18 Tf 72 770 Td (\${safe}) Tj ET\`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    \`<< /Length \${content.length} >>\\nstream\\n\${content}\\nendstream\`,
  ];

  let out = "%PDF-1.4\\n";
  const offsets: number[] = [];
  objects.forEach((body, index) => {
    offsets.push(out.length);
    out += \`\${index + 1} 0 obj\\n\${body}\\nendobj\\n\`;
  });
  const xref = out.length;
  out += \`xref\\n0 \${objects.length + 1}\\n0000000000 65535 f \\n\`;
  for (const offset of offsets) {
    out += \`\${String(offset).padStart(10, "0")} 00000 n \\n\`;
  }
  out += \`trailer\\n<< /Size \${objects.length + 1} /Root 1 0 R >>\\nstartxref\\n\${xref}\\n%%EOF\\n\`;

  return new TextEncoder().encode(out);
};

/** One grey pixel. */
export const pixelPng = () =>
  Uint8Array.from(
    atob(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    ),
    (char) => char.charCodeAt(0),
  );

const placeFile = (client: SeedClient, folderId: number, title: string) => {
  const ext = extOf(title);
  if (OFFICE.has(ext)) return client.createDocument(folderId, title);
  if (ext === ".pdf") {
    return client.uploadFile(
      folderId,
      title,
      minimalPdf(title),
      "application/pdf",
    );
  }
  if (ext === ".png") {
    return client.uploadFile(folderId, title, pixelPng(), "image/png");
  }
  return client.uploadFile(
    folderId,
    title,
    new TextEncoder().encode(title),
    "text/plain",
  );
};

type Added = { tags: number; folders: number; files: number };

const NOTHING: Added = { tags: 0, folders: 0, files: 0 };

const titleOf = (entry: FolderLike | FileLike) => entry.title ?? "Untitled";

/**
 * Make a folder hold what the demo says it holds. A folder or file already
 * there by title is kept; the rest is created. \`fresh\` says the folder was
 * made a moment ago, so there is nothing to list.
 */
const ensureContents = async (
  client: SeedClient,
  folderId: number,
  contents: FolderContents,
  fresh: boolean,
  added: Added,
) => {
  const present = fresh
    ? { folders: [], files: [] }
    : await client.listFolder(folderId);
  const folderIds = new Map(
    present.folders.map((folder) => [fold(titleOf(folder)), folder.id]),
  );
  const fileTitles = new Set(present.files.map((file) => fold(titleOf(file))));

  for (const folder of contents.folders) {
    const title = titleOf(folder);
    let id = folderIds.get(fold(title));
    let made = false;
    if (id === undefined) {
      id = await client.createFolder(folderId, title);
      added.folders += 1;
      made = true;
    }
    const inside =
      folder.id === undefined ? undefined : DEMO_FOLDERS[folder.id];
    if (inside) await ensureContents(client, id, inside, made, added);
  }

  for (const file of contents.files) {
    const title = titleOf(file);
    if (fileTitles.has(fold(title))) continue;
    await placeFile(client, folderId, title);
    added.files += 1;
  }
};

const plural = (n: number, one: string) => \`\${n} \${one}\${n === 1 ? "" : "s"}\`;

const describe = (added: Added) =>
  [
    added.tags ? plural(added.tags, "tag") : "",
    added.folders ? plural(added.folders, "folder") : "",
    added.files ? plural(added.files, "file") : "",
  ].filter(Boolean);

const nothingAdded = (added: Added) =>
  !added.tags && !added.folders && !added.files;

export const seedPortal = async (
  client: SeedClient,
  options: { clientEmail?: string; onStep?: (step: SeedStep) => void } = {},
): Promise<SeedSummary> => {
  const summary: SeedSummary = { done: 0, completed: 0, skipped: 0, failed: 0 };
  const report = (step: SeedStep) => {
    summary[step.status] += 1;
    options.onStep?.(step);
  };
  const email = options.clientEmail?.trim() ?? "";
  const existing = new Map(
    (await client.rooms()).map((room) => [fold(room.title), room]),
  );

  for (const room of DEMO_ROOMS.lawyer) {
    const title = room.title ?? "Untitled";
    const contents = room.id === undefined ? undefined : DEMO_FOLDERS[room.id];
    const forClient =
      Boolean(email) &&
      room.id !== undefined &&
      CLIENT_ROOM_IDS.includes(room.id);
    const tags = (room.tags ?? []).filter(Boolean);
    const found = existing.get(fold(title));

    try {
      if (found) {
        const added: Added = { ...NOTHING };
        // Tags first, as for a new room: without the Practice tag the
        // screens do not count the room as a matter at all.
        const has = new Set(found.tags.map(fold));
        const missing = tags.filter((tag) => !has.has(fold(tag)));
        if (missing.length) {
          await client.tagRoom(found.id, missing);
          added.tags = missing.length;
        }
        if (contents) {
          await ensureContents(client, found.id, contents, false, added);
        }
        if (nothingAdded(added)) {
          report({
            label: title,
            status: "skipped",
            detail: "Already there, with everything the demo puts in it.",
          });
          continue;
        }
        // A room that was short of something most likely came from a run
        // that stopped before it got to sharing, so share it now.
        const parts = describe(added);
        if (forClient) {
          await client.invite(found.id, email);
          parts.push(\`shared with \${email}\`);
        }
        report({
          label: title,
          status: "completed",
          detail: \`Already there; added \${parts.join(", ")}.\`,
        });
        continue;
      }

      const id = await client.createRoom(title, room.logo?.color ?? "");
      if (tags.length) await client.tagRoom(id, tags);

      const added: Added = { ...NOTHING, tags: tags.length };
      if (contents) await ensureContents(client, id, contents, true, added);

      const parts = describe(added);
      if (forClient) {
        await client.invite(id, email);
        parts.push(\`shared with \${email}\`);
      }
      report({
        label: title,
        status: "done",
        detail: parts.length ? parts.join(", ") : "an empty room",
      });
    } catch (error) {
      report({
        label: title,
        status: "failed",
        detail: explainPortalError(error, "write to this portal"),
      });
    }
  }

  return summary;
};

const PAGE = 100;
const MAX_ROOMS = 500;

/** The seeder's calls, made with the clients \`useApi()\` hands out. */
export const sdkSeedClient = (
  api: Pick<
    ReturnType<typeof useApi>,
    "roomsApi" | "foldersApi" | "filesApi" | "apiClient" | "baseUrl"
  >,
): SeedClient => ({
  rooms: async () => {
    const rooms: { id: number; title: string; tags: string[] }[] = [];
    let total = Infinity;
    while (rooms.length < Math.min(total, MAX_ROOMS)) {
      const page = (
        await api.roomsApi.getRoomsFolder({
          searchArea: SearchArea.Active,
          count: PAGE,
          startIndex: rooms.length,
        })
      ).data.response;
      const folders = (page?.folders ?? []) as (FolderLike & {
        tags?: string[] | null;
      })[];
      for (const folder of folders) {
        if (folder.id !== undefined) {
          rooms.push({
            id: folder.id,
            title: folder.title ?? "",
            tags: (folder.tags ?? []).filter(Boolean),
          });
        }
      }
      total = page?.total ?? rooms.length;
      if (!folders.length) break;
    }
    return rooms;
  },

  listFolder: async (folderId) => {
    const page = (
      await api.foldersApi.getFolderByFolderId({ folderId, count: PAGE })
    ).data.response;
    return {
      folders: (page?.folders ?? []) as FolderLike[],
      files: (page?.files ?? []) as FileLike[],
    };
  },

  createRoom: async (title, color) => {
    const room = (
      await api.roomsApi.createRoom({
        createRoomRequestDto: {
          title,
          roomType: RoomType.CustomRoom,
          color: color || undefined,
        },
      })
    ).data.response;
    if (room?.id === undefined) {
      throw new Error("The portal created the room but sent no id back.");
    }
    return room.id;
  },

  tagRoom: async (id, tags) => {
    // A tag has to exist on the portal before a room can carry it. One that
    // already does answers with an error, which is the answer wanted.
    for (const name of tags) {
      try {
        await api.roomsApi.createRoomTag({ createTagRequestDto: { name } });
      } catch {
        // Already there.
      }
    }
    await api.roomsApi.addRoomTags({
      id,
      batchTagsRequestDto: { names: tags },
    });
  },

  createFolder: async (parentId, title) => {
    const folder = (
      await api.foldersApi.createFolder({
        folderId: parentId,
        createFolder: { title },
      })
    ).data.response;
    if (folder?.id === undefined) {
      throw new Error("The portal created the folder but sent no id back.");
    }
    return folder.id;
  },

  createDocument: async (folderId, title) => {
    await api.filesApi.createFile({
      folderId,
      createFileJsonElement: { title },
    });
  },

  uploadFile: async (folderId, title, bytes, type) => {
    // Not the SDK's insertFile. It sends the form fields as
    // \`InsertFile.Title\` and \`InsertFile.File\`, the names the reference
    // pages show, and the portal's binder reads \`title\` with no prefix and
    // takes the first file part whatever it is called -- so the SDK's call
    // ends in 400, "Value cannot be null. (Parameter 'title')". The form
    // the portal binds is three plain fields.
    const form = new FormData();
    form.append("file", new File([bytes as BlobPart], title, { type }));
    form.append("title", title);
    form.append("createNewIfExist", "true");
    await api.apiClient.instance.post(
      new URL(\`/api/2.0/files/\${folderId}/insert\`, api.baseUrl).toString(),
      form,
    );
  },

  invite: async (roomId, email) => {
    // The SDK's RoomInvitation names only \`id\`; the portal also takes an
    // \`email\`, which is how a person not yet on the portal is invited.
    const invitation = {
      email,
      access: FileShare.ContentCreator,
    } as unknown as RoomInvitation;
    await api.roomsApi.setRoomSecurity({
      id: roomId,
      roomInvitationRequest: {
        invitations: [invitation],
        notify: true,
        message: "Your matter's documents live here. Sign in to see them.",
      },
    });
  },
});
`})))()}var m;function h(){return(h=e((()=>{m=`import { useState } from "react";

import { Button, ButtonSize } from "../../../../components/button";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../../components/heading";
import { Link, LinkTarget, LinkType } from "../../../../components/link";
import { RoomIcon } from "../../../../components/room-icon";
import { Text } from "../../../../components/text";
import {
  InputSize,
  InputType,
  TextInput,
} from "../../../../components/text-input";
import { useApi } from "../../../../providers/api";
import { DEMO_FOLDERS } from "../demo-matter-contents";
import { DEMO_ROOMS } from "../demo-matters";
import { matterFromRoom } from "../matter";
import { CLIENT_FOLDER } from "../matterRoom";
import {
  CLIENT_ROOM_IDS,
  sdkSeedClient,
  type SeedStep,
  type SeedSummary,
  seedPortal,
} from "../seed";
import styles from "../legal.module.scss";

/**
 * One button that puts the demo practice on the connected portal, so every
 * screen in the track can be tried against real rooms without making them
 * by hand. What it creates is listed first, and the log says what happened
 * to each room.
 */
const BADGE: Record<SeedStep["status"], { label: string; className: string }> =
  {
    done: { label: "Created", className: styles.badgeOk },
    completed: { label: "Completed", className: styles.badgeOk },
    skipped: { label: "Already there", className: "" },
    failed: { label: "Failed", className: styles.badgeError },
  };

/** The room's initials on its colour, as the portal would draw it. */
const Initials = ({
  title,
  color,
}: {
  title: string;
  color?: string | null;
}) => (
  <RoomIcon title={title} color={color || "555F6B"} size="32px" showDefault />
);

const WhatGetsCreated = () => (
  <ul className={styles.matterList}>
    {DEMO_ROOMS.lawyer.map((room) => {
      const matter = matterFromRoom(room);
      const contents =
        room.id === undefined ? undefined : DEMO_FOLDERS[room.id];
      const checklist = contents?.folders.find(
        (folder) => folder.title === CLIENT_FOLDER,
      );
      const requests =
        checklist?.id === undefined
          ? 0
          : (DEMO_FOLDERS[checklist.id]?.folders.length ?? 0);
      const forClient =
        room.id !== undefined && CLIENT_ROOM_IDS.includes(room.id);

      return (
        <li key={room.id} className={styles.matter}>
          <Initials title={room.title ?? ""} color={room.logo?.color} />
          <div className={styles.matterBody}>
            <Text as="p" className={styles.matterTitle}>
              {room.title}
            </Text>
            <Text as="p" className={styles.matterMeta}>
              {matter
                ? [
                    (room.tags ?? []).join(", "),
                    requests
                      ? \`a checklist of \${requests} and the firm's folder\`
                      : "no folders yet",
                    forClient ? "shared with the client" : "",
                  ]
                    .filter(Boolean)
                    .join(" • ")
                : "not a matter: no Practice tag, so the screens leave it out"}
            </Text>
          </div>
          <span />
        </li>
      );
    })}
  </ul>
);

export const SeedPortal = () => {
  const api = useApi();
  const { baseUrl } = api;
  const [email, setEmail] = useState("");
  const [steps, setSteps] = useState<SeedStep[]>([]);
  const [summary, setSummary] = useState<SeedSummary | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    setSteps([]);
    setSummary(null);
    try {
      const result = await seedPortal(sdkSeedClient(api), {
        clientEmail: email,
        onStep: (step) => setSteps((previous) => [...previous, step]),
      });
      setSummary(result);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeading}>
        <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
          Demo data on your portal
        </Heading>
        <Text as="p" className={styles.sectionSubtitle}>
          The rooms every screen shows without a portal, created on yours with
          one press, so the screens can be tried for real.
        </Text>
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          Create it on your portal
        </Text>

        {baseUrl ? (
          <>
            <Text as="p" fontSize="13px" lineHeight="20px">
              This creates rooms on the portal connected in the toolbar, as the
              owner of its API key. Nothing is deleted. A room whose name is
              already there is not made again; whatever the demo puts inside it
              and is missing is added, so a run that failed halfway is put right
              by the next press, and a complete one is left alone. Give a
              client&apos;s email and the two matters that are theirs are shared
              with it; sign in with that address on the client&apos;s side of
              any screen.
            </Text>
            <div className={styles.askRow}>
              <TextInput
                type={InputType.email}
                size={InputSize.base}
                scale
                value={email}
                placeholder="Client's email, optional"
                onChange={(event) => setEmail(event.target.value)}
                isDisabled={busy}
              />
              <Button
                primary
                size={ButtonSize.small}
                label={busy ? "Creating..." : "Create the demo matters"}
                isLoading={busy}
                onClick={() => void run()}
              />
            </div>
          </>
        ) : (
          <>
            <Text as="p" fontSize="13px" lineHeight="20px">
              No portal is configured, so there is nowhere to create anything.
              Connect one from the <b>API</b> control in the toolbar, as in{" "}
              <Link
                type={LinkType.page}
                href={new URL(
                  "./?path=/docs/samples-legal-practice-setup-connect-to-a-portal--docs",
                  document.baseURI,
                ).toString()}
                target={LinkTarget.top}
                color="accent"
                isHovered
                fontSize="13px"
              >
                Connect to a portal
              </Link>
              , and come back.
            </Text>
            <div>
              <Button
                primary
                size={ButtonSize.small}
                label="Create the demo matters"
                isDisabled
              />
            </div>
          </>
        )}

        {steps.length ? (
          <ul className={styles.matterList}>
            {steps.map((step) => (
              <li key={step.label} className={styles.matter}>
                <Initials
                  title={step.label}
                  color={
                    DEMO_ROOMS.lawyer.find((room) => room.title === step.label)
                      ?.logo?.color
                  }
                />
                <div className={styles.matterBody}>
                  <Text as="p" className={styles.matterTitle}>
                    {step.label}
                  </Text>
                  {step.detail ? (
                    <Text as="p" className={styles.matterMeta}>
                      {step.detail}
                    </Text>
                  ) : null}
                </div>
                <Text
                  as="span"
                  className={\`\${styles.badge} \${BADGE[step.status].className}\`}
                >
                  {BADGE[step.status].label}
                </Text>
              </li>
            ))}
          </ul>
        ) : null}

        {summary ? (
          <Text as="p" fontSize="13px" lineHeight="20px">
            {\`\${summary.done} created, \${summary.completed} completed, \${summary.skipped} already there, \${summary.failed} failed. \`}
            {summary.done || summary.completed ? (
              <>
                Open{" "}
                <Link
                  type={LinkType.page}
                  href={new URL(
                    "./?path=/docs/samples-legal-practice-the-cabinet--docs",
                    document.baseURI,
                  ).toString()}
                  target={LinkTarget.top}
                  color="accent"
                  isHovered
                  fontSize="13px"
                >
                  The cabinet
                </Link>{" "}
                to see them.
              </>
            ) : null}
          </Text>
        ) : null}
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          What gets created
        </Text>
        <Text as="p" className={styles.sectionSubtitle}>
          The demo practice, room for room. Matters carry their two tags and the
          two folders; each request folder that the demo shows as received gets
          a small file, and the firm&apos;s folder its drafts.
        </Text>
        <WhatGetsCreated />
      </div>
    </div>
  );
};
`})))()}function g(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,ol:`ol`,p:`p`,strong:`strong`,ul:`ul`,...a(),...e.components};return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(n,{of:l}),`
`,(0,v.jsx)(t.h1,{id:`demo-data-on-your-portal`,children:`Demo data on your portal`}),`
`,(0,v.jsxs)(t.p,{children:[`Every screen in this track runs on demo data when there is no portal. This
page puts that same data on a real one, so the screens can be tried against
rooms that exist: press the button, then open
`,(0,v.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-the-cabinet--docs`,children:`The cabinet`}),`.`]}),`
`,(0,v.jsx)(r,{of:d}),`
`,(0,v.jsx)(t.h2,{id:`what-it-does`,children:`What it does`}),`
`,(0,v.jsx)(t.p,{children:`For each demo room, in the order the list shows them:`}),`
`,(0,v.jsxs)(t.ol,{children:[`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:`Opens it rather than making it`}),` if a room with that title is already
on the portal, compared without regard to case or spacing. Whatever the
demo puts inside and is missing — a tag, a folder, a file — is added, and
a room that has it all is left alone. So a run that failed halfway is put
right by the next press, and pressing twice creates nothing new.`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:`Creates a custom room`}),` otherwise, with the demo's colour, as the owner
of the API key. That person becomes the lead of every matter, which is
the one thing the demo cannot copy.`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:`Tags it.`}),` A tag has to exist on the portal before a room can carry it,
so each is created first and the refusal for one that already exists is
ignored; then the room gets them all in one call.`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:`Makes the folders`}),`: `,(0,v.jsx)(t.code,{children:`From the client`}),` with a subfolder per request,
`,(0,v.jsx)(t.code,{children:`From the firm`}),`, and whatever else the demo room has.`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:`Puts files where the demo shows them.`}),` Office documents are made by the
document server, so they open in the editor; a PDF is written on the spot,
one page that says its own name, with a cross-reference table whose
offsets are computed rather than hoped for; a PNG is one grey pixel.`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:`Shares the client's two matters`}),` with the email given, as a content
creator, so that person can upload. Leave the field empty and nothing is
shared.`]}),`
`]}),`
`,(0,v.jsx)(t.p,{children:`It never deletes. What it made is removed like any other room, from
ONLYOFFICE.`}),`
`,(0,v.jsx)(t.h2,{id:`the-calls-and-why-they-are-behind-an-interface`,children:`The calls, and why they are behind an interface`}),`
`,(0,v.jsxs)(t.p,{children:[`The seeder speaks in its own words, `,(0,v.jsx)(t.code,{children:`SeedClient`}),`: create a room, tag it, make
a folder, put a document there, invite someone. `,(0,v.jsx)(t.code,{children:`sdkSeedClient`}),` is the one
place those words become SDK calls, and the test stands a recorder in for it.
Three of the calls are worth knowing:`]}),`
`,(0,v.jsxs)(t.ul,{children:[`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:(0,v.jsx)(t.code,{children:`createRoom`})}),` takes `,(0,v.jsx)(t.code,{children:`tags`}),`, but a tag it has never seen is dropped
without a word. `,(0,v.jsx)(t.code,{children:`createRoomTag`}),` first, then `,(0,v.jsx)(t.code,{children:`addRoomTags`}),`, is what the
portal's own client does.`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsxs)(t.strong,{children:[`The upload is not the SDK's `,(0,v.jsx)(t.code,{children:`insertFile`}),`.`]}),` That call sends the multipart
fields as `,(0,v.jsx)(t.code,{children:`InsertFile.Title`}),` and `,(0,v.jsx)(t.code,{children:`InsertFile.File`}),`, the names the reference
pages show, and a live portal answers 400, "Value cannot be null.
(Parameter 'title')": the portal's binder reads a bare `,(0,v.jsx)(t.code,{children:`title`}),` and takes
the first file part whatever it is called. So the bytes go as a plain
`,(0,v.jsx)(t.code,{children:`FormData`}),` of `,(0,v.jsx)(t.code,{children:`file`}),`, `,(0,v.jsx)(t.code,{children:`title`}),` and `,(0,v.jsx)(t.code,{children:`createNewIfExist`}),`, through the same
axios instance the SDK uses. It is one request, the right size for a file
already in memory; the chunked session `,(0,v.jsx)(t.code,{children:`Uploader`}),` runs is for files a
person chose.`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:(0,v.jsx)(t.code,{children:`setRoomSecurity`})}),` invites by `,(0,v.jsx)(t.code,{children:`email`}),`, though the SDK's `,(0,v.jsx)(t.code,{children:`RoomInvitation`}),`
names only `,(0,v.jsx)(t.code,{children:`id`}),`. The portal takes both; the cast in the code says so.`]}),`
`]}),`
`,(0,v.jsx)(c,{code:f,language:`tsx`}),`
`,(0,v.jsx)(t.h2,{id:`the-code`,children:`The code`}),`
`,(0,v.jsx)(c,{code:m,language:`tsx`})]})}function _(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,v.jsx)(t,{...e,children:(0,v.jsx)(g,{...e})}):g(e)}var v;function y(){return(y=e((()=>{v=i(),o(),t(),s(),u(),p(),h()})))()}y();export{_ as default};