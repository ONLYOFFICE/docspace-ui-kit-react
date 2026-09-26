import { type FormEvent, type ReactNode, useState } from "react";

import EmptyRoomsDarkSvg from "../../../../assets/emptyview/empty.rooms.root.user.dark.svg";
import EmptyRoomsLightSvg from "../../../../assets/emptyview/empty.rooms.root.user.light.svg";
import { Button, ButtonSize } from "../../../../components/button";
import { CollapsibleCard } from "../../../../components/collapsible-card";
import { ColumnarInfoBar } from "../../../../components/columnar-info-bar";
import { ComboBox, type TOption } from "../../../../components/combobox";
import { EmptyView } from "../../../../components/empty-view";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../../components/heading";
import { Link, LinkTarget, LinkType } from "../../../../components/link";
import { Loader, LoaderTypes } from "../../../../components/loader";
import { ProgressBar } from "../../../../components/progress-bar";
import { Text } from "../../../../components/text";
import {
  InputSize,
  InputType,
  TextInput,
} from "../../../../components/text-input";
import { toastr } from "../../../../components/toast";
import { useTheme } from "../../../../context/ThemeContext";
import { useApi } from "../../../../providers/api";
import { FileIcon } from "../../file-icon";
import { ClientSession } from "../ClientSession";
import {
  type KnownStage,
  type Matter,
  roomUrl,
  STAGE_FOR_CLIENT,
  updatedAgo,
} from "../matter";
import { MatterLogo, plural, StageBadge, Who } from "../matter-bits";
import {
  CLIENT_FOLDER,
  type Document,
  FIRM_FOLDER,
  formatSize,
  progressOf,
  type Request,
} from "../matterRoom";
import type { Persona } from "../persona";
import { SendDocument } from "../sending-a-document/SendDocument";
import { useMatterRoom } from "../useMatterRoom";
import { useMattersView } from "../useMattersView";
import styles from "../legal.module.scss";

/**
 * One matter, opened. What the firm still needs from the client, what has
 * arrived, and what the firm sent back -- all of it folders in the matter's
 * room, read through whichever token the nearest `ApiProvider` holds.
 *
 * The checklist is the folder "From the client": one subfolder per document
 * asked for, empty until it arrives. The portal already counts and dates a
 * folder's contents, so the state of every line is the portal's, not this
 * application's. A lawyer adds a line by adding a folder; the client, on the
 * next screen, answers one by dropping a file in it.
 */
const join = (parts: (string | false | undefined)[]) =>
  parts.filter(Boolean).join(" • ");

const OpenLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    type={LinkType.page}
    href={href}
    target={LinkTarget.blank}
    color="accent"
    isHovered
    fontSize="13px"
  >
    {label}
  </Link>
);

/** A file the firm sent: what it is, who last touched it, how big. */
const DocumentLine = ({ document }: { document: Document }) => {
  const { baseUrl } = useApi();
  const href =
    document.url && baseUrl ? new URL(document.url, baseUrl).toString() : "";

  return (
    <li className={styles.matter}>
      <FileIcon fileExst={document.ext} />
      <div className={styles.matterBody}>
        <Text as="p" className={styles.matterTitle}>
          {document.title}
        </Text>
        <Text as="p" className={styles.matterMeta}>
          {join([
            document.by,
            updatedAgo(document.updated),
            formatSize(document.bytes),
          ])}
        </Text>
      </div>
      {href ? <OpenLink href={href} label="Open in ONLYOFFICE" /> : null}
    </li>
  );
};

