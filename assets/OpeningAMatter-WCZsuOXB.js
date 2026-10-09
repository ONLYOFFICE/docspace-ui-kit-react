import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r}from"./blocks-D1qLjfJS.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{i as a,r as o}from"./react-qN2cStNd.js";import{n as s,t as c}from"./Source-CbxT880K.js";import{n as l,r as u,t as d}from"./OpeningAMatter.stories-B7vF3A_g.js";var f;function p(){return(p=e((()=>{f=`import type { KnownStage } from "./matter";
import { CLIENT_FOLDER, FIRM_FOLDER } from "./matterRoom";
import type { SeedClient } from "./seed";

/**
 * Opening a matter is four writes to the portal, in an order a lawyer would
 * recognise: the room, its two tags, the folders that make it a matter's
 * home, and the client added to it. Nothing is invented here that the demo
 * seeder does not already do; this is the same calls for one matter, from a
 * form instead of a list.
 *
 * A failure stops the run and names the step, and what was made before it
 * stays on the portal: a half-made room is a room in ONLYOFFICE that a
 * lawyer can finish by hand, or that the demo-data page completes.
 */
export type MatterSpec = {
  title: string;
  practice: string;
  stage: KnownStage;
  /** One folder per line of the checklist, in this order. */
  requests: string[];
  /** Given, the client is added to the room as a content creator. */
  clientEmail?: string;
};

export type OpenStep = {
  label: string;
  status: "done" | "failed";
  detail?: string;
};

/** The seeder's writes this needs. */
export type MatterWriter = Pick<
  SeedClient,
  "createRoom" | "tagRoom" | "createFolder" | "invite"
>;

/** The practices a firm of this shape offers; a real one edits the list. */
export const PRACTICES = [
  "Employment",
  "Family",
  "Immigration",
  "Real estate",
  "Probate",
  "Corporate",
  "Personal injury",
] as const;

/** What firms ask for most; ticked ones become the checklist. */
export const REQUEST_TEMPLATES = [
  "Passport or ID",
  "Proof of address",
  "Employment contract",
  "Payslips, last 3 months",
  "Bank statements",
  "Correspondence with the other side",
] as const;

/** The demo's room colours, so a new matter looks like its neighbours. */
const COLORS = [
  "3B72A7",
  "8C5AA8",
  "C2553F",
  "6E8B3D",
  "D08A2E",
  "2E8C85",
  "555F6B",
];

export const colorFor = (title: string) => {
  let hash = 0;
  for (const char of title) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
};

/** What the form refuses to send; "" means it is fine. */
export const validate = (spec: MatterSpec) => {
  if (!spec.title.trim()) return "Give the matter a name.";
  if (!spec.practice) return "Pick a practice area.";
  const email = spec.clientEmail?.trim();
  if (email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    return "That does not look like an email address.";
  }
  return "";
};

