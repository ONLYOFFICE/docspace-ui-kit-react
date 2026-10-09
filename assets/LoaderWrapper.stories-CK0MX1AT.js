import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{r as n,t as r}from"./text-Cz_cI6Yf.js";import{n as i,t as a}from"./button-DjDXE7uo.js";import{a as o,o as s,r as c,t as l}from"./heading-BgSzvZkA.js";import{n as u,t as d}from"./loader-wrapper-CItBZXec.js";var f,p,m,h,g,_,v;function y(){return(y=e((()=>{i(),c(),s(),n(),u(),f=t(),p={title:`UI/Status components/LoaderWrapper`,component:d,parameters:{layout:`centered`},argTypes:{children:{control:!1,description:`The content that is dimmed and made unclickable while loading. It is laid out in a flex column`},isLoading:{control:`boolean`,description:`Whether the content is busy: fades the content to half opacity and stops the mouse reaching it. Shows no spinner and does not block the keyboard`},testId:{control:`text`,description:"Replaces the wrapper's `data-testid`",table:{defaultValue:{summary:`loader-wrapper`}}}}},m=(0,f.jsxs)(`div`,{style:{padding:`24px 32px`,borderRadius:`16px`,border:`1px solid var(--stroke-light, #e1e6eb)`,background:`var(--background-surface, #fff)`,minWidth:320,maxWidth:420,display:`flex`,flexDirection:`column`,gap:12},children:[(0,f.jsx)(l,{size:o.medium,children:`Lorem ipsum`}),(0,f.jsx)(r,{color:`var(--text-secondary, #4f5d75)`,lineHeight:`22px`,children:`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`}),(0,f.jsx)(a,{primary:!0,label:`Lorem ipsum`})]}),h={render:e=>(0,f.jsx)(d,{...e}),args:{isLoading:!1,children:m},parameters:{docs:{description:{story:"The content as it looks when nothing is loading: fully opaque and clickable. Switch `isLoading` in the Controls panel below to watch it fade and back."},source:{code:`<LoaderWrapper isLoading={false}>
  <CardContent />
</LoaderWrapper>`}}}},g={render:e=>(0,f.jsx)(d,{...e}),args:{isLoading:!0,children:m},parameters:{docs:{description:{story:"The same card while loading: it stays on screen at half opacity so the reader keeps their place, and the button no longer answers the mouse (`isLoading`). Place a loader beside it to say why."},source:{code:`<LoaderWrapper isLoading>
  <CardContent />
</LoaderWrapper>`}}}},_={render:()=>(0,f.jsxs)(`div`,{style:{"--loader-wrapper-loading-opacity":`0.3`,"--loader-wrapper-idle-opacity":`0.8`,"--loader-wrapper-transition":`opacity 0.6s ease-in-out`,display:`flex`,flexDirection:`column`,gap:16},children:[(0,f.jsx)(d,{isLoading:!0,children:m}),(0,f.jsx)(d,{isLoading:!1,children:m})]}),parameters:{docs:{description:{story:"Both opacities and the transition set on one wrapper -- the variables are listed under CSS variables on this page. The first card is loading and shows `--loader-wrapper-loading-opacity`; the second is idle and shows `--loader-wrapper-idle-opacity`. `--loader-wrapper-transition` takes effect only when `isLoading` changes on an instance, which these two cards never do."},source:{code:`<div
  style={{
    "--loader-wrapper-loading-opacity": "0.3",
    "--loader-wrapper-idle-opacity": "0.8",
    "--loader-wrapper-transition": "opacity 0.6s ease-in-out",
  }}
>
  <LoaderWrapper isLoading>
    <CardContent />
  </LoaderWrapper>
  <LoaderWrapper isLoading={false}>
    <CardContent />
  </LoaderWrapper>
</div>`}}}},v=[`Default`,`LoadingContent`,`CssCustomization`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <LoaderWrapper {...args} />,
  args: {
    isLoading: false,
    children: cardContent
  },
  parameters: {
    docs: {
      description: {
        story: "The content as it looks when nothing is loading: fully opaque and clickable. Switch \`isLoading\` in the Controls panel below to watch it fade and back."
      },
      source: {
        code: \`<LoaderWrapper isLoading={false}>
  <CardContent />
</LoaderWrapper>\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <LoaderWrapper {...args} />,
  args: {
    isLoading: true,
    children: cardContent
  },
  parameters: {
    docs: {
      description: {
        story: "The same card while loading: it stays on screen at half opacity so the reader keeps their place, and the button no longer answers the mouse (\`isLoading\`). Place a loader beside it to say why."
      },
      source: {
        code: \`<LoaderWrapper isLoading>
  <CardContent />
</LoaderWrapper>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--loader-wrapper-loading-opacity": "0.3",
    "--loader-wrapper-idle-opacity": "0.8",
    "--loader-wrapper-transition": "opacity 0.6s ease-in-out",
    display: "flex",
    flexDirection: "column",
    gap: 16
  } as CSSProperties}>
      <LoaderWrapper isLoading>{cardContent}</LoaderWrapper>
      <LoaderWrapper isLoading={false}>{cardContent}</LoaderWrapper>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Both opacities and the transition set on one wrapper -- the variables are listed under CSS variables on this page. The first card is loading and shows \\\`--loader-wrapper-loading-opacity\\\`; the second is idle and shows \\\`--loader-wrapper-idle-opacity\\\`. \\\`--loader-wrapper-transition\\\` takes effect only when \\\`isLoading\\\` changes on an instance, which these two cards never do.\`
      },
      source: {
        code: \`<div
  style={{
    "--loader-wrapper-loading-opacity": "0.3",
    "--loader-wrapper-idle-opacity": "0.8",
    "--loader-wrapper-transition": "opacity 0.6s ease-in-out",
  }}
>
  <LoaderWrapper isLoading>
    <CardContent />
  </LoaderWrapper>
  <LoaderWrapper isLoading={false}>
    <CardContent />
  </LoaderWrapper>
</div>\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}}})))()}y();export{_ as CssCustomization,h as Default,g as LoadingContent,v as __namedExportsOrder,p as default};