import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./globalColors-fkBUxSeV.js";import{i,n as a,r as o,t as s}from"./loader-DNYL80kM.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{a(),i(),n(),c=t(),l={title:`UI/Status components/Loader`,component:s,parameters:{design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=419-1989&mode=design&t=TBNCKMQKQMxr44IZ-0`}},argTypes:{type:{control:`select`,options:Object.values(o),description:"Which animation to draw: `oval`, `dual-ring`, `rombs` or `track`; `base` or no value renders `label` as plain text instead",table:{defaultValue:{summary:`undefined`}}},color:{control:`color`,description:"Any CSS colour for the oval and dual-ring strokes and for the text of `base`; the track and the diamonds ignore it"},size:{control:`text`,description:"Width and height of the animation as one CSS length (px, rem or any other unit); for `base`, the font size of the text",table:{defaultValue:{summary:`40px (20px for track)`}}},label:{control:`text`,description:"Name a screen reader announces for the oval, dual-ring and track animations; for `base`, the text that is shown",table:{defaultValue:{summary:`undefined`}}},primary:{control:`boolean`,description:"Draws the track in the colour meant for a loader on a primary button, white by default; read by `track` only",table:{defaultValue:{summary:`false`}}},isDisabled:{control:`boolean`,description:"Dims the track to 60% opacity; read by `track` only",table:{defaultValue:{summary:`false`}}},className:{control:`text`,description:`Class name of the wrapper around the animation`},id:{control:`text`,description:`Id of the wrapper; the track also builds its gradient ids from it, so two tracks on one page need different ids`},style:{control:`object`,description:"Inline styles of the wrapper, applied again to the text of `base`"},ref:{control:!1,description:`Reference to the track's SVG element; the other types ignore it`}}},u=e=>(0,c.jsx)(`div`,{style:{display:`flex`,gap:`40px`,alignItems:`center`,flexWrap:`wrap`},children:e.children}),d=e=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`10px`,minWidth:`100px`,textAlign:`center`},children:[e.children,(0,c.jsx)(`span`,{style:{fontSize:`12px`,color:`#666`},children:e.label})]}),f={render:e=>(0,c.jsx)(s,{...e}),args:{type:o.base,size:`18px`,label:`Loading content, please wait...`},parameters:{docs:{description:{story:"A line of plain text instead of an animation, for a place where a moving spinner would distract: this is what you get with `type` set to `base` or left out, so pick an animation explicitly when you want one. Change any other prop live in the Controls panel below."},source:{code:`<Loader type={LoaderTypes.base} size="18px" label="Loading content, please wait..." />`}}}},p={render:e=>(0,c.jsx)(s,{...e}),args:{type:o.oval,size:`40px`,color:r.loaderLight,label:`Loading...`},parameters:{docs:{description:{story:`Oval spinner animation, commonly used for inline loading states.`},source:{code:`<Loader type={LoaderTypes.oval} size="40px" color={globalColors.loaderLight} />`}}}},m={render:e=>(0,c.jsx)(s,{...e}),args:{type:o.dualRing,size:`40px`,color:`#333333`,label:`Loading...`},parameters:{docs:{description:{story:`Dual ring animation with two concentric spinning rings.`},source:{code:`<Loader type={LoaderTypes.dualRing} size="40px" color="#333333" />`}}}},h={render:e=>(0,c.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`center`,minHeight:`150px`,minWidth:`150px`,padding:`20px`},children:(0,c.jsx)(s,{...e})}),args:{type:o.rombs,size:`65px`,label:`Loading...`},parameters:{docs:{description:{story:`Rombs (diamond) animation, used as the main application loader.`},source:{code:`<Loader type={LoaderTypes.rombs} size="65px" />`}}}},g={render:e=>(0,c.jsx)(s,{...e}),args:{type:o.track,size:`30px`,label:`Loading...`},parameters:{docs:{description:{story:`Track animation for compact loading indicators.`},source:{code:`<Loader type={LoaderTypes.track} size="30px" />`}}}},_=()=>(0,c.jsxs)(u,{children:[(0,c.jsx)(d,{label:`Base`,children:(0,c.jsx)(s,{type:o.base,size:`18px`,label:`Base loader`})}),(0,c.jsx)(d,{label:`Oval`,children:(0,c.jsx)(s,{type:o.oval,size:`40px`,color:r.loaderLight,label:`Oval loader`})}),(0,c.jsx)(d,{label:`Dual Ring`,children:(0,c.jsx)(s,{type:o.dualRing,size:`40px`,label:`Dual ring loader`})}),(0,c.jsx)(d,{label:`Rombs`,children:(0,c.jsx)(`div`,{style:{position:`relative`,width:`130px`,height:`190px`},children:(0,c.jsx)(s,{type:o.rombs,size:`65px`,label:`Rombs loader`})})}),(0,c.jsx)(d,{label:`Track`,children:(0,c.jsx)(s,{type:o.track,size:`30px`,label:`Track loader`})})]}),v={render:()=>(0,c.jsx)(_,{}),parameters:{docs:{description:{story:`Side-by-side comparison of the text fallback (Base) and the four animations (Oval, DualRing, Rombs and Track), to choose the one that fits the space it waits in.`},source:{code:`<Loader type={LoaderTypes.base} size="18px" />
<Loader type={LoaderTypes.oval} size="40px" />
<Loader type={LoaderTypes.dualRing} size="40px" />
<Loader type={LoaderTypes.rombs} size="65px" />
<Loader type={LoaderTypes.track} size="30px" />`}}}},y=()=>(0,c.jsxs)(u,{children:[(0,c.jsx)(s,{type:o.dualRing,color:`#FF5722`,size:`40px`,label:`Orange loader`}),(0,c.jsx)(s,{type:o.dualRing,color:`#2196F3`,size:`40px`,label:`Blue loader`}),(0,c.jsx)(s,{type:o.dualRing,color:`#4CAF50`,size:`40px`,label:`Green loader`}),(0,c.jsx)(s,{type:o.dualRing,color:`#9C27B0`,size:`40px`,label:`Purple loader`})]}),b={render:()=>(0,c.jsx)(y,{}),parameters:{docs:{description:{story:`DualRing loaders with different custom colors applied via the color prop.`},source:{code:`<Loader type={LoaderTypes.dualRing} color="#FF5722" size="40px" />
<Loader type={LoaderTypes.dualRing} color="#2196F3" size="40px" />
<Loader type={LoaderTypes.dualRing} color="#4CAF50" size="40px" />
<Loader type={LoaderTypes.dualRing} color="#9C27B0" size="40px" />`}}}},x=()=>(0,c.jsxs)(u,{children:[(0,c.jsx)(d,{label:`24px`,children:(0,c.jsx)(s,{type:o.oval,color:r.loaderLight,size:`24px`,label:`Small loader`})}),(0,c.jsx)(d,{label:`40px`,children:(0,c.jsx)(s,{type:o.oval,color:r.loaderLight,size:`40px`,label:`Medium loader`})}),(0,c.jsx)(d,{label:`60px`,children:(0,c.jsx)(s,{type:o.oval,color:r.loaderLight,size:`60px`,label:`Large loader`})})]}),S={render:()=>(0,c.jsx)(x,{}),parameters:{docs:{description:{story:`Oval loaders at three different sizes to demonstrate scalability.`},source:{code:`<Loader type={LoaderTypes.oval} size="24px" />
<Loader type={LoaderTypes.oval} size="40px" />
<Loader type={LoaderTypes.oval} size="60px" />`}}}},C={render:e=>(0,c.jsx)(`div`,{style:{display:`inline-flex`,padding:`10px 24px`,borderRadius:`3px`,background:`var(--color-scheme-main-buttons)`},children:(0,c.jsx)(s,{...e})}),args:{type:o.track,size:`20px`,primary:!0,id:`primary-track`,label:`Saving`},parameters:{docs:{description:{story:"A white track on the accent background of a primary button, where the default accent-coloured track would disappear (`primary`)."},source:{code:`<Loader type={LoaderTypes.track} size="20px" primary id="primary-track" label="Saving" />`}}}},w=()=>(0,c.jsxs)(u,{children:[(0,c.jsx)(d,{label:`Enabled`,children:(0,c.jsx)(s,{type:o.track,size:`30px`,id:`enabled-track`,label:`Loading`})}),(0,c.jsx)(d,{label:`Disabled`,children:(0,c.jsx)(s,{type:o.track,size:`30px`,id:`disabled-track`,isDisabled:!0,label:`Loading`})})]}),T={render:()=>(0,c.jsx)(w,{}),parameters:{docs:{description:{story:"The track dimmed beside a normal one, for a loader inside a control that is currently unavailable (`isDisabled`, read by the track only)."},source:{code:`<Loader type={LoaderTypes.track} size="30px" id="enabled-track" />
<Loader type={LoaderTypes.track} size="30px" id="disabled-track" isDisabled />`}}}},E={render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,gap:`40px`,alignItems:`center`,"--loader-stroke":`#7c3aed`,"--loader-size":`50px`,"--loader-track-base":`#0f766e`,"--loader-track-primary":`#b45309`,"--loader-opacity-disabled":`0.25`},children:[(0,c.jsx)(s,{type:o.oval,label:`Custom loader`}),(0,c.jsx)(s,{type:o.track,id:`css-track`,label:`Custom track`}),(0,c.jsx)(s,{type:o.track,id:`css-track-primary`,primary:!0,label:`Custom primary track`}),(0,c.jsx)(s,{type:o.track,id:`css-track-disabled`,isDisabled:!0,label:`Custom disabled track`})]}),parameters:{docs:{description:{story:"Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.\n\nThe example shows, from left to right: an oval for `--loader-stroke` and `--loader-size`, which every instance picks up; a track for `--loader-track-base`; a track with `primary` for `--loader-track-primary`; and a track with `isDisabled` for `--loader-opacity-disabled`."},source:{code:`<div style={{
  "--loader-stroke": "#7c3aed",
  "--loader-size": "50px",
  "--loader-track-base": "#0f766e",
  "--loader-track-primary": "#b45309",
  "--loader-opacity-disabled": "0.25",
}}>
  <Loader type={LoaderTypes.oval} />
  <Loader type={LoaderTypes.track} id="css-track" />
  <Loader type={LoaderTypes.track} id="css-track-primary" primary />
  <Loader type={LoaderTypes.track} id="css-track-disabled" isDisabled />
</div>`}}}},D=[`Default`,`Oval`,`DualRing`,`Rombs`,`Track`,`AllTypes`,`CustomColors`,`DifferentSizes`,`OnPrimaryButton`,`DisabledState`,`CssCustomization`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <Loader {...args} />,
  args: {
    type: LoaderTypes.base,
    size: "18px",
    label: "Loading content, please wait..."
  },
  parameters: {
    docs: {
      description: {
        story: "A line of plain text instead of an animation, for a place where a moving spinner would distract: this is what you get with \`type\` set to \`base\` or left out, so pick an animation explicitly when you want one. Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Loader type={LoaderTypes.base} size="18px" label="Loading content, please wait..." />\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <Loader {...args} />,
  args: {
    type: LoaderTypes.oval,
    size: "40px",
    color: globalColors.loaderLight,
    label: "Loading..."
  },
  parameters: {
    docs: {
      description: {
        story: "Oval spinner animation, commonly used for inline loading states."
      },
      source: {
        code: \`<Loader type={LoaderTypes.oval} size="40px" color={globalColors.loaderLight} />\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <Loader {...args} />,
  args: {
    type: LoaderTypes.dualRing,
    size: "40px",
    color: "#333333",
    label: "Loading..."
  },
  parameters: {
    docs: {
      description: {
        story: "Dual ring animation with two concentric spinning rings."
      },
      source: {
        code: \`<Loader type={LoaderTypes.dualRing} size="40px" color="#333333" />\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "150px",
    minWidth: "150px",
    padding: "20px"
  }}>
      <Loader {...args} />
    </div>,
  args: {
    type: LoaderTypes.rombs,
    size: "65px",
    label: "Loading..."
  },
  parameters: {
    docs: {
      description: {
        story: "Rombs (diamond) animation, used as the main application loader."
      },
      source: {
        code: \`<Loader type={LoaderTypes.rombs} size="65px" />\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <Loader {...args} />,
  args: {
    type: LoaderTypes.track,
    size: "30px",
    label: "Loading..."
  },
  parameters: {
    docs: {
      description: {
        story: "Track animation for compact loading indicators."
      },
      source: {
        code: \`<Loader type={LoaderTypes.track} size="30px" />\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <AllTypesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Side-by-side comparison of the text fallback (Base) and the four animations (Oval, DualRing, Rombs and Track), to choose the one that fits the space it waits in."
      },
      source: {
        code: \`<Loader type={LoaderTypes.base} size="18px" />
<Loader type={LoaderTypes.oval} size="40px" />
<Loader type={LoaderTypes.dualRing} size="40px" />
<Loader type={LoaderTypes.rombs} size="65px" />
<Loader type={LoaderTypes.track} size="30px" />\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <CustomColorsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "DualRing loaders with different custom colors applied via the color prop."
      },
      source: {
        code: \`<Loader type={LoaderTypes.dualRing} color="#FF5722" size="40px" />
<Loader type={LoaderTypes.dualRing} color="#2196F3" size="40px" />
<Loader type={LoaderTypes.dualRing} color="#4CAF50" size="40px" />
<Loader type={LoaderTypes.dualRing} color="#9C27B0" size="40px" />\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <DifferentSizesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Oval loaders at three different sizes to demonstrate scalability."
      },
      source: {
        code: \`<Loader type={LoaderTypes.oval} size="24px" />
<Loader type={LoaderTypes.oval} size="40px" />
<Loader type={LoaderTypes.oval} size="60px" />\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: "inline-flex",
    padding: "10px 24px",
    borderRadius: "3px",
    background: "var(--color-scheme-main-buttons)"
  }}>
      <Loader {...args} />
    </div>,
  args: {
    type: LoaderTypes.track,
    size: "20px",
    primary: true,
    id: "primary-track",
    label: "Saving"
  },
  parameters: {
    docs: {
      description: {
        story: "A white track on the accent background of a primary button, where the default accent-coloured track would disappear (\`primary\`)."
      },
      source: {
        code: \`<Loader type={LoaderTypes.track} size="20px" primary id="primary-track" label="Saving" />\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <DisabledStateTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The track dimmed beside a normal one, for a loader inside a control that is currently unavailable (\`isDisabled\`, read by the track only)."
      },
      source: {
        code: \`<Loader type={LoaderTypes.track} size="30px" id="enabled-track" />
<Loader type={LoaderTypes.track} size="30px" id="disabled-track" isDisabled />\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: "40px",
    alignItems: "center",
    "--loader-stroke": "#7c3aed",
    "--loader-size": "50px",
    "--loader-track-base": "#0f766e",
    "--loader-track-primary": "#b45309",
    "--loader-opacity-disabled": "0.25"
  } as CSSProperties}>
      <Loader type={LoaderTypes.oval} label="Custom loader" />
      <Loader type={LoaderTypes.track} id="css-track" label="Custom track" />
      <Loader type={LoaderTypes.track} id="css-track-primary" primary label="Custom primary track" />
      <Loader type={LoaderTypes.track} id="css-track-disabled" isDisabled label="Custom disabled track" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

The example shows, from left to right: an oval for \\\`--loader-stroke\\\` and \\\`--loader-size\\\`, which every instance picks up; a track for \\\`--loader-track-base\\\`; a track with \\\`primary\\\` for \\\`--loader-track-primary\\\`; and a track with \\\`isDisabled\\\` for \\\`--loader-opacity-disabled\\\`.\`
      },
      source: {
        code: \`<div style={{
  "--loader-stroke": "#7c3aed",
  "--loader-size": "50px",
  "--loader-track-base": "#0f766e",
  "--loader-track-primary": "#b45309",
  "--loader-opacity-disabled": "0.25",
}}>
  <Loader type={LoaderTypes.oval} />
  <Loader type={LoaderTypes.track} id="css-track" />
  <Loader type={LoaderTypes.track} id="css-track-primary" primary />
  <Loader type={LoaderTypes.track} id="css-track-disabled" isDisabled />
</div>\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}}})))()}O();export{v as AllTypes,E as CssCustomization,b as CustomColors,f as Default,S as DifferentSizes,T as DisabledState,m as DualRing,C as OnPrimaryButton,p as Oval,h as Rombs,g as Track,D as __namedExportsOrder,l as default};