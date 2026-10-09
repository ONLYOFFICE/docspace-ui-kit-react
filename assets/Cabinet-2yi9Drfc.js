import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r}from"./blocks-D1qLjfJS.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{i as a,r as o}from"./react-qN2cStNd.js";import{n as s,t as c}from"./Source-CbxT880K.js";import{n as l,r as u,t as d}from"./Cabinet.stories-DBS4ubks.js";var f;function p(){return(p=e((()=>{f=`import { useMemo, useSyncExternalStore } from "react";

import { DEMO_PEOPLE } from "./demo-matters";
import { demoPortal } from "./demo-portal";
import { byAttention, type Matter, matterFromRoom } from "./matter";
import { type Persona, personaFromRoles } from "./persona";
import { useMatters } from "./useMatters";

/**
 * What a screen that lists matters needs, with the demo already resolved:
 * who is reading, what they may see, and whether that came from a portal.
 *
 * \`useMatters\` answers for the nearest \`ApiProvider\`. With no portal there
 * is nothing to answer, so the demo portal imitates the portal's two answers
 * -- \`demoAs\` says which one -- through the same \`matterFromRoom\` a real
 * room goes through, and the screen follows its changes. Every screen that
 * shows matters starts from this, so the demo is decided in one place.
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
  const demoSnapshot = useSyncExternalStore(
    demoPortal.subscribe,
    demoPortal.get,
  );

  const demoMatters = useMemo(
    () =>
      demoPortal
        .roomsFor(demoAs, demoSnapshot)
        .map(matterFromRoom)
        .filter((matter): matter is Matter => matter !== null)
        .sort(byAttention),
    [demoAs, demoSnapshot],
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
`})))()}var m;function h(){return(h=e((()=>{m=`import { useEffect, useState } from "react";

import CatalogPortfolioSvgUrl from "../../../../assets/icons/16/catalog.portfolio.react.svg?url";
import CatalogRoomsSvgUrl from "../../../../assets/icons/16/catalog.rooms.react.svg?url";
import { Avatar, AvatarRole, AvatarSize } from "../../../../components/avatar";
import { Button, ButtonSize } from "../../../../components/button";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../../components/heading";
import { Link, LinkType } from "../../../../components/link";
import { Loader, LoaderTypes } from "../../../../components/loader";
import { NavMenu } from "../../../../components/nav-menu";
import { Tabs, TabsTypes } from "../../../../components/tabs";
import { Text } from "../../../../components/text";
import { Toast } from "../../../../components/toast";
import { ClientSession } from "../ClientSession";
import { MatterRoomPanel } from "../inside-a-matter/InsideAMatter";
import type { Matter } from "../matter";
import { MattersBody } from "../my-matters/MyMatters";
import { OpenMatterDialog } from "../opening-a-matter/OpenMatterDialog";
import type { Persona } from "../persona";
import { useMattersView } from "../useMattersView";
import { usePortalImage } from "../usePortalImage";
import styles from "../legal.module.scss";

/**
 * The whole application in one story: a sidebar, the list of matters, and a
 * matter opened from it. Nothing here is new. The list is the one from
 * "My matters", the opened matter is "Inside a matter", the client's sign-in
 * is the same \`ClientSession\`; this file only puts them behind a frame and
 * decides which one is on screen.
 *
 * Which one is on screen is the only state a shell has. Here it is a value in
 * \`useState\`; in an application it is the URL, and \`NavMenu\` takes a
 * \`LinkRouter\` for exactly that.
 */

/** The firm's name, where a real cabinet reads its own. */
const FIRM = "Reyes & Nair";

type Screen = { kind: "list" } | { kind: "matter"; matter: Matter };

