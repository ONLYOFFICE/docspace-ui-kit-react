import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{t as r}from"./classnames-CfLRLWYq.js";import{o as i,r as a}from"./device-CZeBCJ1S.js";import{r as o,t as s}from"./text-Cz_cI6Yf.js";import{n as c,t as l}from"./cross.react-BpjVHsQC.js";import{n as u,t as d}from"./common-icons-style-Dik-NKVV.js";import{i as f,n as p,t as m}from"./link-C_nB54e7.js";var h;function g(){return(g=e((()=>{h=new URL(`empty.rooms.root.light-u3LBSLm1.svg`,import.meta.url).href})))()}var _,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{_=`_body_15rg2_1`,v=`_withSubheading_15rg2_40`,y=`_withDescription_15rg2_43`,b=`_withoutFilter_15rg2_46`,x=`_image_15rg2_52`,S=`_header_15rg2_62`,C=`_description_15rg2_67`,w=`_buttons_15rg2_73`,T={body:_,withSubheading:v,withDescription:y,withoutFilter:b,image:x,header:S,description:C,buttons:w}})))()}var D,O,k;function A(){return(A=e((()=>{D=t(r()),a(),o(),E(),O=n(),k=e=>{let{imageSrc:t,imageAlt:n,headerText:r,subheadingText:a,descriptionText:o,buttons:c,imageStyle:l,buttonStyle:u,withoutFilter:d,className:f}=e;return(0,O.jsxs)(`div`,{className:(0,D.default)(T.body,{[T.withoutFilter]:d,[T.withSubheading]:!!a,[T.withDescription]:!!o},f),"data-testid":`empty-screen-container`,children:[(0,O.jsx)(`img`,{src:t,alt:n,style:i()?{}:l,className:(0,D.default)(T.image,`ec-image`)}),r?(0,O.jsx)(s,{as:`span`,fontSize:`19px`,fontWeight:`700`,className:(0,D.default)(T.header,`ec-header`),children:r}):null,a?(0,O.jsx)(s,{as:`span`,fontWeight:`600`,className:(0,D.default)(T.subheading,`ec-subheading`),children:a}):null,o?(0,O.jsx)(s,{as:`span`,fontSize:`12px`,className:(0,D.default)(T.description,`ec-desc`),children:o}):null,c?(0,O.jsx)(`div`,{className:(0,D.default)(T.buttons,`ec-buttons`),style:u,children:c}):null]})};try{k.displayName=`EmptyScreenContainer`,k.__docgenInfo={description:``,displayName:`EmptyScreenContainer`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/components/empty-screen-container/index.tsx`,methods:[],props:{imageSrc:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/empty-screen-container/EmptyScreenContainer.types.ts`,name:`TypeLiteral`}],description:`Source of the illustration. The stylesheet pins the image to 200×140, and to 150×105 below 600px, so supply artwork of that shape.`,name:`imageSrc`,required:!0,tags:{},type:{name:`string`}},imageAlt:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/empty-screen-container/EmptyScreenContainer.types.ts`,name:`TypeLiteral`}],description:`Alternative text for the illustration. Pass an empty string when the artwork repeats what the text below already says.`,name:`imageAlt`,required:!0,tags:{},type:{name:`string`}},headerText:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/empty-screen-container/EmptyScreenContainer.types.ts`,name:`TypeLiteral`}],description:`The large line under the image, 19px and bold.`,name:`headerText`,required:!0,tags:{},type:{name:`string`}},subheadingText:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/empty-screen-container/EmptyScreenContainer.types.ts`,name:`TypeLiteral`}],description:`Optional 600-weight line between the header and the description. It has no styling of its own beyond that weight.`,name:`subheadingText`,required:!1,tags:{},type:{name:`string | undefined`}},descriptionText:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/empty-screen-container/EmptyScreenContainer.types.ts`,name:`TypeLiteral`}],description:`Optional explanatory line at 12px, in the muted colour.`,name:`descriptionText`,required:!1,tags:{},type:{name:`ReactNode`}},buttons:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/empty-screen-container/EmptyScreenContainer.types.ts`,name:`TypeLiteral`}],description:`Actions under the text, stacked in a 16px column and centred.`,name:`buttons`,required:!1,tags:{},type:{name:`ReactNode`}},className:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/empty-screen-container/EmptyScreenContainer.types.ts`,name:`TypeLiteral`}],description:`Added after the component's own classes on the outer element.`,name:`className`,required:!1,tags:{},type:{name:`string | undefined`}},id:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/empty-screen-container/EmptyScreenContainer.types.ts`,name:`TypeLiteral`}],description:`Ignored. Nothing reads this prop and the component spreads no unknown props, so it never reaches the DOM.`,name:`id`,required:!1,tags:{},type:{name:`string | undefined`}},style:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/empty-screen-container/EmptyScreenContainer.types.ts`,name:`TypeLiteral`}],description:"Ignored. Nothing reads this prop; style the outer element through `className`.",name:`style`,required:!1,tags:{},type:{name:`CSSProperties | undefined`}},imageStyle:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/empty-screen-container/EmptyScreenContainer.types.ts`,name:`TypeLiteral`}],description:"Inline style of the `<img>`, and the only way past its fixed size. It is dropped between 601px and 1023px, where the component passes an empty object instead.",name:`imageStyle`,required:!1,tags:{},type:{name:`CSSProperties | undefined`}},buttonStyle:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/empty-screen-container/EmptyScreenContainer.types.ts`,name:`TypeLiteral`}],description:"Inline style of the row that holds `buttons`.",name:`buttonStyle`,required:!1,tags:{},type:{name:`CSSProperties | undefined`}},withoutFilter:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/components/empty-screen-container/EmptyScreenContainer.types.ts`,name:`TypeLiteral`}],description:`Adds the height of the filter bar to the top padding — 91px in place of 52px — for a screen that has no filter above it. It removes nothing.`,name:`withoutFilter`,required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}})))()}var j,M,N;function P(){return(P=e((()=>{j=`_crossIcon_10oy9_1`,M=`_resetFilterButton_10oy9_35`,N={crossIcon:j,resetFilterButton:M}})))()}var F,I,L,R,z,B,V,H,U,W;function G(){return(G=e((()=>{c(),g(),u(),p(),A(),P(),F=n(),I={title:`UI/Layout components/EmptyScreenContainer`,component:k,parameters:{},argTypes:{imageSrc:{control:`text`,description:`URL source for the empty state image`},imageAlt:{control:`text`,description:`Alternative text for the image for accessibility`},headerText:{control:`text`,description:`Main header text displayed below the image`},subheadingText:{control:`text`,description:`Optional subheading text displayed below the header`},descriptionText:{control:`text`,description:`Optional description text or React node displayed below the subheading`},buttons:{description:`Optional action buttons or interactive elements`,control:!1},withoutFilter:{control:`boolean`,description:`Adds the height of a filter bar to the space above the image, 91px instead of 52px on desktop, for a screen that has no filter bar above it`,table:{defaultValue:{summary:`false`}}},imageStyle:{control:`object`,description:`Inline styles for the image and the only way past its fixed size; ignored on windows between 601px and 1023px wide`},buttonStyle:{control:`object`,description:`Custom CSS styles for the buttons container`},className:{control:`text`,description:`Additional CSS class name`},id:{control:!1,description:`Accepted by the type but ignored: it never reaches the DOM`},style:{control:!1,description:"Accepted by the type but ignored; style the outer element through `className`"}}},L=()=>(0,F.jsxs)(`div`,{className:N.resetFilterButton,children:[(0,F.jsx)(l,{className:N.crossIcon,"data-size":d.small}),(0,F.jsx)(m,{type:f.action,isHovered:!0,children:`Reset filter`})]}),R=()=>(0,F.jsx)(m,{type:f.action,isHovered:!0,children:`Go to home`}),z={render:e=>(0,F.jsx)(k,{...e}),args:{imageSrc:h,imageAlt:`Empty Screen Filter image`,headerText:`No results matching your search could be found`,subheadingText:`No files to be displayed in this section`,descriptionText:`No people matching your filter can be displayed in this section. Please select other filter options or clear filter to view all the people in this section.`,buttons:(0,F.jsx)(L,{})},parameters:{docs:{description:{story:`The full layout, for a list a filter has emptied: a header, a subheading and a description explain why nothing is shown, and a reset action under them offers the way back.`},source:{code:`<EmptyScreenContainer
  imageSrc={emptyImage}
  imageAlt="Empty Screen Filter image"
  headerText="No results matching your search could be found"
  subheadingText="No files to be displayed in this section"
  descriptionText="No people matching your filter can be displayed..."
  buttons={<ResetFilterButton />}
