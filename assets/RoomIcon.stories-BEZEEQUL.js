import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./room-icon-CCL5v7TK.js";import{n as i,t as a}from"./catalog.folder.react-VUpu0ofJ.js";import{n as o,t as s}from"./planet.react-CvYnOWuq.js";var c;function l(){return(l=e((()=>{c=`data:image/svg+xml,%3csvg%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M9%207V1H7V7H1V9H7V15H9V9H15V7H9Z'%20fill='%23657077'/%3e%3c/svg%3e`})))()}var u;function d(){return(d=e((()=>{u=`data:image/svg+xml,%3csvg%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_28469_39135)'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M10.2929%201.29312C11.5119%200.074169%2013.4882%200.0741679%2014.7071%201.29312C15.9261%202.51207%2015.9261%204.48838%2014.7071%205.70733L5.70713%2014.7073C5.57897%2014.8355%205.41839%2014.9264%205.24256%2014.9704L1.24256%2015.9704C0.901782%2016.0556%200.541295%2015.9557%200.292914%2015.7073C0.0445341%2015.459%20-0.055315%2015.0985%200.0298787%2014.7577L1.02988%2010.7577C1.07384%2010.5819%201.16476%2010.4213%201.29291%2010.2931L10.2929%201.29312ZM13.2929%202.70733C12.855%202.26943%2012.145%202.26943%2011.7071%202.70733L10.9142%203.50023L12.5%205.08601L13.2929%204.29312C13.7308%203.85522%2013.7308%203.14524%2013.2929%202.70733ZM11.0858%206.50023L9.50002%204.91444L2.90299%2011.5115L2.37439%2013.6259L4.48877%2013.0973L11.0858%206.50023Z'%20fill='%23333333'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_28469_39135'%3e%3crect%20width='16'%20height='16'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e`})))()}var f,p;function m(){return(m=e((()=>{f=`_roomTitle_tk7cf_1`,p={roomTitle:f}})))()}var h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B;function V(){return(V=e((()=>{s(),i(),l(),d(),m(),n(),h=t(),{fn:g}=__STORYBOOK_MODULE_TEST__,_={title:`UI/Data display/RoomIcon`,component:r,parameters:{},argTypes:{title:{control:`text`,description:`Name the initials are taken from: the first letter of its first word and of its last`},color:{control:`text`,description:"Colour of the tile, as six hex digits without a leading `#`; the initials turn white or black to stay readable on it"},size:{control:`text`,description:"Side of the square, as a px string such as `48px`; at `96px` the corner badge grows to match",table:{defaultValue:{summary:`32px`}}},radius:{control:`text`,description:`Corner radius of the tile and of the image inside it`,table:{defaultValue:{summary:`6px`}}},showDefault:{control:`boolean`,description:`Draws the initials even when a logo is set`,table:{defaultValue:{summary:`false`}}},logo:{control:`text`,description:"Logo drawn instead of the initials: an image URL, or an object whose `cover` SVG is inlined and painted in the initials' colour, or whose `medium` URL is shown as it is"},imgClassName:{control:`text`,description:"Class added to the `<img>` the logo is drawn in"},className:{control:`text`,description:`Class added to the outer element`},isArchive:{control:`boolean`,description:"Greys the tile out whatever `color` holds, and switches the hover image off",table:{defaultValue:{summary:`false`}}},isTemplate:{control:`boolean`,description:`Draws the tile as an outline in its colour, with the initials or a 24px logo inside`,table:{defaultValue:{summary:`false`}}},withEditing:{control:`boolean`,description:`Adds a pencil button in the corner that opens the logo menu; the tile becomes at least 64px wide and the badge is not drawn`,table:{defaultValue:{summary:`false`}}},isEmptyIcon:{control:`boolean`,description:`Replaces the whole tile with a dashed frame, a camera glyph and a plus button that opens the logo menu`,table:{defaultValue:{summary:`false`}}},model:{control:!1,description:`Entries of the logo menu, each with a label, an icon and a click handler; the upload entry is handed the hidden file input`},dropDownManualX:{control:`text`,description:`Horizontal offset of the logo menu from its button`,table:{defaultValue:{summary:`-10px`}}},onChangeFile:{action:`onChangeFile`,description:`Called when a file is picked in the hidden file input; the input is rendered only when this is set`},hoverSrc:{control:`text`,description:`Image that slides in over the tile while the pointer is on it, replacing the initials`},badgeUrl:{control:`text`,description:`URL of the glyph drawn in the bottom corner of the tile`},badgeIconNode:{control:!1,description:`Glyph drawn in the bottom corner, as a node instead of a URL`},badgeIconColor:{control:`text`,description:`When set, the badge glyph keeps its own colours instead of being filled white (black in the dark theme)`},onBadgeClick:{action:`onBadgeClick`,description:`Called when the badge is clicked; the click also reaches the tile and toggles the logo menu`},tooltipContent:{control:`text`,description:"Text shown under the badge while the pointer is on it; needs `tooltipId`"},tooltipId:{control:`text`,description:`Id that ties the badge to its tooltip`},dataTestId:{control:`text`,description:"Value of `data-testid` on the outer element",table:{defaultValue:{summary:`room-icon`}}}}},v=e=>(0,h.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`16px`,flexWrap:`wrap`},children:e.children}),y=[{label:`Upload`,icon:c,key:`upload`,onClick:g()},{label:`Edit`,icon:u,key:`edit`,onClick:g()}],b={render:e=>(0,h.jsx)(r,{...e,className:p.roomTitle}),args:{title:`Test Room`,size:`96px`,color:`4781D1`,radius:`6px`,showDefault:!0},parameters:{docs:{description:{story:`A room with no logo is shown by its initials on its colour. Change the name, the colour or the size live in the Controls panel below.`},source:{code:`<RoomIcon title="Test Room" color="4781D1" size="96px" />`}}}},x=()=>(0,h.jsxs)(v,{children:[(0,h.jsx)(r,{title:`S`,color:`4781D1`,size:`32px`,showDefault:!0}),(0,h.jsx)(r,{title:`M`,color:`4781D1`,size:`48px`,showDefault:!0}),(0,h.jsx)(r,{title:`L`,color:`4781D1`,size:`96px`,showDefault:!0})]}),S={render:()=>(0,h.jsx)(x,{}),parameters:{docs:{description:{story:"The same tile at 32px, 48px and 96px (`size`). Any px value works; the initials stay 14px at every size, so a large tile needs its own text style for them."},source:{code:`<RoomIcon title="S" color="4781D1" size="32px" showDefault />
<RoomIcon title="M" color="4781D1" size="48px" showDefault />
<RoomIcon title="L" color="4781D1" size="96px" showDefault />`}}}},C=()=>(0,h.jsxs)(v,{children:[(0,h.jsx)(r,{title:`Blue`,color:`4781D1`,size:`48px`,showDefault:!0}),(0,h.jsx)(r,{title:`Green`,color:`2DB482`,size:`48px`,showDefault:!0}),(0,h.jsx)(r,{title:`Orange`,color:`F97A0B`,size:`48px`,showDefault:!0}),(0,h.jsx)(r,{title:`Purple`,color:`533ED1`,size:`48px`,showDefault:!0}),(0,h.jsx)(r,{title:`Red`,color:`F2675A`,size:`48px`,showDefault:!0})]}),w={render:()=>(0,h.jsx)(C,{}),parameters:{docs:{description:{story:"Each room gets its own colour (`color`, six hex digits without `#`), and the initials turn white or black to stay readable on it."},source:{code:`<RoomIcon title="Blue" color="4781D1" size="48px" showDefault />
<RoomIcon title="Green" color="2DB482" size="48px" showDefault />
<RoomIcon title="Orange" color="F97A0B" size="48px" showDefault />
<RoomIcon title="Purple" color="533ED1" size="48px" showDefault />
<RoomIcon title="Red" color="F2675A" size="48px" showDefault />`}}}},T={render:e=>(0,h.jsx)(`div`,{style:{height:`200px`},children:(0,h.jsx)(r,{...e,className:p.roomTitle})}),args:{title:`Editable`,size:`96px`,color:`4781D1`,radius:`6px`,showDefault:!0,withEditing:!0,model:y},parameters:{docs:{description:{story:"Lets the reader change the logo: click the pencil in the corner, or anywhere on the tile, to open the logo menu (`withEditing`, `model`); picking an entry shows up in the Actions panel."},source:{code:`<RoomIcon
  title="Editable"
  size="96px"
  color="4781D1"
  withEditing
  model={menuModel}
  showDefault
