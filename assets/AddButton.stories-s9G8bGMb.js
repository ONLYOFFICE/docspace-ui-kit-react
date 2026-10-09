import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./add-button-vuBaW5al.js";import{n as i,t as a}from"./catalog.folder.react-BLNaFnHq.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{i(),n(),o=t(),{fn:s}=__STORYBOOK_MODULE_TEST__,c={title:`UI/Interactive elements/AddButton`,component:r,parameters:{},args:{onClick:s()},argTypes:{title:{control:`text`,description:`Tooltip shown on hover, drawn by the kit's own tooltip rather than the browser's`},label:{control:`text`,description:`Text drawn after the square; clicking it adds too. Without it the button is the square alone`},onClick:{control:!1,description:`Called with the event when the square or the label is clicked, and on Enter while the button has focus`},isDisabled:{control:`boolean`,description:`Makes the button inert: the icon greys out, the label dims and clicks are ignored`,table:{defaultValue:{summary:`false`}}},isAction:{control:`boolean`,description:`Tints the square with the theme's accent colour instead of grey`,table:{defaultValue:{summary:`false`}}},isLoading:{control:`boolean`,description:`Shows a spinner in place of the icon and ignores clicks while it is set`,table:{defaultValue:{summary:`false`}}},iconNode:{control:!1,description:`Icon element drawn in the square instead of the plus`},iconName:{control:`text`,description:"URL of an icon fetched at runtime; ignored when `iconNode` is set"},iconSize:{control:`number`,description:`Size of the icon inside the square, in pixels; the square keeps its size`,table:{defaultValue:{summary:`12`}}},size:{control:`text`,description:`Side of the square, as a CSS length; applied only when the theme supplies a colour scheme`},fontSize:{control:`text`,description:`Font size of the label, as a CSS length`,table:{defaultValue:{summary:`13px`}}},lineHeight:{control:`text`,description:`Line height of the label, as a CSS length`,table:{defaultValue:{summary:`20px`}}},truncate:{control:`boolean`,description:`Cuts the label with an ellipsis instead of wrapping it, once the parent limits the width`,table:{defaultValue:{summary:`false`}}},titleText:{control:`text`,description:"Browser tooltip of the label, shown on hovering the text, unlike `title`"},noSelect:{control:`boolean`,description:`Stops the label from being selected with the pointer`},dir:{control:`select`,options:[`ltr`,`rtl`,`auto`],description:`Writing direction of the label text`},tabIndex:{control:`number`,description:`Tab order of the button; without it the button cannot be focused and Enter does nothing`},className:{control:`text`,description:`Class added to the wrapper that holds the square and the label`},id:{control:`text`,description:`Id of the square, not of the wrapper`},style:{control:`object`,description:`Inline style of the square, not of the wrapper`},testId:{control:`text`,description:"`data-testid` of the square",table:{defaultValue:{summary:`selector-add-button`}}}}},l=e=>(0,o.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(200px, 1fr))`,gridGap:`16px`,alignItems:`center`},children:e.children}),u={render:e=>(0,o.jsx)(r,{...e}),args:{title:`Add item`,tabIndex:0},parameters:{docs:{description:{story:"The bare square with a plus, for a list that needs one more item and has room for no label. Click it, or press Tab and then Enter, and the Actions panel logs the call (`onClick`, `tabIndex`); change any other prop live in the Controls panel below."},source:{code:`<AddButton title="Add item" tabIndex={0} onClick={handleAdd} />`}}}},d=()=>(0,o.jsxs)(l,{children:[(0,o.jsx)(r,{title:`Add item`,label:`Add user`,onClick:()=>{}}),(0,o.jsx)(r,{title:`Add item`,label:`Add group`,isAction:!0,onClick:()=>{}})]}),f={render:()=>(0,o.jsx)(d,{}),parameters:{docs:{description:{story:"A label says what gets added when a bare plus would leave the reader guessing, and clicking the words adds too. **Add user** is the grey square; **Add group** is the accent tint (`isAction`)."},source:{code:`<AddButton title="Add item" label="Add user" onClick={handleClick} />
<AddButton title="Add item" label="Add group" isAction onClick={handleClick} />`}}}},p=()=>(0,o.jsxs)(l,{children:[(0,o.jsx)(r,{title:`Add item`,isDisabled:!0,onClick:()=>{}}),(0,o.jsx)(r,{title:`Add item`,label:`Disabled with label`,isDisabled:!0,onClick:()=>{}})]}),m={render:()=>(0,o.jsx)(p,{}),parameters:{docs:{description:{story:"A disabled button stays in place so the reader sees the action exists but is not available now: the square turns a lighter grey, the icon greys out and the label dims, and clicks and Enter are ignored (`isDisabled`)."},source:{code:`<AddButton title="Add item" isDisabled />
<AddButton title="Add item" label="Disabled with label" isDisabled />`}}}},h=()=>(0,o.jsxs)(l,{children:[(0,o.jsx)(r,{title:`Default`,onClick:()=>{}}),(0,o.jsx)(r,{title:`Accent`,isAction:!0,onClick:()=>{}})]}),g={render:()=>(0,o.jsx)(h,{}),parameters:{docs:{description:{story:"The accent tint marks the add button that matters most on a screen. **Default** is the grey square; **Accent** is tinted with the theme's accent colour (`isAction`)."},source:{code:`<AddButton title="Default" onClick={handleClick} />
<AddButton title="Accent" isAction onClick={handleClick} />`}}}},_={render:e=>(0,o.jsx)(r,{...e}),args:{title:`Adding...`,isLoading:!0},parameters:{docs:{description:{story:"While the item is being added, a spinner stands in for the icon so a second click does not add it twice; clicks are ignored until loading ends, and the square keeps its size (`isLoading`)."},source:{code:`<AddButton title="Adding..." isLoading />`}}}},v=()=>(0,o.jsx)(`div`,{style:{width:`150px`},children:(0,o.jsx)(r,{title:`Add item`,label:`This is a very long label that should be truncated`,truncate:!0,onClick:()=>{}})}),y={render:()=>(0,o.jsx)(v,{}),parameters:{docs:{description:{story:"In a narrow column a long label is cut with an ellipsis instead of wrapping under the square; the parent here is 150px wide (`truncate`)."},source:{code:`<AddButton title="Add item" label="Very long label text..." truncate onClick={handleClick} />`}}}},b=()=>(0,o.jsxs)(l,{children:[(0,o.jsx)(r,{title:`Default`,onClick:()=>{}}),(0,o.jsx)(r,{title:`Large icon`,iconSize:16,size:`36px`,onClick:()=>{}})]}),x={render:()=>(0,o.jsx)(b,{}),parameters:{docs:{description:{story:"A bigger square and icon suit a roomier layout. **Default** is the 32px square with a 12px icon; **Large icon** is a 36px square (`size`) with a 16px icon (`iconSize`)."},source:{code:`<AddButton title="Default" onClick={handleClick} />
<AddButton title="Large icon" iconSize={16} size="36px" onClick={handleClick} />`}}}},S=()=>(0,o.jsx)(l,{children:(0,o.jsx)(r,{title:`Add folder`,label:`Add folder`,iconSize:16,iconNode:(0,o.jsx)(a,{}),onClick:()=>{}})}),C={render:()=>(0,o.jsx)(S,{}),parameters:{docs:{description:{story:"When a plus does not say enough about what gets added, the square can carry any icon; here a folder icon at 16px (`iconNode`, `iconSize`). An icon given by URL is fetched at runtime instead (`iconName`)."},source:{code:`<AddButton
  title="Add folder"
  label="Add folder"
  iconSize={16}
  iconNode={<FolderIcon />}
  onClick={handleAdd}
/>`}}}},w={render:()=>(0,o.jsxs)(`div`,{style:{display:`flex`,gap:`12px`,alignItems:`center`,"--add-button-radius":`50%`,"--add-button-dimension":`40px`,"--add-button-bg":`#7c3aed`,"--add-button-bg-hover":`#a78bfa`,"--add-button-bg-active":`#4c1d95`,"--add-button-icon-color":`#ffffff`,"--add-button-icon-color-hover":`#ffffff`,"--add-button-icon-color-active":`#ddd6fe`,"--add-button-text-gap":`16px`,"--add-button-text-disabled":`#c4b5fd`},children:[(0,o.jsx)(r,{title:`With label`,label:`Add item`,iconSize:20,onClick:()=>{}}),(0,o.jsx)(r,{title:`Disabled`,label:`Disabled`,iconSize:20,isDisabled:!0,onClick:()=>{}})]}),parameters:{docs:{description:{story:`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

**Add item** shows the square, icon and gap variables; hover and press it near its edge to see the hover and active colours. **Disabled** is there for \`--add-button-text-disabled\`, the only variable that survives the disabled state: the theme draws its square and icon in its own greys.`},source:{code:`<div
  style={{
    "--add-button-radius": "50%",
    "--add-button-dimension": "40px",
    "--add-button-bg": "#7c3aed",
    "--add-button-bg-hover": "#a78bfa",
    "--add-button-bg-active": "#4c1d95",
    "--add-button-icon-color": "#ffffff",
    "--add-button-icon-color-hover": "#ffffff",
    "--add-button-icon-color-active": "#ddd6fe",
    "--add-button-text-gap": "16px",
    "--add-button-text-disabled": "#c4b5fd",
  }}
>
  <AddButton label="Add item" iconSize={20} onClick={handleAdd} />
  <AddButton label="Disabled" iconSize={20} isDisabled />
</div>`}}}},T=[`Default`,`WithLabel`,`DisabledStates`,`AccentStyle`,`LoadingState`,`TruncatedLabel`,`CustomIconSize`,`WithCustomIcon`,`CssCustomization`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <AddButton {...args} />,
  args: {
    title: "Add item",
    tabIndex: 0
  },
  parameters: {
    docs: {
      description: {
        story: "The bare square with a plus, for a list that needs one more item and has room for no label. Click it, or press Tab and then Enter, and the Actions panel logs the call (\`onClick\`, \`tabIndex\`); change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<AddButton title="Add item" tabIndex={0} onClick={handleAdd} />\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <WithLabelTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A label says what gets added when a bare plus would leave the reader guessing, and clicking the words adds too. **Add user** is the grey square; **Add group** is the accent tint (\`isAction\`)."
      },
      source: {
        code: \`<AddButton title="Add item" label="Add user" onClick={handleClick} />
<AddButton title="Add item" label="Add group" isAction onClick={handleClick} />\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A disabled button stays in place so the reader sees the action exists but is not available now: the square turns a lighter grey, the icon greys out and the label dims, and clicks and Enter are ignored (\`isDisabled\`)."
      },
      source: {
        code: \`<AddButton title="Add item" isDisabled />
<AddButton title="Add item" label="Disabled with label" isDisabled />\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <AccentTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The accent tint marks the add button that matters most on a screen. **Default** is the grey square; **Accent** is tinted with the theme's accent colour (\`isAction\`)."
      },
      source: {
        code: \`<AddButton title="Default" onClick={handleClick} />
<AddButton title="Accent" isAction onClick={handleClick} />\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <AddButton {...args} />,
  args: {
    title: "Adding...",
    isLoading: true
  },
  parameters: {
    docs: {
      description: {
        story: "While the item is being added, a spinner stands in for the icon so a second click does not add it twice; clicks are ignored until loading ends, and the square keeps its size (\`isLoading\`)."
      },
      source: {
        code: \`<AddButton title="Adding..." isLoading />\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <TruncatedTemplate />,
  parameters: {
    docs: {
      description: {
        story: "In a narrow column a long label is cut with an ellipsis instead of wrapping under the square; the parent here is 150px wide (\`truncate\`)."
      },
      source: {
        code: \`<AddButton title="Add item" label="Very long label text..." truncate onClick={handleClick} />\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <CustomSizeTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A bigger square and icon suit a roomier layout. **Default** is the 32px square with a 12px icon; **Large icon** is a 36px square (\`size\`) with a 16px icon (\`iconSize\`)."
      },
      source: {
        code: \`<AddButton title="Default" onClick={handleClick} />
<AddButton title="Large icon" iconSize={16} size="36px" onClick={handleClick} />\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <CustomIconTemplate />,
  parameters: {
    docs: {
      description: {
        story: "When a plus does not say enough about what gets added, the square can carry any icon; here a folder icon at 16px (\`iconNode\`, \`iconSize\`). An icon given by URL is fetched at runtime instead (\`iconName\`)."
      },
      source: {
        code: \`<AddButton
  title="Add folder"
  label="Add folder"
  iconSize={16}
  iconNode={<FolderIcon />}
  onClick={handleAdd}
/>\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: "12px",
    alignItems: "center",
    "--add-button-radius": "50%",
    "--add-button-dimension": "40px",
    "--add-button-bg": "#7c3aed",
    "--add-button-bg-hover": "#a78bfa",
    "--add-button-bg-active": "#4c1d95",
    "--add-button-icon-color": "#ffffff",
    "--add-button-icon-color-hover": "#ffffff",
    "--add-button-icon-color-active": "#ddd6fe",
    "--add-button-text-gap": "16px",
    "--add-button-text-disabled": "#c4b5fd"
  } as CSSProperties}>
      <AddButton title="With label" label="Add item" iconSize={20} onClick={() => {}} />
      <AddButton title="Disabled" label="Disabled" iconSize={20} isDisabled onClick={() => {}} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

**Add item** shows the square, icon and gap variables; hover and press it near its edge to see the hover and active colours. **Disabled** is there for \\\`--add-button-text-disabled\\\`, the only variable that survives the disabled state: the theme draws its square and icon in its own greys.\`
      },
      source: {
        code: \`<div
  style={{
    "--add-button-radius": "50%",
    "--add-button-dimension": "40px",
    "--add-button-bg": "#7c3aed",
    "--add-button-bg-hover": "#a78bfa",
    "--add-button-bg-active": "#4c1d95",
    "--add-button-icon-color": "#ffffff",
    "--add-button-icon-color-hover": "#ffffff",
    "--add-button-icon-color-active": "#ddd6fe",
    "--add-button-text-gap": "16px",
    "--add-button-text-disabled": "#c4b5fd",
  }}
>
  <AddButton label="Add item" iconSize={20} onClick={handleAdd} />
  <AddButton label="Disabled" iconSize={20} isDisabled />
</div>\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}}})))()}E();export{g as AccentStyle,w as CssCustomization,x as CustomIconSize,u as Default,m as DisabledStates,_ as LoadingState,y as TruncatedLabel,C as WithCustomIcon,f as WithLabel,T as __namedExportsOrder,c as default};