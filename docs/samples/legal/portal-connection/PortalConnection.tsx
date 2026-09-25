import { Avatar, AvatarRole, AvatarSize } from "../../../../components/avatar";
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
 * The first rung of the legal-practice track, and the one every later screen
 * leans on: does this page have a portal behind it, and who does that portal
 * think we are?
 *
 * Nothing here is specific to a law firm yet. It is the honest answer to the
 * question the rest of the track would otherwise have to ask nine times, and
 * the place to say the three things a reader needs before wiring their own
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
            <Text fontSize="13px">Asking the portal…</Text>
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
              {`VITE_PROVIDER_API_URL=https://your-portal.onlyoffice.com
VITE_PROVIDER_API_KEY=sk-...`}
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
                className={`${styles.badge} ${styles.badgeError}`}
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
              <Text as="span" className={`${styles.badge} ${styles.badgeOk}`}>
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
                  {`${portal.me.role} · ${portal.me.email}`}
                </Text>
              </div>
            </div>

            <Text as="p" fontSize="12px" lineHeight="18px">
              Every call on every later screen runs as this identity. An API key
              is one user, so a screen that claims to be a client&apos;s own
              view is a demonstration of the layout, not of the permissions —
              see the next sample for the ways a client signs in as themselves.
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
