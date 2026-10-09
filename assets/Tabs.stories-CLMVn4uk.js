import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{i as r,n as i,r as a,t as o}from"./tabs-CkUaQ4gz.js";import{n as s,t as c}from"./badge-DpBv0vYH.js";import{n as l,t as u}from"./catalog.folder.react-VUpu0ofJ.js";var d,f;function p(){return(p=e((()=>{d=n(),f=[{id:`Overview`,name:`Overview`,content:(0,d.jsx)(`p`,{children:`Overview content`})},{id:`Documents`,name:`Documents`,content:(0,d.jsx)(`p`,{children:`Documents`})},{id:`Milestones`,name:`Milestones`,content:(0,d.jsx)(`p`,{children:`Milestones content`})},{id:`Time`,name:`Time`,content:(0,d.jsx)(`p`,{children:`Time tracking`})},{id:`Contacts`,name:`Contacts`,isDisabled:!0,content:(0,d.jsx)(`p`,{children:`Contacts`})},{id:`Team`,name:`Team`,content:(0,d.jsx)(`p`,{children:`Team`})}]})))()}var m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{m=t(),l(),s(),i(),p(),r(),h=n(),{fn:g}=__STORYBOOK_MODULE_TEST__,_={title:`UI/Navigation/Tabs`,component:o,parameters:{},argTypes:{items:{control:!1,description:`The tabs, in the order they are drawn. Each carries its id, its label, the content shown while it is selected, and optionally a disabled flag, a click handler, a badge or an icon`},selectedItemId:{control:`text`,description:"`id` of the selected tab. The component is controlled: set it from `onSelect`. An empty value selects the first tab"},type:{control:`select`,options:Object.values(a),description:`Which of the two tab bars is drawn: an underlined row, or a segmented control`,table:{defaultValue:{summary:`primary`}}},onSelect:{action:`onSelect`,description:`Called with the whole tab object when a different tab is clicked, when a segmented arrow is clicked, or when a highlighted segmented tab is chosen with Enter or Space`},scaled:{control:`boolean`,description:`Makes the segmented tabs share the container's width equally instead of taking the width of the widest label. Secondary tabs only`,table:{defaultValue:{summary:`false`}}},isLoading:{control:`boolean`,description:`Keeps the segmented bar hidden and unmeasured while the labels are still changing, then sizes every tab to the widest label once it is turned off. Draws no loader of its own. Secondary tabs only`,table:{defaultValue:{summary:`false`}}},withAnimation:{control:`boolean`,description:"Grows the underline of a newly selected tab and dims the content until that tab's `onClick` promise settles. Primary tabs only",table:{defaultValue:{summary:`false`}}},stickyTop:{control:`text`,description:`Distance from the top of the scrolling container at which the tab bar sticks, as a CSS length. Without it the bar sticks at the very top`},stickyHeader:{control:!1,description:`Content drawn in its own sticky strip above the tab bar; the bar then sticks directly below it. Primary tabs only`},withoutStickyIntend:{control:`boolean`,description:`Leaves out the 20px gap between the tab bar and the selected tab's content`,table:{defaultValue:{summary:`false`}}},hotkeysId:{control:`text`,description:`Name that keeps several segmented bars on one page apart, so clicking one turns on the arrow keys of that bar only. Secondary tabs only`},layoutId:{control:`text`,description:"Shared name that lets the selected background slide between two segmented bars; also becomes the `id` of the tab list. Secondary tabs only"},id:{control:`text`,description:"`id` of the tab list on primary tabs, and of the outermost element on secondary ones"},className:{control:`text`,description:`Class added to the outermost element`},style:{control:`object`,description:`Inline style of the outermost element`}}},v=({children:e})=>(0,h.jsx)(`div`,{style:{height:`170px`},children:e}),y=e=>{let{onSelect:t,selectedItemId:n,...r}=e,[i,a]=(0,m.useState)(n),s=e=>{a(e.id),t?.(e)};return(0,h.jsxs)(v,{children:[(0,h.jsx)(o,{...r,selectedItemId:i,onSelect:s}),(0,h.jsxs)(`div`,{style:{marginTop:`20px`},children:[`Selected tab: `,r.items.find(e=>e.id===i)?.name]})]})},b={render:e=>(0,h.jsx)(y,{...e}),args:{items:f,selectedItemId:f[0].id,onSelect:g()},parameters:{docs:{description:{story:"The underlined row, for splitting one page into sections the reader switches between: click a tab to show its content below the bar. **Contacts** is greyed out and ignores clicks (`isDisabled`). Change any other prop live in the Controls panel below."},source:{code:`<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  onSelect={(item) => setSelectedId(item.id)}
/>`}}}},x={render:e=>(0,h.jsx)(y,{...e}),args:{items:f,type:a.Secondary,selectedItemId:f[0].id,onSelect:g()},parameters:{docs:{story:{inline:!1,height:`240px`},description:{story:"The segmented control (`type={TabsTypes.Secondary}`), for switching between views of the same content; every tab takes the width of the widest label and the selected background slides to the clicked tab. Click a tab, then press Tab and use the arrow keys, Home, End and Enter to pick one from the keyboard."},source:{code:`<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  type={TabsTypes.Secondary}
  onSelect={(item) => setSelectedId(item.id)}
/>`}}}},S={render:e=>(0,h.jsx)(y,{...e}),args:{items:f,type:a.Secondary,scaled:!0,selectedItemId:f[0].id,onSelect:g()},parameters:{docs:{story:{inline:!1,height:`240px`},description:{story:"The segmented control spread across the whole width of its container, every tab an equal share (`scaled`) — for a bar that should line up with the edges of the panel it sits in. The underlined row ignores `scaled`."},source:{code:`<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  type={TabsTypes.Secondary}
  scaled
  onSelect={(item) => setSelectedId(item.id)}
/>`}}}},C={render:e=>(0,h.jsx)(y,{...e}),args:{items:f,type:a.Secondary,isLoading:!0,selectedItemId:f[0].id,onSelect:g()},parameters:{docs:{story:{inline:!1,height:`240px`},description:{story:"While the labels are still arriving, the segmented bar is kept hidden so that it is not sized to placeholder text (`isLoading`); only the selected tab's content shows. Turn `isLoading` off in the Controls panel below and the bar appears, every tab as wide as the widest label. The component draws no loader of its own, and the underlined row ignores `isLoading`."},source:{code:`<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  type={TabsTypes.Secondary}
  isLoading={labelsLoading}
  onSelect={(item) => setSelectedId(item.id)}
/>`}}}},w=f.map((e,t)=>t<2?{...e,badge:(0,h.jsx)(c,{label:t+3})}:e),T={render:e=>(0,h.jsx)(y,{...e}),args:{items:w,selectedItemId:w[0].id,onSelect:g()},parameters:{docs:{description:{story:"A count after the label of **Overview** and **Documents** (the item's `badge`) — for telling the reader how many new entries wait behind a tab. The segmented control does not draw badges."},source:{code:`const tabItems = [
  { id: "overview", name: "Overview", badge: <Badge label={3} />, content: <p>Overview</p> },
  { id: "documents", name: "Documents", badge: <Badge label={4} />, content: <p>Documents</p> },
  { id: "time", name: "Time", content: <p>Time</p> },
];

<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  onSelect={(item) => setSelectedId(item.id)}
/>`}}}},E=f.map(e=>({...e,iconName:u})),D={render:e=>(0,h.jsx)(y,{...e}),args:{items:E,type:a.Secondary,selectedItemId:E[0].id,onSelect:g()},parameters:{docs:{story:{inline:!1,height:`240px`},description:{story:"An icon before every label of the segmented control (the item's `iconName`, an SVG URL), recoloured with the label as a tab is selected or hovered — for tabs that are recognised faster by a picture. The underlined row does not draw icons."},source:{code:`const tabItems = [
  { id: "overview", name: "Overview", iconName: FolderIconUrl, content: <p>Overview</p> },
  { id: "documents", name: "Documents", iconName: FolderIconUrl, content: <p>Documents</p> },
];

<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  type={TabsTypes.Secondary}
  onSelect={(item) => setSelectedId(item.id)}
/>`}}}},O=()=>new Promise(e=>setTimeout(e,1500)),k=f.map(e=>({...e,onClick:O})),A={render:e=>(0,h.jsx)(y,{...e}),args:{items:k,withAnimation:!0,selectedItemId:k[0].id,onSelect:g()},parameters:{docs:{story:{inline:!1,height:`240px`},description:{story:"Click **Documents**: its underline grows and the old content stays dimmed for the second and a half the tab's `onClick` promise takes, then the new content replaces it (`withAnimation`) — for tabs whose content is fetched when they are selected. The segmented control ignores `withAnimation`."},source:{code:`const tabItems = [
  { id: "overview", name: "Overview", onClick: loadOverview, content: <Overview /> },
  { id: "documents", name: "Documents", onClick: loadDocuments, content: <Documents /> },
];

<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  withAnimation
  onSelect={(item) => setSelectedId(item.id)}
/>`}}}},j=f.map(e=>({...e,content:(0,h.jsx)(`div`,{children:Array.from({length:12},(t,n)=>(0,h.jsxs)(`p`,{children:[e.id,` entry `,n+1]},n))})})),M={render:e=>{let[t,n]=(0,m.useState)(e.selectedItemId);return(0,h.jsx)(`div`,{style:{height:`260px`,overflowY:`auto`},children:(0,h.jsx)(o,{...e,selectedItemId:t,onSelect:t=>{n(t.id),e.onSelect?.(t)}})})},args:{items:j,selectedItemId:j[0].id,stickyHeader:(0,h.jsx)(`strong`,{children:`Project files`}),stickyTop:`0px`,onSelect:g()},parameters:{docs:{description:{story:"Scroll the box: the heading and the tab bar stay at its top while the content moves under them (`stickyHeader`) — for a section title that should stay in view together with the bar. The heading sticks only with `stickyTop` set, here to `0px`; a larger value moves both further down. The segmented control does not draw a sticky header."},source:{code:`<div style={{ height: "260px", overflowY: "auto" }}>
  <Tabs
    items={tabItems}
    selectedItemId={selectedId}
    stickyHeader={<strong>Project files</strong>}
    stickyTop="0px"
    onSelect={(item) => setSelectedId(item.id)}
  />
</div>`}}}},N=[`Overview`,`Documents`,`Spreadsheets`,`Presentations`,`Forms`,`Media`,`Archives`,`Templates`].map(e=>({id:e,name:e,content:null})),P=e=>{let[t,n]=(0,m.useState)(e.selectedItemId),[r,i]=(0,m.useState)(e.selectedItemId);return(0,h.jsxs)(`div`,{style:{width:`360px`,display:`grid`,gap:`16px`},children:[(0,h.jsx)(o,{...e,withoutStickyIntend:!0,selectedItemId:t,onSelect:t=>{n(t.id),e.onSelect?.(t)}}),(0,h.jsx)(o,{...e,type:a.Secondary,withoutStickyIntend:!0,selectedItemId:r,onSelect:t=>{i(t.id),e.onSelect?.(t)}})]})},F={render:e=>(0,h.jsx)(P,{...e}),args:{items:N,selectedItemId:N[0].id,onSelect:g()},parameters:{docs:{story:{inline:!1,height:`155px`},description:{story:`More tabs than a 360px column holds, for a bar whose tabs cannot be cut down:

- **Underlined row** — scrolls sideways; the edge that hides more tabs fades out
- **Segmented control** — adds an arrow at each end that selects the previous or next tab, not only scrolls to it (the arrows are left out on phones)`},source:{code:`<div style={{ width: "360px" }}>
  <Tabs items={tabItems} selectedItemId={selectedId} onSelect={handleSelect} />
  <Tabs
    items={tabItems}
    selectedItemId={selectedId}
    type={TabsTypes.Secondary}
    onSelect={handleSelect}
  />
</div>`}}}},I={render:e=>(0,h.jsx)(`div`,{dir:`rtl`,children:(0,h.jsx)(P,{...e})}),globals:{direction:`rtl`},args:{items:N,selectedItemId:N[0].id,onSelect:g()},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`112px`},description:{story:'The overflowing bars in a right-to-left layout: the first tab sits at the right-hand end, the fade moves to the left edge, and the segmented arrows swap sides so the right one selects the previous tab. The wrapper carries `dir="rtl"` for the layout; the fade direction and the scroll correction come from the theme\'s `interfaceDirection` (the Direction toolbar).'},source:{code:`<div dir="rtl">
  <Tabs items={tabItems} selectedItemId={selectedId} onSelect={handleSelect} />
  <Tabs
    items={tabItems}
    selectedItemId={selectedId}
    type={TabsTypes.Secondary}
    onSelect={handleSelect}
  />
</div>`}}}},L=()=>{let[e,t]=(0,m.useState)(f[0].id),[n,r]=(0,m.useState)(f[0].id);return(0,h.jsxs)(`div`,{style:{display:`grid`,gap:`24px`,"--tabs-primary-height":`36px`,"--tabs-primary-gap":`28px`,"--tabs-text-weight":`700`,"--tabs-underline-thickness":`3px`,"--tabs-underline-radius":`3px`,"--tabs-underline":`#c4b5fd`,"--tabs-primary-bg":`#faf5ff`,"--tabs-primary-text":`#a78bfa`,"--tabs-primary-active-text":`#5b21b6`,"--tabs-primary-hover-text":`#7c3aed`,"--tabs-secondary-height":`40px`,"--tabs-secondary-gap":`8px`,"--tabs-secondary-padding":`6px`,"--tabs-secondary-radius":`20px`,"--tabs-secondary-tab-radius":`16px`,"--tabs-secondary-bg":`#f5f3ff`,"--tabs-secondary-active-bg":`#7c3aed`,"--tabs-secondary-active-text":`#ffffff`,"--tabs-secondary-text":`#6d28d9`,"--tabs-secondary-hover-bg":`#a78bfa`},children:[(0,h.jsx)(o,{items:f,selectedItemId:e,withoutStickyIntend:!0,onSelect:e=>t(e.id)}),(0,h.jsx)(o,{items:f,selectedItemId:n,type:a.Secondary,scaled:!0,withoutStickyIntend:!0,onSelect:e=>r(e.id)})]})},R={render:()=>(0,h.jsx)(L,{}),parameters:{docs:{story:{inline:!1,height:`260px`},description:{story:"Every variable either bar can show without overflowing, set on one wrapper -- the variables are listed under CSS variables on this page. The first instance is the underlined row, for the `--tabs-primary-*`, underline and weight variables; the second is the segmented control (`type={TabsTypes.Secondary}`), for the `--tabs-secondary-*` ones. Hover the tabs to see the hover colours."},source:{code:`<div style={{
  "--tabs-primary-height": "36px",
  "--tabs-primary-gap": "28px",
  "--tabs-text-weight": "700",
  "--tabs-underline-thickness": "3px",
  "--tabs-underline-radius": "3px",
  "--tabs-underline": "#c4b5fd",
  "--tabs-primary-bg": "#faf5ff",
  "--tabs-primary-text": "#a78bfa",
  "--tabs-primary-active-text": "#5b21b6",
  "--tabs-primary-hover-text": "#7c3aed",
  "--tabs-secondary-height": "40px",
  "--tabs-secondary-gap": "8px",
  "--tabs-secondary-padding": "6px",
  "--tabs-secondary-radius": "20px",
  "--tabs-secondary-tab-radius": "16px",
  "--tabs-secondary-bg": "#f5f3ff",
  "--tabs-secondary-active-bg": "#7c3aed",
  "--tabs-secondary-active-text": "#ffffff",
  "--tabs-secondary-text": "#6d28d9",
  "--tabs-secondary-hover-bg": "#a78bfa",
}}>
  <Tabs items={tabItems} selectedItemId={selectedId} onSelect={handleSelect} />
  <Tabs
    items={tabItems}
    selectedItemId={selectedId}
    type={TabsTypes.Secondary}
    scaled
    onSelect={handleSelect}
  />
</div>`}}}},z=[`Default`,`Secondary`,`Scaled`,`Loading`,`WithBadges`,`WithIcons`,`AnimatedSelection`,`WithStickyHeader`,`OverflowingTabs`,`RightToLeft`,`CssCustomization`],b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    items: data,
    selectedItemId: data[0].id,
    onSelect: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "The underlined row, for splitting one page into sections the reader switches between: click a tab to show its content below the bar. **Contacts** is greyed out and ignores clicks (\`isDisabled\`). Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  onSelect={(item) => setSelectedId(item.id)}
