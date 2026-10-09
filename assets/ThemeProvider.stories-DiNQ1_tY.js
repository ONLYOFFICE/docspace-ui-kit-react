import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./theme-provider-B7Yz5SvD.js";import{r as a,t as o}from"./text-Cz_cI6Yf.js";import{n as s,t as c}from"./slider-avEbx71c.js";var l,u,d,f,p,m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{l=t(),s(),a(),r(),u=n(),d={title:`UI/Layout/ThemeProviderComponent`,component:i,parameters:{},argTypes:{theme:{control:`object`,description:"The theme object. `isBase` picks the light (`true`) or dark (`false`) theme, `interfaceDirection` sets the writing direction (`ltr` or `rtl`), and `fontFamily` sets the font of every element on the page. Other keys are ignored.",table:{defaultValue:{summary:`required`}}},currentColorScheme:{control:`object`,description:"The accent colours: `main.accent` and `main.buttons` are the colours, `text.accent` and `text.buttons` the text drawn on them. Written onto the page only when `main` is present; leaving it out or removing it later keeps the colours already there.",table:{defaultValue:{summary:`undefined`}}},children:{control:!1,description:`The tree that receives the theme and direction context. The theme, direction and colours themselves apply to the whole page, not only to these children.`}}},f={isBase:!0,interfaceDirection:`ltr`,fontFamily:`Open Sans, sans-serif, Arial`},p={id:1,name:`Green`,main:{accent:`#2DB482`,buttons:`#2DB482`},text:{accent:`#FFFFFF`,buttons:`#FFFFFF`}},m=({children:e})=>{let[t,n]=(0,l.useState)(!1);return(0,l.useEffect)(()=>n(!0),[]),t?e:null},h=()=>({theme:document.documentElement.getAttribute(`data-theme`)??``,dir:document.documentElement.getAttribute(`data-dir`)??``,bodyClass:[...document.body.classList].filter(e=>[`light`,`dark`,`ltr`,`rtl`].includes(e)).join(` `),accent:getComputedStyle(document.body).getPropertyValue(`--color-scheme-main-accent`).trim()}),g=()=>{let[e,t]=(0,l.useState)(h);return(0,l.useEffect)(()=>{let e=()=>t(h()),n=new MutationObserver(e);return n.observe(document.documentElement,{attributes:!0,attributeFilter:[`data-theme`,`data-dir`,`style`]}),n.observe(document.body,{attributes:!0,attributeFilter:[`class`,`style`]}),e(),()=>n.disconnect()},[]),(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8,padding:16,maxWidth:320,backgroundColor:`var(--background-color)`,color:`var(--text-color)`,border:`1px solid var(--info-panel-members-subtitle-color)`,borderRadius:6},children:[(0,u.jsx)(o,{fontWeight:600,children:`Document settings`}),(0,u.jsxs)(o,{children:[`data-theme: `,e.theme]}),(0,u.jsxs)(o,{children:[`data-dir: `,e.dir]}),(0,u.jsxs)(o,{children:[`body class: `,e.bodyClass]}),(0,u.jsxs)(o,{children:[`accent: `,e.accent]}),(0,u.jsx)(c,{min:0,max:100,value:60,withPouring:!0,onChange:()=>{}})]})},_=e=>(0,u.jsx)(m,{children:(0,u.jsx)(i,{...e,children:(0,u.jsx)(g,{})})}),v={inline:!1,height:`250px`},y={render:e=>(0,u.jsx)(_,{...e}),args:{theme:f,children:null},parameters:{noPadding:!0,docs:{story:v,description:{story:`The light theme in the left-to-right direction: the panel reads back what the component wrote onto the page, and its background and text take the theme's colours. Change the theme object live in the Controls panel below; the toolbar's theme and direction switches write over it until the story reloads.`},source:{code:`<ThemeProviderComponent
  theme={{ isBase: true, interfaceDirection: "ltr", fontFamily: "Open Sans, sans-serif, Arial" }}
>
  <App />
</ThemeProviderComponent>`}}}},b={render:e=>(0,u.jsx)(_,{...e}),args:{theme:{...f,isBase:!1},children:null},parameters:{noPadding:!0,docs:{story:v,description:{story:"Use it to switch the page to the dark theme: the panel turns dark with light text, the body class reads `dark`, and the slider switches to its dark look (`isBase: false`)."},source:{code:`<ThemeProviderComponent theme={{ isBase: false, interfaceDirection: "ltr" }}>
  <App />
