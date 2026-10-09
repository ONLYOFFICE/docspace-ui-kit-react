import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./search-input-D6xoBkvM.js";import{n as a}from"./text-input-D8OFtXHj.js";import{t as o}from"./TextInput.enums-z6wZ2LJ6.js";import{n as s,t as c}from"./catalog.folder.react-VUpu0ofJ.js";var l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{l=t(),s(),a(),r(),u=n(),{fn:d}=__STORYBOOK_MODULE_TEST__,f=[{key:0,label:`New document`,icon:c},{key:1,label:`New spreadsheet`,icon:c},{key:2,label:`New presentation`,icon:c},{key:3,label:`Master form`,icon:c,items:[{key:4,label:`From blank`},{key:5,label:`From an existing text file`}]},{key:6,label:`New folder`,icon:c},{key:7,isSeparator:!0},{key:8,label:`Upload`,icon:c}],p={title:`UI/Form controls/SearchInput`,component:i,parameters:{design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=58-2238&mode=design&t=TBNCKMQKQMxr44IZ-0`}},argTypes:{size:{control:`select`,options:Object.values(o),description:`Height and text size of the field, one of the kit's input sizes; required, with no default`},value:{control:`text`,description:`The search term. The field keeps its own copy while the user types and takes this value again whenever it changes`,table:{defaultValue:{summary:`""`}}},isDisabled:{control:`boolean`,description:`Greys the field, blocks typing and hides both the magnifier and the cross`,table:{defaultValue:{summary:`false`}}},showClearButton:{control:`boolean`,description:`Shows the cross on an empty field too; while the field holds text the cross is shown either way`,table:{defaultValue:{summary:`false`}}},autoRefresh:{control:`boolean`,description:"Whether typing calls `onChange` at all. Off does not make the callback immediate: the component stops calling it",table:{defaultValue:{summary:`true`}}},refreshTimeout:{control:`number`,description:"Milliseconds the user has to stop typing before `onChange` is called",table:{defaultValue:{summary:`1000`}}},scale:{control:`boolean`,description:`Stretches the field to the full width of its container`,table:{defaultValue:{summary:`false`}}},placeholder:{control:`text`,description:`Text shown in the empty field`},onChange:{description:"Called with the typed string, not the change event, once typing pauses; never called for the clear button or when `autoRefresh` is off"},onClearSearch:{description:`Called when the cross is clicked; the only signal that the field is now empty`},onClick:{description:`Called when the text field is clicked`},onFocus:{description:`Called when the text field receives focus`},children:{control:!1,description:`Content shown inside the field, before the text`},showMainButton:{control:`boolean`,description:"Places the button described by `mainButtonProps` to the left of the field; nothing is shown without those props",table:{defaultValue:{summary:`false`}}},mainButtonProps:{control:!1,description:"Props of the button to the left of the field: its text, its dropdown `model`, `isDisabled`; its arrow is always hidden"},mainButtonIcon:{control:!1,description:`Icon shown in that button before its text, 12 by 12 pixels`,table:{defaultValue:{summary:`plus icon`}}},mainButtonDataTestId:{control:`text`,description:"Value of `data-testid` on the button's wrapper"},dataTestId:{control:`text`,description:"Value of `data-testid` on the outer element",table:{defaultValue:{summary:`"search-input"`}}},id:{control:`text`,description:"HTML `id` of the outer element and of the text field"},name:{control:`text`,description:"HTML `name` of the text field"},tabIndex:{control:`number`,description:"HTML `tabindex` of the text field",table:{defaultValue:{summary:`-1`}}},forwardedRef:{control:!1,description:"Ref to the text field's `<input>` element"},className:{control:`text`,description:`Class added to the outer element`},style:{control:`object`,description:`Inline style of the outer element`}},args:{onChange:d(),onClearSearch:d(),onClick:d(),onFocus:d()}},m=e=>(0,u.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(280px, 1fr))`,gridGap:`16px`,alignItems:`center`},children:e.children}),h=e=>{let{initialValue:t=``,size:n=o.base,placeholder:r=`Search`,showReported:a=!1,...s}=e,[c,d]=(0,l.useState)(t),f=(0,u.jsx)(i,{size:n,value:c,onChange:e=>d(e),showClearButton:!!c,onClearSearch:()=>d(``),placeholder:r,...s});return a?(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:[f,(0,u.jsxs)(`span`,{children:[`Reported to the parent: "`,c,`"`]})]}):f},g={render:e=>{let[t,n]=(0,l.useState)(e.value||``);return(0,u.jsx)(`div`,{style:{width:`300px`},children:(0,u.jsx)(i,{...e,value:t,onChange:t=>{n(t),e.onChange?.(t)},onClearSearch:()=>{n(``),e.onClearSearch?.()}})})},args:{id:`default-search`,isDisabled:!1,size:o.base,scale:!1,placeholder:`Search`,value:``},parameters:{docs:{description:{story:"A search field as it first appears above a list: type to see the magnifier turn into a cross, pause for a second to see `onChange` in the Actions panel, click the cross to see `onClearSearch`; change any other prop live in the Controls panel below."},source:{code:`const [term, setTerm] = useState("");

