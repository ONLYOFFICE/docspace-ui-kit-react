import { useCallback, useEffect, useState } from "react";

import {
  type FolderDtoInteger,
  SearchArea,
} from "@onlyoffice/docspace-api-sdk";

import { useApi } from "../../../providers/api";
import { explainPortalError } from "./explain";
import { byAttention, type Matter, matterFromRoom } from "./matter";
import { personaFromRoles, type PersonaInfo } from "./persona";

/**
 * The matters of whoever the nearest `ApiProvider` speaks for.
 *
 * That is the whole trick of this hook: it never asks *whose* matters. Under
 * the provider Storybook mounts it runs with the API key, and the lawyer who
 * owns the key gets every matter they were added to. Under a provider holding
 * a client's OAuth token the very same code gets the rooms shared with that
 * client and nothing else -- the portal does the filtering, because the portal
 * is what knows who may see what.
 *
 * Two calls. `getSelfProfile` says who is asking, which decides the wording;
 * it needs only `accounts.self:read`, so a client's token can make it.
 * `getRoomsFolder` lists the active rooms a page at a time; rooms without a
 * practice tag are counted and left out.
 */
export type MattersState =
  | { status: "demo" }
  | { status: "loading" }
  | {
      status: "ready";
      name: string;
      persona: PersonaInfo;
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
