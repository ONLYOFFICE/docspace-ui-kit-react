import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./circle-D5CX68se.js";var i,a,o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{n(),i=t(),a={title:`UI/Skeletons/Circle`,component:r,argTypes:{radius:{control:`text`,description:`Radius of the circle, in user units. It sizes the circle only, not the element around it`,table:{defaultValue:{summary:`12`}}},x:{control:`text`,description:"Horizontal position of the circle's centre, in user units. A value smaller than `radius` cuts off the circle's left side, which the default does",table:{defaultValue:{summary:`3`}}},y:{control:`text`,description:"Vertical position of the circle's centre, in user units. A value smaller than `radius` cuts off the circle's top",table:{defaultValue:{summary:`12`}}},width:{control:`text`,description:`Width of the SVG element. The default fills the parent's width`,table:{defaultValue:{summary:`100%`}}},height:{control:`text`,description:`Height of the SVG element. The default fills the parent's height, and shrinks to nothing in a parent without one`,table:{defaultValue:{summary:`100%`}}},title:{control:`text`,description:`Accessible name of the placeholder, read by screen readers and shown as the browser's tooltip on hover. Empty by default, which leaves the placeholder unnamed`,table:{defaultValue:{summary:`""`}}},backgroundColor:{control:`color`,description:`Colour of the circle at rest. Black by default in every theme`,table:{defaultValue:{summary:`#000`}}},foregroundColor:{control:`color`,description:`Colour of the lighter band that sweeps across the circle`,table:{defaultValue:{summary:`#000`}}},backgroundOpacity:{control:{type:`range`,min:0,max:1,step:.1},description:`Opacity of the resting colour`,table:{defaultValue:{summary:`0.1`}}},foregroundOpacity:{control:{type:`range`,min:0,max:1,step:.1},description:`Opacity of the sweeping band's colour`,table:{defaultValue:{summary:`0.15`}}},speed:{control:{type:`range`,min:.5,max:3,step:.1},description:`Duration of one sweep, in seconds: a larger value moves the band more slowly`,table:{defaultValue:{summary:`2`}}},animate:{control:`boolean`,description:`Whether the band sweeps at all. Off, the circle is a still shape`,table:{defaultValue:{summary:`true`}}},className:{control:`text`,description:`Class name added to the SVG element`},style:{control:`object`,description:`Inline style applied to the SVG element`}},parameters:{}},o={render:e=>(0,i.jsx)(r,{...e}),args:{width:`50`,height:`50`,radius:`20`,x:`25`,y:`25`},parameters:{docs:{description:{story:`A circle of radius 20 centred in a 50 by 50 box — the radius, the centre and the box size are set together, because the component's own defaults cut the circle off. Change any prop live in the Controls panel below.`},source:{code:`<CircleSkeleton width="50" height="50" radius="20" x="25" y="25" />`}}}},s={render:e=>(0,i.jsx)(r,{...e}),args:{width:`32`,height:`32`,radius:`16`,x:`16`,y:`16`},parameters:{docs:{description:{story:`Small avatar-sized circle skeleton, suitable for compact user avatars.`},source:{code:`<CircleSkeleton width="32" height="32" radius="16" x="16" y="16" />`}}}},c={render:e=>(0,i.jsx)(r,{...e}),args:{width:`80`,height:`80`,radius:`40`,x:`40`,y:`40`},parameters:{docs:{description:{story:`Large avatar-sized circle skeleton, suitable for profile images.`},source:{code:`<CircleSkeleton width="80" height="80" radius="40" x="40" y="40" />`}}}},l={render:e=>(0,i.jsx)(r,{...e}),args:{width:`50`,height:`50`,radius:`20`,x:`25`,y:`25`,backgroundColor:`#e0e0e0`,foregroundColor:`#f5f5f5`,backgroundOpacity:.8,foregroundOpacity:.4},parameters:{docs:{description:{story:"A light grey circle for a surface where the default black at low opacity is too faint or the wrong tone, such as a dark one (`backgroundColor`, `foregroundColor` and their opacities)."},source:{code:`<CircleSkeleton
  width="50"
  height="50"
  radius="20"
  x="25"
  y="25"
  backgroundColor="#e0e0e0"
  foregroundColor="#f5f5f5"
  backgroundOpacity={0.8}
  foregroundOpacity={0.4}
