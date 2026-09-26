import { useMemo, useState } from "react";

import { Button, ButtonSize } from "../../../../components/button";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../../components/heading";
import { Link, LinkTarget, LinkType } from "../../../../components/link";
import { Loader, LoaderTypes } from "../../../../components/loader";
import { RoomIcon } from "../../../../components/room-icon";
import { SearchInput } from "../../../../components/search-input";
import { Tabs, TabsTypes } from "../../../../components/tabs";
import { Text } from "../../../../components/text";
import { InputSize } from "../../../../components/text-input";
import { ApiProvider, useApi } from "../../../../providers/api";
import { CLIENT_SCOPES, callbackUrl, readClientId } from "../clientApp";
import { DEMO_PEOPLE, DEMO_ROOMS } from "../demo-matters";
import {
  byAttention,
  type KnownStage,
  type Matter,
  matterFromRoom,
  roomUrl,
  STAGE_FOR_CLIENT,
  STAGES,
  updatedAgo,
} from "../matter";
import { personaFromRoles, type Persona } from "../persona";
import { useMatters } from "../useMatters";
import { useOAuthSignIn } from "../useOAuthSignIn";
import { usePortalImage } from "../usePortalImage";
import styles from "../legal.module.scss";

/**
 * The first screen a lawyer or a client opens: the matters that are theirs.
 *
 * One list component, two readers. `MatterList` never asks whose matters to
 * show -- it lists what the nearest `ApiProvider` may see. Under the API key
 * that is the lawyer who owns it; under a client's OAuth token it is the rooms
 * shared with that client, and the portal is what enforces it. The persona the
 * portal reports decides only the wording: a lawyer gets the practice, the
 * lead and the document count, a client gets a sentence about what is
 * happening and who to ask.
 */
const plural = (count: number, one: string, many = `${one}s`) =>
  `${count} ${count === 1 ? one : many}`;

const MatterLogo = ({ matter }: { matter: Matter }) => {
  const { logo } = matter;
  // A cover the portal drew is inline SVG data, and `RoomIcon` recolours it.
  // An uploaded picture is a protected path on the portal: fetch it signed.
  const cover = logo?.cover?.data
    ? { data: logo.cover.data, id: logo.cover.id ?? "" }
    : undefined;
  const picture = usePortalImage(cover ? "" : logo?.medium);
  const color = logo?.color || "555F6B";

  return (
    <RoomIcon
      title={matter.title}
      color={color}
      logo={
        cover
          ? { cover, color, original: "", large: "", medium: "", small: "" }
          : picture || undefined
      }
      size="32px"
      // Without a logo it would draw an empty <img>, not the initials.
      showDefault={!cover && !picture}
    />
  );
};

const StageBadge = ({ matter }: { matter: Matter }) => (
  <Text
    as="span"
    className={`${styles.badge} ${matter.stageKnown && !matter.isClosed ? styles.badgeStage : ""}`}
  >
    {matter.stage}
  </Text>
);

