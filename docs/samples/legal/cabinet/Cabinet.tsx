import { useEffect, useState } from "react";

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
 * is the same `ClientSession`; this file only puts them behind a frame and
 * decides which one is on screen.
 *
 * Which one is on screen is the only state a shell has. Here it is a value in
 * `useState`; in an application it is the URL, and `NavMenu` takes a
 * `LinkRouter` for exactly that.
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
      <div className={`${styles.app} ${styles.appCentered}`}>
        <Loader type={LoaderTypes.track} size="28px" />
      </div>
    );
  }

  if (view.status === "error") {
    return (
      <div className={`${styles.app} ${styles.appCentered}`}>
        <div className={styles.statusRow} role="alert">
          <Text as="span" className={`${styles.badge} ${styles.badgeError}`}>
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
                {`← ${listLabel}`}
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
