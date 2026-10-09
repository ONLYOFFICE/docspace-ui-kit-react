import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,r as i,t as a}from"./button-DjDXE7uo.js";import{i as o,n as s,r as c,t as l}from"./modal-dialog-FtQERitO.js";import{n as u,t as d}from"./text-input-D8OFtXHj.js";import{n as f}from"./TextInput.enums-z6wZ2LJ6.js";var p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H;function U(){return(U=e((()=>{p=t(),r(),u(),s(),o(),m=n(),h={title:`UI/Overlays/ModalDialog`,component:l,parameters:{design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=62-3582&mode=design&t=TBNCKMQKQMxr44IZ-0`}},argTypes:{displayType:{control:`select`,options:[c.modal,c.aside],description:`Whether the dialog is a centered modal or a panel attached to the side of the window`,table:{defaultValue:{summary:`modal`}}},visible:{control:`boolean`,description:`Whether the dialog is shown; its markup stays in the document either way`,table:{defaultValue:{summary:`false`}}},isCloseable:{control:`boolean`,description:`Whether the user can close the dialog at all: false removes the close cross and stops Escape and the backdrop click`,table:{defaultValue:{summary:`true`}}},isLoading:{control:`boolean`,description:`Replaces the header, body and footer with a skeleton of the current display type`,table:{defaultValue:{summary:`false`}}},isLarge:{control:`boolean`,description:`Makes the modal 520px wide and up to 400px tall instead of 400px and 280px (modal only)`,table:{defaultValue:{summary:`false`}}},isHuge:{control:`boolean`,description:`Caps the width at 730px; takes effect only together with autoMaxWidth, which lets the modal grow with its content (modal only)`,table:{defaultValue:{summary:`false`}}},autoMaxHeight:{control:`boolean`,description:`Removes the 280px height cap, so the modal grows with its content (modal only)`,table:{defaultValue:{summary:`false`}}},autoMaxWidth:{control:`boolean`,description:`Sizes the modal to its content instead of a fixed 400px width (modal only)`,table:{defaultValue:{summary:`false`}}},withFooterBorder:{control:`boolean`,description:`Draws a line between the body and the footer`,table:{defaultValue:{summary:`true for aside, false for modal`}}},withBodyScroll:{control:`boolean`,description:`Wraps the body in the kit's scrollbar, so long content scrolls inside the panel (aside only)`,table:{defaultValue:{summary:`false`}}},isScrollLocked:{control:`boolean`,description:`Stops the scrollable body from scrolling, together with withBodyScroll (aside only)`,table:{defaultValue:{summary:`false`}}},zIndex:{control:`number`,description:`Stacking order of the backdrop and the dialog on it`,table:{defaultValue:{summary:`310`}}},displayTypeDetailed:{control:`object`,description:`A display type for each of mobile, tablet and desktop widths, re-read when the window is resized; overrides displayType`},onClose:{action:`onClose`,description:`Called by the close cross, Escape, a backdrop click and a downward swipe of the header on a phone`},onBackClick:{action:`onBackClick`,description:`Called by the back arrow and by Backspace pressed outside a text field`},isBackButton:{control:`boolean`,description:`Shows a back arrow before the title`,table:{defaultValue:{summary:`false`}}},closeOnBackdropClick:{control:`boolean`,description:`Whether a click on the backdrop closes the dialog; the close cross and Escape keep working`,table:{defaultValue:{summary:`true`}}},backdropVisible:{control:`boolean`,description:`Whether the backdrop dims the page; a hidden backdrop still catches clicks`,table:{defaultValue:{summary:`true`}}},withForm:{control:`boolean`,description:`Wraps the header, body and footer in a form, so a submit button in the footer submits it`,table:{defaultValue:{summary:`false`}}},onSubmit:{action:`onSubmit`,description:`Called with the submit event of the form added by withForm; the page does not reload`},withoutPadding:{control:`boolean`,description:`Removes the padding around the body`,table:{defaultValue:{summary:`false`}}},withoutHeaderMargin:{control:`boolean`,description:`Removes the 16px gap between the header and the body (modal only)`,table:{defaultValue:{summary:`false`}}},isDoubleFooterLine:{control:`boolean`,description:`Stacks the footer's children in a column, each child a row of its own`,table:{defaultValue:{summary:`false`}}},hideContent:{control:`boolean`,description:`Shows the backdrop with no dialog on it`,table:{defaultValue:{summary:`false`}}},embedded:{control:`boolean`,description:`Removes the close cross and makes Escape and the backdrop click do nothing, whatever isCloseable says`,table:{defaultValue:{summary:`false`}}},containerVisible:{control:`boolean`,description:`Shows the ModalDialog.Container slot in place of the header, body and footer (aside only)`,table:{defaultValue:{summary:`false`}}},withBorder:{control:`boolean`,description:`Draws a one-pixel border on the edge where the side panel meets the page`,table:{defaultValue:{summary:`false`}}},withBodyScrollForcibly:{control:`boolean`,description:`Wraps the body in the kit's scrollbar in either display type`,table:{defaultValue:{summary:`false`}}},scrollbarCreateContext:{control:`boolean`,description:`Lets content inside the scrollable body reach its scrollbar, to scroll it from code`},isInvitePanelLoader:{control:`boolean`,description:`Shapes the side panel's loading skeleton as a list of people to invite (aside only, with isLoading)`,table:{defaultValue:{summary:`false`}}},headerIcons:{control:!1,description:`Extra icon buttons between the title and the close cross, each with a key, an onClick and an icon`},headerComponent:{control:!1,description:`Any node rendered after the header icons and before the close cross`},withoutBorder:{control:`boolean`,description:`Hides the line under the header`,table:{defaultValue:{summary:`false`}}},headerHeight:{control:`text`,description:`Height of the header as a CSS length`,table:{defaultValue:{summary:`53px`}}},blur:{control:!1,description:`Accepted but not read: it changes nothing on screen`},"aria-label":{control:`text`,description:`Accessible name of the dialog, for a dialog with no visible title`},"aria-labelledby":{control:`text`,description:`id of the element naming the dialog, usually its title`},"aria-describedby":{control:`text`,description:`id of the element describing the dialog, announced after its name`},id:{control:`text`,description:`id of the outer element rendered into the page`},className:{control:`text`,description:`Class added to the layer the dialog is centered on`},style:{control:`object`,description:`Inline style of the layer the dialog is centered on`},dataTestId:{control:`text`,description:`data-testid of the outer element`,table:{defaultValue:{summary:`modal`}}},ref:{control:!1,description:`Ref to the outer element`},sheetRef:{control:!1,description:`Ref to the dialog surface itself`},children:{control:!1,description:`The ModalDialog.Header, Body, Footer and Container slots; any other child is dropped`}}},g=({...e})=>{let[t,n]=(0,p.useState)(!1),r=()=>n(!0),o=()=>n(!1),s=e.displayType===c.modal?1:20;return(0,p.useEffect)(()=>{n(!!e.visible)},[e.visible]),(0,p.useEffect)(()=>{document.body.style.overflow=t?`hidden`:`auto`},[t]),(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(a,{label:`Show`,primary:!0,size:i.medium,onClick:r}),(0,m.jsxs)(l,{...e,visible:t,onClose:t=>{e.onClose?.(t),o()},children:[(0,m.jsx)(l.Header,{children:`Change password`}),(0,m.jsx)(l.Body,{children:Array(s).fill(null).map((e,t)=>(0,m.jsxs)(`div`,{children:[(0,m.jsxs)(`h3`,{children:[`Section `,t+1]}),(0,m.jsx)(`p`,{children:`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`})]},`section-${String(t)}`))}),(0,m.jsxs)(l.Footer,{children:[(0,m.jsx)(a,{label:`Send`,primary:!0,size:i.normal,onClick:o,scale:!0},`SendBtn`),(0,m.jsx)(a,{label:`Cancel`,size:i.normal,onClick:o,scale:!0},`CloseBtn`)]})]})]})},_={render:e=>(0,m.jsx)(g,{...e}),args:{displayType:c.modal,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{docs:{description:{story:`The centered modal, for a short task that needs an answer before the page is used again. Click Show to open it and close it with the cross, Escape or a click on the dimmed page; change any other prop live in the Controls panel below.`},source:{code:`<ModalDialog visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Change password</ModalDialog.Header>
  <ModalDialog.Body>
    <p>Modal body content</p>
  </ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Send" primary onClick={closeModal} />
    <Button label="Cancel" onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>`}}}},v=({...e})=>{let[t,n]=(0,p.useState)(!1),r=()=>n(!0),o=()=>n(!1);return(0,p.useEffect)(()=>{n(!!e.visible)},[e.visible]),(0,p.useEffect)(()=>{document.body.style.overflow=t?`hidden`:`auto`},[t]),(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(a,{label:`Show Aside`,primary:!0,size:i.medium,onClick:r}),(0,m.jsxs)(l,{...e,visible:t,onClose:t=>{e.onClose?.(t),o()},children:[(0,m.jsx)(l.Header,{children:`Settings`}),(0,m.jsx)(l.Body,{children:Array(20).fill(null).map((e,t)=>(0,m.jsxs)(`div`,{children:[(0,m.jsxs)(`h3`,{children:[`Section `,t+1]}),(0,m.jsx)(`p`,{children:`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`})]},`aside-section-${String(t)}`))}),(0,m.jsxs)(l.Footer,{children:[(0,m.jsx)(a,{label:`Save`,primary:!0,size:i.normal,onClick:o,scale:!0}),(0,m.jsx)(a,{label:`Cancel`,size:i.normal,onClick:o,scale:!0})]})]})]})},y={render:e=>(0,m.jsx)(v,{...e}),args:{displayType:c.aside,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{docs:{description:{story:"A panel that slides in from the side of the window, for longer content such as settings (`displayType`). On a phone-sized window it rises from the bottom instead."},source:{code:`<ModalDialog displayType={ModalDialogType.aside} visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Settings</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Save" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>`}}}},b={render:e=>(0,m.jsx)(g,{...e}),args:{displayType:c.modal,isLoading:!0,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{docs:{description:{story:"While the content is being fetched, the header, body and footer give way to a skeleton of the same size (`isLoading`), so the dialog does not jump when the data arrives."},source:{code:`<ModalDialog visible={isVisible} isLoading onClose={closeModal}>
  <ModalDialog.Header>Loading...</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>`}}}},x={render:e=>(0,m.jsx)(v,{...e}),args:{displayType:c.aside,isLoading:!0,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{docs:{description:{story:"The side panel's own skeleton, a header bar and rows of placeholders, shown while its content loads (`isLoading`)."},source:{code:`<ModalDialog displayType={ModalDialogType.aside} isLoading visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Loading...</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>`}}}},S={render:e=>(0,m.jsx)(g,{...e}),args:{displayType:c.modal,isLarge:!0,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{docs:{description:{story:`Large modal variant with increased width (520px) and max-height (400px).`},source:{code:`<ModalDialog visible={isVisible} isLarge onClose={closeModal}>
  <ModalDialog.Header>Large Modal</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="OK" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>`}}}},C={render:e=>(0,m.jsx)(g,{...e}),args:{displayType:c.modal,isHuge:!0,autoMaxWidth:!0,autoMaxHeight:!0,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{docs:{description:{story:`Huge modal variant with auto max width and height. Requires autoMaxWidth to be enabled.`},source:{code:`<ModalDialog visible={isVisible} isHuge autoMaxWidth autoMaxHeight onClose={closeModal}>
  <ModalDialog.Header>Huge Modal</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="OK" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>`}}}},w={render:e=>(0,m.jsx)(g,{...e}),args:{displayType:c.modal,autoMaxWidth:!0,autoMaxHeight:!0,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{docs:{description:{story:`Modal with automatic max width and height that adjusts to content size.`},source:{code:`<ModalDialog visible={isVisible} autoMaxWidth autoMaxHeight onClose={closeModal}>
  <ModalDialog.Header>Auto Size</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>`}}}},T={render:e=>(0,m.jsx)(g,{...e}),args:{displayType:c.modal,withFooterBorder:!0,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{docs:{description:{story:`Modal with a visible border between the body and footer sections for visual separation.`},source:{code:`<ModalDialog visible={isVisible} withFooterBorder onClose={closeModal}>
  <ModalDialog.Header>With Footer Border</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="OK" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>`}}}},E={render:e=>(0,m.jsx)(g,{...e}),args:{displayType:c.modal,isCloseable:!1,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{docs:{description:{story:"For a choice the user has to make: there is no close cross, and Escape and a click on the dimmed page do nothing (`isCloseable={false}`). Only the footer buttons close it here."},source:{code:`<ModalDialog visible={isVisible} isCloseable={false} onClose={closeModal}>
  <ModalDialog.Header>Non-Closeable</ModalDialog.Header>
  <ModalDialog.Body>Must use footer button to close</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Close" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>`}}}},D={render:e=>(0,m.jsx)(v,{...e}),args:{displayType:c.aside,withBodyScroll:!0,isScrollLocked:!0,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{docs:{description:{story:"The same long panel with its scrolling switched off (`isScrollLocked`), for a moment when the content must stay where it is, such as while a menu inside it is open."},source:{code:`<ModalDialog displayType={ModalDialogType.aside} withBodyScroll isScrollLocked visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Scroll Locked</ModalDialog.Header>
  <ModalDialog.Body>Scrollable content</ModalDialog.Body>
</ModalDialog>`}}}},O={render:e=>(0,m.jsx)(v,{...e}),args:{displayType:c.aside,withBodyScroll:!0,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{docs:{description:{story:`Aside panel with body scroll enabled, allowing content to scroll within the panel.`},source:{code:`<ModalDialog displayType={ModalDialogType.aside} withBodyScroll visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Scrollable Aside</ModalDialog.Header>
  <ModalDialog.Body>Long scrollable content</ModalDialog.Body>
</ModalDialog>`}}}},k={render:e=>(0,m.jsx)(v,{...e}),args:{displayType:c.aside,isCloseable:!1,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{docs:{description:{story:"The side panel with no close cross; Escape and a click on the dimmed page do nothing either (`isCloseable={false}`). Only the footer buttons close it here."},source:{code:`<ModalDialog displayType={ModalDialogType.aside} isCloseable={false} visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Non-Closeable Aside</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Close" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>`}}}},A={render:e=>(0,m.jsx)(v,{...e}),args:{displayType:c.aside,isBackButton:!0,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{docs:{description:{story:"A panel reached from another one gets a back arrow before its title (`isBackButton`). The arrow and Backspace pressed outside a text field both call `onBackClick`; watch the Actions panel."},source:{code:`<ModalDialog
  displayType={ModalDialogType.aside}
  isBackButton
  onBackClick={handleBack}
  visible={isVisible}
  onClose={closeModal}
>
  <ModalDialog.Header>Settings</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>`}}}},j={render:e=>(0,m.jsx)(g,{...e}),args:{displayType:c.modal,closeOnBackdropClick:!1,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{docs:{description:{story:"A click on the dimmed page leaves the dialog open (`closeOnBackdropClick={false}`), so a stray click cannot throw away what the user typed. The close cross and Escape still close it."},source:{code:`<ModalDialog visible={isVisible} closeOnBackdropClick={false} onClose={closeModal}>
  <ModalDialog.Header>Change password</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>`}}}},M=({...e})=>{let[t,n]=(0,p.useState)(!1),[r,o]=(0,p.useState)(``),s=()=>n(!1);return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(a,{label:`Show`,primary:!0,size:i.medium,onClick:()=>n(!0)}),(0,m.jsxs)(l,{...e,visible:t,onClose:t=>{e.onClose?.(t),s()},onSubmit:t=>{e.onSubmit?.(t),s()},children:[(0,m.jsx)(l.Header,{children:`Rename folder`}),(0,m.jsx)(l.Body,{children:(0,m.jsx)(d,{type:f.text,value:r,placeholder:`Folder name`,onChange:e=>o(e.target.value),scale:!0})}),(0,m.jsxs)(l.Footer,{children:[(0,m.jsx)(a,{label:`Save`,type:`submit`,primary:!0,size:i.normal,scale:!0}),(0,m.jsx)(a,{label:`Cancel`,size:i.normal,onClick:s,scale:!0})]})]})]})},N={render:e=>(0,m.jsx)(M,{...e}),args:{displayType:c.modal,withForm:!0,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{docs:{description:{story:"A dialog that collects a value: Enter in the field or the Save button submits it (`withForm`), and `onSubmit` receives the event with the page reload already prevented; watch the Actions panel."},source:{code:`<ModalDialog visible={isVisible} withForm onSubmit={handleSubmit} onClose={closeModal}>
  <ModalDialog.Header>Rename folder</ModalDialog.Header>
  <ModalDialog.Body>
    <TextInput type={InputType.text} value={name} onChange={handleChange} scale />
  </ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Save" type="submit" primary scale />
    <Button label="Cancel" onClick={closeModal} scale />
  </ModalDialog.Footer>
</ModalDialog>`}}}},P=({...e})=>{let[t,n]=(0,p.useState)(!1),r=()=>n(!1);return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(a,{label:`Show`,primary:!0,size:i.medium,onClick:()=>n(!0)}),(0,m.jsxs)(l,{...e,visible:t,onClose:t=>{e.onClose?.(t),r()},children:[(0,m.jsx)(l.Header,{children:`Leave without saving?`}),(0,m.jsx)(l.Body,{children:(0,m.jsx)(`p`,{children:`Your changes to this document will be lost.`})}),(0,m.jsxs)(l.Footer,{children:[(0,m.jsx)(`div`,{children:(0,m.jsx)(a,{label:`Save and leave`,primary:!0,size:i.normal,onClick:r,scale:!0})}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(a,{label:`Leave`,size:i.normal,onClick:r,scale:!0}),(0,m.jsx)(a,{label:`Cancel`,size:i.normal,onClick:r,scale:!0})]})]})]})]})},F={render:e=>(0,m.jsx)(P,{...e}),args:{displayType:c.modal,isDoubleFooterLine:!0,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{docs:{description:{story:"Three actions do not fit one row of a 400px dialog, so the footer stacks its children (`isDoubleFooterLine`): each `<div>` inside it becomes a row of its own, here the main action above the other two."},source:{code:`<ModalDialog visible={isVisible} isDoubleFooterLine onClose={closeModal}>
  <ModalDialog.Header>Leave without saving?</ModalDialog.Header>
  <ModalDialog.Body>Your changes to this document will be lost.</ModalDialog.Body>
  <ModalDialog.Footer>
    <div>
      <Button label="Save and leave" primary scale />
    </div>
    <div>
      <Button label="Leave" scale />
      <Button label="Cancel" scale />
    </div>
  </ModalDialog.Footer>
</ModalDialog>`}}}},I=({...e})=>{let[t,n]=(0,p.useState)(!1),[r,o]=(0,p.useState)(!1),s=()=>{n(!1),o(!1)};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(a,{label:`Show Aside`,primary:!0,size:i.medium,onClick:()=>n(!0)}),(0,m.jsxs)(l,{...e,visible:t,containerVisible:r,onClose:t=>{e.onClose?.(t),s()},children:[(0,m.jsx)(l.Header,{children:`Settings`}),(0,m.jsx)(l.Body,{children:(0,m.jsx)(`p`,{children:`The panel's own content.`})}),(0,m.jsx)(l.Footer,{children:(0,m.jsx)(a,{label:`Open details`,primary:!0,size:i.normal,onClick:()=>o(!0),scale:!0})}),(0,m.jsx)(l.Container,{children:(0,m.jsxs)(`div`,{style:{padding:16},children:[(0,m.jsx)(`p`,{children:`Details replace the whole panel.`}),(0,m.jsx)(a,{label:`Back`,size:i.normal,onClick:()=>o(!1)})]})})]})]})},L={render:e=>(0,m.jsx)(I,{...e}),args:{displayType:c.aside,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{docs:{description:{story:"A side panel that swaps in a second view without closing: Open details shows the `ModalDialog.Container` slot in place of the header, body and footer (`containerVisible`), and Back returns. The slot is ignored in the centered modal."},source:{code:`<ModalDialog
  displayType={ModalDialogType.aside}
  containerVisible={showDetails}
  visible={isVisible}
  onClose={closeModal}
>
  <ModalDialog.Header>Settings</ModalDialog.Header>
  <ModalDialog.Body>The panel's own content.</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Open details" primary onClick={() => setShowDetails(true)} />
  </ModalDialog.Footer>
  <ModalDialog.Container>
    <DetailsView onBack={() => setShowDetails(false)} />
  </ModalDialog.Container>
</ModalDialog>`}}}},R={render:e=>(0,m.jsx)(`div`,{dir:`rtl`,children:(0,m.jsx)(v,{...e})}),globals:{direction:`rtl`},args:{displayType:c.aside,isBackButton:!0,children:(0,m.jsx)(m.Fragment,{children:`test`})},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`420px`},description:{story:"The side panel under a right-to-left interface: it is attached to the left edge and slides in from there, the back arrow points the other way and the close cross sits on the left of the header. The dialog renders outside the story's `<div dir=\"rtl\">`, so it takes the direction from the theme's `interfaceDirection` (the Direction toolbar)."},source:{code:`<ModalDialog
  displayType={ModalDialogType.aside}
  isBackButton
  onBackClick={handleBack}
  visible={isVisible}
  onClose={closeModal}
>
  <ModalDialog.Header>Settings</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>`}}}},z={"--modal-dialog-backdrop":`rgba(30, 27, 75, 0.4)`,"--modal-dialog-radius":`16px`,"--modal-dialog-horizontal-padding":`24px`,"--modal-dialog-vertical-padding":`20px`,"--modal-dialog-buttons-gap":`12px`,"--modal-dialog-header-offset":`8px`,"--modal-dialog-default-width":`460px`,"--modal-dialog-default-max-height":`320px`,"--modal-dialog-aside-default-width":`360px`,"--modal-dialog-header-justify":`flex-end`,"--modal-dialog-header-border-display":`none`,"--modal-dialog-header-title-position":`absolute`,"--modal-dialog-header-title-inset":`50%`,"--modal-dialog-header-title-transform":`translateX(-50%)`,"--modal-dialog-header-title-text-align":`center`},B=()=>{let[e,t]=(0,p.useState)(null);(0,p.useEffect)(()=>{if(!e)return;let{style:t}=document.body;return Object.entries(z).forEach(([e,n])=>t.setProperty(e,n)),()=>{Object.keys(z).forEach(e=>t.removeProperty(e))}},[e]);let n=()=>t(null);return(0,m.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,m.jsx)(a,{label:`Show`,primary:!0,size:i.medium,onClick:()=>t(`modal`)}),(0,m.jsx)(a,{label:`Show Aside`,size:i.medium,onClick:()=>t(`aside`)}),(0,m.jsxs)(l,{visible:e===`modal`,onClose:n,displayType:c.modal,withFooterBorder:!0,style:{"--modal-dialog-bg":`#1e1b4b`,"--modal-dialog-color":`#e0e7ff`,"--modal-dialog-divider":`#818cf8`},children:[(0,m.jsx)(l.Header,{children:`Custom styled dialog`}),(0,m.jsx)(l.Body,{children:(0,m.jsx)(`p`,{children:`This dialog uses CSS custom properties for theming.`})}),(0,m.jsxs)(l.Footer,{children:[(0,m.jsx)(a,{label:`Confirm`,primary:!0,size:i.normal,scale:!0,onClick:n}),(0,m.jsx)(a,{label:`Cancel`,size:i.normal,scale:!0,onClick:n})]})]}),(0,m.jsxs)(l,{visible:e===`aside`,onClose:n,displayType:c.aside,withBorder:!0,style:{"--modal-dialog-bg":`#1e1b4b`,"--modal-dialog-color":`#e0e7ff`,"--modal-dialog-divider":`#818cf8`,"--modal-dialog-aside-border":`#f59e0b`},children:[(0,m.jsx)(l.Header,{children:`Custom styled panel`}),(0,m.jsx)(l.Body,{children:(0,m.jsx)(`p`,{children:`The same variables on the side panel.`})}),(0,m.jsx)(l.Footer,{children:(0,m.jsx)(a,{label:`Close`,primary:!0,size:i.normal,scale:!0,onClick:n})})]})]})},V={render:()=>(0,m.jsx)(B,{}),parameters:{docs:{description:{story:"Every overridable variable in use -- the variables are listed under CSS variables on this page, which also says which ones must be set on `body` or `:root` rather than on the dialog. This example puts the colours on each dialog's `style` prop and sets the page-level ones on `body` while a dialog is open.\n\n- **Show** — the modal with `withFooterBorder`: colors from its `style` prop, and radius, width, height cap, paddings, gaps, backdrop and a centered title with no line under it from the page\n- **Show Aside** — the side panel with `withBorder`, for `--modal-dialog-aside-border` and `--modal-dialog-aside-default-width`"},source:{code:`/* Page-level variables */
body {
  --modal-dialog-radius: 16px;
  --modal-dialog-default-width: 460px;
  --modal-dialog-horizontal-padding: 24px;
  --modal-dialog-buttons-gap: 12px;
}

<ModalDialog
  visible={isVisible}
  withFooterBorder
  style={{
    "--modal-dialog-bg": "#1e1b4b",
    "--modal-dialog-color": "#e0e7ff",
    "--modal-dialog-divider": "#818cf8",
  }}
  onClose={closeModal}
>
  ...
</ModalDialog>`}}}},H=[`Default`,`AsideDisplay`,`LoadingState`,`AsideLoadingState`,`LargeModal`,`HugeModal`,`AutoSizeModal`,`WithFooterBorder`,`NonCloseable`,`AsideScrollLocked`,`AsideWithBodyScroll`,`AsideNonCloseable`,`WithBackButton`,`BackdropClickDisabled`,`FormDialog`,`TwoFooterRows`,`AsideWithContainer`,`RightToLeft`,`CssCustomization`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    children: <>test</>
  },
  parameters: {
    docs: {
      description: {
        story: "The centered modal, for a short task that needs an answer before the page is used again. Click Show to open it and close it with the cross, Escape or a click on the dimmed page; change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<ModalDialog visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Change password</ModalDialog.Header>
  <ModalDialog.Body>
    <p>Modal body content</p>
  </ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Send" primary onClick={closeModal} />
    <Button label="Cancel" onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    children: <>test</>
  },
  parameters: {
    docs: {
      description: {
        story: "A panel that slides in from the side of the window, for longer content such as settings (\`displayType\`). On a phone-sized window it rises from the bottom instead."
      },
      source: {
        code: \`<ModalDialog displayType={ModalDialogType.aside} visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Settings</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Save" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    isLoading: true,
    children: <>test</>
  },
  parameters: {
    docs: {
      description: {
        story: "While the content is being fetched, the header, body and footer give way to a skeleton of the same size (\`isLoading\`), so the dialog does not jump when the data arrives."
      },
      source: {
        code: \`<ModalDialog visible={isVisible} isLoading onClose={closeModal}>
  <ModalDialog.Header>Loading...</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    isLoading: true,
    children: <>test</>
  },
  parameters: {
    docs: {
      description: {
        story: "The side panel's own skeleton, a header bar and rows of placeholders, shown while its content loads (\`isLoading\`)."
      },
      source: {
        code: \`<ModalDialog displayType={ModalDialogType.aside} isLoading visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Loading...</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    isLarge: true,
    children: <>test</>
  },
  parameters: {
    docs: {
      description: {
        story: "Large modal variant with increased width (520px) and max-height (400px)."
      },
      source: {
        code: \`<ModalDialog visible={isVisible} isLarge onClose={closeModal}>
  <ModalDialog.Header>Large Modal</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="OK" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    isHuge: true,
    autoMaxWidth: true,
    autoMaxHeight: true,
    children: <>test</>
  },
  parameters: {
    docs: {
      description: {
        story: "Huge modal variant with auto max width and height. Requires autoMaxWidth to be enabled."
      },
      source: {
        code: \`<ModalDialog visible={isVisible} isHuge autoMaxWidth autoMaxHeight onClose={closeModal}>
  <ModalDialog.Header>Huge Modal</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="OK" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    autoMaxWidth: true,
    autoMaxHeight: true,
    children: <>test</>
  },
  parameters: {
    docs: {
      description: {
        story: "Modal with automatic max width and height that adjusts to content size."
      },
      source: {
        code: \`<ModalDialog visible={isVisible} autoMaxWidth autoMaxHeight onClose={closeModal}>
  <ModalDialog.Header>Auto Size</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    withFooterBorder: true,
    children: <>test</>
  },
  parameters: {
    docs: {
      description: {
        story: "Modal with a visible border between the body and footer sections for visual separation."
      },
      source: {
        code: \`<ModalDialog visible={isVisible} withFooterBorder onClose={closeModal}>
  <ModalDialog.Header>With Footer Border</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="OK" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    isCloseable: false,
    children: <>test</>
  },
  parameters: {
    docs: {
      description: {
        story: "For a choice the user has to make: there is no close cross, and Escape and a click on the dimmed page do nothing (\`isCloseable={false}\`). Only the footer buttons close it here."
      },
      source: {
        code: \`<ModalDialog visible={isVisible} isCloseable={false} onClose={closeModal}>
  <ModalDialog.Header>Non-Closeable</ModalDialog.Header>
  <ModalDialog.Body>Must use footer button to close</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Close" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: args => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    withBodyScroll: true,
    isScrollLocked: true,
    children: <>test</>
  },
  parameters: {
    docs: {
      description: {
        story: "The same long panel with its scrolling switched off (\`isScrollLocked\`), for a moment when the content must stay where it is, such as while a menu inside it is open."
      },
      source: {
        code: \`<ModalDialog displayType={ModalDialogType.aside} withBodyScroll isScrollLocked visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Scroll Locked</ModalDialog.Header>
  <ModalDialog.Body>Scrollable content</ModalDialog.Body>
</ModalDialog>\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: args => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    withBodyScroll: true,
    children: <>test</>
  },
  parameters: {
    docs: {
      description: {
        story: "Aside panel with body scroll enabled, allowing content to scroll within the panel."
      },
      source: {
        code: \`<ModalDialog displayType={ModalDialogType.aside} withBodyScroll visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Scrollable Aside</ModalDialog.Header>
  <ModalDialog.Body>Long scrollable content</ModalDialog.Body>
</ModalDialog>\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: args => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    isCloseable: false,
    children: <>test</>
  },
  parameters: {
    docs: {
      description: {
        story: "The side panel with no close cross; Escape and a click on the dimmed page do nothing either (\`isCloseable={false}\`). Only the footer buttons close it here."
      },
      source: {
        code: \`<ModalDialog displayType={ModalDialogType.aside} isCloseable={false} visible={isVisible} onClose={closeModal}>
  <ModalDialog.Header>Non-Closeable Aside</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Close" primary onClick={closeModal} />
  </ModalDialog.Footer>
</ModalDialog>\`
      }
    }
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: args => <AsideTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    isBackButton: true,
    children: <>test</>
  },
  parameters: {
    docs: {
      description: {
        story: "A panel reached from another one gets a back arrow before its title (\`isBackButton\`). The arrow and Backspace pressed outside a text field both call \`onBackClick\`; watch the Actions panel."
      },
      source: {
        code: \`<ModalDialog
  displayType={ModalDialogType.aside}
  isBackButton
  onBackClick={handleBack}
  visible={isVisible}
  onClose={closeModal}
>
  <ModalDialog.Header>Settings</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    closeOnBackdropClick: false,
    children: <>test</>
  },
  parameters: {
    docs: {
      description: {
        story: "A click on the dimmed page leaves the dialog open (\`closeOnBackdropClick={false}\`), so a stray click cannot throw away what the user typed. The close cross and Escape still close it."
      },
      source: {
        code: \`<ModalDialog visible={isVisible} closeOnBackdropClick={false} onClose={closeModal}>
  <ModalDialog.Header>Change password</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>\`
      }
    }
  }
}`,...j.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: args => <FormTemplate {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    withForm: true,
    children: <>test</>
  },
  parameters: {
    docs: {
      description: {
        story: "A dialog that collects a value: Enter in the field or the Save button submits it (\`withForm\`), and \`onSubmit\` receives the event with the page reload already prevented; watch the Actions panel."
      },
      source: {
        code: \`<ModalDialog visible={isVisible} withForm onSubmit={handleSubmit} onClose={closeModal}>
  <ModalDialog.Header>Rename folder</ModalDialog.Header>
  <ModalDialog.Body>
    <TextInput type={InputType.text} value={name} onChange={handleChange} scale />
  </ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Save" type="submit" primary scale />
    <Button label="Cancel" onClick={closeModal} scale />
  </ModalDialog.Footer>
</ModalDialog>\`
      }
    }
  }
}`,...N.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: args => <DoubleFooterTemplate {...args} />,
  args: {
    displayType: ModalDialogType.modal,
    isDoubleFooterLine: true,
    children: <>test</>
  },
  parameters: {
    docs: {
      description: {
        story: "Three actions do not fit one row of a 400px dialog, so the footer stacks its children (\`isDoubleFooterLine\`): each \`<div>\` inside it becomes a row of its own, here the main action above the other two."
      },
      source: {
        code: \`<ModalDialog visible={isVisible} isDoubleFooterLine onClose={closeModal}>
  <ModalDialog.Header>Leave without saving?</ModalDialog.Header>
  <ModalDialog.Body>Your changes to this document will be lost.</ModalDialog.Body>
  <ModalDialog.Footer>
    <div>
      <Button label="Save and leave" primary scale />
    </div>
    <div>
      <Button label="Leave" scale />
      <Button label="Cancel" scale />
    </div>
  </ModalDialog.Footer>
</ModalDialog>\`
      }
    }
  }
}`,...F.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: args => <ContainerTemplate {...args} />,
  args: {
    displayType: ModalDialogType.aside,
    children: <>test</>
  },
  parameters: {
    docs: {
      description: {
        story: "A side panel that swaps in a second view without closing: Open details shows the \`ModalDialog.Container\` slot in place of the header, body and footer (\`containerVisible\`), and Back returns. The slot is ignored in the centered modal."
      },
      source: {
        code: \`<ModalDialog
  displayType={ModalDialogType.aside}
  containerVisible={showDetails}
  visible={isVisible}
  onClose={closeModal}
>
  <ModalDialog.Header>Settings</ModalDialog.Header>
  <ModalDialog.Body>The panel's own content.</ModalDialog.Body>
  <ModalDialog.Footer>
    <Button label="Open details" primary onClick={() => setShowDetails(true)} />
  </ModalDialog.Footer>
  <ModalDialog.Container>
    <DetailsView onBack={() => setShowDetails(false)} />
  </ModalDialog.Container>
</ModalDialog>\`
      }
    }
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <AsideTemplate {...args} />
    </div>,
  globals: {
    direction: "rtl"
  },
  args: {
    displayType: ModalDialogType.aside,
    isBackButton: true,
    children: <>test</>
  },
  parameters: {
    noPadding: true,
    docs: {
      story: {
        inline: false,
        height: "420px"
      },
      description: {
        story: "The side panel under a right-to-left interface: it is attached to the left edge and slides in from there, the back arrow points the other way and the close cross sits on the left of the header. The dialog renders outside the story's \`<div dir=\\"rtl\\">\`, so it takes the direction from the theme's \`interfaceDirection\` (the Direction toolbar)."
      },
      source: {
        code: \`<ModalDialog
  displayType={ModalDialogType.aside}
  isBackButton
  onBackClick={handleBack}
  visible={isVisible}
  onClose={closeModal}
>
  <ModalDialog.Header>Settings</ModalDialog.Header>
  <ModalDialog.Body>Content</ModalDialog.Body>
</ModalDialog>\`
      }
    }
  }
}`,...R.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable in use -- the variables are listed under CSS variables on this page, which also says which ones must be set on \\\`body\\\` or \\\`:root\\\` rather than on the dialog. This example puts the colours on each dialog's \\\`style\\\` prop and sets the page-level ones on \\\`body\\\` while a dialog is open.

- **Show** — the modal with \\\`withFooterBorder\\\`: colors from its \\\`style\\\` prop, and radius, width, height cap, paddings, gaps, backdrop and a centered title with no line under it from the page
- **Show Aside** — the side panel with \\\`withBorder\\\`, for \\\`--modal-dialog-aside-border\\\` and \\\`--modal-dialog-aside-default-width\\\`\`
      },
      source: {
        code: \`/* Page-level variables */
body {
  --modal-dialog-radius: 16px;
  --modal-dialog-default-width: 460px;
  --modal-dialog-horizontal-padding: 24px;
  --modal-dialog-buttons-gap: 12px;
}

<ModalDialog
  visible={isVisible}
  withFooterBorder
  style={{
    "--modal-dialog-bg": "#1e1b4b",
    "--modal-dialog-color": "#e0e7ff",
    "--modal-dialog-divider": "#818cf8",
  }}
  onClose={closeModal}
>
  ...
</ModalDialog>\`
      }
    }
  }
}`,...V.parameters?.docs?.source}}}})))()}U();export{y as AsideDisplay,x as AsideLoadingState,k as AsideNonCloseable,D as AsideScrollLocked,O as AsideWithBodyScroll,L as AsideWithContainer,w as AutoSizeModal,j as BackdropClickDisabled,V as CssCustomization,_ as Default,N as FormDialog,C as HugeModal,S as LargeModal,b as LoadingState,E as NonCloseable,R as RightToLeft,F as TwoFooterRows,A as WithBackButton,T as WithFooterBorder,H as __namedExportsOrder,h as default};