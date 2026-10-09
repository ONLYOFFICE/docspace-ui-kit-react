import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{S as n,g as r}from"./enums-DzcBu485.js";import{n as i,t as a}from"./room-type-FMBvSTWH.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{n(),i(),o=t(),{fn:s}=__STORYBOOK_MODULE_TEST__,c={title:`UI/Data display/RoomType`,component:a,parameters:{},argTypes:{roomType:{control:{type:`select`,labels:{[r.FormRoom]:`FormRoom`,[r.EditingRoom]:`EditingRoom`,[r.CustomRoom]:`CustomRoom`,[r.PublicRoom]:`PublicRoom`,[r.VirtualDataRoom]:`VirtualDataRoom`,[r.AIRoom]:`AIRoom`}},options:Object.values(r).filter(e=>typeof e==`number`),description:`Which room type the row describes. It picks the glyph, the title and the description; an unknown value leaves both lines empty`},isOpen:{control:`boolean`,description:`Draws the row as opened: on a dropdown button the border turns to the accent colour and the arrow points up instead of down. The other layouts look the same either way`},type:{control:`select`,options:[`listItem`,`dropdownButton`,`dropdownItem`],description:`Which layout to render: a bordered card with a forward arrow, the collapsed button of a dropdown with a down arrow, or a borderless entry with no arrow`,table:{defaultValue:{summary:`listItem`}}},id:{control:`text`,description:"`id` of the outer element"},selectedId:{control:`text`,description:"Written to the row's `data-selected-id` attribute and read by nothing else. Required all the same"},onClick:{action:`clicked`,description:`Called with the event when the row is clicked, once per click wherever inside the row it lands. A disabled row does not call it`},disabledFormRoom:{control:`boolean`,description:"Greys the row out while `roomType` is `FormRoom`, marks it `aria-disabled` and stops it calling `onClick`. The dropdown button ignores it",table:{defaultValue:{summary:`false`}}},disabledPublicRoom:{control:`boolean`,description:"Greys the row out while `roomType` is `PublicRoom`, marks it `aria-disabled` and stops it calling `onClick`. The dropdown button ignores it",table:{defaultValue:{summary:`false`}}},isTemplate:{control:`boolean`,description:'Replaces the title and the description with the "from template" wording, whatever `roomType` says, and switches the glyph to the template one',table:{defaultValue:{summary:`false`}}},isTemplateRoom:{control:`boolean`,description:"Switches the glyph to the template variant of `roomType` without touching the texts",table:{defaultValue:{summary:`false`}}},isFormSection:{control:`boolean`,description:"Uses the form-space wording for the title and the description instead of the room type's; with `isTemplate` it becomes the form-space template wording",table:{defaultValue:{summary:`false`}}}}},l={render:e=>(0,o.jsx)(a,{...e}),args:{roomType:r.EditingRoom,isOpen:!1,type:`listItem`,selectedId:`room-1`,onClick:s()},parameters:{docs:{description:{story:`A single card as it appears in a list of room types to choose from; pick another type or layout in the Controls panel below.`},source:{code:`<RoomType
  roomType={RoomsType.EditingRoom}
  isOpen={false}
  type="listItem"
  selectedId="room-1"
  onClick={handleClick}
/>`}}}},u={render:e=>(0,o.jsx)(a,{...e}),args:{roomType:r.PublicRoom,isOpen:!0,type:`dropdownButton`,selectedId:`room-2`,onClick:s()},parameters:{docs:{description:{story:"The collapsed button at the top of a picker, drawn open: the border takes the accent colour and the arrow points up (`isOpen`). Clear `isOpen` in the Controls panel to see it closed, arrow pointing down."},source:{code:`<RoomType
  roomType={RoomsType.PublicRoom}
  isOpen={true}
  type="dropdownButton"
  selectedId="room-2"
  onClick={handleClick}
/>`}}}},d={render:e=>(0,o.jsx)(a,{...e}),args:{roomType:r.CustomRoom,isOpen:!1,type:`dropdownItem`,selectedId:`room-3`,onClick:s()},parameters:{docs:{description:{story:`An entry inside the picker's dropdown: no border and no arrow, only a background on hover.`},source:{code:`<RoomType
  roomType={RoomsType.CustomRoom}
  isOpen={false}
  type="dropdownItem"
  selectedId="room-3"
  onClick={handleClick}
