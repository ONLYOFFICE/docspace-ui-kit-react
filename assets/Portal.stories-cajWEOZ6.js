import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./Portal-CPoM_Ror.js";import{n as a,r as o,t as s}from"./button-DjDXE7uo.js";var c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{c=`_popup_ouwzg_1`,l=`_blue_ouwzg_22`,u=`_purple_ouwzg_25`,d=`_green_ouwzg_28`,f=`_top30_ouwzg_31`,p=`_top50_ouwzg_34`,m=`_top70_ouwzg_37`,h=`_customContainer_ouwzg_41`,g={popup:c,blue:l,purple:u,green:d,top30:f,top50:p,top70:m,customContainer:h}})))()}var v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N;function P(){return(P=e((()=>{v=t(),a(),r(),_(),y=n(),b={title:`UI/Layout/Portal`,component:i,parameters:{},argTypes:{element:{description:`React node to render inside the portal`,control:!1},visible:{control:`boolean`,description:`Whether the content is rendered; turning it off unmounts the content, so anything it held is lost`,table:{defaultValue:{summary:`true`}}},appendTo:{description:`Element to append the content to; when it is null on a render the content goes to the end of document.body`,control:!1,table:{defaultValue:{summary:`null`}}}}},x={render:e=>{let[t,n]=(0,v.useState)(null);return(0,y.jsxs)(`div`,{ref:n,className:g.customContainer,children:[(0,y.jsx)(`p`,{children:`Content outside portal`}),t&&(0,y.jsx)(i,{...e,appendTo:t})]})},args:{element:(0,y.jsx)(`div`,{className:g.popup,children:`This content is rendered in a portal`}),visible:!0},parameters:{docs:{description:{story:"The content passed in `element` shows inside the dashed container that owns it, not beside the text it was declared next to (`appendTo`). Switch `visible` in the Controls panel below to unmount and mount it again."},source:{code:`<Portal element={<div>Portal content</div>} visible appendTo={containerElement} />`}}}},S={render:e=>{let[t,n]=(0,v.useState)(null);return(0,y.jsxs)(`div`,{ref:n,className:g.customContainer,children:[(0,y.jsx)(`p`,{children:`Portal is hidden (visible=false)`}),t&&(0,y.jsx)(i,{...e,appendTo:t})]})},args:{element:(0,y.jsx)(`div`,{className:g.popup,children:`You should not see this`}),visible:!1},parameters:{docs:{description:{story:"The container stays empty: with `visible` off the content is not hidden but not mounted at all, so nothing of it reaches the DOM."},source:{code:`<Portal element={<div>Hidden content</div>} visible={false} appendTo={containerElement} />`}}}},C=()=>{let[e,t]=(0,v.useState)(null);return(0,y.jsxs)(`div`,{children:[(0,y.jsx)(`p`,{children:`Main content`}),(0,y.jsxs)(`div`,{ref:t,className:g.customContainer,children:[(0,y.jsx)(`p`,{children:`Custom container (portal target)`}),e&&(0,y.jsx)(i,{element:(0,y.jsx)(`div`,{className:`${g.popup} ${g.blue}`,children:`Content rendered inside custom container`}),appendTo:e})]})]})},w={render:()=>(0,y.jsx)(C,{}),parameters:{docs:{description:{story:`Portal rendering into a specific custom container element instead of document.body.`},source:{code:`<Portal
  element={<div>Custom container content</div>}
  appendTo={customContainerElement}