/** One line of the checklist, told for whoever is reading it. */
const RequestLine = ({
  request,
  persona,
  send,
}: {
  request: Request;
  persona: Persona;
  /** Given, a request still needed gets a "Send it" that opens this. */
  send?: (request: Request) => ReactNode;
}) => {
  const { baseUrl } = useApi();
  const [sending, setSending] = useState(false);
  const href = baseUrl ? roomUrl(baseUrl, request.id) : "";
  const asked = updatedAgo(request.asked);
  const since = updatedAgo(request.updated);
  const canSend = Boolean(send) && !request.received;

  // One line per thing to say; a lawyer gets one per file received.
  const one = (text: string) => [{ key: "state", text }];
  let details: { key: string | number; text: string }[];
  if (!request.received) {
    details = one(
      persona === "client"
        ? "Your lawyer is waiting for this."
        : asked
          ? `Asked ${asked}. Nothing yet.`
          : "Nothing yet.",
    );
  } else if (persona === "client") {
    details = one(since ? `Sent ${since}. Thank you.` : "Sent.");
  } else if (request.documents.length) {
    details = request.documents.map((document) => ({
      key: document.id,
      text: join([
        document.title,
        formatSize(document.bytes),
        document.by && `${document.by}, ${updatedAgo(document.updated)}`,
      ]),
    }));
  } else {
    details = one(since ? `Received ${since}.` : "Received.");
  }

  return (
    <li className={styles.matter}>
      <FileIcon fileExst="folder" />
      <div className={styles.matterBody}>
        <Text as="p" className={styles.matterTitle}>
          {request.title}
        </Text>
        {details.map((line) => (
          <Text key={line.key} as="p" className={styles.matterMeta}>
            {line.text}
          </Text>
        ))}
        {canSend ? (
          <>
            <div>
              <Button
                size={ButtonSize.extraSmall}
                primary={!sending}
                label={sending ? "Not now" : "Send it"}
                onClick={() => setSending((open) => !open)}
              />
            </div>
            {sending ? send?.(request) : null}
          </>
        ) : href ? (
          <OpenLink
            href={href}
            label={
              persona === "client" && !request.received
                ? "Upload it in ONLYOFFICE"
                : "Open in ONLYOFFICE"
            }
          />
        ) : null}
      </div>
      <Text
        as="span"
        className={`${styles.badge} ${request.received ? styles.badgeOk : ""}`}
      >
        {request.received ? "Received" : "Still needed"}
      </Text>
    </li>
  );
};

/** The lawyer's one write on this screen: one more folder in the checklist. */
const AskForm = ({
  onAsk,
  busy,
}: {
  onAsk: (title: string) => void;
  busy: boolean;
}) => {
  const [title, setTitle] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = title.trim();
    if (!value) return;
    onAsk(value);
    setTitle("");
  };

  return (
    <form className={styles.askRow} onSubmit={submit}>
      <TextInput
        type={InputType.text}
        size={InputSize.base}
        scale
        value={title}
        placeholder="Ask for another document, e.g. Bank statements"
        onChange={(event) => setTitle(event.target.value)}
        isDisabled={busy}
      />
      <Button
        type="submit"
        size={ButtonSize.small}
        label="Ask for it"
        isLoading={busy}
        isDisabled={!title.trim()}
      />
    </form>
  );
};

const ActionError = ({ message }: { message: string }) =>
  message ? (
    <div className={styles.statusRow} role="alert">
      <Text as="span" className={`${styles.badge} ${styles.badgeError}`}>
        Not done
      </Text>
      <Text fontSize="13px" lineHeight="20px">
        {message}
      </Text>
    </div>
  ) : null;

