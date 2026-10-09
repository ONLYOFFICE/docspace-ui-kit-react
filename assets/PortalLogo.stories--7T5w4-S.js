import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{n as i,t as a}from"./PortalLogo-C4z4pAVw.js";var o,s,c,l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{o=t(n()),i(),s=r(),c=`data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22386%22%20height%3D%2244%22%20viewBox%3D%220%200%20386%2044%22%3E%3Crect%20width%3D%22386%22%20height%3D%2244%22%20rx%3D%226%22%20fill%3D%22%23d0d5da%22%2F%3E%3Ctext%20x%3D%22193%22%20y%3D%2228%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20fill%3D%22%23555f65%22%3EPortal%20logo%3C%2Ftext%3E%3C%2Fsvg%3E`,l=(e,t)=>{let n=o.useRef(null),r=!!t.parameters.keepFallback;return o.useEffect(()=>{if(r)return;let e=e=>{let t=e.target;t instanceof HTMLImageElement&&t.src.includes(`logo.ashx`)&&n.current?.contains(t)&&(e.stopPropagation(),t.src=c)};return window.addEventListener(`error`,e,!0),()=>window.removeEventListener(`error`,e,!0)},[r]),(0,s.jsx)(`div`,{ref:n,style:{display:`contents`},children:(0,s.jsx)(e,{})})},u=(e,t)=>(n,r)=>r.viewMode===`docs`?(0,s.jsx)(`iframe`,{title:r.name,src:`iframe.html?viewMode=story&id=${r.id}`,style:{width:e,height:t,border:0}}):(0,s.jsx)(n,{}),d={title:`UI/Data display/PortalLogo`,component:a,parameters:{},argTypes:{className:{control:`text`,description:"Added to the logo image, or to the fallback logo, next to its own `logo-wrapper` class; never to the wrapper around it"},isResizable:{control:`boolean`,description:`Follows the window width and, at 600px and narrower, shows the small logo in a bar fixed across the top of the window. Without it the logo is hidden at those widths`,table:{defaultValue:{summary:`false`}}}},decorators:[l]},f={render:e=>(0,s.jsx)(a,{...e}),args:{isResizable:!1},parameters:{docs:{description:{story:`The logo as a wide screen shows it, at its full size. No portal serves the image here, so a placeholder stands in for it; change any other prop live in the Controls panel below.`},source:{code:`<PortalLogo />`}}}},p={render:e=>(0,s.jsx)(a,{...e}),args:{isResizable:!0},parameters:{docs:{description:{story:"The same logo, now following the window width: narrow the window to 600px or less and it moves into a bar fixed across the top (`isResizable`). The OnPhone story shows that layout."},source:{code:`<PortalLogo isResizable />`}}}},m={render:e=>(0,s.jsx)(a,{...e}),args:{className:`custom-logo-class`,isResizable:!1},parameters:{docs:{description:{story:"Styling the logo from outside: the class lands on the image itself, not on the wrapper around it (`className`)."},source:{code:`<PortalLogo className="custom-logo-class" />`}}}},h={render:e=>(0,s.jsx)(a,{...e}),decorators:[u(414,120)],globals:{viewport:{value:`mobile2`,isRotated:!1}},args:{isResizable:!0},parameters:{docs:{description:{story:"On a phone the logo moves into a 48px bar fixed across the top of the window, at a smaller size (`isResizable`). Without `isResizable` nothing is shown at this width."},source:{code:`<PortalLogo isResizable />`}}}},g={render:e=>(0,s.jsx)(a,{...e}),args:{isResizable:!1},parameters:{keepFallback:!0,docs:{description:{story:`What a page shows when the portal's logo cannot be loaded: the bundled logo takes the image's place, at its own size, so the page never has an empty gap or a broken-image icon.`},source:{code:`// /logo.ashx fails to load
<PortalLogo />`}}}},_={render:()=>(0,s.jsx)(`div`,{style:{"--portal-logo-mobile-bg":`#e6f3fb`,"--portal-logo-mobile-height":`56px`,"--portal-logo-mobile-img-height":`28px`,"--portal-logo-desktop-img-height":`36px`,"--portal-logo-desktop-img-width":`320px`},children:(0,s.jsx)(a,{isResizable:!0})}),parameters:{docs:{description:{story:`One resizable logo with every variable set on its wrapper -- the variables are listed under CSS variables on this page. On a wide screen it shows the two desktop variables; narrow the window to 600px or less to see the three bar variables, with the desktop width still applied to the logo inside the bar.`}}}},v=[`Default`,`Resizable`,`WithClassName`,`OnPhone`,`FallbackLogo`,`CssCustomization`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <PortalLogo {...args} />,
  args: {
    isResizable: false
  },
  parameters: {
    docs: {
      description: {
        story: "The logo as a wide screen shows it, at its full size. No portal serves the image here, so a placeholder stands in for it; change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<PortalLogo />\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <PortalLogo {...args} />,
  args: {
    isResizable: true
  },
  parameters: {
    docs: {
      description: {
        story: "The same logo, now following the window width: narrow the window to 600px or less and it moves into a bar fixed across the top (\`isResizable\`). The OnPhone story shows that layout."
      },
      source: {
        code: \`<PortalLogo isResizable />\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <PortalLogo {...args} />,
  args: {
    className: "custom-logo-class",
    isResizable: false
  },
  parameters: {
    docs: {
      description: {
        story: "Styling the logo from outside: the class lands on the image itself, not on the wrapper around it (\`className\`)."
      },
      source: {
        code: \`<PortalLogo className="custom-logo-class" />\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <PortalLogo {...args} />,
  decorators: [withFrame(414, 120)],
  globals: {
    viewport: {
      value: "mobile2",
      isRotated: false
    }
  },
  args: {
    isResizable: true
  },
  parameters: {
    docs: {
      description: {
        story: "On a phone the logo moves into a 48px bar fixed across the top of the window, at a smaller size (\`isResizable\`). Without \`isResizable\` nothing is shown at this width."
      },
      source: {
        code: \`<PortalLogo isResizable />\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <PortalLogo {...args} />,
  args: {
    isResizable: false
  },
  parameters: {
    keepFallback: true,
    docs: {
      description: {
        story: "What a page shows when the portal's logo cannot be loaded: the bundled logo takes the image's place, at its own size, so the page never has an empty gap or a broken-image icon."
      },
      source: {
        code: \`// /logo.ashx fails to load
<PortalLogo />\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--portal-logo-mobile-bg": "#e6f3fb",
    "--portal-logo-mobile-height": "56px",
    "--portal-logo-mobile-img-height": "28px",
    "--portal-logo-desktop-img-height": "36px",
    "--portal-logo-desktop-img-width": "320px"
  } as CSSProperties}>
      <PortalLogo isResizable />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`One resizable logo with every variable set on its wrapper -- the variables are listed under CSS variables on this page. On a wide screen it shows the two desktop variables; narrow the window to 600px or less to see the three bar variables, with the desktop width still applied to the logo inside the bar.\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}}})))()}y();export{_ as CssCustomization,f as Default,g as FallbackLogo,h as OnPhone,p as Resizable,m as WithClassName,v as __namedExportsOrder,d as default};