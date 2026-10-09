import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,r,t as i}from"./button-DjDXE7uo.js";import{S as a,i as o,n as s,r as c}from"./enums-DzcBu485.js";import{i as l,n as u,r as d,t as f}from"./article-DtFmMN7W.js";var p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L;function R(){return(R=e((()=>{d(),a(),n(),u(),p=t(),{useArgs:m}=__STORYBOOK_MODULE_PREVIEW_API__,{fn:h}=__STORYBOOK_MODULE_TEST__,g={title:`UI/Layout/Article`,component:f,parameters:{},decorators:[l],argTypes:{showText:{control:`boolean`,description:"Shows text labels alongside icons; off, the panel narrows to a 60px column of icons on tablet. The component also writes its own choice back through `setShowText` on mount and on every device change",table:{type:{summary:`boolean`}}},setShowText:{control:!1,description:"Called on mount and on every device change with the width the component has decided on: `true` on desktop and on a phone; on tablet `false`, and only when the `showArticle` entry in local storage holds `false`"},toggleShowText:{control:!1,description:"Called by the collapse handle at the foot of the panel on tablet; the host is expected to flip `showText`"},articleOpen:{control:`boolean`,description:`Whether the panel is shown on a phone, where it covers the page over a backdrop. On desktop and tablet the panel is always shown`,table:{type:{summary:`boolean`}}},toggleArticleOpen:{control:!1,description:"Called on a phone by the close button of the header, the backdrop, the back button and the developer tools entry; the host is expected to flip `articleOpen`"},setArticleOpen:{control:!1,description:"Called with `false` when the browser goes back on a phone, to close the panel"},isMobileArticle:{control:`boolean`,description:"Removes the padding around the main action. The component writes its own value back through `setIsMobileArticle` on mount and on every device change",table:{type:{summary:`boolean`}}},setIsMobileArticle:{control:!1,description:"Called on mount and on every device change: `true` on tablet and phone, `false` on desktop"},currentDeviceType:{control:`select`,options:Object.values(s),description:"Which layout to render: a fixed column on `desktop`, a collapsible sidebar on `tablet`, a full-width overlay on `mobile`. The breakpoints of the stylesheet still follow the window width",table:{type:{summary:`DeviceType`}}},children:{control:!1,description:"The slots, as an array of `Article.Header`, `Article.MainButton` and `Article.Body`; any other element is dropped"},withCustomArticleHeader:{control:`boolean`,description:"Shows the contents of `Article.Header` in the header row instead of the logo",table:{type:{summary:`boolean`}}},withMainButton:{control:`boolean`,description:"Shows the contents of `Article.MainButton` above the body on desktop and tablet; on a phone the slot is shown below the panel without it",table:{defaultValue:{summary:`false`}}},onLogoClickAction:{control:!1,description:`Called when the logo or the back button is clicked, before the panel navigates home`},showBackButton:{control:`boolean`,description:`Shows a back button at the top of the body on desktop and tablet, and in the header on a phone`,table:{type:{summary:`boolean`}}},onBack:{control:!1,description:`Called by the back button instead of navigating home`},navigate:{control:!1,description:`Router push used by the logo, the back button and the developer tools entry; without it they reload the page at the new address`},isBurgerLoading:{control:`boolean`,description:`Shows skeletons in place of the logo and the back button`,table:{type:{summary:`boolean`}}},showArticleLoader:{control:`boolean`,description:`Replaces the profile block with a skeleton and removes the custom slot, the developer tools entry, the apps block, the live chat and the collapse handle; the header and the slots stay`,table:{defaultValue:{summary:`false`}}},user:{control:!1,description:"The signed-in person, whose avatar and name the profile block shows; a guest (`isVisitor`) never sees the developer tools entry"},getActions:{control:!1,description:`Returns the items of the menu opened by the profile block's dots button, and by its avatar on a collapsed tablet panel`},onProfileClick:{control:!1,description:`Called when the person's name or avatar in the profile block is clicked, with the original event wrapped in an object`},hideProfileBlock:{control:`boolean`,description:`Removes the profile block at the foot of the panel, and moves the collapse handle down in its place`,table:{type:{summary:`boolean`}}},hideAppsBlock:{control:`boolean`,description:`Removes the block of application download links`,table:{type:{summary:`boolean`}}},logoText:{control:`text`,description:`Organization name used in the tooltips of the application download links`,table:{type:{summary:`string`}}},downloaddesktopUrl:{control:`text`,description:`Address behind the Windows, macOS and Linux download links`,table:{type:{summary:`string`}}},officeforandroidUrl:{control:`text`,description:`Address behind the Android download link`,table:{type:{summary:`string`}}},officeforiosUrl:{control:`text`,description:`Address behind the iOS download link`,table:{type:{summary:`string`}}},isAdmin:{control:`boolean`,description:"Whether the person is an administrator; together with `limitedAccessDevToolsForUsers` it decides whether the developer tools entry is shown",table:{type:{summary:`boolean`}}},limitedAccessDevToolsForUsers:{control:`boolean`,description:`Hides the developer tools entry from anyone who is not an administrator`,table:{type:{summary:`boolean`}}},customSlot:{control:!1,description:`Extra content between the body and the developer tools entry`},mainBarVisible:{control:`boolean`,description:"Whether a top bar with the id `main-bar` is on screen. The component measures it on every resize and then does not use the result, so nothing on screen changes",table:{type:{summary:`boolean`}}},isLiveChatAvailable:{control:!1,description:`Allows the live chat bubble, which loads a third-party Zendesk script; it is never shown in a mobile browser`,table:{type:{summary:`boolean`}}},isShowLiveChat:{control:!1,description:`Whether the live chat bubble is expanded`,table:{type:{summary:`boolean`}}},zendeskKey:{control:!1,description:`Key of the Zendesk account the live chat connects to`,table:{type:{summary:`string`}}},languageBaseName:{control:!1,description:`Locale handed to the live chat`,table:{type:{summary:`string`}}}}},_={showText:!0,setShowText:h(),articleOpen:!0,toggleShowText:h(),toggleArticleOpen:h(),setIsMobileArticle:h(),setArticleOpen:h(),withSendAgain:!1,mainBarVisible:!0,hideProfileBlock:!1,logoText:``,isShowLiveChat:!1,hideAppsBlock:!1,withCustomSlot:!1,isLiveChatAvailable:!1,isAdmin:!1,currentDeviceType:s.desktop,onLogoClickAction:h(),onProfileClick:h(),withCustomArticleHeader:!1,isBurgerLoading:!1,languageBaseName:`en`,isMobileArticle:!1,zendeskKey:`your-zendesk-key`,showBackButton:!1,navigate:h(),onBack:h(),downloaddesktopUrl:`https://example.com/desktop`,officeforandroidUrl:`https://example.com/android`,officeforiosUrl:`https://example.com/ios`,limitedAccessDevToolsForUsers:!1,children:[(0,p.jsx)(f.Body,{children:(0,p.jsx)(`div`,{children:`Navigation items`})},`body`)]},v={id:`user-1`,displayName:`Team member`,title:`Team member`,avatarSmall:``,access:0,firstName:``,lastName:``,userName:``,email:``,status:o.Active,activationStatus:c.NotActivated,department:``,workFrom:``,avatarMax:``,avatarMedium:``,avatarOriginal:``,avatar:``,isAdmin:!1,isRoomAdmin:!1,isLDAP:!1,listAdminModules:[],isOwner:!1,isVisitor:!1,isCollaborator:!1,mobilePhoneActivationStatus:0,isSSO:!1,profileUrl:``,hasAvatar:!1,isAnonim:!1},y=()=>[{key:`profile`,label:`Profile`,onClick:h()},{key:`help`,label:`Help`,onClick:h()},{key:`logout`,label:`Logout`,onClick:h()}],b=(0,p.jsx)(f.Body,{children:(0,p.jsx)(`div`,{children:`Navigation items`})},`body`),x=(0,p.jsx)(f.MainButton,{children:(0,p.jsx)(i,{primary:!0,scale:!0,size:r.normal,label:`New document`})},`main-button`),S=e=>(0,p.jsx)(`div`,{style:{height:`600px`,position:`relative`},children:(0,p.jsx)(f,{...e})}),C=e=>{let[,t]=m();return(0,p.jsx)(S,{...e,toggleShowText:()=>t({showText:!e.showText}),toggleArticleOpen:()=>t({articleOpen:!e.articleOpen})})},w=(e,t)=>(n,r)=>r.viewMode===`docs`?(0,p.jsx)(`iframe`,{title:r.name,src:`iframe.html?viewMode=story&id=${r.id}`,style:{width:e,height:t,border:0}}):(0,p.jsx)(n,{}),T={render:e=>(0,p.jsx)(S,{...e}),args:{..._,user:v,getActions:y,children:[b]},parameters:{docs:{description:{story:"The panel as a desktop page shows it: the logo, the body, the developer tools entry, the download links and the profile block. Click the dots beside the name to open the actions menu (`getActions`), and change any other prop live in the Controls panel below."},source:{code:`<Article
  {...panelProps}
  showText
  currentDeviceType={DeviceType.desktop}
  user={user}
  getActions={getActions}
>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`}}}},E={render:e=>(0,p.jsx)(S,{...e}),args:{..._,user:v,getActions:y,withMainButton:!0,children:[x,b]},parameters:{docs:{description:{story:"**New document** — the page's primary command, kept above the navigation where it is always in reach (`withMainButton`, `Article.MainButton`)."},source:{code:`<Article {...panelProps} withMainButton>
  <Article.MainButton>
    <Button primary scale size={ButtonSize.normal} label="New document" />
  </Article.MainButton>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`}}}},D={render:e=>(0,p.jsx)(S,{...e}),args:{..._,user:v,getActions:y,withCustomArticleHeader:!0,children:[(0,p.jsx)(f.Header,{children:(0,p.jsx)(`h3`,{style:{margin:0},children:`Documents`})},`header`),b]},parameters:{docs:{description:{story:"**Documents** — the application's own title in the header row in place of the logo, for a layout that names the panel itself (`withCustomArticleHeader`, `Article.Header`)."},source:{code:`<Article {...panelProps} withCustomArticleHeader>
  <Article.Header>
    <h3>Documents</h3>
  </Article.Header>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`}}}},O={render:e=>(0,p.jsx)(S,{...e}),args:{..._,user:v,getActions:y,showBackButton:!0,children:[b]},parameters:{docs:{description:{story:"**Back** — a way out of a nested section at the top of the body. It calls `onBack`, or navigates home when there is none (`showBackButton`)."},source:{code:`<Article {...panelProps} showBackButton onBack={goBack}>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`}}}},k={render:e=>(0,p.jsx)(S,{...e}),args:{..._,user:v,getActions:y,isBurgerLoading:!0,showArticleLoader:!0,children:[b]},parameters:{docs:{description:{story:"Skeletons in place of the logo and the profile block while the page's data is still arriving, so the panel keeps its shape; the body slot is still rendered (`isBurgerLoading`, `showArticleLoader`)."},source:{code:`<Article {...panelProps} isBurgerLoading showArticleLoader>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`}}}},A={render:e=>(0,p.jsx)(S,{...e}),args:{..._,user:v,getActions:y,customSlot:(0,p.jsx)(`div`,{children:`Storage: 2 GB of 10 GB`}),children:[b]},parameters:{docs:{description:{story:"**Storage: 2 GB of 10 GB** — a notice that belongs to the panel rather than to the navigation, placed between the body and the developer tools entry (`customSlot`)."},source:{code:`<Article {...panelProps} customSlot={<div>Storage: 2 GB of 10 GB</div>}>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`}}}},j={render:e=>(0,p.jsx)(S,{...e}),args:{..._,hideProfileBlock:!0,hideAppsBlock:!0,limitedAccessDevToolsForUsers:!0,children:[b]},parameters:{docs:{description:{story:"The body with nothing below it, for a page that shows the person and the download links elsewhere: no profile block (`hideProfileBlock`), no download links (`hideAppsBlock`) and no developer tools entry for a person who is not an administrator (`limitedAccessDevToolsForUsers`)."},source:{code:`<Article
  {...panelProps}
  hideProfileBlock
  hideAppsBlock
  limitedAccessDevToolsForUsers
  isAdmin={false}
>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`}}}},M={render:e=>C({...e,children:[(0,p.jsx)(f.Body,{children:(0,p.jsx)(`div`,{children:e.showText?`Navigation items`:null})},`body`)]}),decorators:[w(834,640)],globals:{viewport:{value:`tablet`,isRotated:!1}},args:{..._,user:v,getActions:y,showText:!1,currentDeviceType:s.tablet,isMobileArticle:!0,children:[b]},parameters:{docs:{description:{story:"A 60px column of icons in a tablet-width window, which leaves the page most of the screen (`showText` off). Click the handle at the foot to expand it and again to collapse it (`toggleShowText`)."},source:{code:`const [showText, setShowText] = useState(false);

<Article
  {...panelProps}
  currentDeviceType={DeviceType.tablet}
  showText={showText}
  toggleShowText={() => setShowText((value) => !value)}
>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`}}}},N={render:C,decorators:[w(414,640)],globals:{viewport:{value:`mobile2`,isRotated:!1}},args:{..._,user:v,getActions:y,currentDeviceType:s.mobile,isMobileArticle:!0,children:[b]},parameters:{docs:{description:{story:"The panel on a phone: it covers the page below a 64px top strip, over a backdrop, and drops the profile block. Close it with the cross in its header or a tap on the backdrop (`toggleArticleOpen`); switch `articleOpen` in the Controls panel of the story canvas to open it again."},source:{code:`const [articleOpen, setArticleOpen] = useState(true);

<Article
  {...panelProps}
  currentDeviceType={DeviceType.mobile}
  articleOpen={articleOpen}
  toggleArticleOpen={() => setArticleOpen((value) => !value)}
  setArticleOpen={setArticleOpen}
>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>`}}}},P={render:e=>(0,p.jsx)(`div`,{dir:`rtl`,children:(0,p.jsx)(S,{...e})}),globals:{direction:`rtl`},args:{..._,user:v,getActions:y,showBackButton:!0,children:[(0,p.jsx)(f.Body,{children:(0,p.jsx)(`div`,{children:`عناصر التنقل`})},`body`)]},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`626px`},description:{story:`The panel in a right-to-left interface: its border moves to the left edge, the back arrow points right and the dots button sits on the left of the profile block.`},source:{code:`<div dir="rtl">
  <Article {...panelProps} showBackButton>
    <Article.Body>
      <nav>عناصر التنقل</nav>
    </Article.Body>
  </Article>
</div>`}}}},F=()=>(0,p.jsxs)(`div`,{style:{display:`flex`,gap:`32px`,"--article-bg":`#e6f3fb`,"--article-border":`1px solid #0082c9`,"--article-profile-bg":`#cce5f6`,"--article-profile-border":`1px solid #0082c9`,"--article-back-color":`#0082c9`},children:[(0,p.jsx)(`div`,{style:{height:`600px`,position:`relative`},children:(0,p.jsx)(f,{..._,user:v,getActions:y})}),(0,p.jsx)(`div`,{style:{height:`600px`,position:`relative`},children:(0,p.jsx)(f,{..._,user:v,getActions:y,showBackButton:!0})})]}),I={render:()=>(0,p.jsx)(F,{}),parameters:{docs:{description:{story:"Five of the panel's variables set on one wrapper -- the variables are listed under CSS variables on this page. The first panel shows the background, the borders and the profile block; the second adds the back button (`showBackButton`) for `--article-back-color`."},source:{code:`<div style={{ "--article-bg": "#e6f3fb", "--article-border": "1px solid #0082c9", "--article-back-color": "#0082c9" }}>
  <Article {...panelProps} showBackButton>
    <Article.Body>
      <nav>Navigation items</nav>
    </Article.Body>
  </Article>
</div>`}}}},L=[`Default`,`WithMainButton`,`CustomHeader`,`WithBackButton`,`LoadingState`,`WithCustomSlot`,`WithoutFooterBlocks`,`CollapsedOnTablet`,`OnPhone`,`RightToLeft`,`CssCustomization`],T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    children: [bodySlot]
  },
  parameters: {
    docs: {
      description: {
        story: "The panel as a desktop page shows it: the logo, the body, the developer tools entry, the download links and the profile block. Click the dots beside the name to open the actions menu (\`getActions\`), and change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<Article
  {...panelProps}
  showText
  currentDeviceType={DeviceType.desktop}
  user={user}
  getActions={getActions}
>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    withMainButton: true,
    children: [mainButtonSlot, bodySlot]
  },
  parameters: {
    docs: {
      description: {
        story: "**New document** — the page's primary command, kept above the navigation where it is always in reach (\`withMainButton\`, \`Article.MainButton\`)."
      },
      source: {
        code: \`<Article {...panelProps} withMainButton>
  <Article.MainButton>
    <Button primary scale size={ButtonSize.normal} label="New document" />
  </Article.MainButton>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    withCustomArticleHeader: true,
    children: [<Article.Header key="header">
        <h3 style={{
        margin: 0
      }}>Documents</h3>
      </Article.Header>, bodySlot]
  },
  parameters: {
    docs: {
      description: {
        story: "**Documents** — the application's own title in the header row in place of the logo, for a layout that names the panel itself (\`withCustomArticleHeader\`, \`Article.Header\`)."
      },
      source: {
        code: \`<Article {...panelProps} withCustomArticleHeader>
  <Article.Header>
    <h3>Documents</h3>
  </Article.Header>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    showBackButton: true,
    children: [bodySlot]
  },
  parameters: {
    docs: {
      description: {
        story: "**Back** — a way out of a nested section at the top of the body. It calls \`onBack\`, or navigates home when there is none (\`showBackButton\`)."
      },
      source: {
        code: \`<Article {...panelProps} showBackButton onBack={goBack}>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    isBurgerLoading: true,
    showArticleLoader: true,
    children: [bodySlot]
  },
  parameters: {
    docs: {
      description: {
        story: "Skeletons in place of the logo and the profile block while the page's data is still arriving, so the panel keeps its shape; the body slot is still rendered (\`isBurgerLoading\`, \`showArticleLoader\`)."
      },
      source: {
        code: \`<Article {...panelProps} isBurgerLoading showArticleLoader>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>\`
      }
    }
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    customSlot: <div>Storage: 2 GB of 10 GB</div>,
    children: [bodySlot]
  },
  parameters: {
    docs: {
      description: {
        story: "**Storage: 2 GB of 10 GB** — a notice that belongs to the panel rather than to the navigation, placed between the body and the developer tools entry (\`customSlot\`)."
      },
      source: {
        code: \`<Article {...panelProps} customSlot={<div>Storage: 2 GB of 10 GB</div>}>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: args => <Template {...args} />,
  args: {
    ...defaultProps,
    hideProfileBlock: true,
    hideAppsBlock: true,
    limitedAccessDevToolsForUsers: true,
    children: [bodySlot]
  },
  parameters: {
    docs: {
      description: {
        story: "The body with nothing below it, for a page that shows the person and the download links elsewhere: no profile block (\`hideProfileBlock\`), no download links (\`hideAppsBlock\`) and no developer tools entry for a person who is not an administrator (\`limitedAccessDevToolsForUsers\`)."
      },
      source: {
        code: \`<Article
  {...panelProps}
  hideProfileBlock
  hideAppsBlock
  limitedAccessDevToolsForUsers
  isAdmin={false}
>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>\`
      }
    }
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  // Plain text has no icon form, so the body keeps it for the expanded column.
  render: args => renderInteractive({
    ...args,
    children: [<Article.Body key="body">
          <div>{args.showText ? "Navigation items" : null}</div>
        </Article.Body>]
  }),
  decorators: [withFrame(834, 640)],
  globals: {
    viewport: {
      value: "tablet",
      isRotated: false
    }
  },
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    showText: false,
    currentDeviceType: DeviceType.tablet,
    isMobileArticle: true,
    children: [bodySlot]
  },
  parameters: {
    docs: {
      description: {
        story: "A 60px column of icons in a tablet-width window, which leaves the page most of the screen (\`showText\` off). Click the handle at the foot to expand it and again to collapse it (\`toggleShowText\`)."
      },
      source: {
        code: \`const [showText, setShowText] = useState(false);

<Article
  {...panelProps}
  currentDeviceType={DeviceType.tablet}
  showText={showText}
  toggleShowText={() => setShowText((value) => !value)}
>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>\`
      }
    }
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: renderInteractive,
  decorators: [withFrame(414, 640)],
  globals: {
    viewport: {
      value: "mobile2",
      isRotated: false
    }
  },
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    currentDeviceType: DeviceType.mobile,
    isMobileArticle: true,
    children: [bodySlot]
  },
  parameters: {
    docs: {
      description: {
        story: "The panel on a phone: it covers the page below a 64px top strip, over a backdrop, and drops the profile block. Close it with the cross in its header or a tap on the backdrop (\`toggleArticleOpen\`); switch \`articleOpen\` in the Controls panel of the story canvas to open it again."
      },
      source: {
        code: \`const [articleOpen, setArticleOpen] = useState(true);

<Article
  {...panelProps}
  currentDeviceType={DeviceType.mobile}
  articleOpen={articleOpen}
  toggleArticleOpen={() => setArticleOpen((value) => !value)}
  setArticleOpen={setArticleOpen}
>
  <Article.Body>
    <nav>Navigation items</nav>
  </Article.Body>
</Article>\`
      }
    }
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <Template {...args} />
    </div>,
  globals: {
    direction: "rtl"
  },
  args: {
    ...defaultProps,
    user: mockUser,
    getActions,
    showBackButton: true,
    children: [<Article.Body key="body">
        <div>عناصر التنقل</div>
      </Article.Body>]
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, because an inline RTL story flips the whole Docs page.
      story: {
        inline: false,
        height: "626px"
      },
      description: {
        story: "The panel in a right-to-left interface: its border moves to the left edge, the back arrow points right and the dots button sits on the left of the profile block."
      },
      source: {
        code: \`<div dir="rtl">
  <Article {...panelProps} showBackButton>
    <Article.Body>
      <nav>عناصر التنقل</nav>
    </Article.Body>
  </Article>
</div>\`
      }
    }
  }
}`,...P.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Five of the panel's variables set on one wrapper -- the variables are listed under CSS variables on this page. The first panel shows the background, the borders and the profile block; the second adds the back button (\`showBackButton\`) for \`--article-back-color\`."
      },
      source: {
        code: \`<div style={{ "--article-bg": "#e6f3fb", "--article-border": "1px solid #0082c9", "--article-back-color": "#0082c9" }}>
  <Article {...panelProps} showBackButton>
    <Article.Body>
      <nav>Navigation items</nav>
    </Article.Body>
  </Article>
</div>\`
      }
    }
  }
}`,...I.parameters?.docs?.source}}}})))()}R();export{M as CollapsedOnTablet,I as CssCustomization,D as CustomHeader,T as Default,k as LoadingState,N as OnPhone,P as RightToLeft,O as WithBackButton,A as WithCustomSlot,E as WithMainButton,j as WithoutFooterBlocks,L as __namedExportsOrder,g as default};