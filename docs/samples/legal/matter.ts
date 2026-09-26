import type { FolderDtoInteger } from "@onlyoffice/docspace-api-sdk";

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
  /** The portal's logo object, as `RoomIcon` takes it. */
  logo?: FolderDtoInteger["logo"];
};

/**
 * A timestamp as the portal sends it. The SDK types `created` and `updated`
 * as an object with `utcTime`; the wire carries a plain ISO string. Both are
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

const PRACTICE_TAG = /^\s*practice\s*:\s*(.+?)\s*$/i;
const STAGE_TAG = /^\s*stage\s*:\s*(.+?)\s*$/i;

const matchTag = (tags: string[], pattern: RegExp) => {
  for (const tag of tags) {
    const found = pattern.exec(tag);
    if (found) return found[1];
  }
  return undefined;
};

const canonicalStage = (stage: string) =>
  STAGES.find((known) => known.toLowerCase() === stage.toLowerCase());

/** The matter a room describes, or `null` for a room that is not a matter. */
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
  new URL(`/rooms/shared/${id}/filter?folder=${id}`, baseUrl).toString();
