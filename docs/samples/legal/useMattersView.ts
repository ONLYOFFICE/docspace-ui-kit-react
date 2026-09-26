import { useMemo } from "react";

import { DEMO_PEOPLE, DEMO_ROOMS } from "./demo-matters";
import { byAttention, type Matter, matterFromRoom } from "./matter";
import { type Persona, personaFromRoles } from "./persona";
import { useMatters } from "./useMatters";

/**
 * What a screen that lists matters needs, with the demo already resolved:
 * who is reading, what they may see, and whether that came from a portal.
 *
 * `useMatters` answers for the nearest `ApiProvider`. With no portal there
 * is nothing to answer, so the demo imitates the portal's two answers --
 * `demoAs` says which one -- through the same `matterFromRoom` a real room
 * goes through. Every screen that shows matters starts from this, so the
 * demo is decided in one place.
 */
export type MattersView =
  | { status: "loading" }
  | { status: "error"; message: string; reload: () => void }
  | {
      status: "ready";
      demo: boolean;
      /** The reader's name, without any "(demo data)" hint: callers add it. */
      name: string;
      /** What the firm calls this person: Lawyer, Client, Managing partner... */
      label: string;
      persona: Persona;
      /** A portal path to the reader's picture, or "" for none. */
      avatar: string;
      matters: Matter[];
      otherRooms: number;
      truncated: boolean;
      reload: () => void;
    };

export type ReadyMattersView = Extract<MattersView, { status: "ready" }>;

export const useMattersView = (demoAs: Persona): MattersView => {
  const state = useMatters();

  const demoMatters = useMemo(
    () =>
      DEMO_ROOMS[demoAs]
        .map(matterFromRoom)
        .filter((matter): matter is Matter => matter !== null)
        .sort(byAttention),
    [demoAs],
  );

  if (state.status === "loading") return { status: "loading" };

  if (state.status === "error") {
    return { status: "error", message: state.message, reload: state.reload };
  }

  if (state.status === "demo") {
    // The roles a lawyer and a client have on a real portal.
    const flags =
      demoAs === "client" ? { isVisitor: true } : { isRoomAdmin: true };
    return {
      status: "ready",
      demo: true,
      name: DEMO_PEOPLE[demoAs],
      label: personaFromRoles(flags).label,
      persona: demoAs,
      avatar: "",
      matters: demoMatters,
      otherRooms: 0,
      truncated: false,
      reload: state.reload,
    };
  }

  return {
    status: "ready",
    demo: false,
    name: state.name,
    label: state.persona.label,
    persona: state.persona.persona,
    avatar: state.avatar,
    matters: state.matters,
    otherRooms: state.otherRooms,
    truncated: state.truncated,
    reload: state.reload,
  };
};