/>`}}}},E={render:e=>(0,h.jsx)(`div`,{style:{height:`200px`},children:(0,h.jsx)(r,{...e})}),args:{title:``,size:`96px`,isEmptyIcon:!0,model:y},parameters:{docs:{description:{story:"For a room that has no logo yet: a dashed frame with a camera glyph, and a plus button in the bottom-right corner that opens the logo menu (`isEmptyIcon`, `model`). The button takes its background from the host's accent colour, which Storybook does not define, so here only a click on that corner finds it."},source:{code:`<RoomIcon title="" size="96px" isEmptyIcon model={menuModel} />`}}}},D={render:e=>(0,h.jsx)(r,{...e,className:p.roomTitle}),args:{title:`Archived`,size:`96px`,color:`4781D1`,radius:`6px`,showDefault:!0,isArchive:!0},parameters:{docs:{description:{story:"An archived room is greyed out whatever its colour: this tile is given the same blue as the others (`isArchive`)."},source:{code:`<RoomIcon title="Archived" size="96px" color="4781D1" isArchive />`}}}},O={render:e=>(0,h.jsx)(`div`,{style:{position:`relative`,width:`120px`,height:`120px`},children:(0,h.jsx)(r,{...e,className:p.roomTitle})}),args:{title:`Public`,color:`3B72A7`,size:`96px`,radius:`6px`,badgeUrl:o,onBadgeClick:g(),showDefault:!0},parameters:{docs:{description:{story:"Marks something about the room with a glyph in the bottom corner (`badgeUrl`); clicking it calls `onBadgeClick`, shown in the Actions panel."},source:{code:`<RoomIcon
  title="Public"
  color="3B72A7"
  size="96px"
  badgeUrl={planetIconUrl}
  onBadgeClick={handleBadgeClick}
  showDefault