/>`}}}},f=e=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:[r.FormRoom,r.EditingRoom,r.PublicRoom,r.CustomRoom,r.VirtualDataRoom,r.AIRoom].map(t=>(0,o.jsx)(a,{...e,roomType:t,selectedId:t},t))}),p={render:e=>(0,o.jsx)(f,{...e}),args:{isOpen:!1,type:`listItem`,selectedId:``,onClick:s()},parameters:{docs:{description:{story:"Every room type the row can describe, each with its own glyph, name and description (`roomType`) — what a room-type picker lists."},source:{code:`{[
  RoomsType.FormRoom,
  RoomsType.EditingRoom,
  RoomsType.PublicRoom,
  RoomsType.CustomRoom,
  RoomsType.VirtualDataRoom,
  RoomsType.AIRoom,
].map((roomType) => (
  <RoomType
    key={roomType}
    roomType={roomType}
    isOpen={false}
    selectedId={roomType}
    onClick={() => onPick(roomType)}
  />
))}`}}}},m=e=>(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:[(0,o.jsx)(a,{...e,roomType:r.FormRoom,type:`listItem`,selectedId:`form-room`,disabledFormRoom:!0}),(0,o.jsx)(a,{...e,roomType:r.PublicRoom,type:`dropdownItem`,selectedId:`public-room`,disabledPublicRoom:!0})]}),h={render:e=>(0,o.jsx)(m,{...e}),args:{isOpen:!1,selectedId:``,onClick:s()},parameters:{docs:{description:{story:`Rows for a room type the user may not create right now, shown but refusing the click:

