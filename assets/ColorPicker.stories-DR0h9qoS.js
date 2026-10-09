import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./globalColors-fkBUxSeV.js";import{n as a,t as o}from"./ColorPicker-CemxeI36.js";var s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{s=t(),r(),a(),c=n(),l={title:`UI/Form controls/ColorPicker`,component:o,parameters:{},argTypes:{appliedColor:{control:`color`,description:`Hex color the picker starts on. It is read once, on mount, so a later change does not move the pointers`,table:{defaultValue:{summary:`globalColors.lightBlueMain`}}},isPickerOnly:{control:`boolean`,description:`Draws a "Custom" title and a closing cross above the picker and drops the hex field and both buttons`,table:{defaultValue:{summary:`false`}}},applyButtonLabel:{control:`text`,description:`Label for the apply button`,table:{defaultValue:{summary:`Apply`}}},cancelButtonLabel:{control:`text`,description:`Label for the cancel button`,table:{defaultValue:{summary:`Cancel`}}},hexCodeLabel:{control:`text`,description:`Label for the hex code input field`,table:{defaultValue:{summary:`Hex code`}}},onApply:{description:`Called with the chosen hex color when the apply button is clicked`},onClose:{description:`Called by the cancel button, and by the closing cross in picker-only mode; the picker does not hide itself`},handleChange:{description:`Called with the hex color on every pointer move and every valid hex code typed`},className:{control:`text`,description:`Class name added to the outermost element`},id:{control:`text`,description:`Id of the outermost element`}}},u={render:e=>(0,c.jsx)(o,{...e}),args:{isPickerOnly:!1,appliedColor:i.lightBlueMain,applyButtonLabel:`Apply`,cancelButtonLabel:`Cancel`,hexCodeLabel:`Hex code`,onClose:()=>console.log(`Close clicked`),onApply:e=>console.log(`Apply clicked with color:`,e),handleChange:e=>console.log(`Color changed to:`,e)},parameters:{docs:{description:{story:`The full picker a settings form shows: drag either pointer or type a hex code, then apply or cancel. Change any other prop live in the Controls panel below.`},source:{code:`<ColorPicker
  isPickerOnly={false}
  appliedColor="#4781D1"
  onApply={(color) => console.log("Applied:", color)}
  onClose={() => console.log("Cancelled")}
/>`}}}},d=()=>(0,c.jsx)(o,{isPickerOnly:!0,appliedColor:i.lightBlueMain,handleChange:e=>console.log(`Color changed:`,e)}),f={render:()=>(0,c.jsx)(d,{}),parameters:{docs:{description:{story:'The compact shape for a drop-down: a "Custom" title and a closing cross above the square and the strip, with no hex field and no buttons (`isPickerOnly`). The caller reads the color from `handleChange` and hides the picker from `onClose`.'},source:{code:`<ColorPicker isPickerOnly appliedColor="#4781D1" />`}}}},p=()=>(0,c.jsx)(o,{isPickerOnly:!1,appliedColor:i.lightBlueMain,applyButtonLabel:`Save Color`,cancelButtonLabel:`Discard`,hexCodeLabel:`Color Code`,onApply:e=>console.log(`Saved:`,e),onClose:()=>console.log(`Discarded`)}),m={render:()=>(0,c.jsx)(p,{}),parameters:{docs:{description:{story:"The component translates none of its texts, so a caller passes its own for the buttons and the hex caption (`applyButtonLabel`, `cancelButtonLabel`, `hexCodeLabel`)."},source:{code:`<ColorPicker
  isPickerOnly={false}
  appliedColor="#4781D1"
  applyButtonLabel="Save Color"
  cancelButtonLabel="Discard"
  hexCodeLabel="Color Code"