/>`}}}},u={render:e=>(0,i.jsx)(r,{...e}),args:{width:`50`,height:`50`,radius:`20`,x:`25`,y:`25`,animate:!1},parameters:{docs:{description:{story:"A still circle with no sweeping band, for a page that must not animate or a reader who asked for reduced motion (`animate`)."},source:{code:`<CircleSkeleton width="50" height="50" radius="20" x="25" y="25" animate={false} />`}}}},d={render:e=>(0,i.jsx)(r,{...e}),args:{width:`50`,height:`50`,radius:`20`,x:`25`,y:`25`,speed:2.5},parameters:{docs:{description:{story:"The band takes 2.5 seconds per sweep instead of 2, for a calmer placeholder on a page that waits longer (`speed`)."},source:{code:`<CircleSkeleton width="50" height="50" radius="20" x="25" y="25" speed={2.5} />`}}}},f={render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[(0,i.jsx)(r,{width:`40`,height:`40`,radius:`20`,x:`20`,y:`20`}),(0,i.jsx)(r,{width:`40`,height:`40`,radius:`20`,x:`20`,y:`20`}),(0,i.jsx)(r,{width:`40`,height:`40`,radius:`20`,x:`20`,y:`20`}),(0,i.jsx)(r,{width:`40`,height:`40`,radius:`20`,x:`20`,y:`20`})]}),parameters:{docs:{description:{story:`Multiple circle skeletons arranged in a row, simulating an avatar group placeholder.`},source:{code:`<div style={{ display: "flex", gap: "8px" }}>
  <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
  <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
  <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
  <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
</div>`}}}},p={render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,gap:`16px`,alignItems:`center`},children:[(0,i.jsx)(r,{width:`40`,height:`40`,radius:`20`,x:`20`,y:`20`,backgroundColor:`#0082c9`,foregroundColor:`#cce5f6`,backgroundOpacity:.15,foregroundOpacity:.3}),(0,i.jsx)(r,{width:`56`,height:`56`,radius:`28`,x:`28`,y:`28`,backgroundColor:`#0082c9`,foregroundColor:`#cce5f6`,backgroundOpacity:.15,foregroundOpacity:.3}),(0,i.jsx)(r,{width:`80`,height:`80`,radius:`40`,x:`40`,y:`40`,backgroundColor:`#0082c9`,foregroundColor:`#cce5f6`,backgroundOpacity:.15,foregroundOpacity:.3})]}),parameters:{docs:{description:{story:`The component reads no CSS custom property -- see the behaviour notes on this page; its colours come from props. All three circles here set the same four props, at three sizes.`},source:{code:`<CircleSkeleton
  width="40"
  height="40"
  radius="20"
  x="20"
  y="20"
  backgroundColor="#0082c9"
  foregroundColor="#cce5f6"
  backgroundOpacity={0.15}
  foregroundOpacity={0.3}
