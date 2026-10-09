import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{n as i,t as a}from"./globalColors-fkBUxSeV.js";import{n as o,t as s}from"./text-input-D8OFtXHj.js";import{n as c,t as l}from"./TextInput.enums-z6wZ2LJ6.js";import{n as u,t as d}from"./FieldContainer-DmxZfTxt.js";var f,p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{f=t(n()),o(),u(),i(),p=r(),m={title:`UI/Form controls/FieldContainer`,component:d,parameters:{},argTypes:{isVertical:{control:`boolean`,description:`When true, displays label above the input field instead of beside it`,table:{defaultValue:{summary:`false`}}},isRequired:{control:`boolean`,description:`When true, displays a required field indicator (*) next to the label`,table:{defaultValue:{summary:`false`}}},hasError:{control:`boolean`,description:"When true, shows `errorMessage` under the field. The child control is not restyled; give it its own error flag",table:{defaultValue:{summary:`false`}}},labelVisible:{control:`boolean`,description:`Controls visibility of the field label`,table:{defaultValue:{summary:`false`}}},removeMargin:{control:`boolean`,description:`When true, removes the default margin around the container`,table:{defaultValue:{summary:`false`}}},inlineHelpButton:{control:`boolean`,description:`When true, the help button is rendered inside the label element, after its text, instead of as a separate element next to the label`,table:{defaultValue:{summary:`false`}}},labelText:{control:`text`,description:`Text content of the field label`},tooltipContent:{control:`text`,description:`Content of the tooltip that opens when the help icon is clicked. Without it no help icon is rendered`},maxLabelWidth:{control:`text`,description:`Width of the label column in the side-by-side layout: the label takes exactly this width, so the controls of stacked fields line up. Has no effect in the vertical layout`,table:{defaultValue:{summary:`110px`}}},errorMessage:{control:`text`,description:`Error message to display when hasError is true`},errorMessageWidth:{control:`text`,description:`Width of the error message container. Can be any valid CSS width value`,table:{defaultValue:{summary:`293px`}}},errorColor:{control:`color`,description:`Colour of the error message text. The theme's error colour when not given`},place:{control:`select`,options:[`top`,`right`,`bottom`,`left`],description:`Position of the tooltip relative to the help icon`,table:{defaultValue:{summary:`bottom`}}},className:{control:`text`,description:`Additional CSS class names to apply to the container`},style:{control:`object`,description:`Custom inline styles to apply to the container`},labelFor:{control:`text`,description:"`id` of the control this labels, which becomes the label's `for`. Give the control the same `id` and clicking the caption focuses it"},id:{control:`text`,description:"HTML `id` of the container"},tooltipClass:{control:`text`,description:`Additional CSS class names for the help button`},tooltipMaxWidth:{control:`text`,description:`Maximum width of the tooltip. Currently has no effect: the label it is passed to does not read it`},dataTestId:{control:`text`,description:"`data-testid` of the container. The help button, when there is one, gets `<dataTestId>_help_button`",table:{defaultValue:{summary:`field-container`}}},children:{control:!1,description:`The form control the container lays out, rendered in the field body above the error message`}}},h=({hasError:e,...t})=>{let[n,r]=(0,f.useState)(``);return(0,p.jsx)(d,{hasError:e,...t,children:(0,p.jsx)(s,{id:t.labelFor,value:n,hasError:e,className:`field-input`,onChange:e=>{r(e.target.value)},type:c.text,size:l.base})})},g={render:h,args:{labelText:`Name:`,labelVisible:!0,labelFor:`field-name`,maxLabelWidth:`110px`,tooltipContent:`Enter your full name`,place:`top`,errorMessage:`Error text. Lorem ipsum dolor sit amet, consectetuer adipiscing elit`,children:null},parameters:{docs:{description:{story:"The label sits in a fixed-width column beside the control, with a help icon that opens a tooltip on click. Click the caption to focus the input (`labelFor`); change any other prop live in the Controls panel below."},source:{code:`<FieldContainer
  labelText="Name:"
  labelVisible
  labelFor="name"
  maxLabelWidth="110px"
  tooltipContent="Enter your full name"
  place="top"
>
  <TextInput id="name" value={value} onChange={handleChange} />
</FieldContainer>`}}}},_={render:h,args:{...g.args,isRequired:!0,labelText:`Email:`,labelFor:`field-email`,tooltipContent:`Enter a valid email address`},parameters:{docs:{description:{story:"Marks a field the form cannot be sent without: an asterisk follows the caption, and the label is announced as required (`isRequired`)."},source:{code:`<FieldContainer
  labelText="Email:"
  labelVisible
  isRequired
  tooltipContent="Enter a valid email address"
>
  <TextInput value={value} onChange={handleChange} />
</FieldContainer>`}}}},v={render:h,args:{...g.args,hasError:!0,errorMessage:`This field is required`,errorColor:a.lightErrorStatus,errorMessageWidth:`293px`,labelText:`Username:`,labelFor:`field-username`},parameters:{docs:{description:{story:"Tells the user what to correct right under the field: the message appears only while `hasError` is set, in `errorColor`, wrapped at `errorMessageWidth`. The red border belongs to the input, which gets its own `hasError`."},source:{code:`<FieldContainer
  labelText="Username:"
  labelVisible
  hasError
  errorMessage="This field is required"
  errorColor="#F24724"
  errorMessageWidth="293px"
>
  <TextInput value={value} hasError onChange={handleChange} />
</FieldContainer>`}}}},y={render:h,args:{...g.args,isVertical:!0,maxLabelWidth:`100%`,labelText:`Description:`,labelFor:`field-description`,tooltipContent:`Provide a brief description`},parameters:{docs:{description:{story:"For narrow forms and long captions: the label stacks above the control, and both span the full width of the container (`isVertical`). The label column width does not apply here."},source:{code:`<FieldContainer
  isVertical
  labelText="Description:"
  labelVisible
  maxLabelWidth="100%"
  tooltipContent="Provide a brief description"
>
  <TextInput value={value} onChange={handleChange} />
</FieldContainer>`}}}},b={render:h,args:{...g.args,inlineHelpButton:!0,tooltipContent:`This is an inline help message`,labelText:`Profile URL:`,labelFor:`field-profile-url`},parameters:{docs:{description:{story:"Makes the help icon part of the caption: it is rendered inside the label, after its text, so it follows the caption's own layout instead of standing as a separate element beside it (`inlineHelpButton`)."},source:{code:`<FieldContainer
  labelText="Profile URL:"
  labelVisible
  inlineHelpButton
  tooltipContent="This is an inline help message"
>
  <TextInput value={value} onChange={handleChange} />
</FieldContainer>`}}}},x={tags:[`no-picture`],render:h,args:{...g.args,className:`custom-field`,style:{backgroundColor:`#f5f5f5`,padding:`16px`,borderRadius:`4px`},labelText:`Custom Field:`,labelFor:`field-custom`},parameters:{docs:{description:{story:"Sets the container apart from the page, here with a background, padding and rounded corners, through `style` and `className`."},source:{code:`<FieldContainer
  labelText="Custom Field:"
  labelVisible
  className="custom-field"
  style={{ backgroundColor: "#f5f5f5", padding: "16px", borderRadius: "4px" }}
>
  <TextInput value={value} onChange={handleChange} />
</FieldContainer>`}}}},S=()=>{let[e,t]=(0,f.useState)(``),[n,r]=(0,f.useState)(``);return(0,p.jsxs)(`div`,{style:{width:`500px`,"--field-container-margin":`0 0 32px 0`,"--field-container-error-top":`8px`,"--error-color":`#7c3aed`},children:[(0,p.jsx)(d,{labelText:`Full Name:`,labelVisible:!0,maxLabelWidth:`140px`,hasError:!0,errorMessage:`Name must be at least 3 characters`,tooltipContent:`Enter your full name`,place:`top`,children:(0,p.jsx)(s,{value:e,hasError:!0,onChange:e=>t(e.target.value),type:c.text,size:l.base})}),(0,p.jsx)(d,{labelText:`Email:`,labelVisible:!0,maxLabelWidth:`140px`,hasError:!1,tooltipContent:`Enter your email address`,place:`top`,children:(0,p.jsx)(s,{value:n,onChange:e=>r(e.target.value),type:c.text,size:l.base})})]})},C={render:()=>(0,p.jsx)(S,{}),parameters:{docs:{description:{story:`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

- **Full Name** — the error message shows the custom colour and top padding
- **Email** — the gap between the two fields is the custom container margin`}}}},w=[`Default`,`Required`,`WithError`,`VerticalLayout`,`WithInlineHelp`,`CustomStyling`,`CssCustomization`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    labelText: "Name:",
    labelVisible: true,
    labelFor: "field-name",
    maxLabelWidth: "110px",
    tooltipContent: "Enter your full name",
    place: "top",
    errorMessage: "Error text. Lorem ipsum dolor sit amet, consectetuer adipiscing elit",
    children: null
  },
  parameters: {
    docs: {
      description: {
        story: "The label sits in a fixed-width column beside the control, with a help icon that opens a tooltip on click. Click the caption to focus the input (\`labelFor\`); change any other prop live in the Controls panel below."
      },
      source: {
        code: \`<FieldContainer
  labelText="Name:"
  labelVisible
  labelFor="name"
  maxLabelWidth="110px"
  tooltipContent="Enter your full name"
  place="top"
>
  <TextInput id="name" value={value} onChange={handleChange} />
</FieldContainer>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    isRequired: true,
    labelText: "Email:",
    labelFor: "field-email",
    tooltipContent: "Enter a valid email address"
  },
  parameters: {
    docs: {
      description: {
        story: "Marks a field the form cannot be sent without: an asterisk follows the caption, and the label is announced as required (\`isRequired\`)."
      },
      source: {
        code: \`<FieldContainer
  labelText="Email:"
  labelVisible
  isRequired
  tooltipContent="Enter a valid email address"
>
  <TextInput value={value} onChange={handleChange} />
</FieldContainer>\`
      }
    }
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    hasError: true,
    errorMessage: "This field is required",
    errorColor: globalColors.lightErrorStatus,
    errorMessageWidth: "293px",
    labelText: "Username:",
    labelFor: "field-username"
  },
  parameters: {
    docs: {
      description: {
        story: "Tells the user what to correct right under the field: the message appears only while \`hasError\` is set, in \`errorColor\`, wrapped at \`errorMessageWidth\`. The red border belongs to the input, which gets its own \`hasError\`."
      },
      source: {
        code: \`<FieldContainer
  labelText="Username:"
  labelVisible
  hasError
  errorMessage="This field is required"
  errorColor="#F24724"
  errorMessageWidth="293px"
>
  <TextInput value={value} hasError onChange={handleChange} />
</FieldContainer>\`
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    isVertical: true,
    maxLabelWidth: "100%",
    labelText: "Description:",
    labelFor: "field-description",
    tooltipContent: "Provide a brief description"
  },
  parameters: {
    docs: {
      description: {
        story: "For narrow forms and long captions: the label stacks above the control, and both span the full width of the container (\`isVertical\`). The label column width does not apply here."
      },
      source: {
        code: \`<FieldContainer
  isVertical
  labelText="Description:"
  labelVisible
  maxLabelWidth="100%"
  tooltipContent="Provide a brief description"
>
  <TextInput value={value} onChange={handleChange} />
</FieldContainer>\`
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...Default.args,
    inlineHelpButton: true,
    tooltipContent: "This is an inline help message",
    labelText: "Profile URL:",
    labelFor: "field-profile-url"
  },
  parameters: {
    docs: {
      description: {
        story: "Makes the help icon part of the caption: it is rendered inside the label, after its text, so it follows the caption's own layout instead of standing as a separate element beside it (\`inlineHelpButton\`)."
      },
      source: {
        code: \`<FieldContainer
  labelText="Profile URL:"
  labelVisible
  inlineHelpButton
  tooltipContent="This is an inline help message"
>
  <TextInput value={value} onChange={handleChange} />
</FieldContainer>\`
      }
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  // The story paints its own light page, so the dark picture for the API
  // site is unreadable; the story stays, its picture does not.
  tags: ["no-picture"],
  render: Template,
  args: {
    ...Default.args,
    className: "custom-field",
    style: {
      backgroundColor: "#f5f5f5",
      padding: "16px",
      borderRadius: "4px"
    },
    labelText: "Custom Field:",
    labelFor: "field-custom"
  },
  parameters: {
    docs: {
      description: {
        story: "Sets the container apart from the page, here with a background, padding and rounded corners, through \`style\` and \`className\`."
      },
      source: {
        code: \`<FieldContainer
  labelText="Custom Field:"
  labelVisible
  className="custom-field"
  style={{ backgroundColor: "#f5f5f5", padding: "16px", borderRadius: "4px" }}
>
  <TextInput value={value} onChange={handleChange} />
</FieldContainer>\`
      }
    }
  }
}`,...x.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

- **Full Name** — the error message shows the custom colour and top padding
- **Email** — the gap between the two fields is the custom container margin\`
      }
    }
  }
}`,...C.parameters?.docs?.source}}}})))()}T();export{C as CssCustomization,x as CustomStyling,g as Default,_ as Required,y as VerticalLayout,v as WithError,b as WithInlineHelp,w as __namedExportsOrder,m as default};