/>`}}}},B={render:e=>(0,F.jsx)(k,{...e}),args:{imageSrc:h,imageAlt:`Empty search results`,headerText:`No results found`,buttons:(0,F.jsx)(R,{})},parameters:{docs:{description:{story:`The least a screen needs, for a place where there is nothing to explain: the image, one header line and a single way out.`},source:{code:`<EmptyScreenContainer
  imageSrc={emptyImage}
  imageAlt="Empty search results"
  headerText="No results found"
  buttons={<Link type={LinkType.action}>Go to home</Link>}
/>`}}}},V={render:e=>(0,F.jsx)(k,{...e}),args:{imageSrc:h,imageAlt:`Empty Screen Filter image`,headerText:`Custom styled empty state`,descriptionText:`This example shows custom styles for image and buttons`,buttons:(0,F.jsx)(R,{}),imageStyle:{width:`150px`,height:`150px`},buttonStyle:{marginTop:`32px`}},parameters:{docs:{description:{story:"For artwork of another shape: the image is resized past its fixed 200×140 box (`imageStyle`) and the actions sit further down (`buttonStyle`). On windows between 601px and 1023px wide the image falls back to its fixed size."},source:{code:`<EmptyScreenContainer
  imageSrc={emptyImage}
  imageAlt="Empty Screen Filter image"
  headerText="Custom styled empty state"
  descriptionText="This example shows custom styles for image and buttons"
  buttons={<HomeButton />}
  imageStyle={{ width: "150px", height: "150px" }}
  buttonStyle={{ marginTop: "32px" }}