/>`}}}},T=()=>{let[e,t]=(0,v.useState)(null);return(0,y.jsxs)(`div`,{ref:t,className:g.customContainer,children:[(0,y.jsx)(`p`,{children:`Multiple portals example`}),e&&(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(i,{element:(0,y.jsx)(`div`,{className:`${g.popup} ${g.blue} ${g.top30}`,children:`First Portal`}),appendTo:e}),(0,y.jsx)(i,{element:(0,y.jsx)(`div`,{className:`${g.popup} ${g.purple} ${g.top50}`,children:`Second Portal`}),appendTo:e}),(0,y.jsx)(i,{element:(0,y.jsx)(`div`,{className:`${g.popup} ${g.green} ${g.top70}`,children:`Third Portal`}),appendTo:e})]})]})},E={render:()=>(0,y.jsx)(T,{}),parameters:{docs:{description:{story:`Three portals share one container: each is appended after the last, and the portals do nothing about overlap, so every node carries its own position.`},source:{code:`<Portal element={<div>First Portal</div>} appendTo={container} />
<Portal element={<div>Second Portal</div>} appendTo={container} />
<Portal element={<div>Third Portal</div>} appendTo={container} />`}}}},D=()=>{let[e,t]=(0,v.useState)(null),[n,r]=(0,v.useState)(!1);return(0,y.jsxs)(`div`,{ref:t,className:g.customContainer,children:[(0,y.jsx)(s,{label:n?`Hide Portal`:`Show Portal`,primary:!0,size:o.small,onClick:()=>r(!n)}),e&&(0,y.jsx)(i,{element:(0,y.jsxs)(`div`,{className:g.popup,children:[(0,y.jsx)(`p`,{children:`Portal content`}),(0,y.jsx)(s,{label:`Close`,size:o.extraSmall,onClick:()=>r(!1)})]}),visible:n,appendTo:e})]})},O={render:()=>(0,y.jsx)(D,{}),parameters:{docs:{description:{story:"Click Show Portal and Close to open and close the content from outside and from inside it. Each close unmounts the content (`visible`), so state held inside it starts over on the next open."},source:{code:`<Portal
  element={<div>Toggleable content</div>}
  visible={isVisible}
  appendTo={container}
/>`}}}},k=()=>(0,y.jsxs)(`div`,{className:g.customContainer,children:[(0,y.jsx)(`p`,{children:`The portal is declared inside this box`}),(0,y.jsx)(i,{element:(0,y.jsx)(`div`,{className:`${g.popup} ${g.green}`,children:`Rendered at the end of the page body`})})]}),A={render:()=>(0,y.jsx)(k,{}),parameters:{docs:{story:{inline:!1,height:`300px`},description:{story:"With no `appendTo`, the content leaves the dashed box it is declared in and lands at the end of the page body, centred on the window by its own fixed position."},source:{code:`<Portal element={<div style={{ position: "fixed" }}>Content</div>} />`}}}},j=()=>{let[e,t]=(0,v.useState)(null);return(0,y.jsxs)(`div`,{ref:t,className:g.customContainer,style:{"--portal-popup-bg":`#e6f3fb`,"--portal-popup-shadow":`0 4px 16px rgba(0, 130, 201, 0.3)`,"--portal-popup-radius":`12px`,"--portal-popup-padding":`24px 32px`,"--portal-popup-color":`#004f82`},children:[(0,y.jsx)(`p`,{children:`Portal target container`}),e&&(0,y.jsx)(i,{element:(0,y.jsx)(`div`,{className:g.popup,children:`Custom styled portal content`}),appendTo:e})]})},M={render:()=>(0,y.jsx)(j,{}),parameters:{docs:{description:{story:"Portal has no styles of its own, so the README lists no CSS variables for it: the `--portal-popup-*` variables set here belong to this page's demo popup, and are set on the container the portal appends to so the content picks them up there."},source:{code:`<div
  ref={setContainer}
  style={{
    "--portal-popup-bg": "#e6f3fb",
    "--portal-popup-shadow": "0 4px 16px rgba(0, 130, 201, 0.3)",
    "--portal-popup-radius": "12px",
    "--portal-popup-padding": "24px 32px",
    "--portal-popup-color": "#004f82",
  }}
>
  <Portal element={<div className="popup">Styled content</div>} appendTo={container} />
