import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{S as r,n as i}from"./enums-DzcBu485.js";import{n as a,t as o}from"./Navigation-CMyNHB04.js";var s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{t(),r(),a(),s=n(),{fn:c}=__STORYBOOK_MODULE_TEST__,l={title:`UI/Navigation/Navigation`,component:o,parameters:{},argTypes:{title:{control:`text`,description:`Current folder title`},showText:{control:`boolean`,description:`Not read by the component; changing it changes nothing`},isRootFolder:{control:`boolean`,description:`Whether the current folder is the root`},canCreate:{control:`boolean`,description:"Whether the person may create anything here. The plus button needs this and `isPlusButtonVisible` both"},isPlusButtonVisible:{control:`boolean`,description:"Shows the plus button, together with `canCreate`. Without it no plus button is rendered",table:{defaultValue:{summary:`undefined`}}},isContextButtonVisible:{control:`boolean`,description:"Shows the folder's context button. Without it the folder menu is never rendered, whatever `getContextOptionsFolder` returns",table:{defaultValue:{summary:`undefined`}}},withMenu:{control:`boolean`,description:"Whether the plus and folder buttons open their menus themselves. With `false` they only call `onPlusClick` or `onContextOptionsClick`",table:{defaultValue:{summary:`true`}}},isTrashFolder:{control:`boolean`,description:`Opens the folder menu shifted to the side of its button; nothing else in the header changes`,table:{defaultValue:{summary:`undefined`}}},isRoom:{control:`boolean`,description:`Not read by the component; changing it changes nothing`},isDesktop:{control:`boolean`,description:"Whether the host is the desktop application; it only limits the height of the open drop box. The layout follows `currentDeviceType`"},currentDeviceType:{control:`select`,options:[i.desktop,i.tablet,i.mobile],description:`Which layout to render. Below desktop the info panel toggle and the AI chat button move into the button row and the plus button is dropped; on a phone the parent title is hidden too`},isInfoPanelVisible:{control:`boolean`,description:`Whether the info panel is currently visible`},hideInfoPanel:{control:!1,description:`Hides the info panel toggle whenever it is set, because it is read as a flag and never called`,table:{defaultValue:{summary:`undefined`}}},navigationButtonLabel:{control:`text`,description:`Label of an extra button at the end of the row. Without it the button is not rendered; it is also hidden in the root folder`,table:{defaultValue:{summary:`undefined`}}},showNavigationButton:{control:`boolean`,description:"Widens the header's last column to at least 186px for the extra button; the button itself appears with `navigationButtonLabel`"},showRootFolderTitle:{control:`boolean`,description:"Shows the second, clickable title before the folder's name. It is ignored in the root folder, on a phone, and with one folder in the trail and no `rootRoomTitle`"},rootRoomTitle:{control:`text`,description:`Text of the second title. Without it the parent folder's name from the trail is used`},badgeLabel:{control:`text`,description:`Text of a small badge next to the title; it follows the second title when one is shown`,table:{defaultValue:{summary:`undefined`}}},titleTooltip:{control:`text`,description:`Native tooltip of the folder's name, in place of the name itself. It is dropped while the second title is shown`,table:{defaultValue:{summary:`undefined`}}},showTitle:{control:`boolean`,description:`Shows the folder's name and the second title; without it only the arrow and the buttons remain`,table:{defaultValue:{summary:`undefined`}}},showBackButton:{control:`boolean`,description:`Shows the back arrow even in the root folder, where it is otherwise hidden`,table:{defaultValue:{summary:`undefined`}}},isFrame:{control:`boolean`,description:`Whether the header is rendered inside an embedding frame. It hides the folder button, the extra button and the tariff notice`,table:{defaultValue:{summary:`undefined`}}},isPublicRoom:{control:`boolean`,description:`Replaces the folder button with one that appears only when at least one of its options is enabled`,table:{defaultValue:{summary:`undefined`}}},withLogo:{control:!1,description:"Shows a logo at the start of the header. A string is used as the logo image's URL; `true` shows only `burgerLogo`"},burgerLogo:{control:!1,description:"URL of the logo image shown while `withLogo` is set"},titleIcon:{control:!1,description:`URL of a small SVG icon before the title; it is hidden in the root folder`},titleIconTooltip:{control:`text`,description:`Tooltip text of the title icon`,table:{defaultValue:{summary:`undefined`}}},titles:{control:`object`,description:`Native tooltips of the info panel, AI chat, plus and folder buttons, the label of the AI chat button, and the text and icon of the notice chip`,table:{defaultValue:{summary:`undefined`}}},navigationItems:{control:`object`,description:`The folder trail, outermost folder first; the last entry is the current folder. An empty list makes the title unclickable`},toggleChatPanel:{control:!1,description:`Called when the AI chat button is clicked. Without it the button is not rendered`,table:{defaultValue:{summary:`undefined`}}},isChatPanelVisible:{control:`boolean`,description:`Whether the AI chat panel is open; the AI chat button shows its pressed look while it is`,table:{defaultValue:{summary:`undefined`}}},hideChatButton:{control:`boolean`,description:"Hides the AI chat button even when `toggleChatPanel` is set",table:{defaultValue:{summary:`undefined`}}},getContextOptionsFolder:{control:!1,description:`Returns the items of the folder menu. It is called on every render, so it has to be cheap`},getContextOptionsPlus:{control:!1,description:`Returns the items of the plus button's menu`},onClickFolder:{control:!1,description:`Called with a folder's id when it is chosen in the drop box or when the second title is clicked`},onBackToParentFolder:{control:!1,description:`Called when the back arrow is clicked`},toggleInfoPanel:{control:!1,description:`Called when the info panel toggle is clicked`},onPlusClick:{control:!1,description:"Called when the plus button is clicked while `withMenu` is `false`",table:{defaultValue:{summary:`undefined`}}},onContextOptionsClick:{control:!1,description:`Called when the folder button is clicked, before its menu opens`,table:{defaultValue:{summary:`undefined`}}},onNavigationButtonClick:{control:!1,description:`Called when the extra labelled button is clicked`,table:{defaultValue:{summary:`undefined`}}},onLogoClick:{control:!1,description:`Called when the logo is clicked`,table:{defaultValue:{summary:`undefined`}}},tariffBar:{control:!1,description:"Element shown after the buttons, cloned with the folder's `title` added as a prop. Hidden inside a frame",table:{defaultValue:{summary:`undefined`}}},analyzeResponsesButton:{control:!1,description:`Any node, rendered as it is after the tariff notice`,table:{defaultValue:{summary:`undefined`}}},contextMenuHeader:{control:!1,description:`Header of the folder menu where it opens as a sheet below the desktop layout`,table:{defaultValue:{summary:`undefined`}}},showTitleInDropBox:{control:`boolean`,description:`Shows the title block at the top of the open drop box`,table:{defaultValue:{summary:`true`}}}}},u=e=>(0,s.jsx)(`div`,{style:{height:`240px`},children:e.children}),d=e=>(0,s.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr auto`,alignItems:`center`},children:e.children}),f=()=>{},p={showText:!0,isRootFolder:!1,title:`My Documents`,canCreate:!0,navigationItems:[{id:`1`,title:`Documents`,isRootRoom:!1},{id:`2`,title:`Shared with me`,isRootRoom:!1},{id:`3`,title:`Project files`,isRootRoom:!0}],onClickFolder:c(),onBackToParentFolder:c(),getContextOptionsFolder:()=>[{key:`rename`,label:`Rename`},{key:`delete`,label:`Delete`}],getContextOptionsPlus:()=>[{key:`upload`,label:`Upload file`},{key:`create`,label:`Create folder`}],isTrashFolder:!1,isEmptyFilesList:!1,clearTrash:f,showFolderInfo:f,isCurrentFolderInfo:!1,toggleInfoPanel:c(),isInfoPanelVisible:!1,titles:{infoPanel:`Info Panel`,actions:`Actions`,contextMenu:`Context Menu`,warningText:`Warning`},withMenu:!0,onPlusClick:c(),isEmptyPage:!1,isDesktop:!0,isRoom:!1,isFrame:!1,hideInfoPanel:f,withLogo:!1,burgerLogo:``,showRootFolderTitle:!0,isPublicRoom:!1,titleIcon:``,currentDeviceType:i.desktop,rootRoomTitle:``,showTitle:!0,showTitleInDropBox:!1,navigationButtonLabel:``,onNavigationButtonClick:c(),showNavigationButton:!1,onContextOptionsClick:c(),onLogoClick:c()},m={render:e=>(0,s.jsx)(u,{children:(0,s.jsx)(o,{...e})}),args:p,parameters:{docs:{description:{story:`The header of a nested folder: the back arrow, the parent folder's name, the current folder's name and a notice chip. Click the folder's name to open the drop box with the whole trail; change any other prop live in the Controls panel below.`},source:{code:`<Navigation
  title="My Documents"
  showText
  canCreate
  isDesktop
  navigationItems={[
    { id: "1", title: "Documents", isRootRoom: false },
    { id: "2", title: "Shared with me", isRootRoom: false },
  ]}
  onClickFolder={handleClick}
  onBackToParentFolder={handleBack}
  getContextOptionsFolder={() => [...]}
  getContextOptionsPlus={() => [...]}
/>`}}}},h={render:e=>(0,s.jsx)(u,{children:(0,s.jsx)(o,{...e})}),args:{...p,isRootFolder:!0,title:`Documents`},parameters:{docs:{description:{story:"The header of a root folder: with no parent to go back to, the back arrow, the parent folder's name and the drop-down arrow are gone, and clicking the name opens nothing (`isRootFolder`)."},source:{code:`<Navigation title="Documents" isRootFolder showText canCreate />`}}}},g={render:e=>(0,s.jsx)(u,{children:(0,s.jsx)(o,{...e})}),args:{...p,isTrashFolder:!0,title:`Trash`,canCreate:!1,isContextButtonVisible:!0,titles:{...p.titles,warningText:`Items here can be deleted permanently`}},parameters:{docs:{description:{story:"A folder that holds deleted items, where the person needs the rule spelled out and has nothing to create: the chip shows the notice (`titles.warningText`), there is no plus button, and the folder button's menu opens shifted to the side (`isTrashFolder`)."},source:{code:`<Navigation
  title="Trash"
  isTrashFolder
  canCreate={false}
  isContextButtonVisible
  titles={{ warningText: "Items here can be deleted permanently" }}
/>`}}}},_={render:e=>(0,s.jsx)(u,{children:(0,s.jsx)(d,{children:(0,s.jsx)(o,{...e})})}),args:{...p,isInfoPanelVisible:!0,hideInfoPanel:void 0},parameters:{docs:{description:{story:"The info panel toggle at the end of the header, in its pressed look, so the person can tell the panel is open and click to close it (`isInfoPanelVisible`, `toggleInfoPanel`). The toggle appears only without `hideInfoPanel`."},source:{code:`<Navigation title="My Documents" isInfoPanelVisible isDesktop toggleInfoPanel={handleToggle} />`}}}},v={render:e=>(0,s.jsx)(u,{children:(0,s.jsx)(o,{...e})}),args:{...p,showNavigationButton:!0,navigationButtonLabel:`Open location`},parameters:{docs:{description:{story:"A labelled button after the other controls, for the one action a folder needs at hand, such as opening its location (`navigationButtonLabel`, `onNavigationButtonClick`). It is not shown in the root folder."},source:{code:`<Navigation
  title="My Documents"
  showNavigationButton
  navigationButtonLabel="Open location"
  onNavigationButtonClick={handleClick}
/>`}}}},y={render:e=>(0,s.jsx)(u,{children:(0,s.jsx)(o,{...e})}),args:{...p,isPlusButtonVisible:!0,isContextButtonVisible:!0},parameters:{docs:{description:{story:"The plus button and the folder button, each opening its own menu, so the person can create something here or act on the folder: click either one. `canCreate` alone shows no plus button and the menu getter alone shows no folder button; each needs its flag (`isPlusButtonVisible`, `isContextButtonVisible`)."},source:{code:`<Navigation
  title="My Documents"
  canCreate
  isPlusButtonVisible
  isContextButtonVisible
  getContextOptionsPlus={() => [
    { key: "upload", label: "Upload file" },
    { key: "create", label: "Create folder" },
  ]}
  getContextOptionsFolder={() => [
    { key: "rename", label: "Rename" },
    { key: "delete", label: "Delete" },
  ]}
/>`}}}},b={render:e=>(0,s.jsx)(u,{children:(0,s.jsx)(d,{children:(0,s.jsx)(o,{...e})})}),args:{...p,toggleChatPanel:c(),isChatPanelVisible:!1,titles:{...p.titles,aiChat:`AI chat`}},parameters:{docs:{description:{story:"An **AI chat** button at the end of the header, for a host that has a chat panel to open (`toggleChatPanel`). Its text comes from `titles.aiChat` and gives way to the bare icon when the header runs out of room; turn on `isChatPanelVisible` in the Controls panel below to see its pressed look."},source:{code:`<Navigation
  title="My Documents"
  titles={{ aiChat: "AI chat" }}
  toggleChatPanel={handleToggleChat}
  isChatPanelVisible={isChatOpen}
/>`}}}},x={render:e=>(0,s.jsx)(`div`,{dir:`rtl`,children:(0,s.jsx)(o,{...e})}),globals:{direction:`rtl`},args:{...p,title:`مستنداتي`,navigationItems:[{id:`1`,title:`المستندات`,isRootRoom:!1},{id:`2`,title:`الملفات`,isRootRoom:!1},{id:`3`,title:`مستنداتي`,isRootRoom:!0}],titles:{...p.titles,warningText:void 0}},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`58px`},description:{story:`The header in a right-to-left interface: the back arrow sits at the right edge and points right, the parent folder's name comes to the right of the current one and the drop-down arrow follows the name on its left.`},source:{code:`<div dir="rtl">
  <Navigation
    title="مستنداتي"
    navigationItems={trail}
  />
</div>`}}}},S={render:()=>(0,s.jsxs)(`div`,{style:{height:`240px`,display:`flex`,flexDirection:`column`,gap:`32px`,"--navigation-heading-size":`20px`,"--navigation-heading-weight":`700`,"--navigation-title-color":`#0082c9`,"--navigation-expander-fill":`#0082c9`,"--navigation-arrow-fill":`#0082c9`,"--navigation-separator":`#0082c9`,"--navigation-badge-fill":`#0082c9`,"--navigation-dropdown-bg":`#e6f3fb`,"--navigation-dropdown-shadow":`0 4px 16px rgba(0,130,201,0.25)`,"--navigation-dropdown-radius":`8px`,"--navigation-info-panel-bg":`#cce5f6`,"--navigation-chat-radius":`16px`,"--navigation-warning-bg":`#e6f3fb`,"--navigation-warning-text":`#0082c9`,"--navigation-warning-radius":`8px`},children:[(0,s.jsx)(d,{children:(0,s.jsx)(o,{...p})}),(0,s.jsx)(d,{children:(0,s.jsx)(o,{...p,showRootFolderTitle:!1,badgeLabel:`New`,isInfoPanelVisible:!0,hideInfoPanel:void 0,toggleChatPanel:c(),titles:{...p.titles,aiChat:`AI chat`}})})]}),parameters:{docs:{description:{story:"Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.\n\n- **First header** — the heading, the second title, both arrows, the separator and the notice chip; click the folder's name to see the drop box variables.\n- **Second header** — the variables its props switch on: the badge next to the folder's name (`badgeLabel`), the pressed info panel toggle (`isInfoPanelVisible`) and the AI chat button (`toggleChatPanel`)."},source:{code:`<div
  style={{
    "--navigation-heading-size": "20px",
    "--navigation-title-color": "#0082c9",
    "--navigation-expander-fill": "#0082c9",
    "--navigation-dropdown-bg": "#e6f3fb",
    "--navigation-info-panel-bg": "#cce5f6",
    "--navigation-warning-bg": "#e6f3fb",
    "--navigation-warning-text": "#0082c9",
  }}
>
  <Navigation {...headerProps} />
</div>`}}}},C=[`Default`,`RootFolder`,`TrashFolder`,`WithInfoPanel`,`WithNavigationButton`,`WithActionButtons`,`WithAiChatButton`,`RightToLeft`,`CssCustomization`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <Wrapper>
      <Navigation {...args} />
    </Wrapper>,
  args: defaultArgs,
  parameters: {
    docs: {
      description: {
        story: "The header of a nested folder: the back arrow, the parent folder's name, the current folder's name and a notice chip. Click the folder's name to open the drop box with the whole trail; change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Navigation
  title="My Documents"
  showText
  canCreate
  isDesktop
  navigationItems={[
    { id: "1", title: "Documents", isRootRoom: false },
    { id: "2", title: "Shared with me", isRootRoom: false },
  ]}
  onClickFolder={handleClick}
  onBackToParentFolder={handleBack}
  getContextOptionsFolder={() => [...]}
  getContextOptionsPlus={() => [...]}
/>\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <Wrapper>
      <Navigation {...args} />
    </Wrapper>,
  args: {
    ...defaultArgs,
    isRootFolder: true,
    title: "Documents"
  },
  parameters: {
    docs: {
      description: {
        story: "The header of a root folder: with no parent to go back to, the back arrow, the parent folder's name and the drop-down arrow are gone, and clicking the name opens nothing (\`isRootFolder\`)."
      },
      source: {
        code: \`<Navigation title="Documents" isRootFolder showText canCreate />\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <Wrapper>
      <Navigation {...args} />
    </Wrapper>,
  args: {
    ...defaultArgs,
    isTrashFolder: true,
    title: "Trash",
    canCreate: false,
    isContextButtonVisible: true,
    titles: {
      ...defaultArgs.titles,
      warningText: "Items here can be deleted permanently"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "A folder that holds deleted items, where the person needs the rule spelled out and has nothing to create: the chip shows the notice (\`titles.warningText\`), there is no plus button, and the folder button's menu opens shifted to the side (\`isTrashFolder\`)."
      },
      source: {
        code: \`<Navigation
  title="Trash"
  isTrashFolder
  canCreate={false}
  isContextButtonVisible
  titles={{ warningText: "Items here can be deleted permanently" }}
/>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <Wrapper>
      <HeaderRow>
        <Navigation {...args} />
      </HeaderRow>
    </Wrapper>,
  args: {
    ...defaultArgs,
    isInfoPanelVisible: true,
    hideInfoPanel: undefined
  },
  parameters: {
    docs: {
      description: {
        story: "The info panel toggle at the end of the header, in its pressed look, so the person can tell the panel is open and click to close it (\`isInfoPanelVisible\`, \`toggleInfoPanel\`). The toggle appears only without \`hideInfoPanel\`."
      },
      source: {
        code: \`<Navigation title="My Documents" isInfoPanelVisible isDesktop toggleInfoPanel={handleToggle} />\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <Wrapper>
      <Navigation {...args} />
    </Wrapper>,
  args: {
    ...defaultArgs,
    showNavigationButton: true,
    navigationButtonLabel: "Open location"
  },
  parameters: {
    docs: {
      description: {
        story: "A labelled button after the other controls, for the one action a folder needs at hand, such as opening its location (\`navigationButtonLabel\`, \`onNavigationButtonClick\`). It is not shown in the root folder."
      },
      source: {
        code: \`<Navigation
  title="My Documents"
  showNavigationButton
  navigationButtonLabel="Open location"
  onNavigationButtonClick={handleClick}
/>\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <Wrapper>
      <Navigation {...args} />
    </Wrapper>,
  args: {
    ...defaultArgs,
    isPlusButtonVisible: true,
    isContextButtonVisible: true
  },
  parameters: {
    docs: {
      description: {
        story: "The plus button and the folder button, each opening its own menu, so the person can create something here or act on the folder: click either one. \`canCreate\` alone shows no plus button and the menu getter alone shows no folder button; each needs its flag (\`isPlusButtonVisible\`, \`isContextButtonVisible\`)."
      },
      source: {
        code: \`<Navigation
  title="My Documents"
  canCreate
  isPlusButtonVisible
  isContextButtonVisible
  getContextOptionsPlus={() => [
    { key: "upload", label: "Upload file" },
    { key: "create", label: "Create folder" },
  ]}
  getContextOptionsFolder={() => [
    { key: "rename", label: "Rename" },
    { key: "delete", label: "Delete" },
  ]}
/>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <Wrapper>
      <HeaderRow>
        <Navigation {...args} />
      </HeaderRow>
    </Wrapper>,
  args: {
    ...defaultArgs,
    toggleChatPanel: fn(),
    isChatPanelVisible: false,
    titles: {
      ...defaultArgs.titles,
      aiChat: "AI chat"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "An **AI chat** button at the end of the header, for a host that has a chat panel to open (\`toggleChatPanel\`). Its text comes from \`titles.aiChat\` and gives way to the bare icon when the header runs out of room; turn on \`isChatPanelVisible\` in the Controls panel below to see its pressed look."
      },
      source: {
        code: \`<Navigation
  title="My Documents"
  titles={{ aiChat: "AI chat" }}
  toggleChatPanel={handleToggleChat}
  isChatPanelVisible={isChatOpen}
/>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <Navigation {...args} />
    </div>,
  globals: {
    direction: "rtl"
  },
  args: {
    ...defaultArgs,
    title: "مستنداتي",
    navigationItems: [{
      id: "1",
      title: "المستندات",
      isRootRoom: false
    }, {
      id: "2",
      title: "الملفات",
      isRootRoom: false
    }, {
      id: "3",
      title: "مستنداتي",
      isRootRoom: true
    }],
    titles: {
      ...defaultArgs.titles,
      warningText: undefined
    }
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, because an inline RTL story flips the whole Docs page.
      story: {
        inline: false,
        height: "58px"
      },
      description: {
        story: "The header in a right-to-left interface: the back arrow sits at the right edge and points right, the parent folder's name comes to the right of the current one and the drop-down arrow follows the name on its left."
      },
      source: {
        code: \`<div dir="rtl">
  <Navigation
    title="مستنداتي"
    navigationItems={trail}
  />
</div>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    height: "240px",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    "--navigation-heading-size": "20px",
    "--navigation-heading-weight": "700",
    "--navigation-title-color": "#0082c9",
    "--navigation-expander-fill": "#0082c9",
    "--navigation-arrow-fill": "#0082c9",
    "--navigation-separator": "#0082c9",
    "--navigation-badge-fill": "#0082c9",
    "--navigation-dropdown-bg": "#e6f3fb",
    "--navigation-dropdown-shadow": "0 4px 16px rgba(0,130,201,0.25)",
    "--navigation-dropdown-radius": "8px",
    "--navigation-info-panel-bg": "#cce5f6",
    "--navigation-chat-radius": "16px",
    "--navigation-warning-bg": "#e6f3fb",
    "--navigation-warning-text": "#0082c9",
    "--navigation-warning-radius": "8px"
  } as React.CSSProperties}>
      <HeaderRow>
        <Navigation {...defaultArgs} />
      </HeaderRow>
      <HeaderRow>
        <Navigation {...defaultArgs} showRootFolderTitle={false} badgeLabel="New" isInfoPanelVisible hideInfoPanel={undefined} toggleChatPanel={fn()} titles={{
        ...defaultArgs.titles,
        aiChat: "AI chat"
      }} />
      </HeaderRow>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

- **First header** — the heading, the second title, both arrows, the separator and the notice chip; click the folder's name to see the drop box variables.
- **Second header** — the variables its props switch on: the badge next to the folder's name (\\\`badgeLabel\\\`), the pressed info panel toggle (\\\`isInfoPanelVisible\\\`) and the AI chat button (\\\`toggleChatPanel\\\`).\`
      },
      source: {
        code: \`<div
  style={{
    "--navigation-heading-size": "20px",
    "--navigation-title-color": "#0082c9",
    "--navigation-expander-fill": "#0082c9",
    "--navigation-dropdown-bg": "#e6f3fb",
    "--navigation-info-panel-bg": "#cce5f6",
    "--navigation-warning-bg": "#e6f3fb",
    "--navigation-warning-text": "#0082c9",
  }}
>
  <Navigation {...headerProps} />
</div>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}}})))()}w();export{S as CssCustomization,m as Default,x as RightToLeft,h as RootFolder,g as TrashFolder,y as WithActionButtons,b as WithAiChatButton,_ as WithInfoPanel,v as WithNavigationButton,C as __namedExportsOrder,l as default};