<SearchInput
  size={InputSize.base}
  value={term}
  placeholder="Search"
  onChange={(value) => setTerm(value)}
  onClearSearch={() => setTerm("")}
/>`}}}},_=()=>(0,u.jsxs)(m,{children:[(0,u.jsx)(h,{size:o.base,initialValue:`Base size`}),(0,u.jsx)(h,{size:o.middle,initialValue:`Middle size`}),(0,u.jsx)(h,{size:o.large,initialValue:`Large size`})]}),v={render:()=>(0,u.jsx)(_,{}),parameters:{docs:{description:{story:"Match the search field to the inputs around it: **Base size** and **Middle size** share the 13px text, **Large size** is taller with 16px text (`size`)."},source:{code:`<SearchInput size={InputSize.base} value="Base size" />
<SearchInput size={InputSize.middle} value="Middle size" />
<SearchInput size={InputSize.large} value="Large size" />`}}}},y=()=>(0,u.jsxs)(m,{children:[(0,u.jsx)(h,{initialValue:`Normal`}),(0,u.jsx)(h,{initialValue:`Disabled`,isDisabled:!0}),(0,u.jsx)(h,{initialValue:`Scaled`,scale:!0}),(0,u.jsx)(h,{placeholder:`Empty with placeholder`})]}),b={render:()=>(0,u.jsx)(y,{}),parameters:{docs:{description:{story:"The looks a search field takes on a page. **Normal** holds text, so it shows the cross that clears it. **Disabled** is greyed, cannot be typed into and shows neither magnifier nor cross (`isDisabled`). **Scaled** fills the width of its container (`scale`); in this grid every field already fills its cell, so the difference shows in a wider container. **Empty with placeholder** shows the magnifier and the placeholder text."},source:{code:`<SearchInput value="Normal" />
<SearchInput value="Disabled" isDisabled />
<SearchInput value="Scaled" scale />
<SearchInput placeholder="Empty with placeholder" value="" />`}}}},x=()=>(0,u.jsxs)(m,{children:[(0,u.jsx)(h,{placeholder:`Type to auto-refresh (1s)`,autoRefresh:!0,refreshTimeout:1e3,showReported:!0}),(0,u.jsx)(h,{placeholder:`No auto-refresh`,autoRefresh:!1,showReported:!0})]}),S={render:()=>(0,u.jsx)(x,{}),parameters:{docs:{description:{story:"Decide how the parent hears about the search term. Type into **Type to auto-refresh (1s)**: the line under it catches up a second after you stop (`autoRefresh`, `refreshTimeout`). Type into **No auto-refresh**: the line under it never changes, because with `autoRefresh` off the component does not call `onChange` at all."},source:{code:`// With auto-refresh (1s timeout)
<SearchInput
  autoRefresh
  refreshTimeout={1000}
  placeholder="Type to auto-refresh"