/>`}}}},k={render:e=>(0,h.jsx)(`div`,{style:{position:`relative`,width:`120px`,height:`120px`},children:(0,h.jsx)(r,{...e,className:p.roomTitle})}),args:{title:`Tooltip`,color:`2DB482`,size:`96px`,radius:`6px`,badgeUrl:o,onBadgeClick:g(),tooltipContent:`Anyone with the link can view`,tooltipId:`room-tooltip`,showDefault:!0},parameters:{docs:{description:{story:"Explains the badge in words: hover it to read the text (`tooltipContent`), which the badge finds through `tooltipId`."},source:{code:`<RoomIcon
  title="Tooltip"
  color="2DB482"
  size="96px"
  badgeUrl={planetIconUrl}
  tooltipContent="Anyone with the link can view"
  tooltipId="room-tooltip"
  showDefault
/>`}}}},A={render:e=>(0,h.jsx)(r,{...e,className:p.roomTitle}),args:{title:`Template`,color:`533ED1`,size:`96px`,radius:`6px`,isTemplate:!0,showDefault:!0},parameters:{docs:{description:{story:"Tells a template apart from a room: an outline in the tile colour instead of a filled square, with the initials inside (`isTemplate`)."},source:{code:`<RoomIcon title="Template" color="533ED1" size="96px" isTemplate />`}}}},j={render:e=>(0,h.jsx)(`div`,{style:{height:`200px`},children:(0,h.jsx)(r,{...e,className:p.roomTitle})}),args:{title:`Hover`,size:`96px`,color:`4781D1`,radius:`6px`,showDefault:!0,hoverSrc:u,model:y},parameters:{docs:{description:{story:"Hints that the tile can be clicked: hover it, and the initials slide away while a second image fades in (`hoverSrc`); a click opens the logo menu (`model`)."},source:{code:`<RoomIcon
  title="Hover"
  size="96px"
  color="4781D1"
  hoverSrc={pencilIconUrl}
  model={menuModel}
  showDefault
