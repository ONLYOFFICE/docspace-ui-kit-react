import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./operations-progress-button-BtuSq-Ac.js";var i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{n(),i=t(),{fn:a}=__STORYBOOK_MODULE_TEST__,o={title:`UI/Feedback/OperationsProgressButton`,component:r,parameters:{},argTypes:{operations:{control:`object`,description:`Secondary operations: copy, move, delete and the rest. In the list each row shows a spinner instead of a progress ring`,table:{defaultValue:{summary:`[]`}}},panelOperations:{control:`object`,description:`Operations that own a panel, such as an upload. In the list each row shows a progress ring with a cancel cross`,table:{defaultValue:{summary:`[]`}}},operationsAlert:{control:`boolean`,description:`Whether any operation failed: the button gets a warning badge and the tooltip names the error`,table:{defaultValue:{summary:`false`}}},operationsCanceled:{control:`boolean`,description:`Whether an upload was cancelled: the button gets the stop sign and the tooltip shows the operation's label`,table:{defaultValue:{summary:`false`}}},operationsCompleted:{control:`boolean`,description:`Whether everything is finished: the button shows a tick, slides out of view 4 seconds later (8 with a panel operation) and then calls the clear callbacks`,table:{defaultValue:{summary:`false`}}},operationsStopped:{control:`boolean`,description:`Whether an operation was aborted: the button gets the stop sign, which wins over alert and completed, and the tooltip says the operation was stopped`,table:{defaultValue:{summary:`false`}}},mainButtonVisible:{control:`boolean`,description:`Whether the mobile main button is on screen: on tablet widths the button sits 88px from the bottom (80px on phones) instead of 16px, clear of it`,table:{defaultValue:{summary:`false`}}},needErrorChecking:{control:`boolean`,description:`Whether a completed run may still hold errors: the button then stays on screen instead of hiding itself`,table:{defaultValue:{summary:`false`}}},showCancelButton:{control:`boolean`,description:`Whether a cancel cross appears beside the button on hover. Only while there is exactly one operation`,table:{defaultValue:{summary:`false`}}},isInfoPanelVisible:{control:`boolean`,description:`Whether the info panel is open: the button moves 424px in from the trailing edge, clear of it`,table:{defaultValue:{summary:`false`}}},isDragging:{control:`boolean`,description:`Whether files are being dragged: a preview button rises in the middle of the screen while a drop folder is named`,table:{defaultValue:{summary:`false`}}},dropTargetFolderName:{control:`text`,description:`Name of the folder under the pointer, shown in the drag preview button's tooltip`},percent:{control:!1,description:"Ignored. Nothing reads this prop; the ring shows the first operation's `percent`"},clearOperationsData:{action:`clearOperationsData`,description:`Called once the hide animation ends, and when a finished row's clear icon is clicked in the list, to drop the secondary operations`},clearPanelOperationsData:{action:`clearPanelOperationsData`,description:`Called once the hide animation ends, and when a finished panel row's clear icon is clicked in the list, to drop the panel operations`},clearDropPreviewLocation:{action:`clearDropPreviewLocation`,description:`Called when the drag preview button goes away, to forget the drop folder`},cancelUpload:{action:`cancelUpload`,description:`Called with the translation function when the cancel cross beside the button, or on a panel row's ring, is clicked`},cancelSecondaryOperationById:{action:`cancelSecondaryOperationById`,description:`Meant to be called with the operation and the id of its first item from a secondary row's cancel; those rows show a spinner with no cancel, so nothing calls it`},onOpenPanel:{control:!1,description:"Ignored. Nothing reads this prop; the panel is opened through `Operation.showPanel`"},onCancelOperation:{control:!1,description:"Ignored. Nothing reads this prop; the cancel cross calls `cancelUpload`"}},decorators:[e=>(0,i.jsx)(`div`,{style:{height:`120px`,position:`relative`,display:`flex`,justifyContent:`flex-end`,alignItems:`flex-end`,padding:`20px`},children:(0,i.jsx)(e,{})})]},s=e=>(0,i.jsx)(r,{...e}),c=[{id:`op-1`,operation:`upload`,label:`Uploading files`,alert:!1,completed:!1,percent:45}],l={render:s,args:{operations:c,operationsAlert:!1,operationsCompleted:!1},parameters:{docs:{description:{story:`One running operation: the ring shows how far it has got and the tooltip names it. Change any other prop live in the Controls panel below.`},source:{code:`<OperationsProgressButton
  operations={[{ id: "op-1", operation: "upload", label: "Uploading files", alert: false, completed: false, percent: 45 }]}
