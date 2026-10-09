import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{t as n}from"./rootTooltip-D3FzIvov.js";import{n as r}from"./tooltip-DcisrCmM.js";import{n as i,t as a}from"./Label-BMKvP-K4.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{r(),i(),o=t(),s={title:`UI/Form controls/Label`,component:a,parameters:{},argTypes:{text:{control:`text`,description:`The label's text`},title:{control:`text`,description:"Text of the kit's shared tooltip that opens when the pointer rests on the label; it needs `RootTooltip` mounted"},htmlFor:{control:`text`,description:"The `id` of the field this labels, so clicking the label focuses that field"},isRequired:{control:`boolean`,description:"Appends a red asterisk to the text and sets `aria-required` on the label; the field itself still needs `required`",table:{defaultValue:{summary:`false`}}},error:{control:`boolean`,description:"Turns the text red and sets `aria-invalid` on the label; the error message is not part of this component",table:{defaultValue:{summary:`false`}}},truncate:{control:`boolean`,description:"Cuts text that does not fit on one line with an ellipsis; the label is inline by default, so it needs `display: block` and a width to cut against",table:{defaultValue:{summary:`false`}}},isInline:{control:`boolean`,description:`Makes the label an inline block, so it keeps its own width and padding on the line beside the field; without it the label is a plain inline element`,table:{defaultValue:{summary:`false`}}},display:{control:!1,description:"Written onto the label as an HTML `display` attribute and does not change how it is laid out; set `display` through `style` instead"},children:{control:`text`,description:`Content rendered after the text and the asterisk, inside the same label`},className:{control:!1,description:`Class name added to the label`},id:{control:`text`,description:"The label's own `id`"},style:{control:!1,description:`Inline styles applied to the label`},tooltipMaxWidth:{control:!1,description:`Ignored: nothing reads this prop`}}},c=e=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:e.children}),l={render:e=>(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(a,{...e}),(0,o.jsx)(n,{})]}),args:{text:`First name`,title:`Enter your first name`,htmlFor:`firstName`},parameters:{docs:{description:{story:"The plain caption for a field, in semibold text; rest the pointer on it to read the tooltip (`title`), and change any other prop live in the Controls panel below."},source:{code:`<Label text="First name" htmlFor="firstName" title="Enter your first name" />
<RootTooltip />`}}}},u=()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(a,{text:`Email address`,htmlFor:`email`,isRequired:!0}),(0,o.jsx)(a,{text:`Password`,htmlFor:`password`,isRequired:!0}),(0,o.jsx)(a,{text:`Username`,htmlFor:`username`,isRequired:!0})]}),d=()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(a,{text:`Password`,htmlFor:`password`,error:!0}),(0,o.jsx)(a,{text:`Email`,htmlFor:`email`,isRequired:!0,error:!0})]}),f=()=>(0,o.jsxs)(`div`,{style:{width:150,border:`1px solid #ccc`,padding:8},children:[(0,o.jsx)(a,{text:`This is a very long label that will be truncated`,title:`This is a very long label that will be truncated`,truncate:!0,style:{display:`block`}}),(0,o.jsx)(n,{})]}),p=()=>(0,o.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:8},children:[(0,o.jsx)(a,{text:`Username`,htmlFor:`username`,isInline:!0}),(0,o.jsx)(`input`,{type:`text`,id:`username`,style:{padding:4}})]}),m=()=>(0,o.jsx)(a,{text:`Phone number`,htmlFor:`phone`,children:(0,o.jsx)(`span`,{style:{marginInlineStart:8,color:`#666`},children:`(optional)`})}),h=()=>(0,o.jsxs)(`form`,{style:{display:`flex`,flexDirection:`column`,gap:16},onSubmit:e=>e.preventDefault(),children:[(0,o.jsxs)(`div`,{children:[(0,o.jsx)(a,{text:`Username`,htmlFor:`form-username`,isRequired:!0}),(0,o.jsx)(`input`,{type:`text`,id:`form-username`,style:{display:`block`,marginTop:4,padding:8}})]}),(0,o.jsxs)(`div`,{children:[(0,o.jsx)(a,{text:`Email`,htmlFor:`form-email`,isRequired:!0,error:!0}),(0,o.jsx)(`input`,{type:`email`,id:`form-email`,style:{display:`block`,marginTop:4,padding:8,borderColor:`red`}})]}),(0,o.jsxs)(`div`,{children:[(0,o.jsx)(a,{text:`Bio`,htmlFor:`form-bio`,children:(0,o.jsx)(`span`,{style:{color:`#666`,fontWeight:400},children:`(optional)`})}),(0,o.jsx)(`textarea`,{id:`form-bio`,style:{display:`block`,marginTop:4,padding:8}})]})]}),g={render:()=>(0,o.jsx)(u,{}),parameters:{docs:{description:{story:"For fields a form cannot be sent without: each caption ends with a red asterisk (`isRequired`). The asterisk is hidden from screen readers, so the input needs `required` as well."},source:{code:`<Label text="Email address" htmlFor="email" isRequired />
<Label text="Password" htmlFor="password" isRequired />
<Label text="Username" htmlFor="username" isRequired />`}}}},_={render:()=>(0,o.jsx)(d,{}),parameters:{docs:{description:{story:"For a field that failed validation: the caption turns red (`error`), with or without the asterisk. The error message is not part of the label; render it next to the field."},source:{code:`<Label text="Password" htmlFor="password" error />
<Label text="Email" htmlFor="email" isRequired error />`}}}},v={render:()=>(0,o.jsx)(f,{}),parameters:{docs:{description:{story:"For a caption longer than the space it gets: in a 150px box the text stays on one line and ends with an ellipsis (`truncate`, with `display: block` so the label takes the box's width). Rest the pointer on it to read the full text in the tooltip (`title`), which needs `RootTooltip` mounted, as this story does."},source:{code:`<div style={{ width: 150 }}>
  <Label
    text="This is a very long label that will be truncated"
    title="This is a very long label that will be truncated"
    truncate
    style={{ display: "block" }}
  />
