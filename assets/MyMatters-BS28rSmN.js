import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r}from"./blocks-D1qLjfJS.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{i as a,r as o}from"./react-qN2cStNd.js";import{n as s,t as c}from"./Source-CbxT880K.js";import{n as l,r as u,t as d}from"./MyMatters.stories-BUfwvI7F.js";var f;function p(){return(p=e((()=>{f=`import type { FolderDtoInteger } from "@onlyoffice/docspace-api-sdk";

/**
 * A matter is a room. Everything the practice needs to know about it that the
 * room does not already say is carried by two of its tags:
 *
 *   Practice: Employment     which area of law -- and what makes a room a
 *                            matter at all; a room without it is not one
 *   Stage: Discovery         where the matter stands
 *
 * Tags, because they are the one piece of free metadata a room has, the portal
 * already shows them as chips and filters rooms by them, and a lawyer can
 * change them without this application. The prefix keeps the vocabulary
 * readable in the portal's own interface, where tags from every room share one
 * list, and lets any other tag a lawyer adds pass through untouched.
 *
 * Everything else comes from the room itself: its title, who opened it, when
 * it last changed, how many documents it holds. Nothing is stored anywhere but
 * the portal, so there is nothing here to fall out of step with it.
 */
export const STAGES = [
  "Intake",
  "Discovery",
  "Negotiation",
  "Hearing",
  "Closed",
] as const;

export type KnownStage = (typeof STAGES)[number];

/**
 * The sentence a client reads next to the stage. A lawyer needs one word; a
 * client needs to know what is happening, and whether they have to do anything.
 */
export const STAGE_FOR_CLIENT: Record<KnownStage, string> = {
  Intake: "We are reviewing what you sent us and planning the next steps.",
  Discovery: "Both sides are exchanging documents and evidence.",
  Negotiation: "We are working towards an agreement with the other side.",
  Hearing: "The matter is before a court or tribunal.",
  Closed: "This matter is finished. Its documents stay here for you.",
};

export type Matter = {
  id: number;
  title: string;
  practice: string;
  /** The stage as tagged, in its canonical spelling when it is a known one. */
  stage: string;
  /** False for a stage this application has no wording for, or no stage tag. */
  stageKnown: boolean;
  isClosed: boolean;
  /** Whoever opened the room -- the lawyer who runs the matter. */
  lead: string;
  /** ISO timestamp of the room's last change, or "" when the portal sent none. */
  updated: string;
  documents: number;
  sections: number;
  /** Tags other than the two this application reads. */
  otherTags: string[];
  /** The portal's logo object, as \`RoomIcon\` takes it. */
  logo?: FolderDtoInteger["logo"];
};

/**
 * A timestamp as the portal sends it. The SDK types \`created\` and \`updated\`
 * as an object with \`utcTime\`; the wire carries a plain ISO string. Both are
 * accepted everywhere in these samples.
 */
export type PortalTime = string | { utcTime?: string | null } | null;

export const isoOf = (value: PortalTime | undefined) =>
  typeof value === "string" ? value : (value?.utcTime ?? "");

/** Whoever the portal says made or changed something. */
export type PortalAuthor = { displayName?: string | null } | null;

/** What a room looks like on the wire, as far as a matter is concerned. */
export type RoomLike = Pick<
  FolderDtoInteger,
  "id" | "title" | "tags" | "logo" | "filesCount" | "foldersCount"
> & {
  createdBy?: PortalAuthor;
  updated?: PortalTime;
};

const PRACTICE_TAG = /^\\s*practice\\s*:\\s*(.+?)\\s*$/i;
const STAGE_TAG = /^\\s*stage\\s*:\\s*(.+?)\\s*$/i;

const matchTag = (tags: string[], pattern: RegExp) => {
  for (const tag of tags) {
    const found = pattern.exec(tag);
    if (found) return found[1];
  }
  return undefined;
};

const canonicalStage = (stage: string) =>
  STAGES.find((known) => known.toLowerCase() === stage.toLowerCase());

