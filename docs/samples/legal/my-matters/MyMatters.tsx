import { useMemo, useState } from "react";

import { Button, ButtonSize } from "../../../../components/button";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../../components/heading";
import { Link, LinkTarget, LinkType } from "../../../../components/link";
import { Loader, LoaderTypes } from "../../../../components/loader";
import { SearchInput } from "../../../../components/search-input";
import { Tabs, TabsTypes } from "../../../../components/tabs";
import { Text } from "../../../../components/text";
import { InputSize } from "../../../../components/text-input";
import { useApi } from "../../../../providers/api";
import { ClientSession } from "../ClientSession";
import {
  type KnownStage,
  type Matter,
  roomUrl,
  STAGE_FOR_CLIENT,
  STAGES,
  updatedAgo,
} from "../matter";
import { MatterLogo, plural, StageBadge, Who } from "../matter-bits";
import type { Persona } from "../persona";
import { type ReadyMattersView, useMattersView } from "../useMattersView";
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
const MatterRow = ({
  matter,
  persona,
  onOpen,
}: {
  matter: Matter;
  persona: Persona;
  /** Given, the title opens the matter in the application instead of the portal. */
  onOpen?: (matter: Matter) => void;
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
          {onOpen ? (
            <Link
              type={LinkType.action}
              onClick={() => onOpen(matter)}
              isBold
              fontSize="14px"
            >
              {matter.title}
            </Link>
          ) : (
            matter.title
          )}
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
  onOpen,
}: {
  matters: Matter[];
  persona: Persona;
  onOpen?: (matter: Matter) => void;
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
          <MatterRow
            key={matter.id}
            matter={matter}
            persona="client"
            onOpen={onOpen}
          />
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
            <MatterRow
              key={matter.id}
              matter={matter}
              persona="lawyer"
              onOpen={onOpen}
            />
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

/**
 * The list and its empty states, for a view already resolved. The cabinet
 * renders this straight into its page; the sample below wraps it with the
 * line that says who is reading.
 */
export const MattersBody = ({
  view,
  onOpen,
}: {
  view: ReadyMattersView;
  onOpen?: (matter: Matter) => void;
}) => {
  const { baseUrl } = useApi();
  const { persona, matters } = view;

  return (
    <>
      {matters.length ? (
        <MatterList matters={matters} persona={persona} onOpen={onOpen} />
      ) : persona === "client" ? (
        <Text as="p" fontSize="13px" lineHeight="20px">
          Nothing has been shared with you yet. Your lawyer adds you to a
          matter&apos;s room, and it appears here.
        </Text>
      ) : (
        <>
          <Text as="p" fontSize="13px" lineHeight="20px">
            {view.otherRooms
              ? `${plural(view.otherRooms, "room")} on this portal, none tagged as a matter. `
              : "No rooms on this portal yet. "}
            Tag a room <b>Practice: Employment</b> and <b>Stage: Intake</b> in
            ONLYOFFICE — any practice, any of the stages below — and it becomes
            a matter here.
          </Text>
          <div className={styles.statusRow}>
            {baseUrl ? (
              <>
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
                <Link
                  type={LinkType.page}
                  href={new URL(
                    "./?path=/docs/samples-legal-practice-setup-demo-data-on-your-portal--docs",
                    document.baseURI,
                  ).toString()}
                  target={LinkTarget.top}
                  color="accent"
                  isHovered
                  fontSize="13px"
                >
                  Or create the demo matters
                </Link>
              </>
            ) : null}
            <Button
              size={ButtonSize.extraSmall}
              label="Refresh"
              onClick={view.reload}
            />
          </div>
        </>
      )}

      {matters.length && view.otherRooms ? (
        <Text as="p" className={styles.matterMeta}>
          {`${plural(view.otherRooms, "other room")} without a Practice tag ${view.otherRooms === 1 ? "is" : "are"} not shown.`}
        </Text>
      ) : null}

      {view.truncated ? (
        <Text as="p" className={styles.matterMeta}>
          Only the first 500 rooms were read. A practice this size searches on
          the server — see the notes below.
        </Text>
      ) : null}
    </>
  );
};

/**
 * Everything one identity sees, whichever provider it runs under. In demo
 * mode the portal's two answers are imitated by `demoAs`.
 */
export const MattersPanel = ({
  demoAs,
  onOpen,
}: {
  demoAs: Persona;
  onOpen?: (matter: Matter) => void;
}) => {
  const view = useMattersView(demoAs);

  if (view.status === "loading") {
    return (
      <div className={styles.statusRow}>
        <Loader type={LoaderTypes.track} size="20px" />
        <Text fontSize="13px">Asking the portal for rooms...</Text>
      </div>
    );
  }

  if (view.status === "error") {
    return (
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
    );
  }

  return (
    <>
      <Who
        name={view.demo ? `${view.name} (demo data)` : view.name}
        label={view.label}
      />
      <MattersBody view={view} onOpen={onOpen} />
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
        {/* The same panel, under the client's own token. */}
        <ClientSession demo={<MattersPanel demoAs="client" />}>
          <MattersPanel demoAs="client" />
        </ClientSession>
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
