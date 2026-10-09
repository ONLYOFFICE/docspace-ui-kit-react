import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./image-editor-u4I_13rq.js";var a;function o(){return(o=e((()=>{a=new URL(`selector.form.room.empty.screen.light.react-DbfM5sof.svg`,import.meta.url).href})))()}var s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{s=t(),o(),r(),c=n(),l={title:`UI/Interactive elements/ImageEditor`,component:i,parameters:{},argTypes:{t:{control:!1,description:"Translation function; the editor asks it for the Choose another label (`Common:ChooseAnother`)"},image:{control:!1,description:"The picture (a `File` or a URL) with its zoom and crop position, held in your state; the editor renders nothing while the picture is empty"},onChangeImage:{control:!1,description:"Called with a new `image` whenever the picture is dragged or zoomed; apply it to your state or nothing moves"},onChangeFile:{control:!1,description:"Called with the change event of the hidden file input when another picture is chosen; put the file into `image` yourself"},Preview:{control:!1,description:`Content rendered below the cropper, in the same wrapper, such as a preview of the cropped result`},setPreview:{control:!1,description:"Called at most every 300ms with the cropped picture as a `data:` URL"},isDisabled:{control:`boolean`,description:"Blocks dragging, zooming and choosing another file, and greys out the zoom row; required, so pass `false` when idle"},editorBorderRadius:{control:`number`,description:`Corner radius of the crop window in pixels, measured on the 648px canvas shown at 368px; 324 or more makes a circle`},disableImageRescaling:{control:`boolean`,description:`Hides the zoom row and freezes the crop position, leaving the picture framed as it is`,table:{defaultValue:{summary:`false`}}},className:{control:`text`,description:`Class added to the outer element`},classNameWrapperImageCropper:{control:`text`,description:"Class added to the element that wraps the cropper and `Preview`, for laying the two out side by side"},maxImageSize:{control:`number`,description:`Deprecated, has no effect. Size limits and compression are the caller's job, in onChangeFile`,table:{defaultValue:{summary:`undefined`}}}}},u=({editorBorderRadius:e,isDisabled:t,disableImageRescaling:n,asFile:r})=>{let[o,l]=(0,s.useState)({uploadedFile:a,zoom:.5,x:.5,y:0}),[u,d]=(0,s.useState)(null);(0,s.useEffect)(()=>{r&&fetch(a).then(e=>e.blob()).then(e=>{let t=new File([e],`picture.svg`,{type:e.type});l({uploadedFile:t,zoom:1,x:.5,y:.5})})},[r]);let f=(0,s.useCallback)(e=>{l(e)},[]),p=(0,s.useCallback)(e=>{if(e.target.files?.[0]){let t=e.target.files[0];l(e=>({...e,uploadedFile:t}))}},[]),m=(0,s.useCallback)(e=>{d(e?(0,c.jsx)(`img`,{src:e,alt:`Preview`}):null)},[]);return(0,c.jsx)(`div`,{style:{width:`100%`,maxWidth:`800px`},children:(0,c.jsx)(i,{t:()=>`choose another image`,image:o,onChangeImage:f,onChangeFile:p,Preview:u,setPreview:m,editorBorderRadius:e??0,isDisabled:t??!1,disableImageRescaling:n})})},d={render:e=>(0,c.jsx)(u,{editorBorderRadius:e.editorBorderRadius,isDisabled:e.isDisabled,disableImageRescaling:e.disableImageRescaling}),args:{isDisabled:!1,disableImageRescaling:!1,editorBorderRadius:8},parameters:{docs:{description:{story:"A picture framed in a square window with slightly rounded corners, the starting point for a logo or a cover. Drag the picture to reframe it; the zoom row stays hidden because the picture is given as a URL, not a `File`. Change any other prop live in the Controls panel below."},source:{code:`<ImageEditor
  t={(key) => key}
  image={image}
  onChangeImage={handleChangeImage}
  onChangeFile={handleChangeFile}
  Preview={preview}
  setPreview={handleSetPreview}
  isDisabled={false}
  editorBorderRadius={8}
/>`}}}},f={render:e=>(0,c.jsx)(u,{editorBorderRadius:e.editorBorderRadius,isDisabled:e.isDisabled,disableImageRescaling:e.disableImageRescaling}),args:{isDisabled:!1,disableImageRescaling:!1,editorBorderRadius:400},parameters:{docs:{description:{story:"A round crop window, the shape a profile picture is usually cut to: any radius of half the 648px canvas or more (`editorBorderRadius`) turns the square into a circle."},source:{code:`<ImageEditor
  t={(key) => key}
  image={image}
  onChangeImage={handleChangeImage}
  onChangeFile={handleChangeFile}
  Preview={preview}
  setPreview={handleSetPreview}
  isDisabled={false}
  editorBorderRadius={400}
/>`}}}},p=e=>`<ImageEditor
  t={(key) => key}
  image={{ uploadedFile: file, zoom: 1, x: 0.5, y: 0.5 }}
  onChangeImage={handleChangeImage}
  onChangeFile={handleChangeFile}
  Preview={preview}
  setPreview={handleSetPreview}
  editorBorderRadius={8}
