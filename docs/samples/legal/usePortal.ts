import { useCallback, useEffect, useState } from "react";

import { useApi } from "../../../providers/api";
import type { RoleFlags } from "./persona";

/**
 * The state every screen in this track starts from: is there a portal behind
 * this page, who does it think we are, and if not -- why not.
 *
 * Four answers, because four different things have to be said to the reader:
 *
 *   demo       nothing is configured. The screens render their own data and
 *              say so; a documentation page that breaks without a portal is a
 *              broken page.
 *   loading    the two opening calls are in flight.
 *   connected  the portal answered. `portal` and `me` are filled.
 *   error      it answered badly, or did not answer at all -- see `reason`.
 *
 * `reason` separates the two failures worth telling apart: a key the portal
 * rejects (it says 401/403) and a request the browser refuses to make or the
 * portal refuses to let this origin make, which arrives with no status at all
 * and reads as a network error. The second one is almost always CORS, and
 * looking for the fault in the token is how an afternoon goes missing.
 */
export type PortalStatus = "demo" | "loading" | "connected" | "error";

export type PortalFailure = "unauthorized" | "unreachable" | "unexpected";

export type PortalUser = {
  displayName: string;
  email: string;
  avatar: string;
  /** What the portal lets this identity do, in the words the portal uses. */
  role: string;
  isAdmin: boolean;
  isVisitor: boolean;
  /** The portal's own flags, for `personaFromRoles`. */
  roles: RoleFlags;
};

export type PortalInfo = {
  /** The portal's own name, or its host when it has not been named. */
  title: string;
  version: string;
  baseUrl: string;
};

export type PortalState = {
  status: PortalStatus;
  portal?: PortalInfo;
  me?: PortalUser;
  reason?: PortalFailure;
  /** What the portal or the browser actually said, for the error panel. */
  detail?: string;
  /** Turns a portal-relative asset path into one an `<img>` can load. */
  portalUrl: (path?: string | null) => string;
  retry: () => void;
};

/**
 * The portal answers with asset paths relative to itself -- avatars
 * (`/storage/userPhotos/...`), room logos, file thumbnails. Put one in an
 * `<img>` as is and the browser resolves it against *this* page's origin,
 * which is Storybook or your application, not the portal: the image 404s and
 * shows its alt text. `selectors/People` fixes the same thing inline.
 *
 * `new URL(path, base)` rather than `combineUrl`: it leaves an absolute URL or
 * a `data:` URI alone, where string concatenation would prefix the portal's
 * host to a link that already has one.
 */
export const resolvePortalUrl = (
  path: string | null | undefined,
  baseUrl: string,
) => {
  if (!path) return "";

  try {
    return new URL(path, baseUrl).toString();
  } catch {
    return path;
  }
};

const describeRole = (user: {
  isOwner?: boolean;
  isAdmin?: boolean;
  isRoomAdmin?: boolean;
  isCollaborator?: boolean;
  isVisitor?: boolean;
}) => {
  if (user.isOwner) return "Owner";
  if (user.isAdmin) return "DocSpace admin";
  if (user.isRoomAdmin) return "Room admin";
  if (user.isCollaborator) return "Power user";
  if (user.isVisitor) return "Guest";
  return "User";
};

const classify = (
  error: unknown,
): { reason: PortalFailure; detail: string } => {
  const status = (error as { response?: { status?: number } })?.response
    ?.status;
  const message =
    (error as { message?: string })?.message ?? "The request failed";

  if (status === 401 || status === 403) {
    return {
      reason: "unauthorized",
      detail: `The portal answered ${status}. The key is missing, expired, or belongs to another portal.`,
    };
  }

  if (status === undefined) {
    return {
      reason: "unreachable",
      detail: `${message}. No status came back, so the request never reached the portal -- usually CORS, sometimes a wrong host.`,
    };
  }

  return { reason: "unexpected", detail: `The portal answered ${status}.` };
};

export const usePortal = (): PortalState => {
  const { commonSettingsApi, profilesApi, baseUrl } = useApi();

  const [state, setState] = useState<Omit<PortalState, "retry" | "portalUrl">>({
    status: baseUrl ? "loading" : "demo",
  });
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    // No URL means nobody filled `.env` and nobody picked a portal in the
    // toolbar. That is the normal state of this page for most readers.
    if (!baseUrl) {
      setState({ status: "demo" });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    const load = async () => {
      try {
        // Settings first: it is the cheapest call that proves the host, the
        // key and CORS all line up, and it is the one the portal answers even
        // for an identity with almost no rights.
        const settings = (await commonSettingsApi.getPortalSettings()).data
          .response;
        const me = (await profilesApi.getSelfProfile()).data.response;

        if (cancelled) return;

        setState({
          status: "connected",
          portal: {
            title:
              (settings as { portalName?: string })?.portalName ||
              new URL(baseUrl).host,
            version: (settings as { version?: string })?.version ?? "unknown",
            baseUrl,
          },
          me: {
            displayName: me?.displayName ?? me?.email ?? "Unknown",
            email: me?.email ?? "",
            // The raw portal path: `usePortalImage` resolves and signs it.
            avatar: me?.hasAvatar
              ? (me.avatarMedium ?? me.avatar ?? me.avatarSmall ?? "")
              : "",
            role: describeRole(me ?? {}),
            isAdmin: Boolean(me?.isAdmin || me?.isOwner),
            isVisitor: Boolean(me?.isVisitor),
            roles: {
              isOwner: me?.isOwner,
              isAdmin: me?.isAdmin,
              isRoomAdmin: me?.isRoomAdmin,
              isCollaborator: me?.isCollaborator,
              isVisitor: me?.isVisitor,
            },
          },
        });
      } catch (error) {
        if (cancelled) return;
        setState({ status: "error", ...classify(error) });
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [baseUrl, commonSettingsApi, profilesApi, attempt]);

  const portalUrl = useCallback(
    (path?: string | null) => resolvePortalUrl(path, baseUrl),
    [baseUrl],
  );

  return { ...state, portalUrl, retry };
};
