import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./loading-button-CrSQKMdP.js";var i,a,o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{n(),i=t(),a={title:`UI/Feedback/LoadingButton`,component:r,parameters:{},argTypes:{id:{control:!1,description:"Ignored: nothing reads this prop, and the element carries no `id`"},className:{control:!1,description:`Ignored: nothing reads this prop; style the ring through the CSS custom properties`},style:{control:!1,description:`Ignored: nothing reads this prop`},percent:{control:{type:`number`,min:0,max:100},description:`How much of the ring is filled, 0-100; at 0 a half ring spins instead of showing an arc`,table:{defaultValue:{summary:`0`}}},inConversion:{control:`boolean`,description:`Whether the cross in the middle is dropped, leaving the ring on its own`,table:{defaultValue:{summary:`false`}}},isDefaultMode:{control:`boolean`,description:`Whether the ring and the cross are drawn in the theme's grey instead of the accent colour, with the cross changing colour on hover`,table:{defaultValue:{summary:`false`}}},loaderColor:{control:`color`,description:`CSS colour of the ring and of the cross; overrides the accent colour`},backgroundColor:{control:`color`,description:`CSS colour of the disc behind the cross`},onClick:{action:`onClick`,description:`Called with no arguments when anything inside the 16px square is clicked, including the cross`}}},o=e=>(0,i.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(60px, 1fr))`,gridGap:`16px`,alignItems:`center`},children:e.children}),s={render:e=>(0,i.jsx)(r,{...e}),args:{percent:0,inConversion:!1,isDefaultMode:!1},parameters:{docs:{description:{story:"The ring as it first appears, before any progress is known: at the default `percent` of 0 a half ring spins. Change the percentage, drop the cross or pick colours live in the Controls panel below."},source:{code:`<LoadingButton percent={0} onClick={() => cancelUpload()} />`}}}},c=()=>(0,i.jsx)(o,{children:[0,25,50,75,100].map(e=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`8px`},children:[(0,i.jsx)(r,{percent:e}),(0,i.jsxs)(`span`,{style:{fontSize:`11px`,color:`#666`},children:[e,`%`]})]},e))}),l={render:()=>(0,i.jsx)(c,{}),parameters:{docs:{description:{story:"Five rings labelled with their `percent`, to show how far the arc reaches at each stage: at 0% a half ring spins, the look for an operation whose size is not known yet, and from 25% on the arc grows clockwise until it closes at 100%."},source:{code:`<LoadingButton percent={0} />
<LoadingButton percent={25} />
<LoadingButton percent={50} />
<LoadingButton percent={75} />
<LoadingButton percent={100} />`}}}},u=()=>(0,i.jsxs)(o,{children:[(0,i.jsx)(r,{percent:0,inConversion:!0}),(0,i.jsx)(r,{percent:50,inConversion:!0}),(0,i.jsx)(r,{percent:100,inConversion:!0})]}),d={render:()=>(0,i.jsx)(u,{}),parameters:{docs:{description:{story:"The same rings with no cross in the middle (`inConversion`), for a marker that shows progress and nothing else: at 0% the ring spins, at 50% it is half filled, at 100% it is closed."},source:{code:`<LoadingButton percent={0} inConversion />
<LoadingButton percent={50} inConversion />
<LoadingButton percent={100} inConversion />`}}}},f=()=>(0,i.jsx)(o,{children:(0,i.jsx)(r,{percent:45,isDefaultMode:!0})}),p={render:()=>(0,i.jsx)(f,{}),parameters:{docs:{description:{story:"The ring and the cross in the theme's grey instead of the accent colour (`isDefaultMode`), for an item that is waiting rather than running. Hover the ring to see the cross change colour."},source:{code:`<LoadingButton percent={45} isDefaultMode />`}}}},m=()=>(0,i.jsxs)(o,{children:[(0,i.jsx)(r,{percent:60,loaderColor:`#2DA7DB`}),(0,i.jsx)(r,{percent:60,loaderColor:`#4CAF50`}),(0,i.jsx)(r,{percent:60,loaderColor:`#FF5722`}),(0,i.jsx)(r,{percent:60,loaderColor:`#FF5722`,backgroundColor:`#FFE0D6`})]}),h={render:()=>(0,i.jsx)(m,{}),parameters:{docs:{description:{story:"Colours set per instance, for a ring that has to match its surroundings rather than the theme: the first three change the ring and the cross (`loaderColor`), the last also tints the disc behind the cross (`backgroundColor`)."},source:{code:`<LoadingButton percent={60} loaderColor="#2DA7DB" />
<LoadingButton percent={60} loaderColor="#4CAF50" />
<LoadingButton percent={60} loaderColor="#FF5722" />
<LoadingButton percent={60} loaderColor="#FF5722" backgroundColor="#FFE0D6" />`}}}},g={render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,gap:`16px`,alignItems:`center`,"--loading-button-accent":`#7c3aed`,"--loading-button-idle":`#a78bfa`,"--loading-button-hover-fill":`#4c1d95`,"--loading-button-custom-bg":`#ede9fe`},children:[(0,i.jsx)(r,{percent:60}),(0,i.jsx)(r,{percent:30,isDefaultMode:!0})]}),parameters:{docs:{description:{story:"Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The first ring shows the accent and the disc colours; the second sets `isDefaultMode` to show the idle colour, and hovering it shows the hover colour."},source:{code:`<div
  style={{
    "--loading-button-accent": "#7c3aed",
    "--loading-button-idle": "#a78bfa",
    "--loading-button-hover-fill": "#4c1d95",
    "--loading-button-custom-bg": "#ede9fe",
  }}
