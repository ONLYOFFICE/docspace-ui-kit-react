import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r}from"./blocks-D1qLjfJS.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{i as a,r as o}from"./react-qN2cStNd.js";import{n as s,t as c}from"./Source-CbxT880K.js";import{n as l,r as u,t as d}from"./SendingADocument.stories-DcO1_4M5.js";var f;function p(){return(p=e((()=>{f=`import Dropzone from "../../../../components/dropzone";
import { toastr } from "../../../../components/toast";
import { useApi } from "../../../../providers/api";
import { Uploader } from "../../../../uploader";
import { roomUrl } from "../matter";
import type { Request } from "../matterRoom";
import styles from "../legal.module.scss";

/**
 * How a client answers a request: a file dropped straight into the request's
 * folder on the portal. The kit's \`Uploader\` does the whole thing -- a
 * chunked upload session, the chunks in parallel, the finalise -- against
 * whatever token the nearest \`ApiProvider\` holds, which here is the client's.
 * The folder is the request, so \`targetId\` is all it needs to know.
 *
 * With no portal there is no session to open, so the \`Dropzone\` the uploader
 * is built on takes the file and hands it to \`onSent\`, which puts it where
 * the portal would have.
 */
const ACCEPT = ".pdf,.jpg,.jpeg,.png,.docx,.xlsx,.zip";
const SHORT = "PDF, JPG, PNG, DOCX";
const FULL = "PDF, JPG, JPEG, PNG, DOCX, XLSX, ZIP";

