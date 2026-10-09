import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./slider-avEbx71c.js";var a,o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{a=t(),r(),o=n(),s={title:`UI/Form controls/Slider`,component:i,parameters:{},argTypes:{min:{control:`number`,description:`Minimum range value`},max:{control:`number`,description:`Maximum range value`},step:{control:`number`,description:`Increment/decrement step size`,table:{defaultValue:{summary:`1`}}},value:{control:`number`,description:`Current slider value`},isDisabled:{control:`boolean`,description:`Greys the handle and the filled part of the track, blocks dragging and arrow keys, and takes the slider out of the tab order`,table:{defaultValue:{summary:`false`}}},withPouring:{control:`boolean`,description:`Shows the filled portion of the track`,table:{defaultValue:{summary:`false`}}},thumbWidth:{control:`text`,description:`Width of the input thumb`,table:{defaultValue:{summary:`24px`}}},thumbHeight:{control:`text`,description:`Height of the input thumb`,table:{defaultValue:{summary:`24px`}}},thumbBorderWidth:{control:`text`,description:`Border width of the input thumb`,table:{defaultValue:{summary:`6px`}}},runnableTrackHeight:{control:`text`,description:`Height of the runnable track the thumb slides along`,table:{defaultValue:{summary:`8px`}}},onChange:{action:`onChange`,description:"Called on every move of the handle with the input's change event, whose `target.value` is a string; the handle cannot move without it"},id:{control:`text`,description:"`id` of the input, for a `<label for>` that gives the slider its name"},className:{control:`text`,description:`Extra class names added to the input`},style:{control:`object`,description:`Inline styles applied to the input`},dataTestId:{control:`text`,description:"`data-testid` of the input",table:{defaultValue:{summary:`slider`}}}}},c=e=>{let{value:t,onChange:n}=e,[r,s]=(0,a.useState)(t??50);(0,a.useEffect)(()=>s(t??50),[t]);let c=e=>{let t=Number.parseFloat(e.target.value);s(t),n?.(e)};return(0,o.jsx)(i,{...e,value:r,onChange:c})},l={render:e=>(0,o.jsx)(c,{...e}),args:{min:0,max:100,step:1,value:50,isDisabled:!1,withPouring:!0},parameters:{docs:{description:{story:"A 0–100 slider with the track filled up to the handle (`withPouring`), the usual choice for a setting such as volume or zoom; drag the handle or change any other prop live in the Controls panel below."},source:{code:`<Slider min={0} max={100} value={50} withPouring onChange={handleChange} />`}}}},u={render:e=>(0,o.jsx)(c,{...e}),args:{min:0,max:100,step:1,value:50,isDisabled:!0,withPouring:!0},parameters:{docs:{description:{story:"For a setting that cannot be changed right now: the handle and the filled part of the track turn paler, the unfilled track stays as it is, and the handle no longer moves by mouse or keyboard (`isDisabled`)."},source:{code:`<Slider min={0} max={100} value={50} withPouring isDisabled />`}}}},d={render:e=>(0,o.jsx)(c,{...e}),args:{min:0,max:10,step:5,value:5,isDisabled:!1,withPouring:!0},parameters:{docs:{description:{story:`Slider with a custom step size of 5, allowing values of 0, 5, and 10 only.`},source:{code:`<Slider min={0} max={10} step={5} value={5} withPouring onChange={handleChange} />`}}}},f={render:e=>(0,o.jsx)(c,{...e}),args:{min:0,max:100,step:1,value:50,isDisabled:!1,withPouring:!1},parameters:{docs:{description:{story:`Slider without the pouring (filled track) effect. The track remains a single color.`},source:{code:`<Slider min={0} max={100} value={50} withPouring={false} onChange={handleChange} />`}}}},p=e=>(0,o.jsx)(`div`,{style:{width:`300px`,padding:`20px`},children:(0,o.jsx)(c,{...e})}),m={render:e=>(0,o.jsx)(p,{...e}),args:{min:0,max:100,step:1,value:50,isDisabled:!1,withPouring:!0,thumbWidth:`32px`,thumbHeight:`32px`,thumbBorderWidth:`8px`,runnableTrackHeight:`14px`},parameters:{docs:{description:{story:`Slider with larger custom thumb and track dimensions for improved touch targets.`},source:{code:`<Slider
  min={0} max={100} value={50} withPouring
  thumbWidth="32px"
  thumbHeight="32px"
  thumbBorderWidth="8px"
  runnableTrackHeight="14px"
/>`}}}},h={render:e=>(0,o.jsx)(`div`,{dir:`rtl`,style:{width:`300px`,padding:`20px`},children:(0,o.jsx)(c,{...e})}),args:{min:0,max:100,step:1,value:50,isDisabled:!1,withPouring:!0},globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`122px`},description:{story:`In a right-to-left interface the minimum sits at the right edge: the fill starts there and grows to the left as the handle is dragged left.`},source:{code:`<div dir="rtl">
  <Slider min={0} max={100} value={50} withPouring onChange={handleChange} />
</div>`}}}},g={render:()=>{let[e,t]=(0,a.useState)(60);return(0,o.jsxs)(`div`,{style:{width:`300px`,padding:`20px`,"--slider-handle-color":`#7c3aed`,"--slider-pouring-image":`linear-gradient(#7c3aed, #7c3aed)`,"--slider-background-color":`#ede9fe`,"--slider-size":`12px`,"--slider-handle-size":`28px`,"--slider-track-radius":`6px`},children:[(0,o.jsx)(i,{min:0,max:100,value:e,withPouring:!0,onChange:e=>t(Number(e.target.value))}),(0,o.jsx)(i,{min:0,max:100,value:40,withPouring:!0,isDisabled:!0})]})},parameters:{docs:{description:{story:`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

