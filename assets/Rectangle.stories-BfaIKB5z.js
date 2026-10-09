import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./rectangle-u0BLVlZy.js";var i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),i=t(),a={title:`UI/Skeletons/Rectangle`,component:r,argTypes:{width:{control:`text`,description:`Width of the SVG element and of the rectangle drawn in it. The default fills the parent's width`,table:{defaultValue:{summary:`100%`}}},height:{control:`text`,description:`Height of the SVG element and of the rectangle drawn in it. A percentage needs a parent with a height, or the skeleton collapses`,table:{defaultValue:{summary:`32px`}}},x:{control:`text`,description:`Left edge of the rectangle inside the SVG, in pixels. A value above zero cuts off the rectangle's right side, since the rectangle keeps the full width`,table:{defaultValue:{summary:`0`}}},y:{control:`text`,description:`Top edge of the rectangle inside the SVG, in pixels. A value above zero cuts off the rectangle's bottom, since the rectangle keeps the full height`,table:{defaultValue:{summary:`0`}}},borderRadius:{control:`text`,description:`Corner radius of the rectangle, in pixels or as a percentage of the element's width; 50% on a square gives a circle`,table:{defaultValue:{summary:`3`}}},backgroundColor:{control:`color`,description:`Colour of the rectangle at rest. Black by default in every theme`,table:{defaultValue:{summary:`#000`}}},foregroundColor:{control:`color`,description:`Colour of the lighter band that sweeps across the rectangle`,table:{defaultValue:{summary:`#000`}}},backgroundOpacity:{control:{type:`range`,min:0,max:1,step:.1},description:`Opacity of the resting colour`,table:{defaultValue:{summary:`0.1`}}},foregroundOpacity:{control:{type:`range`,min:0,max:1,step:.1},description:`Opacity of the sweeping band's colour`,table:{defaultValue:{summary:`0.15`}}},speed:{control:{type:`range`,min:.5,max:3,step:.1},description:`Duration of one sweep, in seconds: a larger value moves the band more slowly`,table:{defaultValue:{summary:`2`}}},animate:{control:`boolean`,description:`Whether the band sweeps at all. Off, the rectangle is a still shape`,table:{defaultValue:{summary:`true`}}},title:{control:`text`,description:`Accessible name of the placeholder, read by screen readers and shown as the browser's tooltip on hover. Empty by default, which leaves the placeholder unnamed`,table:{defaultValue:{summary:`""`}}},uniqueKey:{control:`text`,description:`Fixed id for the SVG's internal gradient and clip path, so server and client render the same markup. Generated per instance when left out`},className:{control:`text`,description:`Class name added to the SVG element`},style:{control:`object`,description:`Inline style applied to the SVG element`}},parameters:{}},o={render:e=>(0,i.jsx)(r,{...e}),args:{width:`200px`,height:`100px`},parameters:{docs:{description:{story:`A single placeholder with slightly rounded corners and the sweeping band; change any prop live in the Controls panel below.`},source:{code:`<RectangleSkeleton width="200px" height="100px" />`}}}},s={render:e=>(0,i.jsx)(r,{...e}),args:{width:`40px`,height:`40px`,borderRadius:`50%`},parameters:{docs:{description:{story:"A square with half its width as the corner radius turns into a circle (`borderRadius`), for an avatar placeholder that keeps the SSR-safe ids `CircleSkeleton` lacks."},source:{code:`<RectangleSkeleton width="40px" height="40px" borderRadius="50%" />`}}}},c={render:e=>(0,i.jsx)(r,{...e}),args:{width:`200px`,height:`100px`,backgroundColor:`#e0e0e0`,foregroundColor:`#f5f5f5`,backgroundOpacity:.8,foregroundOpacity:.4},parameters:{docs:{description:{story:"A light grey rectangle with a paler band, for a surface where the default black at low opacity does not read, such as a dark theme (`backgroundColor`, `foregroundColor` and their opacities)."},source:{code:`<RectangleSkeleton
  width="200px"
  height="100px"
  backgroundColor="#e0e0e0"
  foregroundColor="#f5f5f5"
  backgroundOpacity={0.8}
  foregroundOpacity={0.4}
