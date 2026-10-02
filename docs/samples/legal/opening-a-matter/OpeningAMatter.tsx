import { useState } from "react";

import { Button, ButtonSize } from "../../../../components/button";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../../components/heading";
import { Loader, LoaderTypes } from "../../../../components/loader";
import { Text } from "../../../../components/text";
import { useApi } from "../../../../providers/api";
import { MatterRoomPanel } from "../inside-a-matter/InsideAMatter";
import { Who } from "../matter-bits";
import { MattersBody } from "../my-matters/MyMatters";
import { useMattersView } from "../useMattersView";
import { OpenMatterDialog } from "./OpenMatterDialog";
import styles from "../legal.module.scss";

/**
 * The lawyer's one setting-up action: a new matter, from a form. When the
 * dialog is done the list is read again and the new matter is opened below
 * it, exactly as the client will find it.
 */
const STEPS: [string, string, string][] = [
  [
    "Room",
    "createRoom",
    "A custom room named after the matter, coloured like its neighbours.",
  ],
  [
    "Tags",
    "createRoomTag, then addRoomTags",
    "Practice and Stage. A tag must exist on the portal before a room can carry it.",
  ],
  [
    "Checklist",
    "createFolder, once per line",
    '"From the client" and a subfolder per ticked request. Empty means still needed.',
  ],
  [
    "Firm's folder",
    "createFolder",
    '"From the firm", for drafts and letters the client reads.',
  ],
  [
    "Client",
    "setRoomSecurity",
    "The email is added as a content creator: the lowest role that may drop a file in.",
  ],
];

export const OpeningAMatter = () => {
  const { baseUrl } = useApi();
  const view = useMattersView("lawyer");
  const [visible, setVisible] = useState(false);
  const [openedId, setOpenedId] = useState<number | null>(null);

  const opened =
    view.status === "ready"
      ? view.matters.find((matter) => matter.id === openedId)
      : undefined;

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeading}>
        <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
          Opening a matter
        </Heading>
        <Text as="p" className={styles.sectionSubtitle}>
          One form, and the room, its tags, its folders and its client exist.
          Everything the other screens read is written here.
        </Text>
      </div>

      <div className={styles.card}>
        <div className={styles.listHeader}>
          <Text as="p" className={styles.sectionTitle}>
            The lawyer&apos;s matters
          </Text>
          <Button
            primary
            size={ButtonSize.small}
            label="New matter"
            isDisabled={view.status !== "ready"}
            onClick={() => setVisible(true)}
          />
        </div>
        <Text as="p" className={styles.sectionSubtitle}>
          {baseUrl
            ? "With the API key: the new room is made on your portal, as the key's owner."
            : "With no portal the matter is opened in the demo, and the other screens see it."}
        </Text>

        {view.status === "loading" ? (
          <div className={styles.statusRow}>
            <Loader type={LoaderTypes.track} size="20px" />
            <Text fontSize="13px">Asking the portal for rooms...</Text>
          </div>
        ) : view.status === "error" ? (
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
        ) : (
          <>
            <Who
              name={view.demo ? `${view.name} (demo data)` : view.name}
              label={view.label}
            />
            <MattersBody
              view={view}
              onOpen={(matter) => setOpenedId(matter.id)}
            />
          </>
        )}

        <OpenMatterDialog
          visible={visible}
          onClose={() => setVisible(false)}
          onOpened={(roomId) => {
            setVisible(false);
            setOpenedId(roomId);
            if (view.status === "ready") view.reload();
          }}
        />
      </div>

      {opened ? (
        <div className={styles.card}>
          <Text as="p" className={styles.sectionTitle}>
            The matter, as it was opened
          </Text>
          <Text as="p" className={styles.sectionSubtitle}>
            What the previous screens read: the room with its checklist, empty
            until the client answers.
          </Text>
          <MatterRoomPanel key={opened.id} matter={opened} persona="lawyer" />
        </div>
      ) : null}

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          What the form writes
        </Text>
        <ul className={styles.matterList}>
          {STEPS.map(([step, call, why]) => (
            <li key={step} className={styles.matter}>
              <span />
              <div className={styles.matterBody}>
                <Text as="p" className={styles.matterTitle}>
                  {call}
                </Text>
                <Text as="p" className={styles.matterMeta}>
                  {why}
                </Text>
              </div>
              <Text as="span" className={styles.badge}>
                {step}
              </Text>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
