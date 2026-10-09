import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r,r as i}from"./blocks-D1qLjfJS.js";import{t as a}from"./jsx-runtime-BdxMnOeJ.js";import{i as o,r as s}from"./react-qN2cStNd.js";import{n as c,r as l,t as u}from"./Files.stories-DyppjJgG.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...o(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(n,{of:c}),`
`,(0,p.jsx)(t.h1,{id:`filesselector`,children:`FilesSelector`}),`
`,(0,p.jsx)(t.p,{children:`FilesSelector is a full file-system browser selector for navigating ONLYOFFICE Apps rooms, folders, and files.`}),`
`,(0,p.jsx)(t.h2,{id:`features`,children:`Features`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Browse rooms & folders`}),` — Navigate the full file hierarchy with breadcrumb trail`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Search`}),` — Enable with `,(0,p.jsx)(t.code,{children:`withSearch`}),`, scoped to the current folder/room`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Room type filter`}),` — Restrict the root list to specific room types via `,(0,p.jsx)(t.code,{children:`roomType`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`File type filter`}),` — Filter by extension or type via `,(0,p.jsx)(t.code,{children:`filterParam`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Footer input`}),` — Optionally show a file-name input field in the footer`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Footer checkbox`}),` — Optional checkbox (e.g., "keep original") in the footer`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Creation`}),` — Show a create-room button via `,(0,p.jsx)(t.code,{children:`withCreate`}),` + `,(0,p.jsx)(t.code,{children:`createDefineRoomLabel`})]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Aside / embedded`}),` — Rendered inside an `,(0,p.jsx)(t.code,{children:`<Aside>`}),` panel by default; pass `,(0,p.jsx)(t.code,{children:`embedded`}),` to render inline`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Portal on mobile`}),` — Automatically renders in a Portal on mobile/tablet devices`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`SSR support`}),` — Pre-populate with server-fetched data via `,(0,p.jsx)(t.code,{children:`withInit`}),` + `,(0,p.jsx)(t.code,{children:`initItems`})]}),`
`]}),`
`,(0,p.jsx)(t.h3,{id:`default`,children:`Default`}),`
`,(0,p.jsxs)(t.p,{children:[`Browse rooms and folders, then click `,(0,p.jsx)(t.strong,{children:`Select`}),` to confirm. The submit button is enabled only when a folder is selected.`]}),`
`,(0,p.jsx)(r,{of:u}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`<FilesSelector
  isPanelVisible={open}
  embedded={false}
  currentFolderId={0}
  rootFolderType={FolderType.VirtualRooms}
  currentDeviceType={DeviceType.desktop}
  isRoomsOnly={false}
  isThirdParty={false}
  withSearch
  withBreadCrumbs
  withoutBackButton={false}
  withCancelButton
  withCreate={false}
  withFooterInput={false}
  withFooterCheckbox={false}
  submitButtonLabel="Select"
  cancelButtonLabel="Cancel"
  footerInputHeader=""
  currentFooterInputValue=""
  footerCheckboxLabel=""
  descriptionText=""
  disabledItems={[]}
  filesSettings={filesSettings}
  onSubmit={(id, title) => console.log(id, title)}
  onCancel={() => setOpen(false)}
  getIsDisabled={getIsDisabled}
  getFilesArchiveError={getArchiveError}
/>
`})}),`
`,(0,p.jsx)(t.h2,{id:`properties`,children:`Properties`}),`
`,(0,p.jsx)(i,{})]})}function f(e={}){let{wrapper:t}={...o(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;function m(){return(m=e((()=>{p=a(),s(),t(),l()})))()}m();export{f as default};