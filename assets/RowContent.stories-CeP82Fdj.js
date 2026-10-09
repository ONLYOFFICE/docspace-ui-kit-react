import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{n as i,t as a}from"./globalColors-fkBUxSeV.js";import{r as o,t as s}from"./text-Cz_cI6Yf.js";import{n as c,t as l}from"./common-icons-style-Dik-NKVV.js";import{i as u,n as d,t as f}from"./link-C_nB54e7.js";import{n as p,t as m}from"./checkbox-CMveAvkq.js";import{n as h,t as g}from"./catalog.folder.react-BLNaFnHq.js";import{n as _,t as v}from"./row-content-DmK_ooH1.js";var y,b;function x(){return(x=e((()=>{y=`_catalogFolderIcon_r6pwg_1`,b={catalogFolderIcon:y}})))()}var S,C,w,T,E,D,O,k,A,j,M,N,P;function F(){return(F=e((()=>{S=t(n()),h(),c(),d(),p(),o(),_(),i(),x(),C=r(),{fn:w}=__STORYBOOK_MODULE_TEST__,T={title:`UI/Rows/RowContent`,component:v,parameters:{},argTypes:{children:{control:!1,description:`The row's parts, by position: the first is the title, the second sits beside it, and the text of every later child is joined into the line under the title while the child itself is not shown. It has to be an array of at least two`},disableSideInfo:{control:`boolean`,description:`Drops the line of details under the title, leaving the title and what sits beside it`,table:{defaultValue:{summary:`false`}}},convertSideInfo:{control:`boolean`,description:`Whether the last child is joined into the details line as text like the others. Turn it off to show it at the end of that line as the element it is, such as a link`,table:{defaultValue:{summary:`true`}}},sideColor:{control:`color`,description:`Any CSS colour for the text of the details line`},sectionWidth:{control:`number`,description:`Meant to switch the content to a layout for a given section width; no style reads it at present, so changing it changes nothing on the page`},onClick:{control:!1,description:`Called on a click anywhere in the content`},className:{control:`text`,description:`Class added to the content element`},id:{control:`text`,description:`Id of the content element`},style:{control:`object`,description:`Inline style applied to the content element, and again to the wrapper around the title and its icons`}}},E=(0,C.jsx)(g,{className:b.catalogFolderIcon,"data-size":l.small}),D=e=>(0,C.jsxs)(v,{...e,children:[(0,C.jsx)(s,{fontSize:`15px`,fontWeight:600,truncate:!0,children:`Quarterly report.docx`}),E,(0,C.jsx)(s,{children:`Modified today`}),(0,C.jsx)(s,{children:`24 KB`}),(0,C.jsx)(f,{type:u.action,fontSize:`12px`,children:`Version 2`})]}),O={render:e=>(0,C.jsx)(D,{...e}),args:{disableSideInfo:!1,convertSideInfo:!0,onClick:w()},parameters:{docs:{description:{story:"The content of one file row: the title, a status icon beside it, and the details **Modified today**, **24 KB** and **Version 2** joined into one line under them. Click anywhere in it to see `onClick` in the Actions panel, and change any other prop live in the Controls panel below."},source:{code:`<RowContent onClick={handleClick}>
  <Text fontSize="15px" fontWeight={600} truncate>Quarterly report.docx</Text>
  <CatalogFolderReactSvg />
  <Text>Modified today</Text>
  <Text>24 KB</Text>
  <Link type={LinkType.action} fontSize="12px">Version 2</Link>
</RowContent>`}}}},k={render:e=>(0,C.jsx)(D,{...e}),args:{convertSideInfo:!1},parameters:{docs:{description:{story:"A details line that ends in something to click: **Version 2** stays a link at the end of the line instead of being joined in as plain text (`convertSideInfo` off). It follows the joined text directly, with no bar or space before it, and only the last child is kept this way."},source:{code:`<RowContent convertSideInfo={false}>
  <Text fontSize="15px" fontWeight={600} truncate>Quarterly report.docx</Text>
  <CatalogFolderReactSvg />
  <Text>Modified today</Text>
  <Text>24 KB</Text>
  <Link type={LinkType.action} fontSize="12px">Version 2</Link>
</RowContent>`}}}},A={render:e=>(0,C.jsx)(D,{...e}),args:{sideColor:a.gray},parameters:{docs:{description:{story:"Details that step back from the title: the joined line is drawn in grey (`sideColor`) while the title keeps its own colour."},source:{code:`<RowContent sideColor="#A3A9AE">
  <Text fontSize="15px" fontWeight={600} truncate>Quarterly report.docx</Text>
  <CatalogFolderReactSvg />
  <Text>Modified today</Text>
  <Text>24 KB</Text>
</RowContent>`}}}},j=()=>{let[e,t]=(0,S.useState)(!1);return(0,C.jsxs)(v,{disableSideInfo:!0,children:[(0,C.jsx)(s,{fontSize:`15px`,fontWeight:600,truncate:!0,children:`Quarterly report.docx`}),(0,C.jsx)(m,{id:`1`,name:`sample`,isChecked:e,onChange:()=>{t(!e)}})]})},M={render:()=>(0,C.jsx)(j,{}),parameters:{docs:{description:{story:"A row that needs only its title and a control of its own: the checkbox takes the place of the title icons, and there is no details line under them (`disableSideInfo`)."},source:{code:`<RowContent disableSideInfo>
  <Text fontSize="15px" fontWeight={600} truncate>Quarterly report.docx</Text>
  <Checkbox isChecked={isChecked} onChange={() => setIsChecked(!isChecked)} />
</RowContent>`}}}},N={render:()=>(0,C.jsx)(`div`,{dir:`rtl`,children:(0,C.jsxs)(v,{children:[(0,C.jsx)(s,{fontSize:`15px`,fontWeight:600,truncate:!0,children:`مستند`}),E,(0,C.jsx)(s,{children:`اليوم`}),(0,C.jsx)(s,{children:`24 KB`})]})}),globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{description:{story:`The content in a right-to-left interface: the title and its icon start at the right edge, and the details are joined in reverse order, so reading from the right the last of them, **24 KB**, comes first.`},source:{code:`<div dir="rtl">
  <RowContent>
    <Text fontWeight={600}>Title</Text>
    <CatalogFolderReactSvg />
    <Text>Modified today</Text>
    <Text>24 KB</Text>
  </RowContent>
</div>`},story:{inline:!1,height:`72px`}}}},P=[`Default`,`ElementAtTheEnd`,`DetailsColour`,`TitleOnly`,`RightToLeft`],O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    disableSideInfo: false,
    convertSideInfo: true,
    onClick: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "The content of one file row: the title, a status icon beside it, and the details **Modified today**, **24 KB** and **Version 2** joined into one line under them. Click anywhere in it to see \`onClick\` in the Actions panel, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<RowContent onClick={handleClick}>
  <Text fontSize="15px" fontWeight={600} truncate>Quarterly report.docx</Text>
  <CatalogFolderReactSvg />
  <Text>Modified today</Text>
  <Text>24 KB</Text>
  <Link type={LinkType.action} fontSize="12px">Version 2</Link>
</RowContent>\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    convertSideInfo: false
  },
  parameters: {
    docs: {
      description: {
        story: "A details line that ends in something to click: **Version 2** stays a link at the end of the line instead of being joined in as plain text (\`convertSideInfo\` off). It follows the joined text directly, with no bar or space before it, and only the last child is kept this way."
      },
      source: {
        code: \`<RowContent convertSideInfo={false}>
  <Text fontSize="15px" fontWeight={600} truncate>Quarterly report.docx</Text>
  <CatalogFolderReactSvg />
  <Text>Modified today</Text>
  <Text>24 KB</Text>
  <Link type={LinkType.action} fontSize="12px">Version 2</Link>
</RowContent>\`
      }
    }
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    sideColor: globalColors.gray
  },
  parameters: {
    docs: {
      description: {
        story: "Details that step back from the title: the joined line is drawn in grey (\`sideColor\`) while the title keeps its own colour."
      },
      source: {
        code: \`<RowContent sideColor="#A3A9AE">
  <Text fontSize="15px" fontWeight={600} truncate>Quarterly report.docx</Text>
  <CatalogFolderReactSvg />
  <Text>Modified today</Text>
  <Text>24 KB</Text>
</RowContent>\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => <TitleOnlyTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A row that needs only its title and a control of its own: the checkbox takes the place of the title icons, and there is no details line under them (\`disableSideInfo\`)."
      },
      source: {
        code: \`<RowContent disableSideInfo>
  <Text fontSize="15px" fontWeight={600} truncate>Quarterly report.docx</Text>
  <Checkbox isChecked={isChecked} onChange={() => setIsChecked(!isChecked)} />
</RowContent>\`
      }
    }
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl">
      <RowContent>
        <Text fontSize="15px" fontWeight={600} truncate>
          {"مستند"}
        </Text>
        {titleIcon}
        <Text>{"اليوم"}</Text>
        <Text>24 KB</Text>
      </RowContent>
    </div>,
  globals: {
    direction: "rtl"
  },
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story: "The content in a right-to-left interface: the title and its icon start at the right edge, and the details are joined in reverse order, so reading from the right the last of them, **24 KB**, comes first."
      },
      source: {
        code: \`<div dir="rtl">
  <RowContent>
    <Text fontWeight={600}>Title</Text>
    <CatalogFolderReactSvg />
    <Text>Modified today</Text>
    <Text>24 KB</Text>
  </RowContent>
</div>\`
      },
      // Framed so the RTL direction it stamps on <html> stays out of the Docs page
      story: {
        inline: false,
        height: "72px"
      }
    }
  }
}`,...N.parameters?.docs?.source}}}})))()}F();export{O as Default,A as DetailsColour,k as ElementAtTheEnd,N as RightToLeft,M as TitleOnly,P as __namedExportsOrder,T as default};