import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r}from"./blocks-D1qLjfJS.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{i as a,r as o}from"./react-qN2cStNd.js";import{n as s,t as c}from"./Source-CbxT880K.js";import{n as l,r as u,t as d}from"./PortalConnection.stories-BHlu0nip.js";var f;function p(){return(p=e((()=>{f=`import { useCallback, useEffect, useState } from "react";

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
 *   connected  the portal answered. \`portal\` and \`me\` are filled.
 *   error      it answered badly, or did not answer at all -- see \`reason\`.
 *
 * \`reason\` separates the two failures worth telling apart: a key the portal
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
  /** The portal's own flags, for \`personaFromRoles\`. */
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
  /** Turns a portal-relative asset path into one an \`<img>\` can load. */
  portalUrl: (path?: string | null) => string;
  retry: () => void;
};

/**
 * The portal answers with asset paths relative to itself -- avatars
 * (\`/storage/userPhotos/...\`), room logos, file thumbnails. Put one in an
 * \`<img>\` as is and the browser resolves it against *this* page's origin,
 * which is Storybook or your application, not the portal: the image 404s and
 * shows its alt text. \`selectors/People\` fixes the same thing inline.
 *
 * \`new URL(path, base)\` rather than \`combineUrl\`: it leaves an absolute URL or
 * a \`data:\` URI alone, where string concatenation would prefix the portal's
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
  if (user.isAdmin) return "Full admin";
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
      detail: \`The portal answered \${status}. The key is missing, expired, or belongs to another portal.\`,
    };
  }

  if (status === undefined) {
    return {
      reason: "unreachable",
      detail: \`\${message}. No status came back, so the request never reached the portal -- usually CORS, sometimes a wrong host.\`,
    };
  }

  return { reason: "unexpected", detail: \`The portal answered \${status}.\` };
};

export const usePortal = (): PortalState => {
  const { commonSettingsApi, profilesApi, baseUrl } = useApi();

  const [state, setState] = useState<Omit<PortalState, "retry" | "portalUrl">>({
    status: baseUrl ? "loading" : "demo",
  });
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    // No URL means nobody filled \`.env\` and nobody picked a portal in the
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
            // The raw portal path: \`usePortalImage\` resolves and signs it.
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
`})))()}var m;function h(){return(h=e((()=>{m=`import { useEffect, useState } from "react";

import { useApi } from "../../../providers/api";
import { resolvePortalUrl } from "./usePortal";

/**
 * An image from the portal's own storage, loaded so that it actually shows.
 *
 * Resolving the path against the portal (\`portalUrl\`) fixes the host and
 * nothing else: \`/storage/userPhotos/...\` and the other storage paths answer
 * 403 to a request that is not signed in. The ONLYOFFICE Apps client never meets
 * this, because it is served from the portal's origin and the browser sends
 * the session cookie with every \`<img>\`. A page on any other origin has no
 * such cookie, and an \`<img>\` cannot carry a header -- so the only way to show
 * the picture is to fetch it with the key, as a blob, and hand \`<img>\` an
 * object URL instead.
 *
 * Three rules this follows, and a copy of it should too:
 *
 *   - the key goes only to the portal. An absolute URL on another host is
 *     returned as is, because signing a request to a third party with the
 *     portal's key hands the key to that third party;
 *   - every object URL is revoked when the path changes or the component
 *     goes, or each render leaks an image into memory;
 *   - a failure returns "" -- \`Avatar\` then draws initials, and a broken
 *     image icon is worse than no image.
 */
export const usePortalImage = (path?: string | null) => {
  const { apiClient, baseUrl } = useApi();
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (!path) {
      setSrc("");
      return;
    }

    if (path.startsWith("data:") || path.startsWith("blob:")) {
      setSrc(path);
      return;
    }

    const url = resolvePortalUrl(path, baseUrl);

    // Not the portal's host: a public image somewhere else, fetched without
    // our credentials by the browser itself.
    if (!baseUrl || new URL(url).origin !== new URL(baseUrl).origin) {
      setSrc(url);
      return;
    }

    let objectUrl = "";
    let cancelled = false;

    apiClient.instance
      .get<Blob>(url, { responseType: "blob" })
      .then(({ data }) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(data);
        setSrc(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setSrc("");
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path, baseUrl, apiClient]);

  return src;
};
`})))()}var g;function _(){return(_=e((()=>{g=`import { Avatar, AvatarRole, AvatarSize } from "../../../../components/avatar";
import { Button, ButtonSize } from "../../../../components/button";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../../components/heading";
import { Link, LinkTarget, LinkType } from "../../../../components/link";
import { Loader, LoaderTypes } from "../../../../components/loader";
import { Text } from "../../../../components/text";
import { usePortal } from "../usePortal";
import { usePortalImage } from "../usePortalImage";
import styles from "../legal.module.scss";

/**
 * The setup page of the legal-practice track, and the one every screen leans
 * on: does this page have a portal behind it, and who does that portal think
 * we are?
 *
 * Nothing here is specific to a law firm yet. It is the honest answer to the
 * question the rest of the track would otherwise have to ask on every screen,
 * and the place to say the three things a reader needs before wiring their own
 * screen: where the credentials come from, whose identity the calls run as,
 * and what the page does when there is no portal at all.
 */
const Facts = ({ items }: { items: [string, string][] }) => (
  <div className={styles.facts}>
    {items.map(([label, value]) => (
      <div key={label}>
        <Text as="p" className={styles.factLabel}>
          {label}
        </Text>
        <Text as="p" className={styles.factValue}>
          {value}
        </Text>
      </div>
    ))}
  </div>
);

export const PortalConnection = () => {
  const portal = usePortal();
  const avatar = usePortalImage(portal.me?.avatar);

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeading}>
        <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
          Portal connection
        </Heading>
        <Text as="p" className={styles.sectionSubtitle}>
          Two calls decide everything the rest of this track can do:
          <code> getPortalSettings() </code> proves the host, the key and CORS
          line up, and <code> getSelfProfile() </code> says whose identity the
          calls run as.
        </Text>
      </div>

      <div className={styles.card}>
        {portal.status === "loading" ? (
          <div className={styles.statusRow}>
            <Loader type={LoaderTypes.track} size="20px" />
            <Text fontSize="13px">Asking the portal...</Text>
          </div>
        ) : null}

        {portal.status === "demo" ? (
          <>
            <div className={styles.statusRow}>
              <Text as="span" className={styles.badge}>
                Demo data
              </Text>
              <Text fontSize="13px">
                No portal is configured, so this page — and every screen after
                it — renders its own data.
              </Text>
            </div>
            <Text as="p" fontSize="13px" lineHeight="20px">
              To point it at a real ONLYOFFICE Apps portal, add a portal from
              the <b>API</b> control in the toolbar — it keeps the URL and the
              key in this browser only, and it is the only way on the published
              Storybook. Working locally, the same two values can go in{" "}
              <code>.env</code> instead:
            </Text>
            <pre className={styles.code}>
              {\`VITE_PROVIDER_API_URL=https://your-portal.onlyoffice.com
VITE_PROVIDER_API_KEY=sk-...\`}
            </pre>
            <Text as="p" fontSize="12px" lineHeight="18px">
              The key is issued in the portal under Developer Tools → API keys.
              Static builds deliberately drop both values, so a key in{" "}
              <code>.env</code> never ships with a published page.
            </Text>
          </>
        ) : null}

        {portal.status === "error" ? (
          <>
            <div className={styles.statusRow}>
              <Text
                as="span"
                className={\`\${styles.badge} \${styles.badgeError}\`}
              >
                {portal.reason === "unauthorized"
                  ? "Key refused"
                  : portal.reason === "unreachable"
                    ? "No answer"
                    : "Unexpected answer"}
              </Text>
              <Button
                size={ButtonSize.extraSmall}
                label="Try again"
                onClick={portal.retry}
              />
            </div>
            <Text as="p" fontSize="13px" lineHeight="20px">
              {portal.detail}
            </Text>
            {portal.reason === "unreachable" ? (
              <Text as="p" fontSize="12px" lineHeight="18px">
                A portal that does not allow this origin fails the request in
                the browser, so nothing comes back to read — not even a status
                code. Check the portal&apos;s CORS settings before the token.
              </Text>
            ) : null}
          </>
        ) : null}

        {portal.status === "connected" && portal.portal && portal.me ? (
          <>
            <div className={styles.statusRow}>
              <Text as="span" className={\`\${styles.badge} \${styles.badgeOk}\`}>
                Connected
              </Text>
              <Link
                type={LinkType.page}
                href={portal.portal.baseUrl}
                target={LinkTarget.blank}
                color="accent"
                isHovered
                fontSize="13px"
              >
                Open the portal
              </Link>
            </div>

            <Facts
              items={[
                ["Portal", portal.portal.title],
                ["Version", portal.portal.version],
                ["API base URL", portal.portal.baseUrl],
              ]}
            />

            <div className={styles.identity}>
              <Avatar
                size={AvatarSize.base}
                role={portal.me.isAdmin ? AvatarRole.admin : AvatarRole.user}
                source={avatar}
                userName={portal.me.displayName}
              />
              <div>
                <Text as="p" className={styles.factValue}>
                  {portal.me.displayName}
                </Text>
                <Text as="p" className={styles.factLabel}>
                  {\`\${portal.me.role} • \${portal.me.email}\`}
                </Text>
              </div>
            </div>

            <Text as="p" fontSize="12px" lineHeight="18px">
              Every call on every later screen runs as this identity. An API key
              is one user, so a screen that claims to be a client&apos;s own
              view is a demonstration of the layout, not of the permissions —
              see Who is signed in for the ways a client signs in as themselves.
            </Text>
          </>
        ) : null}
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          What the provider hands you
        </Text>
        <ul className={styles.list}>
          <li>
            <code>roomsApi</code>, <code>foldersApi</code>,{" "}
            <code>filesApi</code> — matters, their folders and their documents.
          </li>
          <li>
            <code>peopleSearchApi</code>, <code>groupApi</code>,{" "}
            <code>profilesApi</code> — clients, colleagues and who is who.
          </li>
          <li>
            <code>operationsApi</code> — the long-running work: copy, move, bulk
            download.
          </li>
          <li>
            <code>filesSettingsApi</code> — the document server the editor
            needs.
          </li>
          <li>
            <code>apiClient</code> / <code>rawApiClient</code> — a plain axios
            for anything the SDK has not wrapped yet.
          </li>
        </ul>
      </div>
    </div>
  );
};
`})))()}function v(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...a(),...e.components};return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(n,{of:l}),`
`,(0,b.jsx)(t.h1,{id:`connect-to-a-portal`,children:`Connect to a portal`}),`
`,(0,b.jsx)(t.p,{children:`The page every screen in this track leans on: is there an ONLYOFFICE Apps
portal behind this page, and who does it think we are?`}),`
`,(0,b.jsx)(r,{of:d}),`
`,(0,b.jsxs)(t.p,{children:[`Most readers see `,(0,b.jsx)(t.strong,{children:`Demo data`}),` — nothing is configured, so the page renders its
own. That is deliberate: a documentation page that breaks without a portal is a
broken page, and every screen in this track keeps demo data behind the same
shape it fetches.`]}),`
`,(0,b.jsx)(t.h2,{id:`pointing-it-at-your-own-portal`,children:`Pointing it at your own portal`}),`
`,(0,b.jsxs)(t.p,{children:[(0,b.jsx)(t.strong,{children:`On the published Storybook`}),`, and anywhere you would rather not touch files:
the `,(0,b.jsx)(t.strong,{children:`API`}),` control in the toolbar. It keeps the portal's URL and key in this
browser's `,(0,b.jsx)(t.code,{children:`localStorage`}),` and switches between saved portals per story. Nothing
leaves the browser.`]}),`
`,(0,b.jsxs)(t.p,{children:[(0,b.jsx)(t.strong,{children:`Working locally`}),`, the same two values can live in `,(0,b.jsx)(t.code,{children:`.env`}),`:`]}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-bash`,children:`# .env
VITE_PROVIDER_API_URL=https://your-portal.onlyoffice.com
VITE_PROVIDER_API_KEY=sk-...
`})}),`
`,(0,b.jsxs)(t.p,{children:[`A static build `,(0,b.jsx)(t.strong,{children:`drops both on purpose`}),`. Vite inlines every
`,(0,b.jsx)(t.code,{children:`import.meta.env.VITE_*`}),` it reads, so without that a key in the builder's
`,(0,b.jsx)(t.code,{children:`.env`}),` would sit in plain text in `,(0,b.jsx)(t.code,{children:`assets/iframe-*.js`}),` of the published site —
`,(0,b.jsx)(t.code,{children:`.storybook/main.ts`}),` blanks them for production builds, and the published pages
start in demo mode.`]}),`
`,(0,b.jsxs)(t.p,{children:[`Nothing else to wire: `,(0,b.jsx)(t.code,{children:`.storybook/decorators/withApiProvider.tsx`}),` already wraps
every story in `,(0,b.jsx)(t.code,{children:`ApiProvider`}),`, so `,(0,b.jsx)(t.code,{children:`useApi()`}),` works in any sample without a
provider of its own.`]}),`
`,(0,b.jsx)(t.h2,{id:`the-hook-the-rest-of-the-track-shares`,children:`The hook the rest of the track shares`}),`
`,(0,b.jsxs)(t.p,{children:[(0,b.jsx)(t.code,{children:`usePortal()`}),` makes the two opening calls and turns them into four states —
`,(0,b.jsx)(t.code,{children:`demo`}),`, `,(0,b.jsx)(t.code,{children:`loading`}),`, `,(0,b.jsx)(t.code,{children:`connected`}),`, `,(0,b.jsx)(t.code,{children:`error`}),` — because those are the four different
things a screen has to say. The part worth copying is the classification of
failures:`]}),`
`,(0,b.jsxs)(t.table,{children:[(0,b.jsx)(t.thead,{children:(0,b.jsxs)(t.tr,{children:[(0,b.jsx)(t.th,{children:`What came back`}),(0,b.jsx)(t.th,{children:`What it means`}),(0,b.jsx)(t.th,{children:`What the screen says`})]})}),(0,b.jsxs)(t.tbody,{children:[(0,b.jsxs)(t.tr,{children:[(0,b.jsx)(t.td,{children:`401 / 403`}),(0,b.jsx)(t.td,{children:`the portal answered and refused the key`}),(0,b.jsx)(t.td,{children:`Key refused`})]}),(0,b.jsxs)(t.tr,{children:[(0,b.jsx)(t.td,{children:`no status at all`}),(0,b.jsx)(t.td,{children:`the browser never got an answer — nearly always CORS, sometimes a wrong host`}),(0,b.jsx)(t.td,{children:`No answer`})]}),(0,b.jsxs)(t.tr,{children:[(0,b.jsx)(t.td,{children:`any other status`}),(0,b.jsx)(t.td,{children:`the portal answered something unplanned`}),(0,b.jsx)(t.td,{children:`Unexpected answer`})]})]})]}),`
`,(0,b.jsx)(t.p,{children:`Telling the second apart from the first is the whole point. A CORS failure
carries no status code, so it looks like a broken token, and that is how an
afternoon goes missing.`}),`
`,(0,b.jsx)(c,{code:f,language:`tsx`}),`
`,(0,b.jsx)(t.h2,{id:`pictures-from-the-portal-need-the-key-too`,children:`Pictures from the portal need the key too`}),`
`,(0,b.jsxs)(t.p,{children:[`An avatar comes back as `,(0,b.jsx)(t.code,{children:`/storage/userPhotos/…`}),` — a path on the portal, and one
that answers `,(0,b.jsx)(t.strong,{children:`403`}),` to a request that is not signed in. The ONLYOFFICE Apps client
never notices, because it is served from the portal's origin and the browser
sends the session cookie with every `,(0,b.jsx)(t.code,{children:`<img>`}),`. A page anywhere else has no such
cookie, and an `,(0,b.jsx)(t.code,{children:`<img>`}),` cannot carry a header.`]}),`
`,(0,b.jsxs)(t.p,{children:[`So the picture is fetched with the key and handed to `,(0,b.jsx)(t.code,{children:`<img>`}),` as a blob:`]}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-ts`,children:`const src = usePortalImage(user.avatarMedium); // blob:… once it arrives, "" until then

<Avatar source={src} userName={user.displayName} … />
`})}),`
`,(0,b.jsxs)(t.p,{children:[(0,b.jsx)(t.code,{children:`usePortalImage`}),` resolves the path against the portal, requests it through the
provider's own axios client — which already carries `,(0,b.jsx)(t.code,{children:`Authorization`}),` — and turns
the answer into an object URL. It sends the key `,(0,b.jsx)(t.strong,{children:`only to the portal's host`}),`: an
absolute URL anywhere else is returned untouched, because signing a request to
a third party hands them the key. It revokes the object URL when the path
changes, and on any failure returns `,(0,b.jsx)(t.code,{children:`""`}),`, so `,(0,b.jsx)(t.code,{children:`Avatar`}),` draws initials rather
than a broken image.`]}),`
`,(0,b.jsxs)(t.p,{children:[`This works from any origin, the published Storybook included, because the
portal answers both `,(0,b.jsx)(t.code,{children:`/api/2.0`}),` and `,(0,b.jsx)(t.code,{children:`/storage`}),` with
`,(0,b.jsx)(t.code,{children:`Access-Control-Allow-Origin: *`}),` and allows the `,(0,b.jsx)(t.code,{children:`Authorization`}),` header. The
request must not send credentials: a wildcard origin and cookies do not mix,
which is one more reason the key travels as a header.`]}),`
`,(0,b.jsx)(c,{code:m,language:`tsx`}),`
`,(0,b.jsx)(t.h2,{id:`whose-identity-is-this`,children:`Whose identity is this?`}),`
`,(0,b.jsxs)(t.p,{children:[`An API key is `,(0,b.jsx)(t.strong,{children:`one user`}),` — the key's owner. It is the right shape for the
lawyer's workspace, where the application acts for the firm, and the wrong one
for a client cabinet that claims to show a client only their own matters:
filtering rooms by a client's name is a layout demonstration, not an
authorisation.`]}),`
`,(0,b.jsxs)(t.p,{children:[(0,b.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-setup-who-is-signed-in--docs`,children:`Who is signed in`}),`
takes that seriously: the portal's own session when the application is served
from its origin, and OAuth when it is not.`]}),`
`,(0,b.jsx)(t.h2,{id:`the-code`,children:`The code`}),`
`,(0,b.jsxs)(t.p,{children:[`Imports here are relative to this repository. In your application they come
from the package — `,(0,b.jsx)(t.code,{children:`@onlyoffice/apps-ui-kit/providers/api`}),` for the provider and
the hook, and the component subpaths for everything the screen draws with.`]}),`
`,(0,b.jsx)(c,{code:g,language:`tsx`})]})}function y(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,b.jsx)(t,{...e,children:(0,b.jsx)(v,{...e})}):v(e)}var b;function x(){return(x=e((()=>{b=i(),o(),t(),s(),u(),p(),h(),_()})))()}x();export{y as default};