const MatterRow = ({
  matter,
  persona,
}: {
  matter: Matter;
  persona: Persona;
}) => {
  const { baseUrl } = useApi();
  const when = updatedAgo(matter.updated);

  const meta =
    persona === "client"
      ? [
          matter.lead && `Your lawyer: ${matter.lead}`,
          when && `Updated ${when}`,
        ]
      : [
          matter.practice,
          matter.lead && `Lead: ${matter.lead}`,
          `${plural(matter.documents, "document")} in ${plural(matter.sections, "section")}`,
          when && `updated ${when}`,
        ];

  return (
    <li className={styles.matter}>
      <MatterLogo matter={matter} />

      <div className={styles.matterBody}>
        <Text as="p" className={styles.matterTitle}>
          {matter.title}
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
}: {
  matters: Matter[];
  persona: Persona;
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
          <MatterRow key={matter.id} matter={matter} persona="client" />
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
            { id: ALL, name: `All ${matters.length}`, content: null },
            ...stages.map((value) => ({
              id: value,
              name: `${value} ${matters.filter((matter) => matter.stage === value).length}`,
              content: null,
            })),
          ]}
        />
      </div>

      {shown.length ? (
        <ul className={styles.matterList}>
          {shown.map((matter) => (
            <MatterRow key={matter.id} matter={matter} persona="lawyer" />
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

const Who = ({ name, label }: { name: string; label: string }) => (
  <div className={styles.statusRow}>
    <Text as="span" className={styles.badge}>
      {label}
    </Text>
    <Text fontSize="13px">{name}</Text>
  </div>
);

/**
 * Everything one identity sees, whichever provider it runs under. In demo
 * mode the portal's two answers are imitated by `demoAs`.
 */
const MattersPanel = ({ demoAs }: { demoAs: Persona }) => {
  const state = useMatters();
  const { baseUrl } = useApi();

  if (state.status === "demo") {
    const matters = DEMO_ROOMS[demoAs]
      .map(matterFromRoom)
      .filter((matter): matter is Matter => matter !== null)
      .sort(byAttention);
    // The roles a lawyer and a client have on a real portal.
    const label = personaFromRoles(
      demoAs === "client" ? { isVisitor: true } : { isRoomAdmin: true },
    ).label;

    return (
      <>
        <Who name={`${DEMO_PEOPLE[demoAs]} (demo data)`} label={label} />
        <MatterList matters={matters} persona={demoAs} />
      </>
    );
  }

  if (state.status === "loading") {
    return (
      <div className={styles.statusRow}>
        <Loader type={LoaderTypes.track} size="20px" />
        <Text fontSize="13px">Asking the portal for rooms...</Text>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className={styles.statusRow} role="alert">
        <Text as="span" className={`${styles.badge} ${styles.badgeError}`}>
          No matters
        </Text>
        <Text fontSize="13px">{state.message}</Text>
        <Button
          size={ButtonSize.extraSmall}
          label="Try again"
          onClick={state.reload}
        />
      </div>
    );
  }

  const { persona } = state.persona;

  return (
    <>
      <Who name={state.name} label={state.persona.label} />

      {state.matters.length ? (
        <MatterList matters={state.matters} persona={persona} />
      ) : persona === "client" ? (
        <Text as="p" fontSize="13px" lineHeight="20px">
          Nothing has been shared with you yet. Your lawyer adds you to a
          matter&apos;s room, and it appears here.
        </Text>
      ) : (
        <>
          <Text as="p" fontSize="13px" lineHeight="20px">
            {state.otherRooms
              ? `${plural(state.otherRooms, "room")} on this portal, none tagged as a matter. `
              : "No rooms on this portal yet. "}
            Tag a room <b>Practice: Employment</b> and <b>Stage: Intake</b> in
            ONLYOFFICE — any practice, any of the stages below — and it becomes
            a matter here.
          </Text>
          <div className={styles.statusRow}>
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
            <Button
              size={ButtonSize.extraSmall}
              label="Refresh"
              onClick={state.reload}
            />
          </div>
        </>
      )}

      {state.matters.length && state.otherRooms ? (
        <Text as="p" className={styles.matterMeta}>
          {`${plural(state.otherRooms, "other room")} without a Practice tag ${state.otherRooms === 1 ? "is" : "are"} not shown.`}
        </Text>
      ) : null}

      {state.truncated ? (
        <Text as="p" className={styles.matterMeta}>
          Only the first 500 rooms were read. A practice this size searches on
          the server — see the notes below.
        </Text>
      ) : null}
    </>
  );
};

/** The client's half: the same panel, under the client's own token. */
const ClientView = () => {
  const { baseUrl } = useApi();
  const [clientId] = useState(readClientId);
  const redirectUri = useMemo(callbackUrl, []);
  const oauth = useOAuthSignIn({
    portalUrl: baseUrl,
    clientId,
    redirectUri,
    scopes: CLIENT_SCOPES,
  });

  // No portal: imitate the client's answer, like everything else here.
  if (!baseUrl) return <MattersPanel demoAs="client" />;

  if (!clientId) {
    return (
      <Text as="p" fontSize="13px" lineHeight="20px">
        A client signs in as themselves, with the sample&apos;s OAuth app.
        Register it once in{" "}
        <Link
          type={LinkType.page}
          href={new URL(
            "./?path=/docs/samples-legal-practice-setup-who-is-signed-in--docs",
            document.baseURI,
          ).toString()}
          target={LinkTarget.top}
          color="accent"
          isHovered
          fontSize="13px"
        >
          Who is signed in
        </Link>
        , then come back here.
      </Text>
    );
  }

  if (oauth.status === "signed-in") {
    return (
      <>
        <div className={styles.statusRow}>
          <Button
            size={ButtonSize.small}
            label="Sign out"
            onClick={oauth.signOut}
          />
          <Text fontSize="12px">
            Everything below runs with the client&apos;s token.
          </Text>
        </div>
        <ApiProvider
          url={baseUrl}
          apiKey={oauth.token}
          initSocket={false}
          useBearerForRawClient
        >
          <MattersPanel demoAs="client" />
        </ApiProvider>
      </>
    );
  }

  return (
    <>
      <div className={styles.statusRow}>
        <Button
          primary
          size={ButtonSize.small}
          label={
            oauth.status === "waiting"
              ? "Waiting for the portal..."
              : oauth.status === "exchanging"
                ? "Getting the token..."
                : "Sign in with ONLYOFFICE"
          }
          isLoading={
            oauth.status === "waiting" || oauth.status === "exchanging"
          }
          onClick={oauth.signIn}
        />
        <Text fontSize="12px">
          Sign in as a client — a guest on the portal — to see only what was
          shared with them.
        </Text>
      </div>
      {oauth.error ? (
        <div className={styles.statusRow} role="alert">
          <Text as="span" className={`${styles.badge} ${styles.badgeError}`}>
            Sign-in failed
          </Text>
          <Text fontSize="13px" lineHeight="20px">
            {oauth.error}
          </Text>
        </div>
      ) : null}
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
        <ClientView />
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
                {`Stage: ${value}`}
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
