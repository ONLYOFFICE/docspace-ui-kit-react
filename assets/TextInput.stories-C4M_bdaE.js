import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./text-input-D8OFtXHj.js";import{n as a,r as o,t as s}from"./TextInput.enums-z6wZ2LJ6.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M;function N(){return(N=e((()=>{c=t(),r(),o(),l=n(),u={title:`UI/Form controls/TextInput`,component:i,parameters:{design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=633-3686&mode=dev`}},argTypes:{size:{control:`select`,options:Object.values(s),description:`Width of the field: 173px, 300px or 550px; large also uses a 16px font, middle a semibold weight`,table:{defaultValue:{summary:`base`}}},type:{control:`select`,options:Object.values(a),description:`HTML input type`,table:{defaultValue:{summary:`text`}}},value:{control:`text`,description:`Input value`},placeholder:{control:`text`,description:"Placeholder text; defaults to a single space so `:placeholder-shown` matches even when none was asked for",table:{defaultValue:{summary:`" "`}}},isDisabled:{control:`boolean`,description:`Disable the input field`,table:{defaultValue:{summary:`false`}}},isReadOnly:{control:`boolean`,description:`Make the input read-only`,table:{defaultValue:{summary:`false`}}},hasError:{control:`boolean`,description:`Colors the border red, also while hovered and focused`,table:{defaultValue:{summary:`false`}}},hasWarning:{control:`boolean`,description:`Colors the border orange, also while hovered and focused`,table:{defaultValue:{summary:`false`}}},scale:{control:`boolean`,description:`Makes the field fill the width of its container instead of its size's fixed width`,table:{defaultValue:{summary:`false`}}},withBorder:{control:`boolean`,description:`Show border around the input`,table:{defaultValue:{summary:`true`}}},isBold:{control:`boolean`,description:`Set font weight to 600`,table:{defaultValue:{summary:`false`}}},maxLength:{control:`number`,description:`Maximum character length`,table:{defaultValue:{summary:`255`}}},fontWeight:{control:`number`,description:"CSS font weight of the text; `isBold` overrides it with 600"},tabIndex:{control:`number`,description:`Position in the Tab order; left out, the field takes its natural place, pass -1 to skip it from the keyboard`},isAutoFocussed:{control:`boolean`,description:`Focuses the field when it mounts`,table:{defaultValue:{summary:`false`}}},dir:{control:`select`,options:[`auto`,`ltr`,`rtl`],description:"Text direction of the value; `auto` lets each value pick its own from its first strong character",table:{defaultValue:{summary:`"auto"`}}},inputMode:{control:`select`,options:[`none`,`text`,`decimal`,`numeric`,`tel`,`search`,`email`,`url`],description:`Virtual keyboard layout on touch devices`},mask:{control:!1,description:`An array of literal characters and RegExps, or a function of the current value returning one; the value is formatted to it as the user types`},guide:{control:`boolean`,description:`Shows the whole mask up front, with underscores where characters are still missing; without it the mask grows as the user types`,table:{defaultValue:{summary:`false`}}},keepCharPositions:{control:`boolean`,description:`Typing or deleting a character leaves the others in place instead of shifting them along the mask`,table:{defaultValue:{summary:`false`}}},onChange:{description:`Called with the native change event on every edit; the stories wire it themselves to keep the field controlled`},onBlur:{action:`onBlur`,description:`Called with the native focus event when the field loses focus`},onFocus:{action:`onFocus`,description:`Called with the native focus event when the field gains focus`},onKeyDown:{action:`onKeyDown`,description:`Called with the native keyboard event on every key press`},onClick:{action:`onClick`,description:`Called with the native mouse event on click`},onContextMenu:{action:`onContextMenu`,description:`Called with the native mouse event on right click`},id:{control:`text`,description:"HTML id of the input element, the target for `<label htmlFor>`"},name:{control:`text`,description:`HTML name of the input element for form submission`},autoComplete:{control:`text`,description:`HTML autocomplete of the input element`,table:{defaultValue:{summary:`"off"`}}},spellCheck:{control:`boolean`,description:`HTML spellcheck of the input element`},className:{control:`text`,description:`Extra class on the input element`},style:{control:`object`,description:`Inline styles on the input element`},forwardedRef:{control:!1,description:"Ref to the input element; not passed on when `mask` is set"},testId:{control:`text`,description:`Value of data-testid on the input element`,table:{defaultValue:{summary:`"text-input"`}}}}},d=e=>(0,l.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(220px, 1fr))`,gridGap:`16px`,alignItems:`center`},children:e.children}),f=e=>{let{initialValue:t,type:n=a.text,...r}=e,[o,s]=(0,c.useState)(t||r.value||``);return(0,l.jsx)(i,{...r,type:n,value:o,onChange:e=>s(e.target.value)})},p={render:e=>(0,l.jsx)(f,{...e}),args:{placeholder:`Enter text here`,maxLength:255,size:s.base,type:a.text,isDisabled:!1,isReadOnly:!1,hasError:!1,hasWarning:!1,scale:!1,withBorder:!0,value:``},parameters:{docs:{description:{story:"An empty field with a placeholder, the shape most forms start from (`placeholder`); change any other prop live in the Controls panel below."},source:{code:`<TextInput
  type={InputType.text}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter text here"
/>`}}}},m=()=>(0,l.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`,alignItems:`flex-start`},children:Object.keys(s).map(e=>(0,l.jsx)(f,{size:e,initialValue:`${e[0].toUpperCase()}${e.slice(1)} size`,placeholder:`${e} input`},e))}),h={render:()=>(0,l.jsx)(m,{}),parameters:{docs:{description:{story:"Pick the width by the room the form gives the field: 173px for a short value, 300px for most text, 550px for a long one (`size`); the middle size is also semibold, the large one uses a 16px font."},source:{code:`<TextInput size={InputSize.base} value="Base size" />
<TextInput size={InputSize.middle} value="Middle size" />
<TextInput size={InputSize.large} value="Large size" />`}}}},g=()=>(0,l.jsxs)(d,{children:[(0,l.jsx)(f,{type:a.text,placeholder:`Text`}),(0,l.jsx)(f,{type:a.password,placeholder:`Password`}),(0,l.jsx)(f,{type:a.email,placeholder:`Email`}),(0,l.jsx)(f,{type:a.tel,placeholder:`Telephone`}),(0,l.jsx)(f,{type:a.search,placeholder:`Search`}),(0,l.jsx)(f,{type:a.number,placeholder:`Number`})]}),_={render:()=>(0,l.jsx)(g,{}),parameters:{docs:{description:{story:"Match `type` to the value so the browser supplies the right keyboard and value rules: password hides the characters, number rejects letters, email and tel bring up their own touch keyboards."},source:{code:`<TextInput type={InputType.text} placeholder="Text" />
<TextInput type={InputType.password} placeholder="Password" />
<TextInput type={InputType.email} placeholder="Email" />
<TextInput type={InputType.tel} placeholder="Telephone" />
<TextInput type={InputType.search} placeholder="Search" />
<TextInput type={InputType.number} placeholder="Number" />`}}}},v=()=>(0,l.jsxs)(d,{children:[(0,l.jsx)(f,{initialValue:`Normal`,placeholder:`Normal`}),(0,l.jsx)(f,{initialValue:`Error state`,hasError:!0,placeholder:`Error`}),(0,l.jsx)(f,{initialValue:`Warning state`,hasWarning:!0,placeholder:`Warning`}),(0,l.jsx)(f,{initialValue:`Disabled`,isDisabled:!0,placeholder:`Disabled`}),(0,l.jsx)(f,{initialValue:`Read only`,isReadOnly:!0,placeholder:`Read only`}),(0,l.jsx)(f,{initialValue:`No border`,withBorder:!1,placeholder:`No border`})]}),y={render:()=>(0,l.jsx)(v,{}),parameters:{docs:{description:{story:"Every state the field can be in, side by side: a red border on `hasError`, an orange one on `hasWarning`, a grey box that ignores input on `isDisabled`, a field that blocks typing without changing its look on `isReadOnly`, and the bare text of `withBorder={false}` for inline use."},source:{code:`<TextInput value="Normal" />
<TextInput value="Error state" hasError />
<TextInput value="Warning state" hasWarning />
<TextInput value="Disabled" isDisabled />
<TextInput value="Read only" isReadOnly />
<TextInput value="No border" withBorder={false} />`}}}},b=[`+`,/\d/,` `,`(`,/\d/,/\d/,/\d/,`)`,` `,/\d/,/\d/,/\d/,`-`,/\d/,/\d/,/\d/,/\d/],x=e=>e.startsWith(`+`)?b:[/\d/,/\d/,/\d/,/\d/],S=()=>(0,l.jsxs)(d,{children:[(0,l.jsx)(f,{mask:[/\d/,/\d/,`/`,/\d/,/\d/,`/`,/\d/,/\d/,/\d/,/\d/],placeholder:`DD/MM/YYYY`,guide:!0,keepCharPositions:!0}),(0,l.jsx)(f,{mask:[`+`,/\d/,` `,`(`,/\d/,/\d/,/\d/,`)`,` `,/\d/,/\d/,/\d/,`-`,/\d/,/\d/,/\d/,/\d/],placeholder:`+1 (___) ___-____`,guide:!0}),(0,l.jsx)(f,{mask:x,placeholder:`Extension, or + for a full number`})]}),C={render:()=>(0,l.jsx)(S,{}),parameters:{docs:{description:{story:"Use a mask when the value has one fixed shape, such as a date or a phone number: the field inserts the separators as the user types and refuses characters that do not fit (`mask`). The date and phone fields show the whole pattern up front with underscores for the missing digits (`guide`); only the date field keeps the other digits in place when one is deleted (`keepCharPositions`). The third field passes a function instead of an array, so the pattern is chosen from the value as it is typed: a plain digit starts a four-digit extension, a leading `+` switches to the full number; without `guide` the mask grows with the value."},source:{code:`// Date mask
<TextInput
  mask={[/\\d/, /\\d/, "/", /\\d/, /\\d/, "/", /\\d/, /\\d/, /\\d/, /\\d/]}
  placeholder="DD/MM/YYYY"
  guide
  keepCharPositions
/>

// Phone mask
<TextInput
  mask={["+", /\\d/, " ", "(", /\\d/, /\\d/, /\\d/, ")", " ", /\\d/, /\\d/, /\\d/, "-", /\\d/, /\\d/, /\\d/, /\\d/]}
  placeholder="+1 (___) ___-____"
  guide
/>

// Mask chosen from the value
const phoneOrExtensionMask = (value: string) =>
  value.startsWith("+")
    ? ["+", /\\d/, " ", "(", /\\d/, /\\d/, /\\d/, ")", " ", /\\d/, /\\d/, /\\d/, "-", /\\d/, /\\d/, /\\d/, /\\d/]
    : [/\\d/, /\\d/, /\\d/, /\\d/];

<TextInput mask={phoneOrExtensionMask} placeholder="Extension, or + for a full number" />`}}}},w=()=>(0,l.jsxs)(`div`,{style:{display:`grid`,gridGap:`16px`},children:[(0,l.jsx)(f,{scale:!0,initialValue:`Scaled base`,size:s.base}),(0,l.jsx)(f,{scale:!0,initialValue:`Scaled middle`,size:s.middle}),(0,l.jsx)(f,{scale:!0,initialValue:`Scaled large`,size:s.large})]}),T={render:()=>(0,l.jsx)(w,{}),parameters:{docs:{description:{story:"Let the field fill its column instead of its size's fixed width, for form grids and side panels (`scale`); font size and padding still follow `size`."},source:{code:`<TextInput scale size={InputSize.base} value="Scaled base" />
<TextInput scale size={InputSize.middle} value="Scaled middle" />
<TextInput scale size={InputSize.large} value="Scaled large" />`}}}},E=()=>(0,l.jsxs)(d,{children:[(0,l.jsx)(f,{initialValue:`Normal weight`}),(0,l.jsx)(f,{initialValue:`Bold weight`,isBold:!0}),(0,l.jsx)(f,{initialValue:`Weight 700`,fontWeight:700})]}),D={render:()=>(0,l.jsx)(E,{}),parameters:{docs:{description:{story:"Emphasize a value with `isBold` (600) or pass any `fontWeight`; the middle size is already 600, so `isBold` changes nothing there."},source:{code:`<TextInput value="Normal weight" />
<TextInput value="Bold weight" isBold />
<TextInput value="Weight 700" fontWeight={700} />`}}}},O={render:()=>(0,l.jsx)(f,{isAutoFocussed:!0,placeholder:`Focused as soon as it mounts`}),parameters:{noPadding:!0,docs:{story:{inline:!1,height:`58px`},description:{story:"Put the caret in the field the moment it appears, for a dialog or a panel whose first action is typing (`isAutoFocussed`); the field is focused when the story loads, so start typing without clicking."},source:{code:`<TextInput
  type={InputType.text}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  isAutoFocussed
  placeholder="Focused as soon as it mounts"
/>`}}}},k=()=>(0,l.jsxs)(`div`,{dir:`rtl`,style:{display:`grid`,gap:`16px`,width:`300px`},children:[(0,l.jsx)(f,{placeholder:`أدخل النص`}),(0,l.jsx)(f,{type:a.tel,placeholder:`+1 (___) ___-____`})]}),A={render:()=>(0,l.jsx)(k,{}),globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`106px`},description:{story:'The same fields under a right-to-left interface: the placeholder sits at the right edge and the caret of an empty field starts on the right; text typed in a right-to-left script runs right to left, Latin text still runs left to right (`dir="auto"`); the tel field keeps its placeholder left-to-right, so a phone number reads the same as in a left-to-right interface. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.'},source:{code:`<div dir="rtl">
  <TextInput type={InputType.text} value={value} onChange={handleChange} placeholder="أدخل النص" />
  <TextInput type={InputType.tel} value={phone} onChange={handlePhone} placeholder="+1 (___) ___-____" />
</div>`}}}},j={render:()=>(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`,width:`300px`,"--text-input-bg":`#f5f3ff`,"--text-input-border-color":`#c4b5fd`,"--text-input-border-hover":`#7c3aed`,"--text-input-border-focus":`#4c1d95`,"--text-input-font-size":`14px`,"--text-input-radius":`8px`,"--text-input-color":`#4c1d95`,"--text-input-disabled-bg":`#ddd6fe`},children:[(0,l.jsx)(i,{type:a.text,value:`Custom styled input`,onChange:()=>{}}),(0,l.jsx)(i,{type:a.text,value:``,placeholder:`Placeholder text`,style:{"--text-input-placeholder-color":`#8b5cf6`},onChange:()=>{}}),(0,l.jsx)(i,{type:a.text,value:`Disabled`,isDisabled:!0,onChange:()=>{}})]}),parameters:{docs:{description:{story:"The first field sets the shared `--text-input-*` tokens on a wrapper -- the variables are listed under CSS variables on this page; hover and focus it to see the two border variables. The second carries `--text-input-placeholder-color` in its own `style`, the only place it works. The third is disabled: the theme takes over its text and border, and only the radius, the font size and `--text-input-disabled-bg` still apply."},source:{code:`<div
  style={
    {
      "--text-input-bg": "#f5f3ff",
      "--text-input-border-color": "#c4b5fd",
      "--text-input-border-hover": "#7c3aed",
      "--text-input-border-focus": "#4c1d95",
      "--text-input-font-size": "14px",
      "--text-input-radius": "8px",
      "--text-input-color": "#4c1d95",
      "--text-input-disabled-bg": "#ddd6fe",
    } as CSSProperties
  }
>
  <TextInput type={InputType.text} value="Custom styled input" onChange={() => {}} />
  <TextInput
    type={InputType.text}
    value=""
    placeholder="Placeholder text"
    style={{ "--text-input-placeholder-color": "#8b5cf6" } as CSSProperties}
    onChange={() => {}}
  />
  <TextInput type={InputType.text} value="Disabled" isDisabled onChange={() => {}} />
</div>`}}}},M=[`Default`,`Sizes`,`Types`,`States`,`WithMask`,`ScaledInputs`,`BoldText`,`AutoFocused`,`RightToLeft`,`CssCustomization`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <ControlledInput {...args} />,
  args: {
    placeholder: "Enter text here",
    maxLength: 255,
    size: InputSize.base,
    type: InputType.text,
    isDisabled: false,
    isReadOnly: false,
    hasError: false,
    hasWarning: false,
    scale: false,
    withBorder: true,
    value: ""
  },
  parameters: {
    docs: {
      description: {
        story: "An empty field with a placeholder, the shape most forms start from (\`placeholder\`); change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<TextInput
  type={InputType.text}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter text here"
/>\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Pick the width by the room the form gives the field: 173px for a short value, 300px for most text, 550px for a long one (\`size\`); the middle size is also semibold, the large one uses a 16px font."
      },
      source: {
        code: \`<TextInput size={InputSize.base} value="Base size" />
<TextInput size={InputSize.middle} value="Middle size" />
<TextInput size={InputSize.large} value="Large size" />\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <TypesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Match \`type\` to the value so the browser supplies the right keyboard and value rules: password hides the characters, number rejects letters, email and tel bring up their own touch keyboards."
      },
      source: {
        code: \`<TextInput type={InputType.text} placeholder="Text" />
<TextInput type={InputType.password} placeholder="Password" />
<TextInput type={InputType.email} placeholder="Email" />
<TextInput type={InputType.tel} placeholder="Telephone" />
<TextInput type={InputType.search} placeholder="Search" />
<TextInput type={InputType.number} placeholder="Number" />\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Every state the field can be in, side by side: a red border on \`hasError\`, an orange one on \`hasWarning\`, a grey box that ignores input on \`isDisabled\`, a field that blocks typing without changing its look on \`isReadOnly\`, and the bare text of \`withBorder={false}\` for inline use."
      },
      source: {
        code: \`<TextInput value="Normal" />
<TextInput value="Error state" hasError />
<TextInput value="Warning state" hasWarning />
<TextInput value="Disabled" isDisabled />
<TextInput value="Read only" isReadOnly />
<TextInput value="No border" withBorder={false} />\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <WithMaskTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Use a mask when the value has one fixed shape, such as a date or a phone number: the field inserts the separators as the user types and refuses characters that do not fit (\`mask\`). The date and phone fields show the whole pattern up front with underscores for the missing digits (\`guide\`); only the date field keeps the other digits in place when one is deleted (\`keepCharPositions\`). The third field passes a function instead of an array, so the pattern is chosen from the value as it is typed: a plain digit starts a four-digit extension, a leading \`+\` switches to the full number; without \`guide\` the mask grows with the value."
      },
      source: {
        code: \`// Date mask
<TextInput
  mask={[/\\\\d/, /\\\\d/, "/", /\\\\d/, /\\\\d/, "/", /\\\\d/, /\\\\d/, /\\\\d/, /\\\\d/]}
  placeholder="DD/MM/YYYY"
  guide
  keepCharPositions
/>

// Phone mask
<TextInput
  mask={["+", /\\\\d/, " ", "(", /\\\\d/, /\\\\d/, /\\\\d/, ")", " ", /\\\\d/, /\\\\d/, /\\\\d/, "-", /\\\\d/, /\\\\d/, /\\\\d/, /\\\\d/]}
  placeholder="+1 (___) ___-____"
  guide
/>

// Mask chosen from the value
const phoneOrExtensionMask = (value: string) =>
  value.startsWith("+")
    ? ["+", /\\\\d/, " ", "(", /\\\\d/, /\\\\d/, /\\\\d/, ")", " ", /\\\\d/, /\\\\d/, /\\\\d/, "-", /\\\\d/, /\\\\d/, /\\\\d/, /\\\\d/]
    : [/\\\\d/, /\\\\d/, /\\\\d/, /\\\\d/];

<TextInput mask={phoneOrExtensionMask} placeholder="Extension, or + for a full number" />\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <ScaledTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Let the field fill its column instead of its size's fixed width, for form grids and side panels (\`scale\`); font size and padding still follow \`size\`."
      },
      source: {
        code: \`<TextInput scale size={InputSize.base} value="Scaled base" />
<TextInput scale size={InputSize.middle} value="Scaled middle" />
<TextInput scale size={InputSize.large} value="Scaled large" />\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <BoldTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Emphasize a value with \`isBold\` (600) or pass any \`fontWeight\`; the middle size is already 600, so \`isBold\` changes nothing there."
      },
      source: {
        code: \`<TextInput value="Normal weight" />
<TextInput value="Bold weight" isBold />
<TextInput value="Weight 700" fontWeight={700} />\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledInput isAutoFocussed placeholder="Focused as soon as it mounts" />,
  parameters: {
    noPadding: true,
    docs: {
      // Framed on Docs: an inline autofocus would pull the page's focus to this field on load.
      story: {
        inline: false,
        height: "58px"
      },
      description: {
        story: "Put the caret in the field the moment it appears, for a dialog or a panel whose first action is typing (\`isAutoFocussed\`); the field is focused when the story loads, so start typing without clicking."
      },
      source: {
        code: \`<TextInput
  type={InputType.text}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  isAutoFocussed
  placeholder="Focused as soon as it mounts"
/>\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
        story: 'The same fields under a right-to-left interface: the placeholder sits at the right edge and the caret of an empty field starts on the right; text typed in a right-to-left script runs right to left, Latin text still runs left to right (\`dir="auto"\`); the tel field keeps its placeholder left-to-right, so a phone number reads the same as in a left-to-right interface. The direction comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar); the wrapper also carries \`dir="rtl"\` for the rules that read the DOM direction.'
      },
      source: {
        code: \`<div dir="rtl">
  <TextInput type={InputType.text} value={value} onChange={handleChange} placeholder="أدخل النص" />
  <TextInput type={InputType.tel} value={phone} onChange={handlePhone} placeholder="+1 (___) ___-____" />
</div>\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "300px",
    "--text-input-bg": "#f5f3ff",
    "--text-input-border-color": "#c4b5fd",
    "--text-input-border-hover": "#7c3aed",
    "--text-input-border-focus": "#4c1d95",
    "--text-input-font-size": "14px",
    "--text-input-radius": "8px",
    "--text-input-color": "#4c1d95",
    "--text-input-disabled-bg": "#ddd6fe"
  } as CSSProperties}>
      <TextInput type={InputType.text} value="Custom styled input" onChange={() => {}} />
      <TextInput type={InputType.text} value="" placeholder="Placeholder text" style={{
      "--text-input-placeholder-color": "#8b5cf6"
    } as CSSProperties} onChange={() => {}} />
      <TextInput type={InputType.text} value="Disabled" isDisabled onChange={() => {}} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The first field sets the shared \\\`--text-input-*\\\` tokens on a wrapper -- the variables are listed under CSS variables on this page; hover and focus it to see the two border variables. The second carries \\\`--text-input-placeholder-color\\\` in its own \\\`style\\\`, the only place it works. The third is disabled: the theme takes over its text and border, and only the radius, the font size and \\\`--text-input-disabled-bg\\\` still apply.\`
      },
      source: {
        code: \`<div
  style={
    {
      "--text-input-bg": "#f5f3ff",
      "--text-input-border-color": "#c4b5fd",
      "--text-input-border-hover": "#7c3aed",
      "--text-input-border-focus": "#4c1d95",
      "--text-input-font-size": "14px",
      "--text-input-radius": "8px",
      "--text-input-color": "#4c1d95",
      "--text-input-disabled-bg": "#ddd6fe",
    } as CSSProperties
  }
>
  <TextInput type={InputType.text} value="Custom styled input" onChange={() => {}} />
  <TextInput
    type={InputType.text}
    value=""
    placeholder="Placeholder text"
    style={{ "--text-input-placeholder-color": "#8b5cf6" } as CSSProperties}
    onChange={() => {}}
  />
  <TextInput type={InputType.text} value="Disabled" isDisabled onChange={() => {}} />
</div>\`
      }
    }
  }
}`,...j.parameters?.docs?.source}}}})))()}N();export{O as AutoFocused,D as BoldText,j as CssCustomization,p as Default,A as RightToLeft,T as ScaledInputs,h as Sizes,y as States,_ as Types,C as WithMask,M as __namedExportsOrder,u as default};