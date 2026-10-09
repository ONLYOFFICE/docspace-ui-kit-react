import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{i,n as a,r as o,t as s}from"./drop-down-H7nHxgOI.js";import{n as c,t as l}from"./button-DjDXE7uo.js";var u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{u=t(n()),c(),i(),a(),d=r(),f={title:`UI/Overlays/DropDown`,component:s,parameters:{layout:`centered`},argTypes:{open:{control:`boolean`,description:`Whether the menu is shown; while it is off the menu stays in the page, hidden`,table:{defaultValue:{summary:`false`}}},directionX:{control:`select`,options:[`left`,`right`],description:"Which edge of the anchor the menu lines up with: `right` opens it towards the right from the anchor's left edge, `left` towards the left from its right edge",table:{defaultValue:{summary:`right`}}},directionY:{control:`select`,options:[`top`,`bottom`,`both`],description:"Whether the menu opens below the anchor, above it, or (`both`) below unless there is no room left under it",table:{defaultValue:{summary:`bottom`}}},maxHeight:{control:`number`,description:`Height of the list in pixels; it also turns on the scrollbar, the virtualised list and the arrow keys, none of which happen without it`},manualWidth:{control:`text`,description:"Exact width of the menu as a CSS length, for example `300px` or `100%`"},offsetX:{control:`number`,description:`Shifts the menu inwards from the anchor's edge by this many pixels; portal mode only`,table:{defaultValue:{summary:`0`}}},zIndex:{control:`number`,description:`Stacking order of the menu`,table:{defaultValue:{summary:`400`}}},showDisabledItems:{control:`boolean`,description:"Keeps items whose `disabled` prop is true in the list, greyed out; by default they are dropped",table:{defaultValue:{summary:`false`}}},isDefaultMode:{control:`boolean`,description:"Renders the menu in a portal on the page body, positioned against `forwardedRef`; off, it renders in place inside the nearest positioned ancestor",table:{defaultValue:{summary:`true`}}},fixedDirection:{control:`boolean`,description:"Keeps `directionX` and `directionY` as given instead of flipping them when the menu would not fit the window",table:{defaultValue:{summary:`false`}}},enableKeyboardEvents:{control:`boolean`,description:"Whether the Up and Down arrows move the highlight and Enter clicks the highlighted item; read only with `maxHeight`, and while it is on every key press on the page has its default action prevented",table:{defaultValue:{summary:`true`}}},withBackdrop:{control:`boolean`,description:"Puts a transparent layer behind the open menu that catches the next click and calls `clickOutsideAction`",table:{defaultValue:{summary:`true`}}},withBackground:{control:`boolean`,description:`Dims the page behind the open menu`},withoutBackground:{control:`boolean`,description:"Keeps the layer behind the menu transparent, even with `withBackground` or `isAside` and on a phone, where it is dimmed otherwise"},usePortalBackdrop:{control:`boolean`,description:`Renders the backdrop inside the portal, above the rest of the page, instead of beneath the menu`,table:{defaultValue:{summary:`false`}}},shouldShowBackdrop:{control:`boolean`,description:`Renders the backdrop even when another one is already open on the page, which it otherwise leaves to catch the click`,table:{defaultValue:{summary:`false`}}},isAside:{control:`boolean`,description:`Dims the page behind the menu and opens its backdrop over up to two others, for a menu inside a side panel`},backDrop:{control:!1,description:"An element rendered in place of the backdrop that `withBackdrop` builds"},isMobileView:{control:`boolean`,description:`Pins the menu to the bottom edge of the screen at full width when the window is taller than it is wide`},isNoFixedHeightOptions:{control:`boolean`,description:"With `maxHeight`, scrolls the items as they are instead of in the virtualised list, for items taller or shorter than 32px"},useFlexibleHeight:{control:`boolean`,description:"With `isNoFixedHeightOptions`, lets the list shrink below `maxHeight` when its items take less room"},disableScrollbarPadding:{control:`boolean`,description:"With `isNoFixedHeightOptions`, removes the space kept for the scrollbar, so an item's hover fill reaches the menu's edge"},withDynamicScrollbar:{control:`boolean`,description:`Caps the menu at the room left between the anchor and the window edge on every open, and scrolls the rest`},topSpace:{control:`number`,description:"With `withDynamicScrollbar`, pixels to keep free between the menu and the top of the window"},bottomSpace:{control:`number`,description:"With `withDynamicScrollbar`, pixels to keep free between the menu and the bottom of the window"},manualX:{control:`text`,description:`Distance from the anchor's edge as a CSS length; inline mode only`},manualY:{control:`text`,description:`Distance from the anchor's top or bottom as a CSS length, instead of the anchor's full height; inline mode only`},forwardedRef:{control:!1,description:`Ref of the element the menu belongs to; in portal mode the menu is positioned against it, and without it the menu goes to the corner of the window`},appendTo:{control:!1,description:`Element the portal renders the menu into instead of the page body`},clickOutsideAction:{action:`clickOutsideAction`,description:"Called when the backdrop or a listed outside event is clicked, with the event and the state being asked for: the opposite of `open`"},enableOnClickOutside:{action:`enableOnClickOutside`,description:`Called once each time the menu opens`},eventTypes:{control:`object`,description:"DOM event names listened for on the window while the menu is open; one outside the menu calls `clickOutsideAction`"},forceCloseClickOutside:{control:`boolean`,description:`Stops the outside-event listeners from being added at all`},children:{control:!1,description:"Items of the menu, normally `DropDownItem`s"},className:{control:`text`,description:`Class added to the menu element`},style:{control:`object`,description:`Inline style merged into the menu element's own`},dataTestId:{control:`text`,description:"Value of the menu element's `data-testid`",table:{defaultValue:{summary:`dropdown`}}},id:{control:!1,description:"Ignored; no `id` reaches the page"},columnCount:{control:!1,description:`Ignored; nothing reads it`},disableOnClickOutside:{control:!1,description:`Ignored; nothing reads it`},withBlur:{control:!1,description:`Ignored; nothing reads it`}}},p=e=>{let[t,n]=u.useState(!1),r=u.useRef(null);return(0,d.jsxs)(`div`,{style:{padding:`20px`},children:[(0,d.jsx)(l,{ref:r,label:`Open Dropdown`,onClick:()=>n(!0)}),(0,d.jsxs)(s,{...e,open:e.open??t,forwardedRef:r,clickOutsideAction:(t,r)=>{e.clickOutsideAction?.(t,r),n(!1)},children:[(0,d.jsx)(o,{label:`Option 1`,onClick:()=>n(!1)}),(0,d.jsx)(o,{label:`Option 2`,onClick:()=>n(!1)}),(0,d.jsx)(o,{label:`Option 3`,onClick:()=>n(!1)})]})]})},m={render:e=>(0,d.jsx)(p,{...e}),args:{directionX:`right`,directionY:`bottom`},parameters:{docs:{description:{story:`The everyday case: a short menu opened from a button and closed by the next click anywhere else. Press **Open Dropdown**, then change any other prop live in the Controls panel below and open it again.`},source:{code:`const [isOpen, setIsOpen] = useState(false);
const buttonRef = useRef<HTMLButtonElement>(null);

<Button ref={buttonRef} label="Open Dropdown" onClick={() => setIsOpen(true)} />
<DropDown
  open={isOpen}
  forwardedRef={buttonRef}
  clickOutsideAction={() => setIsOpen(false)}
>
  <DropDownItem label="Option 1" onClick={() => setIsOpen(false)} />
  <DropDownItem label="Option 2" onClick={() => setIsOpen(false)} />
  <DropDownItem label="Option 3" onClick={() => setIsOpen(false)} />
</DropDown>`}}}},h=()=>{let[e,t]=u.useState(!1),n=u.useRef(null);return(0,d.jsxs)(`div`,{style:{padding:`20px`},children:[(0,d.jsx)(l,{ref:n,label:`File Actions`,onClick:()=>t(!0)}),(0,d.jsxs)(s,{open:e,forwardedRef:n,clickOutsideAction:()=>t(!1),children:[(0,d.jsx)(o,{isHeader:!0,label:`File`}),(0,d.jsx)(o,{label:`Open`,onClick:()=>t(!1)}),(0,d.jsx)(o,{label:`Download`,onClick:()=>t(!1)}),(0,d.jsx)(o,{isSeparator:!0}),(0,d.jsx)(o,{isHeader:!0,label:`Edit`}),(0,d.jsx)(o,{label:`Rename`,onClick:()=>t(!1)}),(0,d.jsx)(o,{label:`Move`,onClick:()=>t(!1)}),(0,d.jsx)(o,{isSeparator:!0}),(0,d.jsx)(o,{label:`Delete`,onClick:()=>t(!1)})]})]})},g={render:()=>(0,d.jsx)(h,{}),parameters:{docs:{description:{story:`Dropdowns can include headers and separators to organize items into logical groups.`},source:{code:`<DropDown open={isOpen} forwardedRef={buttonRef} clickOutsideAction={() => setIsOpen(false)}>
  <DropDownItem isHeader label="File" />
  <DropDownItem label="Open" onClick={handleClick} />
  <DropDownItem label="Download" onClick={handleClick} />
  <DropDownItem isSeparator />
  <DropDownItem isHeader label="Edit" />
  <DropDownItem label="Rename" onClick={handleClick} />
  <DropDownItem label="Move" onClick={handleClick} />
</DropDown>`}}}},_=()=>{let[e,t]=u.useState(!1),n=u.useRef(null);return(0,d.jsxs)(`div`,{style:{padding:`20px`},children:[(0,d.jsx)(l,{ref:n,label:`Actions Menu`,onClick:()=>t(!0)}),(0,d.jsxs)(s,{open:e,forwardedRef:n,showDisabledItems:!0,clickOutsideAction:()=>t(!1),children:[(0,d.jsx)(o,{isHeader:!0,label:`Available Actions`}),(0,d.jsx)(o,{label:`Edit`,onClick:()=>t(!1)}),(0,d.jsx)(o,{label:`Share`,onClick:()=>t(!1)}),(0,d.jsx)(o,{label:`Move (no permission)`,onClick:()=>{},disabled:!0}),(0,d.jsx)(o,{isSeparator:!0}),(0,d.jsx)(o,{label:`Delete (no permission)`,onClick:()=>{},disabled:!0})]})]})},v={render:()=>(0,d.jsx)(_,{}),parameters:{docs:{description:{story:"Use `showDisabledItems` to display disabled items. By default, disabled items are hidden."},source:{code:`<DropDown open={isOpen} showDisabledItems>
  <DropDownItem label="Edit" onClick={handleClick} />
  <DropDownItem label="Move (no permission)" disabled />
  <DropDownItem label="Delete (no permission)" disabled />
</DropDown>`}}}},y=()=>{let[e,t]=u.useState(!1),n=u.useRef(null),r=Array.from({length:20},(e,t)=>({id:t+1,label:`Option ${t+1}`}));return(0,d.jsxs)(`div`,{style:{padding:`20px`},children:[(0,d.jsx)(l,{ref:n,label:`Long List`,onClick:()=>t(!0)}),(0,d.jsx)(s,{open:e,forwardedRef:n,maxHeight:200,clickOutsideAction:()=>t(!1),style:{width:`100px`},children:r.map(e=>(0,d.jsx)(o,{label:e.label,onClick:()=>t(!1)},e.id))})]})},b={render:()=>(0,d.jsx)(y,{}),parameters:{docs:{description:{story:"For a list longer than the screen can hold: the menu stays 200px tall and scrolls (`maxHeight`). Open it and press the Down and Up arrows to move the highlight, then Enter to pick the highlighted option."},source:{code:`<DropDown open={isOpen} maxHeight={200}>
  {items.map((item) => (
    <DropDownItem key={item.id} label={item.label} onClick={handleClick} />
  ))}
</DropDown>`}}}},x=()=>{let[e,t]=u.useState(null),n=u.useRef(null),r=u.useRef(null),i=u.useRef(null),a=u.useRef(null),c=e=>t(e),f=()=>t(null);return(0,d.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`100px`,padding:`100px 20px`},children:[(0,d.jsxs)(`div`,{children:[(0,d.jsx)(l,{ref:n,label:`Bottom Right`,onClick:()=>c(`bottomRight`)}),(0,d.jsxs)(s,{open:e===`bottomRight`,forwardedRef:n,directionX:`right`,directionY:`bottom`,clickOutsideAction:f,children:[(0,d.jsx)(o,{label:`Option 1`,onClick:f}),(0,d.jsx)(o,{label:`Option 2`,onClick:f})]})]}),(0,d.jsxs)(`div`,{children:[(0,d.jsx)(l,{ref:r,label:`Bottom Left`,onClick:()=>c(`bottomLeft`)}),(0,d.jsxs)(s,{open:e===`bottomLeft`,forwardedRef:r,directionX:`left`,directionY:`bottom`,clickOutsideAction:f,children:[(0,d.jsx)(o,{label:`Option 1`,onClick:f}),(0,d.jsx)(o,{label:`Option 2`,onClick:f})]})]}),(0,d.jsxs)(`div`,{children:[(0,d.jsx)(l,{ref:i,label:`Top Right`,onClick:()=>c(`topRight`)}),(0,d.jsxs)(s,{open:e===`topRight`,forwardedRef:i,directionX:`right`,directionY:`top`,clickOutsideAction:f,children:[(0,d.jsx)(o,{label:`Option 1`,onClick:f}),(0,d.jsx)(o,{label:`Option 2`,onClick:f})]})]}),(0,d.jsxs)(`div`,{children:[(0,d.jsx)(l,{ref:a,label:`Top Left`,onClick:()=>c(`topLeft`)}),(0,d.jsxs)(s,{open:e===`topLeft`,forwardedRef:a,directionX:`left`,directionY:`top`,clickOutsideAction:f,children:[(0,d.jsx)(o,{label:`Option 1`,onClick:f}),(0,d.jsx)(o,{label:`Option 2`,onClick:f})]})]})]})},S={render:()=>(0,d.jsx)(x,{}),parameters:{docs:{description:{story:"To open the menu where there is room for it: each button opens its menu to the side and edge its label names (`directionX`, `directionY`). A menu that would run past the side of the window opens towards the other side instead."},source:{code:`<DropDown directionX="right" directionY="bottom">...</DropDown>
<DropDown directionX="left" directionY="bottom">...</DropDown>
<DropDown directionX="right" directionY="top">...</DropDown>
<DropDown directionX="left" directionY="top">...</DropDown>`}}}},C=()=>{let[e,t]=u.useState(!1),n=u.useRef(null);return(0,d.jsxs)(`div`,{style:{padding:`20px`},children:[(0,d.jsx)(l,{ref:n,label:`Wide Dropdown`,onClick:()=>t(!0)}),(0,d.jsxs)(s,{open:e,forwardedRef:n,manualWidth:`300px`,clickOutsideAction:()=>t(!1),children:[(0,d.jsx)(o,{label:`This is a longer option text`,onClick:()=>t(!1)}),(0,d.jsx)(o,{label:`Another long option`,onClick:()=>t(!1)}),(0,d.jsx)(o,{label:`Short`,onClick:()=>t(!1)})]})]})},w={render:()=>(0,d.jsx)(C,{}),parameters:{docs:{description:{story:"Use `manualWidth` to set a custom width for the dropdown."},source:{code:`<DropDown open={isOpen} manualWidth="300px">
  <DropDownItem label="This is a longer option text" />
  <DropDownItem label="Another long option" />
  <DropDownItem label="Short" />
</DropDown>`}}}},T=()=>{let[e,t]=u.useState(!1),n=u.useRef(null);return(0,d.jsxs)(`div`,{style:{padding:`20px`},children:[(0,d.jsx)(l,{ref:n,label:`Edit Menu`,onClick:()=>t(!0)}),(0,d.jsxs)(s,{open:e,forwardedRef:n,clickOutsideAction:()=>t(!1),children:[(0,d.jsx)(o,{label:`Cut`,onClick:()=>t(!1)}),(0,d.jsx)(o,{label:`Copy`,onClick:()=>t(!1)}),(0,d.jsx)(o,{label:`Paste`,onClick:()=>t(!1)}),(0,d.jsx)(o,{isSeparator:!0}),(0,d.jsx)(o,{label:`Select All`,onClick:()=>t(!1)}),(0,d.jsx)(o,{isSeparator:!0}),(0,d.jsx)(o,{label:`Undo`,onClick:()=>t(!1)}),(0,d.jsx)(o,{label:`Redo`,onClick:()=>t(!1)})]})]})},E={render:()=>(0,d.jsx)(T,{}),parameters:{docs:{description:{story:"To group a short menu without titles: thin lines split the editing commands into three groups (`isSeparator` on a `DropDownItem`)."},source:{code:`<DropDown open={isOpen}>
  <DropDownItem label="Cut" onClick={handleClick} />
  <DropDownItem label="Copy" onClick={handleClick} />
  <DropDownItem label="Paste" onClick={handleClick} />
  <DropDownItem isSeparator />
  <DropDownItem label="Select All" onClick={handleClick} />
</DropDown>`}}}},D=()=>{let[e,t]=u.useState(!0),[n,r]=u.useState(null),i=u.useRef(null);return(0,d.jsxs)(`div`,{dir:`rtl`,ref:r,style:{padding:`20px`},children:[(0,d.jsx)(l,{ref:i,label:`القائمة`,onClick:()=>t(!0)}),n?(0,d.jsxs)(s,{open:e,forwardedRef:i,appendTo:n,manualWidth:`200px`,clickOutsideAction:()=>t(!1),children:[(0,d.jsx)(o,{label:`فتح`,onClick:()=>t(!1)}),(0,d.jsx)(o,{label:`تنزيل`,onClick:()=>t(!1)}),(0,d.jsx)(o,{label:`إعادة التسمية`,onClick:()=>t(!1)})]}):null]})},O={render:()=>(0,d.jsx)(D,{}),globals:{direction:`rtl`},parameters:{layout:`fullscreen`,noPadding:!0,docs:{story:{inline:!1,height:`220px`},description:{story:"The menu in a right-to-left interface, open from the start: the button sits at the right, the menu lines up with the button's right edge and extends towards the left, and the labels are aligned to the right. The menu renders into the right-to-left container (`appendTo`), because on its own it goes to the end of the page body, outside any `dir` wrapper."},source:{code:`<div dir="rtl" ref={setContainer}>
  <Button ref={buttonRef} label="القائمة" onClick={() => setIsOpen(true)} />
  <DropDown
    open={isOpen}
    forwardedRef={buttonRef}
    appendTo={container}
    manualWidth="200px"
    clickOutsideAction={() => setIsOpen(false)}
  >
    <DropDownItem label="فتح" onClick={handleClick} />
    <DropDownItem label="تنزيل" onClick={handleClick} />
  </DropDown>
</div>`}}}},k=()=>{let e=u.useRef(null),[t,n]=u.useState(!1);return(0,d.jsxs)(`div`,{style:{"--dropdown-radius":`12px`,"--dropdown-bg":`#f5f3ff`,"--dropdown-border-style":`1px solid #7c3aed`,"--dropdown-shadow":`0 4px 20px rgba(124, 58, 237, 0.25)`,"--dropdown-inner-padding":`12px 0`,position:`relative`},children:[(0,d.jsx)(l,{ref:e,label:`Dropdown trigger`,onClick:()=>n(e=>!e)}),(0,d.jsxs)(s,{open:t,isDefaultMode:!1,forwardedRef:e,directionY:`bottom`,fixedDirection:!0,clickOutsideAction:()=>n(!1),children:[(0,d.jsx)(o,{label:`Option 1`,onClick:()=>n(!1)}),(0,d.jsx)(o,{label:`Option 2`,onClick:()=>n(!1)}),(0,d.jsx)(o,{label:`Option 3`,onClick:()=>n(!1)})]})]})},A={render:()=>(0,d.jsx)(k,{}),parameters:{docs:{description:{story:"The variables are listed under CSS variables on this page. Press **Dropdown trigger** to open the menu. It renders inline here (`isDefaultMode={false}`), inside the wrapper that sets the variables; in the default portal mode the menu is on the page body, outside any wrapper, so set them through the DropDown's own `style` prop instead."},source:{code:`<div style={{
  "--dropdown-radius": "12px",
  "--dropdown-bg": "#f5f3ff",
  "--dropdown-border-style": "1px solid #7c3aed",
  "--dropdown-shadow": "0 4px 20px rgba(124,58,237,0.25)",
  "--dropdown-inner-padding": "12px 0",
  position: "relative",
}}>
  <DropDown open isDefaultMode={false} forwardedRef={ref}>
    <DropDownItem label="Option 1" />
    <DropDownItem label="Option 2" />
  </DropDown>
</div>`}}}},j=[`Default`,`WithHeadersAndSeparators`,`WithDisabledItems`,`ScrollableList`,`DirectionVariants`,`CustomWidth`,`WithSeparators`,`RightToLeft`,`CssCustomization`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <BasicTemplate {...args} />,
  args: {
    directionX: "right",
    directionY: "bottom"
  },
  parameters: {
    docs: {
      description: {
        story: "The everyday case: a short menu opened from a button and closed by the next click anywhere else. Press **Open Dropdown**, then change any other prop live in the Controls panel below and open it again."
      },
      source: {
        code: \`const [isOpen, setIsOpen] = useState(false);
const buttonRef = useRef<HTMLButtonElement>(null);

<Button ref={buttonRef} label="Open Dropdown" onClick={() => setIsOpen(true)} />
<DropDown
  open={isOpen}
  forwardedRef={buttonRef}
  clickOutsideAction={() => setIsOpen(false)}
>
  <DropDownItem label="Option 1" onClick={() => setIsOpen(false)} />
  <DropDownItem label="Option 2" onClick={() => setIsOpen(false)} />
  <DropDownItem label="Option 3" onClick={() => setIsOpen(false)} />
</DropDown>\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <WithHeadersTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Dropdowns can include headers and separators to organize items into logical groups."
      },
      source: {
        code: \`<DropDown open={isOpen} forwardedRef={buttonRef} clickOutsideAction={() => setIsOpen(false)}>
  <DropDownItem isHeader label="File" />
  <DropDownItem label="Open" onClick={handleClick} />
  <DropDownItem label="Download" onClick={handleClick} />
  <DropDownItem isSeparator />
  <DropDownItem isHeader label="Edit" />
  <DropDownItem label="Rename" onClick={handleClick} />
  <DropDownItem label="Move" onClick={handleClick} />
</DropDown>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <WithDisabledItemsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Use \`showDisabledItems\` to display disabled items. By default, disabled items are hidden."
      },
      source: {
        code: \`<DropDown open={isOpen} showDisabledItems>
  <DropDownItem label="Edit" onClick={handleClick} />
  <DropDownItem label="Move (no permission)" disabled />
  <DropDownItem label="Delete (no permission)" disabled />
</DropDown>\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <ScrollableTemplate />,
  parameters: {
    docs: {
      description: {
        story: "For a list longer than the screen can hold: the menu stays 200px tall and scrolls (\`maxHeight\`). Open it and press the Down and Up arrows to move the highlight, then Enter to pick the highlighted option."
      },
      source: {
        code: \`<DropDown open={isOpen} maxHeight={200}>
  {items.map((item) => (
    <DropDownItem key={item.id} label={item.label} onClick={handleClick} />
  ))}
</DropDown>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <DirectionsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "To open the menu where there is room for it: each button opens its menu to the side and edge its label names (\`directionX\`, \`directionY\`). A menu that would run past the side of the window opens towards the other side instead."
      },
      source: {
        code: \`<DropDown directionX="right" directionY="bottom">...</DropDown>
<DropDown directionX="left" directionY="bottom">...</DropDown>
<DropDown directionX="right" directionY="top">...</DropDown>
<DropDown directionX="left" directionY="top">...</DropDown>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <CustomWidthTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Use \`manualWidth\` to set a custom width for the dropdown."
      },
      source: {
        code: \`<DropDown open={isOpen} manualWidth="300px">
  <DropDownItem label="This is a longer option text" />
  <DropDownItem label="Another long option" />
  <DropDownItem label="Short" />
</DropDown>\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <SeparatorsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "To group a short menu without titles: thin lines split the editing commands into three groups (\`isSeparator\` on a \`DropDownItem\`)."
      },
      source: {
        code: \`<DropDown open={isOpen}>
  <DropDownItem label="Cut" onClick={handleClick} />
  <DropDownItem label="Copy" onClick={handleClick} />
  <DropDownItem label="Paste" onClick={handleClick} />
  <DropDownItem isSeparator />
  <DropDownItem label="Select All" onClick={handleClick} />
</DropDown>\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <RightToLeftTemplate />,
  globals: {
    direction: "rtl"
  },
  parameters: {
    layout: "fullscreen",
    noPadding: true,
    docs: {
      // Framed, because an inline RTL story flips the whole Docs page.
      story: {
        inline: false,
        height: "220px"
      },
      description: {
        story: "The menu in a right-to-left interface, open from the start: the button sits at the right, the menu lines up with the button's right edge and extends towards the left, and the labels are aligned to the right. The menu renders into the right-to-left container (\`appendTo\`), because on its own it goes to the end of the page body, outside any \`dir\` wrapper."
      },
      source: {
        code: \`<div dir="rtl" ref={setContainer}>
  <Button ref={buttonRef} label="القائمة" onClick={() => setIsOpen(true)} />
  <DropDown
    open={isOpen}
    forwardedRef={buttonRef}
    appendTo={container}
    manualWidth="200px"
    clickOutsideAction={() => setIsOpen(false)}
  >
    <DropDownItem label="فتح" onClick={handleClick} />
    <DropDownItem label="تنزيل" onClick={handleClick} />
  </DropDown>
</div>\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`The variables are listed under CSS variables on this page. Press **Dropdown trigger** to open the menu. It renders inline here (\\\`isDefaultMode={false}\\\`), inside the wrapper that sets the variables; in the default portal mode the menu is on the page body, outside any wrapper, so set them through the DropDown's own \\\`style\\\` prop instead.\`
      },
      source: {
        code: \`<div style={{
  "--dropdown-radius": "12px",
  "--dropdown-bg": "#f5f3ff",
  "--dropdown-border-style": "1px solid #7c3aed",
  "--dropdown-shadow": "0 4px 20px rgba(124,58,237,0.25)",
  "--dropdown-inner-padding": "12px 0",
  position: "relative",
}}>
  <DropDown open isDefaultMode={false} forwardedRef={ref}>
    <DropDownItem label="Option 1" />
    <DropDownItem label="Option 2" />
  </DropDown>
</div>\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}}})))()}M();export{A as CssCustomization,w as CustomWidth,m as Default,S as DirectionVariants,O as RightToLeft,b as ScrollableList,v as WithDisabledItems,g as WithHeadersAndSeparators,E as WithSeparators,j as __namedExportsOrder,f as default};