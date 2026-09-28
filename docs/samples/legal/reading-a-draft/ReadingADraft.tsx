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
import { useApi } from "../../../../providers/api";
import { ClientSession } from "../ClientSession";
import { MatterRoomPanel } from "../inside-a-matter/InsideAMatter";
import { Who } from "../matter-bits";
import type { Persona } from "../persona";
import { useMattersView } from "../useMattersView";
import styles from "../legal.module.scss";

/**
 * The client reads what the firm sent without downloading it: the draft
 * opens in the ONLYOFFICE editor, inside the cabinet, read-only. The lawyer
 * opens the same file from the same list and edits it. One control,
 * `DocumentReader`, and the mode is the persona's.
 */
const MatterView = ({ demoAs }: { demoAs: Persona }) => {
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
            reading
          />
        </>
      )}
    </>
  );
};

export const ReadingADraft = () => {
  const { baseUrl } = useApi();

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeading}>
        <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
          Reading the firm&apos;s draft
        </Heading>
        <Text as="p" className={styles.sectionSubtitle}>
          The draft opens where the client is, in the editor the portal serves,
          read-only. Nothing is downloaded, nothing is emailed.
        </Text>
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          The client reads
        </Text>
        <Text as="p" className={styles.sectionSubtitle}>
          {baseUrl
            ? "Under the client's own token: the editor configuration is minted for them, read-only."
            : "Press Read on a draft. With no portal a page stands in for the editor."}
        </Text>
        <ClientSession demo={<MatterView demoAs="client" />}>
          <MatterView demoAs="client" />
        </ClientSession>
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          The lawyer edits the same file
        </Text>
        <Text as="p" className={styles.sectionSubtitle}>
          {baseUrl
            ? "With the API key: the same DocumentReader, in editing mode, as the key's owner."
            : "The same list, and Open puts the draft in editing mode."}
        </Text>
        <MatterView demoAs="lawyer" />
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          What opening a document is
        </Text>
        <Text as="p" fontSize="13px" lineHeight="20px">
          Two calls and one script, all made by <b>DocumentEditor</b>. The
          portal says where its document server is; the portal is asked for this
          file&apos;s editor configuration, which carries a signed link to the
          file and a token minted for whoever asked; the editor script is loaded
          from the document server and mounted with that configuration. Under
          the client&apos;s provider all of it happens as the client, so the
          portal&apos;s answer is what the client may do, and
          <b> isView</b> asks for less than that: read and comment.
        </Text>
      </div>
    </div>
  );
};
