import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n}from"./blocks-D1qLjfJS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{i,r as a}from"./react-qN2cStNd.js";import{n as o,t as s}from"./legal.module-CBBl59f6.js";var c;function l(){return(l=e((()=>{c=new URL(`cabinet-DmLrWSXb.gif`,import.meta.url).href})))()}function u(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...i(),...e.components};return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(n,{title:`Samples/Legal practice/Overview`}),`
`,(0,f.jsx)(t.h1,{id:`a-client-cabinet-for-a-law-firm`,children:`A client cabinet for a law firm`}),`
`,(0,f.jsx)(t.p,{children:`A firm and its client exchange documents by email. Attachments go missing, a
draft exists in three versions, the client does not know what they still owe,
and the lawyer does not know what has already come in. Every matter starts
with "please send us..." and every week has "did you get...?".`}),`
`,(0,f.jsx)(t.p,{children:`These samples build the cabinet that ends that, on an ONLYOFFICE Apps portal
and nothing else: no server of its own, no database, no second copy of
anyone's documents. A matter is a room. What the firm needs from the client is
a set of folders. The client signs in as themselves, drops files where they
are asked for, and reads the firm's drafts in the editor without downloading
them.`}),`
`,(0,f.jsx)(`img`,{className:o.demoGif,src:c,alt:`The cabinet, walked through: the lawyer's list of matters, a matter opened to its checklist, the client sending a document and reading a draft, and a new matter opened from the form`}),`
`,(0,f.jsxs)(t.p,{children:[`Half a minute of the cabinet on demo data: the lawyer's list, a matter and its
checklist, the client sending a document and reading a draft, and a new matter
opened from the form. Every screen in it is one of the samples below, and the
whole of it is
`,(0,f.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-the-cabinet--docs`,children:`The cabinet`}),`.`]}),`
`,(0,f.jsx)(t.h2,{id:`the-model`,children:`The model`}),`
`,(0,f.jsxs)(t.table,{children:[(0,f.jsx)(t.thead,{children:(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.th,{children:`On the portal`}),(0,f.jsx)(t.th,{children:`In the cabinet`})]})}),(0,f.jsxs)(t.tbody,{children:[(0,f.jsxs)(t.tr,{children:[(0,f.jsxs)(t.td,{children:[`a room with the tag `,(0,f.jsx)(t.code,{children:`Practice: Employment`})]}),(0,f.jsx)(t.td,{children:`a matter`})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsxs)(t.td,{children:[`its tag `,(0,f.jsx)(t.code,{children:`Stage: Discovery`})]}),(0,f.jsx)(t.td,{children:`where it stands: Intake, Discovery, Negotiation, Hearing, Closed`})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsxs)(t.td,{children:[`the folder `,(0,f.jsx)(t.code,{children:`From the client`})]}),(0,f.jsx)(t.td,{children:`the checklist`})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsxs)(t.td,{children:[`its subfolder `,(0,f.jsx)(t.code,{children:`Passport`}),`, empty`]}),(0,f.jsx)(t.td,{children:`still needed`})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsxs)(t.td,{children:[`its subfolder `,(0,f.jsx)(t.code,{children:`Employment contract`}),`, with a file`]}),(0,f.jsx)(t.td,{children:`received, on the day the file was uploaded`})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsxs)(t.td,{children:[`the folder `,(0,f.jsx)(t.code,{children:`From the firm`})]}),(0,f.jsx)(t.td,{children:`drafts and letters for the client`})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:`the client, invited to the room as a guest`}),(0,f.jsx)(t.td,{children:`who sees this matter and nothing else`})]})]})]}),`
`,(0,f.jsx)(t.p,{children:`Everything a screen shows is read from that, and everything a screen changes
is written back as a room, a folder, a tag or a file. A lawyer can do all of
it from the portal's own interface too, and the cabinet will agree, because
there is nothing else to be out of step with.`}),`
`,(0,f.jsx)(t.h2,{id:`the-screens`,children:`The screens`}),`
`,(0,f.jsxs)(t.p,{children:[(0,f.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-the-cabinet--docs`,children:`The cabinet`}),` is the
whole application in one story: the sidebar, the list, a matter opened from
it, as the lawyer or as the client. The screens below are its parts, taken out
one at a time. Each answers one question, and its page says which components
carry the answer and why those. Every screen works with no portal, on demo
data in the shape the portal answers with.`]}),`
`,(0,f.jsxs)(t.table,{children:[(0,f.jsx)(t.thead,{children:(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.th,{children:`Screen`}),(0,f.jsx)(t.th,{children:`The question`}),(0,f.jsx)(t.th,{children:`What carries it`})]})}),(0,f.jsxs)(t.tbody,{children:[(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:(0,f.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-screens-01-my-matters--docs`,children:`01. My matters`})}),(0,f.jsx)(t.td,{children:`What is going on with my matters?`}),(0,f.jsxs)(t.td,{children:[(0,f.jsx)(t.code,{children:`RoomIcon`}),`, `,(0,f.jsx)(t.code,{children:`Tabs`}),`, `,(0,f.jsx)(t.code,{children:`SearchInput`}),`, `,(0,f.jsx)(t.code,{children:`Badge`}),`, `,(0,f.jsx)(t.code,{children:`Tag`}),`, `,(0,f.jsx)(t.code,{children:`Link`})]})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:(0,f.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-screens-02-inside-a-matter--docs`,children:`02. Inside a matter`})}),(0,f.jsx)(t.td,{children:`What does the firm still need from me, and what has arrived?`}),(0,f.jsxs)(t.td,{children:[(0,f.jsx)(t.code,{children:`ProgressBar`}),`, `,(0,f.jsx)(t.code,{children:`CollapsibleCard`}),`, `,(0,f.jsx)(t.code,{children:`ColumnarInfoBar`}),`, `,(0,f.jsx)(t.code,{children:`ComboBox`}),`, `,(0,f.jsx)(t.code,{children:`EmptyView`}),`, `,(0,f.jsx)(t.code,{children:`TextInput`})]})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:(0,f.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-screens-03-sending-a-document--docs`,children:`03. Sending a document`})}),(0,f.jsx)(t.td,{children:`How does the client hand over a file?`}),(0,f.jsxs)(t.td,{children:[(0,f.jsx)(t.code,{children:`Uploader`}),`, `,(0,f.jsx)(t.code,{children:`Dropzone`}),`, `,(0,f.jsx)(t.code,{children:`Toast`}),`, `,(0,f.jsx)(t.code,{children:`Button`})]})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:(0,f.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-screens-04-reading-the-firm-s-draft--docs`,children:`04. Reading the firm's draft`})}),(0,f.jsx)(t.td,{children:`How does the client read a draft without downloading it?`}),(0,f.jsxs)(t.td,{children:[(0,f.jsx)(t.code,{children:`DocumentEditor`}),`, `,(0,f.jsx)(t.code,{children:`Button`}),`, `,(0,f.jsx)(t.code,{children:`Loader`})]})]}),(0,f.jsxs)(t.tr,{children:[(0,f.jsx)(t.td,{children:(0,f.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-screens-05-opening-a-matter--docs`,children:`05. Opening a matter`})}),(0,f.jsx)(t.td,{children:`How does a lawyer set all of this up in one go?`}),(0,f.jsxs)(t.td,{children:[(0,f.jsx)(t.code,{children:`ModalDialog`}),`, `,(0,f.jsx)(t.code,{children:`FieldContainer`}),`, `,(0,f.jsx)(t.code,{children:`ComboBox`}),`, `,(0,f.jsx)(t.code,{children:`Checkbox`}),`, `,(0,f.jsx)(t.code,{children:`EmailInput`}),`, `,(0,f.jsx)(t.code,{children:`Button`})]})]})]})]}),`
`,(0,f.jsx)(t.h2,{id:`two-readers-one-code`,children:`Two readers, one code`}),`
`,(0,f.jsxs)(t.p,{children:[`A lawyer works under the firm's `,(0,f.jsx)(t.strong,{children:`API key`}),`, and the application acts for the
firm. A client signs in with `,(0,f.jsx)(t.strong,{children:`OAuth`}),` and gets a token that is theirs, so the
portal itself decides which rooms they see. The same components and the same
hooks serve both. What differs is the token in the nearest `,(0,f.jsx)(t.code,{children:`ApiProvider`}),` and
the wording, and
`,(0,f.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-setup-who-is-signed-in--docs`,children:`Who is signed in`}),`
is where that is decided.`]}),`
`,(0,f.jsx)(t.h2,{id:`running-it-on-your-portal`,children:`Running it on your portal`}),`
`,(0,f.jsx)(t.p,{children:`Two setup pages, once:`}),`
`,(0,f.jsxs)(t.ul,{children:[`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-setup-connect-to-a-portal--docs`,children:`Connect to a portal`}),`:
the `,(0,f.jsx)(t.strong,{children:`API`}),` control in the toolbar takes a portal URL and an API key and
keeps them in this browser.`]}),`
`,(0,f.jsxs)(t.li,{children:[(0,f.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-setup-who-is-signed-in--docs`,children:`Who is signed in`}),`:
registers the OAuth app a client signs in with, one button while
`,(0,f.jsx)(t.code,{children:`pnpm storybook`}),` is running.`]}),`
`]}),`
`,(0,f.jsxs)(t.p,{children:[`Then give any room the tags `,(0,f.jsx)(t.code,{children:`Practice: Employment`}),` and `,(0,f.jsx)(t.code,{children:`Stage: Intake`}),`, and it
is a matter. Or press the button on
`,(0,f.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-setup-demo-data-on-your-portal--docs`,children:`Demo data on your portal`}),`
and the whole demo practice is created on your portal, rooms, folders and
files, ready for every screen.`]})]})}function d(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,f.jsx)(t,{...e,children:(0,f.jsx)(u,{...e})}):u(e)}var f;function p(){return(p=e((()=>{f=r(),a(),t(),l(),s()})))()}p();export{d as default};