/>

// Without auto-refresh: onChange is never called
<SearchInput autoRefresh={false} placeholder="No auto-refresh" />`}}}},C={render:e=>{let[t,n]=(0,l.useState)(e.value||``),r={text:`Create`,model:[]};return(0,u.jsx)(`div`,{style:{width:`500px`},children:(0,u.jsx)(i,{...e,value:t,onChange:t=>{n(t),e.onChange?.(t)},onClearSearch:()=>{n(``),e.onClearSearch?.()},mainButtonProps:r})})},args:{size:o.base,value:``,scale:!0,placeholder:`Search`,showMainButton:!0},parameters:{docs:{description:{story:"Put the create action next to the search it belongs with: the **Create** button with its plus icon sits to the left of the field (`showMainButton`, `mainButtonProps`), and the field takes the rest of the row."},source:{code:`<SearchInput
  size={InputSize.base}
  value={term}
  scale
  placeholder="Search"
  showMainButton
  mainButtonProps={{ text: "Create", model: [] }}
  onChange={(value) => setTerm(value)}
  onClearSearch={() => setTerm("")}
/>`}}}},w={render:e=>{let[t,n]=(0,l.useState)(e.value||``),r={text:`New`,model:f};return(0,u.jsx)(`div`,{style:{width:`500px`},children:(0,u.jsx)(i,{...e,value:t,onChange:t=>{n(t),e.onChange?.(t)},onClearSearch:()=>{n(``),e.onClearSearch?.()},mainButtonProps:r})})},args:{size:o.base,value:``,scale:!0,placeholder:`Search`,showMainButton:!0},parameters:{docs:{description:{story:"Offer several things to create from one button: click **New** to open its menu of items, one of them with a submenu (`model` in `mainButtonProps`)."},source:{code:`<SearchInput
  size={InputSize.base}
  value={term}
  scale
  placeholder="Search"
  showMainButton
  mainButtonProps={{
    text: "New",
    model: [
      { key: 0, label: "New document", icon: FolderIconUrl },
      { key: 1, label: "New spreadsheet", icon: FolderIconUrl },
      { key: 7, isSeparator: true },
      { key: 8, label: "Upload", icon: FolderIconUrl },
    ],
  }}
  onChange={(value) => setTerm(value)}
  onClearSearch={() => setTerm("")}
/>`}}}},T={render:()=>(0,u.jsxs)(m,{children:[(0,u.jsx)(h,{placeholder:`Cross on an empty field`,showClearButton:!0}),(0,u.jsx)(h,{placeholder:`Magnifier on an empty field`})]}),parameters:{docs:{description:{story:"Keep a way out of a search the parent still applies after the field was emptied: **Cross on an empty field** shows the cross with no text in it (`showClearButton`), **Magnifier on an empty field** is the usual look. With text in the field both show the cross."},source:{code:`<SearchInput size={InputSize.base} value="" showClearButton placeholder="Cross on an empty field" />
<SearchInput size={InputSize.base} value="" placeholder="Magnifier on an empty field" />`}}}},E={render:()=>(0,u.jsx)(m,{children:(0,u.jsx)(h,{placeholder:`Search in this folder`,children:(0,u.jsx)(`img`,{src:c,alt:``,width:16,height:16})})}),parameters:{docs:{description:{story:"Show what the search is limited to without a separate label: the folder icon sits inside the field, before the text (`children`)."},source:{code:`<SearchInput size={InputSize.base} value={term} placeholder="Search in this folder" onChange={setTerm}>
  <img src={folderIconUrl} alt="" width={16} height={16} />
</SearchInput>`}}}},D={render:e=>(0,u.jsx)(`div`,{style:{width:`500px`},children:(0,u.jsx)(i,{...e,mainButtonProps:{text:`Create`,model:[],isDisabled:!0}})}),args:{size:o.base,value:``,scale:!0,placeholder:`Search`,showMainButton:!0},parameters:{docs:{description:{story:"Keep the create action in place while it is unavailable: the **Create** button is dimmed (`isDisabled` in `mainButtonProps`), the search field next to it still works."},source:{code:`<SearchInput
  size={InputSize.base}
  value={term}
  scale
  placeholder="Search"
  showMainButton
  mainButtonProps={{ text: "Create", model: [], isDisabled: true }}
  onChange={(value) => setTerm(value)}