/>`}}}},h=()=>{let[e,t]=(0,s.useState)(i.lightBlueMain);return(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`16px`},children:[(0,c.jsx)(o,{isPickerOnly:!1,appliedColor:i.lightBlueMain,handleChange:e=>t(e),onApply:e=>{t(e),console.log(`Applied color:`,e)},onClose:()=>console.log(`Closed`)}),(0,c.jsxs)(`p`,{style:{margin:0,fontSize:`12px`},children:[`Current color: `,(0,c.jsx)(`strong`,{children:e})]})]})},g={render:()=>(0,c.jsx)(h,{}),parameters:{docs:{description:{story:"Drag a pointer or type a hex code and watch the line under the picker follow: the caller keeps its own copy of the color from every change (`handleChange`), which is how it previews a color before it is applied. The picker keeps its own state, so the caller cannot move the pointers by changing `appliedColor` afterwards."},source:{code:`const [color, setColor] = useState("#4781D1");

<ColorPicker
  isPickerOnly={false}
  appliedColor="#4781D1"
  handleChange={(newColor) => setColor(newColor)}
  onApply={(newColor) => setColor(newColor)}
  onClose={() => console.log("Closed")}
/>`}}}},_=()=>(0,c.jsx)(o,{isPickerOnly:!1,appliedColor:`#FF0000`,onApply:e=>console.log(`Applied:`,e),onClose:()=>console.log(`Closed`)}),v={render:()=>(0,c.jsx)(_,{}),parameters:{docs:{description:{story:'A picker that opens on a color the user saved earlier starts from it: here red (`appliedColor="#FF0000"`), with the hex field showing the same code.'},source:{code:`<ColorPicker
  isPickerOnly={false}
  appliedColor="#FF0000"
  onApply={(color) => console.log("Applied:", color)}
  onClose={() => console.log("Closed")}
/>`}}}},y=()=>(0,c.jsx)(`div`,{dir:`rtl`,children:(0,c.jsx)(o,{isPickerOnly:!1,appliedColor:i.lightBlueMain,applyButtonLabel:`تطبيق`,cancelButtonLabel:`إلغاء`,hexCodeLabel:`رمز اللون`,onApply:e=>console.log(`Applied:`,e),onClose:()=>console.log(`Closed`)})}),b={render:()=>(0,c.jsx)(y,{}),globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`418px`},description:{story:'The picker in a right-to-left layout with Arabic texts: the picker moves to the right edge, the hex caption and code align right and the apply button sits to the right of cancel, while the square and the strip keep their left-to-right gradients. The wrapper carries `dir="rtl"`; the direction also comes from the theme\'s `interfaceDirection` (the Direction toolbar).'},source:{code:`<div dir="rtl">
  <ColorPicker
    isPickerOnly={false}
    appliedColor="#4781D1"
    applyButtonLabel="..."
    cancelButtonLabel="..."
    hexCodeLabel="..."
  />
</div>`}}}},x=()=>(0,c.jsx)(`div`,{style:{"--color-picker-width":`240px`,"--color-picker-hue-height":`16px`,"--color-picker-hue-radius":`8px`,"--color-picker-border-style":`1px solid #0082c9`,"--color-picker-bg":`#f0f8ff`,"--color-picker-text-color":`#004f82`,"--color-picker-input-height":`36px`,"--color-picker-input-padding":`6px 12px`,"--color-picker-input-radius":`8px`,"--button-primary-bg":`#0082c9`,"--button-primary-border":`1px solid #0082c9`,"--button-primary-color":`#fff`,"--button-primary-bg-hover":`#006ba6`,"--button-root-bg":`#f0f8ff`,"--button-root-border":`1px solid #0082c9`,"--button-root-color":`#004f82`,"--button-root-bg-hover":`#d6ecf8`,"--button-root-border-radius":`8px`},children:(0,c.jsx)(o,{isPickerOnly:!1,appliedColor:i.lightBlueMain,applyButtonLabel:`Apply`,cancelButtonLabel:`Cancel`,hexCodeLabel:`Hex code`,onApply:()=>{},onClose:()=>{},handleChange:()=>{}})}),S={render:()=>(0,c.jsx)(x,{}),parameters:{docs:{description:{story:`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The button variables reach the apply and cancel pair through the same wrapper; hover either button to see its hover background.`},source:{code:`<div
  style={{
    "--color-picker-width": "240px",
    "--color-picker-border-style": "1px solid #0082c9",
    "--button-primary-bg": "#0082c9",
    "--button-root-border-radius": "8px",
  }}
>
  <ColorPicker isPickerOnly={false} appliedColor="#4781D1" />
