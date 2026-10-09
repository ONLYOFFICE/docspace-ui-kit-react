import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./toggle-button-CG0Cg1bK.js";var a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{a=t(),r(),o=n(),s={title:`UI/Form controls/ToggleButton`,component:i,parameters:{},argTypes:{isChecked:{control:`boolean`,description:"Whether the switch is on; the control is fully controlled, so without `onChange` updating it the switch never moves",table:{defaultValue:{summary:`false`}}},isDisabled:{control:`boolean`,description:`Disables the input, dims the switch and the label, and ignores clicks`,table:{defaultValue:{summary:`false`}}},isLoading:{control:`boolean`,description:"Pulses the knob to show work in progress; it does not disable the control, so a click still reaches `onChange`",table:{defaultValue:{summary:`false`}}},label:{control:`text`,description:`Text beside the switch; without it the component is the 28 by 16 pixel switch alone`},noAnimation:{control:`boolean`,description:`Moves the knob to its new end instantly instead of sliding it; the loading pulse still animates`,table:{defaultValue:{summary:`false`}}},fontSize:{control:`text`,description:"Font size of the label text, such as `15px`"},fontWeight:{control:`text`,description:"Font weight of the label text, such as `600`"},onChange:{action:`onChange`,description:"Called with the checkbox's change event when the switch is clicked; the new state is `event.target.checked`"},name:{control:`text`,description:`Name of the hidden checkbox input, for a form that reads the control by name`},id:{control:`text`,description:"Id put on the outer element and on the inner `<label>`, so it appears twice in the document"},className:{control:`text`,description:"Class name added to the outer element and to the inner `<label>`"},style:{control:`object`,description:"Inline style of the outer element and of the inner `<label>`, so a margin or a padding takes effect at both levels"},dataTestId:{control:`text`,description:"Value of `data-testid` on the outer element",table:{defaultValue:{summary:`toggle-button`}}},dataTooltipId:{control:`text`,description:"Value of `data-tooltip-id` on the outer element, which a `Tooltip` with the same id uses to open over the control"}}},c=e=>(0,o.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(220px, 1fr))`,gridGap:`16px`,alignItems:`center`},children:e.children}),l=({isChecked:e,onChange:t,...n})=>{let[r,s]=(0,a.useState)(e);(0,a.useEffect)(()=>{s(e)},[e]);let c=e=>{s(e.target.checked),t?.(e)};return(0,o.jsx)(i,{...n,isChecked:r,onChange:c})},u={render:e=>(0,o.jsx)(l,{...e}),args:{label:`Toggle me`,isChecked:!1},parameters:{docs:{description:{story:`A single switch with a label, for one setting that takes effect at once; click it to turn it on, and change any other prop live in the Controls panel below.`},source:{code:`<ToggleButton label="Toggle me" isChecked={isOn} onChange={handleChange} />`}}}},d=()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(l,{label:`Unchecked`}),(0,o.jsx)(l,{label:`Checked`,isChecked:!0}),(0,o.jsx)(l,{})]}),f={render:()=>(0,o.jsx)(d,{}),parameters:{docs:{description:{story:`The two positions side by side, so the track colours can be compared; each switch here can be clicked.