/>`}}}},O={render:()=>(0,u.jsx)(`div`,{dir:`rtl`,style:{width:`500px`},children:(0,u.jsx)(i,{size:o.base,value:`بحث`,scale:!0,placeholder:`بحث`,showMainButton:!0,mainButtonProps:{text:`Create`,model:[]},onChange:()=>{}})}),globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`58px`},description:{story:'The same field under a right-to-left interface: the **Create** button moves to the right edge, the cross moves to the left end of the field and the text starts at the right. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.'},source:{code:`<div dir="rtl">
  <SearchInput
    size={InputSize.base}
    value={term}
    scale
    placeholder="بحث"
    showMainButton
    mainButtonProps={{ text: "Create", model: [] }}
    onChange={(value) => setTerm(value)}
  />
</div>`}}}},k={render:()=>(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`,width:`300px`,"--text-input-bg":`#f5f3ff`,"--text-input-border-color":`#7c3aed`,"--text-input-border-hover":`#4c1d95`,"--text-input-border-focus":`#c4b5fd`,"--text-input-color":`#4c1d95`,"--text-input-radius":`8px`,"--search-input-icon-fill":`#7c3aed`,"--search-input-icon-filled-fill":`#db2777`,"--search-input-gap":`24px`},children:[(0,u.jsx)(i,{size:o.base,placeholder:`Custom styled search`,value:``,onChange:()=>{}}),(0,u.jsx)(i,{size:o.base,placeholder:`With value`,value:`Search term`,onChange:()=>{}}),(0,u.jsx)(i,{size:o.base,placeholder:`With button`,value:``,scale:!0,showMainButton:!0,mainButtonProps:{text:`Create`,model:[]},onChange:()=>{}})]}),parameters:{docs:{description:{story:`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

**Custom styled search** is empty and shows the magnifier color; **With value** holds text and shows the cross color; **With button** carries the main button, for the gap. Hover a field and click into it to see the two other border colors.`}}}},A=[`Default`,`Sizes`,`States`,`AutoRefreshMode`,`WithButton`,`WithButtonAndMenu`,`PersistentClearButton`,`ContentBeforeText`,`DisabledMainButton`,`RightToLeft`,`CssCustomization`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = useState(args.value || "");
    return <div style={{
      width: "300px"
    }}>
        <SearchInput {...args} value={value} onChange={v => {
        setValue(v);
        args.onChange?.(v);
      }} onClearSearch={() => {
        setValue("");
        args.onClearSearch?.();
      }} />
      </div>;
  },
  args: {
    id: "default-search",
    isDisabled: false,
    size: InputSize.base,
    scale: false,
    placeholder: "Search",
    value: ""
  },
  parameters: {
    docs: {
      description: {
        story: "A search field as it first appears above a list: type to see the magnifier turn into a cross, pause for a second to see \`onChange\` in the Actions panel, click the cross to see \`onClearSearch\`; change any other prop live in the Controls panel below."
      },
      source: {
        code: \`const [term, setTerm] = useState("");

<SearchInput
  size={InputSize.base}
  value={term}
  placeholder="Search"
  onChange={(value) => setTerm(value)}
  onClearSearch={() => setTerm("")}
/>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Match the search field to the inputs around it: **Base size** and **Middle size** share the 13px text, **Large size** is taller with 16px text (\`size\`)."
      },
      source: {
        code: \`<SearchInput size={InputSize.base} value="Base size" />
<SearchInput size={InputSize.middle} value="Middle size" />
<SearchInput size={InputSize.large} value="Large size" />\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The looks a search field takes on a page. **Normal** holds text, so it shows the cross that clears it. **Disabled** is greyed, cannot be typed into and shows neither magnifier nor cross (\`isDisabled\`). **Scaled** fills the width of its container (\`scale\`); in this grid every field already fills its cell, so the difference shows in a wider container. **Empty with placeholder** shows the magnifier and the placeholder text."
      },
      source: {
        code: \`<SearchInput value="Normal" />
<SearchInput value="Disabled" isDisabled />
<SearchInput value="Scaled" scale />
<SearchInput placeholder="Empty with placeholder" value="" />\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <AutoRefreshTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Decide how the parent hears about the search term. Type into **Type to auto-refresh (1s)**: the line under it catches up a second after you stop (\`autoRefresh\`, \`refreshTimeout\`). Type into **No auto-refresh**: the line under it never changes, because with \`autoRefresh\` off the component does not call \`onChange\` at all."
      },
      source: {
        code: \`// With auto-refresh (1s timeout)
<SearchInput
  autoRefresh
  refreshTimeout={1000}
  placeholder="Type to auto-refresh"
/>

// Without auto-refresh: onChange is never called
<SearchInput autoRefresh={false} placeholder="No auto-refresh" />\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = useState(args.value || "");
    const mainButtonProps = {
      text: "Create",
      model: []
    };
    return <div style={{
      width: "500px"
    }}>
        <SearchInput {...args} value={value} onChange={v => {
        setValue(v);
        args.onChange?.(v);
      }} onClearSearch={() => {
        setValue("");
        args.onClearSearch?.();
      }} mainButtonProps={mainButtonProps} />
      </div>;
  },
  args: {
    size: InputSize.base,
    value: "",
    scale: true,
    placeholder: "Search",
    showMainButton: true
  },
  parameters: {
    docs: {
      description: {
        story: "Put the create action next to the search it belongs with: the **Create** button with its plus icon sits to the left of the field (\`showMainButton\`, \`mainButtonProps\`), and the field takes the rest of the row."
      },
      source: {
        code: \`<SearchInput
  size={InputSize.base}
  value={term}
  scale
  placeholder="Search"
  showMainButton
  mainButtonProps={{ text: "Create", model: [] }}
  onChange={(value) => setTerm(value)}
  onClearSearch={() => setTerm("")}
/>\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = useState(args.value || "");
    const mainButtonProps = {
      text: "New",
      model: itemsModel
    };
    return <div style={{
      width: "500px"
    }}>
        <SearchInput {...args} value={value} onChange={v => {
        setValue(v);
        args.onChange?.(v);
      }} onClearSearch={() => {
        setValue("");
        args.onClearSearch?.();
      }} mainButtonProps={mainButtonProps} />
      </div>;
  },
  args: {
    size: InputSize.base,
    value: "",
    scale: true,
    placeholder: "Search",
    showMainButton: true
  },
  parameters: {
    docs: {
      description: {
        story: "Offer several things to create from one button: click **New** to open its menu of items, one of them with a submenu (\`model\` in \`mainButtonProps\`)."
      },
      source: {
        code: \`<SearchInput
  size={InputSize.base}
  value={term}
  scale
  placeholder="Search"
  showMainButton
  mainButtonProps={{
    text: "New",
    model: [
      { key: 0, label: "New document", icon: FolderIconUrl },
      { key: 1, label: "New spreadsheet", icon: FolderIconUrl },
      { key: 7, isSeparator: true },
      { key: 8, label: "Upload", icon: FolderIconUrl },
    ],
  }}
  onChange={(value) => setTerm(value)}
  onClearSearch={() => setTerm("")}
/>\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <Wrapper>
      <ControlledSearch placeholder="Cross on an empty field" showClearButton />
      <ControlledSearch placeholder="Magnifier on an empty field" />
    </Wrapper>,
  parameters: {
    docs: {
      description: {
        story: "Keep a way out of a search the parent still applies after the field was emptied: **Cross on an empty field** shows the cross with no text in it (\`showClearButton\`), **Magnifier on an empty field** is the usual look. With text in the field both show the cross."
      },
      source: {
        code: \`<SearchInput size={InputSize.base} value="" showClearButton placeholder="Cross on an empty field" />
<SearchInput size={InputSize.base} value="" placeholder="Magnifier on an empty field" />\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <Wrapper>
      <ControlledSearch placeholder="Search in this folder">
        <img src={CatalogFolderReactSvgUrl} alt="" width={16} height={16} />
      </ControlledSearch>
    </Wrapper>,
  parameters: {
    docs: {
      description: {
        story: "Show what the search is limited to without a separate label: the folder icon sits inside the field, before the text (\`children\`)."
      },
      source: {
        code: \`<SearchInput size={InputSize.base} value={term} placeholder="Search in this folder" onChange={setTerm}>
  <img src={folderIconUrl} alt="" width={16} height={16} />
</SearchInput>\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    width: "500px"
  }}>
      <SearchInput {...args} mainButtonProps={{
      text: "Create",
      model: [],
      isDisabled: true
    }} />
    </div>,
  args: {
    size: InputSize.base,
    value: "",
    scale: true,
    placeholder: "Search",
    showMainButton: true
  },
  parameters: {
    docs: {
      description: {
        story: "Keep the create action in place while it is unavailable: the **Create** button is dimmed (\`isDisabled\` in \`mainButtonProps\`), the search field next to it still works."
      },
      source: {
        code: \`<SearchInput
  size={InputSize.base}
  value={term}
  scale
  placeholder="Search"
  showMainButton
  mainButtonProps={{ text: "Create", model: [], isDisabled: true }}
  onChange={(value) => setTerm(value)}
/>\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    width: "500px"
  }}>
      <SearchInput size={InputSize.base} value="بحث" scale placeholder="بحث" showMainButton mainButtonProps={{
      text: "Create",
      model: []
    }} onChange={() => {}} />
    </div>,
  globals: {
    direction: "rtl"
  },
  parameters: {
    noPadding: true,
    docs: {
      story: {
        inline: false,
        height: "58px"
      },
      description: {
        story: 'The same field under a right-to-left interface: the **Create** button moves to the right edge, the cross moves to the left end of the field and the text starts at the right. The direction comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar); the wrapper also carries \`dir="rtl"\` for the rules that read the DOM direction.'
      },
      source: {
        code: \`<div dir="rtl">
  <SearchInput
    size={InputSize.base}
    value={term}
    scale
    placeholder="بحث"
    showMainButton
    mainButtonProps={{ text: "Create", model: [] }}
    onChange={(value) => setTerm(value)}
  />
</div>\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "300px",
    "--text-input-bg": "#f5f3ff",
    "--text-input-border-color": "#7c3aed",
    "--text-input-border-hover": "#4c1d95",
    "--text-input-border-focus": "#c4b5fd",
    "--text-input-color": "#4c1d95",
    "--text-input-radius": "8px",
    "--search-input-icon-fill": "#7c3aed",
    "--search-input-icon-filled-fill": "#db2777",
    "--search-input-gap": "24px"
  } as CSSProperties}>
      <SearchInput size={InputSize.base} placeholder="Custom styled search" value="" onChange={() => {}} />
      <SearchInput size={InputSize.base} placeholder="With value" value="Search term" onChange={() => {}} />
      <SearchInput size={InputSize.base} placeholder="With button" value="" scale showMainButton mainButtonProps={{
      text: "Create",
      model: []
    }} onChange={() => {}} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

**Custom styled search** is empty and shows the magnifier color; **With value** holds text and shows the cross color; **With button** carries the main button, for the gap. Hover a field and click into it to see the two other border colors.\`
      }
    }
  }
}`,...k.parameters?.docs?.source}}}})))()}j();export{S as AutoRefreshMode,E as ContentBeforeText,k as CssCustomization,g as Default,D as DisabledMainButton,T as PersistentClearButton,O as RightToLeft,v as Sizes,b as States,C as WithButton,w as WithButtonAndMenu,A as __namedExportsOrder,p as default};