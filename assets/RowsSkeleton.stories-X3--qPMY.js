import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-C21x__mS.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{i as r,n as i,r as a,t as o}from"./RowsSkeleton-BLchfqk1.js";var s,c,l,u,d,f,p;function m(){return(m=e((()=>{t(),r(),i(),s=n(),c={title:`UI/Rows/RowsSkeleton`,component:o,parameters:{docs:{description:{component:`Placeholder in the shape of a list of rows, shown while the rows themselves are loading. The Rows page describes it in full.`}}},argTypes:{count:{control:`number`,description:`How many placeholder rows to draw`,table:{defaultValue:{summary:`25`}}},title:{control:`text`,description:`Accessible name given to every shape; empty by default, which leaves them unnamed`,table:{defaultValue:{summary:`""`}}},animate:{control:`boolean`,description:`Whether the light band sweeps across the shapes; turn it off for a still placeholder`,table:{defaultValue:{summary:`true`}}},speed:{control:`number`,description:`Duration of one sweep of the band, in seconds`,table:{defaultValue:{summary:`2`}}},backgroundColor:{control:`color`,description:"Colour of the shapes at rest, drawn at `backgroundOpacity`; black in every theme",table:{defaultValue:{summary:`#000`}}},foregroundColor:{control:`color`,description:"Colour of the band that sweeps across the shapes, drawn at `foregroundOpacity`",table:{defaultValue:{summary:`#000`}}},backgroundOpacity:{control:`number`,description:"Opacity of `backgroundColor`, from 0 to 1",table:{defaultValue:{summary:`0.1`}}},foregroundOpacity:{control:`number`,description:"Opacity of `foregroundColor`, from 0 to 1",table:{defaultValue:{summary:`0.15`}}},borderRadius:{control:`text`,description:`Corner radius of the square and bar shapes, in pixels`,table:{defaultValue:{summary:`3`}}},className:{control:`text`,description:`Class added to every placeholder row`},style:{control:`object`,description:`Inline style applied to every placeholder row`},x:{control:!1,description:`Ignored: the rows place their shapes themselves`},y:{control:!1,description:`Ignored: the rows place their shapes themselves`},width:{control:!1,description:`Ignored: the rows size their shapes themselves`},height:{control:!1,description:`Ignored: the rows size their shapes themselves`},uniqueKey:{control:!1,description:`Ignored: every shape takes an id of its own`}}},l={render:e=>(0,s.jsx)(o,{...e}),args:{count:5},parameters:{docs:{description:{story:"Five placeholder rows (`count`) with the band sweeping across them, as a list shows them while its first page loads. Change any other prop live in the Controls panel below."},source:{code:`<RowsSkeleton count={5} />`}}}},u={render:e=>(0,s.jsx)(o,{...e}),args:{count:3,animate:!1},parameters:{docs:{description:{story:"A placeholder that does not move, for a reader who asked for less motion: the band no longer sweeps across the shapes (`animate`). The component does not check the system's reduced-motion setting itself."},source:{code:`<RowsSkeleton count={3} animate={false} />`}}}},d=()=>(0,s.jsxs)(`div`,{children:[(0,s.jsx)(a,{isRectangle:!1}),(0,s.jsx)(a,{isRectangle:!1}),(0,s.jsx)(a,{isRectangle:!1})]}),f={render:()=>(0,s.jsx)(d,{}),parameters:{docs:{description:{story:"Rows for a list of people, whose start element is a round avatar: each `RowSkeleton` draws a circle in place of the square (`isRectangle={false}`). `RowsSkeleton` has no such prop, so a list of round rows is built from `RowSkeleton` directly."},source:{code:`<RowSkeleton isRectangle={false} />
<RowSkeleton isRectangle={false} />
<RowSkeleton isRectangle={false} />`}}}},p=[`Default`,`StaticPlaceholder`,`RoundStartElement`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <RowsSkeleton {...args} />,
  args: {
    count: 5
  },
  parameters: {
    docs: {
      description: {
        story: "Five placeholder rows (\`count\`) with the band sweeping across them, as a list shows them while its first page loads. Change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<RowsSkeleton count={5} />\`
      }
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <RowsSkeleton {...args} />,
  args: {
    count: 3,
    animate: false
  },
  parameters: {
    docs: {
      description: {
        story: "A placeholder that does not move, for a reader who asked for less motion: the band no longer sweeps across the shapes (\`animate\`). The component does not check the system's reduced-motion setting itself."
      },
      source: {
        code: \`<RowsSkeleton count={3} animate={false} />\`
      }
    }
  }
}`,...u.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <RoundStartElementTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Rows for a list of people, whose start element is a round avatar: each \`RowSkeleton\` draws a circle in place of the square (\`isRectangle={false}\`). \`RowsSkeleton\` has no such prop, so a list of round rows is built from \`RowSkeleton\` directly."
      },
      source: {
        code: \`<RowSkeleton isRectangle={false} />
<RowSkeleton isRectangle={false} />
<RowSkeleton isRectangle={false} />\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}}})))()}m();export{l as Default,f as RoundStartElement,u as StaticPlaceholder,p as __namedExportsOrder,c as default};