/>`}}}},u={render:s,args:{operations:[{id:`op-1`,operation:`upload`,label:`Uploading files`,alert:!1,completed:!1,percent:65}],operationsAlert:!1,operationsCompleted:!1,showCancelButton:!0},parameters:{docs:{description:{story:"Lets the user stop a running operation: hover the button to reveal the cancel cross beside it (`showCancelButton`); clicking it calls `cancelUpload`."},source:{code:`<OperationsProgressButton
  operations={[{ operation: "upload", label: "Uploading files", alert: false, completed: false, percent: 65 }]}
  showCancelButton
  cancelUpload={(t) => cancelAllUploads()}
/>`}}}},d={render:s,args:{operations:[{id:`op-1`,operation:`upload`,label:`Uploading files`,alert:!0,completed:!1,percent:40,errorCount:3}],operationsAlert:!0,operationsCompleted:!1,needErrorChecking:!0},parameters:{docs:{description:{story:"Tells the user something went wrong without opening anything: the button gets a warning badge (`operationsAlert`); hover it to read the operation's label and how many files failed (`errorCount`)."},source:{code:`<OperationsProgressButton
  operations={[{ operation: "upload", label: "Uploading files", alert: true, completed: false, percent: 40, errorCount: 3 }]}
  operationsAlert
  needErrorChecking
/>`}}}},f={render:s,args:{operations:[{id:`op-1`,operation:`copy`,label:`Copying files`,alert:!1,completed:!0,percent:100}],operationsAlert:!1,operationsCompleted:!0},parameters:{docs:{description:{story:"The button clears itself away once the work is done: it shows a tick (`operationsCompleted`) and slides out of view 4 seconds later, then calls `clearOperationsData`. Keep the pointer over it to hold it on screen."},source:{code:`<OperationsProgressButton
  operations={[{ operation: "copy", label: "Copying files", alert: false, completed: true, percent: 100 }]}
  operationsCompleted
  clearOperationsData={() => setOperations([])}
/>`}}}},p={render:s,args:{operations:[{id:`op-1`,operation:`upload`,label:`Uploading files`,alert:!1,completed:!1,percent:60},{id:`op-2`,operation:`copy`,label:`Copying documents`,alert:!1,completed:!1,percent:30}],panelOperations:[{id:`op-3`,operation:`move`,label:`Moving folder`,alert:!1,completed:!1,percent:80,showPanel:a()}],operationsAlert:!1,operationsCompleted:!1},parameters:{docs:{description:{story:"Keeps several operations behind one button: it shows three dots and the tooltip counts them. Click it to open the list:\n\n- **Uploading files**, **Copying documents** — secondary operations, each with a spinner (`operations`)\n- **Moving folder** — an operation with its own panel, with a progress ring and a cancel cross; click the row to open its panel (`panelOperations`, `showPanel`)"},source:{code:`<OperationsProgressButton
  operations={[
    { operation: "upload", label: "Uploading files", percent: 60, ... },
    { operation: "copy", label: "Copying documents", percent: 30, ... },
  ]}
  panelOperations={[
    { operation: "move", label: "Moving folder", percent: 80, showPanel, ... },
  ]}
/>`}}}},m={render:s,args:{operations:[{id:`op-1`,operation:`move`,label:`Moving files`,alert:!0,completed:!0,percent:50}],operationsAlert:!0,operationsCompleted:!1,operationsStopped:!0},parameters:{docs:{description:{story:"Shows that the user aborted an operation rather than that it failed: the button gets a stop sign even though the operation is also marked as failed (`operationsStopped`), and the tooltip says it was stopped."},source:{code:`<OperationsProgressButton
  operations={[{ operation: "move", label: "Moving files", alert: true, completed: true, percent: 50 }]}
  operationsAlert
  operationsStopped