/>`}}}},l={render:e=>(0,i.jsx)(r,{...e}),args:{width:`200px`,height:`100px`,animate:!1},parameters:{docs:{description:{story:"The same rectangle without the sweep, for a page that must not animate, such as one shown to a user who asked for reduced motion (`animate`)."},source:{code:`<RectangleSkeleton width="200px" height="100px" animate={false} />`}}}},u={render:e=>(0,i.jsx)(r,{...e}),args:{width:`200px`,height:`100px`,speed:2.5},parameters:{docs:{description:{story:"The band takes two and a half seconds to cross instead of two, a calmer pace for a large area (`speed`)."},source:{code:`<RectangleSkeleton width="200px" height="100px" speed={2.5} />`}}}},d={render:()=>(0,i.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(3, 1fr)`,gap:`16px`},children:[(0,i.jsx)(r,{width:`100%`,height:`100px`}),(0,i.jsx)(r,{width:`100%`,height:`100px`}),(0,i.jsx)(r,{width:`100%`,height:`100px`}),(0,i.jsx)(r,{width:`100%`,height:`100px`}),(0,i.jsx)(r,{width:`100%`,height:`100px`}),(0,i.jsx)(r,{width:`100%`,height:`100px`})]}),parameters:{docs:{description:{story:`Six placeholders filling a three-column grid, each 100% of its cell's width, as a card grid shows while its items load.`},source:{code:`<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
</div>`}}}},f={render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`},children:[(0,i.jsx)(r,{width:`280px`,height:`40px`,borderRadius:`20px`,backgroundColor:`#0082c9`,foregroundColor:`#cce5f6`,backgroundOpacity:.15,foregroundOpacity:.3}),(0,i.jsx)(r,{width:`200px`,height:`40px`,borderRadius:`20px`,backgroundColor:`#0082c9`,foregroundColor:`#cce5f6`,backgroundOpacity:.15,foregroundOpacity:.3}),(0,i.jsx)(r,{width:`160px`,height:`40px`,borderRadius:`20px`,backgroundColor:`#0082c9`,foregroundColor:`#cce5f6`,backgroundOpacity:.15,foregroundOpacity:.3})]}),parameters:{docs:{description:{story:'There are no CSS variables to list on this page: the component reads none, as "Behaviour the types don\'t state" explains, so this example styles three pills of different widths with the same five props: `backgroundColor`, `foregroundColor`, their opacities and `borderRadius`.'},source:{code:`<RectangleSkeleton
  width="280px"
  height="40px"
  borderRadius="20px"
  backgroundColor="#0082c9"
  foregroundColor="#cce5f6"
  backgroundOpacity={0.15}
  foregroundOpacity={0.3}
/>`}}}},p=[`Default`,`SmallCircle`,`CustomColors`,`NoAnimation`,`SlowAnimation`,`Grid`,`CssCustomization`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <RectangleSkeleton {...args} />,
  args: {
    width: "200px",
    height: "100px"
  },
  parameters: {
    docs: {
      description: {
        story: "A single placeholder with slightly rounded corners and the sweeping band; change any prop live in the Controls panel below."
      },
      source: {
        code: \`<RectangleSkeleton width="200px" height="100px" />\`
      }
    }
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <RectangleSkeleton {...args} />,
  args: {
    width: "40px",
    height: "40px",
    borderRadius: "50%"
  },
  parameters: {
    docs: {
      description: {
        story: "A square with half its width as the corner radius turns into a circle (\`borderRadius\`), for an avatar placeholder that keeps the SSR-safe ids \`CircleSkeleton\` lacks."
      },
      source: {
        code: \`<RectangleSkeleton width="40px" height="40px" borderRadius="50%" />\`
      }
    }
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <RectangleSkeleton {...args} />,
  args: {
    width: "200px",
    height: "100px",
    backgroundColor: "#e0e0e0",
    foregroundColor: "#f5f5f5",
    backgroundOpacity: 0.8,
    foregroundOpacity: 0.4
  },
  parameters: {
    docs: {
      description: {
        story: "A light grey rectangle with a paler band, for a surface where the default black at low opacity does not read, such as a dark theme (\`backgroundColor\`, \`foregroundColor\` and their opacities)."
      },
      source: {
        code: \`<RectangleSkeleton
  width="200px"
  height="100px"
  backgroundColor="#e0e0e0"
  foregroundColor="#f5f5f5"
  backgroundOpacity={0.8}
  foregroundOpacity={0.4}
/>\`
      }
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <RectangleSkeleton {...args} />,
  args: {
    width: "200px",
    height: "100px",
    animate: false
  },
  parameters: {
    docs: {
      description: {
        story: "The same rectangle without the sweep, for a page that must not animate, such as one shown to a user who asked for reduced motion (\`animate\`)."
      },
      source: {
        code: \`<RectangleSkeleton width="200px" height="100px" animate={false} />\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <RectangleSkeleton {...args} />,
  args: {
    width: "200px",
    height: "100px",
    speed: 2.5
  },
  parameters: {
    docs: {
      description: {
        story: "The band takes two and a half seconds to cross instead of two, a calmer pace for a large area (\`speed\`)."
      },
      source: {
        code: \`<RectangleSkeleton width="200px" height="100px" speed={2.5} />\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px"
  }}>
      <RectangleSkeleton width="100%" height="100px" />
      <RectangleSkeleton width="100%" height="100px" />
      <RectangleSkeleton width="100%" height="100px" />
      <RectangleSkeleton width="100%" height="100px" />
      <RectangleSkeleton width="100%" height="100px" />
      <RectangleSkeleton width="100%" height="100px" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Six placeholders filling a three-column grid, each 100% of its cell's width, as a card grid shows while its items load."
      },
      source: {
        code: \`<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
</div>\`
      }
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  }}>
      <RectangleSkeleton width="280px" height="40px" borderRadius="20px" backgroundColor="#0082c9" foregroundColor="#cce5f6" backgroundOpacity={0.15} foregroundOpacity={0.3} />
      <RectangleSkeleton width="200px" height="40px" borderRadius="20px" backgroundColor="#0082c9" foregroundColor="#cce5f6" backgroundOpacity={0.15} foregroundOpacity={0.3} />
      <RectangleSkeleton width="160px" height="40px" borderRadius="20px" backgroundColor="#0082c9" foregroundColor="#cce5f6" backgroundOpacity={0.15} foregroundOpacity={0.3} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`There are no CSS variables to list on this page: the component reads none, as "Behaviour the types don't state" explains, so this example styles three pills of different widths with the same five props: \\\`backgroundColor\\\`, \\\`foregroundColor\\\`, their opacities and \\\`borderRadius\\\`.\`
      },
      source: {
        code: \`<RectangleSkeleton
  width="280px"
  height="40px"
  borderRadius="20px"
  backgroundColor="#0082c9"
  foregroundColor="#cce5f6"
  backgroundOpacity={0.15}
  foregroundOpacity={0.3}
/>\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}}})))()}m();export{f as CssCustomization,c as CustomColors,o as Default,d as Grid,l as NoAnimation,u as SlowAnimation,s as SmallCircle,p as __namedExportsOrder,a as default};