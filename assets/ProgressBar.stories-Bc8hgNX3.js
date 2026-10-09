import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./PreparationPortalProgress-Dn_DAn6z.js";import{n as i,t as a}from"./ProgressBar-DV6S6npE.js";var o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{i(),n(),o=t(),s={title:`UI/Status components/ProgressBar`,component:a,parameters:{},argTypes:{percent:{control:{type:`number`,min:0,max:100},description:`How far along the operation is, 0 to 100; anything above 100 fills the whole bar`},label:{control:`text`,description:`Line of text above the bar; it is also the bar's tooltip and its accessible name`},isInfiniteProgress:{control:`boolean`,description:`Display infinite loading animation instead of percentage-based progress`,table:{defaultValue:{summary:`false`}}},status:{control:`text`,description:"Line of text under the bar; hidden while `error` is set, which takes the same place"},error:{control:`text`,description:"Line of text under the bar in the error colour; shown instead of `status` when both are given"},className:{control:`text`,description:`Extra class added to the bar element itself, not to the block around the label and status line`},style:{control:`object`,description:`Inline style of the whole block — the label, the bar and the status line together`}}},c={render:e=>(0,o.jsx)(a,{...e}),args:{percent:50,label:`Uploading file...`},parameters:{docs:{description:{story:"Use it for an operation whose progress you can measure: the label names the operation and the fill shows how far it has got (`percent`, `label`). Change any other prop live in the Controls panel below."},source:{code:`<ProgressBar percent={50} label="Uploading file..." />`}}}},l={render:e=>(0,o.jsx)(a,{...e}),args:{percent:75,label:`Processing document`,status:`3 of 4 files processed`},parameters:{docs:{description:{story:"Add a status line when the reader needs more than the fill tells them — how many items are done, what is being processed now (`status`)."},source:{code:`<ProgressBar percent={75} label="Processing document" status="3 of 4 files processed" />`}}}},u={render:e=>(0,o.jsx)(a,{...e}),args:{percent:30,label:`Upload failed`,error:`Network connection error`},parameters:{docs:{description:{story:"When the operation fails, the message takes the place of the status line in the error colour, and the bar stays where it stopped (`error`)."},source:{code:`<ProgressBar percent={30} label="Upload failed" error="Network connection error" />`}}}},d={render:e=>(0,o.jsx)(a,{...e}),args:{percent:0,label:`Please wait...`,isInfiniteProgress:!0},parameters:{docs:{description:{story:"Use it when the operation cannot report how far it has got: a short strip slides across the track until the bar is removed (`isInfiniteProgress`)."},source:{code:`<ProgressBar percent={0} label="Please wait..." isInfiniteProgress />`}}}},f={render:e=>(0,o.jsx)(a,{...e}),args:{percent:100,label:`Upload complete`,status:`All files processed successfully`},parameters:{docs:{description:{story:"The finished state: the track is filled completely and the status line confirms the result (`percent={100}`)."},source:{code:`<ProgressBar percent={100} label="Upload complete" status="All files processed successfully" />`}}}},p={render:e=>(0,o.jsx)(r,{...e}),args:{percent:75,text:`Setting things up...`},parameters:{controls:{include:[`percent`,`text`,`className`]},docs:{description:{story:"Use `PreparationPortalProgress` for a full-page wait where the number itself matters: a taller bar with the percentage printed in its middle and a centred caption below (`percent`, `text`). The percentage turns from dark to light once the fill passes 50%; move `percent` in the Controls panel below to see it."},source:{code:`<PreparationPortalProgress percent={75} text="Setting things up..." />`}}}},m=e=>(0,o.jsxs)(`div`,{dir:`rtl`,children:[(0,o.jsx)(a,{...e}),(0,o.jsx)(a,{...e,label:`انتظر من فضلك`,status:void 0,isInfiniteProgress:!0})]}),h={render:e=>(0,o.jsx)(m,{...e}),globals:{direction:`rtl`},args:{percent:40,label:`جارٍ التحميل`,status:`٢ من ٥`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`100px`},description:{story:'The bar under a right-to-left interface: the label and status line align to the right, the fill grows from the right edge, and the infinite strip in the second bar slides from right to left. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.'},source:{code:`<div dir="rtl">
  <ProgressBar percent={40} label="جارٍ التحميل" status="٢ من ٥" />
  <ProgressBar percent={40} label="انتظر من فضلك" isInfiniteProgress />
</div>`}}}},g={render:e=>(0,o.jsxs)(`div`,{style:{"--progress-bar-size":`8px`,"--progress-bar-radius":`8px`,"--progress-bar-fill":`#7c3aed`,"--progress-bar-track":`#e9d5ff`,"--progress-bar-bottom-margin":`12px`,"--progress-bar-text":`#5b21b6`,"--progress-bar-error-text":`#be123c`},children:[(0,o.jsx)(a,{...e}),(0,o.jsx)(a,{...e,status:void 0,error:`Connection lost`})]}),args:{percent:65,label:`Customized progress bar`,status:`Violet theme, 8px height`},parameters:{docs:{description:{story:"The variables are listed under CSS variables on this page; the example sets every one of them on one wrapper.\n\nThe first bar shows the track, fill, size, radius, margin and status colour; the second sets `error` to show `--progress-bar-error-text`, since an error takes the place of the status line."},source:{code:`<div style={{
  "--progress-bar-size": "8px",
  "--progress-bar-radius": "8px",
  "--progress-bar-fill": "#7c3aed",
  "--progress-bar-track": "#e9d5ff",
  "--progress-bar-bottom-margin": "12px",
  "--progress-bar-text": "#5b21b6",
  "--progress-bar-error-text": "#be123c",
}}>
  <ProgressBar percent={65} label="Customized progress bar" status="Violet theme, 8px height" />
  <ProgressBar percent={65} label="Customized progress bar" error="Connection lost" />