/>`}}}},H={render:e=>(0,F.jsx)(k,{...e}),args:{imageSrc:h,imageAlt:`Welcome image`,headerText:`Welcome to your workspace`,descriptionText:`Get started by creating your first document or uploading files to this folder.`,buttons:(0,F.jsx)(R,{}),withoutFilter:!0},parameters:{docs:{description:{story:"For a screen with no filter bar above it, such as a first-run view: the content starts 91px from the top instead of 52px (`withoutFilter`), so it sits as low as it would under a filter bar."},source:{code:`<EmptyScreenContainer
  imageSrc={welcomeImage}
  imageAlt="Welcome image"
  headerText="Welcome to your workspace"
  descriptionText="Get started by creating your first document..."
  buttons={<HomeButton />}
  withoutFilter
/>`}}}},U={render:()=>(0,F.jsx)(`div`,{style:{"--empty-screen-header-color":`#0082c9`,"--empty-screen-description-color":`#1d2d44`,"--empty-screen-link-color":`#0082c9`,"--empty-screen-text-color":`#6a6a6a`,"--empty-screen-width":`480px`},children:(0,F.jsx)(k,{imageSrc:h,imageAlt:`Empty`,headerText:`No files found`,descriptionText:`Create your first file to get started.`,buttons:(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(L,{}),(0,F.jsx)(`span`,{children:`Filters are kept for this folder`})]}),withoutFilter:!0})}),parameters:{docs:{description:{story:`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The reset action shows the link colour on both its icon and its text, the line under it the plain-text colour; the width applies only on a window wider than 1424px.`},source:{code:`<div
  style={{
    "--empty-screen-header-color": "#0082c9",
    "--empty-screen-description-color": "#1d2d44",
    "--empty-screen-link-color": "#0082c9",
    "--empty-screen-text-color": "#6a6a6a",
    "--empty-screen-width": "480px",
  }}
>
  <EmptyScreenContainer
    imageSrc={emptyImage}
    imageAlt="Empty"
    headerText="No files found"
    descriptionText="Create your first file to get started."
    buttons={
      <>
        <ResetFilterButton />
        <span>Filters are kept for this folder</span>
      </>
    }
    withoutFilter
  />