${e}
/>`,m={render:e=>(0,c.jsx)(u,{editorBorderRadius:e.editorBorderRadius,isDisabled:e.isDisabled,disableImageRescaling:e.disableImageRescaling,asFile:!0}),args:{isDisabled:!1,disableImageRescaling:!1,editorBorderRadius:8},parameters:{docs:{description:{story:"A picture given as a `File`, the way it arrives from a file input, gets the zoom row under the Choose another control: the slider zooms from 1x to 5x in fine steps, the minus and plus buttons by half a step each, and the preview below follows the crop (`setPreview`)."},source:{code:p(`  isDisabled={false}`)}}}},h={render:e=>(0,c.jsx)(u,{editorBorderRadius:e.editorBorderRadius,isDisabled:e.isDisabled,disableImageRescaling:e.disableImageRescaling,asFile:!0}),args:{isDisabled:!0,disableImageRescaling:!1,editorBorderRadius:8},parameters:{docs:{description:{story:"The editor while a save is in flight: the zoom row is greyed out, the picture no longer drags and Choose another opens no picker (`isDisabled`)."},source:{code:p(`  isDisabled`)}}}},g={render:e=>(0,c.jsx)(u,{editorBorderRadius:e.editorBorderRadius,isDisabled:e.isDisabled,disableImageRescaling:e.disableImageRescaling,asFile:!0}),args:{isDisabled:!1,disableImageRescaling:!0,editorBorderRadius:8},parameters:{docs:{description:{story:"The same `File` with its framing locked: the zoom row is gone and dragging leaves the picture where it is, while Choose another still replaces it (`disableImageRescaling`)."},source:{code:p(`  isDisabled={false}
  disableImageRescaling`)}}}},_=[`Default`,`ProfileAvatar`,`WithZoomControls`,`DisabledState`,`FixedFraming`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <ImageEditorDemo editorBorderRadius={args.editorBorderRadius} isDisabled={args.isDisabled} disableImageRescaling={args.disableImageRescaling} />,
  args: {
    isDisabled: false,
    disableImageRescaling: false,
    editorBorderRadius: 8
  },
  parameters: {
    docs: {
      description: {
        story: "A picture framed in a square window with slightly rounded corners, the starting point for a logo or a cover. Drag the picture to reframe it; the zoom row stays hidden because the picture is given as a URL, not a \`File\`. Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<ImageEditor
  t={(key) => key}
  image={image}
  onChangeImage={handleChangeImage}
  onChangeFile={handleChangeFile}
  Preview={preview}
  setPreview={handleSetPreview}
  isDisabled={false}
  editorBorderRadius={8}
/>\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <ImageEditorDemo editorBorderRadius={args.editorBorderRadius} isDisabled={args.isDisabled} disableImageRescaling={args.disableImageRescaling} />,
  args: {
    isDisabled: false,
    disableImageRescaling: false,
    editorBorderRadius: 400
  },
  parameters: {
    docs: {
      description: {
        story: "A round crop window, the shape a profile picture is usually cut to: any radius of half the 648px canvas or more (\`editorBorderRadius\`) turns the square into a circle."
      },
      source: {
        code: \`<ImageEditor
  t={(key) => key}
  image={image}
  onChangeImage={handleChangeImage}
  onChangeFile={handleChangeFile}
  Preview={preview}
  setPreview={handleSetPreview}
  isDisabled={false}
  editorBorderRadius={400}
/>\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <ImageEditorDemo editorBorderRadius={args.editorBorderRadius} isDisabled={args.isDisabled} disableImageRescaling={args.disableImageRescaling} asFile />,
  args: {
    isDisabled: false,
    disableImageRescaling: false,
    editorBorderRadius: 8
  },
  parameters: {
    docs: {
      description: {
        story: "A picture given as a \`File\`, the way it arrives from a file input, gets the zoom row under the Choose another control: the slider zooms from 1x to 5x in fine steps, the minus and plus buttons by half a step each, and the preview below follows the crop (\`setPreview\`)."
      },
      source: {
        code: fileSource("  isDisabled={false}")
      }
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <ImageEditorDemo editorBorderRadius={args.editorBorderRadius} isDisabled={args.isDisabled} disableImageRescaling={args.disableImageRescaling} asFile />,
  args: {
    isDisabled: true,
    disableImageRescaling: false,
    editorBorderRadius: 8
  },
  parameters: {
    docs: {
      description: {
        story: "The editor while a save is in flight: the zoom row is greyed out, the picture no longer drags and Choose another opens no picker (\`isDisabled\`)."
      },
      source: {
        code: fileSource("  isDisabled")
      }
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <ImageEditorDemo editorBorderRadius={args.editorBorderRadius} isDisabled={args.isDisabled} disableImageRescaling={args.disableImageRescaling} asFile />,
  args: {
    isDisabled: false,
    disableImageRescaling: true,
    editorBorderRadius: 8
  },
  parameters: {
    docs: {
      description: {
        story: "The same \`File\` with its framing locked: the zoom row is gone and dragging leaves the picture where it is, while Choose another still replaces it (\`disableImageRescaling\`)."
      },
      source: {
        code: fileSource("  isDisabled={false}\\n  disableImageRescaling")
      }
    }
  }
}`,...g.parameters?.docs?.source}}}})))()}v();export{d as Default,h as DisabledState,g as FixedFraming,f as ProfileAvatar,m as WithZoomControls,_ as __namedExportsOrder,l as default};