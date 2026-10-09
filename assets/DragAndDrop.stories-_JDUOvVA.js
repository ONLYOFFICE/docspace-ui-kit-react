import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./DragAndDrop-CruYPrRH.js";var a,o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{a=t(),r(),o=n(),s={title:`UI/Interactive elements/DragAndDrop`,component:i,parameters:{},argTypes:{isDropZone:{control:`boolean`,description:"Passes drag events on to a drop target around this one, which then takes the drop in place of this element's `onDrop`. Without it the events stop here",table:{defaultValue:{summary:`false`}}},dragging:{control:`boolean`,description:`Your own flag that a drag is in progress. The element is highlighted only while it is set, and gets the stronger accept colour while files are held over it`,table:{defaultValue:{summary:`false`}}},isDragDisabled:{control:`boolean`,description:"Fades the element to 40%. The drop is not blocked: `onDrop` still fires",table:{defaultValue:{summary:`false`}}},onDrop:{action:`dropped`,description:`Called with the dropped files; not called when the drop carried none`},onDragOver:{action:`dragOver`,description:"Called on every drag-over with the drag-active flag from the last render, which is still `false` on the first event of a drag"},onDragLeave:{action:`dragLeave`,description:`Called when the dragged files leave the element`},onMouseDown:{action:`mouseDown`,description:`Called when the pointer is pressed on the element`},children:{description:`What the drop target wraps; the element fills its parent's height around it`},className:{control:`text`,description:`Added after the component's own classes on the outer element`},style:{description:`Inline style of the outer element, also the place to override the drag colours and the faded opacity`},value:{control:!1,description:`Ignored: nothing reads it`},targetFile:{control:!1,description:`Ignored: nothing calls it`},forwardedRef:{control:!1,description:`Ignored: the element's ref belongs to the drop library, and this one is never attached`}}},c=e=>{let[t,n]=(0,a.useState)(!1),r=(t,r)=>{n(t),e.onDragOver?.(t,r)},s=t=>{n(!1),e.onDragLeave?.(t)},c=t=>{n(!1),e.onDrop?.(t)},l={width:`100%`,height:`200px`,border:`2px dashed ${t?`#2DA7DB`:`#D0D5DA`}`,borderRadius:`6px`,display:`flex`,alignItems:`center`,justifyContent:`center`,transition:`all 0.2s ease`},u={margin:0,color:`var(--text-color)`,textAlign:`center`};return(0,o.jsx)(i,{...e,dragging:e.dragging??t,onDragOver:r,onDragLeave:s,onDrop:c,children:(0,o.jsx)(`div`,{style:l,children:(0,o.jsx)(`p`,{style:u,children:t?`Drop files here`:`Drag files here`})})})},l={render:e=>(0,o.jsx)(c,{...e}),parameters:{docs:{description:{story:"The usual setup: the host keeps its own drag flag and passes it back. Drag files from your desktop over the box to see the background change and the dropped files arrive in the Actions panel (`onDragOver`, `dragging`, `onDrop`)."},source:{code:`const [dragging, setDragging] = useState(false);

<DragAndDrop
  dragging={dragging}
  onDragOver={(isDragActive) => setDragging(isDragActive)}
  onDragLeave={() => setDragging(false)}
  onDrop={(files) => {
    setDragging(false);
    upload(files);
  }}
>
  <div>Drag files here</div>
</DragAndDrop>`}}}},u={render:e=>(0,o.jsx)(c,{...e}),args:{dragging:!0},parameters:{docs:{description:{story:"The drag background held on without an actual drag, to check how the highlight looks in each theme (`dragging`). Drag a file over it to see the stronger accept colour on top."},source:{code:`<DragAndDrop dragging onDrop={(files) => upload(files)}>
  <div>Drop files here</div>
</DragAndDrop>`}}}},d={render:e=>(0,o.jsx)(c,{...e}),args:{isDragDisabled:!0},parameters:{docs:{description:{story:"A target the user may not upload to, faded to 40% (`isDragDisabled`). The fade is only a look: drop a file and it still arrives in the Actions panel, so the host has to ignore it in `onDrop`."},source:{code:`<DragAndDrop
  isDragDisabled
  onDrop={(files) => {
    if (canUpload) upload(files);
  }}
>
  <div>Drag files here</div>
</DragAndDrop>`}}}},f=e=>{let[t,n]=(0,a.useState)(0),[r,s]=(0,a.useState)(0),c={padding:`16px`,border:`2px dashed #D0D5DA`,borderRadius:`6px`,color:`var(--text-color)`};return(0,o.jsx)(i,{onDrop:()=>n(e=>e+1),children:(0,o.jsxs)(`div`,{style:c,children:[(0,o.jsxs)(`p`,{style:{marginTop:0},children:[`Outer target: `,t,` drops`]}),(0,o.jsx)(i,{...e,onDrop:t=>{s(e=>e+1),e.onDrop?.(t)},children:(0,o.jsxs)(`div`,{style:c,children:[`Inner target: `,r,` drops`]})})]})})},p={render:e=>(0,o.jsx)(f,{...e}),args:{isDropZone:!0},parameters:{docs:{description:{story:"A folder row inside a panel that also takes files. Drop a file on the inner box: with `isDropZone` on, the outer counter goes up and the inner one does not, because the drop is handed to the outer target. Turn `isDropZone` off in the Controls panel below and the inner box keeps the drop."},source:{code:`<DragAndDrop onDrop={uploadToPanel}>
  <div>Panel</div>
  <DragAndDrop isDropZone onDrop={uploadToFolder}>
    <div>Folder</div>
  </DragAndDrop>