/** The room itself: its facts, then the checklist and the firm's folder. */
export const MatterRoomPanel = ({
  matter,
  persona,
  sending = false,
}: {
  matter: Matter;
  persona: Persona;
  /** Lets a client answer a request from here, with the next screen's control. */
  sending?: boolean;
}) => {
  const { isBase } = useTheme();
  const { baseUrl } = useApi();
  const { state, reload, ask, setUp, receive, busy, actionError } =
    useMatterRoom(matter.id);

  const send =
    sending && persona === "client" && state.status === "ready"
      ? (request: Request) => (
          <SendDocument
            request={request}
            demo={state.demo}
            onSent={(files) => {
              receive(request.id, files);
              if (state.demo) {
                toastr.success("Sent. Your lawyer sees it right away.");
              }
            }}
          />
        )
      : undefined;

  const facts = [
    { label: "Practice", value: matter.practice },
    { label: "Stage", value: matter.stage },
    {
      label: persona === "client" ? "Your lawyer" : "Lead",
      value: matter.lead || "Not recorded",
    },
    { label: "Last change", value: updatedAgo(matter.updated) || "Unknown" },
  ];

  let body: React.ReactNode;

  if (state.status === "loading") {
    body = (
      <div className={styles.statusRow}>
        <Loader type={LoaderTypes.track} size="20px" />
        <Text fontSize="13px">Opening the room...</Text>
      </div>
    );
  } else if (state.status === "error") {
    body = (
      <div className={styles.statusRow} role="alert">
        <Text as="span" className={`${styles.badge} ${styles.badgeError}`}>
          No access
        </Text>
        <Text fontSize="13px">{state.message}</Text>
        <Button
          size={ButtonSize.extraSmall}
          label="Try again"
          onClick={reload}
        />
      </div>
    );
  } else if (state.room.layout === "plain") {
    const { folders, files } = state.room;
    body = (
      <>
        <EmptyView
          icon={isBase ? <EmptyRoomsLightSvg /> : <EmptyRoomsDarkSvg />}
          title={
            persona === "client"
              ? "Nothing to do yet"
              : "No checklist in this room yet"
          }
          description={
            persona === "client"
              ? "Your lawyer has not asked you for anything. When they do, the list appears here."
              : `Two folders make a room a matter's home: "${CLIENT_FOLDER}" for what you need from the client, "${FIRM_FOLDER}" for what you send them. ${join([plural(folders, "folder"), plural(files, "file")])} already here stay as they are.`
          }
          options={
            persona === "client"
              ? null
              : [
                  {
                    key: "set-up",
                    type: "button",
                    title: "Create the two folders",
                    primary: true,
                    isLoading: busy,
                    onClick: () => void setUp(),
                  },
                ]
          }
        />
        <ActionError message={actionError} />
      </>
    );
  } else {
    const { requests, drafts, otherFolders, otherFiles } = state.room;
    const progress = progressOf(requests);

    body = (
      <>
        <CollapsibleCard
          title={
            persona === "client"
              ? "What we need from you"
              : "Requested from the client"
          }
          description={
            progress.total
              ? `${progress.received} of ${progress.total} received`
              : "Nothing asked for yet"
          }
          defaultOpen
        >
          {progress.total ? (
            <ProgressBar
              percent={progress.percent}
              label={
                persona === "client"
                  ? "Your documents"
                  : "The client's documents"
              }
            />
          ) : null}
          {requests.length ? (
            <ul className={styles.matterList}>
              {requests.map((request) => (
                <RequestLine
                  key={request.id}
                  request={request}
                  persona={persona}
                  send={send}
                />
              ))}
            </ul>
          ) : persona === "client" ? (
            <Text as="p" fontSize="13px" lineHeight="20px">
              Your lawyer has not asked you for anything yet.
            </Text>
          ) : null}
          {persona === "lawyer" ? (
            <>
              <AskForm onAsk={(title) => void ask(title)} busy={busy} />
              <ActionError message={actionError} />
            </>
          ) : null}
        </CollapsibleCard>

        <CollapsibleCard
          title={
            persona === "client" ? "From your lawyer" : "Sent to the client"
          }
          description={
            drafts.length ? plural(drafts.length, "document") : "Nothing yet"
          }
          defaultOpen={drafts.length > 0}
        >
          {drafts.length ? (
            <ul className={styles.matterList}>
              {drafts.map((document) => (
                <DocumentLine key={document.id} document={document} />
              ))}
            </ul>
          ) : (
            <Text as="p" fontSize="13px" lineHeight="20px">
              {persona === "client"
                ? "Nothing to read yet."
                : `Put a draft in "${FIRM_FOLDER}" and the client sees it here.`}
            </Text>
          )}
        </CollapsibleCard>

        {persona === "lawyer" && (otherFolders || otherFiles) ? (
          <Text as="p" className={styles.matterMeta}>
            {`${join([otherFolders ? plural(otherFolders, "other folder") : "", otherFiles ? plural(otherFiles, "loose file") : ""])} in this room ${otherFolders + otherFiles === 1 ? "is" : "are"} outside the checklist. The client sees them in ONLYOFFICE, not here.`}
          </Text>
        ) : null}
      </>
    );
  }

  return (
    <div className={styles.stack}>
      <div className={styles.roomHeader}>
        <MatterLogo matter={matter} size="48px" />
        <div className={styles.matterBody}>
          <Text as="p" className={styles.roomTitle}>
            {matter.title}
          </Text>
          {persona === "client" && matter.stageKnown ? (
            <Text as="p" fontSize="13px" lineHeight="20px">
              {STAGE_FOR_CLIENT[matter.stage as KnownStage]}
            </Text>
          ) : null}
        </div>
        <div className={styles.headerActions}>
          <StageBadge matter={matter} />
          {baseUrl ? (
            <Button
              size={ButtonSize.extraSmall}
              label="Refresh"
              isLoading={state.status === "loading"}
              onClick={reload}
            />
          ) : null}
        </div>
      </div>

      <ColumnarInfoBar variant="page" columns={facts} />

      {body}
    </div>
  );
};

