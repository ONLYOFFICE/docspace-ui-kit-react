import { useState } from "react";

import { Button, ButtonSize } from "../../../../components/button";
import { ComboBox, type TOption } from "../../../../components/combobox";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../../components/heading";
import { Loader, LoaderTypes } from "../../../../components/loader";
import { Text } from "../../../../components/text";
import { Toast } from "../../../../components/toast";
import { useApi } from "../../../../providers/api";
import { ClientSession } from "../ClientSession";
import { MatterRoomPanel } from "../inside-a-matter/InsideAMatter";
import { Who } from "../matter-bits";
import type { Persona } from "../persona";
import { useMattersView } from "../useMattersView";
import styles from "../legal.module.scss";

/**
 * The client answers a request by dropping a file on it; the lawyer sees it
 * arrive. The screen is the previous one with one control switched on:
 * `MatterRoomPanel` with `sending`, which puts a "Send it" on every request
 * still needed and opens `SendDocument` under it.
 */
const MatterView = ({
  demoAs,
  sending,
}: {
  demoAs: Persona;
  sending: boolean;
}) => {
  const view = useMattersView(demoAs);
  const [pickedId, setPickedId] = useState<number | null>(null);

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

  const { matters, persona, label } = view;
  const name = view.demo ? `${view.name} (demo data)` : view.name;
  const matter = matters.find((item) => item.id === pickedId) ?? matters[0];
  const options: TOption[] = matters.map((item) => ({
    key: item.id,
    label: item.title,
  }));

  return (
    <>
      <Who name={name} label={label} />
      {!matter ? (
        <Text as="p" fontSize="13px" lineHeight="20px">
          {persona === "client"
            ? "Nothing has been shared with you yet."
            : "No matters to open."}
        </Text>
      ) : (
        <>
          {matters.length > 1 ? (
            <div className={styles.picker}>
              <ComboBox
                options={options}
                selectedOption={{ key: matter.id, label: matter.title }}
                onSelect={(option) => setPickedId(Number(option.key))}
                scaled
                scaledOptions
                displaySelectedOption
                dropDownMaxHeight={240}
                textOverflow
              />
            </div>
          ) : null}
          <MatterRoomPanel
            key={matter.id}
            matter={matter}
            persona={persona}
            sending={sending}
          />
        </>
      )}
    </>
  );
};

export const SendingADocument = () => {
  const { baseUrl } = useApi();

  return (
    <div className={styles.page}>
      <Toast />

      <div className={styles.sectionHeading}>
        <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
          Sending a document
        </Heading>
        <Text as="p" className={styles.sectionSubtitle}>
          A request is a folder. Answering it is dropping a file in, and the
          checklist reads the folder, so the line turns green by itself.
        </Text>
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          The client sends
        </Text>
        <Text as="p" className={styles.sectionSubtitle}>
          {baseUrl
            ? "Under the client's own token: a chunked upload straight into the request's folder."
            : "Press Send it on a request still needed, and drop a file."}
        </Text>
        <ClientSession demo={<MatterView demoAs="client" sending />}>
          <MatterView demoAs="client" sending />
        </ClientSession>
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          The lawyer sees it arrive
        </Text>
        <Text as="p" className={styles.sectionSubtitle}>
          {baseUrl
            ? "With the API key: the same matter, and Refresh once the client has sent something."
            : "The same matter, as the lawyer reads it."}
        </Text>
        <MatterView demoAs="lawyer" sending={false} />
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          What the upload is
        </Text>
        <Text as="p" fontSize="13px" lineHeight="20px">
          Three calls, all made by <b>Uploader</b>: a session is opened for the
          file in the request&apos;s folder, the file goes up in chunks, several
          at a time, and the session is finalised into a file. The client can do
          that because the firm added them to the room as a content creator.
          Nothing about the checklist changes: the folder has a file in it now,
          which is what &quot;received&quot; means.
        </Text>
      </div>
    </div>
  );
};
