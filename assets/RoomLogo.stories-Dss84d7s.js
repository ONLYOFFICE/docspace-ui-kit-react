import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{S as n,g as r}from"./enums-DzcBu485.js";import{n as i,r as a}from"./RoomLogo-DaQRKLJb.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{n(),a(),o=t(),{fn:s}=__STORYBOOK_MODULE_TEST__,c={title:`UI/Data display/RoomLogo`,component:i,parameters:{layout:`centered`},argTypes:{type:{control:`select`,options:Object.values(r).filter(e=>typeof e==`number`),description:`Which room type's glyph to draw. A missing or unknown value draws nothing and leaves a blank box of the logo's size`,table:{defaultValue:{summary:`undefined`}}},isArchive:{control:`boolean`,description:`Draws the archive glyph instead of the type's glyph; wins over every other flag`,table:{defaultValue:{summary:`false`}}},isTemplate:{control:`boolean`,description:"Draws the generic template glyph, the same for every type; ignored when `isArchive` is set",table:{defaultValue:{summary:`false`}}},isTemplateRoom:{control:`boolean`,description:`Draws the template variant of the type's glyph; the AI type has none and keeps its plain glyph`,table:{defaultValue:{summary:`false`}}},withCheckbox:{control:`boolean`,description:`Renders a checkbox beside the glyph. The component's own stylesheet hides it, so it shows only under a rule of yours`,table:{defaultValue:{summary:`false`}}},isChecked:{control:`boolean`,description:`Whether that checkbox is ticked`,table:{defaultValue:{summary:`false`}}},isIndeterminate:{control:`boolean`,description:`Whether that checkbox shows the mixed state (a dash) instead of a tick`,table:{defaultValue:{summary:`false`}}},onChange:{action:`changed`,description:`Called when the checkbox is clicked, and when the glyph is tapped on a mobile device; a click on the glyph on desktop does nothing`},isPrivacy:{control:!1,description:`Accepted but ignored: nothing in the component reads it`},id:{control:`text`,description:"`id` of the outer element"},className:{control:`text`,description:`Class added to the outer element, before its own classes`},style:{control:`object`,description:`Inline style of the outer element`}}},l=e=>(0,o.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(100px, 1fr))`,gridGap:`16px`,alignItems:`center`},children:e.children}),u=e=>(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:`8px`},children:[e.children,(0,o.jsx)(`span`,{style:{fontSize:`12px`,color:`#666`},children:e.label})]}),d={render:e=>(0,o.jsx)(i,{...e}),args:{type:r.CustomRoom,isArchive:!1,withCheckbox:!1,isChecked:!1,isIndeterminate:!1,onChange:s()},parameters:{docs:{description:{story:`The glyph of one room type at its standard size; pick another type or turn on a flag in the Controls panel below to see which glyph wins.`},source:{code:`<RoomLogo type={RoomsType.CustomRoom} />`}}}},f=()=>{let e=[{type:r.EditingRoom,label:`Editing`},{type:r.CustomRoom,label:`Custom`},{type:r.PublicRoom,label:`Public`},{type:r.VirtualDataRoom,label:`Virtual Data`},{type:r.FormRoom,label:`Form`},{type:r.AIRoom,label:`AI`}];return(0,o.jsx)(l,{children:e.map(({type:e,label:t})=>(0,o.jsx)(u,{label:t,children:(0,o.jsx)(i,{type:e})},t))})},p={render:()=>(0,o.jsx)(f,{}),parameters:{docs:{description:{story:`Every room type side by side, labelled by type, to pick the glyph a list or a header needs for each kind of room.`},source:{code:`<RoomLogo type={RoomsType.EditingRoom} />
<RoomLogo type={RoomsType.CustomRoom} />
<RoomLogo type={RoomsType.PublicRoom} />
<RoomLogo type={RoomsType.VirtualDataRoom} />
<RoomLogo type={RoomsType.FormRoom} />
<RoomLogo type={RoomsType.AIRoom} />`}}}},m={render:e=>(0,o.jsx)(i,{...e}),args:{type:r.CustomRoom,isArchive:!0},parameters:{docs:{description:{story:"An archived room keeps one glyph whatever its type (`isArchive`), so a reader tells archived rooms apart from active ones at a glance."},source:{code:`<RoomLogo type={RoomsType.CustomRoom} isArchive />`}}}},h=()=>{let e=[{type:r.EditingRoom,label:`Editing`},{type:r.CustomRoom,label:`Custom`},{type:r.PublicRoom,label:`Public`},{type:r.VirtualDataRoom,label:`Virtual Data`},{type:r.FormRoom,label:`Form`},{type:r.AIRoom,label:`AI`}];return(0,o.jsx)(l,{children:e.map(({type:e,label:t})=>(0,o.jsx)(u,{label:t,children:(0,o.jsx)(i,{type:e,isTemplateRoom:!0})},t))})},g={render:()=>(0,o.jsx)(h,{}),parameters:{docs:{description:{story:"A template made from a room shows the template variant of that room's glyph (`isTemplateRoom`), so it still says which kind of room it creates. **AI** has no variant and keeps its plain glyph."},source:{code:`<RoomLogo type={RoomsType.EditingRoom} isTemplateRoom />
<RoomLogo type={RoomsType.CustomRoom} isTemplateRoom />
<RoomLogo type={RoomsType.PublicRoom} isTemplateRoom />
<RoomLogo type={RoomsType.VirtualDataRoom} isTemplateRoom />
<RoomLogo type={RoomsType.FormRoom} isTemplateRoom />
<RoomLogo type={RoomsType.AIRoom} isTemplateRoom />`}}}},_={render:e=>(0,o.jsx)(i,{...e}),args:{type:r.CustomRoom,isTemplate:!0},parameters:{docs:{description:{story:"One template glyph for every type (`isTemplate`), for a place that lists templates without telling their room types apart; the `type` set here is ignored."},source:{code:`<RoomLogo type={RoomsType.CustomRoom} isTemplate />`}}}},v=`.room-logo-selectable .room-logo_icon-container { display: none; }
.room-logo-selectable .room-logo_checkbox { display: flex; margin: 0; }`,y=e=>(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`style`,{children:v}),(0,o.jsx)(i,{...e,className:`room-logo-selectable`})]}),b={render:e=>(0,o.jsx)(y,{...e}),args:{type:r.EditingRoom,withCheckbox:!0,isChecked:!1,isIndeterminate:!1,onChange:s()},parameters:{docs:{description:{story:"A row in selection mode swaps the glyph for a checkbox in the same box (`withCheckbox`). The component renders the checkbox hidden, so the story adds the rule that swaps them, as a host must; tick it, or set the mixed state in the Controls panel below."},source:{code:`/* host stylesheet */
.selectable .room-logo_icon-container { display: none; }
.selectable .room-logo_checkbox { display: flex; margin: 0; }