>
  <LoadingButton percent={60} />
  <LoadingButton percent={30} isDefaultMode />
</div>`}}}},_=[`Default`,`ProgressStages`,`InConversion`,`DefaultMode`,`CustomColors`,`CssCustomization`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <LoadingButton {...args} />,
  args: {
    percent: 0,
    inConversion: false,
    isDefaultMode: false
  },
  parameters: {
    docs: {
      description: {
        story: "The ring as it first appears, before any progress is known: at the default \`percent\` of 0 a half ring spins. Change the percentage, drop the cross or pick colours live in the Controls panel below."
      },
      source: {
        code: \`<LoadingButton percent={0} onClick={() => cancelUpload()} />\`
      }
    }
  }
}`,...s.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <ProgressStagesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Five rings labelled with their \`percent\`, to show how far the arc reaches at each stage: at 0% a half ring spins, the look for an operation whose size is not known yet, and from 25% on the arc grows clockwise until it closes at 100%."
      },
      source: {
        code: \`<LoadingButton percent={0} />
<LoadingButton percent={25} />
<LoadingButton percent={50} />
<LoadingButton percent={75} />
<LoadingButton percent={100} />\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <InConversionTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The same rings with no cross in the middle (\`inConversion\`), for a marker that shows progress and nothing else: at 0% the ring spins, at 50% it is half filled, at 100% it is closed."
      },
      source: {
        code: \`<LoadingButton percent={0} inConversion />
<LoadingButton percent={50} inConversion />
<LoadingButton percent={100} inConversion />\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <DefaultModeTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The ring and the cross in the theme's grey instead of the accent colour (\`isDefaultMode\`), for an item that is waiting rather than running. Hover the ring to see the cross change colour."
      },
      source: {
        code: \`<LoadingButton percent={45} isDefaultMode />\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <CustomColorsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Colours set per instance, for a ring that has to match its surroundings rather than the theme: the first three change the ring and the cross (\`loaderColor\`), the last also tints the disc behind the cross (\`backgroundColor\`)."
      },
      source: {
        code: \`<LoadingButton percent={60} loaderColor="#2DA7DB" />
<LoadingButton percent={60} loaderColor="#4CAF50" />
<LoadingButton percent={60} loaderColor="#FF5722" />
<LoadingButton percent={60} loaderColor="#FF5722" backgroundColor="#FFE0D6" />\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: "16px",
    alignItems: "center",
    "--loading-button-accent": "#7c3aed",
    "--loading-button-idle": "#a78bfa",
    "--loading-button-hover-fill": "#4c1d95",
    "--loading-button-custom-bg": "#ede9fe"
  } as CSSProperties}>
      <LoadingButton percent={60} />
      <LoadingButton percent={30} isDefaultMode />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The first ring shows the accent and the disc colours; the second sets \\\`isDefaultMode\\\` to show the idle colour, and hovering it shows the hover colour.\`
      },
      source: {
        code: \`<div
  style={{
    "--loading-button-accent": "#7c3aed",
    "--loading-button-idle": "#a78bfa",
    "--loading-button-hover-fill": "#4c1d95",
    "--loading-button-custom-bg": "#ede9fe",
  }}
>
  <LoadingButton percent={60} />
  <LoadingButton percent={30} isDefaultMode />
</div>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}}})))()}v();export{g as CssCustomization,h as CustomColors,s as Default,p as DefaultMode,d as InConversion,l as ProgressStages,_ as __namedExportsOrder,a as default};