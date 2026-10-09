import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./radio-button-group-Cf41Yub4.js";var i,a,o,s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{n(),i=t(),{fn:a}=__STORYBOOK_MODULE_TEST__,o={title:`UI/Form controls/RadioButtonGroup`,component:r,parameters:{design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=556-3247&mode=design&t=TBNCKMQKQMxr44IZ-0`}},args:{onClick:a()},argTypes:{options:{control:`object`,description:'The options, in order: each has a `value` and an optional `label`, `disabled`, `autoFocus`, `id` and `dataTestId`; an entry with `type: "text"` is a caption, not a button'},selected:{control:`text`,description:`Value of the chosen option, compared as a string; the group starts from it and moves to it again whenever it changes`},onClick:{description:"Called when the choice changes, with the input's change event; the new value is `event.target.value`, always a string"},name:{control:`text`,description:"The `name` shared by every input of the group; without one the arrow keys move focus between the inputs but do not change the choice"},orientation:{control:`select`,options:[`horizontal`,`vertical`],description:`Which way the options run: side by side in a row, or stacked in a column only as wide as its longest label`,table:{defaultValue:{summary:`horizontal`}}},isDisabled:{control:`boolean`,description:"Disables every button in the group; a single option is disabled through its own `disabled` field",table:{defaultValue:{summary:`false`}}},width:{control:`text`,description:`Width of the group, as a CSS length`},fontSize:{control:`text`,description:`Font size of every option's label`},fontWeight:{control:`text`,description:`Font weight of every option's label`},spacing:{control:`text`,description:`Gap between neighbouring buttons, as a CSS length: before each button after the first in a row, below each button but the last in a column; without it the buttons touch`},id:{control:`text`,description:`Applied to the group's outer element`},className:{control:`text`,description:`Applied to the group's outer element`},style:{control:`object`,description:`Applied to the group's outer element`},dataTestId:{control:`text`,description:"`data-testid` of the group's outer element",table:{defaultValue:{summary:`radio-button-group`}}}}},s=e=>(0,i.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(300px, 1fr))`,gridGap:`24px`,alignItems:`start`},children:e.children}),c=[{value:`option1`,label:`Option 1`},{value:`option2`,label:`Option 2`},{value:`option3`,label:`Option 3`}],l={args:{name:`default`,options:c,orientation:`horizontal`,selected:`option1`,spacing:`15px`},parameters:{docs:{description:{story:"The group as most forms use it: a row of options with one chosen. Click another option to move the choice and watch the Actions panel for the value `onClick` receives; change any other prop live in the Controls panel below."},source:{code:`<RadioButtonGroup
  name="default"
  options={options}
  selected="option1"
  orientation="horizontal"
  spacing="15px"
  onClick={handleClick}
/>`}}}},u={args:{name:`vertical`,options:c,selected:`option1`,orientation:`vertical`},parameters:{docs:{description:{story:"The options stacked in a column only as wide as its longest label (`orientation`). Suits longer lists and labels too long to sit side by side; without `spacing` the buttons sit directly under one another."},source:{code:`<RadioButtonGroup
  name="vertical"
  options={options}
  selected="option1"
  orientation="vertical"
  onClick={handleClick}
/>`}}}},d=e=>(0,i.jsxs)(s,{children:[(0,i.jsx)(r,{name:`disabled-group`,options:c,selected:`option1`,isDisabled:!0,onClick:e.onClick}),(0,i.jsx)(r,{name:`disabled-option`,options:[...c,{value:`option4`,label:`Disabled Option`,disabled:!0}],selected:`option1`,onClick:e.onClick})]}),f={render:e=>(0,i.jsx)(d,{...e}),parameters:{docs:{description:{story:'Shows the two ways to take options out of play:\n\n- **Left** — the whole group greyed out and unclickable at once (`isDisabled`), for a setting that does not apply right now\n- **Right** — only "Disabled Option" is greyed out (`disabled` on the option), while the other three stay selectable'},source:{code:`// All disabled
<RadioButtonGroup name="size" options={options} selected="option1" isDisabled onClick={handleClick} />

// Individual option disabled
<RadioButtonGroup
  name="size"
  options={[...options, { value: "option4", label: "Disabled Option", disabled: true }]}
  selected="option1"
  onClick={handleClick}
/>`}}}},p={args:{name:`with-text`,options:[{type:`text`,label:`Please select an option:`,value:``},...c],selected:`option1`,orientation:`vertical`},parameters:{docs:{description:{story:'"Please select an option:" is a caption placed inside the group, not a button (an option with `type: "text"`). Use it for a heading or an instruction above the options, or between two runs of them.'},source:{code:`<RadioButtonGroup
  name="with-text"
  options={[
    { type: "text", label: "Please select an option:", value: "" },
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ]}
  selected="option1"
  orientation="vertical"
  onClick={handleClick}
/>`}}}},m={args:{name:`custom-styling`,options:c,selected:`option1`,fontSize:`16px`,fontWeight:`600`,spacing:`20px`,width:`300px`},parameters:{docs:{description:{story:"Larger, bolder labels (`fontSize`, `fontWeight`), 20px between the buttons (`spacing`) and a group 300px wide (`width`), to match the group to the text and layout around it."},source:{code:`<RadioButtonGroup
  name="custom-styling"
  options={options}
  selected="option1"
  fontSize="16px"
  fontWeight="600"
  spacing="20px"
  width="300px"
  onClick={handleClick}
/>`}}}},h={render:e=>(0,i.jsx)(`div`,{style:{"--radio-button-group-subtext-top":`24px`,"--radio-button-group-subtext-bottom":`12px`},children:(0,i.jsx)(r,{name:`css-customization`,options:[{type:`text`,label:`Choose an option:`,value:``},{value:`option1`,label:`Option 1`},{value:`option2`,label:`Option 2`},{value:`option3`,label:`Option 3`}],selected:`option1`,orientation:`vertical`,onClick:e.onClick})}),parameters:{docs:{description:{story:`Both caption spacings set on a wrapper around a vertical group that opens with the caption "Choose an option:" -- the variables are listed under CSS variables on this page.`},source:{code:`<div style={{
  "--radio-button-group-subtext-top": "24px",
  "--radio-button-group-subtext-bottom": "12px",
}}>
  <RadioButtonGroup
    name="css-customization"
    options={[
      { type: "text", label: "Choose an option:", value: "" },
      ...options,
    ]}
    selected="option1"
    orientation="vertical"
    onClick={handleClick}
  />
</div>`}}}},g=[`Default`,`VerticalLayout`,`DisabledStates`,`WithTextLabel`,`CustomStyling`,`CssCustomization`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    name: "default",
    options: baseOptions,
    orientation: "horizontal",
    selected: "option1",
    spacing: "15px"
  },
  parameters: {
    docs: {
      description: {
        story: "The group as most forms use it: a row of options with one chosen. Click another option to move the choice and watch the Actions panel for the value \`onClick\` receives; change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<RadioButtonGroup
  name="default"
  options={options}
  selected="option1"
  orientation="horizontal"
  spacing="15px"
  onClick={handleClick}
/>\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    name: "vertical",
    options: baseOptions,
    selected: "option1",
    orientation: "vertical"
  },
  parameters: {
    docs: {
      description: {
        story: "The options stacked in a column only as wide as its longest label (\`orientation\`). Suits longer lists and labels too long to sit side by side; without \`spacing\` the buttons sit directly under one another."
      },
      source: {
        code: \`<RadioButtonGroup
  name="vertical"
  options={options}
  selected="option1"
  orientation="vertical"
  onClick={handleClick}
/>\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <DisabledTemplate {...args} />,
  parameters: {
    docs: {
      description: {
        story: \`Shows the two ways to take options out of play:

- **Left** — the whole group greyed out and unclickable at once (\\\`isDisabled\\\`), for a setting that does not apply right now
- **Right** — only "Disabled Option" is greyed out (\\\`disabled\\\` on the option), while the other three stay selectable\`
      },
      source: {
        code: \`// All disabled
<RadioButtonGroup name="size" options={options} selected="option1" isDisabled onClick={handleClick} />

// Individual option disabled
<RadioButtonGroup
  name="size"
  options={[...options, { value: "option4", label: "Disabled Option", disabled: true }]}
  selected="option1"
  onClick={handleClick}
/>\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    name: "with-text",
    options: [{
      type: "text",
      label: "Please select an option:",
      value: ""
    }, ...baseOptions],
    selected: "option1",
    orientation: "vertical"
  },
  parameters: {
    docs: {
      description: {
        story: '"Please select an option:" is a caption placed inside the group, not a button (an option with \`type: "text"\`). Use it for a heading or an instruction above the options, or between two runs of them.'
      },
      source: {
        code: \`<RadioButtonGroup
  name="with-text"
  options={[
    { type: "text", label: "Please select an option:", value: "" },
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ]}
  selected="option1"
  orientation="vertical"
  onClick={handleClick}
/>\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    name: "custom-styling",
    options: baseOptions,
    selected: "option1",
    fontSize: "16px",
    fontWeight: "600",
    spacing: "20px",
    width: "300px"
  },
  parameters: {
    docs: {
      description: {
        story: "Larger, bolder labels (\`fontSize\`, \`fontWeight\`), 20px between the buttons (\`spacing\`) and a group 300px wide (\`width\`), to match the group to the text and layout around it."
      },
      source: {
        code: \`<RadioButtonGroup
  name="custom-styling"
  options={options}
  selected="option1"
  fontSize="16px"
  fontWeight="600"
  spacing="20px"
  width="300px"
  onClick={handleClick}
/>\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    "--radio-button-group-subtext-top": "24px",
    "--radio-button-group-subtext-bottom": "12px"
  } as CSSProperties}>
      <RadioButtonGroup name="css-customization" options={[{
      type: "text",
      label: "Choose an option:",
      value: ""
    }, {
      value: "option1",
      label: "Option 1"
    }, {
      value: "option2",
      label: "Option 2"
    }, {
      value: "option3",
      label: "Option 3"
    }]} selected="option1" orientation="vertical" onClick={args.onClick} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Both caption spacings set on a wrapper around a vertical group that opens with the caption "Choose an option:" -- the variables are listed under CSS variables on this page.\`
      },
      source: {
        code: \`<div style={{
  "--radio-button-group-subtext-top": "24px",
  "--radio-button-group-subtext-bottom": "12px",
}}>
  <RadioButtonGroup
    name="css-customization"
    options={[
      { type: "text", label: "Choose an option:", value: "" },
      ...options,
    ]}
    selected="option1"
    orientation="vertical"
    onClick={handleClick}
  />
</div>\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}}})))()}_();export{h as CssCustomization,m as CustomStyling,l as Default,f as DisabledStates,u as VerticalLayout,p as WithTextLabel,g as __namedExportsOrder,o as default};