</div>
<RootTooltip />`}}}},y={render:()=>(0,o.jsx)(p,{}),parameters:{docs:{description:{story:"For a caption beside its field rather than above it: the label sits on the same line as the input (`isInline`)."},source:{code:`<Label text="Username" htmlFor="username" isInline />
<input type="text" id="username" />`}}}},b={render:()=>(0,o.jsx)(m,{}),parameters:{docs:{description:{story:'For a note that belongs to the caption, such as "(optional)": content passed as children follows the text inside the same label (`children`).'},source:{code:`<Label text="Phone number" htmlFor="phone">
  <span style={{ marginInlineStart: 8, color: "#666" }}>(optional)</span>
</Label>`}}}},x={render:()=>(0,o.jsx)(h,{}),parameters:{docs:{description:{story:"How the states read together in a form: a required field, a required field in error and an optional one, each label tied to its input by `htmlFor`, so clicking a caption focuses its field."},source:{code:`<Label text="Username" htmlFor="username" isRequired />
<input type="text" id="username" />

<Label text="Email" htmlFor="email" isRequired error />
<input type="email" id="email" />

<Label text="Bio" htmlFor="bio">
  <span>(optional)</span>
</Label>
<textarea id="bio" />`}}}},S={render:()=>(0,o.jsx)(`div`,{style:{"--label-required-color":`#0082c9`,"--label-error-color":`#d0021b`,"--text-size":`14px`},children:(0,o.jsxs)(c,{children:[(0,o.jsx)(a,{text:`Display name`,htmlFor:`displayName`,isRequired:!0}),(0,o.jsx)(a,{text:`Email address`,htmlFor:`email`,isRequired:!0,error:!0})]})}),parameters:{docs:{description:{story:"Both colours and the font size set on one wrapper -- the variables are listed under CSS variables on this page.\n\n- **Display name** shows the asterisk colour (`--label-required-color`) and the font size.\n- **Email address** adds `error` to show the text colour in the error state (`--label-error-color`)."},source:{code:`<div
  style={{
    "--label-required-color": "#0082c9",
    "--label-error-color": "#d0021b",
    "--text-size": "14px",
  }}
>
  <Label text="Display name" htmlFor="displayName" isRequired />
  <Label text="Email address" htmlFor="email" isRequired error />
