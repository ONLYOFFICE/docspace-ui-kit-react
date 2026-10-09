import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./tab-item-Cu1aopHu.js";var a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{a=t(),r(),o=n(),{fn:s}=__STORYBOOK_MODULE_TEST__,c={title:`UI/Navigation/TabItem`,component:i,parameters:{design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0`}},argTypes:{label:{control:`text`,description:`Text of the pill: a string or a React node, cut off with an ellipsis when it does not fit`},isActive:{control:`boolean`,description:`Whether the pill starts selected. The pill then keeps its selected state itself after clicks; a change of this prop re-syncs it`,table:{defaultValue:{summary:`false`}}},isDisabled:{control:`boolean`,description:`Ignores clicks and dims the pill to half opacity; a pill that is also selected keeps its full selected look`,table:{defaultValue:{summary:`false`}}},allowNoSelection:{control:`boolean`,description:"Keeps the selected look the pill had on mount: neither clicks nor later `isActive` changes alter it",table:{defaultValue:{summary:`false`}}},withMultiSelect:{control:`boolean`,description:`Lets a click on a selected pill deselect it. Without it a selected pill stays selected`,table:{defaultValue:{summary:`false`}}},lockLastSelection:{control:`boolean`,description:"Drops a click on an already selected pill entirely, so `onSelect` does not fire for it either",table:{defaultValue:{summary:`false`}}},onSelect:{action:`onSelect`,description:"Called with the click event on every click that neither `isDisabled` nor `lockLastSelection` blocks"},className:{control:`text`,description:`Extra class name on the outer element`},dataTestId:{control:`text`,description:"`data-testid` of the outer element",table:{defaultValue:{summary:`"tab-item"`}}}}},l=e=>(0,o.jsx)(`div`,{style:{display:`flex`,gap:`16px`,padding:`16px`,borderRadius:`6px`},children:e.children}),u={render:e=>(0,o.jsx)(i,{...e}),args:{label:`Tab Item`,isActive:!1,onSelect:s()},parameters:{docs:{description:{story:`An unselected pill: click it to see it fill in, and change any other prop live in the Controls panel below.`},source:{code:`<TabItem label="Tab Item" onSelect={handleSelect} />`}}}},d={render:e=>(0,o.jsx)(i,{...e}),args:{label:`Active Tab`,isActive:!0},parameters:{docs:{description:{story:"The filled look of a selected pill, for a filter that is already applied when the screen opens (`isActive`)."},source:{code:`<TabItem label="Active Tab" isActive />`}}}},f={render:e=>(0,o.jsx)(i,{...e}),args:{label:`Disabled Tab`,isActive:!1,isDisabled:!0},parameters:{docs:{description:{story:"A dimmed pill that ignores clicks, for an option that does not apply right now (`isDisabled`)."},source:{code:`<TabItem label="Disabled Tab" isDisabled />`}}}},p=()=>(0,o.jsx)(i,{label:(0,o.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:`8px`},children:[(0,o.jsx)(`span`,{style:{color:`#2DA7DB`},children:`●`}),(0,o.jsx)(`span`,{children:`Tab with Icon`})]})}),m={render:()=>(0,o.jsx)(p,{}),parameters:{docs:{description:{story:"Tab with a React node as label, allowing custom content like icons alongside text. The label renders inside a `<p>`, so the node has to be phrasing content -- a `<span>`, not a `<div>`."},source:{code:`<TabItem
  label={
    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <span style={{ color: "#2DA7DB" }}>●</span>
      <span>Tab with Icon</span>
    </span>
  }
/>`}}}},h=()=>{let[e,t]=(0,a.useState)(`tab1`);return(0,o.jsxs)(l,{children:[(0,o.jsx)(i,{label:`First Tab`,isActive:e===`tab1`,onSelect:()=>t(`tab1`)}),(0,o.jsx)(i,{label:`Second Tab`,isActive:e===`tab2`,onSelect:()=>t(`tab2`)}),(0,o.jsx)(i,{label:`Third Tab`,isActive:e===`tab3`,onSelect:()=>t(`tab3`)})]})},g={render:()=>(0,o.jsx)(h,{}),parameters:{docs:{description:{story:`Interactive tab group demonstrating single-selection behavior. Clicking a tab selects it and deselects others.`},source:{code:`<TabItem label="First Tab" isActive={activeTab === "tab1"} onSelect={() => setActiveTab("tab1")} />
<TabItem label="Second Tab" isActive={activeTab === "tab2"} onSelect={() => setActiveTab("tab2")} />
<TabItem label="Third Tab" isActive={activeTab === "tab3"} onSelect={() => setActiveTab("tab3")} />`}}}},_=()=>{let[e,t]=(0,a.useState)(new Set([`documents`])),n=e=>{t(t=>{let n=new Set(t);return n.has(e)?n.delete(e):n.add(e),n})};return(0,o.jsxs)(l,{children:[(0,o.jsx)(i,{label:`Documents`,isActive:e.has(`documents`),onSelect:()=>n(`documents`),withMultiSelect:!0}),(0,o.jsx)(i,{label:`Images`,isActive:e.has(`images`),onSelect:()=>n(`images`),withMultiSelect:!0}),(0,o.jsx)(i,{label:`Videos`,isActive:e.has(`videos`),onSelect:()=>n(`videos`),withMultiSelect:!0})]})},v={render:()=>(0,o.jsx)(_,{}),parameters:{docs:{description:{story:"Three pills that toggle independently, for a filter where several values can apply at once: a click on a selected pill deselects it (`withMultiSelect`)."},source:{code:`<TabItem label="Documents" isActive withMultiSelect onSelect={handleToggle} />
<TabItem label="Images" withMultiSelect onSelect={handleToggle} />
<TabItem label="Videos" withMultiSelect onSelect={handleToggle} />`}}}},y={render:()=>(0,o.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,"--tab-item-active-bg":`#1f6f43`,"--tab-item-active-text":`#ffffff`,"--tab-item-border":`1px dashed #8a8a8a`,"--tab-item-radius":`6px`,"--tab-item-padding":`6px 20px`,"--tab-item-disabled-opacity":`0.3`},children:[(0,o.jsx)(i,{label:`Documents`,isActive:!0}),(0,o.jsx)(i,{label:`Images`}),(0,o.jsx)(i,{label:`Videos`,isDisabled:!0})]}),parameters:{docs:{description:{story:`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. **Documents** is selected, for the two active variables; **Images** is unselected, for the border; **Videos** is disabled, for the opacity. Radius and padding show on all three.`},source:{code:`<div
  style={{
    "--tab-item-active-bg": "#1f6f43",
    "--tab-item-active-text": "#ffffff",
    "--tab-item-border": "1px dashed #8a8a8a",
    "--tab-item-radius": "6px",
    "--tab-item-padding": "6px 20px",
    "--tab-item-disabled-opacity": "0.3",
  }}
