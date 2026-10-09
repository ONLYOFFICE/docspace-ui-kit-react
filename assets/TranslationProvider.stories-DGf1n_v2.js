import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./useTranslation-Bu8Vk4Ex.js";import{n as a,t as o}from"./TranslationProvider-BwNYq9yU.js";import{n as s,t as c}from"./Common-B-JwupwU.js";var l,u,d,f,p,m,h;function g(){return(g=e((()=>{t(),i(),s(),a(),l=n(),u=new Map([[`en`,new Map([[`Common`,c]])]]),d={title:`Components/Providers/TranslationProvider`,component:o,decorators:[e=>(0,l.jsx)(o,{translations:u,locale:`en`,children:(0,l.jsx)(e,{})})],parameters:{}},f=()=>{let{t:e}=r(`Common`);return(0,l.jsxs)(`div`,{style:{padding:`16px`},children:[(0,l.jsx)(`h3`,{children:`Translation Demo`}),(0,l.jsxs)(`ul`,{children:[(0,l.jsxs)(`li`,{children:[`SaveButton: `,e(`SaveButton`)]}),(0,l.jsxs)(`li`,{children:[`CancelButton: `,e(`CancelButton`)]}),(0,l.jsxs)(`li`,{children:[`Delete: `,e(`Delete`)]}),(0,l.jsxs)(`li`,{children:[`Settings: `,e(`Settings`)]})]})]})},p={render:()=>(0,l.jsx)(f,{}),parameters:{docs:{description:{story:"Shows translated strings read via the `useTranslation()` hook."}}}},m={decorators:[e=>(0,l.jsx)(o,{children:(0,l.jsx)(e,{})})],render:()=>(0,l.jsx)(`div`,{style:{padding:`16px`},children:(0,l.jsx)(`p`,{children:`No translations provided — children render as-is.`})}),parameters:{docs:{description:{story:`When no translations are provided, the provider renders children directly without i18n.`}}}},h=[`Default`,`WithoutTranslations`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <TranslatedDemo />,
  parameters: {
    docs: {
      description: {
        story: "Shows translated strings read via the \`useTranslation()\` hook."
      }
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <TranslationProvider>
        <Story />
      </TranslationProvider>],
  render: () => <div style={{
    padding: "16px"
  }}>
      <p>No translations provided — children render as-is.</p>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "When no translations are provided, the provider renders children directly without i18n."
      }
    }
  }
}`,...m.parameters?.docs?.source}}}})))()}g();export{p as Default,m as WithoutTranslations,h as __namedExportsOrder,d as default};