</div>`}}}},W=[`Default`,`MinimalContent`,`CustomStyles`,`WithoutFilter`,`CssCustomization`],z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: args => <EmptyScreenContainer {...args} />,
  args: {
    imageSrc: EmptyImageReactSvg,
    imageAlt: "Empty Screen Filter image",
    headerText: "No results matching your search could be found",
    subheadingText: "No files to be displayed in this section",
    descriptionText: "No people matching your filter can be displayed in this section. Please select other filter options or clear filter to view all the people in this section.",
    buttons: <ResetFilterButton />
  },
  parameters: {
    docs: {
      description: {
        story: "The full layout, for a list a filter has emptied: a header, a subheading and a description explain why nothing is shown, and a reset action under them offers the way back."
      },
      source: {
        code: \`<EmptyScreenContainer
  imageSrc={emptyImage}
  imageAlt="Empty Screen Filter image"
  headerText="No results matching your search could be found"
  subheadingText="No files to be displayed in this section"
  descriptionText="No people matching your filter can be displayed..."
  buttons={<ResetFilterButton />}
/>\`
      }
    }
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: args => <EmptyScreenContainer {...args} />,
  args: {
    imageSrc: EmptyImageReactSvg,
    imageAlt: "Empty search results",
    headerText: "No results found",
    buttons: <HomeButton />
  },
  parameters: {
    docs: {
      description: {
        story: "The least a screen needs, for a place where there is nothing to explain: the image, one header line and a single way out."
      },
      source: {
        code: \`<EmptyScreenContainer
  imageSrc={emptyImage}
  imageAlt="Empty search results"
  headerText="No results found"
  buttons={<Link type={LinkType.action}>Go to home</Link>}
/>\`
      }
    }
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: args => <EmptyScreenContainer {...args} />,
  args: {
    imageSrc: EmptyImageReactSvg,
    imageAlt: "Empty Screen Filter image",
    headerText: "Custom styled empty state",
    descriptionText: "This example shows custom styles for image and buttons",
    buttons: <HomeButton />,
    imageStyle: {
      width: "150px",
      height: "150px"
    },
    buttonStyle: {
      marginTop: "32px"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "For artwork of another shape: the image is resized past its fixed 200×140 box (\`imageStyle\`) and the actions sit further down (\`buttonStyle\`). On windows between 601px and 1023px wide the image falls back to its fixed size."
      },
      source: {
        code: \`<EmptyScreenContainer
  imageSrc={emptyImage}
  imageAlt="Empty Screen Filter image"
  headerText="Custom styled empty state"
  descriptionText="This example shows custom styles for image and buttons"
  buttons={<HomeButton />}
  imageStyle={{ width: "150px", height: "150px" }}
  buttonStyle={{ marginTop: "32px" }}
/>\`
      }
    }
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: args => <EmptyScreenContainer {...args} />,
  args: {
    imageSrc: EmptyImageReactSvg,
    imageAlt: "Welcome image",
    headerText: "Welcome to your workspace",
    descriptionText: "Get started by creating your first document or uploading files to this folder.",
    buttons: <HomeButton />,
    withoutFilter: true
  },
  parameters: {
    docs: {
      description: {
        story: "For a screen with no filter bar above it, such as a first-run view: the content starts 91px from the top instead of 52px (\`withoutFilter\`), so it sits as low as it would under a filter bar."
      },
      source: {
        code: \`<EmptyScreenContainer
  imageSrc={welcomeImage}
  imageAlt="Welcome image"
  headerText="Welcome to your workspace"
  descriptionText="Get started by creating your first document..."
  buttons={<HomeButton />}
  withoutFilter
/>\`
      }
    }
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    "--empty-screen-header-color": "#0082c9",
    "--empty-screen-description-color": "#1d2d44",
    "--empty-screen-link-color": "#0082c9",
    "--empty-screen-text-color": "#6a6a6a",
    "--empty-screen-width": "480px"
  } as CSSProperties}>
      <EmptyScreenContainer imageSrc={EmptyImageReactSvg} imageAlt="Empty" headerText="No files found" descriptionText="Create your first file to get started." buttons={<>
            <ResetFilterButton />
            <span>Filters are kept for this folder</span>
          </>} withoutFilter />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The reset action shows the link colour on both its icon and its text, the line under it the plain-text colour; the width applies only on a window wider than 1424px.\`
      },
      source: {
        code: \`<div
  style={{
    "--empty-screen-header-color": "#0082c9",
    "--empty-screen-description-color": "#1d2d44",
    "--empty-screen-link-color": "#0082c9",
    "--empty-screen-text-color": "#6a6a6a",
    "--empty-screen-width": "480px",
  }}
>
  <EmptyScreenContainer
    imageSrc={emptyImage}
    imageAlt="Empty"
    headerText="No files found"
    descriptionText="Create your first file to get started."
    buttons={
      <>
        <ResetFilterButton />
        <span>Filters are kept for this folder</span>
      </>
    }
    withoutFilter
  />
</div>\`
      }
    }
  }
}`,...U.parameters?.docs?.source}}}})))()}G();export{U as CssCustomization,V as CustomStyles,z as Default,B as MinimalContent,H as WithoutFilter,W as __namedExportsOrder,I as default};