>
  <TabItem label="Documents" isActive />
  <TabItem label="Images" />
  <TabItem label="Videos" isDisabled />
</div>`}}}},b=[`Default`,`ActiveState`,`DisabledState`,`WithReactNodeLabel`,`TabGroup`,`MultiSelect`,`CssCustomization`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <TabItem {...args} />,
  args: {
    label: "Tab Item",
    isActive: false,
    onSelect: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "An unselected pill: click it to see it fill in, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<TabItem label="Tab Item" onSelect={handleSelect} />\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <TabItem {...args} />,
  args: {
    label: "Active Tab",
    isActive: true
  },
  parameters: {
    docs: {
      description: {
        story: "The filled look of a selected pill, for a filter that is already applied when the screen opens (\`isActive\`)."
      },
      source: {
        code: \`<TabItem label="Active Tab" isActive />\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <TabItem {...args} />,
  args: {
    label: "Disabled Tab",
    isActive: false,
    isDisabled: true
  },
  parameters: {
    docs: {
      description: {
        story: "A dimmed pill that ignores clicks, for an option that does not apply right now (\`isDisabled\`)."
      },
      source: {
        code: \`<TabItem label="Disabled Tab" isDisabled />\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <WithReactNodeTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Tab with a React node as label, allowing custom content like icons alongside text. The label renders inside a \`<p>\`, so the node has to be phrasing content -- a \`<span>\`, not a \`<div>\`."
      },
      source: {
        code: \`<TabItem
  label={
    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <span style={{ color: "#2DA7DB" }}>●</span>
      <span>Tab with Icon</span>
    </span>
  }
/>\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <TabGroupTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Interactive tab group demonstrating single-selection behavior. Clicking a tab selects it and deselects others."
      },
      source: {
        code: \`<TabItem label="First Tab" isActive={activeTab === "tab1"} onSelect={() => setActiveTab("tab1")} />
<TabItem label="Second Tab" isActive={activeTab === "tab2"} onSelect={() => setActiveTab("tab2")} />
<TabItem label="Third Tab" isActive={activeTab === "tab3"} onSelect={() => setActiveTab("tab3")} />\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <MultiSelectTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Three pills that toggle independently, for a filter where several values can apply at once: a click on a selected pill deselects it (\`withMultiSelect\`)."
      },
      source: {
        code: \`<TabItem label="Documents" isActive withMultiSelect onSelect={handleToggle} />
<TabItem label="Images" withMultiSelect onSelect={handleToggle} />
<TabItem label="Videos" withMultiSelect onSelect={handleToggle} />\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: "8px",
    "--tab-item-active-bg": "#1f6f43",
    "--tab-item-active-text": "#ffffff",
    "--tab-item-border": "1px dashed #8a8a8a",
    "--tab-item-radius": "6px",
    "--tab-item-padding": "6px 20px",
    "--tab-item-disabled-opacity": "0.3"
  } as CSSProperties}>
      <TabItem label="Documents" isActive />
      <TabItem label="Images" />
      <TabItem label="Videos" isDisabled />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. **Documents** is selected, for the two active variables; **Images** is unselected, for the border; **Videos** is disabled, for the opacity. Radius and padding show on all three.\`
      },
      source: {
        code: \`<div
  style={{
    "--tab-item-active-bg": "#1f6f43",
    "--tab-item-active-text": "#ffffff",
    "--tab-item-border": "1px dashed #8a8a8a",
    "--tab-item-radius": "6px",
    "--tab-item-padding": "6px 20px",
    "--tab-item-disabled-opacity": "0.3",
  }}
>
  <TabItem label="Documents" isActive />
  <TabItem label="Images" />
  <TabItem label="Videos" isDisabled />
</div>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}}})))()}x();export{d as ActiveState,y as CssCustomization,u as Default,f as DisabledState,v as MultiSelect,g as TabGroup,m as WithReactNodeLabel,b as __namedExportsOrder,c as default};