- **Form Filling Space** — a list card on a grey background, with no hover change and no pointer cursor (\`disabledFormRoom\`)
- **Public room** — a dropdown entry with its glyph and text faded (\`disabledPublicRoom\`)

Click either one: the Actions panel stays empty.`},source:{code:`<RoomType
  roomType={RoomsType.FormRoom}
  isOpen={false}
  selectedId="form-room"
  onClick={handleClick}
  disabledFormRoom
/>
<RoomType
  roomType={RoomsType.PublicRoom}
  type="dropdownItem"
  isOpen={false}
  selectedId="public-room"
  onClick={handleClick}
  disabledPublicRoom
/>`}}}},g=e=>(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:[(0,o.jsx)(a,{...e,roomType:r.EditingRoom,isTemplate:!0}),(0,o.jsx)(a,{...e,roomType:r.EditingRoom,isTemplateRoom:!0})]}),_={render:e=>(0,o.jsx)(g,{...e}),args:{isOpen:!1,type:`listItem`,selectedId:`room-1`,onClick:s()},parameters:{docs:{description:{story:"The two ways a template shows up in a picker:\n\n- **From template** — the entry that starts a room from a template: both lines take the template wording and the glyph its template form (`isTemplate`)\n- **Collaboration room** — a room type offered from a template: the glyph changes, the name and description stay (`isTemplateRoom`)"},source:{code:`<RoomType
  roomType={RoomsType.EditingRoom}
  isOpen={false}
  selectedId="room-1"
  onClick={handleClick}
  isTemplate
/>
<RoomType
  roomType={RoomsType.EditingRoom}
  isOpen={false}
  selectedId="room-1"
  onClick={handleClick}
  isTemplateRoom
/>`}}}},v={render:e=>(0,o.jsx)(a,{...e}),args:{roomType:r.FormRoom,isOpen:!1,type:`listItem`,selectedId:`form-space`,isFormSection:!0,onClick:s()},parameters:{docs:{description:{story:"The row worded for a form space rather than a room, for a picker opened from the forms section (`isFormSection`). Turn on `isTemplate` in the Controls panel below to see the form-space template wording."},source:{code:`<RoomType
  roomType={RoomsType.FormRoom}
  isOpen={false}
  selectedId="form-space"
  onClick={handleClick}
  isFormSection
/>`}}}},y={render:e=>(0,o.jsx)(`div`,{dir:`rtl`,children:(0,o.jsx)(a,{...e})}),globals:{direction:`rtl`},args:{roomType:r.EditingRoom,isOpen:!1,type:`listItem`,selectedId:`room-1`,onClick:s()},parameters:{noPadding:!0,docs:{story:{inline:!1,height:`96px`},description:{story:`The card in a right-to-left interface: the glyph moves to the right edge, the text aligns right and the forward arrow sits on the left, pointing left.`},source:{code:`<div dir="rtl">
  <RoomType
    roomType={RoomsType.EditingRoom}
    isOpen={false}
    selectedId="room-1"
    onClick={handleClick}
  />
</div>`}}}},b={render:()=>(0,o.jsx)(`div`,{style:{width:`320px`,"--room-type-item-bg":`#e6f3fb`,"--room-type-item-border":`#0082c9`,"--room-type-item-hover-bg":`#cde7f5`,"--room-type-item-radius":`12px`,"--room-type-item-padding":`12px`,"--room-type-description-color":`#0a5a8a`,"--room-type-gap":`20px`},children:(0,o.jsx)(a,{roomType:r.FormRoom,type:`listItem`,isOpen:!1,selectedId:`room-1`,onClick:s()})}),parameters:{docs:{description:{story:"Every overridable variable set on one card -- the variables are listed under CSS variables on this page. Hover it to see `--room-type-item-hover-bg`."},source:{code:`<div
  style={{
    "--room-type-item-bg": "#e6f3fb",
    "--room-type-item-border": "#0082c9",
    "--room-type-item-hover-bg": "#cde7f5",
    "--room-type-item-radius": "12px",
    "--room-type-item-padding": "12px",
    "--room-type-description-color": "#0a5a8a",
    "--room-type-gap": "20px",
  }}
>
  <RoomType
    roomType={RoomsType.FormRoom}
    isOpen={false}
    selectedId="room-1"
    onClick={handleClick}
  />
</div>`}}}},x=[`Default`,`DropdownButton`,`DropdownItem`,`RoomTypes`,`DisabledState`,`FromTemplate`,`FormSpace`,`RightToLeft`,`CssCustomization`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <RoomType {...args} />,
  args: {
    roomType: RoomsType.EditingRoom,
    isOpen: false,
    type: "listItem",
    selectedId: "room-1",
    onClick: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "A single card as it appears in a list of room types to choose from; pick another type or layout in the Controls panel below."
      },
      source: {
        code: \`<RoomType
  roomType={RoomsType.EditingRoom}
  isOpen={false}
  type="listItem"
  selectedId="room-1"
  onClick={handleClick}
/>\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <RoomType {...args} />,
  args: {
    roomType: RoomsType.PublicRoom,
    isOpen: true,
    type: "dropdownButton",
    selectedId: "room-2",
    onClick: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "The collapsed button at the top of a picker, drawn open: the border takes the accent colour and the arrow points up (\`isOpen\`). Clear \`isOpen\` in the Controls panel to see it closed, arrow pointing down."
      },
      source: {
        code: \`<RoomType
  roomType={RoomsType.PublicRoom}
  isOpen={true}
  type="dropdownButton"
  selectedId="room-2"
  onClick={handleClick}
/>\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <RoomType {...args} />,
  args: {
    roomType: RoomsType.CustomRoom,
    isOpen: false,
    type: "dropdownItem",
    selectedId: "room-3",
    onClick: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "An entry inside the picker's dropdown: no border and no arrow, only a background on hover."
      },
      source: {
        code: \`<RoomType
  roomType={RoomsType.CustomRoom}
  isOpen={false}
  type="dropdownItem"
  selectedId="room-3"
  onClick={handleClick}
/>\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <RoomTypesTemplate {...args} />,
  args: {
    isOpen: false,
    type: "listItem",
    selectedId: "",
    onClick: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "Every room type the row can describe, each with its own glyph, name and description (\`roomType\`) — what a room-type picker lists."
      },
      source: {
        code: \`{[
  RoomsType.FormRoom,
  RoomsType.EditingRoom,
  RoomsType.PublicRoom,
  RoomsType.CustomRoom,
  RoomsType.VirtualDataRoom,
  RoomsType.AIRoom,
].map((roomType) => (
  <RoomType
    key={roomType}
    roomType={roomType}
    isOpen={false}
    selectedId={roomType}
    onClick={() => onPick(roomType)}
  />
))}\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <DisabledStateTemplate {...args} />,
  args: {
    isOpen: false,
    selectedId: "",
    onClick: fn()
  },
  parameters: {
    docs: {
      description: {
        story: \`Rows for a room type the user may not create right now, shown but refusing the click:

- **Form Filling Space** — a list card on a grey background, with no hover change and no pointer cursor (\\\`disabledFormRoom\\\`)
- **Public room** — a dropdown entry with its glyph and text faded (\\\`disabledPublicRoom\\\`)

Click either one: the Actions panel stays empty.\`
      },
      source: {
        code: \`<RoomType
  roomType={RoomsType.FormRoom}
  isOpen={false}
  selectedId="form-room"
  onClick={handleClick}
  disabledFormRoom
/>
<RoomType
  roomType={RoomsType.PublicRoom}
  type="dropdownItem"
  isOpen={false}
  selectedId="public-room"
  onClick={handleClick}
  disabledPublicRoom
/>\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <FromTemplateTemplate {...args} />,
  args: {
    isOpen: false,
    type: "listItem",
    selectedId: "room-1",
    onClick: fn()
  },
  parameters: {
    docs: {
      description: {
        story: \`The two ways a template shows up in a picker:

- **From template** — the entry that starts a room from a template: both lines take the template wording and the glyph its template form (\\\`isTemplate\\\`)
- **Collaboration room** — a room type offered from a template: the glyph changes, the name and description stay (\\\`isTemplateRoom\\\`)\`
      },
      source: {
        code: \`<RoomType
  roomType={RoomsType.EditingRoom}
  isOpen={false}
  selectedId="room-1"
  onClick={handleClick}
  isTemplate
/>
<RoomType
  roomType={RoomsType.EditingRoom}
  isOpen={false}
  selectedId="room-1"
  onClick={handleClick}
  isTemplateRoom
/>\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <RoomType {...args} />,
  args: {
    roomType: RoomsType.FormRoom,
    isOpen: false,
    type: "listItem",
    selectedId: "form-space",
    isFormSection: true,
    onClick: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "The row worded for a form space rather than a room, for a picker opened from the forms section (\`isFormSection\`). Turn on \`isTemplate\` in the Controls panel below to see the form-space template wording."
      },
      source: {
        code: \`<RoomType
  roomType={RoomsType.FormRoom}
  isOpen={false}
  selectedId="form-space"
  onClick={handleClick}
  isFormSection
/>\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <RoomType {...args} />
    </div>,
  globals: {
    direction: "rtl"
  },
  args: {
    roomType: RoomsType.EditingRoom,
    isOpen: false,
    type: "listItem",
    selectedId: "room-1",
    onClick: fn()
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, because an inline RTL story flips the whole Docs page.
      story: {
        inline: false,
        height: "96px"
      },
      description: {
        story: "The card in a right-to-left interface: the glyph moves to the right edge, the text aligns right and the forward arrow sits on the left, pointing left."
      },
      source: {
        code: \`<div dir="rtl">
  <RoomType
    roomType={RoomsType.EditingRoom}
    isOpen={false}
    selectedId="room-1"
    onClick={handleClick}
  />
</div>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: "320px",
    "--room-type-item-bg": "#e6f3fb",
    "--room-type-item-border": "#0082c9",
    "--room-type-item-hover-bg": "#cde7f5",
    "--room-type-item-radius": "12px",
    "--room-type-item-padding": "12px",
    "--room-type-description-color": "#0a5a8a",
    "--room-type-gap": "20px"
  } as CSSProperties}>
      <RoomType roomType={RoomsType.FormRoom} type="listItem" isOpen={false} selectedId="room-1" onClick={fn()} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one card -- the variables are listed under CSS variables on this page. Hover it to see \\\`--room-type-item-hover-bg\\\`.\`
      },
      source: {
        code: \`<div
  style={{
    "--room-type-item-bg": "#e6f3fb",
    "--room-type-item-border": "#0082c9",
    "--room-type-item-hover-bg": "#cde7f5",
    "--room-type-item-radius": "12px",
    "--room-type-item-padding": "12px",
    "--room-type-description-color": "#0a5a8a",
    "--room-type-gap": "20px",
  }}
>
  <RoomType
    roomType={RoomsType.FormRoom}
    isOpen={false}
    selectedId="room-1"
    onClick={handleClick}
  />
</div>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}}})))()}S();export{b as CssCustomization,l as Default,h as DisabledState,u as DropdownButton,d as DropdownItem,v as FormSpace,_ as FromTemplate,y as RightToLeft,p as RoomTypes,x as __namedExportsOrder,c as default};