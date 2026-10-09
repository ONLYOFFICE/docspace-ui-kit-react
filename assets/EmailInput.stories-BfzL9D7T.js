import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{i as r,n as i,r as a,t as o}from"./email-input-DyS5eSox.js";import{n as s}from"./text-input-D8OFtXHj.js";import{t as c}from"./TextInput.enums-z6wZ2LJ6.js";var l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{l=t(),r(),s(),i(),u=n(),d={title:`UI/Form controls/EmailInput`,component:o,parameters:{},argTypes:{size:{control:`select`,options:Object.values(c),description:`Height, padding and font size of the field: base and middle are 13px text, large is 16px`,table:{defaultValue:{summary:`base`}}},isDisabled:{control:`boolean`,description:`Greys the field out and makes it unusable: no typing, no focus from the keyboard`,table:{defaultValue:{summary:`false`}}},isReadOnly:{control:`boolean`,description:`Keeps the value visible and focusable but refuses edits`,table:{defaultValue:{summary:`false`}}},hasError:{control:`boolean`,description:`Decides the red error border itself. Left out, the border turns red as soon as a non-empty value fails the check; passed at all, even as false, only this value counts`,table:{defaultValue:{summary:`undefined (automatic)`}}},scale:{control:`boolean`,description:`Stretches the field to the full width of its container`,table:{defaultValue:{summary:`false`}}},placeholder:{control:`text`,description:`Hint shown in the empty field`},value:{control:`text`,description:`Address shown in the field; a new value is validated as soon as it arrives`},emailSettings:{control:!1,description:`Options for the built-in parser: which forms of address to accept, such as a display name, punycode or an IP-address domain`},customValidate:{control:!1,description:"Function that replaces the built-in parser and `emailSettings` outright; it returns `{ value, isValid, errors }` and `isValid` decides the error border"},onValidateInput:{action:`onValidateInput`,description:`Called after every keystroke with the result of the check, whichever parser ran`},onChange:{action:`onChange`,description:`Called with the change event on every keystroke`},onBlur:{action:`onBlur`,description:`Called when the field loses focus`},handleAnimationStart:{action:`handleAnimationStart`,description:`Called on the field's native animationstart, which is how a page notices the browser autofilling it, since autofill fires no change event`},autoComplete:{control:`text`,description:`HTML autocomplete value; the default asks the browser to offer saved email addresses`,table:{defaultValue:{summary:`email`}}},isAutoFocussed:{control:`boolean`,description:`Focuses the field when it first renders; ignored on iOS phones and tablets, where the on-screen keyboard would cover the form`,table:{defaultValue:{summary:`false`}}},hasWarning:{control:`boolean`,description:`Gives the field the warning border instead of the normal one`,table:{defaultValue:{summary:`false`}}},dataTestId:{control:`text`,description:"`data-testid` of the field",table:{defaultValue:{summary:`email-input`}}}}},f=e=>(0,u.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(280px, 1fr))`,gridGap:`16px`,alignItems:`start`},children:e.children}),p=a.parse({allowDomainPunycode:!1,allowLocalPartPunycode:!1,allowDomainIp:!1,allowStrictLocalPart:!0,allowSpaces:!1,allowName:!1,allowLocalDomainName:!1}),m=e=>{let{initialValue:t=``,size:n=c.base,placeholder:r=`Enter email address`,...i}=e,[a,s]=(0,l.useState)(t),[d,f]=(0,l.useState)();return(0,u.jsxs)(`div`,{children:[(0,u.jsx)(o,{placeholder:r,value:a,emailSettings:p,onChange:e=>s(e.target.value),onValidateInput:e=>f(e),size:n,...i}),d?(0,u.jsxs)(`div`,{style:{marginTop:`8px`,fontSize:`12px`},children:[(0,u.jsxs)(`div`,{children:[`Valid: `,d.isValid?`Yes`:`No`]}),(d.errors??[]).length>0?(0,u.jsxs)(`div`,{children:[`Errors: `,d.errors?.join(`, `)]}):null]}):null]})},h={render:e=>{let[t,n]=(0,l.useState)(e.value||``);return(0,u.jsx)(`div`,{style:{width:`320px`},children:(0,u.jsx)(o,{...e,value:t,emailSettings:p,onChange:t=>{n(t.target.value),e.onChange?.(t)}})})},args:{placeholder:`Enter email address`,size:c.base,isDisabled:!1,isReadOnly:!1,scale:!1,value:``},parameters:{docs:{description:{story:"An empty field that checks the address as you type: an incomplete one turns the border red, a complete one clears it (`hasError` left out). Change any other prop live in the Controls panel below."},source:{code:`<EmailInput
  value={value}
  emailSettings={settings}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter email address"
/>`}}}},g=()=>(0,u.jsxs)(f,{children:[(0,u.jsx)(m,{size:c.base,placeholder:`Base size`}),(0,u.jsx)(m,{size:c.middle,placeholder:`Middle size`}),(0,u.jsx)(m,{size:c.large,placeholder:`Large size`})]}),_={render:()=>(0,u.jsx)(g,{}),parameters:{docs:{description:{story:"Pick the height that matches the rest of the form: base and middle share 13px text, large grows to 16px (`size`). Type into any of them to see the result of the check under the field."},source:{code:`<EmailInput size={InputSize.base} placeholder="Base size" />
<EmailInput size={InputSize.middle} placeholder="Middle size" />
<EmailInput size={InputSize.large} placeholder="Large size" />`}}}},v=()=>(0,u.jsxs)(f,{children:[(0,u.jsx)(m,{initialValue:`user@example.com`,placeholder:`Normal`}),(0,u.jsx)(m,{initialValue:`disabled@example.com`,isDisabled:!0}),(0,u.jsx)(m,{initialValue:`readonly@example.com`,isReadOnly:!0}),(0,u.jsx)(m,{initialValue:`invalid-email`,hasError:!0})]}),y={render:()=>(0,u.jsx)(v,{}),parameters:{docs:{description:{story:"The field in each state a form puts it in: **user@example.com** is valid and plain; **disabled@example.com** is greyed out and cannot be focused (`isDisabled`); **readonly@example.com** can be focused and selected but not edited (`isReadOnly`); **invalid-email** has its red border forced on (`hasError`), which the check would also have done on its own."},source:{code:`<EmailInput value="user@example.com" />
<EmailInput value="disabled@example.com" isDisabled />
<EmailInput value="readonly@example.com" isReadOnly />
<EmailInput value="invalid-email" hasError />`}}}},b=()=>(0,u.jsx)(`div`,{style:{width:`320px`},children:(0,u.jsx)(m,{scale:!0,placeholder:`Enter @custom-domain.com email`,customValidate:e=>({value:e,isValid:e.endsWith(`@custom-domain.com`),errors:e?[`DomainNotAllowed`]:[]})})}),x={render:()=>(0,u.jsx)(b,{}),parameters:{docs:{description:{story:"Enforce a rule the parser does not know, such as a single allowed domain: the function replaces the parser outright and its `isValid` decides the red border (`customValidate`). Type an address that does not end with @custom-domain.com to see the field turn red and the returned error key appear under it."},source:{code:`<EmailInput
  scale
  placeholder="Enter @custom-domain.com email"
  customValidate={(value) => ({
    value,
    isValid: value.endsWith("@custom-domain.com"),
    errors: value ? ["DomainNotAllowed"] : [],
  })}
/>`}}}},S=()=>(0,u.jsxs)(f,{children:[(0,u.jsx)(m,{initialValue:`name@example.com`}),(0,u.jsx)(m,{initialValue:`name@example`})]}),C={render:()=>(0,u.jsx)(S,{}),parameters:{docs:{description:{story:"Without `hasError` the field decides for itself: **name@example.com** parses and stays plain, **name@example** has no top-level domain and is red from the start. Edit either one to watch the border follow the check."},source:{code:`<EmailInput value="name@example.com" onChange={handleChange} />
<EmailInput value="name@example" onChange={handleChange} />`}}}},w=a.parse({allowDomainPunycode:!1,allowLocalPartPunycode:!1,allowDomainIp:!1,allowStrictLocalPart:!0,allowSpaces:!1,allowName:!0,allowLocalDomainName:!1}),T=()=>{let[e,t]=(0,l.useState)(`Jane Doe <jane@example.com>`),[n,r]=(0,l.useState)(`Jane Doe <jane@example.com>`);return(0,u.jsxs)(f,{children:[(0,u.jsx)(o,{scale:!0,value:e,emailSettings:p,onChange:e=>t(e.target.value)}),(0,u.jsx)(o,{scale:!0,value:n,emailSettings:w,onChange:e=>r(e.target.value)})]})},E={render:()=>(0,u.jsx)(T,{}),parameters:{docs:{description:{story:"Decide which forms of address count as valid: the same address with a display name is refused by the first field and accepted by the second, which allows names (`emailSettings` with `allowName`). Punycode, IP-address domains, spaces and local domain names are switched the same way."},source:{code:`const settings = EmailSettings.parse({ allowName: true });

<EmailInput
  value="Jane Doe <jane@example.com>"
  emailSettings={settings}
  onChange={handleChange}
/>`}}}},D=()=>(0,u.jsxs)(`div`,{dir:`rtl`,style:{display:`grid`,gap:`16px`,width:`300px`},children:[(0,u.jsx)(m,{placeholder:`name@example.com`}),(0,u.jsx)(m,{initialValue:`name@example.com`})]}),O={render:()=>(0,u.jsx)(D,{}),globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`106px`},description:{story:'Under a right-to-left interface both fields align to the right edge: the placeholder of the empty field and the address in the second one, which still reads left to right because an address is Latin text (`dir="auto"`). The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.'},source:{code:`<div dir="rtl">
  <EmailInput value={value} onChange={handleChange} placeholder="name@example.com" />
  <EmailInput value="name@example.com" onChange={handleChange} />
</div>`}}}},k={render:()=>(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`,width:`300px`,"--text-input-bg":`#f5f3ff`,"--text-input-border-color":`#c4b5fd`,"--text-input-border-hover":`#7c3aed`,"--text-input-border-focus":`#4c1d95`,"--text-input-color":`#4c1d95`,"--text-input-radius":`8px`,"--text-input-font-size":`14px`,"--email-input-align":`center`},children:[(0,u.jsx)(o,{scale:!0,placeholder:`Custom styled email`,value:``,onChange:()=>{}}),(0,u.jsx)(o,{scale:!0,placeholder:`With value`,value:`user@example.com`,hasError:!0,onChange:()=>{}})]}),parameters:{docs:{description:{story:"Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The first field shows them all; hover and focus it to see the two border variables. The second holds an address with its error border forced on (`hasError`), where the theme's error colour replaces the border variables and the rest still apply."},source:{code:`<div
  style={
    {
      "--text-input-bg": "#f5f3ff",
      "--text-input-border-color": "#c4b5fd",
      "--text-input-border-hover": "#7c3aed",
      "--text-input-border-focus": "#4c1d95",
      "--text-input-color": "#4c1d95",
      "--text-input-radius": "8px",
      "--text-input-font-size": "14px",
      "--email-input-align": "center",
    } as CSSProperties
  }
>
  <EmailInput scale placeholder="Custom styled email" value="" onChange={() => {}} />
  <EmailInput scale value="user@example.com" hasError onChange={() => {}} />
</div>`}}}},A=[`Default`,`Sizes`,`States`,`WithCustomValidation`,`AutomaticErrorState`,`AcceptedAddressForms`,`RightToLeft`,`CssCustomization`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = useState(args.value || "");
    return <div style={{
      width: "320px"
    }}>
        <EmailInput {...args} value={value} emailSettings={defaultSettings} onChange={e => {
        setValue(e.target.value);
        args.onChange?.(e);
      }} />
      </div>;
  },
  args: {
    placeholder: "Enter email address",
    size: InputSize.base,
    isDisabled: false,
    isReadOnly: false,
    scale: false,
    value: ""
  },
  parameters: {
    docs: {
      description: {
        story: "An empty field that checks the address as you type: an incomplete one turns the border red, a complete one clears it (\`hasError\` left out). Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<EmailInput
  value={value}
  emailSettings={settings}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter email address"
/>\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Pick the height that matches the rest of the form: base and middle share 13px text, large grows to 16px (\`size\`). Type into any of them to see the result of the check under the field."
      },
      source: {
        code: \`<EmailInput size={InputSize.base} placeholder="Base size" />
<EmailInput size={InputSize.middle} placeholder="Middle size" />
<EmailInput size={InputSize.large} placeholder="Large size" />\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The field in each state a form puts it in: **user@example.com** is valid and plain; **disabled@example.com** is greyed out and cannot be focused (\`isDisabled\`); **readonly@example.com** can be focused and selected but not edited (\`isReadOnly\`); **invalid-email** has its red border forced on (\`hasError\`), which the check would also have done on its own."
      },
      source: {
        code: \`<EmailInput value="user@example.com" />
<EmailInput value="disabled@example.com" isDisabled />
<EmailInput value="readonly@example.com" isReadOnly />
<EmailInput value="invalid-email" hasError />\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <CustomValidationTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Enforce a rule the parser does not know, such as a single allowed domain: the function replaces the parser outright and its \`isValid\` decides the red border (\`customValidate\`). Type an address that does not end with @custom-domain.com to see the field turn red and the returned error key appear under it."
      },
      source: {
        code: \`<EmailInput
  scale
  placeholder="Enter @custom-domain.com email"
  customValidate={(value) => ({
    value,
    isValid: value.endsWith("@custom-domain.com"),
    errors: value ? ["DomainNotAllowed"] : [],
  })}
/>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <AutomaticErrorTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Without \`hasError\` the field decides for itself: **name@example.com** parses and stays plain, **name@example** has no top-level domain and is red from the start. Edit either one to watch the border follow the check."
      },
      source: {
        code: \`<EmailInput value="name@example.com" onChange={handleChange} />
<EmailInput value="name@example" onChange={handleChange} />\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <AcceptedAddressFormsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Decide which forms of address count as valid: the same address with a display name is refused by the first field and accepted by the second, which allows names (\`emailSettings\` with \`allowName\`). Punycode, IP-address domains, spaces and local domain names are switched the same way."
      },
      source: {
        code: \`const settings = EmailSettings.parse({ allowName: true });

<EmailInput
  value="Jane Doe <jane@example.com>"
  emailSettings={settings}
  onChange={handleChange}
/>\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
        story: 'Under a right-to-left interface both fields align to the right edge: the placeholder of the empty field and the address in the second one, which still reads left to right because an address is Latin text (\`dir="auto"\`). The direction comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar); the wrapper also carries \`dir="rtl"\` for the rules that read the DOM direction.'
      },
      source: {
        code: \`<div dir="rtl">
  <EmailInput value={value} onChange={handleChange} placeholder="name@example.com" />
  <EmailInput value="name@example.com" onChange={handleChange} />
</div>\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "300px",
    "--text-input-bg": "#f5f3ff",
    "--text-input-border-color": "#c4b5fd",
    "--text-input-border-hover": "#7c3aed",
    "--text-input-border-focus": "#4c1d95",
    "--text-input-color": "#4c1d95",
    "--text-input-radius": "8px",
    "--text-input-font-size": "14px",
    "--email-input-align": "center"
  } as CSSProperties}>
      <EmailInput scale placeholder="Custom styled email" value="" onChange={() => {}} />
      <EmailInput scale placeholder="With value" value="user@example.com" hasError onChange={() => {}} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The first field shows them all; hover and focus it to see the two border variables. The second holds an address with its error border forced on (\\\`hasError\\\`), where the theme's error colour replaces the border variables and the rest still apply.\`
      },
      source: {
        code: \`<div
  style={
    {
      "--text-input-bg": "#f5f3ff",
      "--text-input-border-color": "#c4b5fd",
      "--text-input-border-hover": "#7c3aed",
      "--text-input-border-focus": "#4c1d95",
      "--text-input-color": "#4c1d95",
      "--text-input-radius": "8px",
      "--text-input-font-size": "14px",
      "--email-input-align": "center",
    } as CSSProperties
  }
>
  <EmailInput scale placeholder="Custom styled email" value="" onChange={() => {}} />
  <EmailInput scale value="user@example.com" hasError onChange={() => {}} />
</div>\`
      }
    }
  }
}`,...k.parameters?.docs?.source}}}})))()}j();export{E as AcceptedAddressForms,C as AutomaticErrorState,k as CssCustomization,h as Default,O as RightToLeft,_ as Sizes,y as States,x as WithCustomValidation,A as __namedExportsOrder,d as default};