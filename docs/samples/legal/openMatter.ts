import type { KnownStage } from "./matter";
import { CLIENT_FOLDER, FIRM_FOLDER } from "./matterRoom";
import type { SeedClient } from "./seed";

/**
 * Opening a matter is four writes to the portal, in an order a lawyer would
 * recognise: the room, its two tags, the folders that make it a matter's
 * home, and the client added to it. Nothing is invented here that the demo
 * seeder does not already do; this is the same calls for one matter, from a
 * form instead of a list.
 *
 * A failure stops the run and names the step, and what was made before it
 * stays on the portal: a half-made room is a room in ONLYOFFICE that a
 * lawyer can finish by hand, or that the demo-data page completes.
 */
export type MatterSpec = {
  title: string;
  practice: string;
  stage: KnownStage;
  /** One folder per line of the checklist, in this order. */
  requests: string[];
  /** Given, the client is added to the room as a content creator. */
  clientEmail?: string;
};

export type OpenStep = {
  label: string;
  status: "done" | "failed";
  detail?: string;
};

/** The seeder's writes this needs. */
export type MatterWriter = Pick<
  SeedClient,
  "createRoom" | "tagRoom" | "createFolder" | "invite"
>;

/** The practices a firm of this shape offers; a real one edits the list. */
export const PRACTICES = [
  "Employment",
  "Family",
  "Immigration",
  "Real estate",
  "Probate",
  "Corporate",
  "Personal injury",
] as const;

/** What firms ask for most; ticked ones become the checklist. */
export const REQUEST_TEMPLATES = [
  "Passport or ID",
  "Proof of address",
  "Employment contract",
  "Payslips, last 3 months",
  "Bank statements",
  "Correspondence with the other side",
] as const;

/** The demo's room colours, so a new matter looks like its neighbours. */
const COLORS = [
  "3B72A7",
  "8C5AA8",
  "C2553F",
  "6E8B3D",
  "D08A2E",
  "2E8C85",
  "555F6B",
];

export const colorFor = (title: string) => {
  let hash = 0;
  for (const char of title) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
};

/** What the form refuses to send; "" means it is fine. */
export const validate = (spec: MatterSpec) => {
  if (!spec.title.trim()) return "Give the matter a name.";
  if (!spec.practice) return "Pick a practice area.";
  const email = spec.clientEmail?.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "That does not look like an email address.";
  }
  return "";
};

export const openMatter = async (
  writer: MatterWriter,
  spec: MatterSpec,
  onStep?: (step: OpenStep) => void,
): Promise<{ roomId: number; steps: OpenStep[] }> => {
  const steps: OpenStep[] = [];
  const done = (label: string, detail?: string) => {
    const step: OpenStep = { label, status: "done", detail };
    steps.push(step);
    onStep?.(step);
  };
  const failed = (label: string, error: unknown) => {
    const status = (error as { response?: { status?: number } })?.response
      ?.status;
    const step: OpenStep = {
      label,
      status: "failed",
      detail: status
        ? `The portal answered ${status}.`
        : error instanceof Error
          ? error.message
          : "The portal did not answer.",
    };
    steps.push(step);
    onStep?.(step);
    return Object.assign(new Error(step.detail), { steps });
  };

  const title = spec.title.trim();
  const requests = spec.requests.map((r) => r.trim()).filter(Boolean);
  const email = spec.clientEmail?.trim() ?? "";

  let roomId: number;
  try {
    roomId = await writer.createRoom(title, colorFor(title));
    done("Room", title);
  } catch (error) {
    throw failed("Room", error);
  }

  const tags = [`Practice: ${spec.practice}`, `Stage: ${spec.stage}`];
  try {
    await writer.tagRoom(roomId, tags);
    done("Tags", tags.join(", "));
  } catch (error) {
    throw failed("Tags", error);
  }

  try {
    const checklist = await writer.createFolder(roomId, CLIENT_FOLDER);
    for (const request of requests) {
      await writer.createFolder(checklist, request);
    }
    done(
      "Checklist",
      requests.length
        ? `${CLIENT_FOLDER}: ${requests.join(", ")}`
        : `${CLIENT_FOLDER}, nothing asked for yet`,
    );
  } catch (error) {
    throw failed("Checklist", error);
  }

  try {
    await writer.createFolder(roomId, FIRM_FOLDER);
    done("Firm's folder", FIRM_FOLDER);
  } catch (error) {
    throw failed("Firm's folder", error);
  }

  if (email) {
    try {
      await writer.invite(roomId, email);
      done("Client", `${email}, as a content creator`);
    } catch (error) {
      throw failed("Client", error);
    }
  }

  return { roomId, steps };
};
