import{n as e,r as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{n as i,t as a}from"./folder-type-BCc4VXh0.js";import{n as o,r as s}from"./ApiProvider-D8tgkuYF.js";import{n as c,t as l}from"./Files-DpdTk_Fb.js";import{n as u,t as d}from"./Toast-6E8r1NpK.js";import{S as f,n as p}from"./enums-DzcBu485.js";import{n as m,t as h}from"./uploader-DqaOVW0C.js";import{n as g}from"./text-input-D8OFtXHj.js";import{t as _}from"./TextInput.enums-z6wZ2LJ6.js";import{o as v,r as y}from"./PortalGate-ByWqEVNV.js";import{n as b,t as x}from"./FileInput-B9t1Hh0z.js";var S,C;function w(){return(w=e((()=>{S=(e,t)=>`${e}/rooms/personal/filter?folder=${t}`,C=(e,t,n,r,i)=>!!(e||t||i||!n||r===`rooms`)})))()}var T=t({AnyFiles:()=>R,CustomSettings:()=>z,Default:()=>j,FolderUpload:()=>N,ImageUpload:()=>F,SingleFileUpload:()=>M,SingleFolderUpload:()=>P,WithSizeLimit:()=>I,WithTotalSizeLimit:()=>L,__namedExportsOrder:()=>B,default:()=>k}),E,D,O,k,A,j,M,N,P,F,I,L,R,z,B;function V(){return(V=e((()=>{E=n(),i(),m(),u(),o(),y(),c(),f(),g(),b(),w(),D=r(),O=e=>{let{baseUrl:t}=s(),{storyId:n=`default`,...r}=e,[i,o]=(0,E.useState)(``),[c,u]=(0,E.useState)(``),[d,f]=(0,E.useState)(!1),m=(e,t,n,r)=>{if(!e)return;let i=r.map(e=>e.label).join(` / `);o(e),u(i),f(!1)},g=(0,E.useCallback)(e=>S(t,e),[t]),v=(0,E.useCallback)(C,[]);return(0,D.jsxs)(D.Fragment,{children:[(0,D.jsxs)(`div`,{style:{marginBottom:16,display:`flex`,gap:8,alignItems:`center`},children:[(0,D.jsx)(`label`,{style:{fontWeight:600,display:`block`,marginBottom:4},children:`Target Folder:`}),(0,D.jsx)(`div`,{style:{width:`300px`},children:(0,D.jsx)(x,{fromStorage:!0,placeholder:c||`Choose folder`,size:_.base,scale:!0,onClick:()=>f(!0)})}),!i&&(0,D.jsx)(`span`,{style:{color:`red`,fontSize:12,marginTop:4,display:`block`},children:`Required — please select a target folder`})]}),(0,D.jsx)(l,{isPanelVisible:d,embedded:!1,currentDeviceType:p.desktop,currentFolderId:0,rootFolderType:a.VirtualRooms,isRoomsOnly:!1,isThirdParty:!1,withSearch:!0,withBreadCrumbs:!0,withoutBackButton:!1,withCancelButton:!0,cancelButtonLabel:`Cancel`,submitButtonLabel:`Select`,disabledItems:[],getIsDisabled:v,onSubmit:m,onCancel:()=>f(!1)}),(0,D.jsx)(h,{...r,targetId:i,getFolderUrl:g})]})},k={title:`Components/Uploader`,component:h,render:e=>(0,D.jsx)(O,{...e}),decorators:[e=>(0,D.jsxs)(D.Fragment,{children:[(0,D.jsx)(e,{}),(0,D.jsx)(d,{})]}),v(`Uploader`)],argTypes:{width:{control:`text`,description:`Width of the uploader container`,table:{defaultValue:{summary:`100%`}}},height:{control:`text`,description:`Height of the uploader container`,table:{defaultValue:{summary:`100%`}}},accept:{control:`text`,description:`Accepted file types as a comma-separated string (e.g., '.pdf,.doc,.docx')`},shortText:{control:`text`,description:`Short text displaying supported file extensions`},fullText:{control:`text`,description:`Full text with all supported file extensions (shown in tooltip)`},badgeValue:{control:`number`,description:`Number displayed in the badge showing additional formats count`},filesSettings:{control:`object`,description:`File settings from the server (chunkUploadSize, maxUploadThreadCount, etc.)`},targetId:{control:!1,description:`Target folder ID for uploads (managed via folder selector above the component)`},storyId:{control:!1,description:`Unique identifier for the story to isolate targetId in sessionStorage`},linkMainText:{control:`text`,description:`Main text displayed in the dropzone`},secondaryText:{control:`text`,description:`Secondary text displayed in the dropzone`},isFolderUpload:{control:`boolean`,description:`Enables folder upload mode`},isMultipleUpload:{control:`boolean`,description:`Allows multiple files/folders upload`},maxPerUploadSize:{control:`text`,description:`Maximum size per single upload (e.g. '10MB')`},maxTotalUploadSize:{control:`text`,description:`Maximum total upload size (e.g. '100MB')`},getFolderUrl:{control:!1,description:`Callback to generate folder URL for success toast link. If not provided, no link is shown.`}},parameters:{docs:{description:{component:`A file uploader component that supports chunked uploads, folder uploads, and file size validation. Uses the ONLYOFFICE Apps API SDK for upload operations.`}}}},A={width:`800px`,height:`300px`,accept:`.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx`,shortText:`PDF, DOC, DOCX, XLS, XLSX`,fullText:`PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX`,badgeValue:2,linkMainText:`Upload files`,secondaryText:`or drag and drop files here`,isFolderUpload:!1,isMultipleUpload:!0},j={args:{...A,storyId:`default`}},M={args:{...A,storyId:`single-file`,linkMainText:`Upload file`,secondaryText:`or drag and drop a file here`,isMultipleUpload:!1}},N={args:{...A,storyId:`folder`,shortText:`Any files`,fullText:void 0,badgeValue:void 0,linkMainText:`Upload folder`,secondaryText:`or drag and drop a folder here`,isFolderUpload:!0,isMultipleUpload:!0}},P={args:{...A,storyId:`single-folder`,shortText:`Any files`,fullText:void 0,badgeValue:void 0,linkMainText:`Upload folder`,secondaryText:`or drag and drop a folder here`,isFolderUpload:!0,isMultipleUpload:!1}},F={args:{...A,storyId:`image`,accept:`.png,.jpg,.jpeg,.gif,.webp,.svg`,shortText:`PNG, JPG, JPEG, GIF`,fullText:`PNG, JPG, JPEG, GIF, WEBP, SVG`,badgeValue:2,linkMainText:`Upload images`,secondaryText:`or drag and drop images here`}},I={args:{...A,storyId:`size-limit`,linkMainText:`Upload files (max 10MB each)`,maxPerUploadSize:`10MB`}},L={args:{...A,storyId:`total-size-limit`,linkMainText:`Upload files (max 100MB total)`,maxPerUploadSize:`10MB`,maxTotalUploadSize:`100MB`}},R={args:{...A,storyId:`any-files`,accept:`*`,shortText:`Any files`,fullText:void 0,badgeValue:void 0,linkMainText:`Upload any files`,secondaryText:`All file types are accepted`}},z={args:{...A,storyId:`custom-settings`,filesSettings:{chunkUploadSize:10485760,maxUploadThreadCount:5,maxUploadFilesCount:3},linkMainText:`Upload with custom settings`,secondaryText:`10MB chunks, 5 threads, 3 files at once`}},B=[`Default`,`SingleFileUpload`,`FolderUpload`,`SingleFolderUpload`,`ImageUpload`,`WithSizeLimit`,`WithTotalSizeLimit`,`AnyFiles`,`CustomSettings`],j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    storyId: "default"
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    storyId: "single-file",
    linkMainText: "Upload file",
    secondaryText: "or drag and drop a file here",
    isMultipleUpload: false
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    storyId: "folder",
    shortText: "Any files",
    fullText: undefined,
    badgeValue: undefined,
    linkMainText: "Upload folder",
    secondaryText: "or drag and drop a folder here",
    isFolderUpload: true,
    isMultipleUpload: true
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    storyId: "single-folder",
    shortText: "Any files",
    fullText: undefined,
    badgeValue: undefined,
    linkMainText: "Upload folder",
    secondaryText: "or drag and drop a folder here",
    isFolderUpload: true,
    isMultipleUpload: false
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    storyId: "image",
    accept: ".png,.jpg,.jpeg,.gif,.webp,.svg",
    shortText: "PNG, JPG, JPEG, GIF",
    fullText: "PNG, JPG, JPEG, GIF, WEBP, SVG",
    badgeValue: 2,
    linkMainText: "Upload images",
    secondaryText: "or drag and drop images here"
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    storyId: "size-limit",
    linkMainText: "Upload files (max 10MB each)",
    maxPerUploadSize: "10MB"
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    storyId: "total-size-limit",
    linkMainText: "Upload files (max 100MB total)",
    maxPerUploadSize: "10MB",
    maxTotalUploadSize: "100MB"
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    storyId: "any-files",
    accept: "*",
    shortText: "Any files",
    fullText: undefined,
    badgeValue: undefined,
    linkMainText: "Upload any files",
    secondaryText: "All file types are accepted"
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    storyId: "custom-settings",
    filesSettings: {
      chunkUploadSize: 10 * 1024 * 1024,
      maxUploadThreadCount: 5,
      maxUploadFilesCount: 3
    },
    linkMainText: "Upload with custom settings",
    secondaryText: "10MB chunks, 5 threads, 3 files at once"
  }
}`,...z.parameters?.docs?.source}}}})))()}export{F as a,T as c,V as d,N as i,I as l,z as n,M as o,j as r,P as s,R as t,L as u};