/>`}}}},m=[`Default`,`SmallAvatar`,`LargeAvatar`,`CustomColors`,`NoAnimation`,`SlowAnimation`,`AvatarGroup`,`CssCustomization`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <CircleSkeleton {...args} />,
  args: {
    width: "50",
    height: "50",
    radius: "20",
    x: "25",
    y: "25"
  },
  parameters: {
    docs: {
      description: {
        story: "A circle of radius 20 centred in a 50 by 50 box — the radius, the centre and the box size are set together, because the component's own defaults cut the circle off. Change any prop live in the Controls panel below."
      },
      source: {
        code: \`<CircleSkeleton width="50" height="50" radius="20" x="25" y="25" />\`
      }
    }
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <CircleSkeleton {...args} />,
  args: {
    width: "32",
    height: "32",
    radius: "16",
    x: "16",
    y: "16"
  },
  parameters: {
    docs: {
      description: {
        story: "Small avatar-sized circle skeleton, suitable for compact user avatars."
      },
      source: {
        code: \`<CircleSkeleton width="32" height="32" radius="16" x="16" y="16" />\`
      }
    }
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <CircleSkeleton {...args} />,
  args: {
    width: "80",
    height: "80",
    radius: "40",
    x: "40",
    y: "40"
  },
  parameters: {
    docs: {
      description: {
        story: "Large avatar-sized circle skeleton, suitable for profile images."
      },
      source: {
        code: \`<CircleSkeleton width="80" height="80" radius="40" x="40" y="40" />\`
      }
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <CircleSkeleton {...args} />,
  args: {
    width: "50",
    height: "50",
    radius: "20",
    x: "25",
    y: "25",
    backgroundColor: "#e0e0e0",
    foregroundColor: "#f5f5f5",
    backgroundOpacity: 0.8,
    foregroundOpacity: 0.4
  },
  parameters: {
    docs: {
      description: {
        story: "A light grey circle for a surface where the default black at low opacity is too faint or the wrong tone, such as a dark one (\`backgroundColor\`, \`foregroundColor\` and their opacities)."
      },
      source: {
        code: \`<CircleSkeleton
  width="50"
  height="50"
  radius="20"
  x="25"
  y="25"
  backgroundColor="#e0e0e0"
  foregroundColor="#f5f5f5"
  backgroundOpacity={0.8}
  foregroundOpacity={0.4}
/>\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <CircleSkeleton {...args} />,
  args: {
    width: "50",
    height: "50",
    radius: "20",
    x: "25",
    y: "25",
    animate: false
  },
  parameters: {
    docs: {
      description: {
        story: "A still circle with no sweeping band, for a page that must not animate or a reader who asked for reduced motion (\`animate\`)."
      },
      source: {
        code: \`<CircleSkeleton width="50" height="50" radius="20" x="25" y="25" animate={false} />\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <CircleSkeleton {...args} />,
  args: {
    width: "50",
    height: "50",
    radius: "20",
    x: "25",
    y: "25",
    speed: 2.5
  },
  parameters: {
    docs: {
      description: {
        story: "The band takes 2.5 seconds per sweep instead of 2, for a calmer placeholder on a page that waits longer (\`speed\`)."
      },
      source: {
        code: \`<CircleSkeleton width="50" height="50" radius="20" x="25" y="25" speed={2.5} />\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: "8px"
  }}>
      <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
      <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
      <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
      <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Multiple circle skeletons arranged in a row, simulating an avatar group placeholder."
      },
      source: {
        code: \`<div style={{ display: "flex", gap: "8px" }}>
  <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
  <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
  <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
  <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
</div>\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: "16px",
    alignItems: "center"
  }}>
      <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" backgroundColor="#0082c9" foregroundColor="#cce5f6" backgroundOpacity={0.15} foregroundOpacity={0.3} />
      <CircleSkeleton width="56" height="56" radius="28" x="28" y="28" backgroundColor="#0082c9" foregroundColor="#cce5f6" backgroundOpacity={0.15} foregroundOpacity={0.3} />
      <CircleSkeleton width="80" height="80" radius="40" x="40" y="40" backgroundColor="#0082c9" foregroundColor="#cce5f6" backgroundOpacity={0.15} foregroundOpacity={0.3} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`The component reads no CSS custom property -- see the behaviour notes on this page; its colours come from props. All three circles here set the same four props, at three sizes.\`
      },
      source: {
        code: \`<CircleSkeleton
  width="40"
  height="40"
  radius="20"
  x="20"
  y="20"
  backgroundColor="#0082c9"
  foregroundColor="#cce5f6"
  backgroundOpacity={0.15}
  foregroundOpacity={0.3}
/>\`
      }
    }
  }
}`,...p.parameters?.docs?.source}}}})))()}h();export{f as AvatarGroup,p as CssCustomization,l as CustomColors,o as Default,c as LargeAvatar,u as NoAnimation,d as SlowAnimation,s as SmallAvatar,m as __namedExportsOrder,a as default};