/** The matter a room describes, or \`null\` for a room that is not a matter. */
export const matterFromRoom = (room: RoomLike): Matter | null => {
  const tags = (room.tags ?? []).filter(Boolean);
  const practice = matchTag(tags, PRACTICE_TAG);
  if (!practice || room.id === undefined) return null;

  const tagged = matchTag(tags, STAGE_TAG);
  const known = tagged ? canonicalStage(tagged) : undefined;
  const updated = isoOf(room.updated);

  return {
    id: room.id,
    title: room.title ?? "Untitled matter",
    practice,
    stage: known ?? tagged ?? "No stage",
    stageKnown: Boolean(known),
    isClosed: known === "Closed",
    lead: room.createdBy?.displayName ?? "",
    updated,
    documents: room.filesCount ?? 0,
    sections: room.foldersCount ?? 0,
    otherTags: tags.filter(
      (tag) => !PRACTICE_TAG.test(tag) && !STAGE_TAG.test(tag),
    ),
    logo: room.logo,
  };
};

/** Open matters first, most recently touched first; closed ones after. */
export const byAttention = (a: Matter, b: Matter) => {
  if (a.isClosed !== b.isClosed) return a.isClosed ? 1 : -1;
  return (Date.parse(b.updated) || 0) - (Date.parse(a.updated) || 0);
};

const DAY = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** "today", "yesterday", "3 days ago", "2 months ago" -- in the reader's locale. */
export const updatedAgo = (iso: string, now: Date = new Date()) => {
  const then = Date.parse(iso);
  if (!then) return "";

  const days = Math.round((startOfDay(now) - startOfDay(new Date(then))) / DAY);
  const format = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  if (days < 1) return format.format(0, "day");
  if (days < 30) return format.format(-days, "day");
  if (days < 365) return format.format(-Math.round(days / 30), "month");
  return format.format(-Math.round(days / 365), "year");
};

/**
 * A folder's page in the portal, where its documents are worked on. A room is
 * a folder too, so this opens a matter as much as a section inside it.
 */