- **Unchecked** — grey track, knob at the start
- **Checked** — accent-coloured track, knob at the end (\`isChecked\`)
- The third switch has no \`label\` and takes only the width of the track`},source:{code:`<ToggleButton label="Unchecked" isChecked={false} onChange={handleChange} />
<ToggleButton label="Checked" isChecked onChange={handleChange} />
<ToggleButton isChecked={false} onChange={handleChange} />`}}}},p=()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(l,{label:`Disabled off`,isDisabled:!0}),(0,o.jsx)(l,{label:`Disabled on`,isDisabled:!0,isChecked:!0})]}),m={render:()=>(0,o.jsx)(p,{}),parameters:{docs:{description:{story:`A setting that cannot be changed right now, shown in both positions so the reader still sees its value (\`isDisabled\`):

- **Disabled off** — faded grey track, greyed label
- **Disabled on** — faded accent track, greyed label; neither responds to a click`},source:{code:`<ToggleButton label="Disabled off" isDisabled />
<ToggleButton label="Disabled on" isDisabled isChecked />`}}}},h=()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(l,{label:`Loading unchecked`,isLoading:!0}),(0,o.jsx)(l,{label:`Loading checked`,isLoading:!0,isChecked:!0})]}),g={render:()=>(0,o.jsx)(h,{}),parameters:{docs:{description:{story:`A setting whose change is still being saved: the knob pulses until the work is done (\`isLoading\`). The switch still takes clicks, so the caller decides whether to ignore them.

- **Loading unchecked** — the knob pulses at the start of the grey track
- **Loading checked** — the knob pulses at the end of the accent track`},source:{code:`<ToggleButton label="Loading unchecked" isChecked={false} isLoading onChange={handleChange} />
<ToggleButton label="Loading checked" isChecked isLoading onChange={handleChange} />`}}}},_=()=>(0,o.jsxs)(c,{children:[(0,o.jsx)(l,{label:`No animation off`,noAnimation:!0}),(0,o.jsx)(l,{label:`No animation on`,noAnimation:!0,isChecked:!0})]}),v={render:()=>(0,o.jsx)(_,{}),parameters:{docs:{description:{story:"For a list of many switches or a reduced-motion setting: click either switch and the knob jumps to the other end instead of sliding there (`noAnimation`)."},source:{code:`<ToggleButton label="No animation off" isChecked={false} noAnimation onChange={handleChange} />
<ToggleButton label="No animation on" isChecked noAnimation onChange={handleChange} />`}}}},y={render:()=>(0,o.jsx)(`div`,{dir:`rtl`,children:(0,o.jsxs)(c,{children:[(0,o.jsx)(l,{label:`تفعيل`}),(0,o.jsx)(l,{label:`تفعيل`,isChecked:!0})]})}),globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`44px`},description:{story:"The same switches in a right-to-left interface: the label moves to the left of the switch, and the track is mirrored, so the knob of the off switch sits at the right end and the knob of the on switch at the left. The wrapper carries `dir=\"rtl\"` for the label's side; the mirrored track comes from the theme's `interfaceDirection` (the Direction toolbar)."},source:{code:`<div dir="rtl">
  <ToggleButton label="تفعيل" isChecked={false} onChange={handleChange} />
  <ToggleButton label="تفعيل" isChecked onChange={handleChange} />
</div>`}}}},b={render:()=>(0,o.jsx)(`div`,{style:{"--toggle-button-spacing":`16px`,"--toggle-button-checked-color":`#00679e`,"--toggle-button-off-color":`#7d7d7d`,"--toggle-button-off-hover-color":`#3d3d3d`},children:(0,o.jsxs)(c,{children:[(0,o.jsx)(l,{label:`Off`}),(0,o.jsx)(l,{label:`On`,isChecked:!0})]})}),parameters:{docs:{description:{story:"Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.\n\n- **Off** is there for `--toggle-button-off-color`; hover it to see `--toggle-button-off-hover-color`\n- **On** is there for `--toggle-button-checked-color`\n- Both labels sit 16px from their switch (`--toggle-button-spacing`)"},source:{code:`<div style={{
  "--toggle-button-spacing": "16px",
  "--toggle-button-checked-color": "#00679e",
  "--toggle-button-off-color": "#7d7d7d",
  "--toggle-button-off-hover-color": "#3d3d3d",
}}>
  <ToggleButton label="Off" isChecked={false} onChange={handleChange} />
  <ToggleButton label="On" isChecked onChange={handleChange} />
</div>`}}}},x=[`Default`,`CheckedStates`,`DisabledStates`,`LoadingState`,`WithoutAnimation`,`RightToLeft`,`CssCustomization`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    label: "Toggle me",
    isChecked: false
  },
  parameters: {
    docs: {
      description: {
        story: "A single switch with a label, for one setting that takes effect at once; click it to turn it on, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<ToggleButton label="Toggle me" isChecked={isOn} onChange={handleChange} />\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`The two positions side by side, so the track colours can be compared; each switch here can be clicked.

- **Unchecked** — grey track, knob at the start
- **Checked** — accent-coloured track, knob at the end (\\\`isChecked\\\`)
- The third switch has no \\\`label\\\` and takes only the width of the track\`
      },
      source: {
        code: \`<ToggleButton label="Unchecked" isChecked={false} onChange={handleChange} />
<ToggleButton label="Checked" isChecked onChange={handleChange} />
<ToggleButton isChecked={false} onChange={handleChange} />\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`A setting that cannot be changed right now, shown in both positions so the reader still sees its value (\\\`isDisabled\\\`):

- **Disabled off** — faded grey track, greyed label
- **Disabled on** — faded accent track, greyed label; neither responds to a click\`
      },
      source: {
        code: \`<ToggleButton label="Disabled off" isDisabled />
<ToggleButton label="Disabled on" isDisabled isChecked />\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <LoadingTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`A setting whose change is still being saved: the knob pulses until the work is done (\\\`isLoading\\\`). The switch still takes clicks, so the caller decides whether to ignore them.

- **Loading unchecked** — the knob pulses at the start of the grey track
- **Loading checked** — the knob pulses at the end of the accent track\`
      },
      source: {
        code: \`<ToggleButton label="Loading unchecked" isChecked={false} isLoading onChange={handleChange} />
<ToggleButton label="Loading checked" isChecked isLoading onChange={handleChange} />\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <NoAnimationTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a list of many switches or a reduced-motion setting: click either switch and the knob jumps to the other end instead of sliding there (\`noAnimation\`)."
      },
      source: {
        code: \`<ToggleButton label="No animation off" isChecked={false} noAnimation onChange={handleChange} />
<ToggleButton label="No animation on" isChecked noAnimation onChange={handleChange} />\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl">
      <Wrapper>
        <Template label="تفعيل" />
        <Template label="تفعيل" isChecked />
      </Wrapper>
    </div>,
  globals: {
    direction: "rtl"
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: {
        inline: false,
        height: "44px"
      },
      description: {
        story: \`The same switches in a right-to-left interface: the label moves to the left of the switch, and the track is mirrored, so the knob of the off switch sits at the right end and the knob of the on switch at the left. The wrapper carries \\\`dir="rtl"\\\` for the label's side; the mirrored track comes from the theme's \\\`interfaceDirection\\\` (the Direction toolbar).\`
      },
      source: {
        code: \`<div dir="rtl">
  <ToggleButton label="تفعيل" isChecked={false} onChange={handleChange} />
  <ToggleButton label="تفعيل" isChecked onChange={handleChange} />
</div>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--toggle-button-spacing": "16px",
    "--toggle-button-checked-color": "#00679e",
    "--toggle-button-off-color": "#7d7d7d",
    "--toggle-button-off-hover-color": "#3d3d3d"
  } as CSSProperties}>
      <Wrapper>
        <Template label="Off" />
        <Template label="On" isChecked />
      </Wrapper>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

- **Off** is there for \\\`--toggle-button-off-color\\\`; hover it to see \\\`--toggle-button-off-hover-color\\\`
- **On** is there for \\\`--toggle-button-checked-color\\\`
- Both labels sit 16px from their switch (\\\`--toggle-button-spacing\\\`)\`
      },
      source: {
        code: \`<div style={{
  "--toggle-button-spacing": "16px",
  "--toggle-button-checked-color": "#00679e",
  "--toggle-button-off-color": "#7d7d7d",
  "--toggle-button-off-hover-color": "#3d3d3d",
}}>
  <ToggleButton label="Off" isChecked={false} onChange={handleChange} />
  <ToggleButton label="On" isChecked onChange={handleChange} />
</div>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}}})))()}S();export{f as CheckedStates,b as CssCustomization,u as Default,m as DisabledStates,g as LoadingState,y as RightToLeft,v as WithoutAnimation,x as __namedExportsOrder,s as default};