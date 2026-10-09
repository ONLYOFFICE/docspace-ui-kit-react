import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{c as n,s as r}from"./dateArithmetic-Bwpb7u1g.js";import{n as i,t as a}from"./time-picker-D4XJiXUo.js";var o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{n(),i(),o=t(),s={title:`UI/Form controls/TimePicker`,component:a,parameters:{},argTypes:{initialTime:{control:!1,description:"Time shown when the picker mounts, as an ISO string, a `Date` or a Luxon `DateTime`; read once, later changes are ignored; defaults to 00:00 of the current day",table:{defaultValue:{summary:`00:00 of the current day`}}},hasError:{control:`boolean`,description:`Whether the border is drawn in the error colour; it stays while a field is focused`,table:{defaultValue:{summary:`false`}}},tabIndex:{control:`number`,description:`Position of both fields in the Tab order; left out, they take their natural place in it`},focusOnRender:{control:`boolean`,description:`Whether the hours field is focused, with its text selected, when the picker mounts`,table:{defaultValue:{summary:`false`}}},isTwelveHourFormat:{control:`boolean`,description:"Caps the hours field at 12 instead of 23; `meridiem` is required with it and decides the half of the day",table:{defaultValue:{summary:`false`}}},meridiem:{control:`text`,description:'"AM" or "PM", required with `isTwelveHourFormat`: combined with the typed hours to compute the time passed to `onChange`; never displayed'},className:{control:`text`,description:`Additional CSS class for the time picker container`},classNameInput:{control:`text`,description:"Prefix for the two inner fields' class names: they become `<prefix>-hours-input` and `<prefix>-minutes-input`"},onChange:{action:`onChange`,description:"Called on every accepted keystroke with a full `DateTime`: the date from `initialTime` combined with the typed time"},onBlur:{action:`onBlur`,description:`Called when typing completes the minutes field: after two digits, a single digit above 5, a third digit or a value above 59; leaving the field with the mouse or Tab does not call it`},forwardedRef:{control:!1,description:`Ref to the outer box, a <div>`},testId:{control:!1,description:`data-testid on the outer box`,table:{defaultValue:{summary:`time-picker`}}}}},c=e=>(0,o.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(180px, 1fr))`,gridGap:`16px`,alignItems:`center`},children:e.children}),l={render:e=>(0,o.jsx)(a,{...e}),args:{initialTime:r(2025,1,27,10,30,0),hasError:!1,focusOnRender:!1},parameters:{docs:{description:{story:"A 24-hour picker preset to 10:30 (`initialTime`); type `9` in the hours field and watch it become `09` and jump to minutes; change any other prop live in the Controls panel below."},source:{code:`<TimePicker
  initialTime={createDateTime(2025, 1, 27, 10, 30, 0)}
  onChange={(time) => console.log(time)}
/>`}}}},u=e=>(0,o.jsx)(c,{children:(0,o.jsx)(a,{...e})}),d={render:e=>(0,o.jsx)(u,{...e}),args:{initialTime:r(2025,1,27,10,30,0),hasError:!0},parameters:{docs:{description:{story:"The border turns red to flag a time the form rejected (`hasError`); the fields stay editable so it can be corrected in place."},source:{code:`<TimePicker initialTime={createDateTime(2025, 1, 27, 10, 30, 0)} hasError onChange={(time) => console.log(time)} />`}}}},f=({onChange:e})=>(0,o.jsxs)(c,{children:[(0,o.jsx)(a,{initialTime:r(2025,1,27,10,30,0),isTwelveHourFormat:!0,meridiem:`AM`,onChange:e}),(0,o.jsx)(a,{initialTime:r(2025,1,27,14,30,0),isTwelveHourFormat:!0,meridiem:`PM`,onChange:e})]}),p={render:e=>(0,o.jsx)(f,{onChange:e.onChange}),parameters:{docs:{description:{story:"Hours stop at 12 (`isTwelveHourFormat`); nothing on screen tells AM from PM, only the `meridiem` behind each box decides what `onChange` receives: the first reports 10:30, the second, showing 02:30, reports 14:30."},source:{code:`<TimePicker initialTime={time} isTwelveHourFormat meridiem="AM" onChange={(time) => console.log(time)} />
<TimePicker initialTime={time} isTwelveHourFormat meridiem="PM" onChange={(time) => console.log(time)} />`}}}},m={render:e=>(0,o.jsx)(u,{...e}),args:{initialTime:r(2025,1,27,10,30,0),focusOnRender:!0},parameters:{docs:{description:{story:"The picker opens with the hours field selected (`focusOnRender`), so a form that asks for a time first takes the digits without a click; type `14` and the caret moves on to minutes."},source:{code:`<TimePicker initialTime={time} focusOnRender onChange={(time) => console.log(time)} />`}}}},h=()=>(0,o.jsx)(`div`,{style:{"--time-input-border":`#0082c9`,"--time-input-bg":`#f0f8ff`,"--time-input-focus-border":`#004f82`,"--time-input-error-border":`#c0392b`,"--time-input-radius":`8px`,"--time-input-height":`36px`,"--time-input-width":`68px`,"--time-input-padding":`0px 10px`,"--text-input-color":`#004f82`,"--text-input-bg":`#f0f8ff`},children:(0,o.jsxs)(`div`,{style:{display:`flex`,gap:`16px`,alignItems:`center`},children:[(0,o.jsx)(a,{initialTime:r(2025,1,27,10,30,0),onChange:()=>{}}),(0,o.jsx)(a,{initialTime:r(2025,1,27,10,30,0),hasError:!0,onChange:()=>{}})]})}),g={render:()=>(0,o.jsx)(h,{}),parameters:{docs:{description:{story:"The TimePicker and inner TextInput variables set on one wrapper -- the variables are listed under CSS variables on this page. The first box shows the border, background, size and radius variables and the inner fields' text colour; click into it to see `--time-input-focus-border`. The second adds `hasError`, the only state in which `--time-input-error-border` has anything to colour. `--text-input-bg` is set to the same value as `--time-input-bg` so the fields blend into the box."},source:{code:`<div
  style={{
    "--time-input-border": "#0082c9",
    "--time-input-bg": "#f0f8ff",
    "--time-input-focus-border": "#004f82",
    "--time-input-error-border": "#c0392b",
    "--time-input-radius": "8px",
    "--time-input-height": "36px",
    "--time-input-width": "68px",
    "--time-input-padding": "0px 10px",
    "--text-input-color": "#004f82",
    "--text-input-bg": "#f0f8ff",
  }}
>
  <TimePicker initialTime={time} />
  <TimePicker initialTime={time} hasError />
</div>`}}}},_=[`Default`,`WithError`,`TwelveHourFormat`,`FocusOnRender`,`CssCustomization`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <TimePicker {...args} />,
  args: {
    initialTime: createDateTime(2025, 1, 27, 10, 30, 0),
    hasError: false,
    focusOnRender: false
  },
  parameters: {
    docs: {
      description: {
        story: "A 24-hour picker preset to 10:30 (\`initialTime\`); type \`9\` in the hours field and watch it become \`09\` and jump to minutes; change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<TimePicker
  initialTime={createDateTime(2025, 1, 27, 10, 30, 0)}
  onChange={(time) => console.log(time)}
/>\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <WrappedTemplate {...args} />,
  args: {
    initialTime: createDateTime(2025, 1, 27, 10, 30, 0),
    hasError: true
  },
  parameters: {
    docs: {
      description: {
        story: "The border turns red to flag a time the form rejected (\`hasError\`); the fields stay editable so it can be corrected in place."
      },
      source: {
        code: \`<TimePicker initialTime={createDateTime(2025, 1, 27, 10, 30, 0)} hasError onChange={(time) => console.log(time)} />\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <TwelveHourFormatTemplate onChange={args.onChange} />,
  parameters: {
    docs: {
      description: {
        story: "Hours stop at 12 (\`isTwelveHourFormat\`); nothing on screen tells AM from PM, only the \`meridiem\` behind each box decides what \`onChange\` receives: the first reports 10:30, the second, showing 02:30, reports 14:30."
      },
      source: {
        code: \`<TimePicker initialTime={time} isTwelveHourFormat meridiem="AM" onChange={(time) => console.log(time)} />
<TimePicker initialTime={time} isTwelveHourFormat meridiem="PM" onChange={(time) => console.log(time)} />\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <WrappedTemplate {...args} />,
  args: {
    initialTime: createDateTime(2025, 1, 27, 10, 30, 0),
    focusOnRender: true
  },
  parameters: {
    docs: {
      description: {
        story: "The picker opens with the hours field selected (\`focusOnRender\`), so a form that asks for a time first takes the digits without a click; type \`14\` and the caret moves on to minutes."
      },
      source: {
        code: \`<TimePicker initialTime={time} focusOnRender onChange={(time) => console.log(time)} />\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`The TimePicker and inner TextInput variables set on one wrapper -- the variables are listed under CSS variables on this page. The first box shows the border, background, size and radius variables and the inner fields' text colour; click into it to see \\\`--time-input-focus-border\\\`. The second adds \\\`hasError\\\`, the only state in which \\\`--time-input-error-border\\\` has anything to colour. \\\`--text-input-bg\\\` is set to the same value as \\\`--time-input-bg\\\` so the fields blend into the box.\`
      },
      source: {
        code: \`<div
  style={{
    "--time-input-border": "#0082c9",
    "--time-input-bg": "#f0f8ff",
    "--time-input-focus-border": "#004f82",
    "--time-input-error-border": "#c0392b",
    "--time-input-radius": "8px",
    "--time-input-height": "36px",
    "--time-input-width": "68px",
    "--time-input-padding": "0px 10px",
    "--text-input-color": "#004f82",
    "--text-input-bg": "#f0f8ff",
  }}
>
  <TimePicker initialTime={time} />
  <TimePicker initialTime={time} hasError />
</div>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}}})))()}v();export{g as CssCustomization,l as Default,m as FocusOnRender,p as TwelveHourFormat,d as WithError,_ as __namedExportsOrder,s as default};