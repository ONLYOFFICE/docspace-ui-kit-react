import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{r,t as i}from"./text-Cz_cI6Yf.js";import{n as a,t as o}from"./common-icons-style-Dik-NKVV.js";import{n as s,r as c}from"./Avatar.enums-D3mbkRzL.js";import{r as l,t as u}from"./avatar-B92H6Cjq.js";import{n as d,t as f}from"./badge-DpBv0vYH.js";import{a as p,i as m,n as ee,t as te}from"./ComboBox-DWO8Uqxf.js";import{n as h,t as g}from"./catalog.folder.react-VUpu0ofJ.js";import{n as _,t as v}from"./catalog.folder.react-BLNaFnHq.js";import{n as y,t as b}from"./row-Dfhw8hpY.js";var x;function S(){return(S=e((()=>{x=`data:image/svg+xml,%3csvg%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M6.97%2012.91L1%206.94L2.94%205L6.97%209.03L13%203L14.94%204.94L6.97%2012.91Z'%20fill='black'/%3e%3c/svg%3e`})))()}var C,w;function T(){return(T=e((()=>{C=`_catalogFolderIcon_r6pwg_1`,w={catalogFolderIcon:C}})))()}var E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{t(),_(),h(),S(),a(),l(),d(),ee(),p(),r(),y(),T(),E=n(),D=t(),{fn:O}=__STORYBOOK_MODULE_TEST__,{useArgs:k}=__STORYBOOK_MODULE_PREVIEW_API__,A={title:`UI/Rows/Row`,component:b,parameters:{},argTypes:{checked:{control:`boolean`,description:"Whether the checkbox is ticked. Passing the prop at all is what renders the checkbox: `false` gives an unticked box, leaving it out gives none"},indeterminate:{control:`boolean`,description:`Draws the checkbox half-ticked, for a group that is partly selected`},isDisabled:{control:`boolean`,description:`Greys out the checkbox and stops it from changing; the rest of the row stays clickable and the context menu still opens`},element:{control:`select`,options:[``,`Avatar`,`Icon`,`ComboBox`],description:`Element at the start of the row, such as an avatar or a file icon. Passing the prop at all is what reserves its place`},mode:{control:`select`,options:[`default`,`modern`],description:"`modern` shows the start element in the checkbox's place and swaps it for the checkbox on hover or once the row is checked; it renders neither unless both `checked` and `element` are passed",table:{defaultValue:{summary:`"default"`}}},children:{control:!1,description:"The row's content, normally a `RowContent`. The context menu's header is built from the `item` prop of this element"},contextOptions:{control:`object`,description:`Items of the context menu. An empty list, or none, leaves an empty space where the three-dot button would be`},getContextModel:{control:!1,description:"Builds the context menu's items at the moment it opens, in place of `contextOptions`"},data:{control:`object`,description:"Any value handed back to `onSelect`. When it holds `contextOptions`, those are the menu's items instead of the row's own"},contextTitle:{control:`text`,description:`Tooltip shown on hovering the three-dot button`},badgesComponent:{control:!1,description:"Element placed after the content, before `contentElement`, for badges of your own"},contentElement:{control:!1,description:`Element placed after the badges, right before the three-dot button`},contextButtonSpacerWidth:{control:`text`,description:`Meant as the width kept for the three-dot button, as a CSS length; no style reads it at present, so changing it changes nothing on the page`,table:{defaultValue:{summary:`"26px"`}}},inProgress:{control:`boolean`,description:`Replaces the checkbox and the start element with a spinner; the content and the three-dot button stay`},isIndexEditingMode:{control:`boolean`,description:`Replaces the three-dot button with an up and a down arrow for moving the row`},withoutBorder:{control:`boolean`,description:`Removes the one-pixel divider under the row`,table:{defaultValue:{summary:`false`}}},isRoom:{control:`boolean`,description:"Draws the context menu's header in its room form, with the logo or cover from the content's `item`"},isArchive:{control:`boolean`,description:`Draws the context menu's header in its archived form`},badgeUrl:{control:`text`,description:`URL of a badge image shown in the context menu's header`},className:{control:`text`,description:`Class added to the row element`},dataTestId:{control:`text`,description:"Value of `data-testid` on the row element",table:{defaultValue:{summary:`"row"`}}},onSelect:{control:!1,description:"Called when the checkbox is clicked, with the new checked state and the row's `data`; on a touch device a tap on the start element in the modern layout calls it with `true`"},onRowClick:{control:!1,description:`Called on a click on the content, and in the default layout on the start element; a click on the checkbox, the badges or the three-dot button does not call it`},onContextClick:{control:!1,description:"Called when the context menu is asked for, with `true` when that was a right-click"},rowContextClose:{control:!1,description:`Called when the context menu closes`},onChangeIndex:{control:!1,description:`Called with the direction when the up or down arrow of index editing is clicked`},id:{control:!1,description:"Ignored: nothing reads it and no `id` reaches the page"},style:{control:!1,description:`Ignored: nothing reads it and no inline style reaches the page`},item:{control:!1,description:"Ignored: the context menu's header is read from the content's own `item` prop"}}},j=(0,E.jsx)(u,{size:c.min,role:s.user,source:``,userName:`Demo Avatar`}),M=(0,E.jsx)(v,{className:w.catalogFolderIcon,"data-size":o.big}),N=e=>(0,E.jsx)(te,{options:[{key:1,label:`Open`},{key:2,icon:x,label:`Closed`}],onSelect:t=>{e?.(t)},selectedOption:{key:0,label:``},scaled:!1,size:m.content,isDisabled:!1}),P=[{key:`key1`,label:`Edit`},{key:`key2`,label:`Delete`}],F=({onCheckedChange:e,...t})=>{let{checked:n,element:r}=t,a=(e=>e===`Avatar`?{element:j}:e===`Icon`?{element:M}:e===`ComboBox`?{element:N()}:{})(r),o={checked:n},{element:s,...c}=t;return(0,D.createElement)(b,{...c,key:`1`,...o,...a,contextOptions:t.contextOptions??P,onSelect:(n,r)=>{t.onSelect?.(n,r),e?.(n)}},(0,E.jsx)(i,{truncate:!0,children:`Sample text`}))},I=e=>{let[,t]=k();return(0,E.jsx)(F,{...e,onCheckedChange:e=>t({checked:e})})},L={render:I,args:{checked:!0,isIndexEditingMode:!1,element:`Avatar`,contextTitle:`Actions`,onSelect:O(),onRowClick:O(),onContextClick:O(),rowContextClose:O()},parameters:{docs:{description:{story:`The row as a file list shows it: click the checkbox to tick and untick it, click the text, open the menu from the three-dot button or with a right-click anywhere on the row, and watch each call in the Actions panel. Change any other prop live in the Controls panel below.`},source:{code:`<Row
  checked={true}
  isIndexEditingMode={false}
  element={<Avatar size={AvatarSize.min} role={AvatarRole.user} userName="Demo Avatar" />}
  contextTitle="Actions"
  onSelect={(checked) => setChecked(checked)}
  onRowClick={handleRowClick}
  contextOptions={[
    { key: "key1", label: "Edit" },
    { key: "key2", label: "Delete" },
  ]}
>
  <Text truncate>Sample text</Text>
</Row>`}}}},R={render:I,args:{mode:`modern`,checked:!1,element:`Icon`,onSelect:O()},parameters:{docs:{description:{story:'A row that keeps its start element where the checkbox would be, so an unselected list shows icons rather than a column of empty boxes (`mode="modern"`). Hover the icon and the checkbox takes its place; tick it and the checkbox stays. Both `checked` and `element` have to be passed, or neither is shown.'},source:{code:`<Row
  mode="modern"
  checked={false}
  element={<CatalogFolderReactSvg />}
  onSelect={(checked) => setChecked(checked)}
  contextOptions={contextOptions}
>
  <Text truncate>Sample text</Text>
</Row>`}}}},z={render:e=>(0,E.jsx)(F,{...e}),args:{checked:!1,indeterminate:!0,element:`Icon`},parameters:{docs:{description:{story:"A half-ticked checkbox, for a row that stands for a group of which only some items are selected (`indeterminate`)."},source:{code:`<Row checked={false} indeterminate element={<CatalogFolderReactSvg />} contextOptions={contextOptions}>
  <Text truncate>Sample text</Text>
</Row>`}}}},B={render:e=>(0,E.jsx)(F,{...e}),args:{checked:!1,isDisabled:!0,element:`Icon`,onRowClick:O()},parameters:{docs:{description:{story:"A row that cannot be selected: the checkbox is greyed out and ignores clicks (`isDisabled`), while a click on the text still reaches `onRowClick` and the three-dot menu still opens."},source:{code:`<Row checked={false} isDisabled element={<CatalogFolderReactSvg />} contextOptions={contextOptions}>
  <Text truncate>Sample text</Text>
</Row>`}}}},V={render:e=>(0,E.jsx)(F,{...e}),args:{checked:!1,inProgress:!0,element:`Icon`},parameters:{docs:{description:{story:"A row that is busy, for example while its file is being copied: a spinner stands in for the checkbox and the icon (`inProgress`), and the text and the three-dot button stay as they are."},source:{code:`<Row checked={false} inProgress element={<CatalogFolderReactSvg />} contextOptions={contextOptions}>
  <Text truncate>Sample text</Text>
</Row>`}}}},H={render:e=>(0,E.jsx)(F,{...e}),args:{checked:!1,isIndexEditingMode:!0,element:`Icon`,onChangeIndex:O()},parameters:{docs:{description:{story:"A row whose place in a hand-ordered list is being changed: the three-dot button gives way to an up and a down arrow (`isIndexEditingMode`). Click either and the direction arrives in the Actions panel (`onChangeIndex`); moving the row is up to the host."},source:{code:`<Row
  checked={false}
  isIndexEditingMode
  element={<CatalogFolderReactSvg />}
  onChangeIndex={(action) => moveRow(action)}
>
  <Text truncate>Sample text</Text>
</Row>`}}}},U={render:e=>(0,E.jsx)(F,{...e}),args:{checked:!1,element:`Icon`,badgesComponent:(0,E.jsx)(f,{label:`New`}),contentElement:(0,E.jsx)(i,{fontSize:`12px`,children:`2 versions`})},parameters:{docs:{description:{story:"Extra information at the end of the row, before the three-dot button: the **New** badge (`badgesComponent`) and the **2 versions** note after it (`contentElement`)."},source:{code:`<Row
  checked={false}
  element={<CatalogFolderReactSvg />}
  badgesComponent={<Badge label="New" />}
  contentElement={<Text fontSize="12px">2 versions</Text>}
  contextOptions={contextOptions}
>
  <Text truncate>Sample text</Text>
</Row>`}}}},W=()=>(0,E.jsxs)(`div`,{children:[(0,E.jsx)(b,{checked:!1,element:M,contextOptions:P,children:(0,E.jsx)(i,{truncate:!0,children:`With a divider`})}),(0,E.jsx)(b,{checked:!1,element:M,contextOptions:P,withoutBorder:!0,children:(0,E.jsx)(i,{truncate:!0,children:`Without a divider`})})]}),G={render:()=>(0,E.jsx)(W,{}),parameters:{docs:{description:{story:"The last row of a list, or a row that stands alone, usually needs no divider under it: **With a divider** keeps the one-pixel line, **Without a divider** drops it (`withoutBorder`)."},source:{code:`<Row checked={false} element={<CatalogFolderReactSvg />} contextOptions={contextOptions}>
  <Text truncate>With a divider</Text>
</Row>
<Row checked={false} element={<CatalogFolderReactSvg />} contextOptions={contextOptions} withoutBorder>
  <Text truncate>Without a divider</Text>
</Row>`}}}},K=({item:e})=>(0,E.jsx)(i,{truncate:!0,children:e.title}),q=[`Open`,`Edit`,`Download`,`Rename`,`Move`,`Copy`,`Delete`].map(e=>({key:e.toLowerCase(),label:e})),J=()=>(0,E.jsx)(b,{checked:!1,element:M,contextOptions:q,children:(0,E.jsx)(K,{item:{title:`Quarterly report.docx`,icon:g}})}),Y=(e,t)=>t.viewMode===`docs`?(0,E.jsx)(`iframe`,{title:t.name,src:`iframe.html?viewMode=story&id=${t.id}`,style:{width:320,height:568,border:0}}):(0,E.jsx)(e,{}),X={globals:{viewport:{value:`mobile1`,isRotated:!1}},decorators:[Y],render:()=>(0,E.jsx)(J,{}),parameters:{docs:{description:{story:"A menu that names what it acts on, on a phone-sized screen: tap the three-dot button and a menu taller than 210px opens from the bottom of the screen under a header reading **Quarterly report.docx** with its icon. The row takes the header from the `item` prop of its content, so the content has to accept and carry one; a shorter menu, or any menu on a wide screen, opens beside the row without a header."},source:{code:`const ItemContent = ({ item }: { item: RowItemType }) => (
  <Text truncate>{item.title}</Text>
);

<Row checked={false} element={<CatalogFolderReactSvg />} contextOptions={sevenItems}>
  <ItemContent item={{ title: "Quarterly report.docx", icon: folderIconUrl }} />
</Row>`}}}},Z={render:e=>(0,E.jsx)(`div`,{dir:`rtl`,children:(0,E.jsx)(b,{checked:e.checked,element:M,contextOptions:P,badgesComponent:(0,E.jsx)(f,{label:`1`}),children:(0,E.jsx)(i,{truncate:!0,children:`مستند`})})}),args:{checked:!0},globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{description:{story:`The row in a right-to-left interface: the checkbox and the icon move to the right edge, the text starts from the right, and the badge and the three-dot button sit at the left edge.`},source:{code:`<div dir="rtl">
  <Row checked element={<CatalogFolderReactSvg />} badgesComponent={<Badge label="1" />} contextOptions={contextOptions}>
    <Text truncate>Sample text</Text>
  </Row>
</div>`},story:{inline:!1,height:`82px`}}}},Q=[`Default`,`ModernLayout`,`IndeterminateState`,`DisabledState`,`LoadingState`,`IndexEditing`,`WithBadges`,`WithoutBorder`,`ContextMenuHeader`,`RightToLeft`],L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: renderSelectable,
  args: {
    checked: true,
    isIndexEditingMode: false,
    // Cast: the \`element\` argType is a Controls-panel select of option
    // names ("Avatar" | "Icon" | "ComboBox"), not a ReactElement -- see
    // Template, which resolves the selected name to the actual element.
    element: "Avatar" as unknown as RowProps["element"],
    contextTitle: "Actions",
    onSelect: fn(),
    onRowClick: fn(),
    onContextClick: fn(),
    rowContextClose: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "The row as a file list shows it: click the checkbox to tick and untick it, click the text, open the menu from the three-dot button or with a right-click anywhere on the row, and watch each call in the Actions panel. Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Row
  checked={true}
  isIndexEditingMode={false}
  element={<Avatar size={AvatarSize.min} role={AvatarRole.user} userName="Demo Avatar" />}
  contextTitle="Actions"
  onSelect={(checked) => setChecked(checked)}
  onRowClick={handleRowClick}
  contextOptions={[
    { key: "key1", label: "Edit" },
    { key: "key2", label: "Delete" },
  ]}
>
  <Text truncate>Sample text</Text>
</Row>\`
      }
    }
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: renderSelectable,
  args: {
    mode: "modern",
    checked: false,
    element: "Icon" as unknown as RowProps["element"],
    onSelect: fn()
  },
  parameters: {
    docs: {
      description: {
        story: 'A row that keeps its start element where the checkbox would be, so an unselected list shows icons rather than a column of empty boxes (\`mode="modern"\`). Hover the icon and the checkbox takes its place; tick it and the checkbox stays. Both \`checked\` and \`element\` have to be passed, or neither is shown.'
      },
      source: {
        code: \`<Row
  mode="modern"
  checked={false}
  element={<CatalogFolderReactSvg />}
  onSelect={(checked) => setChecked(checked)}
  contextOptions={contextOptions}
>
  <Text truncate>Sample text</Text>
</Row>\`
      }
    }
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    checked: false,
    indeterminate: true,
    element: "Icon" as unknown as RowProps["element"]
  },
  parameters: {
    docs: {
      description: {
        story: "A half-ticked checkbox, for a row that stands for a group of which only some items are selected (\`indeterminate\`)."
      },
      source: {
        code: \`<Row checked={false} indeterminate element={<CatalogFolderReactSvg />} contextOptions={contextOptions}>
  <Text truncate>Sample text</Text>
</Row>\`
      }
    }
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    checked: false,
    isDisabled: true,
    element: "Icon" as unknown as RowProps["element"],
    onRowClick: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "A row that cannot be selected: the checkbox is greyed out and ignores clicks (\`isDisabled\`), while a click on the text still reaches \`onRowClick\` and the three-dot menu still opens."
      },
      source: {
        code: \`<Row checked={false} isDisabled element={<CatalogFolderReactSvg />} contextOptions={contextOptions}>
  <Text truncate>Sample text</Text>
</Row>\`
      }
    }
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    checked: false,
    inProgress: true,
    element: "Icon" as unknown as RowProps["element"]
  },
  parameters: {
    docs: {
      description: {
        story: "A row that is busy, for example while its file is being copied: a spinner stands in for the checkbox and the icon (\`inProgress\`), and the text and the three-dot button stay as they are."
      },
      source: {
        code: \`<Row checked={false} inProgress element={<CatalogFolderReactSvg />} contextOptions={contextOptions}>
  <Text truncate>Sample text</Text>
</Row>\`
      }
    }
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    checked: false,
    isIndexEditingMode: true,
    element: "Icon" as unknown as RowProps["element"],
    onChangeIndex: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "A row whose place in a hand-ordered list is being changed: the three-dot button gives way to an up and a down arrow (\`isIndexEditingMode\`). Click either and the direction arrives in the Actions panel (\`onChangeIndex\`); moving the row is up to the host."
      },
      source: {
        code: \`<Row
  checked={false}
  isIndexEditingMode
  element={<CatalogFolderReactSvg />}
  onChangeIndex={(action) => moveRow(action)}
>
  <Text truncate>Sample text</Text>
</Row>\`
      }
    }
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    checked: false,
    element: "Icon" as unknown as RowProps["element"],
    badgesComponent: <Badge label="New" />,
    contentElement: <Text fontSize="12px">2 versions</Text>
  },
  parameters: {
    docs: {
      description: {
        story: "Extra information at the end of the row, before the three-dot button: the **New** badge (\`badgesComponent\`) and the **2 versions** note after it (\`contentElement\`)."
      },
      source: {
        code: \`<Row
  checked={false}
  element={<CatalogFolderReactSvg />}
  badgesComponent={<Badge label="New" />}
  contentElement={<Text fontSize="12px">2 versions</Text>}
  contextOptions={contextOptions}
>
  <Text truncate>Sample text</Text>
</Row>\`
      }
    }
  }
}`,...U.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: () => <WithoutBorderTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The last row of a list, or a row that stands alone, usually needs no divider under it: **With a divider** keeps the one-pixel line, **Without a divider** drops it (\`withoutBorder\`)."
      },
      source: {
        code: \`<Row checked={false} element={<CatalogFolderReactSvg />} contextOptions={contextOptions}>
  <Text truncate>With a divider</Text>
</Row>
<Row checked={false} element={<CatalogFolderReactSvg />} contextOptions={contextOptions} withoutBorder>
  <Text truncate>Without a divider</Text>
</Row>\`
      }
    }
  }
}`,...G.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  globals: {
    viewport: {
      value: "mobile1",
      isRotated: false
    }
  },
  decorators: [withPhoneFrame],
  render: () => <ContextMenuHeaderTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A menu that names what it acts on, on a phone-sized screen: tap the three-dot button and a menu taller than 210px opens from the bottom of the screen under a header reading **Quarterly report.docx** with its icon. The row takes the header from the \`item\` prop of its content, so the content has to accept and carry one; a shorter menu, or any menu on a wide screen, opens beside the row without a header."
      },
      source: {
        code: \`const ItemContent = ({ item }: { item: RowItemType }) => (
  <Text truncate>{item.title}</Text>
);

<Row checked={false} element={<CatalogFolderReactSvg />} contextOptions={sevenItems}>
  <ItemContent item={{ title: "Quarterly report.docx", icon: folderIconUrl }} />
</Row>\`
      }
    }
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <Row checked={args.checked} element={elementIcon} contextOptions={defaultContextOptions} badgesComponent={<Badge label="1" />}>
        <Text truncate>{"مستند"}</Text>
      </Row>
    </div>,
  args: {
    checked: true
  },
  globals: {
    direction: "rtl"
  },
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story: "The row in a right-to-left interface: the checkbox and the icon move to the right edge, the text starts from the right, and the badge and the three-dot button sit at the left edge."
      },
      source: {
        code: \`<div dir="rtl">
  <Row checked element={<CatalogFolderReactSvg />} badgesComponent={<Badge label="1" />} contextOptions={contextOptions}>
    <Text truncate>Sample text</Text>
  </Row>
</div>\`
      },
      // Framed so the RTL direction it stamps on <html> stays out of the Docs page
      story: {
        inline: false,
        height: "82px"
      }
    }
  }
}`,...Z.parameters?.docs?.source}}}})))()}$();export{X as ContextMenuHeader,L as Default,B as DisabledState,z as IndeterminateState,H as IndexEditing,V as LoadingState,R as ModernLayout,Z as RightToLeft,U as WithBadges,G as WithoutBorder,Q as __namedExportsOrder,A as default};