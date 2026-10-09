import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,r,t as i}from"./floating-button-CUTXgfzQ.js";var a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{n(),a=t(),o={title:`UI/Interactive elements/FloatingButton`,component:i,parameters:{design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=1053-45015&mode=design&t=TBNCKMQKQMxr44IZ-0`}},argTypes:{icon:{control:`select`,options:Object.values(r),description:"Which of the built-in icons is drawn in the middle of the circle; ignored when `iconUrl` is set",table:{defaultValue:{summary:`other`}}},iconUrl:{control:`text`,description:`URL of an image drawn in the middle instead of the built-in icon, 20px wide`},percent:{control:{type:`number`,min:0,max:100},description:`How much of the ring is filled, from 0 to 100; left unset, the ring spins instead`},withoutProgress:{control:`boolean`,description:`Leaves the ring out entirely, so only the bare circle shows`,table:{defaultValue:{summary:`false`}}},alert:{control:`boolean`,description:"Puts a red exclamation mark on the circle's upper edge; `stopped` wins over it",table:{defaultValue:{summary:`false`}}},completed:{control:`boolean`,description:`Marks the operation finished: the ring fades out, the circle pulses once and a green tick appears`,table:{defaultValue:{summary:`false`}}},stopped:{control:`boolean`,description:"Puts a stop mark on the circle's upper edge, for an operation the user aborted; wins over `alert` and `completed`",table:{defaultValue:{summary:`false`}}},withoutStatus:{control:`boolean`,description:"Hides the badge on the circle's upper edge whatever `stopped`, `alert` and `completed` say",table:{defaultValue:{summary:`false`}}},color:{control:`color`,description:`CSS colour of the circle and the ring; left unset, the accent colour is used`},showCancelButton:{control:`boolean`,description:`Adds a cross, shown while the pointer is over the badge, that the host's layout must place beside the circle: on its own it lands under the circle and cannot be seen`,table:{defaultValue:{summary:`false`}}},showCloseIcon:{control:`boolean`,description:"Keeps the cross from `showCancelButton` visible without hovering",table:{defaultValue:{summary:`false`}}},onClick:{action:`onClick`,description:`Called with the click event when the circle is clicked`},clearUploadedFilesHistory:{action:`clearUploadedFilesHistory`,description:`Called when the cross beside the circle is clicked`},id:{control:`text`,description:"`id` of the circle, not of the wrapper that positions it"},className:{control:`text`,description:`Extra class on the circle, after the component's own`},style:{control:`object`,description:`Inline style on the circle`}},decorators:[e=>(0,a.jsx)(`div`,{style:{height:`70px`,width:`100px`,display:`flex`,justifyContent:`flex-start`,position:`relative`,padding:`20px`},children:(0,a.jsx)(e,{})})]},s={render:e=>(0,a.jsx)(i,{...e}),args:{icon:r.upload},parameters:{docs:{description:{story:`An upload that has just started, with no progress value yet, so the ring spins; change any other prop live in the Controls panel below.`},source:{code:`<FloatingButton icon={FloatingButtonIcons.upload} onClick={openPanel} />`}}}},c=()=>(0,a.jsx)(i,{icon:r.upload,percent:45}),l={render:()=>(0,a.jsx)(c,{}),parameters:{docs:{description:{story:`Floating button showing upload progress at 45%. The circular progress indicator fills as the percentage increases.`},source:{code:`<FloatingButton icon={FloatingButtonIcons.upload} percent={45} />`}}}},u=()=>(0,a.jsx)(i,{icon:r.upload,alert:!0}),d={render:()=>(0,a.jsx)(u,{}),parameters:{docs:{description:{story:"A red exclamation mark on the circle's upper edge, for an operation that needs the user's attention, such as one that finished with errors (`alert`)."},source:{code:`<FloatingButton icon={FloatingButtonIcons.upload} alert />`}}}},f=()=>(0,a.jsx)(i,{icon:r.upload,completed:!0,percent:100}),p={render:()=>(0,a.jsx)(f,{}),parameters:{docs:{description:{story:"A finished operation: the ring fades out, the circle pulses once and a green tick stays on its upper edge (`completed`)."},source:{code:`<FloatingButton icon={FloatingButtonIcons.upload} completed percent={100} />`}}}},m=()=>(0,a.jsx)(i,{icon:r.trash,completed:!0,stopped:!0}),h={render:()=>(0,a.jsx)(m,{}),parameters:{docs:{description:{story:`Floating button in stopped state. Shows the minus status icon when the user aborts a running operation, instead of the success checkmark.`},source:{code:`<FloatingButton icon={FloatingButtonIcons.trash} completed stopped />`}}}},g=()=>{let e=[{icon:r.upload,label:`upload`},{icon:r.trash,label:`trash`},{icon:r.move,label:`move`},{icon:r.duplicate,label:`duplicate`},{icon:r.download,label:`download`},{icon:r.copy,label:`copy`},{icon:r.deletePermanently,label:`deletePermanently`},{icon:r.exportIndex,label:`exportIndex`},{icon:r.markAsRead,label:`markAsRead`},{icon:r.backup,label:`backup`},{icon:r.plus,label:`plus`},{icon:r.minus,label:`minus`},{icon:r.refresh,label:`refresh`},{icon:r.dots,label:`dots`},{icon:r.arrow,label:`arrow`},{icon:r.other,label:`other`}];return(0,a.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(4, 100px)`,rowGap:`8px`,columnGap:`24px`},children:e.map(({icon:e,label:t})=>(0,a.jsxs)(`div`,{style:{position:`relative`,width:100,height:70},children:[(0,a.jsx)(i,{icon:e}),(0,a.jsx)(`span`,{style:{position:`absolute`,top:56,insetInlineStart:0,width:48,textAlign:`center`,fontSize:`11px`,color:`#666`},children:t})]},t))})},_={render:()=>(0,a.jsx)(g,{}),decorators:[],parameters:{docs:{description:{story:`Floating buttons with different icon variants. Shows the available built-in icons for common operations.`},source:{code:`<FloatingButton icon={FloatingButtonIcons.upload} />
<FloatingButton icon={FloatingButtonIcons.trash} />
<FloatingButton icon={FloatingButtonIcons.move} />
<FloatingButton icon={FloatingButtonIcons.duplicate} />
<FloatingButton icon={FloatingButtonIcons.download} />
<FloatingButton icon={FloatingButtonIcons.copy} />
<FloatingButton icon={FloatingButtonIcons.deletePermanently} />
<FloatingButton icon={FloatingButtonIcons.exportIndex} />
<FloatingButton icon={FloatingButtonIcons.markAsRead} />
<FloatingButton icon={FloatingButtonIcons.backup} />
<FloatingButton icon={FloatingButtonIcons.plus} />
<FloatingButton icon={FloatingButtonIcons.minus} />
<FloatingButton icon={FloatingButtonIcons.refresh} />
<FloatingButton icon={FloatingButtonIcons.dots} />
<FloatingButton icon={FloatingButtonIcons.arrow} />
<FloatingButton icon={FloatingButtonIcons.other} />`}}}},v={render:()=>(0,a.jsx)(i,{icon:r.upload,withoutProgress:!0}),parameters:{docs:{description:{story:"The bare circle with no ring, for an operation whose progress is not worth showing, or a badge that only opens a panel (`withoutProgress`)."},source:{code:`<FloatingButton icon={FloatingButtonIcons.upload} withoutProgress />`}}}},y={render:()=>(0,a.jsx)(i,{icon:r.move,completed:!0,withoutStatus:!0}),parameters:{docs:{description:{story:"A finished move with no tick on the circle: the ring still fades out, but the badge on the upper edge is hidden whatever the state props say (`withoutStatus`)."},source:{code:`<FloatingButton icon={FloatingButtonIcons.move} completed withoutStatus />`}}}},b={render:()=>(0,a.jsx)(i,{icon:r.upload,percent:45,color:`#2e8b57`}),parameters:{docs:{description:{story:"The circle, the ring and the accent parts of the icon in a colour of your own instead of the accent colour, for example one per kind of operation (`color`)."},source:{code:`<FloatingButton icon={FloatingButtonIcons.upload} percent={45} color="#2e8b57" />`}}}},x=`data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Crect%20x%3D%223%22%20y%3D%222%22%20width%3D%2214%22%20height%3D%2216%22%20rx%3D%222%22%20fill%3D%22%23ffffff%22%2F%3E%3Crect%20x%3D%226%22%20y%3D%226%22%20width%3D%228%22%20height%3D%221.5%22%20fill%3D%22%238fb3d9%22%2F%3E%3Crect%20x%3D%226%22%20y%3D%229.5%22%20width%3D%228%22%20height%3D%221.5%22%20fill%3D%22%238fb3d9%22%2F%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%225%22%20height%3D%221.5%22%20fill%3D%22%238fb3d9%22%2F%3E%3C%2Fsvg%3E`,S={render:()=>(0,a.jsx)(i,{iconUrl:x}),parameters:{docs:{description:{story:"An image of your own in the middle, 20px wide, for an operation none of the built-in icons fits (`iconUrl`)."},source:{code:`<FloatingButton iconUrl="/images/operation.svg" />`}}}},C={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,gap:`24px`,"--floating-circle-button-background":`#7c3aed`,"--floating-button-shadow":`0 4px 20px rgba(124,58,237,0.5)`,"--floating-button-icon":`#fde68a`},children:[(0,a.jsx)(`div`,{style:{position:`relative`,width:100,height:70},children:(0,a.jsx)(i,{icon:r.upload})}),(0,a.jsx)(`div`,{style:{position:`relative`,width:100,height:70},children:(0,a.jsx)(i,{icon:r.move})})]}),decorators:[],parameters:{docs:{description:{story:`Two buttons under one wrapper that sets the background, the shadow and the icon colour -- the variables are listed under CSS variables on this page.

- **Upload** — the background and the shadow; its icon is one of the accent icons (upload, trash, deletePermanently, other), whose shapes are painted in the background colour, so the icon colour does not reach it
- **Move** — the icon colour, on an icon that is not an accent one`},source:{code:`<div
  style={{
    "--floating-circle-button-background": "#7c3aed",
    "--floating-button-shadow": "0 4px 20px rgba(124,58,237,0.5)",
    "--floating-button-icon": "#fde68a",
  }}
>
  <FloatingButton icon={FloatingButtonIcons.upload} />
  <FloatingButton icon={FloatingButtonIcons.move} />
</div>`}}}},w=[`Default`,`WithProgress`,`WithAlert`,`Completed`,`Stopped`,`IconVariants`,`WithoutProgress`,`WithoutStatusBadge`,`CustomColor`,`CustomIconImage`,`CssCustomization`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <FloatingButton {...args} />,
  args: {
    icon: FloatingButtonIcons.upload
  },
  parameters: {
    docs: {
      description: {
        story: "An upload that has just started, with no progress value yet, so the ring spins; change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<FloatingButton icon={FloatingButtonIcons.upload} onClick={openPanel} />\`
      }
    }
  }
}`,...s.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <WithProgressTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Floating button showing upload progress at 45%. The circular progress indicator fills as the percentage increases."
      },
      source: {
        code: \`<FloatingButton icon={FloatingButtonIcons.upload} percent={45} />\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <WithAlertTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A red exclamation mark on the circle's upper edge, for an operation that needs the user's attention, such as one that finished with errors (\\\`alert\\\`)."
      },
      source: {
        code: \`<FloatingButton icon={FloatingButtonIcons.upload} alert />\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <CompletedTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A finished operation: the ring fades out, the circle pulses once and a green tick stays on its upper edge (\\\`completed\\\`)."
      },
      source: {
        code: \`<FloatingButton icon={FloatingButtonIcons.upload} completed percent={100} />\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <StoppedTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Floating button in stopped state. Shows the minus status icon when the user aborts a running operation, instead of the success checkmark."
      },
      source: {
        code: \`<FloatingButton icon={FloatingButtonIcons.trash} completed stopped />\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <IconVariantsTemplate />,
  decorators: [],
  parameters: {
    docs: {
      description: {
        story: "Floating buttons with different icon variants. Shows the available built-in icons for common operations."
      },
      source: {
        code: \`<FloatingButton icon={FloatingButtonIcons.upload} />
<FloatingButton icon={FloatingButtonIcons.trash} />
<FloatingButton icon={FloatingButtonIcons.move} />
<FloatingButton icon={FloatingButtonIcons.duplicate} />
<FloatingButton icon={FloatingButtonIcons.download} />
<FloatingButton icon={FloatingButtonIcons.copy} />
<FloatingButton icon={FloatingButtonIcons.deletePermanently} />
<FloatingButton icon={FloatingButtonIcons.exportIndex} />
<FloatingButton icon={FloatingButtonIcons.markAsRead} />
<FloatingButton icon={FloatingButtonIcons.backup} />
<FloatingButton icon={FloatingButtonIcons.plus} />
<FloatingButton icon={FloatingButtonIcons.minus} />
<FloatingButton icon={FloatingButtonIcons.refresh} />
<FloatingButton icon={FloatingButtonIcons.dots} />
<FloatingButton icon={FloatingButtonIcons.arrow} />
<FloatingButton icon={FloatingButtonIcons.other} />\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <FloatingButton icon={FloatingButtonIcons.upload} withoutProgress />,
  parameters: {
    docs: {
      description: {
        story: "The bare circle with no ring, for an operation whose progress is not worth showing, or a badge that only opens a panel (\`withoutProgress\`)."
      },
      source: {
        code: \`<FloatingButton icon={FloatingButtonIcons.upload} withoutProgress />\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <FloatingButton icon={FloatingButtonIcons.move} completed withoutStatus />,
  parameters: {
    docs: {
      description: {
        story: "A finished move with no tick on the circle: the ring still fades out, but the badge on the upper edge is hidden whatever the state props say (\`withoutStatus\`)."
      },
      source: {
        code: \`<FloatingButton icon={FloatingButtonIcons.move} completed withoutStatus />\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <FloatingButton icon={FloatingButtonIcons.upload} percent={45} color="#2e8b57" />,
  parameters: {
    docs: {
      description: {
        story: "The circle, the ring and the accent parts of the icon in a colour of your own instead of the accent colour, for example one per kind of operation (\`color\`)."
      },
      source: {
        code: \`<FloatingButton icon={FloatingButtonIcons.upload} percent={45} color="#2e8b57" />\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <FloatingButton iconUrl={sampleIconUrl} />,
  parameters: {
    docs: {
      description: {
        story: "An image of your own in the middle, 20px wide, for an operation none of the built-in icons fits (\`iconUrl\`)."
      },
      source: {
        code: \`<FloatingButton iconUrl="/images/operation.svg" />\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: "24px",
    "--floating-circle-button-background": "#7c3aed",
    "--floating-button-shadow": "0 4px 20px rgba(124,58,237,0.5)",
    "--floating-button-icon": "#fde68a"
  } as CSSProperties}>
      <div style={{
      position: "relative",
      width: 100,
      height: 70
    }}>
        <FloatingButton icon={FloatingButtonIcons.upload} />
      </div>
      <div style={{
      position: "relative",
      width: 100,
      height: 70
    }}>
        <FloatingButton icon={FloatingButtonIcons.move} />
      </div>
    </div>,
  decorators: [],
  parameters: {
    docs: {
      description: {
        story: \`Two buttons under one wrapper that sets the background, the shadow and the icon colour -- the variables are listed under CSS variables on this page.

- **Upload** — the background and the shadow; its icon is one of the accent icons (upload, trash, deletePermanently, other), whose shapes are painted in the background colour, so the icon colour does not reach it
- **Move** — the icon colour, on an icon that is not an accent one\`
      },
      source: {
        code: \`<div
  style={{
    "--floating-circle-button-background": "#7c3aed",
    "--floating-button-shadow": "0 4px 20px rgba(124,58,237,0.5)",
    "--floating-button-icon": "#fde68a",
  }}
>
  <FloatingButton icon={FloatingButtonIcons.upload} />
  <FloatingButton icon={FloatingButtonIcons.move} />
</div>\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}}})))()}T();export{p as Completed,C as CssCustomization,b as CustomColor,S as CustomIconImage,s as Default,_ as IconVariants,h as Stopped,d as WithAlert,l as WithProgress,v as WithoutProgress,y as WithoutStatusBadge,w as __namedExportsOrder,o as default};