import{n as e,r as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./folder-type-BCc4VXh0.js";import{i as a,n as o,r as s,t as c}from"./Files-DpdTk_Fb.js";import{n as l,t as u}from"./filter-type-BC8jiSGt.js";import{n as d,t as f}from"./room-type-DlbVUADa.js";import{n as p,t as m}from"./Toastr-x__mex7v.js";import{n as h,t as g}from"./Toast-6E8r1NpK.js";import{S as _,n as v}from"./enums-DzcBu485.js";import{o as y,r as b}from"./PortalGate-ByWqEVNV.js";var x=t({AsidePanel:()=>M,Default:()=>D,RoomsOnly:()=>O,WithFileTypeFilter:()=>A,WithFooterInput:()=>k,WithHeader:()=>N,WithRoomCreation:()=>j,__namedExportsOrder:()=>P,default:()=>C}),S,C,w,T,E,D,O,k,A,j,M,N,P;function F(){return(F=e((()=>{r(),d(),l(),a(),h(),m(),_(),o(),b(),S=n(),C={title:`Components/Selectors/FilesSelector`,decorators:[y(`Files selector`)],tags:[`!autodocs`],argTypes:{isPanelVisible:{control:`boolean`,description:`Controls visibility of the Aside panel (non-embedded mode)`,table:{defaultValue:{summary:`true`}}},embedded:{control:`boolean`,description:`Render inline without the Aside/Backdrop wrapper — useful for embedding inside dialogs`,table:{defaultValue:{summary:`false`}}},currentDeviceType:{control:`select`,options:[v.desktop,v.tablet,v.mobile],description:`Current device type — affects portal rendering on mobile/tablet`,table:{defaultValue:{summary:`DeviceType.desktop`}}},currentFolderId:{control:`text`,description:`ID of the initially opened folder (0 = rooms root)`,table:{defaultValue:{summary:`0`}}},rootFolderType:{control:`select`,options:[i.VirtualRooms,i.USER,i.RoomTemplates,i.AiAgents],description:`Root folder context type`},isRoomsOnly:{control:`boolean`,description:`Restrict navigation to rooms level — do not allow descending into folders`,table:{defaultValue:{summary:`false`}}},isThirdParty:{control:`boolean`,description:`Whether navigating a third-party storage provider`,table:{defaultValue:{summary:`false`}}},roomType:{control:`select`,options:[void 0,f.CustomRoom,f.EditingRoom,f.PublicRoom,f.VirtualDataRoom],description:`Filter the root rooms list by type`},isUserOnly:{control:`boolean`,description:`Show only the current user's personal folder tree`,table:{defaultValue:{summary:`false`}}},openRoot:{control:`boolean`,description:`Open the selector at the root tree view instead of a specific folder`,table:{defaultValue:{summary:`false`}}},withHeader:{control:`boolean`,description:`Show the header bar with a label and close button`,table:{defaultValue:{summary:`false`}}},withSearch:{control:`boolean`,description:`Show a search input (hidden at root level)`,table:{defaultValue:{summary:`true`}}},withBreadCrumbs:{control:`boolean`,description:`Show the breadcrumb navigation trail`,table:{defaultValue:{summary:`true`}}},withoutBackButton:{control:`boolean`,description:`Hide the back button in the breadcrumb bar`,table:{defaultValue:{summary:`false`}}},withCancelButton:{control:`boolean`,description:`Show a cancel button in the footer`,table:{defaultValue:{summary:`true`}}},cancelButtonLabel:{control:`text`,description:`Label for the cancel button`},withFooterInput:{control:`boolean`,description:`Show a text input in the footer (e.g., for file/folder name)`,table:{defaultValue:{summary:`false`}}},footerInputHeader:{control:`text`,description:`Header label for the footer input`},currentFooterInputValue:{control:`text`,description:`Default value pre-filled in the footer input`},withFooterCheckbox:{control:`boolean`,description:`Show a checkbox in the footer`,table:{defaultValue:{summary:`false`}}},footerCheckboxLabel:{control:`text`,description:`Label for the footer checkbox`},descriptionText:{control:`text`,description:`Description text shown below the selector list`},submitButtonLabel:{control:`text`,description:`Label for the submit / confirm button`},withCreate:{control:`boolean`,description:`Show a create-room button at the top of the rooms list`,table:{defaultValue:{summary:`false`}}},createDefineRoomLabel:{control:`text`,description:`Label for the create-room button (requires withCreate)`},createDefineRoomType:{control:`select`,options:[void 0,f.CustomRoom,f.EditingRoom,f.PublicRoom,f.VirtualDataRoom],description:`Room type to pre-select on create (requires withCreate)`},disabledItems:{control:`object`,description:`IDs of folders that are disabled as selection targets`},filterParam:{control:`select`,options:[void 0,`DOCX`,`PDF`,`PDFForm`,`IMG`,`XLSX`,`PPTX`,`ALL`,u.DocumentsOnly,u.SpreadsheetsOnly,u.PresentationsOnly,u.ImagesOnly,u.MediaOnly,u.FoldersOnly],description:`File type filter — restricts the items shown inside folders`},applyFilterOption:{control:`select`,options:[void 0,s.Files,s.All],description:`Whether filter applies to files only or all items`},disableBySecurity:{control:`text`,description:`Security key — items without this security permission are disabled`},withPadding:{control:`boolean`,description:`Add padding inside the selector body`,table:{defaultValue:{summary:`false`}}},checkCreating:{control:`boolean`,description:`Validate folder write access by creating and deleting a test file on folder open`,table:{defaultValue:{summary:`false`}}}}},w=(e,t,n,r,i,a,o,s)=>!!(e||t||s||i||!n||r===`rooms`),T=e=>`"${e}" is in the archive and cannot be used as a destination.`,E=e=>(0,S.jsxs)(`div`,{style:{width:`700px`,height:`600px`,border:`4px dashed #d0d5dd`,position:`relative`,overflow:`hidden`},children:[(0,S.jsx)(g,{}),(0,S.jsx)(c,{...e,getIsDisabled:w,getFilesArchiveError:T,onSubmit:(e,t,n,r,i,a)=>{p.success(`Saved to "${t}"${i?` as "${i}"`:``}${a?` (checked)`:``}`)},onCancel:()=>{p.info(`Cancelled`)}})]}),D={render:e=>(0,S.jsx)(E,{...e}),args:{isPanelVisible:!0,embedded:!0,currentDeviceType:v.desktop,currentFolderId:0,rootFolderType:i.VirtualRooms,isRoomsOnly:!1,isThirdParty:!1,withSearch:!0,withBreadCrumbs:!0,withoutBackButton:!1,withCancelButton:!0,cancelButtonLabel:`Cancel`,withCreate:!1,withFooterInput:!1,withFooterCheckbox:!1,submitButtonLabel:`Select`,footerInputHeader:``,currentFooterInputValue:``,footerCheckboxLabel:``,descriptionText:``,disabledItems:[]}},O={render:e=>(0,S.jsx)(E,{...e}),args:{isPanelVisible:!0,embedded:!0,currentDeviceType:v.desktop,currentFolderId:0,rootFolderType:i.VirtualRooms,isRoomsOnly:!0,isThirdParty:!1,withSearch:!0,withBreadCrumbs:!0,withoutBackButton:!1,withCancelButton:!0,cancelButtonLabel:`Cancel`,withCreate:!1,withFooterInput:!1,withFooterCheckbox:!1,submitButtonLabel:`Move here`,footerInputHeader:``,currentFooterInputValue:``,footerCheckboxLabel:``,descriptionText:``,disabledItems:[]}},k={render:e=>(0,S.jsx)(E,{...e}),args:{isPanelVisible:!0,embedded:!0,currentDeviceType:v.desktop,currentFolderId:0,rootFolderType:i.VirtualRooms,isRoomsOnly:!1,isThirdParty:!1,withSearch:!0,withBreadCrumbs:!0,withoutBackButton:!1,withCancelButton:!0,cancelButtonLabel:`Cancel`,withCreate:!1,withFooterInput:!0,footerInputHeader:`File name`,currentFooterInputValue:`My Document`,withFooterCheckbox:!1,submitButtonLabel:`Save`,footerCheckboxLabel:``,descriptionText:``,disabledItems:[]}},A={render:e=>(0,S.jsx)(E,{...e}),args:{isPanelVisible:!0,embedded:!0,currentDeviceType:v.desktop,currentFolderId:0,rootFolderType:i.VirtualRooms,isRoomsOnly:!1,isThirdParty:!1,withSearch:!0,withBreadCrumbs:!0,withoutBackButton:!1,withCancelButton:!0,cancelButtonLabel:`Cancel`,withCreate:!1,withFooterInput:!1,withFooterCheckbox:!1,submitButtonLabel:`Select file`,footerInputHeader:``,currentFooterInputValue:``,footerCheckboxLabel:``,descriptionText:`Select a PDF file`,disabledItems:[],filterParam:`PDF`,applyFilterOption:s.Files}},j={render:e=>(0,S.jsx)(E,{...e}),args:{isPanelVisible:!0,embedded:!0,currentDeviceType:v.desktop,currentFolderId:0,rootFolderType:i.VirtualRooms,isRoomsOnly:!1,isThirdParty:!1,withSearch:!0,withBreadCrumbs:!0,withoutBackButton:!1,withCancelButton:!0,cancelButtonLabel:`Cancel`,withCreate:!0,createDefineRoomLabel:`Create new room`,createDefineRoomType:f.CustomRoom,withFooterInput:!1,withFooterCheckbox:!1,submitButtonLabel:`Select`,footerInputHeader:``,currentFooterInputValue:``,footerCheckboxLabel:``,descriptionText:``,disabledItems:[]}},M={render:e=>(0,S.jsxs)(`div`,{style:{width:`700px`,height:`600px`,border:`4px dashed #d0d5dd`,position:`relative`},children:[(0,S.jsx)(g,{}),(0,S.jsx)(c,{...e,getIsDisabled:w,getFilesArchiveError:T,onSubmit:(e,t)=>{p.success(`Saved to "${t}"`)},onCancel:()=>{p.info(`Cancelled`)}})]}),args:{isPanelVisible:!0,embedded:!1,currentDeviceType:v.desktop,currentFolderId:0,rootFolderType:i.VirtualRooms,isRoomsOnly:!1,isThirdParty:!1,withSearch:!0,withBreadCrumbs:!0,withoutBackButton:!1,withCancelButton:!0,cancelButtonLabel:`Cancel`,withCreate:!1,withFooterInput:!1,withFooterCheckbox:!1,submitButtonLabel:`Select`,footerInputHeader:``,currentFooterInputValue:``,footerCheckboxLabel:``,descriptionText:``,disabledItems:[]}},N={render:e=>(0,S.jsx)(E,{...e}),args:{isPanelVisible:!0,embedded:!0,currentDeviceType:v.desktop,currentFolderId:0,rootFolderType:i.VirtualRooms,isRoomsOnly:!1,isThirdParty:!1,withHeader:!0,headerProps:{headerLabel:`Select destination`,onCloseClick:()=>{}},withSearch:!0,withBreadCrumbs:!0,withoutBackButton:!1,withCancelButton:!0,cancelButtonLabel:`Cancel`,withCreate:!1,withFooterInput:!1,withFooterCheckbox:!1,submitButtonLabel:`Move here`,footerInputHeader:``,currentFooterInputValue:``,footerCheckboxLabel:``,descriptionText:``,disabledItems:[]}},P=[`Default`,`RoomsOnly`,`WithFooterInput`,`WithFileTypeFilter`,`WithRoomCreation`,`AsidePanel`,`WithHeader`],D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: (args: StoryArgs) => <Template {...args} />,
  args: {
    isPanelVisible: true,
    embedded: true,
    currentDeviceType: DeviceType.desktop,
    currentFolderId: 0,
    rootFolderType: FolderType.VirtualRooms,
    isRoomsOnly: false,
    isThirdParty: false,
    withSearch: true,
    withBreadCrumbs: true,
    withoutBackButton: false,
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
    withCreate: false,
    withFooterInput: false,
    withFooterCheckbox: false,
    submitButtonLabel: "Select",
    footerInputHeader: "",
    currentFooterInputValue: "",
    footerCheckboxLabel: "",
    descriptionText: "",
    disabledItems: []
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: (args: StoryArgs) => <Template {...args} />,
  args: {
    isPanelVisible: true,
    embedded: true,
    currentDeviceType: DeviceType.desktop,
    currentFolderId: 0,
    rootFolderType: FolderType.VirtualRooms,
    isRoomsOnly: true,
    isThirdParty: false,
    withSearch: true,
    withBreadCrumbs: true,
    withoutBackButton: false,
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
    withCreate: false,
    withFooterInput: false,
    withFooterCheckbox: false,
    submitButtonLabel: "Move here",
    footerInputHeader: "",
    currentFooterInputValue: "",
    footerCheckboxLabel: "",
    descriptionText: "",
    disabledItems: []
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: (args: StoryArgs) => <Template {...args} />,
  args: {
    isPanelVisible: true,
    embedded: true,
    currentDeviceType: DeviceType.desktop,
    currentFolderId: 0,
    rootFolderType: FolderType.VirtualRooms,
    isRoomsOnly: false,
    isThirdParty: false,
    withSearch: true,
    withBreadCrumbs: true,
    withoutBackButton: false,
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
    withCreate: false,
    withFooterInput: true,
    footerInputHeader: "File name",
    currentFooterInputValue: "My Document",
    withFooterCheckbox: false,
    submitButtonLabel: "Save",
    footerCheckboxLabel: "",
    descriptionText: "",
    disabledItems: []
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: (args: StoryArgs) => <Template {...args} />,
  args: {
    isPanelVisible: true,
    embedded: true,
    currentDeviceType: DeviceType.desktop,
    currentFolderId: 0,
    rootFolderType: FolderType.VirtualRooms,
    isRoomsOnly: false,
    isThirdParty: false,
    withSearch: true,
    withBreadCrumbs: true,
    withoutBackButton: false,
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
    withCreate: false,
    withFooterInput: false,
    withFooterCheckbox: false,
    submitButtonLabel: "Select file",
    footerInputHeader: "",
    currentFooterInputValue: "",
    footerCheckboxLabel: "",
    descriptionText: "Select a PDF file",
    disabledItems: [],
    filterParam: "PDF",
    applyFilterOption: ApplyFilterOption.Files
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: (args: StoryArgs) => <Template {...args} />,
  args: {
    isPanelVisible: true,
    embedded: true,
    currentDeviceType: DeviceType.desktop,
    currentFolderId: 0,
    rootFolderType: FolderType.VirtualRooms,
    isRoomsOnly: false,
    isThirdParty: false,
    withSearch: true,
    withBreadCrumbs: true,
    withoutBackButton: false,
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
    withCreate: true,
    createDefineRoomLabel: "Create new room",
    createDefineRoomType: RoomType.CustomRoom,
    withFooterInput: false,
    withFooterCheckbox: false,
    submitButtonLabel: "Select",
    footerInputHeader: "",
    currentFooterInputValue: "",
    footerCheckboxLabel: "",
    descriptionText: "",
    disabledItems: []
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: (props: StoryArgs) => <div style={{
    width: "700px",
    height: "600px",
    border: "4px dashed #d0d5dd",
    position: "relative"
  }}>
      <Toast />
      <FilesSelector {...props as unknown as FilesSelectorProps} getIsDisabled={getIsDisabled} getFilesArchiveError={getFilesArchiveError} onSubmit={(selectedItemId, folderTitle) => {
      toastr.success(\`Saved to "\${folderTitle}"\`);
    }} onCancel={() => {
      toastr.info("Cancelled");
    }} />
    </div>,
  args: {
    isPanelVisible: true,
    embedded: false,
    currentDeviceType: DeviceType.desktop,
    currentFolderId: 0,
    rootFolderType: FolderType.VirtualRooms,
    isRoomsOnly: false,
    isThirdParty: false,
    withSearch: true,
    withBreadCrumbs: true,
    withoutBackButton: false,
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
    withCreate: false,
    withFooterInput: false,
    withFooterCheckbox: false,
    submitButtonLabel: "Select",
    footerInputHeader: "",
    currentFooterInputValue: "",
    footerCheckboxLabel: "",
    descriptionText: "",
    disabledItems: []
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: (args: StoryArgs) => <Template {...args} />,
  args: {
    isPanelVisible: true,
    embedded: true,
    currentDeviceType: DeviceType.desktop,
    currentFolderId: 0,
    rootFolderType: FolderType.VirtualRooms,
    isRoomsOnly: false,
    isThirdParty: false,
    withHeader: true,
    headerProps: {
      headerLabel: "Select destination",
      onCloseClick: () => {}
    },
    withSearch: true,
    withBreadCrumbs: true,
    withoutBackButton: false,
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
    withCreate: false,
    withFooterInput: false,
    withFooterCheckbox: false,
    submitButtonLabel: "Move here",
    footerInputHeader: "",
    currentFooterInputValue: "",
    footerCheckboxLabel: "",
    descriptionText: "",
    disabledItems: []
  }
}`,...N.parameters?.docs?.source}}}})))()}export{x as n,F as r,D as t};