/>`}}}},h={render:s,args:{panelOperations:[{id:`op-1`,operation:`upload`,label:`Uploading files`,description:`12 of 30 files`,alert:!1,completed:!1,percent:40,showPanel:a()}],operationsAlert:!1,operationsCompleted:!1},parameters:{docs:{description:{story:"Leads the user to the details of a single operation: click the button to open the operation's own panel (`showPanel`), and hover it to read a second line under the label (`description`)."},source:{code:`<OperationsProgressButton
  panelOperations={[{
    operation: "upload",
    label: "Uploading files",
    description: "12 of 30 files",
    alert: false,
    completed: false,
    percent: 40,
    showPanel: (open) => setUploadPanelVisible(open),
  }]}
/>`}}}},g={render:s,args:{operations:[],isDragging:!0,dropTargetFolderName:`Reports`},parameters:{docs:{story:{inline:!1,height:`200px`},description:{story:"Tells the user where dragged files will land: while a drag is in progress (`isDragging`) a preview button rises in the middle, and its tooltip names the folder under the pointer (`dropTargetFolderName`)."},source:{code:`<OperationsProgressButton
  isDragging
  dropTargetFolderName="Reports"
  clearDropPreviewLocation={() => setDropTarget(null)}
/>`}}}},_={render:e=>(0,i.jsx)(`div`,{dir:`rtl`,children:(0,i.jsx)(r,{...e})}),args:{operations:[{id:`op-1`,operation:`copy`,label:`نسخ الملفات`,alert:!1,completed:!1,percent:45}],operationsAlert:!1,operationsCompleted:!1},globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`186px`},description:{story:`In a right-to-left layout the button sits in the bottom-left corner instead of the bottom-right, and its tooltip opens towards the middle of the screen.`},source:{code:`<div dir="rtl">
  <OperationsProgressButton
    operations={[{ operation: "copy", label: "نسخ الملفات", alert: false, completed: false, percent: 45 }]}
  />
