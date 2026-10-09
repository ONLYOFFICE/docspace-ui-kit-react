import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,r,t as i}from"./Avatar.enums-D3mbkRzL.js";import{n as a,r as o}from"./avatar-B92H6Cjq.js";import{n as s,t as c}from"./catalog.folder.react-VUpu0ofJ.js";var l;function u(){return(u=e((()=>{l=`data:image/svg+xml,%3csvg%20width='17'%20height='17'%20viewBox='0%200%2017%2017'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M9.12622%200.0623095C6.52259%200.0529189%203.84959%201.16251%202.32398%203.25184C0.736323%205.39443%200.336116%208.22297%200.861673%2010.7781C1.23082%2012.4836%202.25589%2014.0953%203.82515%2014.9865C5.61514%2016.0398%207.79774%2016.1975%209.83777%2015.9703C10.8616%2015.8495%2011.8696%2015.5833%2012.806%2015.1664C12.806%2014.5367%2012.806%2013.907%2012.806%2013.2773C10.7015%2014.1265%208.29542%2014.5402%206.05867%2013.9306C4.48717%2013.4996%203.20984%2012.1815%202.86419%2010.6287C2.45157%209.04801%202.55181%207.34822%203.07473%205.80605C3.63474%204.26487%204.849%202.93158%206.44338%202.37082C8.03429%201.76484%209.86191%201.70933%2011.4856%202.23251C12.9327%202.74901%2014.112%203.96461%2014.4731%205.42171C14.8484%206.75538%2014.8052%208.22873%2014.275%209.51254C14.0412%2010.0535%2013.5129%2010.6052%2012.854%2010.4814C12.4894%2010.4243%2012.2048%2010.1235%2012.1692%209.76841C11.9747%208.8739%2012.2135%207.95948%2012.1981%207.05533C12.2482%206.14079%2012.2982%205.22624%2012.3499%204.31179C10.8664%203.87955%209.26388%203.60154%207.73322%203.95049C6.18348%204.36389%204.99476%205.72089%204.7354%207.25821C4.50893%208.40277%204.60731%209.63904%205.15132%2010.68C5.65435%2011.5723%206.62808%2012.2075%207.6839%2012.2469C8.8488%2012.3533%2010.0897%2011.8801%2010.7516%2010.9229C11.1825%2011.88%2012.3358%2012.4244%2013.3839%2012.2305C14.6343%2012.0636%2015.6432%2011.1114%2016.0838%209.99452C16.8123%208.33866%2016.7794%206.43221%2016.2744%204.72095C15.6722%202.8322%2014.1737%201.21605%2012.2394%200.558331C11.2486%200.195612%2010.1849%200.042059%209.12622%200.0623095ZM9.00327%205.55242C9.41499%205.55114%209.82836%205.5837%2010.2278%205.66847C10.1108%206.97335%2010.2543%208.33962%209.73879%209.57566C9.49209%2010.0977%208.95286%2010.5035%208.35165%2010.4958C7.72235%2010.5558%207.0233%2010.196%206.8763%209.56454C6.59511%208.72671%206.67809%207.79938%206.93529%206.96772C7.22353%206.20371%207.95707%205.57045%208.82131%205.56199C8.88181%205.55689%208.94255%205.55366%209.00327%205.55242Z'%20fill='black'/%3e%3c/svg%3e`})))()}var d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P;function F(){return(F=e((()=>{u(),s(),o(),d=t(),{fn:f}=__STORYBOOK_MODULE_TEST__,p=`data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%238fb3d9%22%2F%3E%3Ccircle%20cx%3D%22100%22%20cy%3D%2282%22%20r%3D%2236%22%20fill%3D%22%23f3f6fa%22%2F%3E%3Cpath%20d%3D%22M36%20200a64%2064%200%200%201%20128%200z%22%20fill%3D%22%23f3f6fa%22%2F%3E%3C%2Fsvg%3E`,m=[{key:i.PROFILE_AVATAR_UPLOAD,label:`Upload picture`,icon:c,onClick:e=>e?.current?.click()},{key:i.PROFILE_AVATAR_DELETE,label:`Delete picture`,icon:c,onClick:f()}],h={title:`UI/Data display/Avatar`,component:a,parameters:{design:{type:`figma`,url:`https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=878-37278&mode=design&t=TBNCKMQKQMxr44IZ-0`},layout:`centered`},argTypes:{size:{control:`select`,options:Object.values(r),description:"Diameter of the avatar, from 24px (`extraSmall`) to 124px (`max`); the initials and the role badge are sized to match, and `extraSmall` is meant for a picture only"},role:{control:`select`,options:Object.values(n),description:"Which role badge is drawn at the bottom corner: only `owner` and `admin` draw one, every other value draws none"},source:{control:`text`,description:"The picture: a URL shown as an image, a path to a `.svg` file drawn as an icon, or a React element rendered as given"},userName:{control:`text`,description:"Name the initials are built from when there is no `source`: the first letter of each of the first two words"},editing:{control:`boolean`,description:"Shows the edit button at the bottom corner, in place of the role badge — a pencil when `hasAvatar`, a plus otherwise; drawn only at `size` `max`",table:{defaultValue:{summary:`false`}}},hasAvatar:{control:`boolean`,description:"Whether there already is a picture: it picks the pencil over the plus, and makes a click open the `model` menu instead of the file dialog",table:{defaultValue:{summary:`false`}}},model:{control:!1,description:"Actions of the edit menu, in order; the first one runs directly when there is no picture yet, and the one keyed `AvatarActionKeys.PROFILE_AVATAR_UPLOAD` receives the file input's ref"},roleIcon:{control:!1,description:"Badge to draw instead of the one `role` would choose"},isNotIcon:{control:`boolean`,description:"Shows a `.svg` `source` as a picture instead of drawing it as an icon",table:{defaultValue:{summary:`false`}}},imgClassName:{control:`text`,description:"Class added to the `<img>` of a picture `source`",table:{defaultValue:{summary:`""`}}},className:{control:`text`,description:`Class added to the avatar and, again, to the picture area inside it`},dataTestId:{control:`text`,description:"Value of `data-testid` on the avatar",table:{defaultValue:{summary:`avatar`}}},id:{control:!1,description:"Ignored: nothing reads it and no `id` reaches the page"},style:{control:!1,description:`Ignored: nothing reads it and no inline style reaches the page`},hideRoleIcon:{control:`boolean`,description:`Hide the role indicator badge`,table:{defaultValue:{summary:`false`}}},withTooltip:{control:`boolean`,description:"Shows `tooltipContent` while the role badge is hovered; without a badge (`role` other than `owner` or `admin`) nothing appears",table:{defaultValue:{summary:`false`}}},tooltipContent:{control:`text`,description:`Text of the role badge tooltip`},isGroup:{control:`boolean`,description:`Draws the initials in upper case and bold, on the group background`,table:{defaultValue:{summary:`false`}}},isDefaultSource:{control:`boolean`,description:"Shows the kit's placeholder illustration when there is neither `source` nor `userName`",table:{defaultValue:{summary:`false`}}},noClick:{control:`boolean`,description:"Keeps a click on the avatar from opening the edit menu or the file dialog; `onClick` still fires",table:{defaultValue:{summary:`false`}}},editAction:{control:!1,description:"Ignored: nothing reads it; the edit button runs the first `model` entry"},onClick:{action:`onClick`,description:`Called on a click and on a middle-button press; passing it replaces the edit behaviour, so the menu and the file dialog no longer open from the avatar`},onChangeFile:{action:`onChangeFile`,description:`Called when a file is picked in the hidden file input, which is rendered only when this is given; without it the avatar is not editable`}}},g=e=>(0,d.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`16px`,flexWrap:`wrap`},children:e.children}),_=e=>(0,d.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`8px`},children:[e.children,(0,d.jsx)(`span`,{style:{fontSize:`12px`,color:`#666`},children:e.label})]}),v={render:e=>(0,d.jsx)(a,{...e}),args:{size:r.max,role:n.user,source:``,userName:``,editing:!1,hideRoleIcon:!1,tooltipContent:``,withTooltip:!1},parameters:{docs:{description:{story:`An avatar with nothing to show yet: with no picture and no name it falls back to a camera icon on the neutral background. Change any prop live in the Controls panel below.`},source:{code:`<Avatar size={AvatarSize.max} role={AvatarRole.user} />`}}}},y={render:e=>(0,d.jsx)(a,{...e}),args:{size:r.max,role:n.admin,source:p,userName:`John Smith`,editing:!1,hideRoleIcon:!1,tooltipContent:`John Smith - Administrator`,withTooltip:!0},parameters:{docs:{description:{story:"A picture with the admin badge at its bottom corner; hover the badge to read its tooltip (`withTooltip`, `tooltipContent`)."},source:{code:`<Avatar
  size={AvatarSize.max}
  role={AvatarRole.admin}
  source="https://example.com/photo.jpg"
  userName="John Smith"
  tooltipContent="John Smith - Administrator"
  withTooltip
/>`}}}},b={render:e=>(0,d.jsx)(a,{...e}),args:{size:r.max,role:n.guest,source:``,userName:`John Doe`,editing:!1,hideRoleIcon:!1},parameters:{docs:{description:{story:`Avatar showing initials generated from the user name. Uses first letter of first two words (JD).`},source:{code:`<Avatar
  size={AvatarSize.max}
  role={AvatarRole.guest}
  userName="John Doe"
/>`}}}},x={render:e=>(0,d.jsx)(a,{...e}),args:{size:r.max,role:n.user,source:l,userName:``,editing:!1,hideRoleIcon:!1},parameters:{docs:{description:{story:`Avatar displaying an SVG icon instead of an image or initials.`},source:{code:`<Avatar
  size={AvatarSize.max}
  role={AvatarRole.user}
  source={iconUrl}
/>`}}}},S=()=>{let e=Object.values(r);return(0,d.jsx)(g,{children:e.map(e=>(0,d.jsx)(_,{label:e,children:(0,d.jsx)(a,{size:e,role:n.admin,userName:`John Doe`,hideRoleIcon:e===r.min})},e))})},C={render:()=>(0,d.jsx)(S,{}),parameters:{docs:{description:{story:`All seven sizes side by side: max (124px), big (80px), medium (48px), base (40px), small (36px), min (32px) and extraSmall (24px); the initials and the admin badge shrink with the avatar.`},source:{code:`<Avatar size={AvatarSize.min} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.small} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.base} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.medium} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.big} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.max} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.extraSmall} role={AvatarRole.admin} userName="John Doe" />`}}}},w=()=>{let e=[{role:n.owner,label:`Owner`},{role:n.admin,label:`Admin`},{role:n.user,label:`User`},{role:n.guest,label:`Guest`},{role:n.manager,label:`Manager`},{role:n.collaborator,label:`Collaborator`},{role:n.none,label:`None`}];return(0,d.jsx)(g,{children:e.map(({role:e,label:t})=>(0,d.jsx)(_,{label:t,children:(0,d.jsx)(a,{size:r.big,role:e,userName:t})},t))})},T={render:()=>(0,d.jsx)(w,{}),parameters:{docs:{description:{story:"Every `role` value on the same avatar: only Owner and Admin draw a badge at the bottom corner, User, Guest, Manager, Collaborator and None draw none."},source:{code:`<Avatar size={AvatarSize.big} role={AvatarRole.owner} userName="Owner" />
<Avatar size={AvatarSize.big} role={AvatarRole.admin} userName="Admin" />
<Avatar size={AvatarSize.big} role={AvatarRole.user} userName="User" />
<Avatar size={AvatarSize.big} role={AvatarRole.guest} userName="Guest" />
<Avatar size={AvatarSize.big} role={AvatarRole.manager} userName="Manager" />
<Avatar size={AvatarSize.big} role={AvatarRole.collaborator} userName="Collaborator" />
<Avatar size={AvatarSize.big} role={AvatarRole.none} userName="None" />`}}}},E={render:e=>(0,d.jsx)(a,{...e}),args:{size:r.max,role:n.none,source:``,userName:`Project Team`,isGroup:!0,hideRoleIcon:!0},parameters:{docs:{description:{story:`Group avatar with uppercase initials and specialized background color. Role icons are typically hidden for groups.`},source:{code:`<Avatar
  size={AvatarSize.max}
  role={AvatarRole.none}
  userName="Project Team"
  isGroup
  hideRoleIcon
/>`}}}},D={render:e=>(0,d.jsx)(a,{...e}),args:{size:r.max,role:n.owner,source:``,userName:`Jane Smith`,editing:!0,hideRoleIcon:!0,hasAvatar:!1,model:m,onClick:void 0},parameters:{docs:{description:{story:"A person with no picture yet: the plus button at the corner, or a click anywhere on the avatar, opens the file dialog straight away through the first `model` action, and the chosen file reaches `onChangeFile`. The button is drawn only at `size` `max`."},source:{code:`<Avatar
  size={AvatarSize.max}
  role={AvatarRole.owner}
  userName="Jane Smith"
  editing
  hideRoleIcon
  hasAvatar={false}
  model={[
    {
      key: AvatarActionKeys.PROFILE_AVATAR_UPLOAD,
      label: "Upload picture",
      icon: iconUrl,
      onClick: (ref) => ref?.current?.click(),
    },
  ]}
  onChangeFile={handleFile}
/>`}}}},O={render:e=>(0,d.jsx)(a,{...e}),args:{size:r.max,role:n.owner,source:p,userName:`Jane Smith`,editing:!0,hideRoleIcon:!0,hasAvatar:!0,model:m,onClick:void 0},parameters:{docs:{description:{story:"A person who already has a picture: the pencil at the corner, or a click on the avatar, opens a menu of the `model` actions — **Upload picture** opens the file dialog, **Delete picture** runs its own handler."},source:{code:`<Avatar
  size={AvatarSize.max}
  role={AvatarRole.owner}
  source="https://example.com/photo.jpg"
  userName="Jane Smith"
  editing
  hideRoleIcon
  hasAvatar
  model={[
    {
      key: AvatarActionKeys.PROFILE_AVATAR_UPLOAD,
      label: "Upload picture",
      icon: iconUrl,
      onClick: (ref) => ref?.current?.click(),
    },
    {
      key: AvatarActionKeys.PROFILE_AVATAR_DELETE,
      label: "Delete picture",
      icon: iconUrl,
      onClick: handleDelete,
    },
  ]}
  onChangeFile={handleFile}
/>`}}}},k={render:e=>(0,d.jsx)(a,{...e}),args:{size:r.max,role:n.admin,source:``,userName:`Custom Role`,roleIcon:(0,d.jsx)(`div`,{style:{width:`100%`,height:`100%`,background:`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,borderRadius:`50%`,display:`flex`,alignItems:`center`,justifyContent:`center`,color:`white`,fontSize:`10px`,fontWeight:`bold`},children:`VIP`}),hideRoleIcon:!1},parameters:{docs:{description:{story:`Avatar with a custom role icon element instead of the default role badges.`},source:{code:`<Avatar
  size={AvatarSize.max}
  role={AvatarRole.admin}
  userName="Custom Role"
  roleIcon={<CustomRoleIcon />}
/>`}}}},A={render:e=>(0,d.jsx)(a,{...e}),args:{size:r.max,role:n.user,source:``,userName:``,isDefaultSource:!0,hideRoleIcon:!1},parameters:{docs:{description:{story:`Avatar showing the default placeholder image when no source or userName is provided.`},source:{code:`<Avatar
  size={AvatarSize.max}
  role={AvatarRole.user}
  isDefaultSource
/>`}}}},j=()=>(0,d.jsx)(`div`,{dir:`rtl`,children:(0,d.jsxs)(g,{children:[(0,d.jsx)(a,{size:r.big,role:n.admin,userName:`John Doe`,withTooltip:!0,tooltipContent:`Admin`}),(0,d.jsx)(a,{size:r.max,role:n.none,source:p,editing:!0,hasAvatar:!0,model:m,onChangeFile:f()})]})}),M={render:()=>(0,d.jsx)(j,{}),globals:{direction:`rtl`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`150px`},description:{story:'The same avatars under a right-to-left interface: the admin badge and the pencil move from the bottom-right corner to the bottom-left one, and the badge tooltip opens to the left of it. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.'},source:{code:`<div dir="rtl">
  <Avatar
    size={AvatarSize.big}
    role={AvatarRole.admin}
    userName="John Doe"
    withTooltip
    tooltipContent="Admin"
  />
  <Avatar
    size={AvatarSize.max}
    role={AvatarRole.none}
    source={pictureUrl}
    editing
    hasAvatar
    model={model}
    onChangeFile={handleFile}
  />
</div>`}}}},N={render:()=>(0,d.jsxs)(`div`,{style:{display:`flex`,gap:`16px`,alignItems:`center`,"--avatar-radius":`8px`,"--avatar-initials-weight":`400`,"--avatar-initials-bg":`#7c3aed`,"--avatar-bg":`#c4b5fd`},children:[(0,d.jsx)(a,{size:r.big,userName:`John Doe`,role:n.admin}),(0,d.jsx)(a,{size:r.big,role:n.user})]}),parameters:{docs:{description:{story:"Four variables set on one wrapper -- the variables are listed under CSS variables on this page. The first avatar, with initials, shows the radius, the initials background and the weight; the second, with neither picture nor name, is there for `--avatar-bg`."},source:{code:`<div
  style={{
    "--avatar-radius": "8px",
    "--avatar-initials-weight": "400",
    "--avatar-initials-bg": "#7c3aed",
    "--avatar-bg": "#c4b5fd",
  }}
>
  <Avatar size={AvatarSize.big} role={AvatarRole.admin} userName="John Doe" />
  <Avatar size={AvatarSize.big} role={AvatarRole.user} />
</div>`}}}},P=[`Default`,`WithImage`,`WithInitials`,`WithIcon`,`AllSizes`,`AllRoles`,`GroupAvatar`,`EditingMode`,`EditingWithAvatar`,`WithCustomRoleIcon`,`DefaultSource`,`RightToLeft`,`CssCustomization`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.user,
    source: "",
    userName: "",
    editing: false,
    hideRoleIcon: false,
    tooltipContent: "",
    withTooltip: false
  },
  parameters: {
    docs: {
      description: {
        story: "An avatar with nothing to show yet: with no picture and no name it falls back to a camera icon on the neutral background. Change any prop live in the Controls panel below."
      },
      source: {
        code: \`<Avatar size={AvatarSize.max} role={AvatarRole.user} />\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.admin,
    source: samplePicture,
    userName: "John Smith",
    editing: false,
    hideRoleIcon: false,
    tooltipContent: "John Smith - Administrator",
    withTooltip: true
  },
  parameters: {
    docs: {
      description: {
        story: "A picture with the admin badge at its bottom corner; hover the badge to read its tooltip (\`withTooltip\`, \`tooltipContent\`)."
      },
      source: {
        code: \`<Avatar
  size={AvatarSize.max}
  role={AvatarRole.admin}
  source="https://example.com/photo.jpg"
  userName="John Smith"
  tooltipContent="John Smith - Administrator"
  withTooltip
/>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.guest,
    source: "",
    userName: "John Doe",
    editing: false,
    hideRoleIcon: false
  },
  parameters: {
    docs: {
      description: {
        story: "Avatar showing initials generated from the user name. Uses first letter of first two words (JD)."
      },
      source: {
        code: \`<Avatar
  size={AvatarSize.max}
  role={AvatarRole.guest}
  userName="John Doe"
/>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.user,
    source: AtReactSvgUrl,
    userName: "",
    editing: false,
    hideRoleIcon: false
  },
  parameters: {
    docs: {
      description: {
        story: "Avatar displaying an SVG icon instead of an image or initials."
      },
      source: {
        code: \`<Avatar
  size={AvatarSize.max}
  role={AvatarRole.user}
  source={iconUrl}
/>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <AllSizesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "All seven sizes side by side: max (124px), big (80px), medium (48px), base (40px), small (36px), min (32px) and extraSmall (24px); the initials and the admin badge shrink with the avatar."
      },
      source: {
        code: \`<Avatar size={AvatarSize.min} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.small} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.base} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.medium} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.big} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.max} role={AvatarRole.admin} userName="John Doe" />
<Avatar size={AvatarSize.extraSmall} role={AvatarRole.admin} userName="John Doe" />\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <AllRolesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Every \`role\` value on the same avatar: only Owner and Admin draw a badge at the bottom corner, User, Guest, Manager, Collaborator and None draw none."
      },
      source: {
        code: \`<Avatar size={AvatarSize.big} role={AvatarRole.owner} userName="Owner" />
<Avatar size={AvatarSize.big} role={AvatarRole.admin} userName="Admin" />
<Avatar size={AvatarSize.big} role={AvatarRole.user} userName="User" />
<Avatar size={AvatarSize.big} role={AvatarRole.guest} userName="Guest" />
<Avatar size={AvatarSize.big} role={AvatarRole.manager} userName="Manager" />
<Avatar size={AvatarSize.big} role={AvatarRole.collaborator} userName="Collaborator" />
<Avatar size={AvatarSize.big} role={AvatarRole.none} userName="None" />\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: args => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.none,
    source: "",
    userName: "Project Team",
    isGroup: true,
    hideRoleIcon: true
  },
  parameters: {
    docs: {
      description: {
        story: "Group avatar with uppercase initials and specialized background color. Role icons are typically hidden for groups."
      },
      source: {
        code: \`<Avatar
  size={AvatarSize.max}
  role={AvatarRole.none}
  userName="Project Team"
  isGroup
  hideRoleIcon
/>\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: args => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.owner,
    source: "",
    userName: "Jane Smith",
    editing: true,
    hideRoleIcon: true,
    hasAvatar: false,
    model: editModel,
    // Set so no onClick action is injected: one would replace the edit behaviour.
    onClick: undefined
  },
  parameters: {
    docs: {
      description: {
        story: "A person with no picture yet: the plus button at the corner, or a click anywhere on the avatar, opens the file dialog straight away through the first \`model\` action, and the chosen file reaches \`onChangeFile\`. The button is drawn only at \`size\` \`max\`."
      },
      source: {
        code: \`<Avatar
  size={AvatarSize.max}
  role={AvatarRole.owner}
  userName="Jane Smith"
  editing
  hideRoleIcon
  hasAvatar={false}
  model={[
    {
      key: AvatarActionKeys.PROFILE_AVATAR_UPLOAD,
      label: "Upload picture",
      icon: iconUrl,
      onClick: (ref) => ref?.current?.click(),
    },
  ]}
  onChangeFile={handleFile}
/>\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: args => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.owner,
    source: samplePicture,
    userName: "Jane Smith",
    editing: true,
    hideRoleIcon: true,
    hasAvatar: true,
    model: editModel,
    // Set so no onClick action is injected: one would replace the edit behaviour.
    onClick: undefined
  },
  parameters: {
    docs: {
      description: {
        story: "A person who already has a picture: the pencil at the corner, or a click on the avatar, opens a menu of the \`model\` actions — **Upload picture** opens the file dialog, **Delete picture** runs its own handler."
      },
      source: {
        code: \`<Avatar
  size={AvatarSize.max}
  role={AvatarRole.owner}
  source="https://example.com/photo.jpg"
  userName="Jane Smith"
  editing
  hideRoleIcon
  hasAvatar
  model={[
    {
      key: AvatarActionKeys.PROFILE_AVATAR_UPLOAD,
      label: "Upload picture",
      icon: iconUrl,
      onClick: (ref) => ref?.current?.click(),
    },
    {
      key: AvatarActionKeys.PROFILE_AVATAR_DELETE,
      label: "Delete picture",
      icon: iconUrl,
      onClick: handleDelete,
    },
  ]}
  onChangeFile={handleFile}
/>\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: args => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.admin,
    source: "",
    userName: "Custom Role",
    roleIcon: <div style={{
      width: "100%",
      height: "100%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "10px",
      fontWeight: "bold"
    }}>
        VIP
      </div>,
    hideRoleIcon: false
  },
  parameters: {
    docs: {
      description: {
        story: "Avatar with a custom role icon element instead of the default role badges."
      },
      source: {
        code: \`<Avatar
  size={AvatarSize.max}
  role={AvatarRole.admin}
  userName="Custom Role"
  roleIcon={<CustomRoleIcon />}
/>\`
      }
    }
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: args => <AvatarPure {...args} />,
  args: {
    size: AvatarSize.max,
    role: AvatarRole.user,
    source: "",
    userName: "",
    isDefaultSource: true,
    hideRoleIcon: false
  },
  parameters: {
    docs: {
      description: {
        story: "Avatar showing the default placeholder image when no source or userName is provided."
      },
      source: {
        code: \`<Avatar
  size={AvatarSize.max}
  role={AvatarRole.user}
  isDefaultSource
/>\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => <RightToLeftTemplate />,
  globals: {
    direction: "rtl"
  },
  parameters: {
    noPadding: true,
    docs: {
      story: {
        inline: false,
        height: "150px"
      },
      description: {
        story: 'The same avatars under a right-to-left interface: the admin badge and the pencil move from the bottom-right corner to the bottom-left one, and the badge tooltip opens to the left of it. The direction comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar); the wrapper also carries \`dir="rtl"\` for the rules that read the DOM direction.'
      },
      source: {
        code: \`<div dir="rtl">
  <Avatar
    size={AvatarSize.big}
    role={AvatarRole.admin}
    userName="John Doe"
    withTooltip
    tooltipContent="Admin"
  />
  <Avatar
    size={AvatarSize.max}
    role={AvatarRole.none}
    source={pictureUrl}
    editing
    hasAvatar
    model={model}
    onChangeFile={handleFile}
  />
</div>\`
      }
    }
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: "16px",
    alignItems: "center",
    "--avatar-radius": "8px",
    "--avatar-initials-weight": "400",
    "--avatar-initials-bg": "#7c3aed",
    "--avatar-bg": "#c4b5fd"
  } as CSSProperties}>
      <AvatarPure size={AvatarSize.big} userName="John Doe" role={AvatarRole.admin} />
      <AvatarPure size={AvatarSize.big} role={AvatarRole.user} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Four variables set on one wrapper -- the variables are listed under CSS variables on this page. The first avatar, with initials, shows the radius, the initials background and the weight; the second, with neither picture nor name, is there for \\\`--avatar-bg\\\`.\`
      },
      source: {
        code: \`<div
  style={{
    "--avatar-radius": "8px",
    "--avatar-initials-weight": "400",
    "--avatar-initials-bg": "#7c3aed",
    "--avatar-bg": "#c4b5fd",
  }}
>
  <Avatar size={AvatarSize.big} role={AvatarRole.admin} userName="John Doe" />
  <Avatar size={AvatarSize.big} role={AvatarRole.user} />
</div>\`
      }
    }
  }
}`,...N.parameters?.docs?.source}}}})))()}F();export{T as AllRoles,C as AllSizes,N as CssCustomization,v as Default,A as DefaultSource,D as EditingMode,O as EditingWithAvatar,E as GroupAvatar,M as RightToLeft,k as WithCustomRoleIcon,x as WithIcon,y as WithImage,b as WithInitials,P as __namedExportsOrder,h as default};