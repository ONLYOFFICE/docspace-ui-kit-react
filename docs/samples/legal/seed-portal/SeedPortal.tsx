import { useState } from "react";

import { Button, ButtonSize } from "../../../../components/button";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../../components/heading";
import { Link, LinkTarget, LinkType } from "../../../../components/link";
import { RoomIcon } from "../../../../components/room-icon";
import { Text } from "../../../../components/text";
import {
  InputSize,
  InputType,
  TextInput,
} from "../../../../components/text-input";
import { useApi } from "../../../../providers/api";
import { DEMO_FOLDERS } from "../demo-matter-contents";
import { DEMO_ROOMS } from "../demo-matters";
import { matterFromRoom } from "../matter";
import { CLIENT_FOLDER } from "../matterRoom";
import {
  CLIENT_ROOM_IDS,
  sdkSeedClient,
  type SeedStep,
  type SeedSummary,
  seedPortal,
} from "../seed";
import styles from "../legal.module.scss";

/**
 * One button that puts the demo practice on the connected portal, so every
 * screen in the track can be tried against real rooms without making them
 * by hand. What it creates is listed first, and the log says what happened
 * to each room.
 */
const BADGE: Record<SeedStep["status"], { label: string; className: string }> =
  {
    done: { label: "Created", className: styles.badgeOk },
    skipped: { label: "Already there", className: "" },
    failed: { label: "Failed", className: styles.badgeError },
  };

/** The room's initials on its colour, as the portal would draw it. */
const Initials = ({
  title,
  color,
}: {
  title: string;
  color?: string | null;
}) => (
  <RoomIcon title={title} color={color || "555F6B"} size="32px" showDefault />
);

const WhatGetsCreated = () => (
  <ul className={styles.matterList}>
    {DEMO_ROOMS.lawyer.map((room) => {
      const matter = matterFromRoom(room);
      const contents =
        room.id === undefined ? undefined : DEMO_FOLDERS[room.id];
      const checklist = contents?.folders.find(
        (folder) => folder.title === CLIENT_FOLDER,
      );
      const requests =
        checklist?.id === undefined
          ? 0
          : (DEMO_FOLDERS[checklist.id]?.folders.length ?? 0);
      const forClient =
        room.id !== undefined && CLIENT_ROOM_IDS.includes(room.id);

      return (
        <li key={room.id} className={styles.matter}>
          <Initials title={room.title ?? ""} color={room.logo?.color} />
          <div className={styles.matterBody}>
            <Text as="p" className={styles.matterTitle}>
              {room.title}
            </Text>
            <Text as="p" className={styles.matterMeta}>
              {matter
                ? [
                    (room.tags ?? []).join(", "),
                    requests
                      ? `a checklist of ${requests} and the firm's folder`
                      : "no folders yet",
                    forClient ? "shared with the client" : "",
                  ]
                    .filter(Boolean)
                    .join(" • ")
                : "not a matter: no Practice tag, so the screens leave it out"}
            </Text>
          </div>
          <span />
        </li>
      );
    })}
  </ul>
);

export const SeedPortal = () => {
  const api = useApi();
  const { baseUrl } = api;
  const [email, setEmail] = useState("");
  const [steps, setSteps] = useState<SeedStep[]>([]);
  const [summary, setSummary] = useState<SeedSummary | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    setSteps([]);
    setSummary(null);
    try {
      const result = await seedPortal(sdkSeedClient(api), {
        clientEmail: email,
        onStep: (step) => setSteps((previous) => [...previous, step]),
      });
      setSummary(result);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeading}>
        <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
          Demo data on your portal
        </Heading>
        <Text as="p" className={styles.sectionSubtitle}>
          The rooms every screen shows without a portal, created on yours with
          one press, so the screens can be tried for real.
        </Text>
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          Create it on your portal
        </Text>

        {baseUrl ? (
          <>
            <Text as="p" fontSize="13px" lineHeight="20px">
              This creates rooms on the portal connected in the toolbar, as the
              owner of its API key. Nothing is deleted, and a room whose name is
              already there is skipped, so pressing twice adds nothing. Give a
              client&apos;s email and the two matters that are theirs are shared
              with it; sign in with that address on the client&apos;s side of
              any screen.
            </Text>
            <div className={styles.askRow}>
              <TextInput
                type={InputType.email}
                size={InputSize.base}
                scale
                value={email}
                placeholder="Client's email, optional"
                onChange={(event) => setEmail(event.target.value)}
                isDisabled={busy}
              />
              <Button
                primary
                size={ButtonSize.small}
                label={busy ? "Creating..." : "Create the demo matters"}
                isLoading={busy}
                onClick={() => void run()}
              />
            </div>
          </>
        ) : (
          <>
            <Text as="p" fontSize="13px" lineHeight="20px">
              No portal is configured, so there is nowhere to create anything.
              Connect one from the <b>API</b> control in the toolbar, as in{" "}
              <Link
                type={LinkType.page}
                href={new URL(
                  "./?path=/docs/samples-legal-practice-setup-connect-to-a-portal--docs",
                  document.baseURI,
                ).toString()}
                target={LinkTarget.top}
                color="accent"
                isHovered
                fontSize="13px"
              >
                Connect to a portal
              </Link>
              , and come back.
            </Text>
            <div>
              <Button
                primary
                size={ButtonSize.small}
                label="Create the demo matters"
                isDisabled
              />
            </div>
          </>
        )}

        {steps.length ? (
          <ul className={styles.matterList}>
            {steps.map((step) => (
              <li key={step.label} className={styles.matter}>
                <Initials
                  title={step.label}
                  color={
                    DEMO_ROOMS.lawyer.find((room) => room.title === step.label)
                      ?.logo?.color
                  }
                />
                <div className={styles.matterBody}>
                  <Text as="p" className={styles.matterTitle}>
                    {step.label}
                  </Text>
                  {step.detail ? (
                    <Text as="p" className={styles.matterMeta}>
                      {step.detail}
                    </Text>
                  ) : null}
                </div>
                <Text
                  as="span"
                  className={`${styles.badge} ${BADGE[step.status].className}`}
                >
                  {BADGE[step.status].label}
                </Text>
              </li>
            ))}
          </ul>
        ) : null}

        {summary ? (
          <Text as="p" fontSize="13px" lineHeight="20px">
            {`${summary.done} created, ${summary.skipped} already there, ${summary.failed} failed. `}
            {summary.done ? (
              <>
                Open{" "}
                <Link
                  type={LinkType.page}
                  href={new URL(
                    "./?path=/docs/samples-legal-practice-the-cabinet--docs",
                    document.baseURI,
                  ).toString()}
                  target={LinkTarget.top}
                  color="accent"
                  isHovered
                  fontSize="13px"
                >
                  The cabinet
                </Link>{" "}
                to see them.
              </>
            ) : null}
          </Text>
        ) : null}
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          What gets created
        </Text>
        <Text as="p" className={styles.sectionSubtitle}>
          The demo practice, room for room. Matters carry their two tags and the
          two folders; each request folder that the demo shows as received gets
          a small file, and the firm&apos;s folder its drafts.
        </Text>
        <WhatGetsCreated />
      </div>
    </div>
  );
};
