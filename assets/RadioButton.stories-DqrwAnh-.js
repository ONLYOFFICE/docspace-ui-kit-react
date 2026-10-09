import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./radio-button-hlOy5_iJ.js";var a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{a=t(),r(),o=n(),s={title:`UI/Form controls/RadioButton`,component:i,parameters:{design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=556-3247&mode=design&t=TBNCKMQKQMxr44IZ-0`}},argTypes:{isChecked:{control:`boolean`,description:`Whether the circle is filled in; the button starts in this state and returns to it whenever the prop changes`,table:{defaultValue:{summary:`false`}}},isDisabled:{control:`boolean`,description:`Disables the input and greys out the circle and the label, so clicks no longer select it`,table:{defaultValue:{summary:`false`}}},label:{control:`text`,description:"Text or any React node written beside the circle; `value` is shown when it is left out"},name:{control:`text`,description:"`name` of the input; buttons sharing one form a single choice the arrow keys move through"},value:{control:`text`,description:"`value` of the input, read back from the change event, and the text beside the circle when `label` is left out"},fontSize:{control:`text`,description:`Font size of the text beside the circle, as a CSS length`,table:{defaultValue:{summary:`13px`}}},fontWeight:{control:`number`,description:`Font weight of the text beside the circle`,table:{defaultValue:{summary:`400`}}},spacing:{control:`text`,description:`Gap to the neighbouring button, as a CSS length; without it the buttons touch`},orientation:{control:`select`,options:[`vertical`,`horizontal`],description:"Which side `spacing` goes on: below the button when vertical, before it when horizontal; it does not arrange the buttons itself",table:{defaultValue:{summary:`vertical`}}},onChange:{action:`onChange`,description:"Called on every change of the input; once given, the button stops tracking its own state, follows `isChecked` alone and no longer calls `onClick`"},onClick:{action:`onClick`,description:"Called when the button is clicked, but only while `onChange` is not given"},autoFocus:{control:`boolean`,description:`Whether the input takes keyboard focus as soon as it mounts`,table:{defaultValue:{summary:`false`}}},id:{control:`text`,description:"`id` of the label that wraps the button, not of the input inside it"},className:{control:`text`,description:`Class added to the label that wraps the button`},style:{control:`object`,description:`Inline style of the label that wraps the button`},classNameInput:{control:`text`,description:`Class added to the visually hidden input`},testId:{control:`text`,description:"`data-testid` of the label that wraps the button",table:{defaultValue:{summary:`radio-button`}}}}},c=e=>(0,o.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(220px, 1fr))`,gridGap:`16px`,alignItems:`center`},children:e.children}),l=({isChecked:e,...t})=>{let[n,r]=(0,a.useState)(e);(0,a.useEffect)(()=>{r(e)},[e]);let s=e=>{let n=e.target;r(n.checked),t.onChange?.(e)};return(0,o.jsx)(i,{...t,isChecked:n,onChange:s})},u={render:e=>(0,o.jsx)(l,{...e}),args:{value:`value`,name:`name`,label:`Default radio button`,fontSize:`13px`,fontWeight:400,isDisabled:!1,isChecked:!1},parameters:{docs:{description:{story:`A single labelled button, the starting point for any single-choice option; click it to fill in the circle, and change any other prop live in the Controls panel below.`},source:{code:`<RadioButton
  name="name"
  value="value"
  label="Default radio button"
  isChecked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>`}}}},d=()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(i,{name:`states`,value:`unchecked`,label:`Unchecked`,isChecked:!1}),(0,o.jsx)(i,{name:`states-checked`,value:`checked`,label:`Checked`,isChecked:!0})]}),f={render:()=>(0,o.jsx)(d,{}),parameters:{docs:{description:{story:"The two looks a button can take side by side, so the filled-in choice is easy to tell from the rest: an empty circle and a circle with a dot (`isChecked`)."},source:{code:`<RadioButton name="group" value="unchecked" label="Unchecked" />