/>`}}}},M={render:e=>(0,h.jsx)(r,{...e,className:p.roomTitle}),args:{title:`Very Long Room Name That Should Be Truncated`,size:`48px`,color:`F97A0B`,radius:`6px`,showDefault:!0},parameters:{docs:{description:{story:"However long the name, the tile shows two letters: the first of its first word and the first of its last (`title`)."},source:{code:`<RoomIcon
  title="Very Long Room Name That Should Be Truncated"
  size="48px"
  color="F97A0B"
  showDefault
/>`}}}},N={cover:{id:`star`,data:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M10 2l2.4 5.2 5.6.6-4.2 3.8 1.2 5.6L10 14.4 5 17.2l1.2-5.6L2 7.8l5.6-.6z"/></svg>`},original:``,large:``,medium:``,small:``},P=`data:image/png;base64,bm90LWFuLWltYWdl`,F=e=>(0,h.jsxs)(v,{children:[(0,h.jsx)(r,{...e,logo:a}),(0,h.jsx)(r,{...e,logo:N}),(0,h.jsx)(r,{...e,logo:P})]}),I={render:e=>(0,h.jsx)(F,{...e}),args:{title:`Project files`,color:`2DB482`,size:`48px`},parameters:{docs:{description:{story:`A room with a logo of its own shows it instead of the initials (\`logo\`):

- **Image** — a URL, drawn as it is
- **Cover** — an object with a \`cover\` SVG, inlined and painted in the initials' colour on the tile
- **Broken URL** — the image fails to load, so the tile falls back to the initials`},source:{code:`<RoomIcon title="Project files" color="2DB482" size="48px" logo={logoUrl} />
<RoomIcon title="Project files" color="2DB482" size="48px" logo={{ cover: { id: "star", data: svgString }, original: "", large: "", medium: "", small: "" }} />
<RoomIcon title="Project files" color="2DB482" size="48px" logo={urlThatFailsToLoad} />`}}}},L=e=>(0,h.jsx)(`div`,{dir:`rtl`,children:(0,h.jsxs)(v,{children:[(0,h.jsx)(r,{...e,withEditing:!0,model:y}),(0,h.jsx)(r,{...e,badgeUrl:o})]})}),R={render:e=>(0,h.jsx)(L,{...e}),globals:{direction:`rtl`},args:{title:`ملفات المشروع`,color:`4781D1`,size:`48px`},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`90px`},description:{story:'The tile under a right-to-left interface: the pencil button and the badge move to the bottom-left corner. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.'},source:{code:`<div dir="rtl">
  <RoomIcon title="ملفات المشروع" color="4781D1" size="48px" withEditing model={menuModel} />
  <RoomIcon title="ملفات المشروع" color="4781D1" size="48px" badgeUrl={iconUrl} />
</div>`}}}},z={render:()=>(0,h.jsxs)(`div`,{style:{display:`flex`,gap:`24px`,alignItems:`center`,"--room-icon-bg":`#b45309`,"--room-icon-bg-opacity":`0.6`,"--room-icon-edit-bg":`#fde68a`,"--room-icon-button-icon-color":`#7c3aed`,"--room-icon-empty-radius":`50%`,"--room-icon-dashed-border":`2px dashed #7c3aed`},children:[(0,h.jsx)(r,{title:`Design review`,size:`96px`,color:`7c3aed`,radius:`50%`,withEditing:!0,model:y,className:p.roomTitle}),(0,h.jsx)(r,{title:``,size:`96px`,isEmptyIcon:!0,model:y})]}),parameters:{docs:{description:{story:"Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. It covers two instances:\n\n- **Design review** — an editable tile, for `--room-icon-bg-opacity` on the tile and `--room-icon-edit-bg` on the pencil\n- **Empty frame** — for `--room-icon-bg` on the plus glyph, `--room-icon-button-icon-color` on the camera, and the frame's `--room-icon-dashed-border` and `--room-icon-empty-radius`"},source:{code:`<div
  style={{
    "--room-icon-bg": "#b45309",
    "--room-icon-bg-opacity": "0.6",
    "--room-icon-edit-bg": "#fde68a",
    "--room-icon-button-icon-color": "#7c3aed",
    "--room-icon-empty-radius": "50%",
    "--room-icon-dashed-border": "2px dashed #7c3aed",
  }}
>
  <RoomIcon title="Design review" size="96px" color="7c3aed" radius="50%" withEditing model={menuModel} />
  <RoomIcon title="" size="96px" isEmptyIcon model={menuModel} />
</div>`}}}},B=[`Default`,`Sizes`,`Colors`,`WithEditing`,`EmptyState`,`Archive`,`WithBadge`,`WithTooltip`,`Template`,`WithHover`,`LongTitle`,`WithLogo`,`RightToLeft`,`CssCustomization`],b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: (args: RoomIconProps) => <RoomIcon {...args} className={styles.roomTitle} />,
  args: {
    title: "Test Room",
    size: "96px",
    color: "4781D1",
    radius: "6px",
    showDefault: true
  },
  parameters: {
    docs: {
      description: {
        story: "A room with no logo is shown by its initials on its colour. Change the name, the colour or the size live in the Controls panel below."
      },
      source: {
        code: \`<RoomIcon title="Test Room" color="4781D1" size="96px" />\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The same tile at 32px, 48px and 96px (\`size\`). Any px value works; the initials stay 14px at every size, so a large tile needs its own text style for them."
      },
      source: {
        code: \`<RoomIcon title="S" color="4781D1" size="32px" showDefault />
<RoomIcon title="M" color="4781D1" size="48px" showDefault />
<RoomIcon title="L" color="4781D1" size="96px" showDefault />\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <ColorsTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Each room gets its own colour (\`color\`, six hex digits without \`#\`), and the initials turn white or black to stay readable on it."
      },
      source: {
        code: \`<RoomIcon title="Blue" color="4781D1" size="48px" showDefault />
<RoomIcon title="Green" color="2DB482" size="48px" showDefault />
<RoomIcon title="Orange" color="F97A0B" size="48px" showDefault />
<RoomIcon title="Purple" color="533ED1" size="48px" showDefault />
<RoomIcon title="Red" color="F2675A" size="48px" showDefault />\`
      }
    }
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: (args: RoomIconProps) => <div style={{
    height: "200px"
  }}>
      <RoomIcon {...args} className={styles.roomTitle} />
    </div>,
  args: {
    title: "Editable",
    size: "96px",
    color: "4781D1",
    radius: "6px",
    showDefault: true,
    withEditing: true,
    model: mockModel
  },
  parameters: {
    docs: {
      description: {
        story: "Lets the reader change the logo: click the pencil in the corner, or anywhere on the tile, to open the logo menu (\`withEditing\`, \`model\`); picking an entry shows up in the Actions panel."
      },
      source: {
        code: \`<RoomIcon
  title="Editable"
  size="96px"
  color="4781D1"
  withEditing
  model={menuModel}
  showDefault
/>\`
      }
    }
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: (args: RoomIconProps) => <div style={{
    height: "200px"
  }}>
      <RoomIcon {...args} />
    </div>,
  args: {
    title: "",
    size: "96px",
    isEmptyIcon: true,
    model: mockModel
  },
  parameters: {
    docs: {
      description: {
        story: "For a room that has no logo yet: a dashed frame with a camera glyph, and a plus button in the bottom-right corner that opens the logo menu (\`isEmptyIcon\`, \`model\`). The button takes its background from the host's accent colour, which Storybook does not define, so here only a click on that corner finds it."
      },
      source: {
        code: \`<RoomIcon title="" size="96px" isEmptyIcon model={menuModel} />\`
      }
    }
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: (args: RoomIconProps) => <RoomIcon {...args} className={styles.roomTitle} />,
  args: {
    title: "Archived",
    size: "96px",
    color: "4781D1",
    radius: "6px",
    showDefault: true,
    isArchive: true
  },
  parameters: {
    docs: {
      description: {
        story: "An archived room is greyed out whatever its colour: this tile is given the same blue as the others (\`isArchive\`)."
      },
      source: {
        code: \`<RoomIcon title="Archived" size="96px" color="4781D1" isArchive />\`
      }
    }
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: (args: RoomIconProps) => <div style={{
    position: "relative",
    width: "120px",
    height: "120px"
  }}>
      <RoomIcon {...args} className={styles.roomTitle} />
    </div>,
  args: {
    title: "Public",
    color: "3B72A7",
    size: "96px",
    radius: "6px",
    badgeUrl: PlanetIcon,
    onBadgeClick: fn(),
    showDefault: true
  },
  parameters: {
    docs: {
      description: {
        story: "Marks something about the room with a glyph in the bottom corner (\`badgeUrl\`); clicking it calls \`onBadgeClick\`, shown in the Actions panel."
      },
      source: {
        code: \`<RoomIcon
  title="Public"
  color="3B72A7"
  size="96px"
  badgeUrl={planetIconUrl}
  onBadgeClick={handleBadgeClick}
  showDefault
/>\`
      }
    }
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: (args: RoomIconProps) => <div style={{
    position: "relative",
    width: "120px",
    height: "120px"
  }}>
      <RoomIcon {...args} className={styles.roomTitle} />
    </div>,
  args: {
    title: "Tooltip",
    color: "2DB482",
    size: "96px",
    radius: "6px",
    badgeUrl: PlanetIcon,
    onBadgeClick: fn(),
    tooltipContent: "Anyone with the link can view",
    tooltipId: "room-tooltip",
    showDefault: true
  },
  parameters: {
    docs: {
      description: {
        story: "Explains the badge in words: hover it to read the text (\`tooltipContent\`), which the badge finds through \`tooltipId\`."
      },
      source: {
        code: \`<RoomIcon
  title="Tooltip"
  color="2DB482"
  size="96px"
  badgeUrl={planetIconUrl}
  tooltipContent="Anyone with the link can view"
  tooltipId="room-tooltip"
  showDefault
/>\`
      }
    }
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: (args: RoomIconProps) => <RoomIcon {...args} className={styles.roomTitle} />,
  args: {
    title: "Template",
    color: "533ED1",
    size: "96px",
    radius: "6px",
    isTemplate: true,
    showDefault: true
  },
  parameters: {
    docs: {
      description: {
        story: "Tells a template apart from a room: an outline in the tile colour instead of a filled square, with the initials inside (\`isTemplate\`)."
      },
      source: {
        code: \`<RoomIcon title="Template" color="533ED1" size="96px" isTemplate />\`
      }
    }
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: (args: RoomIconProps) => <div style={{
    height: "200px"
  }}>
      <RoomIcon {...args} className={styles.roomTitle} />
    </div>,
  args: {
    title: "Hover",
    size: "96px",
    color: "4781D1",
    radius: "6px",
    showDefault: true,
    hoverSrc: EditPenSvgUrl,
    model: mockModel
  },
  parameters: {
    docs: {
      description: {
        story: "Hints that the tile can be clicked: hover it, and the initials slide away while a second image fades in (\`hoverSrc\`); a click opens the logo menu (\`model\`)."
      },
      source: {
        code: \`<RoomIcon
  title="Hover"
  size="96px"
  color="4781D1"
  hoverSrc={pencilIconUrl}
  model={menuModel}
  showDefault
/>\`
      }
    }
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: (args: RoomIconProps) => <RoomIcon {...args} className={styles.roomTitle} />,
  args: {
    title: "Very Long Room Name That Should Be Truncated",
    size: "48px",
    color: "F97A0B",
    radius: "6px",
    showDefault: true
  },
  parameters: {
    docs: {
      description: {
        story: "However long the name, the tile shows two letters: the first of its first word and the first of its last (\`title\`)."
      },
      source: {
        code: \`<RoomIcon
  title="Very Long Room Name That Should Be Truncated"
  size="48px"
  color="F97A0B"
  showDefault
/>\`
      }
    }
  }
}`,...M.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: (args: RoomIconProps) => <WithLogoTemplate {...args} />,
  args: {
    title: "Project files",
    color: "2DB482",
    size: "48px"
  },
  parameters: {
    docs: {
      description: {
        story: \`A room with a logo of its own shows it instead of the initials (\\\`logo\\\`):

- **Image** — a URL, drawn as it is
- **Cover** — an object with a \\\`cover\\\` SVG, inlined and painted in the initials' colour on the tile
- **Broken URL** — the image fails to load, so the tile falls back to the initials\`
      },
      source: {
        code: \`<RoomIcon title="Project files" color="2DB482" size="48px" logo={logoUrl} />
<RoomIcon title="Project files" color="2DB482" size="48px" logo={{ cover: { id: "star", data: svgString }, original: "", large: "", medium: "", small: "" }} />
<RoomIcon title="Project files" color="2DB482" size="48px" logo={urlThatFailsToLoad} />\`
      }
    }
  }
}`,...I.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: (args: RoomIconProps) => <RightToLeftTemplate {...args} />,
  globals: {
    direction: "rtl"
  },
  args: {
    title: "ملفات المشروع",
    color: "4781D1",
    size: "48px"
  },
  parameters: {
    noPadding: true,
    docs: {
      story: {
        inline: false,
        height: "90px"
      },
      description: {
        story: 'The tile under a right-to-left interface: the pencil button and the badge move to the bottom-left corner. The direction comes from the theme\\'s \`interfaceDirection\` (the Direction toolbar); the wrapper also carries \`dir="rtl"\` for the rules that read the DOM direction.'
      },
      source: {
        code: \`<div dir="rtl">
  <RoomIcon title="ملفات المشروع" color="4781D1" size="48px" withEditing model={menuModel} />
  <RoomIcon title="ملفات المشروع" color="4781D1" size="48px" badgeUrl={iconUrl} />
</div>\`
      }
    }
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: "24px",
    alignItems: "center",
    "--room-icon-bg": "#b45309",
    "--room-icon-bg-opacity": "0.6",
    "--room-icon-edit-bg": "#fde68a",
    "--room-icon-button-icon-color": "#7c3aed",
    "--room-icon-empty-radius": "50%",
    "--room-icon-dashed-border": "2px dashed #7c3aed"
  } as CSSProperties}>
      <RoomIcon title="Design review" size="96px" color="7c3aed" radius="50%" withEditing model={mockModel} className={styles.roomTitle} />
      <RoomIcon title="" size="96px" isEmptyIcon model={mockModel} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. It covers two instances:

- **Design review** — an editable tile, for \\\`--room-icon-bg-opacity\\\` on the tile and \\\`--room-icon-edit-bg\\\` on the pencil
- **Empty frame** — for \\\`--room-icon-bg\\\` on the plus glyph, \\\`--room-icon-button-icon-color\\\` on the camera, and the frame's \\\`--room-icon-dashed-border\\\` and \\\`--room-icon-empty-radius\\\`\`
      },
      source: {
        code: \`<div
  style={{
    "--room-icon-bg": "#b45309",
    "--room-icon-bg-opacity": "0.6",
    "--room-icon-edit-bg": "#fde68a",
    "--room-icon-button-icon-color": "#7c3aed",
    "--room-icon-empty-radius": "50%",
    "--room-icon-dashed-border": "2px dashed #7c3aed",
  }}
>
  <RoomIcon title="Design review" size="96px" color="7c3aed" radius="50%" withEditing model={menuModel} />
  <RoomIcon title="" size="96px" isEmptyIcon model={menuModel} />
</div>\`
      }
    }
  }
}`,...z.parameters?.docs?.source}}}})))()}V();export{D as Archive,w as Colors,z as CssCustomization,b as Default,E as EmptyState,M as LongTitle,R as RightToLeft,S as Sizes,A as Template,O as WithBadge,T as WithEditing,j as WithHover,I as WithLogo,k as WithTooltip,B as __namedExportsOrder,_ as default};