The first slider shows every variable. The second is disabled, to show that the theme does not swap in its own colors there: it mixes the disabled thumb and fill from \`--slider-handle-color\`, so a custom accent survives as a paler version of itself.`},source:{code:`<div
  style={{
    "--slider-handle-color": "#7c3aed",
    "--slider-pouring-image": "linear-gradient(#7c3aed, #7c3aed)",
    "--slider-background-color": "#ede9fe",
    "--slider-size": "12px",
    "--slider-handle-size": "28px",
    "--slider-track-radius": "6px",
  }}
>
  <Slider min={0} max={100} value={value} withPouring onChange={handleChange} />
  <Slider min={0} max={100} value={40} withPouring isDisabled />
</div>`}}}},_=[`Default`,`DisabledState`,`WithCustomSteps`,`WithoutPouring`,`WithCustomSize`,`RightToLeft`,`CssCustomization`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <SliderWithState {...args} />,
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    isDisabled: false,
    withPouring: true
  },
  parameters: {
    docs: {
      description: {
        story: "A 0–100 slider with the track filled up to the handle (\`withPouring\`), the usual choice for a setting such as volume or zoom; drag the handle or change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Slider min={0} max={100} value={50} withPouring onChange={handleChange} />\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <SliderWithState {...args} />,
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    isDisabled: true,
    withPouring: true
  },
  parameters: {
    docs: {
      description: {
        story: "For a setting that cannot be changed right now: the handle and the filled part of the track turn paler, the unfilled track stays as it is, and the handle no longer moves by mouse or keyboard (\`isDisabled\`)."
      },
      source: {
        code: \`<Slider min={0} max={100} value={50} withPouring isDisabled />\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <SliderWithState {...args} />,
  args: {
    min: 0,
    max: 10,
    step: 5,
    value: 5,
    isDisabled: false,
    withPouring: true
  },
  parameters: {
    docs: {
      description: {
        story: "Slider with a custom step size of 5, allowing values of 0, 5, and 10 only."
      },
      source: {
        code: \`<Slider min={0} max={10} step={5} value={5} withPouring onChange={handleChange} />\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <SliderWithState {...args} />,
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    isDisabled: false,
    withPouring: false
  },
  parameters: {
    docs: {
      description: {
        story: "Slider without the pouring (filled track) effect. The track remains a single color."
      },
      source: {
        code: \`<Slider min={0} max={100} value={50} withPouring={false} onChange={handleChange} />\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <CustomSizeTemplate {...args} />,
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    isDisabled: false,
    withPouring: true,
    thumbWidth: "32px",
    thumbHeight: "32px",
    thumbBorderWidth: "8px",
    runnableTrackHeight: "14px"
  },
  parameters: {
    docs: {
      description: {
        story: "Slider with larger custom thumb and track dimensions for improved touch targets."
      },
      source: {
        code: \`<Slider
  min={0} max={100} value={50} withPouring
  thumbWidth="32px"
  thumbHeight="32px"
  thumbBorderWidth="8px"
  runnableTrackHeight="14px"
/>\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl" style={{
    width: "300px",
    padding: "20px"
  }}>
      <SliderWithState {...args} />
    </div>,
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    isDisabled: false,
    withPouring: true
  },
  globals: {
    direction: "rtl"
  },
  parameters: {
    noPadding: true,
    docs: {
      story: {
        inline: false,
        height: "122px"
      },
      description: {
        story: "In a right-to-left interface the minimum sits at the right edge: the fill starts there and grows to the left as the handle is dragged left."
      },
      source: {
        code: \`<div dir="rtl">
  <Slider min={0} max={100} value={50} withPouring onChange={handleChange} />
</div>\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState(60);
    return <div style={{
      width: "300px",
      padding: "20px",
      "--slider-handle-color": "#7c3aed",
      "--slider-pouring-image": "linear-gradient(#7c3aed, #7c3aed)",
      "--slider-background-color": "#ede9fe",
      "--slider-size": "12px",
      "--slider-handle-size": "28px",
      "--slider-track-radius": "6px"
    } as CSSProperties}>
        <Slider min={0} max={100} value={value} withPouring onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(Number(e.target.value))} />
        <Slider min={0} max={100} value={40} withPouring isDisabled />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

The first slider shows every variable. The second is disabled, to show that the theme does not swap in its own colors there: it mixes the disabled thumb and fill from \\\`--slider-handle-color\\\`, so a custom accent survives as a paler version of itself.\`
      },
      source: {
        code: \`<div
  style={{
    "--slider-handle-color": "#7c3aed",
    "--slider-pouring-image": "linear-gradient(#7c3aed, #7c3aed)",
    "--slider-background-color": "#ede9fe",
    "--slider-size": "12px",
    "--slider-handle-size": "28px",
    "--slider-track-radius": "6px",
  }}
>
  <Slider min={0} max={100} value={value} withPouring onChange={handleChange} />
  <Slider min={0} max={100} value={40} withPouring isDisabled />
</div>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}}})))()}v();export{g as CssCustomization,l as Default,u as DisabledState,h as RightToLeft,m as WithCustomSize,d as WithCustomSteps,f as WithoutPouring,_ as __namedExportsOrder,s as default};