<RadioButton name="group" value="checked" label="Checked" isChecked />`}}}},p=()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(i,{name:`disabled`,value:`disabled`,label:`Disabled unchecked`,isDisabled:!0}),(0,o.jsx)(i,{name:`disabled-checked`,value:`disabled-checked`,label:`Disabled checked`,isDisabled:!0,isChecked:!0})]}),m={render:()=>(0,o.jsx)(p,{}),parameters:{docs:{description:{story:"A disabled button, empty or filled in, shows an option the user can see but not change: the circle and the label turn grey and clicks are ignored (`isDisabled`)."},source:{code:`<RadioButton name="group" value="1" label="Disabled unchecked" isDisabled />
<RadioButton name="group" value="2" label="Disabled checked" isDisabled isChecked />`}}}},h=()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(i,{name:`custom`,value:`custom`,label:`Custom styled`,fontSize:`16px`,fontWeight:600}),(0,o.jsx)(i,{name:`custom-small`,value:`small`,label:`Small text`,fontSize:`11px`,fontWeight:300})]}),g={render:()=>(0,o.jsx)(h,{}),parameters:{docs:{description:{story:"Larger or smaller label text for a button placed in a heading or a dense list: **Custom styled** at 16px semibold, **Small text** at 11px light (`fontSize`, `fontWeight`)."},source:{code:`<RadioButton name="group" value="1" label="Custom styled" fontSize="16px" fontWeight={600} />
<RadioButton name="group" value="2" label="Small text" fontSize="11px" fontWeight={300} />`}}}},_=()=>{let[e,t]=(0,a.useState)(`small`),[n,r]=(0,a.useState)(`small`),s=[`small`,`medium`,`large`];return(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`24px`},children:[(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`},children:s.map(n=>(0,o.jsx)(i,{name:`vertical-size`,value:n,label:`Vertical: ${n}`,isChecked:e===n,spacing:`12px`,onChange:e=>t(e.target.value)},n))}),(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`row`},children:s.map(e=>(0,o.jsx)(i,{name:`horizontal-size`,value:e,label:`Horizontal: ${e}`,isChecked:n===e,orientation:`horizontal`,spacing:`24px`,onChange:e=>r(e.target.value)},e))})]})},v={render:()=>(0,o.jsx)(_,{}),parameters:{docs:{description:{story:'A set of buttons needs room between them, because without a gap they touch:\n\n- **Vertical** — a column with 12px below every button but the last (`spacing`, the default `orientation`)\n- **Horizontal** — a row with 24px before every button but the first (`spacing`, `orientation="horizontal"`)\n\nThe container still lays the buttons out; `orientation` only decides which side the gap goes on. Pick an option in each set with a click or the arrow keys.'},source:{code:`<div style={{ display: "flex", flexDirection: "column" }}>
  {options.map((option) => (
    <RadioButton
      key={option}
      name="vertical-size"
      value={option}
      isChecked={vertical === option}
      spacing="12px"
      onChange={(e) => setVertical(e.target.value)}
    />
  ))}
</div>

<div style={{ display: "flex", flexDirection: "row" }}>
  {options.map((option) => (
    <RadioButton
      key={option}
      name="horizontal-size"
      value={option}
      isChecked={horizontal === option}
      orientation="horizontal"
      spacing="24px"
      onChange={(e) => setHorizontal(e.target.value)}
    />
  ))}
</div>`}}}},y={render:()=>(0,o.jsx)(`div`,{style:{"--radio-button-dot-color":`#7c3aed`,"--radio-button-circle-color":`#7c3aed`,"--radio-button-circle-hover-color":`#3b0764`,"--radio-button-background":`#f3e8ff`,"--radio-button-label-color":`#4c1d95`,"--radio-button-gap":`16px`},children:(0,o.jsx)(i,{name:`custom`,value:`1`,label:`Custom option`,isChecked:!0})}),parameters:{docs:{description:{story:`The variables are listed under CSS variables on this page. The example is one checked button, so it shows every variable at once: the violet dot and outline, the light violet fill, the dark violet text and the wider gap. Hover it to see the darker outline.`},source:{code:`<div
  style={{
    "--radio-button-dot-color": "#7c3aed",
    "--radio-button-circle-color": "#7c3aed",
    "--radio-button-circle-hover-color": "#3b0764",
    "--radio-button-background": "#f3e8ff",
    "--radio-button-label-color": "#4c1d95",
    "--radio-button-gap": "16px",
  }}
>
  <RadioButton name="custom" value="1" label="Custom option" isChecked />
</div>`}}}},b=[`Default`,`CheckedStates`,`DisabledStates`,`CustomStyling`,`WithSpacing`,`CssCustomization`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    value: "value",
    name: "name",
    label: "Default radio button",
    fontSize: "13px",
    fontWeight: 400,
    isDisabled: false,
    isChecked: false
  },
  parameters: {
    docs: {
      description: {
        story: "A single labelled button, the starting point for any single-choice option; click it to fill in the circle, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<RadioButton
  name="name"
  value="value"
  label="Default radio button"
  isChecked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The two looks a button can take side by side, so the filled-in choice is easy to tell from the rest: an empty circle and a circle with a dot (\`isChecked\`)."
      },
      source: {
        code: \`<RadioButton name="group" value="unchecked" label="Unchecked" />
<RadioButton name="group" value="checked" label="Checked" isChecked />\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A disabled button, empty or filled in, shows an option the user can see but not change: the circle and the label turn grey and clicks are ignored (\`isDisabled\`)."
      },
      source: {
        code: \`<RadioButton name="group" value="1" label="Disabled unchecked" isDisabled />
<RadioButton name="group" value="2" label="Disabled checked" isDisabled isChecked />\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <CustomStylingTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Larger or smaller label text for a button placed in a heading or a dense list: **Custom styled** at 16px semibold, **Small text** at 11px light (\`fontSize\`, \`fontWeight\`)."
      },
      source: {
        code: \`<RadioButton name="group" value="1" label="Custom styled" fontSize="16px" fontWeight={600} />
<RadioButton name="group" value="2" label="Small text" fontSize="11px" fontWeight={300} />\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <WithSpacingTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`A set of buttons needs room between them, because without a gap they touch:

- **Vertical** — a column with 12px below every button but the last (\\\`spacing\\\`, the default \\\`orientation\\\`)
- **Horizontal** — a row with 24px before every button but the first (\\\`spacing\\\`, \\\`orientation="horizontal"\\\`)

The container still lays the buttons out; \\\`orientation\\\` only decides which side the gap goes on. Pick an option in each set with a click or the arrow keys.\`
      },
      source: {
        code: \`<div style={{ display: "flex", flexDirection: "column" }}>
  {options.map((option) => (
    <RadioButton
      key={option}
      name="vertical-size"
      value={option}
      isChecked={vertical === option}
      spacing="12px"
      onChange={(e) => setVertical(e.target.value)}
    />
  ))}
</div>

<div style={{ display: "flex", flexDirection: "row" }}>
  {options.map((option) => (
    <RadioButton
      key={option}
      name="horizontal-size"
      value={option}
      isChecked={horizontal === option}
      orientation="horizontal"
      spacing="24px"
      onChange={(e) => setHorizontal(e.target.value)}
    />
  ))}
</div>\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--radio-button-dot-color": "#7c3aed",
    "--radio-button-circle-color": "#7c3aed",
    "--radio-button-circle-hover-color": "#3b0764",
    "--radio-button-background": "#f3e8ff",
    "--radio-button-label-color": "#4c1d95",
    "--radio-button-gap": "16px"
  } as CSSProperties}>
      <RadioButton name="custom" value="1" label="Custom option" isChecked />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The variables are listed under CSS variables on this page. The example is one checked button, so it shows every variable at once: the violet dot and outline, the light violet fill, the dark violet text and the wider gap. Hover it to see the darker outline.\`
      },
      source: {
        code: \`<div
  style={{
    "--radio-button-dot-color": "#7c3aed",
    "--radio-button-circle-color": "#7c3aed",
    "--radio-button-circle-hover-color": "#3b0764",
    "--radio-button-background": "#f3e8ff",
    "--radio-button-label-color": "#4c1d95",
    "--radio-button-gap": "16px",
  }}
>
  <RadioButton name="custom" value="1" label="Custom option" isChecked />
</div>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}}})))()}x();export{f as CheckedStates,y as CssCustomization,g as CustomStyling,u as Default,m as DisabledStates,v as WithSpacing,b as __namedExportsOrder,s as default};