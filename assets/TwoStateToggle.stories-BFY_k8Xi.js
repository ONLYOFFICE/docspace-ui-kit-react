import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{t as i}from"./classnames-CfLRLWYq.js";import{r as a,t as o}from"./text-Cz_cI6Yf.js";import{n as s,r as c,t as l}from"./button-DjDXE7uo.js";import{n as u,t as d}from"./modal-dialog-FtQERitO.js";var f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{f=`_wrapper_fwebe_1`,p=`_title_fwebe_7`,m=`_pill_fwebe_14`,h=`_thumb_fwebe_31`,g=`_thumbNew_fwebe_42`,_=`_labels_fwebe_49`,v=`_label_fwebe_49`,y=`_onThumb_fwebe_67`,b=`_confirmBody_fwebe_71`,x=`_confirmHint_fwebe_76`,S={wrapper:f,title:p,pill:m,thumb:h,thumbNew:g,labels:_,label:v,onThumb:y,confirmBody:b,confirmHint:x}})))()}var w,T,E,D,O,k,A;function j(){return(j=e((()=>{w=t(n()),T=t(i()),s(),u(),a(),C(),E=r(),D=`useDocSpace`,O=()=>{try{return localStorage.getItem(D)!==`old`}catch{return!0}},k=e=>{try{localStorage.setItem(D,e)}catch{}},A=({title:e=`ONLYOFFICE Apps design`,labelOld:t=`OLD`,labelNew:n=`NEW`,confirmTitle:r=`Switch to Old Design`,confirmBody:i=`You are about to leave the new Dashboard and return to the classic ONLYOFFICE Apps view.`,confirmHint:a=`You can return to the new Dashboard at any time by navigating to /dashboard.`,confirmOk:s=`Switch`,confirmCancel:u=`Cancel`,ariaLabel:f=`Switch ONLYOFFICE Apps design`,onNavigate:p,className:m})=>{let[h,g]=w.useState(O),[_,v]=w.useState(!1),y=e=>{p?p(e):window.location.href=e},b=()=>{h?v(!0):(k(`new`),g(!0),y(`/dashboard`))},x=()=>{v(!1),k(`old`),g(!1),y(`/`)},C=()=>{v(!1)};return(0,E.jsxs)(E.Fragment,{children:[(0,E.jsxs)(`div`,{className:(0,T.default)(S.wrapper,m),children:[e?(0,E.jsx)(`span`,{className:S.title,children:e}):null,(0,E.jsxs)(`button`,{type:`button`,role:`switch`,"aria-checked":h,"aria-label":f,onClick:b,className:S.pill,children:[(0,E.jsx)(`span`,{"aria-hidden":`true`,className:(0,T.default)(S.thumb,{[S.thumbNew]:h})}),(0,E.jsxs)(`span`,{"aria-hidden":`true`,className:S.labels,children:[(0,E.jsx)(`span`,{className:(0,T.default)(S.label,{[S.onThumb]:!h}),children:t}),(0,E.jsx)(`span`,{className:(0,T.default)(S.label,{[S.onThumb]:h}),children:n})]})]})]}),(0,E.jsxs)(d,{visible:_,onClose:C,children:[(0,E.jsx)(d.Header,{children:r}),(0,E.jsxs)(d.Body,{children:[(0,E.jsx)(o,{className:S.confirmBody,children:i}),a?(0,E.jsx)(o,{className:S.confirmHint,children:a}):null]}),(0,E.jsxs)(d.Footer,{children:[(0,E.jsx)(l,{label:s,size:c.normal,primary:!0,onClick:x}),(0,E.jsx)(l,{label:u,size:c.normal,onClick:C})]})]})]})};try{A.displayName=`TwoStateToggle`,A.__docgenInfo={description:``,displayName:`TwoStateToggle`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/two-state-toggle/TwoStateToggle.tsx`,methods:[],props:{title:{defaultValue:{value:`ONLYOFFICE Apps design`},declarations:[{fileName:`docspace-ui-kit-react/components/two-state-toggle/TwoStateToggle.types.ts`,name:`TypeLiteral`}],description:`Text to the left of the pill. An empty string removes it.`,name:`title`,required:!1,tags:{default:`"ONLYOFFICE Apps design"`},type:{name:`string | undefined`}},labelOld:{defaultValue:{value:`OLD`},declarations:[{fileName:`docspace-ui-kit-react/components/two-state-toggle/TwoStateToggle.types.ts`,name:`TypeLiteral`}],description:`Label on the left half of the pill, the classic view.`,name:`labelOld`,required:!1,tags:{default:`"OLD"`},type:{name:`string | undefined`}},labelNew:{defaultValue:{value:`NEW`},declarations:[{fileName:`docspace-ui-kit-react/components/two-state-toggle/TwoStateToggle.types.ts`,name:`TypeLiteral`}],description:`Label on the right half, the new dashboard.`,name:`labelNew`,required:!1,tags:{default:`"NEW"`},type:{name:`string | undefined`}},confirmTitle:{defaultValue:{value:`Switch to Old Design`},declarations:[{fileName:`docspace-ui-kit-react/components/two-state-toggle/TwoStateToggle.types.ts`,name:`TypeLiteral`}],description:`Heading of the dialog shown when leaving the new view.`,name:`confirmTitle`,required:!1,tags:{default:`"Switch to Old Design"`},type:{name:`string | undefined`}},confirmBody:{defaultValue:{value:`You are about to leave the new Dashboard and return to the classic ONLYOFFICE Apps view.`},declarations:[{fileName:`docspace-ui-kit-react/components/two-state-toggle/TwoStateToggle.types.ts`,name:`TypeLiteral`}],description:`First paragraph of that dialog.`,name:`confirmBody`,required:!1,tags:{default:`"You are about to leave the new Dashboard and return to the classic ONLYOFFICE Apps view."`},type:{name:`string | undefined`}},confirmHint:{defaultValue:{value:`You can return to the new Dashboard at any time by navigating to /dashboard.`},declarations:[{fileName:`docspace-ui-kit-react/components/two-state-toggle/TwoStateToggle.types.ts`,name:`TypeLiteral`}],description:`Second paragraph of that dialog. An empty string removes it.`,name:`confirmHint`,required:!1,tags:{default:`"You can return to the new Dashboard at any time by navigating to /dashboard."`},type:{name:`string | undefined`}},confirmOk:{defaultValue:{value:`Switch`},declarations:[{fileName:`docspace-ui-kit-react/components/two-state-toggle/TwoStateToggle.types.ts`,name:`TypeLiteral`}],description:`Label of that dialog's primary button.`,name:`confirmOk`,required:!1,tags:{default:`"Switch"`},type:{name:`string | undefined`}},confirmCancel:{defaultValue:{value:`Cancel`},declarations:[{fileName:`docspace-ui-kit-react/components/two-state-toggle/TwoStateToggle.types.ts`,name:`TypeLiteral`}],description:`Label of its cancel button.`,name:`confirmCancel`,required:!1,tags:{default:`"Cancel"`},type:{name:`string | undefined`}},ariaLabel:{defaultValue:{value:`Switch ONLYOFFICE Apps design`},declarations:[{fileName:`docspace-ui-kit-react/components/two-state-toggle/TwoStateToggle.types.ts`,name:`TypeLiteral`}],description:`Accessible name of the switch button. The English default is not
translated for you.`,name:`ariaLabel`,required:!1,tags:{default:`"Switch ONLYOFFICE Apps design"`},type:{name:`string | undefined`}},onNavigate:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/two-state-toggle/TwoStateToggle.types.ts`,name:`TypeLiteral`}],description:"Called with the URL to go to — `/dashboard` or `/`, both hard-coded. Pass\nyour router's navigate here; without it the component assigns\n`window.location.href` and the page reloads.",name:`onNavigate`,required:!1,tags:{},type:{name:`((url: string) => void) | undefined`}},className:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/two-state-toggle/TwoStateToggle.types.ts`,name:`TypeLiteral`}],description:`Applied to the wrapper around the title and the pill.`,name:`className`,required:!1,tags:{},type:{name:`string | undefined`}}},tags:{}}}catch{}})))()}var M,N,P,F,I,L,R,z,B;function V(){return(V=e((()=>{j(),M=r(),N={title:`UI/Navigation/TwoStateToggle`,component:A,parameters:{},argTypes:{title:{control:`text`,description:`Text label shown at the inline start of the toggle; an empty string hides it`,table:{defaultValue:{summary:`ONLYOFFICE Apps design`}}},labelOld:{control:`text`,description:`Label on the inline-start half of the pill, the position of the classic view`,table:{defaultValue:{summary:`OLD`}}},labelNew:{control:`text`,description:`Label on the inline-end half of the pill, the position of the new dashboard`,table:{defaultValue:{summary:`NEW`}}},confirmTitle:{control:`text`,description:`Heading of the confirmation dialog shown when switching from NEW to OLD`,table:{defaultValue:{summary:`Switch to Old Design`}}},confirmBody:{control:`text`,description:`First paragraph of the confirmation dialog`,table:{defaultValue:{summary:`You are about to leave the new Dashboard and return to the classic ONLYOFFICE Apps view.`}}},confirmHint:{control:`text`,description:`Second, smaller paragraph under the first one in the confirmation dialog; an empty string hides it`,table:{defaultValue:{summary:`You can return to the new Dashboard at any time by navigating to /dashboard.`}}},confirmOk:{control:`text`,description:`Label of the confirmation dialog's primary button, which switches to OLD`,table:{defaultValue:{summary:`Switch`}}},confirmCancel:{control:`text`,description:`Label of the confirmation dialog's second button, which closes it and keeps NEW`,table:{defaultValue:{summary:`Cancel`}}},ariaLabel:{control:`text`,description:`Accessible name a screen reader announces for the switch; the English default is not translated`,table:{defaultValue:{summary:`Switch ONLYOFFICE Apps design`}}},onNavigate:{action:`onNavigate`,description:'Called with `"/dashboard"` when switching to NEW and with `"/"` after confirming the switch to OLD; replaces `window.location.href`. Pass React Router `navigate` here.'},className:{control:`text`,description:`Additional CSS class applied to the wrapper around the title and the pill`}},decorators:[e=>(localStorage.setItem(`useDocSpace`,`new`),(0,M.jsx)(e,{}))]},P={args:{title:`ONLYOFFICE Apps design`,labelOld:`OLD`,labelNew:`NEW`},parameters:{docs:{description:{story:`The toggle in the NEW position, as a first visit finds it. Click it to open the confirmation dialog that guards the way back to the classic view; change any other prop live in the Controls panel below.`},source:{code:`<TwoStateToggle onNavigate={(url) => navigate(url)} />`}}}},F={decorators:[e=>(localStorage.setItem(`useDocSpace`,`old`),(0,M.jsx)(e,{}))],args:{title:`ONLYOFFICE Apps design`},parameters:{docs:{description:{story:'Toggle in the OLD position. Clicking it switches to NEW immediately (calls `onNavigate("/dashboard")`).'},source:{code:`// localStorage.useDocSpace === "old"
<TwoStateToggle onNavigate={(url) => navigate(url)} />`}}}},I={args:{title:``},parameters:{docs:{description:{story:`Toggle without the text label — only the pill is rendered.`},source:{code:`<TwoStateToggle title="" onNavigate={(url) => navigate(url)} />`}}}},L={args:{title:`Interface`,labelOld:`v1`,labelNew:`v2`,confirmTitle:`Switch to v1?`,confirmBody:`You will be taken back to the classic interface.`,confirmHint:`Return to v2 anytime via /dashboard.`,confirmOk:`Yes, switch`,confirmCancel:`Stay on v2`},parameters:{docs:{description:{story:`All text strings are customizable — useful when the toggle is reused in other contexts. Click the toggle to see the dialog texts.`},source:{code:`<TwoStateToggle
  title="Interface"
  labelOld="v1"
  labelNew="v2"
  confirmTitle="Switch to v1?"
  confirmBody="You will be taken back to the classic interface."
  confirmHint="Return to v2 anytime via /dashboard."
  confirmOk="Yes, switch"
  confirmCancel="Stay on v2"
  onNavigate={(url) => navigate(url)}
/>`}}}},R={render:e=>(0,M.jsx)(`div`,{dir:`rtl`,children:(0,M.jsx)(A,{...e})}),globals:{direction:`rtl`},args:{title:`Design`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`62px`},description:{story:"The toggle in a right-to-left layout: the title moves to the right of the pill, OLD takes the right half and NEW the left, and the thumb sits on the left over NEW. The wrapper carries `dir=\"rtl\"` for the layout; the thumb's leftward slide comes from the theme's `interfaceDirection` (the Direction toolbar)."},source:{code:`<div dir="rtl">
  <TwoStateToggle title="Design" onNavigate={(url) => navigate(url)} />
</div>`}}}},z={render:e=>(0,M.jsx)(`div`,{style:{"--color-scheme-main-accent":`#2e7d32`,"--button-root-border-radius":`18px`,"--text-color":`#2e7d32`},children:(0,M.jsx)(A,{...e})}),parameters:{docs:{description:{story:`All three overridable variables set on one wrapper -- the variables are listed under CSS variables on this page. Press Tab to focus the switch and see the ring take the custom accent.`},source:{code:`<div style={{
  "--color-scheme-main-accent": "#2e7d32",
  "--button-root-border-radius": "18px",
  "--text-color": "#2e7d32",
}}>
  <TwoStateToggle onNavigate={(url) => navigate(url)} />
</div>`}}}},B=[`Default`,`ShowingOldState`,`WithoutTitle`,`CustomLabels`,`RightToLeft`,`CssCustomization`],P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    title: "ONLYOFFICE Apps design",
    labelOld: "OLD",
    labelNew: "NEW"
  },
  parameters: {
    docs: {
      description: {
        story: "The toggle in the NEW position, as a first visit finds it. Click it to open the confirmation dialog that guards the way back to the classic view; change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<TwoStateToggle onNavigate={(url) => navigate(url)} />\`
      }
    }
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  decorators: [Story => {
    localStorage.setItem("useDocSpace", "old");
    return <Story />;
  }],
  args: {
    title: "ONLYOFFICE Apps design"
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle in the OLD position. Clicking it switches to NEW immediately (calls \`onNavigate("/dashboard")\`).'
      },
      source: {
        code: \`// localStorage.useDocSpace === "old"
<TwoStateToggle onNavigate={(url) => navigate(url)} />\`
      }
    }
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    title: ""
  },
  parameters: {
    docs: {
      description: {
        story: "Toggle without the text label — only the pill is rendered."
      },
      source: {
        code: \`<TwoStateToggle title="" onNavigate={(url) => navigate(url)} />\`
      }
    }
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Interface",
    labelOld: "v1",
    labelNew: "v2",
    confirmTitle: "Switch to v1?",
    confirmBody: "You will be taken back to the classic interface.",
    confirmHint: "Return to v2 anytime via /dashboard.",
    confirmOk: "Yes, switch",
    confirmCancel: "Stay on v2"
  },
  parameters: {
    docs: {
      description: {
        story: "All text strings are customizable — useful when the toggle is reused in other contexts. Click the toggle to see the dialog texts."
      },
      source: {
        code: \`<TwoStateToggle
  title="Interface"
  labelOld="v1"
  labelNew="v2"
  confirmTitle="Switch to v1?"
  confirmBody="You will be taken back to the classic interface."
  confirmHint="Return to v2 anytime via /dashboard."
  confirmOk="Yes, switch"
  confirmCancel="Stay on v2"
  onNavigate={(url) => navigate(url)}
/>\`
      }
    }
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <TwoStateToggle {...args} />
    </div>,
  globals: {
    direction: "rtl"
  },
  args: {
    title: "Design"
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: {
        inline: false,
        height: "62px"
      },
      description: {
        story: "The toggle in a right-to-left layout: the title moves to the right of the pill, OLD takes the right half and NEW the left, and the thumb sits on the left over NEW. The wrapper carries \`dir=\\"rtl\\"\` for the layout; the thumb's leftward slide comes from the theme's \`interfaceDirection\` (the Direction toolbar)."
      },
      source: {
        code: \`<div dir="rtl">
  <TwoStateToggle title="Design" onNavigate={(url) => navigate(url)} />
</div>\`
      }
    }
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    "--color-scheme-main-accent": "#2e7d32",
    "--button-root-border-radius": "18px",
    "--text-color": "#2e7d32"
  } as CSSProperties}>
      <TwoStateToggle {...args} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`All three overridable variables set on one wrapper -- the variables are listed under CSS variables on this page. Press Tab to focus the switch and see the ring take the custom accent.\`
      },
      source: {
        code: \`<div style={{
  "--color-scheme-main-accent": "#2e7d32",
  "--button-root-border-radius": "18px",
  "--text-color": "#2e7d32",
}}>
  <TwoStateToggle onNavigate={(url) => navigate(url)} />
</div>\`
      }
    }
  }
}`,...z.parameters?.docs?.source}}}})))()}V();export{z as CssCustomization,L as CustomLabels,P as Default,R as RightToLeft,F as ShowingOldState,I as WithoutTitle,B as __namedExportsOrder,N as default};