</div>`}}}},v={render:()=>(0,i.jsx)(`div`,{style:{"--ops-progress-dropdown-bg":`#e6f3fb`,"--ops-progress-dropdown-hover":`#cce5f6`,"--ops-progress-dropdown-margin":`16px`,"--ops-progress-list-padding":`0px 12px`,"--ops-progress-bar-padding":`10px 16px`,"--ops-progress-wrapper-margin":`0px`,"--ops-progress-items-gap":`12px`,"--ops-progress-label-gap":`4px`,"--ops-progress-icon-color":`#0082c9`,"--ops-progress-icon-hover":`#006ba6`,"--ops-progress-error-icon":`#0082c9`,"--ops-progress-stopped-icon":`#f03032`,"--floating-circle-button-background":`#0082c9`,"--floating-button-icon":`#ffffff`,"--floating-button-shadow":`0 4px 16px rgba(0, 130, 201, 0.4)`},children:(0,i.jsx)(r,{operations:[{id:`op-1`,operation:`upload`,label:`Uploading files`,alert:!1,completed:!1,percent:65},{id:`op-2`,operation:`copy`,label:`Copying documents`,alert:!1,completed:!1,percent:30,showPanel:()=>{}},{id:`op-3`,operation:`move`,label:`Moving files`,alert:!0,completed:!0,percent:100},{id:`op-4`,operation:`trash`,label:`Moving to trash`,alert:!1,completed:!1,stopped:!0,percent:20}],operationsAlert:!1,operationsCompleted:!1})}),parameters:{docs:{description:{story:"Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The button shows the three `--floating-*` variables; click it to open the list, which shows the rest: **Moving files** is finished and failed, **Moving to trash** was aborted. Hover **Moving files**' clear icon for `--ops-progress-icon-hover`."}}}},y=[`Default`,`UploadInProgress`,`WithAlert`,`CompletedOperation`,`MultipleOperations`,`StoppedOperation`,`OpensPanelOnClick`,`DragPreview`,`RightToLeft`,`CssCustomization`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    operations: singleUploadOperation,
    operationsAlert: false,
    operationsCompleted: false
  },
  parameters: {
    docs: {
      description: {
        story: "One running operation: the ring shows how far it has got and the tooltip names it. Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<OperationsProgressButton
  operations={[{ id: "op-1", operation: "upload", label: "Uploading files", alert: false, completed: false, percent: 45 }]}
/>\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    operations: [{
      id: "op-1",
      operation: "upload",
      label: "Uploading files",
      alert: false,
      completed: false,
      percent: 65
    }],
    operationsAlert: false,
    operationsCompleted: false,
    showCancelButton: true
  },
  parameters: {
    docs: {
      description: {
        story: "Lets the user stop a running operation: hover the button to reveal the cancel cross beside it (\`showCancelButton\`); clicking it calls \`cancelUpload\`."
      },
      source: {
        code: \`<OperationsProgressButton
  operations={[{ operation: "upload", label: "Uploading files", alert: false, completed: false, percent: 65 }]}
  showCancelButton
  cancelUpload={(t) => cancelAllUploads()}
/>\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    operations: [{
      id: "op-1",
      operation: "upload",
      label: "Uploading files",
      alert: true,
      completed: false,
      percent: 40,
      errorCount: 3
    }],
    operationsAlert: true,
    operationsCompleted: false,
    needErrorChecking: true
  },
  parameters: {
    docs: {
      description: {
        story: "Tells the user something went wrong without opening anything: the button gets a warning badge (\`operationsAlert\`); hover it to read the operation's label and how many files failed (\`errorCount\`)."
      },
      source: {
        code: \`<OperationsProgressButton
  operations={[{ operation: "upload", label: "Uploading files", alert: true, completed: false, percent: 40, errorCount: 3 }]}
  operationsAlert
  needErrorChecking
/>\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    operations: [{
      id: "op-1",
      operation: "copy",
      label: "Copying files",
      alert: false,
      completed: true,
      percent: 100
    }],
    operationsAlert: false,
    operationsCompleted: true
  },
  parameters: {
    docs: {
      description: {
        story: "The button clears itself away once the work is done: it shows a tick (\`operationsCompleted\`) and slides out of view 4 seconds later, then calls \`clearOperationsData\`. Keep the pointer over it to hold it on screen."
      },
      source: {
        code: \`<OperationsProgressButton
  operations={[{ operation: "copy", label: "Copying files", alert: false, completed: true, percent: 100 }]}
  operationsCompleted
  clearOperationsData={() => setOperations([])}
/>\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    operations: [{
      id: "op-1",
      operation: "upload",
      label: "Uploading files",
      alert: false,
      completed: false,
      percent: 60
    }, {
      id: "op-2",
      operation: "copy",
      label: "Copying documents",
      alert: false,
      completed: false,
      percent: 30
    }],
    panelOperations: [{
      id: "op-3",
      operation: "move",
      label: "Moving folder",
      alert: false,
      completed: false,
      percent: 80,
      showPanel: fn()
    }],
    operationsAlert: false,
    operationsCompleted: false
  },
  parameters: {
    docs: {
      description: {
        story: \`Keeps several operations behind one button: it shows three dots and the tooltip counts them. Click it to open the list:

- **Uploading files**, **Copying documents** — secondary operations, each with a spinner (\\\`operations\\\`)
- **Moving folder** — an operation with its own panel, with a progress ring and a cancel cross; click the row to open its panel (\\\`panelOperations\\\`, \\\`showPanel\\\`)\`
      },
      source: {
        code: \`<OperationsProgressButton
  operations={[
    { operation: "upload", label: "Uploading files", percent: 60, ... },
    { operation: "copy", label: "Copying documents", percent: 30, ... },
  ]}
  panelOperations={[
    { operation: "move", label: "Moving folder", percent: 80, showPanel, ... },
  ]}
/>\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    operations: [{
      id: "op-1",
      operation: "move",
      label: "Moving files",
      alert: true,
      completed: true,
      percent: 50
    }],
    operationsAlert: true,
    operationsCompleted: false,
    operationsStopped: true
  },
  parameters: {
    docs: {
      description: {
        story: "Shows that the user aborted an operation rather than that it failed: the button gets a stop sign even though the operation is also marked as failed (\`operationsStopped\`), and the tooltip says it was stopped."
      },
      source: {
        code: \`<OperationsProgressButton
  operations={[{ operation: "move", label: "Moving files", alert: true, completed: true, percent: 50 }]}
  operationsAlert
  operationsStopped
/>\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    panelOperations: [{
      id: "op-1",
      operation: "upload",
      label: "Uploading files",
      description: "12 of 30 files",
      alert: false,
      completed: false,
      percent: 40,
      showPanel: fn()
    }],
    operationsAlert: false,
    operationsCompleted: false
  },
  parameters: {
    docs: {
      description: {
        story: "Leads the user to the details of a single operation: click the button to open the operation's own panel (\`showPanel\`), and hover it to read a second line under the label (\`description\`)."
      },
      source: {
        code: \`<OperationsProgressButton
  panelOperations={[{
    operation: "upload",
    label: "Uploading files",
    description: "12 of 30 files",
    alert: false,
    completed: false,
    percent: 40,
    showPanel: (open) => setUploadPanelVisible(open),
  }]}
/>\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    operations: [],
    isDragging: true,
    dropTargetFolderName: "Reports"
  },
  parameters: {
    docs: {
      // Framed: inline, the always-open tooltip lands elsewhere on the Docs page.
      story: {
        inline: false,
        height: "200px"
      },
      description: {
        story: "Tells the user where dragged files will land: while a drag is in progress (\`isDragging\`) a preview button rises in the middle, and its tooltip names the folder under the pointer (\`dropTargetFolderName\`)."
      },
      source: {
        code: \`<OperationsProgressButton
  isDragging
  dropTargetFolderName="Reports"
  clearDropPreviewLocation={() => setDropTarget(null)}
/>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <OperationsProgressButton {...args} />
    </div>,
  args: {
    operations: [{
      id: "op-1",
      operation: "copy",
      label: "\\u0646\\u0633\\u062e \\u0627\\u0644\\u0645\\u0644\\u0641\\u0627\\u062a",
      alert: false,
      completed: false,
      percent: 45
    }],
    operationsAlert: false,
    operationsCompleted: false
  },
  globals: {
    direction: "rtl"
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: {
        inline: false,
        height: "186px"
      },
      description: {
        story: "In a right-to-left layout the button sits in the bottom-left corner instead of the bottom-right, and its tooltip opens towards the middle of the screen."
      },
      source: {
        code: \`<div dir="rtl">
  <OperationsProgressButton
    operations={[{ operation: "copy", label: "\\u0646\\u0633\\u062e \\u0627\\u0644\\u0645\\u0644\\u0641\\u0627\\u062a", alert: false, completed: false, percent: 45 }]}
  />
</div>\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--ops-progress-dropdown-bg": "#e6f3fb",
    "--ops-progress-dropdown-hover": "#cce5f6",
    "--ops-progress-dropdown-margin": "16px",
    "--ops-progress-list-padding": "0px 12px",
    "--ops-progress-bar-padding": "10px 16px",
    "--ops-progress-wrapper-margin": "0px",
    "--ops-progress-items-gap": "12px",
    "--ops-progress-label-gap": "4px",
    "--ops-progress-icon-color": "#0082c9",
    "--ops-progress-icon-hover": "#006ba6",
    "--ops-progress-error-icon": "#0082c9",
    "--ops-progress-stopped-icon": "#f03032",
    "--floating-circle-button-background": "#0082c9",
    "--floating-button-icon": "#ffffff",
    "--floating-button-shadow": "0 4px 16px rgba(0, 130, 201, 0.4)"
  } as CSSProperties}>
      <OperationsProgressButton operations={[{
      id: "op-1",
      operation: "upload",
      label: "Uploading files",
      alert: false,
      completed: false,
      percent: 65
    }, {
      id: "op-2",
      operation: "copy",
      label: "Copying documents",
      alert: false,
      completed: false,
      percent: 30,
      showPanel: () => {}
    }, {
      id: "op-3",
      operation: "move",
      label: "Moving files",
      alert: true,
      completed: true,
      percent: 100
    }, {
      id: "op-4",
      operation: "trash",
      label: "Moving to trash",
      alert: false,
      completed: false,
      stopped: true,
      percent: 20
    }]} operationsAlert={false} operationsCompleted={false} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The button shows the three \\\`--floating-*\\\` variables; click it to open the list, which shows the rest: **Moving files** is finished and failed, **Moving to trash** was aborted. Hover **Moving files**' clear icon for \\\`--ops-progress-icon-hover\\\`.\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}}})))()}b();export{f as CompletedOperation,v as CssCustomization,l as Default,g as DragPreview,p as MultipleOperations,h as OpensPanelOnClick,_ as RightToLeft,m as StoppedOperation,u as UploadInProgress,d as WithAlert,y as __namedExportsOrder,o as default};