/**
 * Whose matters, and which one: the list from the previous screen becomes a
 * picker, and the room of the chosen matter is opened under the same token.
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
            : "No matters to open. Tag a room Practice: Employment and Stage: Intake in ONLYOFFICE, and it appears here."}
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
          {/* Keyed, so a different matter starts from a fresh read. */}
          <MatterRoomPanel key={matter.id} matter={matter} persona={persona} />
        </>
      )}
    </>
  );
};

const TREE = `Harper v. Northwind Logistics     room   Practice: Employment, Stage: Discovery
  From the client                 folder the checklist
    Passport                      folder received
    Employment contract           folder received
    Payslips, last 3 months       folder still needed: it is empty
  From the firm                   folder drafts and letters for the client
    Draft claim.docx              file
  Working files                   folder the firm's own, outside the cabinet`;

export const InsideAMatter = () => {
  const { baseUrl } = useApi();

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeading}>
        <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
          Inside a matter
        </Heading>
        <Text as="p" className={styles.sectionSubtitle}>
          What the firm still needs, what has arrived, and what it sent back.
          All of it is folders in the matter&apos;s room.
        </Text>
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          The lawyer&apos;s view
        </Text>
        <Text as="p" className={styles.sectionSubtitle}>
          {baseUrl
            ? "With the API key: who sent what and when, and a way to ask for more."
            : "Who sent what and when, and a way to ask for more."}
        </Text>
        <MatterView demoAs="lawyer" />
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          The client&apos;s view
        </Text>
        <Text as="p" className={styles.sectionSubtitle}>
          {baseUrl
            ? "With the client's own OAuth token: what is still owed, and what there is to read."
            : "What is still owed, and what there is to read."}
        </Text>
        <ClientSession demo={<MatterView demoAs="client" />}>
          <MatterView demoAs="client" />
        </ClientSession>
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          How a room holds a matter
        </Text>
        <Text as="p" fontSize="13px" lineHeight="20px">
          Two folders, made in ONLYOFFICE like any other. A subfolder of{" "}
          <b>{CLIENT_FOLDER}</b> is a request; it is answered the moment a file
          lands in it. A file in <b>{FIRM_FOLDER}</b> is something for the
          client to read. Everything else in the room is the firm&apos;s.
        </Text>
        <pre className={styles.code}>{TREE}</pre>
      </div>
    </div>
  );
};
