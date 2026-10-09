import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r}from"./blocks-D1qLjfJS.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{i as a,r as o}from"./react-qN2cStNd.js";import{n as s,t as c}from"./Source-CbxT880K.js";import{n as l,r as u,t as d}from"./ReadingADraft.stories-CWm2zjBN.js";var f;function p(){return(p=e((()=>{f=`import { useState } from "react";

import { Button, ButtonSize } from "../../../../components/button";
import { Loader, LoaderTypes } from "../../../../components/loader";
import { Text } from "../../../../components/text";
import { DocumentEditor } from "../../../../document-editor";
import { FileIcon } from "../../file-icon";
import type { Document } from "../matterRoom";
import styles from "../legal.module.scss";

/**
 * A document opened where the reader is, not downloaded. The kit's
 * \`DocumentEditor\` asks the portal for the document server's address and
 * for this file's editor configuration -- through \`useApi()\`, so under the
 * client's provider it asks as the client -- and mounts the editor with it.
 * \`isView\` asks for a read-only configuration; the portal decides the rest
 * from the reader's role in the room.
 *
 * With no portal there is no document server to load, so a page stands in:
 * the title, the mode, and a few lines that say what would be here.
 */
export const DocumentReader = ({
  document,
  mode,
  demo,
  onClose,
}: {
  document: Document;
  mode: "view" | "edit";
  demo: boolean;
  onClose: () => void;
}) => {
  const [status, setStatus] = useState<"loading" | "ready" | "failed">(
    demo ? "ready" : "loading",
  );
  const [problem, setProblem] = useState("");

  return (
    <div className={styles.reader}>
      <div className={styles.readerHeader}>
        <FileIcon fileExst={document.ext} />
        <div className={styles.matterBody}>
          <Text as="p" className={styles.matterTitle}>
            {document.title}
          </Text>
          <Text as="p" className={styles.matterMeta}>
            {mode === "view"
              ? "Read only. Comments are yours to add; the text is not."
              : "Editing, as the firm."}
          </Text>
        </div>
        <div className={styles.readerActions}>
          {status === "loading" ? (
            <Loader type={LoaderTypes.track} size="20px" />
          ) : null}
          <Button
            size={ButtonSize.extraSmall}
            label="Close"
            onClick={onClose}
          />
        </div>
      </div>

      {status === "failed" ? (
        <div className={styles.statusRow} role="alert">
          <Text as="span" className={\`\${styles.badge} \${styles.badgeError}\`}>
            Did not open
          </Text>
          <Text fontSize="13px" lineHeight="20px">
            {problem}
          </Text>
        </div>
      ) : null}

      {demo ? (
        <div className={styles.paper}>
          <Text as="p" className={styles.paperTitle}>
            {document.title.replace(/\\.[^.]+$/, "")}
          </Text>
          <Text as="p" className={styles.paperLine}>
            This is where the document opens, in the ONLYOFFICE editor the
            portal serves. With no portal configured there is no document server
            to load it from, so this page stands in for it.
          </Text>
          <Text as="p" className={styles.paperLine}>
            Connect a portal from the toolbar and press Read on a draft in a
            room you are a member of: the editor below is the real one, in
            read-only mode for a client and in editing mode for the firm.
          </Text>
        </div>
      ) : (
        <div className={styles.editorBox}>
          <DocumentEditor
            id={\`draft-\${document.id}\`}
            fileId={document.id}
            isView={mode === "view"}
            height="100%"
            width="100%"
            events_onAppReady={() => setStatus("ready")}
            onLoadComponentError={(code, message) => {
              setStatus("failed");
              setProblem(
                \`\${message}\${code ? \` (\${code})\` : ""}. The portal has to know this document server, and the reader has to be a member of the room.\`,
              );
            }}
          />
        </div>
      )}
    </div>
  );
};
`;try{DocumentReader.displayName=`DocumentReader`,DocumentReader.__docgenInfo={description:`A document opened where the reader is, not downloaded. The kit's
\`DocumentEditor\` asks the portal for the document server's address and
for this file's editor configuration -- through \`useApi()\`, so under the
client's provider it asks as the client -- and mounts the editor with it.
\`isView\` asks for a read-only configuration; the portal decides the rest
from the reader's role in the room.

With no portal there is no document server to load, so a page stands in:
the title, the mode, and a few lines that say what would be here.`,displayName:`DocumentReader`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/docs/samples/legal/reading-a-draft/DocumentReader.tsx`,methods:[],props:{document:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/reading-a-draft/DocumentReader.tsx`,name:`TypeLiteral`}],description:``,name:`document`,required:!0,tags:{},type:{name:`Document`}},mode:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/reading-a-draft/DocumentReader.tsx`,name:`TypeLiteral`}],description:``,name:`mode`,required:!0,tags:{},type:{name:`"view" | "edit"`}},demo:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/reading-a-draft/DocumentReader.tsx`,name:`TypeLiteral`}],description:``,name:`demo`,required:!0,tags:{},type:{name:`boolean`}},onClose:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/reading-a-draft/DocumentReader.tsx`,name:`TypeLiteral`}],description:``,name:`onClose`,required:!0,tags:{},type:{name:`() => void`}}},tags:{}}}catch{}})))()}var m;function h(){return(h=e((()=>{m=`import { useState } from "react";

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
 * \`DocumentReader\`, and the mode is the persona's.
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
    );
  }

  const { matters, persona, label } = view;
  const name = view.demo ? \`\${view.name} (demo data)\` : view.name;
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
`})))()}function g(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,ol:`ol`,p:`p`,strong:`strong`,ul:`ul`,...a(),...e.components};return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(n,{of:l}),`
`,(0,v.jsx)(t.h1,{id:`04-reading-the-firms-draft`,children:`04. Reading the firm's draft`}),`
`,(0,v.jsxs)(t.p,{children:[`The other half of the exchange. The firm puts a draft in `,(0,v.jsx)(t.code,{children:`From the firm`}),`;
the client presses `,(0,v.jsx)(t.strong,{children:`Read`}),` and it opens where they are, in the ONLYOFFICE
editor, read-only. The lawyer presses `,(0,v.jsx)(t.strong,{children:`Open`}),` on the same line and edits
it. Nothing is downloaded, nothing is attached to an email, and there is one
copy.`]}),`
`,(0,v.jsx)(r,{of:d}),`
`,(0,v.jsxs)(t.p,{children:[`With no portal a page stands in for the editor, because there is no document
server to load one from. Connect a portal, sign the client in from
`,(0,v.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-setup-who-is-signed-in--docs`,children:`Who is signed in`}),`,
and the editor is the real one, minted for that client.`]}),`
`,(0,v.jsx)(t.h2,{id:`one-component-two-calls-and-a-script`,children:`One component, two calls and a script`}),`
`,(0,v.jsxs)(t.p,{children:[(0,v.jsx)(t.code,{children:`DocumentEditor`}),` is the kit's wrapper around the ONLYOFFICE editor. Given a
file id it does three things through `,(0,v.jsx)(t.code,{children:`useApi()`}),`:`]}),`
`,(0,v.jsxs)(t.ol,{children:[`
`,(0,v.jsxs)(t.li,{children:[`asks the portal where its document server is (`,(0,v.jsx)(t.code,{children:`getDocServiceUrl`}),`);`]}),`
`,(0,v.jsxs)(t.li,{children:[`asks the portal for this file's editor configuration
(`,(0,v.jsx)(t.code,{children:`openEditFile`}),`, with `,(0,v.jsx)(t.code,{children:`view`}),` when `,(0,v.jsx)(t.code,{children:`isView`}),` is set): the document's signed
link, the editor's mode, and a token, all minted for whoever asked;`]}),`
`,(0,v.jsx)(t.li,{children:`loads the editor script from that document server and mounts it with
that configuration.`}),`
`]}),`
`,(0,v.jsxs)(t.p,{children:[`Under the client's `,(0,v.jsx)(t.code,{children:`ApiProvider`}),` all three happen as the client. So the
configuration is what the client may do in that room, and `,(0,v.jsx)(t.code,{children:`isView`}),` asks for
less than that: read, and comment. The lawyer, under the API key, gets the
same file in editing mode from the same control.`]}),`
`,(0,v.jsx)(c,{code:f,language:`tsx`}),`
`,(0,v.jsx)(t.h2,{id:`what-changed-on-the-earlier-screen`,children:`What changed on the earlier screen`}),`
`,(0,v.jsxs)(t.p,{children:[(0,v.jsx)(t.code,{children:`MatterRoomPanel`}),` took one more prop, `,(0,v.jsx)(t.code,{children:`reading`}),`. A document line in the
firm's folder now has a button beside the link to the portal, and the panel
mounts `,(0,v.jsx)(t.code,{children:`DocumentReader`}),` under the list for the one that was pressed. The
list itself, the checklist and the facts are untouched.`]}),`
`,(0,v.jsx)(t.h2,{id:`details-worth-copying`,children:`Details worth copying`}),`
`,(0,v.jsxs)(t.ul,{children:[`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:`The document server is the portal's, and the browser has to reach it.`}),`
The editor script and the document's link both point at it. A server the
portal knows but the reader's network cannot reach fails at load, which
is what `,(0,v.jsx)(t.code,{children:`onLoadComponentError`}),` reports.`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:`The reader must be a member of the room.`}),` A file the portal will not
show the client answers 403 to `,(0,v.jsx)(t.code,{children:`openEditFile`}),`, which arrives as the same
error; the checklist and the drafts come from the same room, so a client
who sees the line can open the file.`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsxs)(t.strong,{children:[`Every editor on a page needs its own `,(0,v.jsx)(t.code,{children:`id`}),`.`]}),` The editor mounts into an
element by id; two readers with the same id fight over one element. The
reader uses the file's id.`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsxs)(t.strong,{children:[`Wait for `,(0,v.jsx)(t.code,{children:`events_onAppReady`}),`.`]}),` The wrapper renders nothing until the
configuration arrives, and the editor draws its own loading state after;
the reader shows a loader until the editor says it is ready.`]}),`
`]}),`
`,(0,v.jsx)(t.h2,{id:`the-code`,children:`The code`}),`
`,(0,v.jsx)(c,{code:m,language:`tsx`})]})}function _(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,v.jsx)(t,{...e,children:(0,v.jsx)(g,{...e})}):g(e)}var v;function y(){return(y=e((()=>{v=i(),o(),t(),s(),u(),p(),h()})))()}y();export{_ as default};