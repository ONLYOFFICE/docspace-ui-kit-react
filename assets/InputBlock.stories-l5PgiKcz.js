import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r}from"./text-input-D8OFtXHj.js";import{n as i,t as a}from"./TextInput.enums-z6wZ2LJ6.js";import{n as o,t as s}from"./input-block-DrQ2rbwD.js";import{n as c,t as l}from"./search.react-CU3kI2VG.js";var u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{u=t(),l(),r(),o(),d=n(),f={title:`UI/Form controls/InputBlock`,component:s,parameters:{},argTypes:{size:{control:`select`,options:Object.values(a),description:`Text size, padding and icon box height of the field`,table:{defaultValue:{summary:`base`}}},type:{control:`select`,options:Object.values(i),description:"Type of the inner `<input>`; required, so there is no default"},value:{control:`text`,description:`Text in the field; the field shows only what this holds`,table:{defaultValue:{summary:`""`}}},placeholder:{control:`text`,description:`Placeholder text`,table:{defaultValue:{summary:`" "`}}},maxLength:{control:`number`,description:`Maximum number of characters the field accepts; further typing is silently dropped`,table:{defaultValue:{summary:`255`}}},isDisabled:{control:`boolean`,description:`Greys the field out, stops typing and removes the icon at the end`,table:{defaultValue:{summary:`false`}}},isReadOnly:{control:`boolean`,description:`Stops typing but keeps the look of the field and its icon`,table:{defaultValue:{summary:`false`}}},hasError:{control:`boolean`,description:`Recolours the border of the group to the error colour`,table:{defaultValue:{summary:`false`}}},hasWarning:{control:`boolean`,description:`Recolours the border of the group to the warning colour`,table:{defaultValue:{summary:`false`}}},scale:{control:`boolean`,description:`Passed to the inner input, which already fills the group; the group is always as wide as its container, so nothing visible changes`,table:{defaultValue:{summary:`false`}}},iconName:{control:`text`,description:`URL of the icon at the end of the field`},iconNode:{control:!1,description:"The icon as an element, instead of `iconName`"},iconSize:{control:`number`,description:`Size of the icon in pixels; left out, the icon follows the field's size`},iconColor:{control:`color`,description:`Colour of the icon at the end of the field`},hoverColor:{control:`color`,description:`Colour of that icon while the pointer is over it`},isIconFill:{control:`boolean`,description:`Recolours the icon's paths to the icon color; leave it off for a multi-coloured icon`,table:{defaultValue:{summary:`false`}}},noIcon:{control:`boolean`,description:`Leaves the icon box out entirely; without it an empty box still takes space at the end of the field`,table:{defaultValue:{summary:`false`}}},onIconClick:{control:!1,description:`Called when the icon is clicked; without it the icon is drawn greyed out and ignores clicks`},children:{control:`text`,description:`Content rendered before the input, inside the same border, such as a currency sign or a country code`},tabIndex:{control:`number`,description:"Place of the inner `<input>` in the keyboard tab order; at the default the Tab key skips the field",table:{defaultValue:{summary:`-1`}}},isAutoFocussed:{control:`boolean`,description:"Focuses the inner `<input>` when the field first renders",table:{defaultValue:{summary:`false`}}},autoComplete:{control:`text`,description:"HTML `autocomplete` of the inner `<input>`",table:{defaultValue:{summary:`"off"`}}},name:{control:`text`,description:"HTML `name` of the inner `<input>`"},id:{control:`text`,description:"Applied to the inner `<input>`, not to the group around it"},mask:{control:!1,description:`Input mask: an array of characters and patterns, or a function returning one from the value`},keepCharPositions:{control:`boolean`,description:`With a mask, adding or deleting a character leaves the other characters where they are`,table:{defaultValue:{summary:`false`}}},onChange:{control:!1,description:"Called with the change event of the inner `<input>`"},onFocus:{action:`onFocus`,description:"Called when the inner `<input>` gets focus"},onBlur:{action:`onBlur`,description:"Called when the inner `<input>` loses focus"},onKeyDown:{action:`onKeyDown`,description:"Called when a key is pressed in the inner `<input>`"},onClick:{action:`onClick`,description:"Called when the inner `<input>` is clicked"},iconButtonClassName:{control:`text`,description:`Class name applied to the box around the icon`,table:{defaultValue:{summary:`""`}}},className:{control:`text`,description:`Class name applied to the group`},style:{control:`object`,description:`Inline style applied to the group`},dataTestId:{control:`text`,description:"`data-testid` of the group",table:{defaultValue:{summary:`"input-block"`}}},testId:{control:`text`,description:"`data-testid` of the inner `<input>`"},forwardedRef:{control:!1,description:"Ref to the inner `<input>` element"}}},p=e=>(0,d.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(250px, 1fr))`,gridGap:`16px`,alignItems:`center`},children:e.children}),m=e=>{let[t,n]=(0,u.useState)(e.value||``);return(0,d.jsx)(s,{...e,value:t,onChange:e=>n(e.target.value)})},h={placeholder:`Enter text here`,maxLength:255,size:a.base,type:i.text,isDisabled:!1,isReadOnly:!1,hasError:!1,hasWarning:!1,scale:!1,iconName:c,isIconFill:!1,value:``},g={render:e=>(0,d.jsx)(m,{...e}),args:h,parameters:{docs:{description:{story:`A text field with a search icon at its end, inside one border. Type in it, and change any other prop live in the Controls panel below.`},source:{code:`<InputBlock
  type={InputType.text}
  size={InputSize.base}
  iconName={SearchIcon}
  placeholder="Enter text here"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>`}}}},_=()=>(0,d.jsxs)(p,{children:[(0,d.jsx)(m,{...h,size:a.base,placeholder:`Base size`}),(0,d.jsx)(m,{...h,size:a.middle,placeholder:`Middle size`}),(0,d.jsx)(m,{...h,size:a.large,placeholder:`Large size`})]}),v={render:()=>(0,d.jsx)(_,{}),parameters:{docs:{description:{story:"Match the field to the controls around it: **Base size**, **Middle size** and **Large size** differ in text size, padding and the height of the icon box (`size`)."},source:{code:`<InputBlock size={InputSize.base} placeholder="Base size" iconName={SearchIcon} />
<InputBlock size={InputSize.middle} placeholder="Middle size" iconName={SearchIcon} />
<InputBlock size={InputSize.large} placeholder="Large size" iconName={SearchIcon} />`}}}},y=()=>(0,d.jsxs)(p,{children:[(0,d.jsx)(m,{...h,placeholder:`Normal`}),(0,d.jsx)(m,{...h,hasError:!0,placeholder:`Error state`}),(0,d.jsx)(m,{...h,hasWarning:!0,placeholder:`Warning state`}),(0,d.jsx)(m,{...h,isDisabled:!0,placeholder:`Disabled`}),(0,d.jsx)(m,{...h,isReadOnly:!0,value:`Read-only content`})]}),b={render:()=>(0,d.jsx)(y,{}),parameters:{docs:{description:{story:"How the field reads in each state: **Error state** and **Warning state** recolour the border of the whole group (`hasError`, `hasWarning`); **Disabled** greys the field out and drops the icon (`isDisabled`); **Read-only content** keeps the look and the icon and only stops typing (`isReadOnly`)."},source:{code:`<InputBlock placeholder="Normal" iconName={SearchIcon} />
<InputBlock placeholder="Error state" hasError iconName={SearchIcon} />
<InputBlock placeholder="Warning state" hasWarning iconName={SearchIcon} />
<InputBlock placeholder="Disabled" isDisabled iconName={SearchIcon} />
<InputBlock value="Read-only content" isReadOnly iconName={SearchIcon} />`}}}},x=()=>(0,d.jsx)(`div`,{style:{width:`300px`},children:(0,d.jsx)(m,{...h,type:i.password,placeholder:`Enter password`})}),S={render:()=>(0,d.jsx)(x,{}),parameters:{docs:{description:{story:"For a secret that must not be read off the screen, the typed characters are masked (`type={InputType.password}`). For a reveal toggle and strength rules, use `PasswordInput` instead."},source:{code:`<InputBlock
  type={InputType.password}
  placeholder="Enter password"
  iconName={SearchIcon}
/>`}}}},C=()=>(0,d.jsx)(`div`,{style:{width:`300px`},children:(0,d.jsx)(m,{...h,placeholder:`Click the icon`,onIconClick:()=>alert(`Icon clicked!`)})}),w={render:()=>(0,d.jsx)(C,{}),parameters:{docs:{description:{story:"An icon that does something, such as clearing the field or opening a picker, needs a click handler (`onIconClick`); without it the icon is drawn greyed out and ignores clicks, as in the other stories. Click the search icon to see the action."},source:{code:`<InputBlock
  placeholder="Click the icon"
  iconName={SearchIcon}
  onIconClick={() => alert("Icon clicked!")}
/>`}}}},T=()=>(0,d.jsxs)(p,{children:[(0,d.jsx)(m,{...h,placeholder:`Amount`,noIcon:!0,children:(0,d.jsx)(`span`,{children:`$`})}),(0,d.jsx)(m,{...h,placeholder:`Phone number`,children:(0,d.jsx)(`span`,{children:`+1`})})]}),E={render:()=>(0,d.jsx)(T,{}),parameters:{docs:{description:{story:"A fixed part of the value that the user does not type sits in front of the input, inside the same border (`children`). **Amount** has a currency sign and no icon at its end (`noIcon`); **Phone number** has a country code and keeps its icon."},source:{code:`<InputBlock type={InputType.text} placeholder="Amount" value={amount} onChange={handleAmount} noIcon>
  <span>$</span>
</InputBlock>
<InputBlock type={InputType.text} placeholder="Phone number" iconName={SearchIcon} value={phone} onChange={handlePhone}>
  <span>+1</span>
</InputBlock>`}}}},D=`بحث`,O=()=>(0,d.jsxs)(`div`,{dir:`rtl`,style:{display:`grid`,gap:`16px`,width:`300px`},children:[(0,d.jsx)(m,{...h,placeholder:D}),(0,d.jsx)(m,{...h,placeholder:D,children:(0,d.jsx)(`span`,{children:`$`})})]}),k={render:()=>(0,d.jsx)(O,{}),globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`106px`},description:{story:'The same field under a right-to-left interface: the icon moves to the left end, the prefix to the right end, and the placeholder sits at the right edge. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.'},source:{code:`<div dir="rtl">
  <InputBlock type={InputType.text} iconName={SearchIcon} placeholder="..." value={value} onChange={handleChange} />
  <InputBlock type={InputType.text} iconName={SearchIcon} placeholder="..." value={amount} onChange={handleAmount}>
    <span>$</span>
  </InputBlock>
</div>`}}}},A={render:()=>(0,d.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`,width:`300px`,"--text-input-bg":`#f5f3ff`,"--text-input-border-color":`#c4b5fd`,"--text-input-border-hover":`#7c3aed`,"--text-input-border-focus":`#3b0764`,"--text-input-color":`#4c1d95`,"--text-input-font-size":`14px`,"--text-input-radius":`8px`,"--input-block-icon-padding":`16px`,"--input-block-icon-padding-lg":`24px`,"--input-block-icon-start":`8px`,"--input-block-children-padding":`0 4px 0 12px`},children:[(0,d.jsx)(s,{type:i.text,iconName:c,placeholder:`Amount`,value:`120`,onChange:()=>{},children:(0,d.jsx)(`span`,{children:`$`})}),(0,d.jsx)(s,{type:i.text,size:a.large,iconName:c,placeholder:`Large size`,value:``,onChange:()=>{}})]}),parameters:{docs:{description:{story:`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

**Amount** carries a prefix, for the prefix padding, and shows every other variable except the large icon padding; **Large size** is there for \`--input-block-icon-padding-lg\`, which only the large size reads. Hover and focus a field to see the hover and focus border colours.`},source:{code:`<div style={{ "--text-input-bg": "#f5f3ff", "--text-input-border-color": "#c4b5fd", "--input-block-icon-padding": "16px" }}>
  <InputBlock type={InputType.text} iconName={SearchIcon} value="120" onChange={handleChange}>
    <span>$</span>
  </InputBlock>
  <InputBlock type={InputType.text} size={InputSize.large} iconName={SearchIcon} value="" onChange={handleChange} />
</div>`}}}},j=[`Default`,`Sizes`,`States`,`PasswordType`,`WithIconClick`,`WithPrefix`,`RightToLeft`,`CssCustomization`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <ControlledInputBlock {...args} />,
  args: defaultProps,
  parameters: {
    docs: {
      description: {
        story: "A text field with a search icon at its end, inside one border. Type in it, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<InputBlock
  type={InputType.text}
  size={InputSize.base}
  iconName={SearchIcon}
  placeholder="Enter text here"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Match the field to the controls around it: **Base size**, **Middle size** and **Large size** differ in text size, padding and the height of the icon box (\`size\`)."
      },
      source: {
        code: \`<InputBlock size={InputSize.base} placeholder="Base size" iconName={SearchIcon} />
<InputBlock size={InputSize.middle} placeholder="Middle size" iconName={SearchIcon} />
<InputBlock size={InputSize.large} placeholder="Large size" iconName={SearchIcon} />\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "How the field reads in each state: **Error state** and **Warning state** recolour the border of the whole group (\`hasError\`, \`hasWarning\`); **Disabled** greys the field out and drops the icon (\`isDisabled\`); **Read-only content** keeps the look and the icon and only stops typing (\`isReadOnly\`)."
      },
      source: {
        code: \`<InputBlock placeholder="Normal" iconName={SearchIcon} />
<InputBlock placeholder="Error state" hasError iconName={SearchIcon} />
<InputBlock placeholder="Warning state" hasWarning iconName={SearchIcon} />
<InputBlock placeholder="Disabled" isDisabled iconName={SearchIcon} />
<InputBlock value="Read-only content" isReadOnly iconName={SearchIcon} />\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <PasswordTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a secret that must not be read off the screen, the typed characters are masked (\`type={InputType.password}\`). For a reveal toggle and strength rules, use \`PasswordInput\` instead."
      },
      source: {
        code: \`<InputBlock
  type={InputType.password}
  placeholder="Enter password"
  iconName={SearchIcon}
/>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <WithIconClickTemplate />,
  parameters: {
    docs: {
      description: {
        story: "An icon that does something, such as clearing the field or opening a picker, needs a click handler (\`onIconClick\`); without it the icon is drawn greyed out and ignores clicks, as in the other stories. Click the search icon to see the action."
      },
      source: {
        code: \`<InputBlock
  placeholder="Click the icon"
  iconName={SearchIcon}
  onIconClick={() => alert("Icon clicked!")}
/>\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <WithPrefixTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A fixed part of the value that the user does not type sits in front of the input, inside the same border (\`children\`). **Amount** has a currency sign and no icon at its end (\`noIcon\`); **Phone number** has a country code and keeps its icon."
      },
      source: {
        code: \`<InputBlock type={InputType.text} placeholder="Amount" value={amount} onChange={handleAmount} noIcon>
  <span>$</span>
</InputBlock>
<InputBlock type={InputType.text} placeholder="Phone number" iconName={SearchIcon} value={phone} onChange={handlePhone}>
  <span>+1</span>
</InputBlock>\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <RightToLeftTemplate />,
  globals: {
    direction: "rtl"
  },
  parameters: {
    noPadding: true,
    docs: {
      story: {
        inline: false,
        height: "106px"
      },
      description: {
        story: 'The same field under a right-to-left interface: the icon moves to the left end, the prefix to the right end, and the placeholder sits at the right edge. The direction comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar); the wrapper also carries \`dir="rtl"\` for the rules that read the DOM direction.'
      },
      source: {
        code: \`<div dir="rtl">
  <InputBlock type={InputType.text} iconName={SearchIcon} placeholder="..." value={value} onChange={handleChange} />
  <InputBlock type={InputType.text} iconName={SearchIcon} placeholder="..." value={amount} onChange={handleAmount}>
    <span>$</span>
  </InputBlock>
</div>\`
      }
    }
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "300px",
    "--text-input-bg": "#f5f3ff",
    "--text-input-border-color": "#c4b5fd",
    "--text-input-border-hover": "#7c3aed",
    "--text-input-border-focus": "#3b0764",
    "--text-input-color": "#4c1d95",
    "--text-input-font-size": "14px",
    "--text-input-radius": "8px",
    "--input-block-icon-padding": "16px",
    "--input-block-icon-padding-lg": "24px",
    "--input-block-icon-start": "8px",
    "--input-block-children-padding": "0 4px 0 12px"
  } as CSSProperties}>
      <InputBlock type={InputType.text} iconName={SearchReactSvgUrl} placeholder="Amount" value="120" onChange={() => {}}>
        <span>$</span>
      </InputBlock>
      <InputBlock type={InputType.text} size={InputSize.large} iconName={SearchReactSvgUrl} placeholder="Large size" value="" onChange={() => {}} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

**Amount** carries a prefix, for the prefix padding, and shows every other variable except the large icon padding; **Large size** is there for \\\`--input-block-icon-padding-lg\\\`, which only the large size reads. Hover and focus a field to see the hover and focus border colours.\`
      },
      source: {
        code: \`<div style={{ "--text-input-bg": "#f5f3ff", "--text-input-border-color": "#c4b5fd", "--input-block-icon-padding": "16px" }}>
  <InputBlock type={InputType.text} iconName={SearchIcon} value="120" onChange={handleChange}>
    <span>$</span>
  </InputBlock>
  <InputBlock type={InputType.text} size={InputSize.large} iconName={SearchIcon} value="" onChange={handleChange} />
</div>\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}}})))()}M();export{A as CssCustomization,g as Default,S as PasswordType,k as RightToLeft,v as Sizes,b as States,w as WithIconClick,E as WithPrefix,j as __namedExportsOrder,f as default};