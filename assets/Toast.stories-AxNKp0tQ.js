import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{r as n,t as r}from"./text-Cz_cI6Yf.js";import{n as i,r as a,t as o}from"./button-DjDXE7uo.js";import{i as s,n as c,r as l,t as u}from"./Toastr-x__mex7v.js";import{n as d,t as f}from"./Toast-6E8r1NpK.js";import{i as p,n as m,t as h}from"./link-C_nB54e7.js";var g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N;function P(){return(P=e((()=>{d(),s(),u(),i(),m(),n(),g=t(),_={title:`UI/Feedback/Toast`,component:f,parameters:{design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?node-id=648%3A4421&mode=dev`}},argTypes:{type:{control:`select`,options:Object.values(l),description:"Which `toastr` method the story calls, and so the colour and icon of the toast: `success`, `error`, `warning` or `info`. The `Toast` container itself ignores this prop"},title:{control:`text`,description:"Bold first line of the toast, the second argument of `toastr`. Left out, a translated default for the type is shown; `null` shows no title"},data:{control:`text`,description:"Message under the title, the first argument of `toastr`: a string or any React node"},withCross:{control:`boolean`,description:"Fourth argument of `toastr`: shows a cross that closes the toast, and stops a click on the toast from closing it",table:{defaultValue:{summary:`false`}}},timeout:{control:`number`,description:"Third argument of `toastr`: milliseconds before the toast closes, or 0 to keep it open until it is closed by hand. A value under 750 falls back to 5000",table:{defaultValue:{summary:`5000`}}},id:{control:`text`,description:"Ignored: nothing reads it, and the container carries no `id`"},className:{control:`text`,description:`Class added to the container the toasts are stacked in`},style:{control:`object`,description:`Inline style of the container the toasts are stacked in; the place to set the CSS variables, since the container is not rendered inside your markup`},isSSR:{control:`boolean`,description:`Renders nothing until the page has mounted in the browser, so a server-rendered tree and its first client render match`,table:{defaultValue:{summary:`false`}}}}},v=({type:e=l.success,data:t=`Toast message`,title:n,timeout:r=5e3,withCross:i=!1,className:s,style:u,isSSR:d})=>(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(f,{className:s,style:u,isSSR:d}),(0,g.jsx)(o,{label:`Show Toast`,primary:!0,size:a.small,onClick:()=>{switch(e){case l.error:c.error(t,n,r,i);break;case l.warning:c.warning(t,n,r,i);break;case l.info:c.info(t,n,r,i);break;default:c.success(t,n,r,i)}}})]}),y=()=>(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(f,{}),(0,g.jsx)(o,{label:`Show All Toast Types`,primary:!0,size:a.small,onClick:()=>{c.success(`Success message`,`Success`,0,!0),c.error(`Error message`,`Error`,0,!0),c.warning(`Warning message`,`Warning`,0,!0),c.info(`Info message`,`Info`,0,!0)}})]}),b={render:e=>(0,g.jsx)(v,{type:e.type??l.success,data:typeof e.data==`string`?e.data:`Toast message`,title:e.title,timeout:e.timeout,withCross:e.withCross,className:e.className,style:e.style,isSSR:e.isSSR}),args:{data:`Your changes were saved`,timeout:5e3,type:l.success},parameters:{docs:{description:{story:`The call most screens make: a short message after an action, with the title left to the type. Click **Show Toast** to open it, and pick another type or change the message, title or timeout live in the Controls panel below.`},source:{code:`toastr.success("Your changes were saved");`}}}},x={render:e=>(0,g.jsx)(v,{type:e.type??l.success,data:typeof e.data==`string`?e.data:`Toast message`,title:e.title,timeout:e.timeout,withCross:e.withCross,className:e.className,style:e.style,isSSR:e.isSSR}),args:{data:`Operation completed successfully`,title:`Success`,timeout:5e3,type:l.success},parameters:{docs:{description:{story:`Confirms that an action the user started has finished, such as a save or a move. Click **Show Toast** to open it, and change the message, title or timeout live in the Controls panel below.`},source:{code:`toastr.success("Operation completed successfully", "Success", 5000);`}}}},S={render:e=>(0,g.jsx)(v,{type:e.type??l.error,data:typeof e.data==`string`?e.data:`Toast message`,title:e.title,timeout:e.timeout,withCross:e.withCross,className:e.className,style:e.style,isSSR:e.isSSR}),args:{data:`An error occurred while processing your request`,title:`Error`,timeout:5e3,type:l.error},parameters:{docs:{description:{story:`Tells the user that an action failed. Click **Show Toast** to open it; in code, pass the caught error itself and the message is read from it.`},source:{code:`toastr.error("An error occurred while processing your request", "Error", 5000);`}}}},C={render:e=>(0,g.jsx)(v,{type:e.type??l.warning,data:typeof e.data==`string`?e.data:`Toast message`,title:e.title,timeout:e.timeout,withCross:e.withCross,className:e.className,style:e.style,isSSR:e.isSSR}),args:{data:`Please review the changes before proceeding`,title:`Warning`,timeout:5e3,type:l.warning},parameters:{docs:{description:{story:`Asks the user to look at something before going on, without reporting a failure. Click **Show Toast** to open it.`},source:{code:`toastr.warning("Please review the changes before proceeding", "Warning", 5000);`}}}},w={render:e=>(0,g.jsx)(v,{type:e.type??l.info,data:typeof e.data==`string`?e.data:`Toast message`,title:e.title,timeout:e.timeout,withCross:e.withCross,className:e.className,style:e.style,isSSR:e.isSSR}),args:{data:`New updates are available`,title:`Information`,timeout:5e3,type:l.info},parameters:{docs:{description:{story:`Reports something neutral the user may want to know, such as a finished background task. Click **Show Toast** to open it.`},source:{code:`toastr.info("New updates are available", "Information", 5000);`}}}},T={render:e=>(0,g.jsx)(v,{type:e.type??l.success,data:typeof e.data==`string`?e.data:`Toast message`,title:e.title,timeout:e.timeout,withCross:e.withCross,className:e.className,style:e.style,isSSR:e.isSSR}),args:{data:`Click the close button to dismiss`,title:`Dismissible Toast`,withCross:!0,timeout:0,type:l.success},parameters:{docs:{description:{story:"For a message the user must read before it goes: the toast stays until its cross is clicked (`timeout` 0, `withCross`), and a click on the toast itself no longer closes it."},source:{code:`toastr.success("Click the close button to dismiss", "Dismissible Toast", 0, true);`}}}},E={render:()=>(0,g.jsx)(y,{}),parameters:{docs:{description:{story:`Compares the four types side by side: **Info** on top, as the newest, then **Warning**, **Error** and **Success**, each on its own background. All four stay open until closed with their cross.`},source:{code:`toastr.success("Success message", "Success", 0, true);
toastr.error("Error message", "Error", 0, true);
toastr.warning("Warning message", "Warning", 0, true);
toastr.info("Info message", "Info", 0, true);`}}}},D=({label:e,onClick:t})=>(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(f,{}),(0,g.jsx)(o,{label:e,primary:!0,size:a.small,onClick:t})]}),O={render:()=>(0,g.jsx)(D,{label:`Show Toast`,onClick:()=>c.success((0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(r,{fontSize:`12px`,children:`Report.docx was moved to Archive.`}),(0,g.jsx)(h,{type:p.action,fontSize:`12px`,isBold:!0,children:`Open folder`})]}),`File moved`,0,!0)}),parameters:{docs:{description:{story:`A message that needs more than a line of text, such as a link to what the action produced: any React node passed as the first argument is rendered as it is, under the title.`},source:{code:`toastr.success(
  <>
    <Text fontSize="12px">Report.docx was moved to Archive.</Text>
    <Link type={LinkType.action} fontSize="12px" isBold>
      Open folder
    </Link>
  </>,
  "File moved",
  0,
  true,
);`}}}},k={render:()=>(0,g.jsx)(D,{label:`Show Toasts`,onClick:()=>{c.success(`The title is filled in for the type`,void 0,0,!0),c.info(`No title at all`,null,0,!0)}}),parameters:{docs:{description:{story:"Most calls need no title of their own. **No title at all** — the info toast, given `null` as its title, shows the message alone. **Done** — the success toast below it left the title out, so the translated word for its type is shown."},source:{code:`toastr.success("The title is filled in for the type", undefined, 0, true);
toastr.info("No title at all", null, 0, true);`}}}},A={render:e=>(0,g.jsx)(v,{type:e.type??l.success,data:typeof e.data==`string`?e.data:`Toast message`,title:e.title,timeout:e.timeout,withCross:e.withCross}),globals:{direction:`rtl`},args:{data:`The file was saved`,title:`Saved`,withCross:!0,timeout:0,type:l.success},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`112px`},description:{story:"Toasts in a right-to-left layout: they open in the top-left corner and slide in from the left, the icon moves to the right of the text and the cross to the left. The toasts are portalled outside the story, so the direction comes from the document, set here by the Direction toolbar, and a `dir` on a wrapper of yours would not reach them."},source:{code:`// The page runs right to left, e.g. <ThemeProvider locale="ar">
toastr.success("The file was saved", "Saved", 0, true);`}}}},j=()=>(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(f,{style:{"--toast-radius":`12px`,"--toast-padding":`16px`,"--toast-width":`360px`,"--toast-inset-end":`32px`}}),(0,g.jsx)(o,{label:`Show Custom Toasts`,primary:!0,size:a.small,onClick:()=>{c.success(`Custom success notification`,`Styled Toast`,0,!0)}})]}),M={render:()=>(0,g.jsx)(j,{}),parameters:{docs:{description:{story:"The variables are listed under CSS variables on this page; here they are set through the `style` prop of `Toast`, because the toasts are portalled outside any wrapper of yours. The example sets every one a string toast can show, all but `--toast-text-size`: open a toast to see the rounder corners, the wider padding and the wider container further from the edge."},source:{code:`<Toast
  style={{
    "--toast-radius": "12px",
    "--toast-padding": "16px",
    "--toast-width": "360px",
    "--toast-inset-end": "32px",
  }}
/>`}}}},N=[`Default`,`Success`,`ErrorToast`,`Warning`,`Info`,`WithCloseButton`,`AllTypes`,`CustomContent`,`DefaultTitles`,`RightToLeft`,`CssCustomization`],b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <ToastTemplate type={args.type ?? ToastType.success} data={typeof args.data === "string" ? args.data : "Toast message"} title={args.title} timeout={args.timeout} withCross={args.withCross} className={args.className} style={args.style} isSSR={args.isSSR} />,
  args: {
    data: "Your changes were saved",
    timeout: 5000,
    type: ToastType.success
  },
  parameters: {
    docs: {
      description: {
        story: "The call most screens make: a short message after an action, with the title left to the type. Click **Show Toast** to open it, and pick another type or change the message, title or timeout live in the Controls panel below."
      },
      source: {
        code: \`toastr.success("Your changes were saved");\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <ToastTemplate type={args.type ?? ToastType.success} data={typeof args.data === "string" ? args.data : "Toast message"} title={args.title} timeout={args.timeout} withCross={args.withCross} className={args.className} style={args.style} isSSR={args.isSSR} />,
  args: {
    data: "Operation completed successfully",
    title: "Success",
    timeout: 5000,
    type: ToastType.success
  },
  parameters: {
    docs: {
      description: {
        story: "Confirms that an action the user started has finished, such as a save or a move. Click **Show Toast** to open it, and change the message, title or timeout live in the Controls panel below."
      },
      source: {
        code: \`toastr.success("Operation completed successfully", "Success", 5000);\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: args => <ToastTemplate type={args.type ?? ToastType.error} data={typeof args.data === "string" ? args.data : "Toast message"} title={args.title} timeout={args.timeout} withCross={args.withCross} className={args.className} style={args.style} isSSR={args.isSSR} />,
  args: {
    data: "An error occurred while processing your request",
    title: "Error",
    timeout: 5000,
    type: ToastType.error
  },
  parameters: {
    docs: {
      description: {
        story: "Tells the user that an action failed. Click **Show Toast** to open it; in code, pass the caught error itself and the message is read from it."
      },
      source: {
        code: \`toastr.error("An error occurred while processing your request", "Error", 5000);\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => <ToastTemplate type={args.type ?? ToastType.warning} data={typeof args.data === "string" ? args.data : "Toast message"} title={args.title} timeout={args.timeout} withCross={args.withCross} className={args.className} style={args.style} isSSR={args.isSSR} />,
  args: {
    data: "Please review the changes before proceeding",
    title: "Warning",
    timeout: 5000,
    type: ToastType.warning
  },
  parameters: {
    docs: {
      description: {
        story: "Asks the user to look at something before going on, without reporting a failure. Click **Show Toast** to open it."
      },
      source: {
        code: \`toastr.warning("Please review the changes before proceeding", "Warning", 5000);\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => <ToastTemplate type={args.type ?? ToastType.info} data={typeof args.data === "string" ? args.data : "Toast message"} title={args.title} timeout={args.timeout} withCross={args.withCross} className={args.className} style={args.style} isSSR={args.isSSR} />,
  args: {
    data: "New updates are available",
    title: "Information",
    timeout: 5000,
    type: ToastType.info
  },
  parameters: {
    docs: {
      description: {
        story: "Reports something neutral the user may want to know, such as a finished background task. Click **Show Toast** to open it."
      },
      source: {
        code: \`toastr.info("New updates are available", "Information", 5000);\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: args => <ToastTemplate type={args.type ?? ToastType.success} data={typeof args.data === "string" ? args.data : "Toast message"} title={args.title} timeout={args.timeout} withCross={args.withCross} className={args.className} style={args.style} isSSR={args.isSSR} />,
  args: {
    data: "Click the close button to dismiss",
    title: "Dismissible Toast",
    withCross: true,
    timeout: 0,
    type: ToastType.success
  },
  parameters: {
    docs: {
      description: {
        story: "For a message the user must read before it goes: the toast stays until its cross is clicked (\`timeout\` 0, \`withCross\`), and a click on the toast itself no longer closes it."
      },
      source: {
        code: \`toastr.success("Click the close button to dismiss", "Dismissible Toast", 0, true);\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <AllTypesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Compares the four types side by side: **Info** on top, as the newest, then **Warning**, **Error** and **Success**, each on its own background. All four stay open until closed with their cross."
      },
      source: {
        code: \`toastr.success("Success message", "Success", 0, true);
toastr.error("Error message", "Error", 0, true);
toastr.warning("Warning message", "Warning", 0, true);
toastr.info("Info message", "Info", 0, true);\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <TriggerTemplate label="Show Toast" onClick={() => toastr.success(<>
            <Text fontSize="12px">Report.docx was moved to Archive.</Text>
            <Link type={LinkType.action} fontSize="12px" isBold>
              Open folder
            </Link>
          </>, "File moved", 0, true)} />,
  parameters: {
    docs: {
      description: {
        story: "A message that needs more than a line of text, such as a link to what the action produced: any React node passed as the first argument is rendered as it is, under the title."
      },
      source: {
        code: \`toastr.success(
  <>
    <Text fontSize="12px">Report.docx was moved to Archive.</Text>
    <Link type={LinkType.action} fontSize="12px" isBold>
      Open folder
    </Link>
  </>,
  "File moved",
  0,
  true,
);\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <TriggerTemplate label="Show Toasts" onClick={() => {
    toastr.success("The title is filled in for the type", undefined, 0, true);
    toastr.info("No title at all", null, 0, true);
  }} />,
  parameters: {
    docs: {
      description: {
        story: "Most calls need no title of their own. **No title at all** — the info toast, given \`null\` as its title, shows the message alone. **Done** — the success toast below it left the title out, so the translated word for its type is shown."
      },
      source: {
        code: \`toastr.success("The title is filled in for the type", undefined, 0, true);
toastr.info("No title at all", null, 0, true);\`
      }
    }
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: args => <ToastTemplate type={args.type ?? ToastType.success} data={typeof args.data === "string" ? args.data : "Toast message"} title={args.title} timeout={args.timeout} withCross={args.withCross} />,
  globals: {
    direction: "rtl"
  },
  args: {
    data: "The file was saved",
    title: "Saved",
    withCross: true,
    timeout: 0,
    type: ToastType.success
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: {
        inline: false,
        height: "112px"
      },
      description: {
        story: "Toasts in a right-to-left layout: they open in the top-left corner and slide in from the left, the icon moves to the right of the text and the cross to the left. The toasts are portalled outside the story, so the direction comes from the document, set here by the Direction toolbar, and a \`dir\` on a wrapper of yours would not reach them."
      },
      source: {
        code: \`// The page runs right to left, e.g. <ThemeProvider locale="ar">
toastr.success("The file was saved", "Saved", 0, true);\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`The variables are listed under CSS variables on this page; here they are set through the \\\`style\\\` prop of \\\`Toast\\\`, because the toasts are portalled outside any wrapper of yours. The example sets every one a string toast can show, all but \\\`--toast-text-size\\\`: open a toast to see the rounder corners, the wider padding and the wider container further from the edge.\`
      },
      source: {
        code: \`<Toast
  style={{
    "--toast-radius": "12px",
    "--toast-padding": "16px",
    "--toast-width": "360px",
    "--toast-inset-end": "32px",
  }}
/>\`
      }
    }
  }
}`,...M.parameters?.docs?.source}}}})))()}P();export{E as AllTypes,M as CssCustomization,O as CustomContent,b as Default,k as DefaultTitles,S as ErrorToast,w as Info,A as RightToLeft,x as Success,C as Warning,T as WithCloseButton,N as __namedExportsOrder,_ as default};