</div>`}}}},C=[`Default`,`PickerOnly`,`CustomLabels`,`LiveColorReadout`,`PresetColor`,`RightToLeft`,`CssCustomization`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <ColorPicker {...args} />,
  args: {
    isPickerOnly: false,
    appliedColor: globalColors.lightBlueMain,
    applyButtonLabel: "Apply",
    cancelButtonLabel: "Cancel",
    hexCodeLabel: "Hex code",
    onClose: () => console.log("Close clicked"),
    onApply: color => console.log("Apply clicked with color:", color),
    handleChange: color => console.log("Color changed to:", color)
  },
  parameters: {
    docs: {
      description: {
        story: "The full picker a settings form shows: drag either pointer or type a hex code, then apply or cancel. Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<ColorPicker
  isPickerOnly={false}
  appliedColor="#4781D1"
  onApply={(color) => console.log("Applied:", color)}
  onClose={() => console.log("Cancelled")}
/>\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <PickerOnlyTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'The compact shape for a drop-down: a "Custom" title and a closing cross above the square and the strip, with no hex field and no buttons (\`isPickerOnly\`). The caller reads the color from \`handleChange\` and hides the picker from \`onClose\`.'
      },
      source: {
        code: \`<ColorPicker isPickerOnly appliedColor="#4781D1" />\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <CustomLabelsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The component translates none of its texts, so a caller passes its own for the buttons and the hex caption (\`applyButtonLabel\`, \`cancelButtonLabel\`, \`hexCodeLabel\`)."
      },
      source: {
        code: \`<ColorPicker
  isPickerOnly={false}
  appliedColor="#4781D1"
  applyButtonLabel="Save Color"
  cancelButtonLabel="Discard"
  hexCodeLabel="Color Code"
/>\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <LiveColorReadoutTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Drag a pointer or type a hex code and watch the line under the picker follow: the caller keeps its own copy of the color from every change (\`handleChange\`), which is how it previews a color before it is applied. The picker keeps its own state, so the caller cannot move the pointers by changing \`appliedColor\` afterwards."
      },
      source: {
        code: \`const [color, setColor] = useState("#4781D1");

<ColorPicker
  isPickerOnly={false}
  appliedColor="#4781D1"
  handleChange={(newColor) => setColor(newColor)}
  onApply={(newColor) => setColor(newColor)}
  onClose={() => console.log("Closed")}
/>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <PresetColorTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'A picker that opens on a color the user saved earlier starts from it: here red (\`appliedColor="#FF0000"\`), with the hex field showing the same code.'
      },
      source: {
        code: \`<ColorPicker
  isPickerOnly={false}
  appliedColor="#FF0000"
  onApply={(color) => console.log("Applied:", color)}
  onClose={() => console.log("Closed")}
/>\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <RightToLeftTemplate />,
  globals: {
    direction: "rtl"
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page
      story: {
        inline: false,
        height: "418px"
      },
      description: {
        story: 'The picker in a right-to-left layout with Arabic texts: the picker moves to the right edge, the hex caption and code align right and the apply button sits to the right of cancel, while the square and the strip keep their left-to-right gradients. The wrapper carries \`dir="rtl"\`; the direction also comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar).'
      },
      source: {
        code: \`<div dir="rtl">
  <ColorPicker
    isPickerOnly={false}
    appliedColor="#4781D1"
    applyButtonLabel="..."
    cancelButtonLabel="..."
    hexCodeLabel="..."
  />
</div>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The button variables reach the apply and cancel pair through the same wrapper; hover either button to see its hover background.\`
      },
      source: {
        code: \`<div
  style={{
    "--color-picker-width": "240px",
    "--color-picker-border-style": "1px solid #0082c9",
    "--button-primary-bg": "#0082c9",
    "--button-root-border-radius": "8px",
  }}
>
  <ColorPicker isPickerOnly={false} appliedColor="#4781D1" />
</div>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}}})))()}w();export{S as CssCustomization,m as CustomLabels,u as Default,g as LiveColorReadout,f as PickerOnly,v as PresetColor,b as RightToLeft,C as __namedExportsOrder,l as default};