export const SendDocument = ({
  request,
  demo,
  onSent,
}: {
  request: Request;
  demo: boolean;
  /** Called once the files are in the folder; in demo, with the files. */
  onSent: (files: File[]) => void;
}) => {
  const { baseUrl } = useApi();

  return (
    <div className={styles.sendBox}>
      {demo ? (
        <Dropzone
          accept={ACCEPT}
          isLoading={false}
          isMultipleUpload
          linkMainText="Choose a file"
          linkSecondaryText="or drop it here"
          exstsText={SHORT}
          fullExstsText={FULL}
          formatsPlusBadgeValue={3}
          onDrop={(files) => onSent(files)}
          onDropRejected={() =>
            toastr.error("That kind of file is not accepted.")
          }
        />
      ) : (
        <Uploader
          targetId={request.id}
          accept={ACCEPT}
          shortText={SHORT}
          fullText={FULL}
          badgeValue={3}
          linkMainText="Choose a file"
          secondaryText="or drop it here"
          isMultipleUpload
          maxPerUploadSize="25MB"
          onUploadSuccess={() => onSent([])}
          onUploadError={({ error }) => toastr.error(error)}
          getFolderUrl={(folderId) => roomUrl(baseUrl, Number(folderId))}
        />
      )}
    </div>
  );
};
`;try{SendDocument.displayName=`SendDocument`,SendDocument.__docgenInfo={description:``,displayName:`SendDocument`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/docs/samples/legal/sending-a-document/SendDocument.tsx`,methods:[],props:{request:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/sending-a-document/SendDocument.tsx`,name:`TypeLiteral`}],description:``,name:`request`,required:!0,tags:{},type:{name:`Request`}},demo:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/sending-a-document/SendDocument.tsx`,name:`TypeLiteral`}],description:``,name:`demo`,required:!0,tags:{},type:{name:`boolean`}},onSent:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/samples/legal/sending-a-document/SendDocument.tsx`,name:`TypeLiteral`}],description:`Called once the files are in the folder; in demo, with the files.`,name:`onSent`,required:!0,tags:{},type:{name:`(files: File[]) => void`}}},tags:{}}}catch{}})))()}var m;function h(){return(h=e((()=>{m=`import { useState } from "react";

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
 * \`MatterRoomPanel\` with \`sending\`, which puts a "Send it" on every request
 * still needed and opens \`SendDocument\` under it.
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
`})))()}function g(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,strong:`strong`,ul:`ul`,...a(),...e.components};return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(n,{of:l}),`
`,(0,v.jsx)(t.h1,{id:`03-sending-a-document`,children:`03. Sending a document`}),`
`,(0,v.jsxs)(t.p,{children:[`The client's one job: hand over what the firm asked for. Press `,(0,v.jsx)(t.strong,{children:`Send it`}),` on
a request still needed, drop a file, and the line turns green, because a
request is a folder and "received" means the folder is not empty.`]}),`
`,(0,v.jsx)(r,{of:d}),`
`,(0,v.jsxs)(t.p,{children:[`With no portal the drop goes into the demo rooms and the lawyer's view below
shows it arrive. Connect a portal and sign the client in from
`,(0,v.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-setup-who-is-signed-in--docs`,children:`Who is signed in`}),`,
and the file goes up to the request's folder under the client's own token;
press `,(0,v.jsx)(t.strong,{children:`Refresh`}),` on the lawyer's side to see it.`]}),`
`,(0,v.jsx)(t.h2,{id:`one-component-does-the-upload`,children:`One component does the upload`}),`
`,(0,v.jsxs)(t.p,{children:[(0,v.jsx)(t.code,{children:`Uploader`}),` is the kit's upload, the same one the portal runs: it opens an
upload session for the file in the target folder, sends the chunks several
at a time, and finalises the session into a file. It talks to the portal
through `,(0,v.jsx)(t.code,{children:`useApi()`}),`, so under the client's `,(0,v.jsx)(t.code,{children:`ApiProvider`}),` it uploads as the
client. The screen tells it one thing, `,(0,v.jsx)(t.code,{children:`targetId`}),`, which is the request's
folder id, and asks for one thing back, `,(0,v.jsx)(t.code,{children:`onUploadSuccess`}),`, on which the
checklist is read again.`]}),`
`,(0,v.jsx)(c,{code:f,language:`tsx`}),`
`,(0,v.jsxs)(t.p,{children:[`With no portal there is no session to open, so the same control renders
`,(0,v.jsx)(t.code,{children:`Dropzone`}),`, the surface `,(0,v.jsx)(t.code,{children:`Uploader`}),` is built on, and hands the dropped files
to the screen, which puts them where the portal would have. Same look, same
`,(0,v.jsx)(t.code,{children:`accept`}),` list, same texts; only the destination differs.`]}),`
`,(0,v.jsx)(t.h2,{id:`what-changed-on-the-previous-screen`,children:`What changed on the previous screen`}),`
`,(0,v.jsxs)(t.p,{children:[`Nothing new was drawn. `,(0,v.jsx)(t.code,{children:`MatterRoomPanel`}),` took one prop, `,(0,v.jsx)(t.code,{children:`sending`}),`, and a
request still needed now offers `,(0,v.jsx)(t.strong,{children:`Send it`}),` instead of a link to the portal.
The panel's hook gained `,(0,v.jsx)(t.code,{children:`receive`}),`, which re-reads the room after an upload,
and in demo mode first records the files. Everything the lawyer sees, the
progress bar and the badges, comes from the folder as before.`]}),`
`,(0,v.jsx)(t.h2,{id:`details-worth-copying`,children:`Details worth copying`}),`
`,(0,v.jsxs)(t.ul,{children:[`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:`The client needs to be a content creator in the room.`}),` A guest added as
an editor or a viewer can read the folder and not add to it, and the
portal answers 403 to the session. The demo-data page adds the client with
that role; a firm doing it by hand picks the same one.`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsxs)(t.strong,{children:[(0,v.jsx)(t.code,{children:`accept`}),` is the kit's dropzone form`]}),`: extensions with the dot, comma
separated. The text next to it is yours, and `,(0,v.jsx)(t.code,{children:`badgeValue`}),` is the "+N"
after the short list.`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsx)(t.strong,{children:`A finished upload is a toast`}),`, raised by `,(0,v.jsx)(t.code,{children:`Uploader`}),` itself, with a link
to the folder when `,(0,v.jsx)(t.code,{children:`getFolderUrl`}),` is given. `,(0,v.jsx)(t.code,{children:`Toast`}),` has to be mounted once
on the page for it to show; the cabinet mounts it in its frame.`]}),`
`,(0,v.jsxs)(t.li,{children:[(0,v.jsxs)(t.strong,{children:[(0,v.jsx)(t.code,{children:`onUploadSuccess`}),` is the moment to re-read`]}),`, not to update state by
hand: the portal has the file, the folder's `,(0,v.jsx)(t.code,{children:`filesCount`}),` has moved, and the
screen already knows how to read that.`]}),`
`]}),`
`,(0,v.jsx)(t.h2,{id:`the-code`,children:`The code`}),`
`,(0,v.jsx)(c,{code:m,language:`tsx`})]})}function _(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,v.jsx)(t,{...e,children:(0,v.jsx)(g,{...e})}):g(e)}var v;function y(){return(y=e((()=>{v=i(),o(),t(),s(),u(),p(),h()})))()}y();export{_ as default};