/>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    items: data,
    type: TabsTypes.Secondary,
    selectedItemId: data[0].id,
    onSelect: fn()
  },
  parameters: {
    docs: {
      // Framed: the keyboard handler listens on the window and would take keys from the Docs page.
      story: {
        inline: false,
        height: "240px"
      },
      description: {
        story: "The segmented control (\`type={TabsTypes.Secondary}\`), for switching between views of the same content; every tab takes the width of the widest label and the selected background slides to the clicked tab. Click a tab, then press Tab and use the arrow keys, Home, End and Enter to pick one from the keyboard."
      },
      source: {
        code: \`<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  type={TabsTypes.Secondary}
  onSelect={(item) => setSelectedId(item.id)}
/>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    items: data,
    type: TabsTypes.Secondary,
    scaled: true,
    selectedItemId: data[0].id,
    onSelect: fn()
  },
  parameters: {
    docs: {
      // Framed: the keyboard handler listens on the window and would take keys from the Docs page.
      story: {
        inline: false,
        height: "240px"
      },
      description: {
        story: "The segmented control spread across the whole width of its container, every tab an equal share (\`scaled\`) — for a bar that should line up with the edges of the panel it sits in. The underlined row ignores \`scaled\`."
      },
      source: {
        code: \`<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  type={TabsTypes.Secondary}
  scaled
  onSelect={(item) => setSelectedId(item.id)}
/>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    items: data,
    type: TabsTypes.Secondary,
    isLoading: true,
    selectedItemId: data[0].id,
    onSelect: fn()
  },
  parameters: {
    docs: {
      // Framed: the keyboard handler listens on the window and would take keys from the Docs page.
      story: {
        inline: false,
        height: "240px"
      },
      description: {
        story: "While the labels are still arriving, the segmented bar is kept hidden so that it is not sized to placeholder text (\`isLoading\`); only the selected tab's content shows. Turn \`isLoading\` off in the Controls panel below and the bar appears, every tab as wide as the widest label. The component draws no loader of its own, and the underlined row ignores \`isLoading\`."
      },
      source: {
        code: \`<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  type={TabsTypes.Secondary}
  isLoading={labelsLoading}
  onSelect={(item) => setSelectedId(item.id)}
/>\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    items: badgeItems,
    selectedItemId: badgeItems[0].id,
    onSelect: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "A count after the label of **Overview** and **Documents** (the item's \`badge\`) — for telling the reader how many new entries wait behind a tab. The segmented control does not draw badges."
      },
      source: {
        code: \`const tabItems = [
  { id: "overview", name: "Overview", badge: <Badge label={3} />, content: <p>Overview</p> },
  { id: "documents", name: "Documents", badge: <Badge label={4} />, content: <p>Documents</p> },
  { id: "time", name: "Time", content: <p>Time</p> },
];

<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  onSelect={(item) => setSelectedId(item.id)}
/>\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    items: iconItems,
    type: TabsTypes.Secondary,
    selectedItemId: iconItems[0].id,
    onSelect: fn()
  },
  parameters: {
    docs: {
      // Framed: the keyboard handler listens on the window and would take keys from the Docs page.
      story: {
        inline: false,
        height: "240px"
      },
      description: {
        story: "An icon before every label of the segmented control (the item's \`iconName\`, an SVG URL), recoloured with the label as a tab is selected or hovered — for tabs that are recognised faster by a picture. The underlined row does not draw icons."
      },
      source: {
        code: \`const tabItems = [
  { id: "overview", name: "Overview", iconName: FolderIconUrl, content: <p>Overview</p> },
  { id: "documents", name: "Documents", iconName: FolderIconUrl, content: <p>Documents</p> },
];

<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  type={TabsTypes.Secondary}
  onSelect={(item) => setSelectedId(item.id)}
/>\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    items: animatedItems,
    withAnimation: true,
    selectedItemId: animatedItems[0].id,
    onSelect: fn()
  },
  parameters: {
    docs: {
      // Framed: the animation ends on a window event that every animated bar on the page receives.
      story: {
        inline: false,
        height: "240px"
      },
      description: {
        story: "Click **Documents**: its underline grows and the old content stays dimmed for the second and a half the tab's \`onClick\` promise takes, then the new content replaces it (\`withAnimation\`) — for tabs whose content is fetched when they are selected. The segmented control ignores \`withAnimation\`."
      },
      source: {
        code: \`const tabItems = [
  { id: "overview", name: "Overview", onClick: loadOverview, content: <Overview /> },
  { id: "documents", name: "Documents", onClick: loadDocuments, content: <Documents /> },
];

<Tabs
  items={tabItems}
  selectedItemId={selectedId}
  withAnimation
  onSelect={(item) => setSelectedId(item.id)}
/>\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [selectedId, setSelectedId] = useState(args.selectedItemId);
    return <div style={{
      height: "260px",
      overflowY: "auto"
    }}>
        <Tabs {...args} selectedItemId={selectedId} onSelect={item => {
        setSelectedId(item.id);
        args.onSelect?.(item);
      }} />
      </div>;
  },
  args: {
    items: longItems,
    selectedItemId: longItems[0].id,
    stickyHeader: <strong>Project files</strong>,
    stickyTop: "0px",
    onSelect: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "Scroll the box: the heading and the tab bar stay at its top while the content moves under them (\`stickyHeader\`) — for a section title that should stay in view together with the bar. The heading sticks only with \`stickyTop\` set, here to \`0px\`; a larger value moves both further down. The segmented control does not draw a sticky header."
      },
      source: {
        code: \`<div style={{ height: "260px", overflowY: "auto" }}>
  <Tabs
    items={tabItems}
    selectedItemId={selectedId}
    stickyHeader={<strong>Project files</strong>}
    stickyTop="0px"
    onSelect={(item) => setSelectedId(item.id)}
  />
</div>\`
      }
    }
  }
}`,...M.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: args => <OverflowTemplate {...args} />,
  args: {
    items: manyItems,
    selectedItemId: manyItems[0].id,
    onSelect: fn()
  },
  parameters: {
    docs: {
      // Framed: the keyboard handler listens on the window and would take keys from the Docs page.
      story: {
        inline: false,
        height: "155px"
      },
      description: {
        story: \`More tabs than a 360px column holds, for a bar whose tabs cannot be cut down:

- **Underlined row** — scrolls sideways; the edge that hides more tabs fades out
- **Segmented control** — adds an arrow at each end that selects the previous or next tab, not only scrolls to it (the arrows are left out on phones)\`
      },
      source: {
        code: \`<div style={{ width: "360px" }}>
  <Tabs items={tabItems} selectedItemId={selectedId} onSelect={handleSelect} />
  <Tabs
    items={tabItems}
    selectedItemId={selectedId}
    type={TabsTypes.Secondary}
    onSelect={handleSelect}
  />
</div>\`
      }
    }
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <OverflowTemplate {...args} />
    </div>,
  globals: {
    direction: "rtl"
  },
  args: {
    items: manyItems,
    selectedItemId: manyItems[0].id,
    onSelect: fn()
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
        story: 'The overflowing bars in a right-to-left layout: the first tab sits at the right-hand end, the fade moves to the left edge, and the segmented arrows swap sides so the right one selects the previous tab. The wrapper carries \`dir="rtl"\` for the layout; the fade direction and the scroll correction come from the theme\\'s \`interfaceDirection\` (the Direction toolbar).'
      },
      source: {
        code: \`<div dir="rtl">
  <Tabs items={tabItems} selectedItemId={selectedId} onSelect={handleSelect} />
  <Tabs
    items={tabItems}
    selectedItemId={selectedId}
    type={TabsTypes.Secondary}
    onSelect={handleSelect}
  />
</div>\`
      }
    }
  }
}`,...I.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      // Framed: the keyboard handler listens on the window and would take keys from the Docs page.
      story: {
        inline: false,
        height: "260px"
      },
      description: {
        story: \`Every variable either bar can show without overflowing, set on one wrapper -- the variables are listed under CSS variables on this page. The first instance is the underlined row, for the \\\`--tabs-primary-*\\\`, underline and weight variables; the second is the segmented control (\\\`type={TabsTypes.Secondary}\\\`), for the \\\`--tabs-secondary-*\\\` ones. Hover the tabs to see the hover colours.\`
      },
      source: {
        code: \`<div style={{
  "--tabs-primary-height": "36px",
  "--tabs-primary-gap": "28px",
  "--tabs-text-weight": "700",
  "--tabs-underline-thickness": "3px",
  "--tabs-underline-radius": "3px",
  "--tabs-underline": "#c4b5fd",
  "--tabs-primary-bg": "#faf5ff",
  "--tabs-primary-text": "#a78bfa",
  "--tabs-primary-active-text": "#5b21b6",
  "--tabs-primary-hover-text": "#7c3aed",
  "--tabs-secondary-height": "40px",
  "--tabs-secondary-gap": "8px",
  "--tabs-secondary-padding": "6px",
  "--tabs-secondary-radius": "20px",
  "--tabs-secondary-tab-radius": "16px",
  "--tabs-secondary-bg": "#f5f3ff",
  "--tabs-secondary-active-bg": "#7c3aed",
  "--tabs-secondary-active-text": "#ffffff",
  "--tabs-secondary-text": "#6d28d9",
  "--tabs-secondary-hover-bg": "#a78bfa",
}}>
  <Tabs items={tabItems} selectedItemId={selectedId} onSelect={handleSelect} />
  <Tabs
    items={tabItems}
    selectedItemId={selectedId}
    type={TabsTypes.Secondary}
    scaled
    onSelect={handleSelect}
  />
</div>\`
      }
    }
  }
}`,...R.parameters?.docs?.source}}}})))()}B();export{A as AnimatedSelection,R as CssCustomization,b as Default,C as Loading,F as OverflowingTabs,I as RightToLeft,S as Scaled,x as Secondary,T as WithBadges,D as WithIcons,M as WithStickyHeader,z as __namedExportsOrder,_ as default};