</ThemeProviderComponent>`}}}},x={render:e=>(0,u.jsx)(_,{...e}),args:{theme:f,currentColorScheme:p,children:null},parameters:{noPadding:!0,docs:{story:v,description:{story:"Use it to give accented components your own colour: the slider's thumb and filled track turn green, and the panel reads the new accent back (`currentColorScheme`)."},source:{code:`<ThemeProviderComponent
  theme={{ isBase: true, interfaceDirection: "ltr" }}
  currentColorScheme={{
    id: 1,
    name: "Green",
    main: { accent: "#2DB482", buttons: "#2DB482" },
    text: { accent: "#FFFFFF", buttons: "#FFFFFF" },
  }}
>
  <App />
</ThemeProviderComponent>`}}}},S={render:e=>(0,u.jsx)(`div`,{dir:`rtl`,children:(0,u.jsx)(_,{...e})}),args:{theme:{...f,interfaceDirection:`rtl`},children:null},globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{story:v,description:{story:'Use it for a right-to-left interface: the panel moves to the right edge, its lines align right, the slider fills from the right, and `data-dir` reads `rtl` (`interfaceDirection: "rtl"`).'},source:{code:`<ThemeProviderComponent theme={{ isBase: true, interfaceDirection: "rtl" }}>
  <App />
</ThemeProviderComponent>`}}}},C=[`Default`,`DarkTheme`,`WithAccentColors`,`RightToLeft`],y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    theme: defaultTheme,
    children: null
  },
  parameters: {
    noPadding: true,
    docs: {
      story: framed,
      description: {
        story: "The light theme in the left-to-right direction: the panel reads back what the component wrote onto the page, and its background and text take the theme's colours. Change the theme object live in the Controls panel below; the toolbar's theme and direction switches write over it until the story reloads."
      },
      source: {
        code: \`<ThemeProviderComponent
  theme={{ isBase: true, interfaceDirection: "ltr", fontFamily: "Open Sans, sans-serif, Arial" }}
>
  <App />
</ThemeProviderComponent>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    theme: {
      ...defaultTheme,
      isBase: false
    },
    children: null
  },
  parameters: {
    noPadding: true,
    docs: {
      story: framed,
      description: {
        story: "Use it to switch the page to the dark theme: the panel turns dark with light text, the body class reads \`dark\`, and the slider switches to its dark look (\`isBase: false\`)."
      },
      source: {
        code: \`<ThemeProviderComponent theme={{ isBase: false, interfaceDirection: "ltr" }}>
  <App />
</ThemeProviderComponent>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    theme: defaultTheme,
    currentColorScheme: greenScheme,
    children: null
  },
  parameters: {
    noPadding: true,
    docs: {
      story: framed,
      description: {
        story: "Use it to give accented components your own colour: the slider's thumb and filled track turn green, and the panel reads the new accent back (\`currentColorScheme\`)."
      },
      source: {
        code: \`<ThemeProviderComponent
  theme={{ isBase: true, interfaceDirection: "ltr" }}
  currentColorScheme={{
    id: 1,
    name: "Green",
    main: { accent: "#2DB482", buttons: "#2DB482" },
    text: { accent: "#FFFFFF", buttons: "#FFFFFF" },
  }}
>
  <App />
</ThemeProviderComponent>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <Template {...args} />
    </div>,
  args: {
    theme: {
      ...defaultTheme,
      interfaceDirection: "rtl"
    },
    children: null
  },
  globals: {
    direction: "rtl"
  },
  parameters: {
    noPadding: true,
    docs: {
      story: framed,
      description: {
        story: 'Use it for a right-to-left interface: the panel moves to the right edge, its lines align right, the slider fills from the right, and \`data-dir\` reads \`rtl\` (\`interfaceDirection: "rtl"\`).'
      },
      source: {
        code: \`<ThemeProviderComponent theme={{ isBase: true, interfaceDirection: "rtl" }}>
  <App />
</ThemeProviderComponent>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}}})))()}w();export{b as DarkTheme,y as Default,S as RightToLeft,x as WithAccentColors,C as __namedExportsOrder,d as default};