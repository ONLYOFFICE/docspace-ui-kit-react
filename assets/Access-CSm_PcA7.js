import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{h as n,l as r}from"./blocks-D1qLjfJS.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{i as a,r as o}from"./react-qN2cStNd.js";import{n as s,t as c}from"./check.react-CdZcimIY.js";var l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{l=[{key:`O`,label:`Owner`,code:`EmployeeType.Owner`,flag:`isOwner`},{key:`A`,label:`Full admin`,code:`EmployeeType.Admin`,flag:`isAdmin`},{key:`RA`,label:`Room admin`,code:`EmployeeType.RoomAdmin`,flag:`isRoomAdmin`},{key:`U`,label:`User`,code:`EmployeeType.User`,flag:`isCollaborator`},{key:`G`,label:`Guest`,code:`EmployeeType.Guest`,flag:`isVisitor`}],u=[{key:`RO`,label:`Room owner`,code:`ShareAccessRights.FullAccess`},{key:`RM`,label:`Room manager`,code:`ShareAccessRights.RoomManager`},{key:`CC`,label:`Content creator`,code:`ShareAccessRights.Collaborator`},{key:`Ed`,label:`Editor`,code:`ShareAccessRights.Editing`},{key:`FF`,label:`Form filler`,code:`ShareAccessRights.FormFilling`},{key:`Rv`,label:`Reviewer`,code:`ShareAccessRights.Review`},{key:`Cm`,label:`Commentator`,code:`ShareAccessRights.Comment`},{key:`Vw`,label:`Viewer`,code:`ShareAccessRights.ReadOnly`}],d=[`O`,`A`,`RA`,`U`,`G`],f=[`O`,`A`,`RA`],p=[`O`,`A`],m=[`RO`,`RM`,`CC`,`Ed`,`FF`,`Rv`,`Cm`,`Vw`],h=[`RO`,`RM`],g=[`RO`,`RM`,`CC`],_={myDocuments:{id:`my-documents`,title:`My documents`,axis:`type`,rows:[{action:`Open the section`,allowed:[`O`,`A`,`RA`,`U`]},{action:`Create, upload, move, copy, rename, download, delete`,allowed:[`O`,`A`,`RA`,`U`]}]},rooms:{id:`rooms`,title:`Rooms`,axis:`type`,rows:[{action:`See all rooms`,allowed:p},{action:`See rooms I own`,allowed:f},{action:`Create rooms`,allowed:f},{action:`See rooms I was invited to`,allowed:d},{action:`Pin rooms`,allowed:d},{action:`View members, history, room info`,allowed:d},{action:`Edit own rooms`,allowed:f},{action:`Invite external users to a room`,allowed:d},{action:`Invite portal users and groups to a room`,allowed:[`O`,`A`,`RA`,`U`]},{action:`Set a member's role when inviting`,allowed:d},{action:`Change member and group roles`,allowed:f},{action:`Remove members and groups`,allowed:f},{action:`Archive own rooms`,allowed:f},{action:`Duplicate own room`,allowed:f},{action:`Duplicate someone else's room`,allowed:p},{action:`Change the owner of someone else's room`,allowed:p},{action:`Archive someone else's room`,allowed:p}]},archive:{id:`archive`,title:`Archive`,axis:`type`,rows:[{action:`See all archived rooms`,allowed:p},{action:`See archived rooms I own`,allowed:f},{action:`See archived rooms I was invited to`,allowed:d},{action:`View members, history, room info`,allowed:d},{action:`Duplicate own room into Rooms`,allowed:f},{action:`Duplicate someone else's room into Rooms`,allowed:p},{action:`Restore own room`,allowed:f},{action:`Restore any room`,allowed:p},{action:`Delete own room`,allowed:f},{action:`Delete any room`,allowed:p}]},accounts:{id:`accounts`,title:`Accounts`,axis:`type`,columns:f,rows:[{action:`Invite a Full admin`,allowed:[`O`]},{action:`Invite a Room admin`,allowed:p},{action:`Invite a User`,allowed:f},{action:`Promote to Full admin`,allowed:[`O`]},{action:`Promote to Room admin`,allowed:p},{action:`Promote a Guest to User`,allowed:f},{action:`Demote a Full admin (to Room admin or User)`,allowed:[`O`]},{action:`Demote a Room admin to User`,allowed:p},{action:`Demote a User to Guest`,allowed:p},{action:`Block or delete a Full admin`,allowed:[`O`]},{action:`Block or delete a Room admin, User or Guest`,allowed:p},{action:`Reassign a deleted person's data`,allowed:p},{action:`Create and edit groups, change their membership`,allowed:p},{action:`See the group list and its contents`,allowed:f},{action:`See guests invited by other people`,allowed:p},{action:`See own guests`,allowed:f}]},settings:{id:`settings`,title:`Portal settings`,axis:`type`,rows:[{action:`Open portal settings`,allowed:p},{action:`Delete the portal`,allowed:[`O`]}]},share:{id:`share`,title:`Sharing files`,axis:`type`,rows:[{action:`Share files with portal users`,allowed:[`O`,`A`,`RA`,`U`]},{action:`Share files with guests`,allowed:f},{action:`Share with guests the sharer cannot see`,allowed:p},{action:`See the user and group list while sharing`,allowed:f},{action:`Quick share for forms`,allowed:[`O`,`A`,`RA`,`U`]}]},room:{id:`room`,title:`The room itself`,axis:`role`,rows:[{action:`Edit the room`,allowed:h},{action:`Invite users, set their role on invite`,allowed:m},{action:`Change member roles`,allowed:h},{action:`Create, edit and delete room links`,allowed:h},{action:`Moderate people asking to join`,allowed:h},{action:`Remove members`,allowed:h},{action:`View members, history, room info`,allowed:m},{action:`Archive the room`,allowed:[`RO`]},{action:`Delete the room`,allowed:[`RO`]}]},roomContent:{id:`room-content`,title:`Files and folders in a room`,axis:`role`,rows:[{action:`Create, upload`,allowed:g},{action:`Edit files`,allowed:[`RO`,`RM`,`CC`,`Ed`]},{action:`Fill form fields`,allowed:[`RO`,`RM`,`CC`,`Ed`,`FF`]},{action:`Review`,allowed:[`RO`,`RM`,`CC`,`Ed`,`Rv`]},{action:`Comment`,allowed:[`RO`,`RM`,`CC`,`Ed`,`FF`,`Rv`,`Cm`]},{action:`Lock files against co-authors`,allowed:g},{action:`View version history`,allowed:[`RO`,`RM`,`CC`,`Ed`]},{action:`Manage version history`,allowed:g},{action:`Create, edit and delete file links`,allowed:h},{action:`View content and comments, copy, print, download`,allowed:m},{action:`Save docxf as oform`,allowed:g},{action:`Delete, move and copy own files`,allowed:g},{action:`Delete, move, copy, rename other people's files`,allowed:h},{action:`Copy files in from My documents`,allowed:g}]}}})))()}var y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{y=`_wrapper_jagzo_1`,b=`_table_jagzo_23`,x=`_caption_jagzo_45`,S=`_action_jagzo_54`,C=`_column_jagzo_63`,w=`_cell_jagzo_64`,T=`_toggle_jagzo_77`,E=`_check_jagzo_94`,D=`_no_jagzo_103`,O={wrapper:y,table:b,caption:x,action:S,column:C,cell:w,toggle:T,check:E,no:D}})))()}var A,j,M;function N(){return(N=e((()=>{A=t(),s(),v(),k(),j=i(),M=({name:e})=>{let t=_[e],[n,r]=(0,A.useState)(null),i=t.axis===`type`?l:u,a=`columns`in t?t.columns:i.map(e=>e.key),o=i.filter(e=>a.includes(e.key));return(0,j.jsx)(`div`,{className:O.wrapper,children:(0,j.jsxs)(`table`,{className:O.table,"data-testid":`access-${t.id}`,children:[(0,j.jsx)(`caption`,{className:O.caption,children:t.title}),(0,j.jsx)(`thead`,{children:(0,j.jsxs)(`tr`,{children:[(0,j.jsx)(`th`,{scope:`col`,className:O.action,children:`Action`}),o.map(e=>(0,j.jsx)(`th`,{scope:`col`,className:O.column,"data-focus":n===e.key?`true`:void 0,children:(0,j.jsx)(`button`,{type:`button`,className:O.toggle,"aria-pressed":n===e.key,title:e.code,onClick:()=>r(t=>t===e.key?null:e.key),children:e.label})},e.key))]})}),(0,j.jsx)(`tbody`,{children:t.rows.map(e=>(0,j.jsxs)(`tr`,{children:[(0,j.jsx)(`th`,{scope:`row`,className:O.action,children:e.action}),o.map(t=>{let r=e.allowed.includes(t.key);return(0,j.jsx)(`td`,{className:O.cell,"data-allowed":r?`true`:`false`,"data-focus":n===t.key?`true`:void 0,children:r?(0,j.jsx)(c,{className:O.check,role:`img`,"aria-label":`Yes`}):(0,j.jsx)(`span`,{className:O.no,"aria-label":`No`,children:`—`})},t.key)})]},e.action))})]})})};try{M.displayName=`AccessMatrix`,M.__docgenInfo={description:`One access table: actions down the side, user types or room roles across
the top. A header is a toggle that highlights its column, so a reader can
follow one type or role down the whole table.`,displayName:`AccessMatrix`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/docs/access/AccessMatrix.tsx`,methods:[],props:{name:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/docs/access/AccessMatrix.tsx`,name:`TypeLiteral`}],description:"Which table of `matrix.ts` to draw.",name:`name`,required:!0,tags:{},type:{name:`"settings" | "myDocuments" | "rooms" | "archive" | "accounts" | "share" | "room" | "roomContent"`}}},tags:{}}}catch{}})))()}function P(e){let t={code:`code`,em:`em`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...a(),...e.components};return(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)(r,{title:`Getting started/Types and roles`}),`
`,(0,I.jsx)(t.h1,{id:`types-and-roles`,children:`Types and roles`}),`
`,(0,I.jsx)(t.p,{children:`What a person may do in ONLYOFFICE Apps depends on two separate things. Most access bugs
come from mixing them up:`}),`
`,(0,I.jsxs)(t.ul,{children:[`
`,(0,I.jsxs)(t.li,{children:[(0,I.jsx)(t.strong,{children:`Their portal user type:`}),` what they may do on the portal at all. For example, create
rooms, manage accounts or open settings. It is set per person, portal-wide.`]}),`
`,(0,I.jsxs)(t.li,{children:[(0,I.jsx)(t.strong,{children:`Their role in a room:`}),` what they may do `,(0,I.jsx)(t.em,{children:`inside one room`}),`. The room's owner or manager
grants it, and it never goes beyond what the person's type allows.`]}),`
`]}),`
`,(0,I.jsx)(t.p,{children:`A Guest invited to a room as Editor can edit files in that room. They still cannot create a
room or open My documents. A Full admin who is not a member of a room cannot edit the room or
invite people into it: a room's contents are reached through membership, not rank.`}),`
`,(0,I.jsx)(t.p,{children:`The tables below come from the product's access-rights specification, which is the source of
truth. Click a column header to highlight that type or role down the table. Hover over a
header to see its enum value.`}),`
`,(0,I.jsx)(t.h2,{id:`the-two-vocabularies`,children:`The two vocabularies`}),`
`,(0,I.jsx)(t.h3,{id:`portal-user-types`,children:`Portal user types`}),`
`,(0,I.jsxs)(t.table,{children:[(0,I.jsx)(t.thead,{children:(0,I.jsxs)(t.tr,{children:[(0,I.jsx)(t.th,{children:`In the UI`}),(0,I.jsx)(t.th,{children:(0,I.jsx)(t.code,{children:`EmployeeType`})}),(0,I.jsx)(t.th,{children:`Flag on the user`})]})}),(0,I.jsxs)(t.tbody,{children:[(0,I.jsxs)(t.tr,{children:[(0,I.jsx)(t.td,{children:`Owner`}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`EmployeeType.Owner`})}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`isOwner`})})]}),(0,I.jsxs)(t.tr,{children:[(0,I.jsx)(t.td,{children:`Full admin`}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`EmployeeType.Admin`})}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`isAdmin`})})]}),(0,I.jsxs)(t.tr,{children:[(0,I.jsx)(t.td,{children:`Room admin`}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`EmployeeType.RoomAdmin`})}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`isRoomAdmin`})})]}),(0,I.jsxs)(t.tr,{children:[(0,I.jsx)(t.td,{children:`User`}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`EmployeeType.User`})}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`isCollaborator`})})]}),(0,I.jsxs)(t.tr,{children:[(0,I.jsx)(t.td,{children:`Guest`}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`EmployeeType.Guest`})}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`isVisitor`})})]})]})]}),`
`,(0,I.jsxs)(t.p,{children:[`Several flags can be true on one person: an owner is also an admin. To turn them into one
type, use `,(0,I.jsx)(t.code,{children:`getUserType(user)`}),` rather than reading a single flag. It checks them in the order
above and stops at the first match. It also counts someone with any `,(0,I.jsx)(t.code,{children:`listAdminModules`}),` as a
Full admin. `,(0,I.jsx)(t.code,{children:`getUserTypeTranslation(type, t)`}),` gives the UI name.`]}),`
`,(0,I.jsx)(t.h3,{id:`room-roles`,children:`Room roles`}),`
`,(0,I.jsxs)(t.table,{children:[(0,I.jsx)(t.thead,{children:(0,I.jsxs)(t.tr,{children:[(0,I.jsx)(t.th,{children:`In the UI`}),(0,I.jsx)(t.th,{children:(0,I.jsx)(t.code,{children:`ShareAccessRights`})})]})}),(0,I.jsxs)(t.tbody,{children:[(0,I.jsxs)(t.tr,{children:[(0,I.jsx)(t.td,{children:`Room owner`}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`ShareAccessRights.FullAccess`})})]}),(0,I.jsxs)(t.tr,{children:[(0,I.jsx)(t.td,{children:`Room manager`}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`ShareAccessRights.RoomManager`})})]}),(0,I.jsxs)(t.tr,{children:[(0,I.jsx)(t.td,{children:`Content creator`}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`ShareAccessRights.Collaborator`})})]}),(0,I.jsxs)(t.tr,{children:[(0,I.jsx)(t.td,{children:`Editor`}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`ShareAccessRights.Editing`})})]}),(0,I.jsxs)(t.tr,{children:[(0,I.jsx)(t.td,{children:`Form filler`}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`ShareAccessRights.FormFilling`})})]}),(0,I.jsxs)(t.tr,{children:[(0,I.jsx)(t.td,{children:`Reviewer`}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`ShareAccessRights.Review`})})]}),(0,I.jsxs)(t.tr,{children:[(0,I.jsx)(t.td,{children:`Commentator`}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`ShareAccessRights.Comment`})})]}),(0,I.jsxs)(t.tr,{children:[(0,I.jsx)(t.td,{children:`Viewer`}),(0,I.jsx)(t.td,{children:(0,I.jsx)(t.code,{children:`ShareAccessRights.ReadOnly`})})]})]})]}),`
`,(0,I.jsxs)(t.p,{children:[(0,I.jsx)(t.strong,{children:`Room owner`}),` and `,(0,I.jsx)(t.strong,{children:`Room manager`}),` are open only to Owners, Full admins and Room admins.
Every other role is open to every type, Guests included. Nobody can change their own role.`]}),`
`,(0,I.jsx)(t.h2,{id:`what-each-portal-user-type-can-do`,children:`What each portal user type can do`}),`
`,(0,I.jsx)(t.h3,{id:`my-documents`,children:`My documents`}),`
`,(0,I.jsx)(t.p,{children:`A Guest has no My documents at all, so there is nothing to create or upload there.`}),`
`,(0,I.jsx)(M,{name:`myDocuments`}),`
`,(0,I.jsx)(t.h3,{id:`rooms`,children:`Rooms`}),`
`,(0,I.jsx)(t.p,{children:`Nobody, not even the Owner, can edit someone else's room, invite people into it, change roles
in it, remove its members, or see the links of someone else's public room.`}),`
`,(0,I.jsx)(M,{name:`rooms`}),`
`,(0,I.jsx)(t.h3,{id:`archive`,children:`Archive`}),`
`,(0,I.jsx)(t.p,{children:`The Archive is read-only for everyone: no creating, editing, inviting, role changes, removals
or pinning. What is left:`}),`
`,(0,I.jsx)(M,{name:`archive`}),`
`,(0,I.jsx)(t.h3,{id:`accounts`,children:`Accounts`}),`
`,(0,I.jsx)(t.p,{children:`Users and Guests never reach this section, so they have no column. A Room admin can invite
and promote people up to User and no further: nobody grants a rank they do not hold. Guests
are never added to groups, whoever asks.`}),`
`,(0,I.jsx)(M,{name:`accounts`}),`
`,(0,I.jsx)(t.h3,{id:`portal-settings`,children:`Portal settings`}),`
`,(0,I.jsx)(M,{name:`settings`}),`
`,(0,I.jsx)(t.h3,{id:`sharing-files`,children:`Sharing files`}),`
`,(0,I.jsx)(M,{name:`share`}),`
`,(0,I.jsx)(t.h2,{id:`what-each-room-role-can-do`,children:`What each room role can do`}),`
`,(0,I.jsx)(t.h3,{id:`the-room`,children:`The room`}),`
`,(0,I.jsx)(M,{name:`room`}),`
`,(0,I.jsx)(t.h3,{id:`files-and-folders-in-a-room`,children:`Files and folders in a room`}),`
`,(0,I.jsx)(t.p,{children:`Third-party storage has no version history in the portal, whatever the role.`}),`
`,(0,I.jsx)(M,{name:`roomContent`}),`
`,(0,I.jsx)(t.h3,{id:`archived-rooms`,children:`Archived rooms`}),`
`,(0,I.jsx)(t.p,{children:`In an archived room every role can only read: members, history, room info, content and
comments, copy, print and download. Room owners, managers, content creators and editors can
also see version history. Owners, managers and content creators can copy files out into My
documents. Only the room owner can restore or delete the room.`}),`
`,(0,I.jsx)(t.h3,{id:`how-room-types-differ`,children:`How room types differ`}),`
`,(0,I.jsx)(t.p,{children:`Only the differences from the tables above:`}),`
`,(0,I.jsxs)(t.ul,{children:[`
`,(0,I.jsxs)(t.li,{children:[(0,I.jsx)(t.strong,{children:`Virtual data room.`}),` No Reviewer and no Commentator. Only the room owner and managers can
invite people and set their roles. It adds a PDF-form workflow:`,`
`,(0,I.jsxs)(t.ul,{children:[`
`,(0,I.jsx)(t.li,{children:`creating, uploading and setting up filling: owner, manager, content creator;`}),`
`,(0,I.jsx)(t.li,{children:`editing forms: the same, plus editor;`}),`
`,(0,I.jsx)(t.li,{children:`seeing forms not yet set up: owner, manager, content creator, editor, viewer;`}),`
`,(0,I.jsx)(t.li,{children:`seeing set-up forms one takes part in: all of those, plus form filler.`}),`
`]}),`
`]}),`
`,(0,I.jsxs)(t.li,{children:[(0,I.jsx)(t.strong,{children:`Form filling room.`}),` Only four roles: owner, manager, content creator, form filler.
Only the owner and managers can invite, and form fillers cannot see comments.`,`
`,(0,I.jsxs)(t.ul,{children:[`
`,(0,I.jsx)(t.li,{children:`Starting and stopping collection, creating, uploading and editing forms, and syncing
results to a spreadsheet: owner, manager, content creator.`}),`
`,(0,I.jsx)(t.li,{children:`Turning on XLSX collection and database sync: owner and manager.`}),`
`,(0,I.jsx)(t.li,{children:`The form list (running, in progress, completed): every role in the room.`}),`
`]}),`
`]}),`
`]}),`
`,(0,I.jsx)(t.h2,{id:`checking-access-in-code`,children:`Checking access in code`}),`
`,(0,I.jsxs)(t.p,{children:[(0,I.jsx)(t.strong,{children:`Ask the portal, not the matrix.`}),` The server already applies these rules to every room,
folder and file it sends. It sends a `,(0,I.jsx)(t.code,{children:`security`}),` object with one flag per action (see
`,(0,I.jsx)(t.code,{children:`TRoomSecurity`}),` and `,(0,I.jsx)(t.code,{children:`TFolderSecurity`}),` in `,(0,I.jsx)(t.code,{children:`types/`}),`). A check derived from a type or a role
by hand can drift from the server. Then the UI offers an action that ends in a 403, or hides
one the person is allowed.`]}),`
`,(0,I.jsx)(t.pre,{children:(0,I.jsx)(t.code,{className:`language-tsx`,children:`import { useApi } from "@onlyoffice/apps-ui-kit/providers/api";

const { roomsApi } = useApi();
const room = (await roomsApi.getRoomInfo({ id: roomId })).data.response;

// "May this person invite people here?" This already includes the room
// type's narrowing (virtual data rooms and form filling rooms let only
// owners and managers invite).
const canInvite = room.security?.EditAccess;
`})}),`
`,(0,I.jsxs)(t.p,{children:[`The portal user type is the right question only for something that belongs to no room. For
example, whether to offer `,(0,I.jsx)(t.strong,{children:`Create room`}),` at all:`]}),`
`,(0,I.jsx)(t.pre,{children:(0,I.jsx)(t.code,{className:`language-tsx`,children:`import { EmployeeType, getUserType } from "@onlyoffice/apps-ui-kit";

const type = getUserType(me);
const canCreateRooms =
  type === EmployeeType.Owner ||
  type === EmployeeType.Admin ||
  type === EmployeeType.RoomAdmin;
`})}),`
`,(0,I.jsxs)(t.p,{children:[`Two rules the server does not spell out in `,(0,I.jsx)(t.code,{children:`security`}),`, which an invite screen has to follow
itself:`]}),`
`,(0,I.jsxs)(t.ul,{children:[`
`,(0,I.jsxs)(t.li,{children:[(0,I.jsx)(t.strong,{children:`Only free roles for Users, Guests and groups.`}),` Room owner and Room manager count as paid
roles. When the person being invited is a User, a Guest or a group, ONLYOFFICE Apps offers
only the free roles, and in an AI room a Guest can only be a Viewer. The kit's
`,(0,I.jsx)(t.code,{children:`AccessRightSelect`}),` draws the choice; which options to pass it is up to the screen.`]}),`
`,(0,I.jsxs)(t.li,{children:[(0,I.jsx)(t.strong,{children:`No Guests in groups.`}),` `,(0,I.jsx)(t.code,{children:`PeopleSelector`}),` shows the Guests tab only with `,(0,I.jsx)(t.code,{children:`withGuests`}),`, so a
group member picker that leaves it out never offers them.`]}),`
`]}),`
`,(0,I.jsx)(t.p,{children:`When a change touches one cell, read the whole row. The same action usually appears again in
the Archive, among the room roles and for a room type, and those copies drift apart one fix
at a time.`})]})}function F(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,I.jsx)(t,{...e,children:(0,I.jsx)(P,{...e})}):P(e)}var I;function L(){return(L=e((()=>{I=i(),o(),n(),N()})))()}L();export{F as default};