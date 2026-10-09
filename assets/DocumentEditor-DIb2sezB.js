import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r}from"./blocks-D1qLjfJS.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{i as a,r as o}from"./react-qN2cStNd.js";import{a as s,i as c,n as l,o as u,r as d,t as f}from"./DocumentEditor.stories-B4csWpMT.js";function p(e){let t={code:`code`,h1:`h1`,h3:`h3`,p:`p`,pre:`pre`,...a(),...e.components};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(n,{of:l}),`
`,(0,h.jsx)(t.h1,{id:`document-editor`,children:`Document Editor`}),`
`,(0,h.jsx)(t.p,{children:"DocumentEditor wraps the `@onlyoffice/document-editor-react` component, embedding an ONLYOFFICE Document Server editor into the UI."}),`
`,(0,h.jsx)(t.h3,{id:`document-editor-sample`,children:`Document editor sample`}),`
`,(0,h.jsx)(t.p,{children:`This example opens a document in full edit mode, showing how the wrapper passes the config and callbacks to the embedded editor.`}),`
`,(0,h.jsx)(r,{of:f}),`
`,(0,h.jsx)(t.p,{children:`Mounting the editor with an ID, file ID, and fixed size. Editing is allowed by default.`}),`
`,(0,h.jsx)(t.pre,{children:(0,h.jsx)(t.code,{className:`language-tsx`,children:`<DocumentEditor id="docx-editor" fileId={1} width="100%" height="600px"/>
`})}),`
`,(0,h.jsx)(t.h3,{id:`document-viewer-sample`,children:`Document viewer sample`}),`
`,(0,h.jsx)(t.p,{children:`Demonstrates read-only viewing for a file with navigation controls enabled but editing disabled.`}),`
`,(0,h.jsx)(r,{of:c}),`
`,(0,h.jsxs)(t.p,{children:[`The same component in view-only mode via `,(0,h.jsx)(t.code,{children:`isView`}),`, with an explicit size and unique instance ID.`]}),`
`,(0,h.jsx)(t.pre,{children:(0,h.jsx)(t.code,{className:`language-tsx`,children:`<DocumentEditor id="pptx-viewer" fileId={4} isView width="100%" height="600px"/>
`})}),`
`,(0,h.jsx)(t.h3,{id:`document-editor-with-custom-event`,children:`Document editor with custom event`}),`
`,(0,h.jsx)(t.p,{children:`Demonstrates how to use custom events to interact with the editor.`}),`
`,(0,h.jsx)(r,{of:s}),`
`,(0,h.jsx)(t.pre,{children:(0,h.jsx)(t.code,{className:`language-tsx`,children:`const onDocumentReady = () => {
  const documentEditor = window.DocEditor.instances["custom-event"];
  documentEditor.showMessage("Welcome to ONLYOFFICE Editor!");
};

<DocumentEditor 
    id="custom-event"
    fileId={3} 
    width="100%" 
    height="600px"
    isView
    events_onDocumentReady={onDocumentReady} 
/>
`})}),`
`,(0,h.jsx)(t.h3,{id:`document-editor-with-auto-fill-sample`,children:`Document editor with auto-fill sample`}),`
`,(0,h.jsx)(t.p,{children:`Shows how to open a spreadsheet, pick a sheet from the selector, then auto-fill it with a chosen dataset using the Document Editor connector API.`}),`
`,(0,h.jsx)(r,{of:d}),`
`,(0,h.jsx)(t.pre,{children:(0,h.jsx)(t.code,{className:`language-tsx`,children:`const [fileId, setFileId] = useState<number | null>(null);
const [isReady, setIsReady] = useState(false);

const onDocumentReady = () => {
  setIsReady(true);
};

const fillSpreadsheetData = () => {
  const documentEditor = window.DocEditor?.instances?.["fill-spreadsheet"];
  
  if (!documentEditor) return;

  const connector = documentEditor.createConnector();
  
  const headers = ["Name", "Position", "Department"];
  const data = [
    ["Mia", "Engineer", "Development"],
    ["John", "Designer", "Marketing"],
    ["Sarah", "Manager", "Sales"]
  ];

  connector.callCommand(() => {
    const oWorksheet = Api.GetActiveSheet();
    
    for (let i = 0; i < headers.length; i++) {
      const headerCell = oWorksheet.GetRangeByNumber(0, i);
      headerCell.SetValue(headers[i]);
      headerCell.SetBold(true);
      headerCell.SetFillColor(Api.CreateColorFromRGB(200, 200, 200));
    }
    
    for (let row = 0; row < data.length; row++) {
      for (let col = 0; col < data[row].length; col++) {
        oWorksheet.GetRangeByNumber(row + 1, col).SetValue(data[row][col]);
      }
    }
    
    oWorksheet.SetColumnWidth(0, 15);
    oWorksheet.SetColumnWidth(1, 20);
    oWorksheet.SetColumnWidth(2, 15);
  });
};

<DocumentEditor
  id="fill-spreadsheet"
  fileId={fileId}
  width="100%"
  height="600px"
  events_onDocumentReady={onDocumentReady}
/>

<Button 
  onClick={fillSpreadsheetData} 
  label="Fill Spreadsheet"
  isDisabled={!isReady}
/>
`})})]})}function m(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,h.jsx)(t,{...e,children:(0,h.jsx)(p,{...e})}):p(e)}var h;function g(){return(g=e((()=>{h=i(),o(),t(),u()})))()}g();export{m as default};