export const openMatter = async (
  writer: MatterWriter,
  spec: MatterSpec,
  onStep?: (step: OpenStep) => void,
): Promise<{ roomId: number; steps: OpenStep[] }> => {
  const steps: OpenStep[] = [];
  const done = (label: string, detail?: string) => {
    const step: OpenStep = { label, status: "done", detail };
    steps.push(step);
    onStep?.(step);
  };
  const failed = (label: string, error: unknown) => {
    const status = (error as { response?: { status?: number } })?.response
      ?.status;
    const step: OpenStep = {
      label,
      status: "failed",
      detail: status
        ? \`The portal answered \${status}.\`
        : error instanceof Error
          ? error.message
          : "The portal did not answer.",
    };
    steps.push(step);
    onStep?.(step);
    return Object.assign(new Error(step.detail), { steps });
  };

  const title = spec.title.trim();
  const requests = spec.requests.map((r) => r.trim()).filter(Boolean);
  const email = spec.clientEmail?.trim() ?? "";

  let roomId: number;
  try {
    roomId = await writer.createRoom(title, colorFor(title));
    done("Room", title);
  } catch (error) {
    throw failed("Room", error);
  }

  const tags = [\`Practice: \${spec.practice}\`, \`Stage: \${spec.stage}\`];
  try {
    await writer.tagRoom(roomId, tags);
    done("Tags", tags.join(", "));
  } catch (error) {
    throw failed("Tags", error);
  }

  try {
    const checklist = await writer.createFolder(roomId, CLIENT_FOLDER);
    for (const request of requests) {
      await writer.createFolder(checklist, request);
    }
    done(
      "Checklist",
      requests.length
        ? \`\${CLIENT_FOLDER}: \${requests.join(", ")}\`
        : \`\${CLIENT_FOLDER}, nothing asked for yet\`,
    );
  } catch (error) {
    throw failed("Checklist", error);
  }

  try {
    await writer.createFolder(roomId, FIRM_FOLDER);
    done("Firm's folder", FIRM_FOLDER);
  } catch (error) {
    throw failed("Firm's folder", error);
  }

  if (email) {
    try {
      await writer.invite(roomId, email);
      done("Client", \`\${email}, as a content creator\`);
    } catch (error) {
      throw failed("Client", error);
    }
  }

  return { roomId, steps };
};
`})))()}var m;function h(){return(h=e((()=>{m=`import { type FormEvent, useMemo, useState } from "react";

import { Button, ButtonSize } from "../../../../components/button";
import { Checkbox } from "../../../../components/checkbox";
import {
  ComboBox,
  ComboBoxSize,
  type TOption,
} from "../../../../components/combobox";
import { EmailInput } from "../../../../components/email-input";
import { FieldContainer } from "../../../../components/field-container";
import {
  ModalDialog,
  ModalDialogType,
} from "../../../../components/modal-dialog";
import { Text } from "../../../../components/text";
import {
  InputSize,
  InputType,
  TextInput,
} from "../../../../components/text-input";
import { useApi } from "../../../../providers/api";
import { demoSeedClient } from "../demo-portal";
import { type KnownStage, STAGES } from "../matter";
import {
  type MatterSpec,
  type OpenStep,
  openMatter,
  PRACTICES,
  REQUEST_TEMPLATES,
  validate,
} from "../openMatter";
import { sdkSeedClient } from "../seed";
import styles from "../legal.module.scss";

/**
 * The lawyer's form for a new matter: a name, a practice, a stage, the
 * client's email and the checklist to start with. Submitting it is four
 * writes to the portal in a row, each reported as it lands, so a refusal
 * halfway says which step and leaves what was made where the lawyer can
 * see it.
 *
 * \`ModalDialog\` as an aside with \`withForm\`: Enter submits, the footer's
 * primary button is the form's submit, and the body scrolls on a phone.
 */
const option = (value: string): TOption => ({ key: value, label: value });

export const OpenMatterDialog = ({
  visible,
  onClose,
  onOpened,
}: {
  visible: boolean;
  onClose: () => void;
  /** Called with the new room's id once every step has landed. */
  onOpened: (roomId: number) => void;
}) => {
  const api = useApi();
  // The same words the demo-data page speaks to a portal, or to the demo.
  const writer = useMemo(
    () => (api.baseUrl ? sdkSeedClient(api) : demoSeedClient()),
    [api],
  );

  const [title, setTitle] = useState("");
  const [practice, setPractice] = useState<string>(PRACTICES[0]);
  const [stage, setStage] = useState<KnownStage>("Intake");
  const [email, setEmail] = useState("");
  const [requests, setRequests] = useState<string[]>(
    REQUEST_TEMPLATES.slice(0, 3),
  );
  const [extra, setExtra] = useState("");
  const [error, setError] = useState("");
  const [steps, setSteps] = useState<OpenStep[]>([]);
  const [busy, setBusy] = useState(false);

  const toggle = (request: string) =>
    setRequests((current) =>
      current.includes(request)
        ? current.filter((item) => item !== request)
        : [...current, request],
    );

  const addExtra = () => {
    const value = extra.trim();
    if (value && !requests.includes(value)) {
      setRequests((current) => [...current, value]);
    }
    setExtra("");
  };

  const reset = () => {
    setTitle("");
    setPractice(PRACTICES[0]);
    setStage("Intake");
    setEmail("");
    setRequests(REQUEST_TEMPLATES.slice(0, 3));
    setExtra("");
    setError("");
    setSteps([]);
  };

  const close = () => {
    if (busy) return;
    reset();
    onClose();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const spec: MatterSpec = {
      title,
      practice,
      stage,
      requests,
      clientEmail: email,
    };
    const problem = validate(spec);
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setSteps([]);
    setBusy(true);
    try {
      const { roomId } = await openMatter(writer, spec, (step) =>
        setSteps((current) => [...current, step]),
      );
      reset();
      onOpened(roomId);
    } catch {
      // The failed step is already in the log.
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalDialog
      visible={visible}
      displayType={ModalDialogType.aside}
      withBodyScroll
      withForm
      onSubmit={submit}
      onClose={close}
      isCloseable={!busy}
    >
      <ModalDialog.Header>New matter</ModalDialog.Header>
      <ModalDialog.Body>
        {/* The body lives in a portal, outside the page: scope the classes. */}
        <div className={styles.dialogBody}>
          <Text
            as="p"
            fontSize="13px"
            lineHeight="20px"
            className={styles.hint}
          >
            A room on the portal, tagged with the practice and the stage, with
            the checklist folders ready and the client added to it.
          </Text>

          <FieldContainer
            isVertical
            labelVisible
            isRequired
            labelText="Matter"
            hasError={Boolean(error) && !title.trim()}
          >
            <TextInput
              type={InputType.text}
              size={InputSize.base}
              scale
              value={title}
              placeholder="Nguyen v. Harbor Freight"
              isAutoFocussed
              isDisabled={busy}
              onChange={(event) => setTitle(event.target.value)}
            />
          </FieldContainer>

          <div className={styles.columns2}>
            <FieldContainer isVertical labelVisible labelText="Practice">
              <ComboBox
                scaled
                size={ComboBoxSize.content}
                options={PRACTICES.map(option)}
                selectedOption={option(practice)}
                onSelect={(picked) => setPractice(String(picked.key))}
                isDisabled={busy}
              />
            </FieldContainer>
            <FieldContainer isVertical labelVisible labelText="Stage">
              <ComboBox
                scaled
                size={ComboBoxSize.content}
                options={STAGES.map(option)}
                selectedOption={option(stage)}
                onSelect={(picked) => setStage(picked.key as KnownStage)}
                isDisabled={busy}
              />
            </FieldContainer>
          </div>

          <FieldContainer
            isVertical
            labelVisible
            labelText="Client's email"
            hasError={Boolean(error) && error.includes("email")}
            errorMessage={error.includes("email") ? error : undefined}
          >
            <EmailInput
              scale
              size={InputSize.base}
              value={email}
              placeholder="Optional. They are added to the room and can sign in."
              isDisabled={busy}
              onChange={(event) => setEmail(event.target.value)}
            />
          </FieldContainer>

          <FieldContainer
            isVertical
            labelVisible
            labelText="Ask the client for"
          >
            <div className={styles.checkGrid}>
              {REQUEST_TEMPLATES.map((request) => (
                <Checkbox
                  key={request}
                  label={request}
                  isChecked={requests.includes(request)}
                  isDisabled={busy}
                  onChange={() => toggle(request)}
                />
              ))}
              {requests
                .filter(
                  (request) =>
                    !(REQUEST_TEMPLATES as readonly string[]).includes(request),
                )
                .map((request) => (
                  <Checkbox
                    key={request}
                    label={request}
                    isChecked
                    isDisabled={busy}
                    onChange={() => toggle(request)}
                  />
                ))}
            </div>
            <div className={styles.askRow}>
              <TextInput
                type={InputType.text}
                size={InputSize.base}
                scale
                value={extra}
                placeholder="Something else, e.g. Medical records"
                isDisabled={busy}
                onChange={(event) => setExtra(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addExtra();
                  }
                }}
              />
              <Button
                size={ButtonSize.small}
                label="Add"
                isDisabled={busy || !extra.trim()}
                onClick={addExtra}
              />
            </div>
          </FieldContainer>

          {error && !error.includes("email") ? (
            <Text as="p" fontSize="13px" lineHeight="20px" role="alert">
              {error}
            </Text>
          ) : null}

          {steps.length ? (
            <ul className={styles.stepList}>
              {steps.map((step) => (
                <li key={step.label} className={styles.statusRow}>
                  <Text
                    as="span"
                    className={\`\${styles.badge} \${step.status === "done" ? styles.badgeOk : styles.badgeError}\`}
                  >
                    {step.status === "done"
                      ? step.label
                      : \`\${step.label} failed\`}
                  </Text>
                  <Text fontSize="13px">{step.detail}</Text>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          primary
          scale
          type="submit"
          size={ButtonSize.normal}
          label={busy ? "Opening..." : "Open the matter"}
          isLoading={busy}
        />
        <Button
          scale
          size={ButtonSize.normal}
          label="Cancel"
          isDisabled={busy}
          onClick={close}
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};
`;try{OpenMatterDialog.displayName=`OpenMatterDialog`,OpenMatterDialog.__docgenInfo={description:``,displayName:`OpenMatterDialog`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/docs/samples/legal/opening-a-matter/OpenMatterDialog.tsx`,methods:[],props:{visible:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/opening-a-matter/OpenMatterDialog.tsx`,name:`TypeLiteral`}],description:``,name:`visible`,required:!0,tags:{},type:{name:`boolean`}},onClose:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/opening-a-matter/OpenMatterDialog.tsx`,name:`TypeLiteral`}],description:``,name:`onClose`,required:!0,tags:{},type:{name:`() => void`}},onOpened:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/opening-a-matter/OpenMatterDialog.tsx`,name:`TypeLiteral`}],description:`Called with the new room's id once every step has landed.`,name:`onOpened`,required:!0,tags:{},type:{name:`(roomId: number) => void`}}},tags:{}}}catch{}})))()}var g;function _(){return(_=e((()=>{g=`import { useState } from "react";

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
        ) : (
          <>
            <Who
              name={view.demo ? \`\${view.name} (demo data)\` : view.name}
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
`})))()}function v(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...a(),...e.components};return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(n,{of:l}),`
`,(0,b.jsx)(t.h1,{id:`05-opening-a-matter`,children:`05. Opening a matter`}),`
`,(0,b.jsxs)(t.p,{children:[`The lawyer's side of the whole track in one form. A name, a practice, a
stage, the client's email and the documents to ask for; press `,(0,b.jsx)(t.strong,{children:`Open the
matter`}),` and the room exists, tagged, with its two folders and the client in
it. Everything the other screens read was written here.`]}),`
`,(0,b.jsx)(r,{of:d}),`
`,(0,b.jsx)(t.p,{children:`With no portal the matter goes into the demo portal, and the list, the
cabinet and the client's screens see it at once. Connect a portal and the
room is made on it, as the owner of the API key; give an email and that
person is added as a content creator, the role that lets them drop a file
into a request.`}),`
`,(0,b.jsx)(t.h2,{id:`four-writes-in-a-lawyers-order`,children:`Four writes, in a lawyer's order`}),`
`,(0,b.jsxs)(t.p,{children:[(0,b.jsx)(t.code,{children:`openMatter`}),` is the same calls the demo-data page makes for the whole
practice, made once, for one matter, from a form:`]}),`
`,(0,b.jsxs)(t.table,{children:[(0,b.jsx)(t.thead,{children:(0,b.jsxs)(t.tr,{children:[(0,b.jsx)(t.th,{children:`Step`}),(0,b.jsx)(t.th,{children:`Call`}),(0,b.jsx)(t.th,{children:`Why it is this call`})]})}),(0,b.jsxs)(t.tbody,{children:[(0,b.jsxs)(t.tr,{children:[(0,b.jsx)(t.td,{children:`Room`}),(0,b.jsx)(t.td,{children:(0,b.jsx)(t.code,{children:`createRoom`})}),(0,b.jsx)(t.td,{children:`a custom room named after the matter; the colour is picked from the demo's palette by name`})]}),(0,b.jsxs)(t.tr,{children:[(0,b.jsx)(t.td,{children:`Tags`}),(0,b.jsxs)(t.td,{children:[(0,b.jsx)(t.code,{children:`createRoomTag`}),`, then `,(0,b.jsx)(t.code,{children:`addRoomTags`})]}),(0,b.jsxs)(t.td,{children:[(0,b.jsx)(t.code,{children:`Practice: …`}),` and `,(0,b.jsx)(t.code,{children:`Stage: …`}),`; a tag must exist on the portal before a room can carry it`]})]}),(0,b.jsxs)(t.tr,{children:[(0,b.jsx)(t.td,{children:`Checklist`}),(0,b.jsxs)(t.td,{children:[(0,b.jsx)(t.code,{children:`createFolder`}),`, once per line`]}),(0,b.jsxs)(t.td,{children:[(0,b.jsx)(t.code,{children:`From the client`}),`, then a subfolder per ticked request; empty is what "still needed" means`]})]}),(0,b.jsxs)(t.tr,{children:[(0,b.jsx)(t.td,{children:`Firm's folder`}),(0,b.jsx)(t.td,{children:(0,b.jsx)(t.code,{children:`createFolder`})}),(0,b.jsxs)(t.td,{children:[(0,b.jsx)(t.code,{children:`From the firm`}),`, where drafts for the client go`]})]}),(0,b.jsxs)(t.tr,{children:[(0,b.jsx)(t.td,{children:`Client`}),(0,b.jsx)(t.td,{children:(0,b.jsx)(t.code,{children:`setRoomSecurity`})}),(0,b.jsx)(t.td,{children:`the email, as a content creator, the lowest role that may add a file to a folder`})]})]})]}),`
`,(0,b.jsxs)(t.p,{children:[`Each step is reported as it lands, and a refusal stops the run and names
the step. What was made before it stays: a half-made room is a room in
ONLYOFFICE that a lawyer finishes by hand, or that
`,(0,b.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-setup-demo-data-on-your-portal--docs`,children:`Demo data on your portal`}),`
completes on its next press.`]}),`
`,(0,b.jsx)(c,{code:f,language:`tsx`}),`
`,(0,b.jsx)(t.h2,{id:`the-form-and-why-these-components`,children:`The form, and why these components`}),`
`,(0,b.jsxs)(t.ul,{children:[`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsxs)(t.strong,{children:[(0,b.jsx)(t.code,{children:`ModalDialog`}),` as an aside`]}),`, with `,(0,b.jsx)(t.code,{children:`withForm`}),`: the body is a form, Enter
submits, the footer's primary button is `,(0,b.jsx)(t.code,{children:`type="submit"`}),`, and `,(0,b.jsx)(t.code,{children:`withBodyScroll`}),`
keeps a long form usable on a phone. `,(0,b.jsx)(t.code,{children:`isCloseable`}),` is off while the writes
run, so a click on the backdrop cannot lose a half-made room out of sight.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.strong,{children:(0,b.jsx)(t.code,{children:`FieldContainer`})}),` around every input: the label, the required mark and
the error line in the kit's own spacing. The email field shows its own
error; the rest of the form's errors are one sentence under the fields.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.strong,{children:(0,b.jsx)(t.code,{children:`ComboBox`})}),` for practice and stage. Both are closed lists the firm
edits in one constant; a free text field would give three spellings of
"Real estate" and three matters that never filter together.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.strong,{children:(0,b.jsx)(t.code,{children:`Checkbox`})}),` per request template, and a text field to add one the
template does not have. Ticked lines become folders, in this order.`]}),`
`,(0,b.jsxs)(t.li,{children:[(0,b.jsx)(t.strong,{children:(0,b.jsx)(t.code,{children:`EmailInput`})}),` for the client, because the portal invites by email and
refuses a malformed one after the room is already made; catching it here
is cheaper.`]}),`
`,(0,b.jsxs)(t.li,{children:[`Not `,(0,b.jsx)(t.code,{children:`PeopleSelector`}),`: it browses people already on the portal, and a new
client is usually not one yet. The email covers both cases, since the
portal resolves an existing account by its address.`]}),`
`]}),`
`,(0,b.jsx)(c,{code:m,language:`tsx`}),`
`,(0,b.jsx)(t.h2,{id:`the-code`,children:`The code`}),`
`,(0,b.jsx)(c,{code:g,language:`tsx`})]})}function y(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,b.jsx)(t,{...e,children:(0,b.jsx)(v,{...e})}):v(e)}var b;function x(){return(x=e((()=>{b=i(),o(),t(),s(),u(),p(),h(),_()})))()}x();export{y as default};