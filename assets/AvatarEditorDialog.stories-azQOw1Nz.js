import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{r as i,t as a}from"./text-Cz_cI6Yf.js";import{n as o,r as s,t as c}from"./button-DjDXE7uo.js";import{n as l,r as u,t as d}from"./modal-dialog-FtQERitO.js";import{n as f,t as p}from"./image-editor-u4I_13rq.js";var m,h,g;function _(){return(_=e((()=>{m=`_modalDialog_1rys3_1`,h=`_imageEditorWrapper_1rys3_16`,g={modalDialog:m,imageEditorWrapper:h}})))()}var v,y,b,x,S;function C(){return(C=e((()=>{v=t(n()),l(),o(),i(),f(),_(),y=r(),b=70,x=72,S=({t:e,visible:t,title:n,image:r,isLoading:i=!1,editorBorderRadius:o=110,maxImageSize:l,dataTestId:f,onClose:m,onSave:h,onChangeImage:_,onChangeFile:S})=>{let[C,w]=(0,v.useState)(``),[T,E]=(0,v.useState)(null);(0,v.useEffect)(()=>{let e=()=>{let e=document.documentElement.clientHeight;E(e<590?e-b-x:null)};return e(),window.addEventListener(`resize`,e),()=>window.removeEventListener(`resize`,e)},[]);let D=()=>{_({x:.5,y:.5,zoom:1,uploadedFile:void 0}),m()};return(0,y.jsxs)(d,{className:g.modalDialog,displayType:u.modal,withBodyScroll:!0,visible:t,onClose:D,withFooterBorder:!0,withBodyScrollForcibly:!!T,dataTestId:f,style:T?{"--modal-body-height":`${T}px`}:void 0,children:[(0,y.jsx)(d.Header,{children:(0,y.jsx)(a,{fontSize:`21px`,fontWeight:700,children:n})}),(0,y.jsx)(d.Body,{children:(0,y.jsx)(p,{t:e,className:g.imageEditorWrapper,classNameWrapperImageCropper:`avatar-editor`,image:r,Preview:null,setPreview:w,onChangeImage:_,onChangeFile:S,isDisabled:i,editorBorderRadius:o,maxImageSize:l})}),(0,y.jsxs)(d.Footer,{children:[(0,y.jsx)(c,{label:e(`Common:SaveButton`),size:s.normal,scale:!0,primary:!0,onClick:async()=>{await h(r,C)},isLoading:i}),(0,y.jsx)(c,{label:e(`Common:CancelButton`),size:s.normal,scale:!0,onClick:D,isDisabled:i})]})]})};try{S.displayName=`AvatarEditorDialog`,S.__docgenInfo={description:``,displayName:`AvatarEditorDialog`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/avatar-editor-dialog/index.tsx`,methods:[],props:{t:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/avatar-editor-dialog/AvatarEditorDialog.types.ts`,name:`TypeLiteral`}],description:"Translation function. The dialog asks it for `Common:SaveButton`, `Common:CancelButton` and `Common:ChooseAnother`, so a portal translation context is required.",name:`t`,required:!0,tags:{},type:{name:`TTranslation`}},visible:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/avatar-editor-dialog/AvatarEditorDialog.types.ts`,name:`TypeLiteral`}],description:`Whether the dialog is on screen.`,name:`visible`,required:!0,tags:{},type:{name:`boolean`}},title:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/avatar-editor-dialog/AvatarEditorDialog.types.ts`,name:`TypeLiteral`}],description:`Text of the dialog's header. It is not translated for you.`,name:`title`,required:!0,tags:{},type:{name:`string`}},image:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/avatar-editor-dialog/AvatarEditorDialog.types.ts`,name:`TypeLiteral`}],description:"The picture and its crop, held in your state. The body is empty until `uploadedFile` is set.",name:`image`,required:!0,tags:{},type:{name:`TImage`}},isLoading:{defaultValue:{value:`false`},declarations:[{fileName:`docspace-ui-kit-react/components/avatar-editor-dialog/AvatarEditorDialog.types.ts`,name:`TypeLiteral`}],description:`Puts the save button in its loading state and blocks the editor and the cancel button. It does not block the header cross, Escape or the backdrop.`,name:`isLoading`,required:!1,tags:{},type:{name:`boolean | undefined`}},editorBorderRadius:{defaultValue:{value:`110`},declarations:[{fileName:`docspace-ui-kit-react/components/avatar-editor-dialog/AvatarEditorDialog.types.ts`,name:`TypeLiteral`}],description:`Corner radius of the crop window in pixels, on the editor's 648px canvas.`,name:`editorBorderRadius`,required:!1,tags:{default:`110`},type:{name:`number | undefined`}},maxImageSize:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/avatar-editor-dialog/AvatarEditorDialog.types.ts`,name:`TypeLiteral`}],description:"Ignored. It is handed to the image editor, which does not read it either; check the file's size in `onChangeFile`.",name:`maxImageSize`,required:!1,tags:{deprecated:``},type:{name:`number | undefined`}},dataTestId:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/avatar-editor-dialog/AvatarEditorDialog.types.ts`,name:`TypeLiteral`}],description:"Value of `data-testid` on the dialog.",name:`dataTestId`,required:!1,tags:{},type:{name:`string | undefined`}},onClose:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/avatar-editor-dialog/AvatarEditorDialog.types.ts`,name:`TypeLiteral`}],description:"Called after the dialog has reset `image` to an empty, centred, unzoomed one — by the cancel button, the header cross, Escape and the backdrop alike.",name:`onClose`,required:!0,tags:{},type:{name:`() => void`}},onSave:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/avatar-editor-dialog/AvatarEditorDialog.types.ts`,name:`TypeLiteral`}],description:"Called with the cropped `image` and its `data:` URL preview when save is clicked. The dialog neither closes itself nor sets `isLoading`.",name:`onSave`,required:!0,tags:{},type:{name:`(image: TImage, preview: string) => void | Promise<void>`}},onChangeImage:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/avatar-editor-dialog/AvatarEditorDialog.types.ts`,name:`TypeLiteral`}],description:"Called with a new `image` whenever the crop is dragged or the zoom changes. Apply it to your state or nothing moves.",name:`onChangeImage`,required:!0,tags:{},type:{name:`TChangeImage`}},onChangeFile:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/avatar-editor-dialog/AvatarEditorDialog.types.ts`,name:`TypeLiteral`}],description:"Called with the change event of the hidden file input when another picture is chosen. Read the file and put it in `image.uploadedFile` yourself.",name:`onChangeFile`,required:!0,tags:{},type:{name:`(e: ChangeEvent<HTMLInputElement, Element>) => void`}}},tags:{}}}catch{}})))()}var w,T,E,D,O,k,A,j,M,N,P,F;function I(){return(I=e((()=>{w=t(n()),o(),C(),T=r(),E={"Common:SaveButton":`Save`,"Common:CancelButton":`Cancel`,"Common:ChooseAnother":`Choose another`},D=e=>E[e]??e,O=`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640"><rect width="640" height="640" fill="#9fc3e7"/><circle cx="460" cy="190" r="80" fill="#f5d67a"/><path d="M0 470 200 260 360 420 460 330 640 500V640H0Z" fill="#5b8f6a"/><path d="M0 560 180 430 340 540 500 450 640 540V640H0Z" fill="#3f6b4d"/></svg>`,k=()=>({zoom:1,x:.5,y:.5,uploadedFile:new File([O],`landscape.svg`,{type:`image/svg+xml`})}),A={title:`UI/Overlays/AvatarEditorDialog`,component:S,parameters:{docs:{story:{inline:!1,height:`760px`}}},argTypes:{t:{control:!1,description:`Translation function; the dialog asks it for the save, cancel and choose-another labels`},visible:{control:`boolean`,description:`Whether the dialog is on screen`},title:{control:`text`,description:`Text of the dialog's header, shown as given`},image:{control:!1,description:`The picture and its crop position and zoom, held by the caller; the body stays empty until it carries a file`},isLoading:{control:`boolean`,description:`Shows a spinner on the save button and disables the editor and the cancel button; the header cross, Escape and the backdrop still close the dialog`,table:{defaultValue:{summary:`false`}}},editorBorderRadius:{control:`number`,description:`Corner radius of the crop window in pixels on the editor's 648px canvas: 0 is a square, 324 a circle`,table:{defaultValue:{summary:`110`}}},maxImageSize:{control:`number`,description:`Deprecated and ignored; limit or compress the file in onChangeFile`},dataTestId:{control:`text`,description:`Value of data-testid on the dialog`},onClose:{action:`onClose`,description:`Called when the dialog is dismissed, after the image has been reset to an empty one`},onSave:{action:`onSave`,description:`Called with the cropped image and its data: URL preview when Save is clicked; the dialog stays open`},onChangeImage:{action:`onChangeImage`,description:`Called with a new image whenever the picture is dragged or zoomed; store it or nothing moves`},onChangeFile:{action:`onChangeFile`,description:`Called with the change event of the file input when the user chooses another picture`}}},j=({visible:e,onClose:t,onSave:n,onChangeImage:r,onChangeFile:i,...a})=>{let[o,l]=(0,w.useState)(!!e),[u,d]=(0,w.useState)(k);(0,w.useEffect)(()=>{l(!!e)},[e]);let f=(0,w.useCallback)(e=>{d(e),r?.(e)},[r]),p=(0,w.useCallback)(e=>{i?.(e);let t=e.target.files?.[0];t&&d(e=>({...e,uploadedFile:t}))},[i]);return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(c,{label:`Open dialog`,size:s.small,onClick:()=>{d(k()),l(!0)}}),(0,T.jsx)(S,{...a,t:D,visible:o,title:a.title??``,image:u,onClose:()=>{t?.(),l(!1)},onSave:(e,t)=>{n?.(e,t),l(!1)},onChangeImage:f,onChangeFile:p})]})},M={render:e=>(0,T.jsx)(j,{...e}),args:{visible:!0,title:`Change avatar`,editorBorderRadius:110},parameters:{docs:{description:{story:`The dialog as it opens on a chosen picture: drag the picture to frame it, zoom with the slider or the buttons, and press Save or Cancel. The story keeps the picture in its own state and closes the dialog from both handlers, as your code has to; reopen it with the button. Change any other prop live in the Controls panel below.`},source:{code:`const [visible, setVisible] = useState(true);
const [image, setImage] = useState<TImage>({
  zoom: 1,
  x: 0.5,
  y: 0.5,
  uploadedFile: file,
});

<AvatarEditorDialog
  t={t}
  visible={visible}
  title="Change avatar"
  image={image}
  onChangeImage={setImage}
  onChangeFile={handleChangeFile}
  onClose={() => setVisible(false)}
  onSave={(cropped, preview) => setVisible(false)}
/>`}}}},N={render:e=>(0,T.jsx)(j,{...e}),args:{...M.args,isLoading:!0},parameters:{docs:{description:{story:"What the user sees while the cropped picture uploads: a spinner on Save and Cancel greyed out, while the picture no longer drags and the zoom row no longer responds (`isLoading`). The header cross, Escape and the backdrop still close the dialog, so guard `onClose` yourself if a close must wait for the upload."},source:{code:`<AvatarEditorDialog
  t={t}
  visible
  title="Change avatar"
  image={image}
  isLoading={isUploading}
  onChangeImage={setImage}
  onChangeFile={handleChangeFile}
  onClose={() => {
    if (!isUploading) setVisible(false);
  }}
  onSave={handleSave}
/>`}}}},P={render:e=>(0,T.jsx)(j,{...e}),args:{...M.args,title:`Change cover`,editorBorderRadius:0},parameters:{docs:{description:{story:"A crop window with square corners, for a picture that is not shown round, such as a logo or a cover (`editorBorderRadius` of 0). The radius is measured on the editor's 648px canvas: the default 110 gives rounded corners, 324 a circle."},source:{code:`<AvatarEditorDialog
  t={t}
  visible
  title="Change cover"
  image={image}
  editorBorderRadius={0}
  onChangeImage={setImage}
  onChangeFile={handleChangeFile}
  onClose={handleClose}
  onSave={handleSave}
/>`}}}},F=[`Default`,`Loading`,`SquareCrop`],M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: args => <AvatarEditorDialogDemo {...args} />,
  args: {
    visible: true,
    title: "Change avatar",
    editorBorderRadius: 110
  },
  parameters: {
    docs: {
      description: {
        story: "The dialog as it opens on a chosen picture: drag the picture to frame it, zoom with the slider or the buttons, and press Save or Cancel. The story keeps the picture in its own state and closes the dialog from both handlers, as your code has to; reopen it with the button. Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`const [visible, setVisible] = useState(true);
const [image, setImage] = useState<TImage>({
  zoom: 1,
  x: 0.5,
  y: 0.5,
  uploadedFile: file,
});

<AvatarEditorDialog
  t={t}
  visible={visible}
  title="Change avatar"
  image={image}
  onChangeImage={setImage}
  onChangeFile={handleChangeFile}
  onClose={() => setVisible(false)}
  onSave={(cropped, preview) => setVisible(false)}
/>\`
      }
    }
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: args => <AvatarEditorDialogDemo {...args} />,
  args: {
    ...Default.args,
    isLoading: true
  },
  parameters: {
    docs: {
      description: {
        story: "What the user sees while the cropped picture uploads: a spinner on Save and Cancel greyed out, while the picture no longer drags and the zoom row no longer responds (\`isLoading\`). The header cross, Escape and the backdrop still close the dialog, so guard \`onClose\` yourself if a close must wait for the upload."
      },
      source: {
        code: \`<AvatarEditorDialog
  t={t}
  visible
  title="Change avatar"
  image={image}
  isLoading={isUploading}
  onChangeImage={setImage}
  onChangeFile={handleChangeFile}
  onClose={() => {
    if (!isUploading) setVisible(false);
  }}
  onSave={handleSave}
/>\`
      }
    }
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: args => <AvatarEditorDialogDemo {...args} />,
  args: {
    ...Default.args,
    title: "Change cover",
    editorBorderRadius: 0
  },
  parameters: {
    docs: {
      description: {
        story: "A crop window with square corners, for a picture that is not shown round, such as a logo or a cover (\`editorBorderRadius\` of 0). The radius is measured on the editor's 648px canvas: the default 110 gives rounded corners, 324 a circle."
      },
      source: {
        code: \`<AvatarEditorDialog
  t={t}
  visible
  title="Change cover"
  image={image}
  editorBorderRadius={0}
  onChangeImage={setImage}
  onChangeFile={handleChangeFile}
  onClose={handleClose}
  onSave={handleSave}
/>\`
      }
    }
  }
}`,...P.parameters?.docs?.source}}}})))()}I();export{M as Default,N as Loading,P as SquareCrop,F as __namedExportsOrder,A as default};