export const CabinetFrame = ({ demoAs }: { demoAs: Persona }) => {
  const view = useMattersView(demoAs);
  const [screen, setScreen] = useState<Screen>({ kind: "list" });
  const [opening, setOpening] = useState(false);
  // A matter just opened is shown as soon as the list knows it.
  const [pendingOpen, setPendingOpen] = useState<number | null>(null);
  const pending =
    pendingOpen !== null && view.status === "ready"
      ? view.matters.find((matter) => matter.id === pendingOpen)
      : undefined;
  useEffect(() => {
    if (pending) {
      setScreen({ kind: "matter", matter: pending });
      setPendingOpen(null);
    }
  }, [pending]);
  // The reader's picture is a protected path on the portal, like any other.
  const avatar = usePortalImage(view.status === "ready" ? view.avatar : "");

  if (view.status === "loading") {
    return (
      <div className={\`\${styles.app} \${styles.appCentered}\`}>
        <Loader type={LoaderTypes.track} size="28px" />
      </div>
    );
  }

  if (view.status === "error") {
    return (
      <div className={\`\${styles.app} \${styles.appCentered}\`}>
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
      </div>
    );
  }

  const { persona, matters } = view;
  const listLabel = persona === "client" ? "My matters" : "Matters";
  const showList = () => setScreen({ kind: "list" });

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Text as="p" className={styles.sidebarFirm}>
            {FIRM}
          </Text>
          <Text as="p" className={styles.matterMeta}>
            {persona === "client" ? "Client cabinet" : "Workspace"}
            {view.demo ? " • demo data" : ""}
          </Text>
        </div>

        <NavMenu
          activeItemId={screen.kind === "list" ? "list" : "open"}
          groups={[
            {
              id: "matters",
              items: [
                {
                  id: "list",
                  label: listLabel,
                  icon: CatalogRoomsSvgUrl,
                  showBadge: matters.length > 0,
                  labelBadge: matters.length,
                  onClick: showList,
                },
                ...(screen.kind === "matter"
                  ? [
                      {
                        id: "open",
                        label: screen.matter.title,
                        icon: CatalogPortfolioSvgUrl,
                      },
                    ]
                  : []),
              ],
            },
          ]}
        />

        <div className={styles.sidebarProfile}>
          <Avatar
            size={AvatarSize.small}
            role={AvatarRole.user}
            source={avatar}
            userName={view.name}
          />
          <div className={styles.matterBody}>
            <Text as="p" className={styles.matterTitle}>
              {view.name}
            </Text>
            <Text as="p" className={styles.matterMeta}>
              {view.label}
            </Text>
          </div>
        </div>
      </aside>

      <main className={styles.content}>
        {screen.kind === "list" ? (
          <>
            <div className={styles.listHeader}>
              <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
                {listLabel}
              </Heading>
              {persona === "lawyer" ? (
                <Button
                  primary
                  size={ButtonSize.small}
                  label="New matter"
                  onClick={() => setOpening(true)}
                />
              ) : null}
            </div>
            <OpenMatterDialog
              visible={opening}
              onClose={() => setOpening(false)}
              onOpened={(roomId) => {
                setOpening(false);
                setPendingOpen(roomId);
                view.reload();
              }}
            />
            <MattersBody
              view={view}
              onOpen={(matter) => setScreen({ kind: "matter", matter })}
            />
          </>
        ) : (
          <>
            <div>
              <Link
                type={LinkType.action}
                onClick={showList}
                color="accent"
                isHovered
                fontSize="13px"
              >
                {\`← \${listLabel}\`}
              </Link>
            </div>
            <MatterRoomPanel
              matter={screen.matter}
              persona={persona}
              sending={persona === "client"}
              reading
            />
          </>
        )}
      </main>
    </div>
  );
};

/**
 * The story: the same frame as the lawyer, under the API key, or as the
 * client, under their own token. A real deployment serves one or the other;
 * the switch is here so both can be seen.
 */
export const Cabinet = () => {
  const [as, setAs] = useState<Persona>("lawyer");

  return (
    <div className={styles.page}>
      {/* Uploads and the like report through toasts; one container serves the frame. */}
      <Toast />
      <div className={styles.toolbar}>
        {/* Primary tabs: two views of one page. The secondary kind measures
            its own scaled tabs and, in a box this wide, decides two of them
            overflow. */}
        <Tabs
          type={TabsTypes.Primary}
          selectedItemId={as}
          onSelect={(item) => setAs(item.id as Persona)}
          items={[
            { id: "lawyer", name: "As the lawyer", content: null },
            { id: "client", name: "As the client", content: null },
          ]}
        />
        <Text fontSize="12px">
          {as === "lawyer"
            ? "The workspace, under the firm's API key."
            : "The cabinet, under the client's own OAuth token."}
        </Text>
      </div>

      {as === "lawyer" ? (
        <CabinetFrame demoAs="lawyer" />
      ) : (
        <ClientSession demo={<CabinetFrame demoAs="client" />}>
          <CabinetFrame demoAs="client" />
        </ClientSession>
      )}
    </div>
  );
};
`;try{CabinetFrame.displayName=`CabinetFrame`,CabinetFrame.__docgenInfo={description:``,displayName:`CabinetFrame`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/docs/samples/legal/cabinet/Cabinet.tsx`,methods:[],props:{demoAs:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/cabinet/Cabinet.tsx`,name:`TypeLiteral`}],description:``,name:`demoAs`,required:!0,tags:{},type:{name:`Persona`}}},tags:{}}}catch{}try{Cabinet.displayName=`Cabinet`,Cabinet.__docgenInfo={description:`The story: the same frame as the lawyer, under the API key, or as the
client, under their own token. A real deployment serves one or the other;
the switch is here so both can be seen.`,displayName:`Cabinet`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/docs/samples/legal/cabinet/Cabinet.tsx`,methods:[],props:{},tags:{}}}catch{}})))()}function g(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...a(),...e.components};return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(n,{of:d}),`
`,(0,v.jsx)(t.h1,{id:`the-cabinet`,children:`The cabinet`}),`
`,(0,v.jsx)(t.p,{children:`The whole application, in one story. A lawyer opens it and gets the firm's
matters; a client opens it and gets theirs. Open a matter, and it is the
checklist from the previous screens. Everything after this page is a part
of it, taken out to be looked at on its own.`}),`
`,(0,v.jsx)(r,{of:l}),`
`,(0,v.jsxs)(t.p,{children:[`With no portal the frame runs on demo data, for both people. Connect a portal
from the `,(0,v.jsx)(t.strong,{children:`API`}),` control in the toolbar and `,(0,v.jsx)(t.strong,{children:`As the lawyer`}),` is the key
owner's real workspace; register the OAuth app in
`,(0,v.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-setup-who-is-signed-in--docs`,children:`Who is signed in`}),`
and `,(0,v.jsx)(t.strong,{children:`As the client`}),` signs a client in as themselves.`]}),`
`,(0,v.jsx)(t.h2,{id:`assembled-not-written`,children:`Assembled, not written`}),`
`,(0,v.jsx)(t.p,{children:`The frame adds no screen of its own. It holds:`}),`
`,(0,v.jsxs)(t.table,{children:[(0,v.jsx)(t.thead,{children:(0,v.jsxs)(t.tr,{children:[(0,v.jsx)(t.th,{children:`Part`}),(0,v.jsx)(t.th,{children:`From`}),(0,v.jsx)(t.th,{children:`What it is here`})]})}),(0,v.jsxs)(t.tbody,{children:[(0,v.jsxs)(t.tr,{children:[(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`MattersBody`})}),(0,v.jsx)(t.td,{children:(0,v.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-screens-01-my-matters--docs`,children:`01. My matters`})}),(0,v.jsx)(t.td,{children:`the list, with a click on a matter that opens it`})]}),(0,v.jsxs)(t.tr,{children:[(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`MatterRoomPanel`})}),(0,v.jsx)(t.td,{children:(0,v.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-screens-02-inside-a-matter--docs`,children:`02. Inside a matter`})}),(0,v.jsx)(t.td,{children:`the opened matter: checklist, drafts, facts`})]}),(0,v.jsxs)(t.tr,{children:[(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`ClientSession`})}),(0,v.jsx)(t.td,{children:(0,v.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-setup-who-is-signed-in--docs`,children:`Who is signed in`})}),(0,v.jsx)(t.td,{children:`the client's sign-in, and the provider that holds their token`})]}),(0,v.jsxs)(t.tr,{children:[(0,v.jsx)(t.td,{children:(0,v.jsx)(t.code,{children:`useMattersView`})}),(0,v.jsx)(t.td,{children:`below`}),(0,v.jsx)(t.td,{children:`who is reading and what they may see, demo already resolved`})]})]})]}),`
`,(0,v.jsxs)(t.p,{children:[`Which screen is showing is the only state a shell has. Here it is a value in
`,(0,v.jsx)(t.code,{children:`useState`}),`, so the story needs no router. In an application it is the URL:
`,(0,v.jsx)(t.code,{children:`NavMenu`}),` takes a `,(0,v.jsx)(t.code,{children:`LinkRouter`}),`, and every entry with `,(0,v.jsx)(t.code,{children:`linkData`}),` becomes the
router's link. The screens themselves do not change, because none of them
knows how it was reached.`]}),`
`,(0,v.jsx)(c,{code:f,language:`tsx`}),`
`,(0,v.jsx)(t.h2,{id:`the-shell`,children:`The shell`}),`
`,(0,v.jsxs)(t.ul,{children:[`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:(0,v.jsx)(t.code,{children:`NavMenu`})}),` is the sidebar: one group, the list of matters with a count
badge, and the open matter as a second entry while there is one. It owns
which section is expanded and nothing else; what is active and what a click
does come from the frame.`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:(0,v.jsx)(t.code,{children:`Avatar`})}),` at the bottom draws the reader's picture, fetched through
`,(0,v.jsx)(t.code,{children:`usePortalImage`}),` because the path the portal gives is protected, or their
initials when there is none.`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:(0,v.jsx)(t.code,{children:`Tabs`})}),` above the frame switch between the two people. That is the
story's control, not the application's: a real deployment serves one
frame, and knows which from the token it holds.`]}),`
`,(0,v.jsx)(t.li,{children:`The two-column layout is the sample's own: a grid of a 240px sidebar and
the page, which stacks on a phone.`}),`
`]}),`
`,(0,v.jsx)(t.h2,{id:`what-lands-here-next`,children:`What lands here next`}),`
`,(0,v.jsx)(t.p,{children:`Each later screen is added to the frame in the commit that adds the screen:
sending a document from the checklist, reading a draft in the editor, and
opening a matter from the workspace.`}),`
`,(0,v.jsx)(t.h2,{id:`the-code`,children:`The code`}),`
`,(0,v.jsx)(c,{code:m,language:`tsx`})]})}function _(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,v.jsx)(t,{...e,children:(0,v.jsx)(g,{...e})}):g(e)}var v;function y(){return(y=e((()=>{v=i(),o(),t(),s(),u(),p(),h()})))()}y();export{_ as default};