<RoomLogo
  className="selectable"
  type={RoomsType.EditingRoom}
  withCheckbox
  isChecked={false}
  onChange={handleChange}
/>`}}}},x={render:e=>(0,o.jsx)(y,{...e}),args:{type:r.EditingRoom,withCheckbox:!0,isChecked:!0,onChange:s()},parameters:{docs:{description:{story:"A selected row keeps its checkbox ticked (`isChecked`), with the same host rule revealing it as in the story above."},source:{code:`<RoomLogo
  className="selectable"
  type={RoomsType.EditingRoom}
  withCheckbox
  isChecked
  onChange={handleChange}
/>`}}}},S={render:()=>(0,o.jsx)(`div`,{style:{"--room-logo-size":`40px`,"--room-logo-radius":`50%`},children:(0,o.jsx)(i,{type:r.FormRoom})}),parameters:{docs:{description:{story:`Both variables set on one wrapper -- the variables are listed under CSS variables on this page. The example draws a 40px box with a round glyph.`},source:{code:`<div style={{ "--room-logo-size": "40px", "--room-logo-radius": "50%" }}>
  <RoomLogo type={RoomsType.FormRoom} />
</div>`}}}},C=[`Default`,`AllRoomTypes`,`ArchiveState`,`TemplateRoomTypes`,`TemplateState`,`WithCheckbox`,`CheckboxChecked`,`CssCustomization`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <RoomLogoPure {...args} />,
  args: {
    type: RoomsType.CustomRoom,
    isArchive: false,
    withCheckbox: false,
    isChecked: false,
    isIndeterminate: false,
    onChange: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "The glyph of one room type at its standard size; pick another type or turn on a flag in the Controls panel below to see which glyph wins."
      },
      source: {
        code: \`<RoomLogo type={RoomsType.CustomRoom} />\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <AllRoomTypesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Every room type side by side, labelled by type, to pick the glyph a list or a header needs for each kind of room."
      },
      source: {
        code: \`<RoomLogo type={RoomsType.EditingRoom} />
<RoomLogo type={RoomsType.CustomRoom} />
<RoomLogo type={RoomsType.PublicRoom} />
<RoomLogo type={RoomsType.VirtualDataRoom} />
<RoomLogo type={RoomsType.FormRoom} />
<RoomLogo type={RoomsType.AIRoom} />\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <RoomLogoPure {...args} />,
  args: {
    type: RoomsType.CustomRoom,
    isArchive: true
  },
  parameters: {
    docs: {
      description: {
        story: "An archived room keeps one glyph whatever its type (\`isArchive\`), so a reader tells archived rooms apart from active ones at a glance."
      },
      source: {
        code: \`<RoomLogo type={RoomsType.CustomRoom} isArchive />\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <TemplateRoomTypesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "A template made from a room shows the template variant of that room's glyph (\`isTemplateRoom\`), so it still says which kind of room it creates. **AI** has no variant and keeps its plain glyph."
      },
      source: {
        code: \`<RoomLogo type={RoomsType.EditingRoom} isTemplateRoom />
<RoomLogo type={RoomsType.CustomRoom} isTemplateRoom />
<RoomLogo type={RoomsType.PublicRoom} isTemplateRoom />
<RoomLogo type={RoomsType.VirtualDataRoom} isTemplateRoom />
<RoomLogo type={RoomsType.FormRoom} isTemplateRoom />
<RoomLogo type={RoomsType.AIRoom} isTemplateRoom />\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <RoomLogoPure {...args} />,
  args: {
    type: RoomsType.CustomRoom,
    isTemplate: true
  },
  parameters: {
    docs: {
      description: {
        story: "One template glyph for every type (\`isTemplate\`), for a place that lists templates without telling their room types apart; the \`type\` set here is ignored."
      },
      source: {
        code: \`<RoomLogo type={RoomsType.CustomRoom} isTemplate />\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <SelectableTemplate {...args} />,
  args: {
    type: RoomsType.EditingRoom,
    withCheckbox: true,
    isChecked: false,
    isIndeterminate: false,
    onChange: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "A row in selection mode swaps the glyph for a checkbox in the same box (\`withCheckbox\`). The component renders the checkbox hidden, so the story adds the rule that swaps them, as a host must; tick it, or set the mixed state in the Controls panel below."
      },
      source: {
        code: \`/* host stylesheet */
.selectable .room-logo_icon-container { display: none; }
.selectable .room-logo_checkbox { display: flex; margin: 0; }

<RoomLogo
  className="selectable"
  type={RoomsType.EditingRoom}
  withCheckbox
  isChecked={false}
  onChange={handleChange}
/>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <SelectableTemplate {...args} />,
  args: {
    type: RoomsType.EditingRoom,
    withCheckbox: true,
    isChecked: true,
    onChange: fn()
  },
  parameters: {
    docs: {
      description: {
        story: "A selected row keeps its checkbox ticked (\`isChecked\`), with the same host rule revealing it as in the story above."
      },
      source: {
        code: \`<RoomLogo
  className="selectable"
  type={RoomsType.EditingRoom}
  withCheckbox
  isChecked
  onChange={handleChange}
/>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--room-logo-size": "40px",
    "--room-logo-radius": "50%"
  } as CSSProperties}>
      <RoomLogoPure type={RoomsType.FormRoom} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Both variables set on one wrapper -- the variables are listed under CSS variables on this page. The example draws a 40px box with a round glyph.\`
      },
      source: {
        code: \`<div style={{ "--room-logo-size": "40px", "--room-logo-radius": "50%" }}>
  <RoomLogo type={RoomsType.FormRoom} />
</div>\`
      }
    }
  }
}`,...S.parameters?.docs?.source}}}})))()}w();export{p as AllRoomTypes,m as ArchiveState,x as CheckboxChecked,S as CssCustomization,d as Default,g as TemplateRoomTypes,_ as TemplateState,b as WithCheckbox,C as __namedExportsOrder,c as default};