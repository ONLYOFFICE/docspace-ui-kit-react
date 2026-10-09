import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./catalog.folder.react-VUpu0ofJ.js";import{n as i,t as a}from"./main-button-mobile-BT1wLH3n.js";var o,s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{n(),i(),o=t(),s={position:`fixed`,bottom:`24px`,insetInlineEnd:`24px`},c=[{key:`1`,label:`New document`,icon:r},{key:`2`,label:`New presentation`,icon:r},{key:`3`,label:`New spreadsheet`,icon:r},{key:`4`,label:`New folder`,icon:r}],l=[{key:`1`,label:`Upload files`,icon:r},{key:`2`,label:`Upload folder`,icon:r}],u={title:`UI/Interactive elements/MainButtonMobile`,component:a,parameters:{layout:`fullscreen`,docs:{story:{inline:!1,height:`500px`}}},argTypes:{actionOptions:{control:!1,description:"Items of the upper group of the menu. An item with `items` becomes a submenu that expands in place; its handler is called with the item's `action`"},buttonOptions:{control:!1,description:"Items of the lower group, drawn on a background of their own. An item with `items` becomes a submenu"},opened:{control:`boolean`,description:`Whether the menu is open. The button still toggles it on its own, so it changes back without telling you`,table:{defaultValue:{summary:`false`}}},alert:{control:`boolean`,description:`Shows an alert badge on the button while the menu is closed`,table:{defaultValue:{summary:`false`}}},withAlertClick:{control:`boolean`,description:"Whether a click on the alert badge calls `onAlertClick`",table:{defaultValue:{summary:`false`}}},withMenu:{control:`boolean`,description:"Whether the button opens the menu. When off, a click calls `onClick` and the menu never opens",table:{defaultValue:{summary:`true`}}},withoutButton:{control:`boolean`,description:`Draws the lower group on the plain grey background instead of its own blue one; nothing is hidden`,table:{defaultValue:{summary:`false`}}},isOpenButton:{control:`boolean`,description:"Whether `onClose` is called at all. It then fires on every toggle, including the one that opens the menu",table:{defaultValue:{summary:`false`}}},manualWidth:{control:`text`,description:`Width of the menu as a CSS length, never wider than the window less 48px`,table:{defaultValue:{summary:`400px`}}},dropdownStyle:{control:`object`,description:`Inline style of the menu. The height is measured from the items and overrides any height given here`},style:{control:`object`,description:`Inline style of the wrapper that carries the button and the menu, applied after its own z-index`},className:{control:`text`,description:`Class of the wrapper that carries the button and the menu`},onClick:{action:`onClick`,description:"Called with the click event when the button is clicked, and only while `withMenu` is off"},onClose:{action:`onClose`,description:"Called on every toggle of the menu, opening included, and only while `isOpenButton` is set"},onAlertClick:{action:`onAlertClick`,description:"Called when the alert badge is clicked, and only while `withAlertClick` is set"},ref:{control:!1,description:"Handle exposing `contains(target)` and `getButtonElement()`, for telling whether a click landed on the button"},title:{control:!1,description:`Ignored. Nothing reads this prop; the groups have no heading`},percent:{control:!1,description:`Ignored. Nothing reads this prop; the button draws no progress`},withButton:{control:!1,description:`Ignored. Nothing reads this prop`},onUploadClick:{control:!1,description:"Ignored. Nothing reads this prop; the button's own handler is `onClick`"},sectionWidth:{control:!1,description:`Ignored. Nothing reads this prop`},mainButtonRef:{control:!1,description:"Ignored. The component keeps its own element ref; use `ref` to reach the button"}}},d={args:{opened:!1,alert:!1,withMenu:!0,style:s,actionOptions:c,buttonOptions:l},parameters:{docs:{description:{story:`The button in the corner of the screen with both groups of items. Tap it to open the menu, tap outside or pick an item to close it, and change any other prop live in the Controls panel below.`},source:{code:`<MainButtonMobile
  style={{ position: "fixed", bottom: "24px", insetInlineEnd: "24px" }}
  actionOptions={actionOptions}
  buttonOptions={buttonOptions}
/>`}}}},f={args:{alert:!0,withAlertClick:!0,style:s,actionOptions:c},parameters:{docs:{description:{story:"A badge on the closed button draws attention to something waiting for the user (`alert`). Click the badge to see `onAlertClick` in the Actions panel, which is called only while `withAlertClick` is set; the badge is hidden while the menu is open."},source:{code:`<MainButtonMobile
  alert
  withAlertClick
  onAlertClick={openNotifications}
  actionOptions={actionOptions}
/>`}}}},p={args:{opened:!0,style:s,actionOptions:[{key:`form`,label:`New form`,icon:r,openByDefault:!0,items:[{key:`form-blank`,label:`From blank`,action:`form-blank`},{key:`form-file`,label:`From a text file`,action:`form-file`}]},{key:`folder`,label:`New folder`,icon:r,description:`Keeps related files together`}]},parameters:{docs:{description:{story:"Groups related actions under one item without opening a second menu. **New form** opens its nested items in place under it, already expanded (`items`, `openByDefault`); **New folder** carries a second line under its label (`description`)."},source:{code:`<MainButtonMobile
  opened
  actionOptions={[
    {
      key: "form",
      label: "New form",
      icon: FolderIcon,
      openByDefault: true,
      items: [
        { key: "form-blank", label: "From blank", action: "form-blank" },
        { key: "form-file", label: "From a text file", action: "form-file" },
      ],
    },
    { key: "folder", label: "New folder", icon: FolderIcon, description: "Keeps related files together" },
  ]}
