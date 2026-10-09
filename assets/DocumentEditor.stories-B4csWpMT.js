import{n as e,r as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{n as i,t as a}from"./Files-DpdTk_Fb.js";import{n as o,t as s}from"./filter-type-BC8jiSGt.js";import{n as c,r as l,t as u}from"./button-DjDXE7uo.js";import{n as d}from"./text-input-D8OFtXHj.js";import{t as f}from"./TextInput.enums-z6wZ2LJ6.js";import{a as p,i as m,n as h,t as g}from"./ComboBox-DWO8Uqxf.js";import{o as _,r as v}from"./PortalGate-ByWqEVNV.js";import{n as y,t as b}from"./ErrorContainer-BbY1erzg.js";import{n as x,t as S}from"./FileInput-B9t1Hh0z.js";import{n as C,t as w}from"./DocumentEditor-BbKjxem-.js";var T,E;function D(){return(D=e((()=>{T=[{key:`products`,label:`Product Inventory`,headers:[`ID`,`Product`,`Price`,`Available`,`Stock`],data:[[`P001`,`P002`,`P003`,`P004`,`P005`],[`Laptop`,`Mouse`,`Keyboard`,`Monitor`,`Headphones`],[999.99,29.99,79.99,299.99,149.99],[`Yes`,`Yes`,`No`,`Yes`,`Yes`],[15,150,0,25,45]]},{key:`employees`,label:`Employee List`,headers:[`ID`,`Name`,`Department`,`Position`,`Salary`],data:[[`E001`,`E002`,`E003`,`E004`,`E005`],[`John Smith`,`Jane Doe`,`Bob Johnson`,`Alice Brown`,`Charlie Wilson`],[`IT`,`HR`,`Sales`,`IT`,`Marketing`],[`Developer`,`Manager`,`Representative`,`Designer`,`Specialist`],[75e3,85e3,55e3,7e4,6e4]]},{key:`sales`,label:`Sales Report`,headers:[`Month`,`Revenue`,`Expenses`,`Profit`,`Growth %`],data:[[`January`,`February`,`March`,`April`,`May`],[125e3,138e3,152e3,145e3,168e3],[85e3,92e3,98e3,95e3,105e3],[4e4,46e3,54e3,5e4,63e3],[0,15,17.4,-7.4,26]]}],E=(e,t,n,r,i,a,o,s)=>!!(e||t||s||i||!n||r===`rooms`||!o)})))()}var O=t({Default:()=>P,FillSpreadsheetWithData:()=>L,ViewMode:()=>F,WithCustomEvent:()=>I,__namedExportsOrder:()=>R,default:()=>N}),k,A,j,M,N,P,F,I,L,R;function z(){return(z=e((()=>{k=n(),o(),C(),y(),c(),d(),x(),h(),p(),i(),D(),v(),A=r(),j=({children:e,filterParam:t=s.FilesOnly})=>{let[n,r]=(0,k.useState)(!1),[i,o]=(0,k.useState)(null);return i?(0,A.jsxs)(A.Fragment,{children:[e(i),(0,A.jsx)(u,{label:`Change file`,size:l.small,onClick:()=>o(null),style:{marginTop:`8px`}})]}):(0,A.jsxs)(A.Fragment,{children:[(0,A.jsx)(S,{fromStorage:!0,placeholder:`Choose file`,size:f.base,onClick:()=>r(!0)}),(0,A.jsx)(a,{isPanelVisible:n,onCancel:()=>r(!1),onSubmit:(e,t,n,r,i,a,s,c)=>{c?.id!==void 0&&o(Number(c.id))},submitButtonLabel:`Select`,isMultiSelect:!1,withRecentTreeFolder:!0,withFavoritesTreeFolder:!0,withAIAgentsTreeFolder:!0,openRoot:!0,withBreadCrumbs:!0,withSearch:!0,getIsDisabled:E,filterParam:t},`select-file-dialog`)]})},M=({Story:e,context:t,onLoadComponentError:n,storyKey:r})=>{let i=(0,k.useRef)(null);(0,k.useEffect)(()=>()=>{let e=i.current;if(e)for(;e.firstChild;)e.removeChild(e.firstChild)},[r]);let{filterParam:a,...o}=t.args;return(0,A.jsx)(`div`,{ref:i,children:(0,A.jsx)(e,{args:{...o,onLoadComponentError:n}},r)},r)},N={title:`Components/Document Editor`,component:w,decorators:[(e,t)=>{let[n,r]=(0,k.useState)(null),i=(0,k.useMemo)(()=>(e,t)=>{r(t)},[]);if((0,k.useEffect)(()=>{r(null)},[t.args.fileId,t.args.id]),n)return(0,A.jsx)(b,{headerText:n,bodyText:`Make sure fileId, config, and docServiceUrl are valid and reachable`,buttonText:`Try again`,onClickButton:()=>window.location.reload()});let a=`${t.args.fileId}-${t.args.id}`;return(0,A.jsx)(j,{filterParam:t.args.filterParam,children:n=>(0,A.jsx)(M,{Story:e,context:{...t,args:{...t.args,fileId:n}},onLoadComponentError:i,storyKey:a})})},_(`Document editor`,void 0,{demo:!1})],argTypes:{id:{control:`text`,description:`Unique identifier for the editor DOM element`},fileId:{control:`number`,description:`ID of the file to open in the editor`},width:{control:`text`,description:`Width of the editor container`,table:{defaultValue:{summary:`100%`}}},height:{control:`text`,description:`Height of the editor container`,table:{defaultValue:{summary:`100%`}}},shardkey:{control:`text`,description:`Shard key for Document Server load balancing`},onLoadComponentError:{action:`onLoadComponentError`,description:`Callback invoked when the component fails to load`}}},P={render:e=>(0,A.jsx)(w,{...e}),args:{id:`editor`,width:`100%`,height:`600px`}},F={render:e=>(0,A.jsx)(w,{...e}),args:{id:`viewer`,width:`100%`,height:`600px`,isView:!0}},I={render:e=>(0,A.jsx)(w,{events_onDocumentReady:()=>{window.DocEditor.instances[e.id].showMessage(`Welcome to ONLYOFFICE Editor!`)},...e}),args:{id:`custom-event`,width:`100%`,height:`600px`,isView:!0}},L={render:e=>{let[t,n]=(0,k.useState)(!1),[r,i]=(0,k.useState)({key:T[0].key,label:T[0].label}),a=()=>{n(!0)},o=()=>{let t=window.DocEditor?.instances?.[e.id],n=T.find(e=>e.key===r.key);if(t&&n)try{let e=t.createConnector();window.Asc.scope.headers=n.headers,window.Asc.scope.data=n.data,e.callCommand(()=>{let e=Asc.scope.headers,t=Asc.scope.data,n=Api.GetActiveSheet();for(let r=0;r<e.length;r++){let i=n.GetRangeByNumber(0,r);i.SetValue(e[r]),i.SetBold(!0),i.SetFillColor(Api.CreateColorFromRGB(200,200,200));let a=Array.isArray(t[r])?t[r]:[];for(let e=0;e<a.length;e++)n.GetRangeByNumber(e+1,r).SetValue(a[e])}n.SetColumnWidth(0,15),n.SetColumnWidth(1,20),n.SetColumnWidth(2,15),n.SetColumnWidth(3,15),n.SetColumnWidth(4,15)})}catch(e){t.showMessage(`Automation command failed: `+e)}},s=T.map(e=>({key:e.key,label:e.label}));return(0,A.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`,height:`100%`},children:[(0,A.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,alignItems:`center`},children:[(0,A.jsx)(g,{options:s,selectedOption:r,onSelect:e=>i(e),scaled:!1,scaledOptions:!0,size:m.huge,directionY:`bottom`,isDisabled:!t,withoutBackground:!0}),(0,A.jsx)(u,{onClick:o,label:`Fill Spreadsheet`,isDisabled:!t,size:l.small,primary:!0})]}),(0,A.jsx)(w,{events_onDocumentReady:a,...e})]})},args:{id:`fill-spreadsheet`,width:`100%`,height:`600px`,filterParam:s.SpreadsheetsOnly}},R=[`Default`,`ViewMode`,`WithCustomEvent`,`FillSpreadsheetWithData`],P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: (args: StoryArgs) => <DocumentEditor {...args} />,
  args: {
    id: "editor",
    width: "100%",
    height: "600px"
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: (args: StoryArgs) => <DocumentEditor {...args} />,
  args: {
    id: "viewer",
    width: "100%",
    height: "600px",
    isView: true
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: (args: StoryArgs) => {
    const onDocumentReady = () => {
      const documentEditor = window.DocEditor.instances[args.id];
      documentEditor.showMessage("Welcome to ONLYOFFICE Editor!");
    };
    return <DocumentEditor events_onDocumentReady={onDocumentReady} {...args} />;
  },
  args: {
    id: "custom-event",
    width: "100%",
    height: "600px",
    isView: true
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: (args: StoryArgs) => {
    const [isReady, setIsReady] = useState(false);
    const [selectedDataSet, setSelectedDataSet] = useState<TOption>({
      key: dataSets[0].key,
      label: dataSets[0].label
    });
    const onDocumentReady = () => {
      setIsReady(true);
    };
    const fillSpreadsheetData = () => {
      // @ts-ignore - DocEditor is provided by ONLYOFFICE at runtime
      const documentEditor = window.DocEditor?.instances?.[args.id];
      const currentDataSet = dataSets.find(ds => ds.key === selectedDataSet.key);
      if (!documentEditor || !currentDataSet) return;
      try {
        const connector = documentEditor.createConnector();

        // @ts-ignore - Asc.scope is provided by ONLYOFFICE connector API
        window.Asc.scope.headers = currentDataSet.headers;
        // @ts-ignore - Asc.scope is provided by ONLYOFFICE connector API
        window.Asc.scope.data = currentDataSet.data;
        connector.callCommand(() => {
          // @ts-ignore - Asc.scope is provided by ONLYOFFICE connector API
          const headers = Asc.scope.headers;
          // @ts-ignore - Asc.scope is provided by ONLYOFFICE connector API
          const data = Asc.scope.data;

          // @ts-ignore - Api is provided by ONLYOFFICE connector API
          const oWorksheet = Api.GetActiveSheet();
          for (let i = 0; i < headers.length; i++) {
            const headerCell = oWorksheet.GetRangeByNumber(0, i);
            headerCell.SetValue(headers[i]);
            headerCell.SetBold(true);
            // @ts-ignore - Api is provided by ONLYOFFICE connector API
            headerCell.SetFillColor(Api.CreateColorFromRGB(200, 200, 200));
            const columnData = Array.isArray(data[i]) ? data[i] : [];
            for (let j = 0; j < columnData.length; j++) {
              oWorksheet.GetRangeByNumber(j + 1, i).SetValue(columnData[j]);
            }
          }
          oWorksheet.SetColumnWidth(0, 15);
          oWorksheet.SetColumnWidth(1, 20);
          oWorksheet.SetColumnWidth(2, 15);
          oWorksheet.SetColumnWidth(3, 15);
          oWorksheet.SetColumnWidth(4, 15);
        });
      } catch (error) {
        documentEditor.showMessage("Automation command failed: " + error);
      }
    };
    const dataSetOptions: TOption[] = dataSets.map(ds => ({
      key: ds.key,
      label: ds.label
    }));
    return <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      height: "100%"
    }}>
        <div style={{
        display: "flex",
        gap: "8px",
        alignItems: "center"
      }}>
          <ComboBox options={dataSetOptions} selectedOption={selectedDataSet} onSelect={option => setSelectedDataSet(option)} scaled={false} scaledOptions size={ComboBoxSize.huge} directionY="bottom" isDisabled={!isReady} withoutBackground />
          <Button onClick={fillSpreadsheetData} label="Fill Spreadsheet" isDisabled={!isReady} size={ButtonSize.small} primary />
        </div>
        <DocumentEditor events_onDocumentReady={onDocumentReady} {...args} />
      </div>;
  },
  args: {
    id: "fill-spreadsheet",
    width: "100%",
    height: "600px",
    filterParam: FilterType.SpreadsheetsOnly
  }
}`,...L.parameters?.docs?.source}}}})))()}export{I as a,F as i,O as n,z as o,L as r,P as t};