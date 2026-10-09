import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{t as i}from"./classnames-CfLRLWYq.js";import{n as a,r as o,t as s}from"./button-DjDXE7uo.js";import{n as c,t as l}from"./text-input-D8OFtXHj.js";import{n as u,t as d}from"./TextInput.enums-z6wZ2LJ6.js";import{n as f,t as p}from"./FieldContainer-DmxZfTxt.js";var m,h;function g(){return(g=e((()=>{m=`_wrapper_3gml2_1`,h={wrapper:m}})))()}var _,v,y;function b(){return(b=e((()=>{n(),_=t(i()),g(),v=r(),y=e=>{let{children:t,className:n,...r}=e;return(0,v.jsx)(`div`,{className:(0,_.default)(h.wrapper,n),"data-testid":`form-wrapper`,...r,children:t})};try{y.displayName=`FormWrapper`,y.__docgenInfo={description:``,displayName:`FormWrapper`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/form-wrapper/index.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/form-wrapper/FormWrapper.types.ts`,name:`TypeLiteral`}],description:`The form. Every child is centred horizontally by the wrapper's own flex column.`,name:`children`,required:!0,tags:{},type:{name:`ReactNode`}},id:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/form-wrapper/FormWrapper.types.ts`,name:`TypeLiteral`}],description:`Applied to the card.`,name:`id`,required:!1,tags:{},type:{name:`string | undefined`}},className:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/form-wrapper/FormWrapper.types.ts`,name:`TypeLiteral`}],description:`Applied to the card.`,name:`className`,required:!1,tags:{},type:{name:`string | undefined`}},style:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/form-wrapper/FormWrapper.types.ts`,name:`TypeLiteral`}],description:`Applied to the card.`,name:`style`,required:!1,tags:{},type:{name:`CSSProperties | undefined`}}},tags:{}}}catch{}})))()}var x,S;function C(){return(C=e((()=>{x=`_demoContent_1lrah_1`,S={demoContent:x}})))()}var w,T,E,D,O,k,A,j,M,N,P;function F(){return(F=e((()=>{w=n(),a(),f(),c(),b(),C(),T=r(),E={title:`UI/Form controls/FormWrapper`,component:y,parameters:{},argTypes:{children:{control:!1,description:`The form content; every child is centred horizontally in the card`},className:{control:`text`,description:`Additional class names applied to the card`},id:{control:`text`,description:`HTML id applied to the card`},style:{control:`object`,description:`Inline styles applied to the card`}}},D={render:e=>(0,T.jsx)(y,{...e}),args:{children:(0,T.jsxs)(`div`,{className:S.demoContent,children:[(0,T.jsx)(`h3`,{children:`Welcome`}),(0,T.jsx)(`p`,{children:`This is a basic form wrapper example`})]})},parameters:{docs:{description:{story:`The card on its own around a heading and a line of text, to judge its width, padding, corners and shadow before a form goes in. Change the class, id or inline styles live in the Controls panel below.`},source:{code:`<FormWrapper>
  <h3>Welcome</h3>
  <p>This is a basic form wrapper example</p>
</FormWrapper>`}}}},O={width:`100%`},k=e=>{let[t,n]=(0,w.useState)(``),[r,i]=(0,w.useState)(``);return(0,T.jsxs)(y,{...e,children:[(0,T.jsx)(p,{isVertical:!0,labelVisible:!0,labelText:`Email`,style:O,children:(0,T.jsx)(l,{type:u.email,size:d.base,value:t,onChange:e=>n(e.target.value),scale:!0})}),(0,T.jsx)(p,{isVertical:!0,labelVisible:!0,labelText:`Password`,style:O,children:(0,T.jsx)(l,{type:u.password,size:d.base,value:r,onChange:e=>i(e.target.value),scale:!0})}),(0,T.jsx)(s,{primary:!0,scale:!0,size:o.normal,label:`Sign in`})]})},A={render:e=>(0,T.jsx)(k,{...e}),args:{children:null},parameters:{docs:{description:{story:"A sign-in form as the card is meant to hold it: an email field, a password field and a primary button. Each field row is given a width of 100% and each control `scale`, so they span the card instead of shrinking to their content."},source:{code:`<FormWrapper>
  <FieldContainer isVertical labelVisible labelText="Email" style={{ width: "100%" }}>
    <TextInput type={InputType.email} size={InputSize.base} value={email} onChange={onEmailChange} scale />
  </FieldContainer>
  <FieldContainer isVertical labelVisible labelText="Password" style={{ width: "100%" }}>
    <TextInput type={InputType.password} size={InputSize.base} value={password} onChange={onPasswordChange} scale />
  </FieldContainer>
  <Button primary scale size={ButtonSize.normal} label="Sign in" />
</FormWrapper>`}}}},j=e=>{let[t,n]=(0,w.useState)({name:``,email:``,password:``,confirm:``}),r=[{key:`name`,label:`Full name`,type:u.text},{key:`email`,label:`Email`,type:u.email},{key:`password`,label:`Password`,type:u.password},{key:`confirm`,label:`Confirm password`,type:u.password}];return(0,T.jsxs)(y,{...e,children:[r.map(e=>(0,T.jsx)(p,{isVertical:!0,labelVisible:!0,labelText:e.label,style:O,children:(0,T.jsx)(l,{type:e.type,size:d.base,value:t[e.key],onChange:t=>n(n=>({...n,[e.key]:t.target.value})),scale:!0})},e.key)),(0,T.jsx)(s,{primary:!0,scale:!0,size:o.normal,label:`Create account`})]})},M={render:e=>(0,T.jsx)(j,{...e}),args:{children:null},parameters:{docs:{description:{story:`A longer form with four fields, to show that the card keeps its fixed width and only grows taller as fields are added.`},source:{code:`<FormWrapper>
  <FieldContainer isVertical labelVisible labelText="Full name" style={{ width: "100%" }}>
    <TextInput type={InputType.text} size={InputSize.base} value={name} onChange={onNameChange} scale />
  </FieldContainer>
  <FieldContainer isVertical labelVisible labelText="Email" style={{ width: "100%" }}>
    <TextInput type={InputType.email} size={InputSize.base} value={email} onChange={onEmailChange} scale />
  </FieldContainer>
  <FieldContainer isVertical labelVisible labelText="Password" style={{ width: "100%" }}>
    <TextInput type={InputType.password} size={InputSize.base} value={password} onChange={onPasswordChange} scale />
  </FieldContainer>
  <FieldContainer isVertical labelVisible labelText="Confirm password" style={{ width: "100%" }}>
    <TextInput type={InputType.password} size={InputSize.base} value={confirm} onChange={onConfirmChange} scale />
  </FieldContainer>
  <Button primary scale size={ButtonSize.normal} label="Create account" />
</FormWrapper>`}}}},N={render:()=>(0,T.jsx)(`div`,{style:{"--form-wrapper-bg":`#1e1b4b`,"--form-wrapper-shadow":`0 8px 32px rgba(124,58,237,0.4)`,"--form-wrapper-radius":`24px`,"--form-wrapper-padding":`40px`,"--form-wrapper-max-width":`400px`,"--form-wrapper-min-width":`400px`},children:(0,T.jsx)(y,{children:(0,T.jsxs)(`div`,{className:S.demoContent,children:[(0,T.jsx)(`h3`,{style:{color:`#e0e7ff`,margin:0},children:`Custom Styled Form`}),(0,T.jsx)(`p`,{style:{color:`#a78bfa`,margin:`8px 0 0`},children:`Customized with CSS variables`})]})})}),parameters:{docs:{description:{story:`Every overridable variable set on a wrapper around one card -- the variables are listed under CSS variables on this page. Set the minimum and the maximum width together: either one alone is clamped by the other.`},source:{code:`<div
  style={{
    "--form-wrapper-bg": "#1e1b4b",
    "--form-wrapper-shadow": "0 8px 32px rgba(124,58,237,0.4)",
    "--form-wrapper-radius": "24px",
    "--form-wrapper-padding": "40px",
    "--form-wrapper-max-width": "400px",
    "--form-wrapper-min-width": "400px",
  }}
>
  <FormWrapper>
    <h3>Custom Styled Form</h3>
    <p>Customized with CSS variables</p>
  </FormWrapper>
</div>`}}}},P=[`Default`,`WithLoginForm`,`WithRegistrationForm`,`CssCustomization`],D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: args => <FormWrapper {...args} />,
  args: {
    children: <div className={styles.demoContent}>
        <h3>Welcome</h3>
        <p>This is a basic form wrapper example</p>
      </div>
  },
  parameters: {
    docs: {
      description: {
        story: "The card on its own around a heading and a line of text, to judge its width, padding, corners and shadow before a form goes in. Change the class, id or inline styles live in the Controls panel below."
      },
      source: {
        code: \`<FormWrapper>
  <h3>Welcome</h3>
  <p>This is a basic form wrapper example</p>
</FormWrapper>\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: args => <SignInFormTemplate {...args} />,
  args: {
    children: null
  },
  parameters: {
    docs: {
      description: {
        story: "A sign-in form as the card is meant to hold it: an email field, a password field and a primary button. Each field row is given a width of 100% and each control \`scale\`, so they span the card instead of shrinking to their content."
      },
      source: {
        code: \`<FormWrapper>
  <FieldContainer isVertical labelVisible labelText="Email" style={{ width: "100%" }}>
    <TextInput type={InputType.email} size={InputSize.base} value={email} onChange={onEmailChange} scale />
  </FieldContainer>
  <FieldContainer isVertical labelVisible labelText="Password" style={{ width: "100%" }}>
    <TextInput type={InputType.password} size={InputSize.base} value={password} onChange={onPasswordChange} scale />
  </FieldContainer>
  <Button primary scale size={ButtonSize.normal} label="Sign in" />
</FormWrapper>\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: args => <RegistrationFormTemplate {...args} />,
  args: {
    children: null
  },
  parameters: {
    docs: {
      description: {
        story: "A longer form with four fields, to show that the card keeps its fixed width and only grows taller as fields are added."
      },
      source: {
        code: \`<FormWrapper>
  <FieldContainer isVertical labelVisible labelText="Full name" style={{ width: "100%" }}>
    <TextInput type={InputType.text} size={InputSize.base} value={name} onChange={onNameChange} scale />
  </FieldContainer>
  <FieldContainer isVertical labelVisible labelText="Email" style={{ width: "100%" }}>
    <TextInput type={InputType.email} size={InputSize.base} value={email} onChange={onEmailChange} scale />
  </FieldContainer>
  <FieldContainer isVertical labelVisible labelText="Password" style={{ width: "100%" }}>
    <TextInput type={InputType.password} size={InputSize.base} value={password} onChange={onPasswordChange} scale />
  </FieldContainer>
  <FieldContainer isVertical labelVisible labelText="Confirm password" style={{ width: "100%" }}>
    <TextInput type={InputType.password} size={InputSize.base} value={confirm} onChange={onConfirmChange} scale />
  </FieldContainer>
  <Button primary scale size={ButtonSize.normal} label="Create account" />
</FormWrapper>\`
      }
    }
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--form-wrapper-bg": "#1e1b4b",
    "--form-wrapper-shadow": "0 8px 32px rgba(124,58,237,0.4)",
    "--form-wrapper-radius": "24px",
    "--form-wrapper-padding": "40px",
    "--form-wrapper-max-width": "400px",
    "--form-wrapper-min-width": "400px"
  } as CSSProperties}>
      <FormWrapper>
        <div className={styles.demoContent}>
          <h3 style={{
          color: "#e0e7ff",
          margin: 0
        }}>Custom Styled Form</h3>
          <p style={{
          color: "#a78bfa",
          margin: "8px 0 0"
        }}>
            Customized with CSS variables
          </p>
        </div>
      </FormWrapper>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on a wrapper around one card -- the variables are listed under CSS variables on this page. Set the minimum and the maximum width together: either one alone is clamped by the other.\`
      },
      source: {
        code: \`<div
  style={{
    "--form-wrapper-bg": "#1e1b4b",
    "--form-wrapper-shadow": "0 8px 32px rgba(124,58,237,0.4)",
    "--form-wrapper-radius": "24px",
    "--form-wrapper-padding": "40px",
    "--form-wrapper-max-width": "400px",
    "--form-wrapper-min-width": "400px",
  }}
>
  <FormWrapper>
    <h3>Custom Styled Form</h3>
    <p>Customized with CSS variables</p>
  </FormWrapper>
</div>\`
      }
    }
  }
}`,...N.parameters?.docs?.source}}}})))()}F();export{N as CssCustomization,D as Default,A as WithLoginForm,M as WithRegistrationForm,P as __namedExportsOrder,E as default};