/>`}}}},m={args:{withMenu:!1,style:s},parameters:{docs:{description:{story:"For a screen with only one thing to create, the button runs that action directly (`withMenu`). Click it to see `onClick` in the Actions panel; no menu opens."},source:{code:`<MainButtonMobile withMenu={false} onClick={handleUpload} />`}}}},h={render:()=>(0,o.jsx)(`div`,{style:{"--main-button-mobile-button-color":`#7c3aed`,"--main-button-mobile-icon-fill":`#ffffff`,"--main-button-mobile-badge-size":`14px`,"--main-button-mobile-badge-offset":`8px`,"--main-button-mobile-dropdown-item-padding":`8px 20px`,"--main-button-mobile-button-options-background-color":`#5b21b6`},children:(0,o.jsx)(a,{alert:!0,actionOptions:c,buttonOptions:l,style:s})}),parameters:{docs:{description:{story:`The variables are listed under CSS variables on this page. One instance, with the alert badge on so the badge variables show. Open the menu to see the item padding and the lower group's background.`},source:{code:`<div
  style={{
    "--main-button-mobile-button-color": "#7c3aed",
    "--main-button-mobile-icon-fill": "#ffffff",
    "--main-button-mobile-badge-size": "14px",
    "--main-button-mobile-badge-offset": "8px",
    "--main-button-mobile-dropdown-item-padding": "8px 20px",
    "--main-button-mobile-button-options-background-color": "#5b21b6",
  }}
>
  <MainButtonMobile alert actionOptions={actionOptions} buttonOptions={buttonOptions} />
</div>`}}}},g=[`Default`,`WithAlert`,`WithSubmenu`,`WithoutMenu`,`CssCustomization`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    opened: false,
    alert: false,
    withMenu: true,
    style: cornerStyle,
    actionOptions,
    buttonOptions
  },
  parameters: {
    docs: {
      description: {
        story: "The button in the corner of the screen with both groups of items. Tap it to open the menu, tap outside or pick an item to close it, and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<MainButtonMobile
  style={{ position: "fixed", bottom: "24px", insetInlineEnd: "24px" }}
  actionOptions={actionOptions}
  buttonOptions={buttonOptions}
/>\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    alert: true,
    withAlertClick: true,
    style: cornerStyle,
    actionOptions
  },
  parameters: {
    docs: {
      description: {
        story: "A badge on the closed button draws attention to something waiting for the user (\`alert\`). Click the badge to see \`onAlertClick\` in the Actions panel, which is called only while \`withAlertClick\` is set; the badge is hidden while the menu is open."
      },
      source: {
        code: \`<MainButtonMobile
  alert
  withAlertClick
  onAlertClick={openNotifications}
  actionOptions={actionOptions}
/>\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    opened: true,
    style: cornerStyle,
    actionOptions: [{
      key: "form",
      label: "New form",
      icon: CatalogFolderReactSvgUrl,
      openByDefault: true,
      items: [{
        key: "form-blank",
        label: "From blank",
        action: "form-blank"
      }, {
        key: "form-file",
        label: "From a text file",
        action: "form-file"
      }]
    }, {
      key: "folder",
      label: "New folder",
      icon: CatalogFolderReactSvgUrl,
      description: "Keeps related files together"
    }]
  },
  parameters: {
    docs: {
      description: {
        story: "Groups related actions under one item without opening a second menu. **New form** opens its nested items in place under it, already expanded (\`items\`, \`openByDefault\`); **New folder** carries a second line under its label (\`description\`)."
      },
      source: {
        code: \`<MainButtonMobile
  opened
  actionOptions={[
    {
      key: "form",
      label: "New form",
      icon: FolderIcon,
      openByDefault: true,
      items: [
        { key: "form-blank", label: "From blank", action: "form-blank" },
        { key: "form-file", label: "From a text file", action: "form-file" },
      ],
    },
    { key: "folder", label: "New folder", icon: FolderIcon, description: "Keeps related files together" },
  ]}
/>\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    withMenu: false,
    style: cornerStyle
  },
  parameters: {
    docs: {
      description: {
        story: "For a screen with only one thing to create, the button runs that action directly (\`withMenu\`). Click it to see \`onClick\` in the Actions panel; no menu opens."
      },
      source: {
        code: \`<MainButtonMobile withMenu={false} onClick={handleUpload} />\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--main-button-mobile-button-color": "#7c3aed",
    "--main-button-mobile-icon-fill": "#ffffff",
    "--main-button-mobile-badge-size": "14px",
    "--main-button-mobile-badge-offset": "8px",
    "--main-button-mobile-dropdown-item-padding": "8px 20px",
    "--main-button-mobile-button-options-background-color": "#5b21b6"
  } as CSSProperties}>
      <MainButtonMobile alert actionOptions={actionOptions} buttonOptions={buttonOptions} style={cornerStyle} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The variables are listed under CSS variables on this page. One instance, with the alert badge on so the badge variables show. Open the menu to see the item padding and the lower group's background.\`
      },
      source: {
        code: \`<div
  style={{
    "--main-button-mobile-button-color": "#7c3aed",
    "--main-button-mobile-icon-fill": "#ffffff",
    "--main-button-mobile-badge-size": "14px",
    "--main-button-mobile-badge-offset": "8px",
    "--main-button-mobile-dropdown-item-padding": "8px 20px",
    "--main-button-mobile-button-options-background-color": "#5b21b6",
  }}
>
  <MainButtonMobile alert actionOptions={actionOptions} buttonOptions={buttonOptions} />
</div>\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}}})))()}_();export{h as CssCustomization,d as Default,f as WithAlert,p as WithSubmenu,m as WithoutMenu,g as __namedExportsOrder,u as default};