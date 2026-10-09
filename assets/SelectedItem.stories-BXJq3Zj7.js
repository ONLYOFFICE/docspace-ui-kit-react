import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{t as n}from"./rootTooltip-D3FzIvov.js";import{n as r}from"./tooltip-DcisrCmM.js";import{n as i,t as a}from"./catalog.folder.react-BLNaFnHq.js";import{n as o,t as s}from"./selected-item-CBMXxioB.js";var c,l,u;function d(){return(d=e((()=>{c=`_container_1a5jq_1`,l=`_containerInline_1a5jq_7`,u={container:c,containerInline:l}})))()}var f,p,m,h,g,_,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{i(),r(),o(),d(),f=t(),{fn:p}=__STORYBOOK_MODULE_TEST__,m={title:`UI/Data display/SelectedItem`,component:s,parameters:{},argTypes:{label:{control:`text`,description:`Text of the chip. An empty label renders nothing at all`},isInline:{control:`boolean`,description:`Shrinks the chip to its content; turned off, the chip fills the width of its container`,table:{defaultValue:{summary:`true`}}},isDisabled:{control:`boolean`,description:"Greys out the label and the cross and stops `onClose` and `onClick` from firing",table:{defaultValue:{summary:`false`}}},propKey:{control:`text`,description:"Identifier handed back to `onClose` and `onClick`; it is not used for anything else"},group:{control:`text`,description:"Second identifier handed back to both handlers (`onClose` receives an empty string when it is not set), for chips that belong to several filters"},hideCross:{control:`boolean`,description:"Leaves the cross out, so nothing on the chip fires `onClose`",table:{defaultValue:{summary:`false`}}},isActive:{control:`boolean`,description:`Draws the chip in its selected colours: a tinted background with the label and icon in the accent colour`,table:{defaultValue:{summary:`false`}}},icon:{control:!1,description:`Glyph before the label: an SVG URL, or a component rendered with no props`},title:{control:`text`,description:"Text of the shared tooltip that opens when the pointer rests on the chip, useful when a long label is cut off; it needs `RootTooltip` mounted"},onClose:{action:`onClose`,description:"Called when the cross is clicked, with `propKey`, `label`, `group` and the event"},onClick:{action:`onClick`,description:"Called when the chip is clicked, with `propKey`, `label`, `group` and the event"},className:{control:`text`,description:`Class added to the outermost element`},id:{control:`text`,description:"`id` of the outermost element"},classNameCloseButton:{control:`text`,description:`Class added to the cross button`},dataTestId:{control:`text`,description:"`data-testid` of the outermost element",table:{defaultValue:{summary:`"selected-item"`}}},forwardedRef:{control:!1,description:`Ref to the outermost element`},style:{control:!1,description:"Ignored: nothing reads it; style the chip through `className` or the CSS custom properties"},clickable:{control:!1,description:"Ignored: nothing reads it; passing `onClick` is what makes the chip clickable"}}},h=()=>{},g={render:e=>(0,f.jsx)(s,{...e}),args:{label:`Selected item`,isInline:!0,isDisabled:!1,onClose:p(),onClick:p(),propKey:`item-1`},parameters:{docs:{description:{story:"The chip as a filter shows a picked value: click the cross to see `onClose` in the Actions panel, click the label for `onClick`, and change any other prop live in the Controls panel below."},source:{code:`<SelectedItem label="Selected item" propKey="item-1" isInline onClose={handleRemove} />`}}}},_={render:e=>(0,f.jsx)(s,{...e}),args:{label:`Disabled item`,isInline:!0,isDisabled:!0,onClose:p(),propKey:`item-disabled`},parameters:{docs:{description:{story:"For a value the user may see but not take back: the label and the cross grey out and neither handler fires (`isDisabled`)."},source:{code:`<SelectedItem label="Disabled item" propKey="item-disabled" isInline isDisabled onClose={handleRemove} />`}}}},v={render:e=>(0,f.jsx)(s,{...e}),args:{label:`Block display item`,isInline:!1,isDisabled:!1,onClose:p(),propKey:`item-block`},parameters:{docs:{description:{story:"For a list of picked values stacked one per row: the chip fills the width of its container and pushes the cross to the far end (`isInline={false}`)."},source:{code:`<SelectedItem label="Block display item" propKey="item-block" isInline={false} onClose={handleRemove} />`}}}},y=()=>(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)(`div`,{className:u.containerInline,children:[(0,f.jsx)(s,{label:`Inline enabled`,propKey:`1`,isInline:!0,onClose:h}),(0,f.jsx)(s,{label:`Inline disabled`,propKey:`2`,isInline:!0,isDisabled:!0,onClose:h}),(0,f.jsx)(s,{label:`Another item`,propKey:`3`,isInline:!0,onClose:h})]}),(0,f.jsx)(`div`,{className:u.container,children:(0,f.jsx)(s,{label:`Block display item`,propKey:`4`,isInline:!1,onClose:h})})]}),b={render:()=>(0,f.jsx)(y,{}),parameters:{docs:{description:{story:`How the modes sit together in a filter bar:

- **Inline enabled** and **Another item** — inline chips wrapping in a row
- **Inline disabled** — the same chip with its label and cross greyed out (\`isDisabled\`)
- **Block display item** — a chip that fills the row (\`isInline={false}\`)`},source:{code:`<SelectedItem label="Inline enabled" propKey="1" isInline onClose={handleRemove} />
<SelectedItem label="Inline disabled" propKey="2" isInline isDisabled onClose={handleRemove} />
<SelectedItem label="Another item" propKey="3" isInline onClose={handleRemove} />
<SelectedItem label="Block display item" propKey="4" isInline={false} onClose={handleRemove} />`}}}},x={render:e=>(0,f.jsx)(s,{...e}),args:{label:`Documents`,isInline:!0,icon:a,onClose:p(),propKey:`item-icon`},parameters:{docs:{description:{story:"For a value that is easier to recognise by its kind: a glyph sits before the label (`icon`, here an SVG component; an SVG URL works too)."},source:{code:`import FolderIcon from "./folder.react.svg";

<SelectedItem label="Documents" propKey="item-icon" icon={FolderIcon} isInline onClose={handleRemove} />`}}}},S={render:e=>(0,f.jsx)(s,{...e}),args:{label:`Documents`,isInline:!0,isActive:!0,icon:a,onClose:p(),propKey:`item-active`},parameters:{docs:{description:{story:"For the chip the user is working with right now: the background tints and the label and icon take the accent colour (`isActive`)."},source:{code:`<SelectedItem label="Documents" propKey="item-active" icon={FolderIcon} isInline isActive onClose={handleRemove} />`}}}},C={render:e=>(0,f.jsx)(s,{...e}),args:{label:`Read only`,isInline:!0,hideCross:!0,onClose:p(),onClick:p(),propKey:`item-no-cross`},parameters:{docs:{description:{story:"For a value the user can pick but not remove from the chip itself: the cross is left out and only a click on the chip is reported (`hideCross`)."},source:{code:`<SelectedItem label="Read only" propKey="item-no-cross" isInline hideCross onClose={handleRemove} onClick={handleClick} />`}}}},w={render:e=>(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(s,{...e}),(0,f.jsx)(n,{})]}),args:{label:`Quarterly report drafts and shared spreadsheets`,title:`Quarterly report drafts and shared spreadsheets`,isInline:!0,onClose:p(),propKey:`item-long`},parameters:{docs:{description:{story:"For values longer than a chip can hold: the label is cut off with an ellipsis; rest the pointer on the chip to read the full text in the tooltip (`title`). The tooltip is the kit's shared one, so the app must mount `RootTooltip` once, as this story does."},source:{code:`<SelectedItem
  label="Quarterly report drafts and shared spreadsheets"
  title="Quarterly report drafts and shared spreadsheets"
  propKey="item-long"
  isInline
  onClose={handleRemove}
/>
<RootTooltip />`}}}},T={render:()=>(0,f.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,flexWrap:`wrap`,"--selected-item-bg":`#ede9fe`,"--selected-item-bg-hover":`#ddd6fe`,"--selected-item-disabled-text":`#a78bfa`,"--selected-item-active-bg":`#4c1d95`,"--selected-item-active-text":`#ffffff`,"--selected-item-radius":`16px`,"--selected-item-padding":`6px 12px`,"--selected-item-height":`28px`,"--selected-item-margin-inline":`12px`,"--selected-item-margin-bottom":`8px`,"--selected-item-label-margin":`16px`},children:[(0,f.jsx)(s,{label:`Custom item`,propKey:`1`,isInline:!0,onClose:()=>{}}),(0,f.jsx)(s,{label:`Disabled`,propKey:`2`,isInline:!0,isDisabled:!0,onClose:()=>{}}),(0,f.jsx)(s,{label:`Active`,propKey:`3`,isInline:!0,isActive:!0,onClose:()=>{}})]}),parameters:{docs:{description:{story:"Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The example has three chips: **Custom item** for the colours and sizes (hover it for the hover background), **Disabled** for `--selected-item-disabled-text` (`isDisabled`), and **Active** for the two active variables (`isActive`)."},source:{code:`<div
  style={{
    "--selected-item-bg": "#ede9fe",
    "--selected-item-bg-hover": "#ddd6fe",
    "--selected-item-disabled-text": "#a78bfa",
    "--selected-item-active-bg": "#4c1d95",
    "--selected-item-active-text": "#ffffff",
    "--selected-item-radius": "16px",
    "--selected-item-padding": "6px 12px",
    "--selected-item-height": "28px",
    "--selected-item-margin-inline": "12px",
    "--selected-item-margin-bottom": "8px",
    "--selected-item-label-margin": "16px",
  }}
>
  <SelectedItem label="Custom item" propKey="1" isInline onClose={handleRemove} />
  <SelectedItem label="Disabled" propKey="2" isInline isDisabled onClose={handleRemove} />
  <SelectedItem label="Active" propKey="3" isInline isActive onClose={handleRemove} />
</div>`}}}},E=[`Default`,`DisabledState`,`BlockDisplay`,`AllVariants`,`WithIcon`,`ActiveState`,`WithoutCross`,`TruncatedLabel`,`CssCustomization`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <SelectedItem {...args} />,
  args: {
    label: "Selected item",
    isInline: true,
    isDisabled: false,
    onClose: fn(),
    onClick: fn(),
    propKey: "item-1"
  },
  parameters: {
    docs: {
      description: {
        story: "The chip as a filter shows a picked value: click the cross to see \`onClose\` in the Actions panel, click the label for \`onClick\`, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<SelectedItem label="Selected item" propKey="item-1" isInline onClose={handleRemove} />\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <SelectedItem {...args} />,
  args: {
    label: "Disabled item",
    isInline: true,
    isDisabled: true,
    onClose: fn(),
    propKey: "item-disabled"
  },
  parameters: {
    docs: {
      description: {
        story: "For a value the user may see but not take back: the label and the cross grey out and neither handler fires (\`isDisabled\`)."
      },
      source: {
        code: \`<SelectedItem label="Disabled item" propKey="item-disabled" isInline isDisabled onClose={handleRemove} />\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <SelectedItem {...args} />,
  args: {
    label: "Block display item",
    isInline: false,
    isDisabled: false,
    onClose: fn(),
    propKey: "item-block"
  },
  parameters: {
    docs: {
      description: {
        story: "For a list of picked values stacked one per row: the chip fills the width of its container and pushes the cross to the far end (\`isInline={false}\`)."
      },
      source: {
        code: \`<SelectedItem label="Block display item" propKey="item-block" isInline={false} onClose={handleRemove} />\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <AllVariantsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "How the modes sit together in a filter bar:\\n\\n- **Inline enabled** and **Another item** — inline chips wrapping in a row\\n- **Inline disabled** — the same chip with its label and cross greyed out (\`isDisabled\`)\\n- **Block display item** — a chip that fills the row (\`isInline={false}\`)"
      },
      source: {
        code: \`<SelectedItem label="Inline enabled" propKey="1" isInline onClose={handleRemove} />
<SelectedItem label="Inline disabled" propKey="2" isInline isDisabled onClose={handleRemove} />
<SelectedItem label="Another item" propKey="3" isInline onClose={handleRemove} />
<SelectedItem label="Block display item" propKey="4" isInline={false} onClose={handleRemove} />\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <SelectedItem {...args} />,
  args: {
    label: "Documents",
    isInline: true,
    icon: CatalogFolderIcon,
    onClose: fn(),
    propKey: "item-icon"
  },
  parameters: {
    docs: {
      description: {
        story: "For a value that is easier to recognise by its kind: a glyph sits before the label (\`icon\`, here an SVG component; an SVG URL works too)."
      },
      source: {
        code: \`import FolderIcon from "./folder.react.svg";

<SelectedItem label="Documents" propKey="item-icon" icon={FolderIcon} isInline onClose={handleRemove} />\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: args => <SelectedItem {...args} />,
  args: {
    label: "Documents",
    isInline: true,
    isActive: true,
    icon: CatalogFolderIcon,
    onClose: fn(),
    propKey: "item-active"
  },
  parameters: {
    docs: {
      description: {
        story: "For the chip the user is working with right now: the background tints and the label and icon take the accent colour (\`isActive\`)."
      },
      source: {
        code: \`<SelectedItem label="Documents" propKey="item-active" icon={FolderIcon} isInline isActive onClose={handleRemove} />\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => <SelectedItem {...args} />,
  args: {
    label: "Read only",
    isInline: true,
    hideCross: true,
    onClose: fn(),
    onClick: fn(),
    propKey: "item-no-cross"
  },
  parameters: {
    docs: {
      description: {
        story: "For a value the user can pick but not remove from the chip itself: the cross is left out and only a click on the chip is reported (\`hideCross\`)."
      },
      source: {
        code: \`<SelectedItem label="Read only" propKey="item-no-cross" isInline hideCross onClose={handleRemove} onClick={handleClick} />\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => <>
      <SelectedItem {...args} />
      <RootTooltip />
    </>,
  args: {
    label: "Quarterly report drafts and shared spreadsheets",
    title: "Quarterly report drafts and shared spreadsheets",
    isInline: true,
    onClose: fn(),
    propKey: "item-long"
  },
  parameters: {
    docs: {
      description: {
        story: "For values longer than a chip can hold: the label is cut off with an ellipsis; rest the pointer on the chip to read the full text in the tooltip (\`title\`). The tooltip is the kit's shared one, so the app must mount \`RootTooltip\` once, as this story does."
      },
      source: {
        code: \`<SelectedItem
  label="Quarterly report drafts and shared spreadsheets"
  title="Quarterly report drafts and shared spreadsheets"
  propKey="item-long"
  isInline
  onClose={handleRemove}
/>
<RootTooltip />\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    "--selected-item-bg": "#ede9fe",
    "--selected-item-bg-hover": "#ddd6fe",
    "--selected-item-disabled-text": "#a78bfa",
    "--selected-item-active-bg": "#4c1d95",
    "--selected-item-active-text": "#ffffff",
    "--selected-item-radius": "16px",
    "--selected-item-padding": "6px 12px",
    "--selected-item-height": "28px",
    "--selected-item-margin-inline": "12px",
    "--selected-item-margin-bottom": "8px",
    "--selected-item-label-margin": "16px"
  } as CSSProperties}>
      <SelectedItem label="Custom item" propKey="1" isInline onClose={() => {}} />
      <SelectedItem label="Disabled" propKey="2" isInline isDisabled onClose={() => {}} />
      <SelectedItem label="Active" propKey="3" isInline isActive onClose={() => {}} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The example has three chips: **Custom item** for the colours and sizes (hover it for the hover background), **Disabled** for \\\`--selected-item-disabled-text\\\` (\\\`isDisabled\\\`), and **Active** for the two active variables (\\\`isActive\\\`).\`
      },
      source: {
        code: \`<div
  style={{
    "--selected-item-bg": "#ede9fe",
    "--selected-item-bg-hover": "#ddd6fe",
    "--selected-item-disabled-text": "#a78bfa",
    "--selected-item-active-bg": "#4c1d95",
    "--selected-item-active-text": "#ffffff",
    "--selected-item-radius": "16px",
    "--selected-item-padding": "6px 12px",
    "--selected-item-height": "28px",
    "--selected-item-margin-inline": "12px",
    "--selected-item-margin-bottom": "8px",
    "--selected-item-label-margin": "16px",
  }}
>
  <SelectedItem label="Custom item" propKey="1" isInline onClose={handleRemove} />
  <SelectedItem label="Disabled" propKey="2" isInline isDisabled onClose={handleRemove} />
  <SelectedItem label="Active" propKey="3" isInline isActive onClose={handleRemove} />
</div>\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}}})))()}D();export{S as ActiveState,b as AllVariants,v as BlockDisplay,T as CssCustomization,g as Default,_ as DisabledState,w as TruncatedLabel,x as WithIcon,C as WithoutCross,E as __namedExportsOrder,m as default};