</div>`}}}},C=[`Default`,`RequiredLabels`,`ErrorState`,`TruncatedLabel`,`InlineLabel`,`WithChildren`,`FormExample`,`CssCustomization`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <>
      <Label {...args} />
      <RootTooltip />
    </>,
  args: {
    text: "First name",
    title: "Enter your first name",
    htmlFor: "firstName"
  },
  parameters: {
    docs: {
      description: {
        story: "The plain caption for a field, in semibold text; rest the pointer on it to read the tooltip (\`title\`), and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Label text="First name" htmlFor="firstName" title="Enter your first name" />
<RootTooltip />\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <RequiredTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For fields a form cannot be sent without: each caption ends with a red asterisk (\`isRequired\`). The asterisk is hidden from screen readers, so the input needs \`required\` as well."
      },
      source: {
        code: \`<Label text="Email address" htmlFor="email" isRequired />
<Label text="Password" htmlFor="password" isRequired />
<Label text="Username" htmlFor="username" isRequired />\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <ErrorTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a field that failed validation: the caption turns red (\`error\`), with or without the asterisk. The error message is not part of the label; render it next to the field."
      },
      source: {
        code: \`<Label text="Password" htmlFor="password" error />
<Label text="Email" htmlFor="email" isRequired error />\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <TruncatedTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a caption longer than the space it gets: in a 150px box the text stays on one line and ends with an ellipsis (\`truncate\`, with \`display: block\` so the label takes the box's width). Rest the pointer on it to read the full text in the tooltip (\`title\`), which needs \`RootTooltip\` mounted, as this story does."
      },
      source: {
        code: \`<div style={{ width: 150 }}>
  <Label
    text="This is a very long label that will be truncated"
    title="This is a very long label that will be truncated"
    truncate
    style={{ display: "block" }}
  />
</div>
<RootTooltip />\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <InlineTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a caption beside its field rather than above it: the label sits on the same line as the input (\`isInline\`)."
      },
      source: {
        code: \`<Label text="Username" htmlFor="username" isInline />
<input type="text" id="username" />\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <WithChildrenTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'For a note that belongs to the caption, such as "(optional)": content passed as children follows the text inside the same label (\`children\`).'
      },
      source: {
        code: \`<Label text="Phone number" htmlFor="phone">
  <span style={{ marginInlineStart: 8, color: "#666" }}>(optional)</span>
</Label>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <FormExampleTemplate />,
  parameters: {
    docs: {
      description: {
        story: "How the states read together in a form: a required field, a required field in error and an optional one, each label tied to its input by \`htmlFor\`, so clicking a caption focuses its field."
      },
      source: {
        code: \`<Label text="Username" htmlFor="username" isRequired />
<input type="text" id="username" />

<Label text="Email" htmlFor="email" isRequired error />
<input type="email" id="email" />

<Label text="Bio" htmlFor="bio">
  <span>(optional)</span>
</Label>
<textarea id="bio" />\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--label-required-color": "#0082c9",
    "--label-error-color": "#d0021b",
    "--text-size": "14px"
  } as CSSProperties}>
      <Wrapper>
        <Label text="Display name" htmlFor="displayName" isRequired />
        <Label text="Email address" htmlFor="email" isRequired error />
      </Wrapper>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Both colours and the font size set on one wrapper -- the variables are listed under CSS variables on this page.

- **Display name** shows the asterisk colour (\\\`--label-required-color\\\`) and the font size.
- **Email address** adds \\\`error\\\` to show the text colour in the error state (\\\`--label-error-color\\\`).\`
      },
      source: {
        code: \`<div
  style={{
    "--label-required-color": "#0082c9",
    "--label-error-color": "#d0021b",
    "--text-size": "14px",
  }}
>
  <Label text="Display name" htmlFor="displayName" isRequired />
  <Label text="Email address" htmlFor="email" isRequired error />
</div>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}}})))()}w();export{S as CssCustomization,l as Default,_ as ErrorState,x as FormExample,y as InlineLabel,g as RequiredLabels,v as TruncatedLabel,b as WithChildren,C as __namedExportsOrder,s as default};