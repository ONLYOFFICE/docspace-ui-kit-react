import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{r as i,t as a}from"./text-Cz_cI6Yf.js";import{n as o,r as s,t as c}from"./button-DjDXE7uo.js";import{n as l,t as u}from"./danger.toast.react-CvA0daXC.js";import{n as d,t as f}from"./common-icons-style-Dik-NKVV.js";var p,m,h,g,_,v;function y(){return(y=e((()=>{p=`_body_1m27k_1`,m=`_SlideIn_1m27k_1`,h=`_hide_1m27k_64`,g=`_warning_1m27k_71`,_=`_dangerToastIcon_1m27k_87`,v={body:p,SlideIn:m,hide:h,warning:g,dangerToastIcon:_}})))()}var b,x,S;function C(){return(C=e((()=>{b=t(n()),l(),d(),y(),i(),x=r(),S=({message:e,isWarning:t})=>{let[n,r]=b.useState(!0),[i,o]=b.useState(!!e),s=b.useRef(null),c=b.useRef(e),l=b.useRef(t),d=b.useRef(!1);return b.useEffect(()=>{if(c.current){if(!e||c.current!==e){r(!1),d.current=!0;return}d.current||(r(!0),c.current=e,l.current=t);return}c.current=e,l.current=t,e&&(o(!0),r(!0))},[e,t]),b.useEffect(()=>{let n=s.current;if(!n)return;let i=()=>{let n=()=>{d.current=!1,c.current=e,l.current=t};if(!e){o(!1),n();return}if(d.current&&c.current){o(!0),r(!0),n();return}c.current||o(!1)};return n.addEventListener(`animationend`,i),n.addEventListener(`transitionend`,i),()=>{n.removeEventListener(`animationend`,i),n.removeEventListener(`transitionend`,i)}},[e]),i?(0,x.jsxs)(`div`,{ref:s,className:`${v.body} ${n?``:v.hide} ${l.current?v.warning:``}`,children:[(0,x.jsx)(u,{className:v.dangerToastIcon,"data-size":f.medium}),(0,x.jsx)(a,{children:c.current})]}):null};try{S.displayName=`StatusMessage`,S.__docgenInfo={description:``,displayName:`StatusMessage`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/status-message/index.tsx`,methods:[],props:{message:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/status-message/StatusMessage.types.ts`,name:`TypeLiteral`}],description:`The text or nodes in the bar, and the switch that shows and hides it: an empty message fades the bar out and unmounts it. A new one is only painted once the fade of the previous one ends.`,name:`message`,required:!0,tags:{},type:{name:`ReactNode`}},isWarning:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/status-message/StatusMessage.types.ts`,name:`TypeLiteral`}],description:"Paints the bar in the warning colours instead of the error ones. It is read off the same ref as the message, so changing it alone does not repaint — change it together with `message`.",name:`isWarning`,required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}})))()}var w,T,E,D,O,k,A,j,M,N,P,F;function I(){return(I=e((()=>{w=n(),o(),C(),T=r(),E={title:`UI/Feedback/StatusMessage`,component:S,parameters:{},argTypes:{message:{control:`text`,description:`The text or nodes shown in the bar. An empty value fades the bar out and removes it; a new value appears once the previous one has faded out`},isWarning:{control:`boolean`,description:"Paints the bar in the warning colours instead of the error ones. Takes effect together with the next change of `message`",table:{defaultValue:{summary:`false`}}}}},D={render:e=>(0,T.jsx)(S,{...e}),args:{message:`This is a status message`},parameters:{docs:{description:{story:"The error bar as a form shows it after a failed action. Type a new text in the Controls panel below to watch the old one fade out first; the warning switch there takes effect with the next text change (`isWarning`)."},source:{code:`<StatusMessage message="This is a status message" />`}}}},O=()=>(0,T.jsx)(S,{message:`This is a warning message`,isWarning:!0}),k=()=>{let[e,t]=(0,w.useState)(`Click the button to dismiss`);return(0,T.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16},children:[(0,T.jsx)(S,{message:e}),(0,T.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,T.jsx)(c,{label:`Show Message`,size:s.small,onClick:()=>t(`Status message is visible`)}),(0,T.jsx)(c,{label:`Hide Message`,size:s.small,onClick:()=>t(``)})]})]})},A=()=>{let[e,t]=(0,w.useState)(`First message`);return(0,T.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16},children:[(0,T.jsx)(S,{message:e}),(0,T.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,T.jsx)(c,{label:`Message A`,size:s.small,onClick:()=>t(`First message`)}),(0,T.jsx)(c,{label:`Message B`,size:s.small,onClick:()=>t(`Second message`)}),(0,T.jsx)(c,{label:`Clear`,size:s.small,onClick:()=>t(``)})]})]})},j={render:()=>(0,T.jsx)(O,{}),parameters:{docs:{description:{story:"For a problem that does not block the user: the same bar in the warning colours (`isWarning`)."},source:{code:`<StatusMessage message="This is a warning message" isWarning />`}}}},M={render:()=>(0,T.jsx)(k,{}),parameters:{docs:{description:{story:"Use this to see how the bar leaves and returns: **Hide Message** fades it out and removes it, **Show Message** brings it back (`message` set to an empty string and back)."},source:{code:`const [message, setMessage] = useState("Click the button to dismiss");

<StatusMessage message={message} />
<Button label="Show" onClick={() => setMessage("Visible")} />
<Button label="Hide" onClick={() => setMessage("")} />`}}}},N={render:()=>(0,T.jsx)(A,{}),parameters:{docs:{description:{story:`Use this to see what a user sees when one message replaces another: **Message A** and **Message B** fade the current text out before the new one fades in, **Clear** hides the bar.`},source:{code:`const [message, setMessage] = useState("First message");

<StatusMessage message={message} />
<Button label="Message A" onClick={() => setMessage("First message")} />
<Button label="Message B" onClick={() => setMessage("Second message")} />
<Button label="Clear" onClick={() => setMessage("")} />`}}}},P={render:()=>(0,T.jsxs)(`div`,{style:{width:`400px`,"--status-message-bg":`#1e1b4b`,"--status-message-border":`2px solid #7c3aed`,"--status-message-text":`#e0e7ff`,"--status-message-icon":`#a78bfa`,"--status-message-radius":`12px`,"--status-message-padding":`12px 16px`,"--status-message-gap":`16px`,"--status-message-shadow":`0 4px 20px rgba(124,58,237,0.3)`,"--status-message-margin-bottom":`24px`,"--status-message-max-width":`360px`,"--status-message-warning-bg":`#422006`,"--status-message-warning-border-style":`2px solid #f59e0b`,"--status-message-warning-icon":`#fbbf24`},children:[(0,T.jsx)(S,{message:`Custom styled status message with CSS variables.`}),(0,T.jsx)(S,{message:`Custom styled warning message.`,isWarning:!0})]}),parameters:{docs:{description:{story:"Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The first bar shows the shared variables; the second, with `isWarning`, is there for the three warning variables, and the gap between the two is the bottom margin. The max width caps both bars below the 400px wrapper."},source:{code:`<div
  style={{
    "--status-message-bg": "#1e1b4b",
    "--status-message-border": "2px solid #7c3aed",
    "--status-message-text": "#e0e7ff",
    "--status-message-icon": "#a78bfa",
    "--status-message-radius": "12px",
    "--status-message-padding": "12px 16px",
    "--status-message-gap": "16px",
    "--status-message-shadow": "0 4px 20px rgba(124,58,237,0.3)",
    "--status-message-margin-bottom": "24px",
    "--status-message-max-width": "360px",
    "--status-message-warning-bg": "#422006",
    "--status-message-warning-border-style": "2px solid #f59e0b",
    "--status-message-warning-icon": "#fbbf24",
  }}
>
  <StatusMessage message="Custom styled status message with CSS variables." />
  <StatusMessage message="Custom styled warning message." isWarning />
</div>`}}}},F=[`Default`,`WarningMessage`,`ToggleVisibility`,`MessageSwap`,`CssCustomization`],D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: args => <StatusMessage {...args} />,
  args: {
    message: "This is a status message"
  },
  parameters: {
    docs: {
      description: {
        story: "The error bar as a form shows it after a failed action. Type a new text in the Controls panel below to watch the old one fade out first; the warning switch there takes effect with the next text change (\`isWarning\`)."
      },
      source: {
        code: \`<StatusMessage message="This is a status message" />\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <WarningTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a problem that does not block the user: the same bar in the warning colours (\`isWarning\`)."
      },
      source: {
        code: \`<StatusMessage message="This is a warning message" isWarning />\`
      }
    }
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => <ToggleTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Use this to see how the bar leaves and returns: **Hide Message** fades it out and removes it, **Show Message** brings it back (\`message\` set to an empty string and back)."
      },
      source: {
        code: \`const [message, setMessage] = useState("Click the button to dismiss");

<StatusMessage message={message} />
<Button label="Show" onClick={() => setMessage("Visible")} />
<Button label="Hide" onClick={() => setMessage("")} />\`
      }
    }
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => <MessageSwapTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Use this to see what a user sees when one message replaces another: **Message A** and **Message B** fade the current text out before the new one fades in, **Clear** hides the bar."
      },
      source: {
        code: \`const [message, setMessage] = useState("First message");

<StatusMessage message={message} />
<Button label="Message A" onClick={() => setMessage("First message")} />
<Button label="Message B" onClick={() => setMessage("Second message")} />
<Button label="Clear" onClick={() => setMessage("")} />\`
      }
    }
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: "400px",
    "--status-message-bg": "#1e1b4b",
    "--status-message-border": "2px solid #7c3aed",
    "--status-message-text": "#e0e7ff",
    "--status-message-icon": "#a78bfa",
    "--status-message-radius": "12px",
    "--status-message-padding": "12px 16px",
    "--status-message-gap": "16px",
    "--status-message-shadow": "0 4px 20px rgba(124,58,237,0.3)",
    "--status-message-margin-bottom": "24px",
    "--status-message-max-width": "360px",
    "--status-message-warning-bg": "#422006",
    "--status-message-warning-border-style": "2px solid #f59e0b",
    "--status-message-warning-icon": "#fbbf24"
  } as CSSProperties}>
      <StatusMessage message="Custom styled status message with CSS variables." />
      <StatusMessage message="Custom styled warning message." isWarning />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The first bar shows the shared variables; the second, with \\\`isWarning\\\`, is there for the three warning variables, and the gap between the two is the bottom margin. The max width caps both bars below the 400px wrapper.\`
      },
      source: {
        code: \`<div
  style={{
    "--status-message-bg": "#1e1b4b",
    "--status-message-border": "2px solid #7c3aed",
    "--status-message-text": "#e0e7ff",
    "--status-message-icon": "#a78bfa",
    "--status-message-radius": "12px",
    "--status-message-padding": "12px 16px",
    "--status-message-gap": "16px",
    "--status-message-shadow": "0 4px 20px rgba(124,58,237,0.3)",
    "--status-message-margin-bottom": "24px",
    "--status-message-max-width": "360px",
    "--status-message-warning-bg": "#422006",
    "--status-message-warning-border-style": "2px solid #f59e0b",
    "--status-message-warning-icon": "#fbbf24",
  }}
>
  <StatusMessage message="Custom styled status message with CSS variables." />
  <StatusMessage message="Custom styled warning message." isWarning />
</div>\`
      }
    }
  }
}`,...P.parameters?.docs?.source}}}})))()}I();export{P as CssCustomization,D as Default,N as MessageSwap,M as ToggleVisibility,j as WarningMessage,F as __namedExportsOrder,E as default};