</div>`}}}},N=[`Default`,`Hidden`,`CustomContainer`,`MultiplePortals`,`ToggleVisibility`,`IntoDocumentBody`,`CssCustomization`],x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [container, setContainer] = useState<HTMLElement | null>(null);
    return <div ref={setContainer} className={styles.customContainer}>
        <p>Content outside portal</p>
        {container && <Portal {...args} appendTo={container} />}
      </div>;
  },
  args: {
    element: <div className={styles.popup}>This content is rendered in a portal</div>,
    visible: true
  },
  parameters: {
    docs: {
      description: {
        story: "The content passed in \`element\` shows inside the dashed container that owns it, not beside the text it was declared next to (\`appendTo\`). Switch \`visible\` in the Controls panel below to unmount and mount it again."
      },
      source: {
        code: \`<Portal element={<div>Portal content</div>} visible appendTo={containerElement} />\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [container, setContainer] = useState<HTMLElement | null>(null);
    return <div ref={setContainer} className={styles.customContainer}>
        <p>Portal is hidden (visible=false)</p>
        {container && <Portal {...args} appendTo={container} />}
      </div>;
  },
  args: {
    element: <div className={styles.popup}>You should not see this</div>,
    visible: false
  },
  parameters: {
    docs: {
      description: {
        story: "The container stays empty: with \`visible\` off the content is not hidden but not mounted at all, so nothing of it reaches the DOM."
      },
      source: {
        code: \`<Portal element={<div>Hidden content</div>} visible={false} appendTo={containerElement} />\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <CustomContainerTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Portal rendering into a specific custom container element instead of document.body."
      },
      source: {
        code: \`<Portal
  element={<div>Custom container content</div>}
  appendTo={customContainerElement}
/>\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <MultiplePortalsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Three portals share one container: each is appended after the last, and the portals do nothing about overlap, so every node carries its own position."
      },
      source: {
        code: \`<Portal element={<div>First Portal</div>} appendTo={container} />
<Portal element={<div>Second Portal</div>} appendTo={container} />
<Portal element={<div>Third Portal</div>} appendTo={container} />\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <ToggleVisibilityTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Click Show Portal and Close to open and close the content from outside and from inside it. Each close unmounts the content (\`visible\`), so state held inside it starts over on the next open."
      },
      source: {
        code: \`<Portal
  element={<div>Toggleable content</div>}
  visible={isVisible}
  appendTo={container}
/>\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <IntoDocumentBodyTemplate />,
  parameters: {
    docs: {
      // The fixed popup would cover the Docs page, so the story gets a frame.
      story: {
        inline: false,
        height: "300px"
      },
      description: {
        story: "With no \`appendTo\`, the content leaves the dashed box it is declared in and lands at the end of the page body, centred on the window by its own fixed position."
      },
      source: {
        code: \`<Portal element={<div style={{ position: "fixed" }}>Content</div>} />\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Portal has no styles of its own, so the README lists no CSS variables for it: the \`--portal-popup-*\` variables set here belong to this page's demo popup, and are set on the container the portal appends to so the content picks them up there."
      },
      source: {
        code: \`<div
  ref={setContainer}
  style={{
    "--portal-popup-bg": "#e6f3fb",
    "--portal-popup-shadow": "0 4px 16px rgba(0, 130, 201, 0.3)",
    "--portal-popup-radius": "12px",
    "--portal-popup-padding": "24px 32px",
    "--portal-popup-color": "#004f82",
  }}
>
  <Portal element={<div className="popup">Styled content</div>} appendTo={container} />
</div>\`
      }
    }
  }
}`,...M.parameters?.docs?.source}}}})))()}P();export{M as CssCustomization,w as CustomContainer,x as Default,S as Hidden,A as IntoDocumentBody,E as MultiplePortals,O as ToggleVisibility,N as __namedExportsOrder,b as default};