</div>`}}}},_=[`Default`,`WithStatus`,`WithError`,`InfiniteProgress`,`Complete`,`PreparationPortal`,`RightToLeft`,`CssCustomization`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <ProgressBar {...args} />,
  args: {
    percent: 50,
    label: "Uploading file..."
  },
  parameters: {
    docs: {
      description: {
        story: "Use it for an operation whose progress you can measure: the label names the operation and the fill shows how far it has got (\`percent\`, \`label\`). Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<ProgressBar percent={50} label="Uploading file..." />\`
      }
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <ProgressBar {...args} />,
  args: {
    percent: 75,
    label: "Processing document",
    status: "3 of 4 files processed"
  },
  parameters: {
    docs: {
      description: {
        story: "Add a status line when the reader needs more than the fill tells them — how many items are done, what is being processed now (\`status\`)."
      },
      source: {
        code: \`<ProgressBar percent={75} label="Processing document" status="3 of 4 files processed" />\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <ProgressBar {...args} />,
  args: {
    percent: 30,
    label: "Upload failed",
    error: "Network connection error"
  },
  parameters: {
    docs: {
      description: {
        story: "When the operation fails, the message takes the place of the status line in the error colour, and the bar stays where it stopped (\`error\`)."
      },
      source: {
        code: \`<ProgressBar percent={30} label="Upload failed" error="Network connection error" />\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <ProgressBar {...args} />,
  args: {
    percent: 0,
    label: "Please wait...",
    isInfiniteProgress: true
  },
  parameters: {
    docs: {
      description: {
        story: "Use it when the operation cannot report how far it has got: a short strip slides across the track until the bar is removed (\`isInfiniteProgress\`)."
      },
      source: {
        code: \`<ProgressBar percent={0} label="Please wait..." isInfiniteProgress />\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <ProgressBar {...args} />,
  args: {
    percent: 100,
    label: "Upload complete",
    status: "All files processed successfully"
  },
  parameters: {
    docs: {
      description: {
        story: "The finished state: the track is filled completely and the status line confirms the result (\`percent={100}\`)."
      },
      source: {
        code: \`<ProgressBar percent={100} label="Upload complete" status="All files processed successfully" />\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <PreparationPortalProgress {...args} />,
  args: {
    percent: 75,
    text: "Setting things up..."
  },
  parameters: {
    controls: {
      include: ["percent", "text", "className"]
    },
    docs: {
      description: {
        story: "Use \`PreparationPortalProgress\` for a full-page wait where the number itself matters: a taller bar with the percentage printed in its middle and a centred caption below (\`percent\`, \`text\`). The percentage turns from dark to light once the fill passes 50%; move \`percent\` in the Controls panel below to see it."
      },
      source: {
        code: \`<PreparationPortalProgress percent={75} text="Setting things up..." />\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <RightToLeftTemplate {...args} />,
  globals: {
    direction: "rtl"
  },
  args: {
    percent: 40,
    label: "جارٍ التحميل",
    status: "٢ من ٥"
  },
  parameters: {
    noPadding: true,
    docs: {
      story: {
        inline: false,
        height: "100px"
      },
      description: {
        story: 'The bar under a right-to-left interface: the label and status line align to the right, the fill grows from the right edge, and the infinite strip in the second bar slides from right to left. The direction comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar); the wrapper also carries \`dir="rtl"\` for the rules that read the DOM direction.'
      },
      source: {
        code: \`<div dir="rtl">
  <ProgressBar percent={40} label="جارٍ التحميل" status="٢ من ٥" />
  <ProgressBar percent={40} label="انتظر من فضلك" isInfiniteProgress />
</div>\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    "--progress-bar-size": "8px",
    "--progress-bar-radius": "8px",
    "--progress-bar-fill": "#7c3aed",
    "--progress-bar-track": "#e9d5ff",
    "--progress-bar-bottom-margin": "12px",
    "--progress-bar-text": "#5b21b6",
    "--progress-bar-error-text": "#be123c"
  } as CSSProperties}>
      <ProgressBar {...args} />
      <ProgressBar {...args} status={undefined} error="Connection lost" />
    </div>,
  args: {
    percent: 65,
    label: "Customized progress bar",
    status: "Violet theme, 8px height"
  },
  parameters: {
    docs: {
      description: {
        story: \`The variables are listed under CSS variables on this page; the example sets every one of them on one wrapper.

The first bar shows the track, fill, size, radius, margin and status colour; the second sets \\\`error\\\` to show \\\`--progress-bar-error-text\\\`, since an error takes the place of the status line.\`
      },
      source: {
        code: \`<div style={{
  "--progress-bar-size": "8px",
  "--progress-bar-radius": "8px",
  "--progress-bar-fill": "#7c3aed",
  "--progress-bar-track": "#e9d5ff",
  "--progress-bar-bottom-margin": "12px",
  "--progress-bar-text": "#5b21b6",
  "--progress-bar-error-text": "#be123c",
}}>
  <ProgressBar percent={65} label="Customized progress bar" status="Violet theme, 8px height" />
  <ProgressBar percent={65} label="Customized progress bar" error="Connection lost" />
</div>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}}})))()}v();export{f as Complete,g as CssCustomization,c as Default,d as InfiniteProgress,p as PreparationPortal,h as RightToLeft,u as WithError,l as WithStatus,_ as __namedExportsOrder,s as default};