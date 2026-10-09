import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./ActionButton-Cxv-KZCT.js";var i,a,o,s,c,l,u,d;function f(){return(f=e((()=>{n(),i=t(),a=()=>(0,i.jsx)(`svg`,{xmlns:`http://www.w3.org/2000/svg`,width:`16`,height:`16`,viewBox:`0 0 16 16`,fill:`currentColor`,children:(0,i.jsx)(`path`,{d:`M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z`})}),o={title:`UI/Interactive elements/ActionButton`,component:r,parameters:{},argTypes:{label:{control:`text`,description:`Text of the button; anything passed as children is dropped`},icon:{control:!1,description:`Icon node drawn at 12px before the label and filled with the text colour`},as:{control:!1,description:`Element or component to render instead of a button; its props are then accepted`,table:{defaultValue:{summary:`button`}}},className:{control:`text`,description:`Class applied to the rendered element after the component's own`},disabled:{control:`boolean`,description:`Native button attribute: fades the button to half opacity and blocks clicks`,table:{defaultValue:{summary:`false`}}},onClick:{action:`onClick`}},args:{label:`Clear filter`}},s={render:e=>(0,i.jsx)(r,{...e}),parameters:{docs:{description:{story:"The plain text button for a secondary action; click it to see `onClick` in the Actions panel, and change any other prop live in the Controls panel below."},source:{code:`<ActionButton label="Clear filter" onClick={handleClick} />`}}}},c={args:{icon:(0,i.jsx)(a,{})},parameters:{docs:{description:{story:"An icon before the label makes the action easier to spot in a busy toolbar; the icon takes the text colour (`icon`)."},source:{code:`<ActionButton icon={<FilterIcon />} label="Clear filter" />`}}}},l={args:{as:`a`,href:`#`,label:`Go to page`},parameters:{docs:{description:{story:"The same look for an action that navigates: the button becomes a link and takes `href` (`as`)."},source:{code:`<ActionButton as="a" href="/about" label="Go to page" />`}}}},u={args:{icon:(0,i.jsx)(a,{}),disabled:!0},parameters:{docs:{description:{story:"An action that is not available yet stays in place but fades and ignores clicks (`disabled`); it works only on the default `button`."},source:{code:`<ActionButton icon={<FilterIcon />} label="Clear filter" disabled />`}}}},d=[`Default`,`WithIcon`,`AsLink`,`DisabledState`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <ActionButton {...args} />,
  parameters: {
    docs: {
      description: {
        story: "The plain text button for a secondary action; click it to see \\\`onClick\\\` in the Actions panel, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<ActionButton label="Clear filter" onClick={handleClick} />\`
      }
    }
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    icon: <FilterIcon />
  },
  parameters: {
    docs: {
      description: {
        story: "An icon before the label makes the action easier to spot in a busy toolbar; the icon takes the text colour (\\\`icon\\\`)."
      },
      source: {
        code: \`<ActionButton icon={<FilterIcon />} label="Clear filter" />\`
      }
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    as: "a",
    href: "#",
    label: "Go to page"
  },
  parameters: {
    docs: {
      description: {
        story: "The same look for an action that navigates: the button becomes a link and takes \\\`href\\\` (\\\`as\\\`)."
      },
      source: {
        code: \`<ActionButton as="a" href="/about" label="Go to page" />\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    icon: <FilterIcon />,
    disabled: true
  },
  parameters: {
    docs: {
      description: {
        story: "An action that is not available yet stays in place but fades and ignores clicks (\\\`disabled\\\`); it works only on the default \\\`button\\\`."
      },
      source: {
        code: \`<ActionButton icon={<FilterIcon />} label="Clear filter" disabled />\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}}})))()}f();export{l as AsLink,s as Default,u as DisabledState,c as WithIcon,d as __namedExportsOrder,o as default};