</DragAndDrop>`}}}},m={render:()=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`,width:`400px`},children:(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`,"--dnd-dragging-bg":`#e6f3fb`,"--dnd-accept-bg":`#cce5f6`,"--dnd-disabled-opacity":`0.25`},children:[(0,o.jsx)(i,{isDropZone:!0,dragging:!0,style:{height:`120px`,borderRadius:`8px`},children:(0,o.jsx)(`div`,{style:{height:`100%`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:`13px`},children:`Dragging — custom bg via --dnd-dragging-bg`})}),(0,o.jsx)(i,{isDropZone:!0,isDragDisabled:!0,style:{height:`80px`,borderRadius:`8px`,border:`2px dashed #0082c9`},children:(0,o.jsx)(`div`,{style:{height:`100%`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:`13px`},children:`Disabled — reduced via --dnd-disabled-opacity: 0.25`})})]})}),parameters:{docs:{description:{story:"One wrapper sets all three -- the variables are listed under CSS variables on this page. The first box is held in the dragging state for `--dnd-dragging-bg`; drag a file over it to see `--dnd-accept-bg`. The second box is there for `--dnd-disabled-opacity`, which only `isDragDisabled` switches on."},source:{code:`<div
  style={{
    "--dnd-dragging-bg": "#e6f3fb",
    "--dnd-accept-bg": "#cce5f6",
    "--dnd-disabled-opacity": "0.25",
  }}
>
  <DragAndDrop dragging>
    <div>Dragging</div>
  </DragAndDrop>
  <DragAndDrop isDragDisabled>
    <div>Disabled</div>
  </DragAndDrop>
</div>`}}}},h=[`Default`,`WithDraggingState`,`Disabled`,`NestedTargets`,`CssCustomization`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <InteractiveDropZone {...args} />,
  parameters: {
    docs: {
      description: {
        story: "The usual setup: the host keeps its own drag flag and passes it back. Drag files from your desktop over the box to see the background change and the dropped files arrive in the Actions panel (\`onDragOver\`, \`dragging\`, \`onDrop\`)."
      },
      source: {
        code: \`const [dragging, setDragging] = useState(false);

<DragAndDrop
  dragging={dragging}
  onDragOver={(isDragActive) => setDragging(isDragActive)}
  onDragLeave={() => setDragging(false)}
  onDrop={(files) => {
    setDragging(false);
    upload(files);
  }}
>
  <div>Drag files here</div>
</DragAndDrop>\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <InteractiveDropZone {...args} />,
  args: {
    dragging: true
  },
  parameters: {
    docs: {
      description: {
        story: "The drag background held on without an actual drag, to check how the highlight looks in each theme (\`dragging\`). Drag a file over it to see the stronger accept colour on top."
      },
      source: {
        code: \`<DragAndDrop dragging onDrop={(files) => upload(files)}>
  <div>Drop files here</div>
</DragAndDrop>\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <InteractiveDropZone {...args} />,
  args: {
    isDragDisabled: true
  },
  parameters: {
    docs: {
      description: {
        story: "A target the user may not upload to, faded to 40% (\`isDragDisabled\`). The fade is only a look: drop a file and it still arrives in the Actions panel, so the host has to ignore it in \`onDrop\`."
      },
      source: {
        code: \`<DragAndDrop
  isDragDisabled
  onDrop={(files) => {
    if (canUpload) upload(files);
  }}
>
  <div>Drag files here</div>
</DragAndDrop>\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <NestedTargetsDemo {...args} />,
  args: {
    isDropZone: true
  },
  parameters: {
    docs: {
      description: {
        story: "A folder row inside a panel that also takes files. Drop a file on the inner box: with \`isDropZone\` on, the outer counter goes up and the inner one does not, because the drop is handed to the outer target. Turn \`isDropZone\` off in the Controls panel below and the inner box keeps the drop."
      },
      source: {
        code: \`<DragAndDrop onDrop={uploadToPanel}>
  <div>Panel</div>
  <DragAndDrop isDropZone onDrop={uploadToFolder}>
    <div>Folder</div>
  </DragAndDrop>
</DragAndDrop>\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "400px"
  }}>
      <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      "--dnd-dragging-bg": "#e6f3fb",
      "--dnd-accept-bg": "#cce5f6",
      "--dnd-disabled-opacity": "0.25"
    } as CSSProperties}>
        <DragAndDrop isDropZone dragging style={{
        height: "120px",
        borderRadius: "8px"
      }}>
          <div style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px"
        }}>
            Dragging — custom bg via --dnd-dragging-bg
          </div>
        </DragAndDrop>

        <DragAndDrop isDropZone isDragDisabled style={{
        height: "80px",
        borderRadius: "8px",
        border: "2px dashed #0082c9"
      }}>
          <div style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px"
        }}>
            Disabled — reduced via --dnd-disabled-opacity: 0.25
          </div>
        </DragAndDrop>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`One wrapper sets all three -- the variables are listed under CSS variables on this page. The first box is held in the dragging state for \\\`--dnd-dragging-bg\\\`; drag a file over it to see \\\`--dnd-accept-bg\\\`. The second box is there for \\\`--dnd-disabled-opacity\\\`, which only \\\`isDragDisabled\\\` switches on.\`
      },
      source: {
        code: \`<div
  style={{
    "--dnd-dragging-bg": "#e6f3fb",
    "--dnd-accept-bg": "#cce5f6",
    "--dnd-disabled-opacity": "0.25",
  }}
>
  <DragAndDrop dragging>
    <div>Dragging</div>
  </DragAndDrop>
  <DragAndDrop isDragDisabled>
    <div>Disabled</div>
  </DragAndDrop>
</div>\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}}})))()}g();export{m as CssCustomization,l as Default,d as Disabled,p as NestedTargets,u as WithDraggingState,h as __namedExportsOrder,s as default};