export const roomUrl = (baseUrl: string, id: number) =>
  new URL(\`/rooms/shared/\${id}/filter?folder=\${id}\`, baseUrl).toString();
`})))()}var m;function h(){return(h=e((()=>{m=`import { useCallback, useEffect, useState } from "react";

import {
  type FolderDtoInteger,
  SearchArea,
} from "@onlyoffice/docspace-api-sdk";

import { useApi } from "../../../providers/api";
import { explainPortalError } from "./explain";
import { byAttention, type Matter, matterFromRoom } from "./matter";
import { personaFromRoles, type PersonaInfo } from "./persona";

/**
 * The matters of whoever the nearest \`ApiProvider\` speaks for.
 *
 * That is the whole trick of this hook: it never asks *whose* matters. Under
 * the provider Storybook mounts it runs with the API key, and the lawyer who
 * owns the key gets every matter they were added to. Under a provider holding
 * a client's OAuth token the very same code gets the rooms shared with that
 * client and nothing else -- the portal does the filtering, because the portal
 * is what knows who may see what.
 *
 * Two calls. \`getSelfProfile\` says who is asking, which decides the wording;
 * it needs only \`accounts.self:read\`, so a client's token can make it.
 * \`getRoomsFolder\` lists the active rooms a page at a time; rooms without a
 * practice tag are counted and left out.
 */
export type MattersState =
  | { status: "demo" }
  | { status: "loading" }
  | {
      status: "ready";
      name: string;
      persona: PersonaInfo;
      /** A portal path to the reader's picture, protected like every other. */
      avatar: string;
      matters: Matter[];
      /** Rooms this identity can see that carry no practice tag. */
      otherRooms: number;
      /** True when there were more rooms than this sample is willing to page through. */
      truncated: boolean;
    }
  | { status: "error"; message: string };

const PAGE = 100;
/** A sample's limit. A practice with more matters searches on the server instead. */
const MAX_ROOMS = 500;

export const useMatters = (): MattersState & { reload: () => void } => {
  const { baseUrl, profilesApi, roomsApi } = useApi();
  const [state, setState] = useState<MattersState>(
    baseUrl ? { status: "loading" } : { status: "demo" },
  );
  const [attempt, setAttempt] = useState(0);
  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    if (!baseUrl) {
      setState({ status: "demo" });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    const load = async () => {
      try {
        const me = (await profilesApi.getSelfProfile()).data.response;

        const rooms: FolderDtoInteger[] = [];
        let total = Infinity;
        while (rooms.length < Math.min(total, MAX_ROOMS)) {
          const page = (
            await roomsApi.getRoomsFolder({
              searchArea: SearchArea.Active,
              count: PAGE,
              startIndex: rooms.length,
            })
          ).data.response;
          const folders = page?.folders ?? [];
          rooms.push(...folders);
          total = page?.total ?? rooms.length;
          if (!folders.length) break;
        }

        if (cancelled) return;

        const matters = rooms
          .map(matterFromRoom)
          .filter((matter): matter is Matter => matter !== null)
          .sort(byAttention);

        setState({
          status: "ready",
          name: me?.displayName ?? me?.email ?? "Unknown",
          persona: personaFromRoles(me ?? {}),
          avatar: me?.hasAvatar ? (me.avatarMedium ?? me.avatar ?? "") : "",
          matters,
          otherRooms: rooms.length - matters.length,
          truncated: total > rooms.length,
        });
      } catch (error) {
        if (!cancelled) {
          setState({
            status: "error",
            message: explainPortalError(error, "list rooms"),
          });
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [baseUrl, profilesApi, roomsApi, attempt]);

  return { ...state, reload };
};
`})))()}var g;function _(){return(_=e((()=>{g=`import { useMemo, useState } from "react";

import { Button, ButtonSize } from "../../../../components/button";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../../components/heading";
import { Link, LinkTarget, LinkType } from "../../../../components/link";
import { Loader, LoaderTypes } from "../../../../components/loader";
import { SearchInput } from "../../../../components/search-input";
import { Tabs, TabsTypes } from "../../../../components/tabs";
import { Text } from "../../../../components/text";
import { InputSize } from "../../../../components/text-input";
import { useApi } from "../../../../providers/api";
import { ClientSession } from "../ClientSession";
import {
  type KnownStage,
  type Matter,
  roomUrl,
  STAGE_FOR_CLIENT,
  STAGES,
  updatedAgo,
} from "../matter";
import { MatterLogo, plural, StageBadge, Who } from "../matter-bits";
import type { Persona } from "../persona";
import { type ReadyMattersView, useMattersView } from "../useMattersView";
import styles from "../legal.module.scss";

/**
 * The first screen a lawyer or a client opens: the matters that are theirs.
 *
 * One list component, two readers. \`MatterList\` never asks whose matters to
 * show -- it lists what the nearest \`ApiProvider\` may see. Under the API key
 * that is the lawyer who owns it; under a client's OAuth token it is the rooms
 * shared with that client, and the portal is what enforces it. The persona the
 * portal reports decides only the wording: a lawyer gets the practice, the
 * lead and the document count, a client gets a sentence about what is
 * happening and who to ask.
 */
const MatterRow = ({
  matter,
  persona,
  onOpen,
}: {
  matter: Matter;
  persona: Persona;
  /** Given, the title opens the matter in the application instead of the portal. */
  onOpen?: (matter: Matter) => void;
}) => {
  const { baseUrl } = useApi();
  const when = updatedAgo(matter.updated);

  const meta =
    persona === "client"
      ? [
          matter.lead && \`Your lawyer: \${matter.lead}\`,
          when && \`Updated \${when}\`,
        ]
      : [
          matter.practice,
          matter.lead && \`Lead: \${matter.lead}\`,
          \`\${plural(matter.documents, "document")} in \${plural(matter.sections, "section")}\`,
          when && \`updated \${when}\`,
        ];

  return (
    <li className={styles.matter}>
      <MatterLogo matter={matter} />

      <div className={styles.matterBody}>
        <Text as="p" className={styles.matterTitle}>
          {onOpen ? (
            <Link
              type={LinkType.action}
              onClick={() => onOpen(matter)}
              isBold
              fontSize="14px"
            >
              {matter.title}
            </Link>
          ) : (
            matter.title
          )}
        </Text>

        {persona === "client" ? (
          <Text as="p" fontSize="13px" lineHeight="20px">
            {matter.stageKnown
              ? STAGE_FOR_CLIENT[matter.stage as KnownStage]
              : "Your lawyer will let you know what happens next."}
          </Text>
        ) : null}

        <Text as="p" className={styles.matterMeta}>
          {meta.filter(Boolean).join(" • ")}
        </Text>

        {persona === "lawyer" && matter.otherTags.length ? (
          <div className={styles.tagRow}>
            {matter.otherTags.map((tag) => (
              <Text key={tag} as="span" className={styles.badge}>
                {tag}
              </Text>
            ))}
          </div>
        ) : null}

        {baseUrl ? (
          <Link
            type={LinkType.page}
            href={roomUrl(baseUrl, matter.id)}
            target={LinkTarget.blank}
            color="accent"
            isHovered
            fontSize="13px"
          >
            Open in ONLYOFFICE
          </Link>
        ) : null}
      </div>

      <StageBadge matter={matter} />
    </li>
  );
};

const ALL = "all";

/** What one identity sees: a lawyer can search and filter, a client just reads. */
const MatterList = ({
  matters,
  persona,
  onOpen,
}: {
  matters: Matter[];
  persona: Persona;
  onOpen?: (matter: Matter) => void;
}) => {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<string>(ALL);

  // Known stages in their order, then whatever else the lawyers have tagged.
  const stages = useMemo(() => {
    const present = new Set(matters.map((matter) => matter.stage));
    return [
      ...STAGES.filter((known) => present.has(known)),
      ...[...present].filter(
        (value) => !(STAGES as readonly string[]).includes(value),
      ),
    ];
  }, [matters]);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return matters.filter(
      (matter) =>
        (stage === ALL || matter.stage === stage) &&
        (!needle ||
          [matter.title, matter.practice, matter.lead].some((value) =>
            value.toLowerCase().includes(needle),
          )),
    );
  }, [matters, query, stage]);

  if (persona === "client") {
    return (
      <ul className={styles.matterList}>
        {matters.map((matter) => (
          <MatterRow
            key={matter.id}
            matter={matter}
            persona="client"
            onOpen={onOpen}
          />
        ))}
      </ul>
    );
  }

  return (
    <>
      <div className={styles.toolbar}>
        <SearchInput
          size={InputSize.base}
          value={query}
          scale
          placeholder="Search by matter, practice or lawyer"
          // The list is already in memory: filter as the lawyer types, not a
          // second later, which is the default for a search that hits a server.
          refreshTimeout={0}
          onChange={setQuery}
          onClearSearch={() => setQuery("")}
        />
        <Tabs
          type={TabsTypes.Secondary}
          // Unscaled, every tab gets the widest label's measured width, and
          // that one comes out truncated.
          scaled
          selectedItemId={stage}
          onSelect={(item) => setStage(item.id)}
          items={[
            { id: ALL, name: \`All \${matters.length}\`, content: null },
            ...stages.map((value) => ({
              id: value,
              name: \`\${value} \${matters.filter((matter) => matter.stage === value).length}\`,
              content: null,
            })),
          ]}
        />
      </div>

      {shown.length ? (
        <ul className={styles.matterList}>
          {shown.map((matter) => (
            <MatterRow
              key={matter.id}
              matter={matter}
              persona="lawyer"
              onOpen={onOpen}
            />
          ))}
        </ul>
      ) : (
        <Text as="p" fontSize="13px">
          No matter matches that.
        </Text>
      )}
    </>
  );
};

/**
 * The list and its empty states, for a view already resolved. The cabinet
 * renders this straight into its page; the sample below wraps it with the
 * line that says who is reading.
 */
export const MattersBody = ({
  view,
  onOpen,
}: {
  view: ReadyMattersView;
  onOpen?: (matter: Matter) => void;
}) => {
  const { baseUrl } = useApi();
  const { persona, matters } = view;

  return (
    <>
      {matters.length ? (
        <MatterList matters={matters} persona={persona} onOpen={onOpen} />
      ) : persona === "client" ? (
        <Text as="p" fontSize="13px" lineHeight="20px">
          Nothing has been shared with you yet. Your lawyer adds you to a
          matter&apos;s room, and it appears here.
        </Text>
      ) : (
        <>
          <Text as="p" fontSize="13px" lineHeight="20px">
            {view.otherRooms
              ? \`\${plural(view.otherRooms, "room")} on this portal, none tagged as a matter. \`
              : "No rooms on this portal yet. "}
            Tag a room <b>Practice: Employment</b> and <b>Stage: Intake</b> in
            ONLYOFFICE — any practice, any of the stages below — and it becomes
            a matter here.
          </Text>
          <div className={styles.statusRow}>
            {baseUrl ? (
              <>
                <Link
                  type={LinkType.page}
                  href={new URL("/rooms/shared/filter", baseUrl).toString()}
                  target={LinkTarget.blank}
                  color="accent"
                  isHovered
                  fontSize="13px"
                >
                  Open rooms in ONLYOFFICE
                </Link>
                <Link
                  type={LinkType.page}
                  href={new URL(
                    "./?path=/docs/samples-legal-practice-setup-demo-data-on-your-portal--docs",
                    document.baseURI,
                  ).toString()}
                  target={LinkTarget.top}
                  color="accent"
                  isHovered
                  fontSize="13px"
                >
                  Or create the demo matters
                </Link>
              </>
            ) : null}
            <Button
              size={ButtonSize.extraSmall}
              label="Refresh"
              onClick={view.reload}
            />
          </div>
        </>
      )}

      {matters.length && view.otherRooms ? (
        <Text as="p" className={styles.matterMeta}>
          {\`\${plural(view.otherRooms, "other room")} without a Practice tag \${view.otherRooms === 1 ? "is" : "are"} not shown.\`}
        </Text>
      ) : null}

      {view.truncated ? (
        <Text as="p" className={styles.matterMeta}>
          Only the first 500 rooms were read. A practice this size searches on
          the server — see the notes below.
        </Text>
      ) : null}
    </>
  );
};

/**
 * Everything one identity sees, whichever provider it runs under. In demo
 * mode the portal's two answers are imitated by \`demoAs\`.
 */
export const MattersPanel = ({
  demoAs,
  onOpen,
}: {
  demoAs: Persona;
  onOpen?: (matter: Matter) => void;
}) => {
  const view = useMattersView(demoAs);

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

  return (
    <>
      <Who
        name={view.demo ? \`\${view.name} (demo data)\` : view.name}
        label={view.label}
      />
      <MattersBody view={view} onOpen={onOpen} />
    </>
  );
};

export const MyMatters = () => {
  const { baseUrl } = useApi();

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeading}>
        <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
          My matters
        </Heading>
        <Text as="p" className={styles.sectionSubtitle}>
          Every matter is a room on the portal. Its tags say which practice it
          belongs to and where it stands; the portal decides who sees it.
        </Text>
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          The lawyer&apos;s list
        </Text>
        <Text as="p" className={styles.sectionSubtitle}>
          {baseUrl
            ? "With the API key: every matter its owner was added to."
            : "Every matter the lawyer was added to."}
        </Text>
        <MattersPanel demoAs="lawyer" />
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          The client&apos;s list
        </Text>
        <Text as="p" className={styles.sectionSubtitle}>
          {baseUrl
            ? "With the client's own OAuth token: only the rooms shared with them."
            : "Only the rooms shared with the client."}
        </Text>
        {/* The same panel, under the client's own token. */}
        <ClientSession demo={<MattersPanel demoAs="client" />}>
          <MattersPanel demoAs="client" />
        </ClientSession>
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          How a room becomes a matter
        </Text>
        <Text as="p" fontSize="13px" lineHeight="20px">
          Two tags, set on the room in ONLYOFFICE like any other.{" "}
          <b>Practice: Employment</b> — or any other area of law — is what makes
          a room a matter at all; <b>Stage: Discovery</b> says where it stands.
          Any other tag is shown to the lawyer as it is.
        </Text>
        <div className={styles.facts}>
          {STAGES.map((value) => (
            <div key={value}>
              <Text as="p" className={styles.factLabel}>
                {\`Stage: \${value}\`}
              </Text>
              <Text as="p" fontSize="13px" lineHeight="20px">
                {STAGE_FOR_CLIENT[value]}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
`;try{MattersBody.displayName=`MattersBody`,MattersBody.__docgenInfo={description:`The list and its empty states, for a view already resolved. The cabinet
renders this straight into its page; the sample below wraps it with the
line that says who is reading.`,displayName:`MattersBody`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/docs/samples/legal/my-matters/MyMatters.tsx`,methods:[],props:{view:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/my-matters/MyMatters.tsx`,name:`TypeLiteral`}],description:``,name:`view`,required:!0,tags:{},type:{name:`{ status: "ready"; demo: boolean; name: string; label: string; persona: Persona; avatar: string; matters: Matter[]; otherRooms: number; truncated: boolean; reload: () => void; }`}},onOpen:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/my-matters/MyMatters.tsx`,name:`TypeLiteral`}],description:``,name:`onOpen`,required:!1,tags:{},type:{name:`((matter: Matter) => void) | undefined`}}},tags:{}}}catch{}try{MattersPanel.displayName=`MattersPanel`,MattersPanel.__docgenInfo={description:"Everything one identity sees, whichever provider it runs under. In demo\nmode the portal's two answers are imitated by `demoAs`.",displayName:`MattersPanel`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/docs/samples/legal/my-matters/MyMatters.tsx`,methods:[],props:{demoAs:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/my-matters/MyMatters.tsx`,name:`TypeLiteral`}],description:``,name:`demoAs`,required:!0,tags:{},type:{name:`Persona`}},onOpen:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/my-matters/MyMatters.tsx`,name:`TypeLiteral`}],description:``,name:`onOpen`,required:!1,tags:{},type:{name:`((matter: Matter) => void) | undefined`}}},tags:{}}}catch{}})))()}function v(e){let t={a:`a`,code:`code`,em:`em`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...a(),...e.components};return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(n,{of:l}),`
`,(0,b.jsx)(t.h1,{id:`01-my-matters`,children:`01. My matters`}),`
`,(0,b.jsx)(t.p,{children:`The first screen anyone at the firm opens, and the first one a client opens:
the matters that are theirs. A lawyer wants to know which ones need attention;
a client wants to know what is happening and who to ask.`}),`
`,(0,b.jsx)(r,{of:d}),`
`,(0,b.jsxs)(t.p,{children:[`With no portal configured, both lists are demo data. Connect a portal from the
`,(0,b.jsx)(t.strong,{children:`API`}),` control in the toolbar and the left list becomes the key owner's real
matters; register the sample's OAuth app in
`,(0,b.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-setup-who-is-signed-in--docs`,children:`Who is signed in`}),`
and the right one signs a client in as themselves.`]}),`
`,(0,b.jsx)(t.h2,{id:`a-matter-is-a-room-with-two-tags`,children:`A matter is a room with two tags`}),`
`,(0,b.jsx)(t.p,{children:`Nothing is stored anywhere but the portal. A matter is a room, and the two
things a room does not already say are carried by its tags:`}),`
`,(0,b.jsxs)(t.table,{children:[(0,b.jsx)(t.thead,{children:(0,b.jsxs)(t.tr,{children:[(0,b.jsx)(t.th,{children:`Tag`}),(0,b.jsx)(t.th,{children:`Example`}),(0,b.jsx)(t.th,{children:`What it does`})]})}),(0,b.jsxs)(t.tbody,{children:[(0,b.jsxs)(t.tr,{children:[(0,b.jsx)(t.td,{children:(0,b.jsx)(t.code,{children:`Practice: …`})}),(0,b.jsx)(t.td,{children:(0,b.jsx)(t.code,{children:`Practice: Employment`})}),(0,b.jsx)(t.td,{children:`names the area of law — and makes the room a matter at all`})]}),(0,b.jsxs)(t.tr,{children:[(0,b.jsx)(t.td,{children:(0,b.jsx)(t.code,{children:`Stage: …`})}),(0,b.jsx)(t.td,{children:(0,b.jsx)(t.code,{children:`Stage: Discovery`})}),(0,b.jsx)(t.td,{children:`says where it stands: Intake, Discovery, Negotiation, Hearing or Closed`})]})]})]}),`
`,(0,b.jsx)(t.p,{children:`Tags, because they are the one piece of free metadata a room has: the portal
shows them as chips, filters rooms by them, and lets a lawyer change them
without this application. The prefix keeps them readable in the portal's own
list, where every room's tags live together. Any other tag passes through and
is shown to the lawyer as it is; a stage outside the five is kept as written and
drawn without the accent, so a firm can add its own.`}),`
`,(0,b.jsx)(t.p,{children:`Everything else comes from the room: its title, who opened it (the lead
lawyer), when it last changed, how many documents and sections it holds.`}),`
`,(0,b.jsxs)(t.p,{children:[`To try it on your portal: open a room in ONLYOFFICE, add the tags
`,(0,b.jsx)(t.code,{children:`Practice: Employment`}),` and `,(0,b.jsx)(t.code,{children:`Stage: Intake`}),`, and press `,(0,b.jsx)(t.strong,{children:`Refresh`}),`.`]}),`
`,(0,b.jsx)(c,{code:f,language:`tsx`}),`
`,(0,b.jsx)(t.h2,{id:`one-list-two-readers`,children:`One list, two readers`}),`
`,(0,b.jsxs)(t.p,{children:[(0,b.jsx)(t.code,{children:`useMatters()`}),` never asks `,(0,b.jsx)(t.em,{children:`whose`}),` matters. It lists what the nearest
`,(0,b.jsx)(t.code,{children:`ApiProvider`}),` may see:`]}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsxs)(t.li,{children:[`under the provider Storybook mounts, that is the `,(0,b.jsx)(t.strong,{children:`API key`}),` — the lawyer who
owns it, and every matter they were added to;`]}),`
`,(0,b.jsxs)(t.li,{children:[`under a nested provider holding a client's `,(0,b.jsx)(t.strong,{children:`OAuth token`}),`, the very same
code gets only the rooms shared with that client.`]}),`
`]}),`
`,(0,b.jsx)(t.p,{children:`The portal does the filtering, because the portal is what knows who may see
what. A client cabinet that fetched every room and filtered by the client's name
would be one edit away from showing a client someone else's matter.`}),`
`,(0,b.jsxs)(t.p,{children:[(0,b.jsx)(t.code,{children:`getSelfProfile()`}),` says who is asking, and the persona from
`,(0,b.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-setup-who-is-signed-in--docs`,children:`Who is signed in`}),`
decides only
the wording. A lawyer gets the practice, the lead, the document count, search and
a filter by stage. A client gets a sentence about what the stage means for them
and the name of their lawyer — the same room, told for a different reader.`]}),`
`,(0,b.jsxs)(t.p,{children:[`Rooms are read a hundred at a time, active ones only, up to 500. That is a
sample's limit, not a portal's: a practice with thousands of matters passes
`,(0,b.jsx)(t.code,{children:`filterValue`}),` to `,(0,b.jsx)(t.code,{children:`getRoomsFolder`}),` and searches on the server.`]}),`
`,(0,b.jsx)(c,{code:m,language:`tsx`}),`
`,(0,b.jsx)(t.h2,{id:`details-worth-copying`,children:`Details worth copying`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsxs)(t.strong,{children:[(0,b.jsx)(t.code,{children:`updated`}),` arrives as a string.`]}),` The SDK types it as an object with
`,(0,b.jsx)(t.code,{children:`utcTime`}),`; the portal sends an ISO timestamp. `,(0,b.jsx)(t.code,{children:`matterFromRoom`}),` takes both.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.strong,{children:`A room's picture is either a cover or a protected file.`}),` A cover the portal
drew comes inline as SVG data, and `,(0,b.jsx)(t.code,{children:`RoomIcon`}),` recolours it. An uploaded
picture is a `,(0,b.jsx)(t.code,{children:`/storage/…`}),` path that answers 403 unsigned, so it goes through
`,(0,b.jsx)(t.code,{children:`usePortalImage`}),` from
`,(0,b.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-setup-connect-to-a-portal--docs`,children:`Connect to a portal`}),`,
under
whichever token the list runs with. With neither, `,(0,b.jsx)(t.code,{children:`RoomIcon`}),` draws the
initials on the room's colour.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.strong,{children:`The room's page on the portal`}),` is `,(0,b.jsx)(t.code,{children:`/rooms/shared/<id>/filter?folder=<id>`}),`,
for a guest as much as for a lawyer.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.strong,{children:`Demo data has the portal's shape.`}),` The demo rooms are what
`,(0,b.jsx)(t.code,{children:`getRoomsFolder`}),` returns, and go through the same `,(0,b.jsx)(t.code,{children:`matterFromRoom`}),`; the two
lists imitate the portal's two answers instead of filtering one list.`]}),`
`]}),`
`,(0,b.jsx)(t.h2,{id:`the-code`,children:`The code`}),`
`,(0,b.jsx)(c,{code:g,language:`tsx`})]})}function y(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,b.jsx)(t,{...e,children:(0,b.jsx)(v,{...e})}):v(e)}var b;function x(){return(x=e((()=>{b=i(),o(),t(),s(),u(),p(),h(),_()})))()}x();export{y as default};