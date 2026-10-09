import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-C21x__mS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{n as i,t as a}from"./ErrorContainer-BbY1erzg.js";var o,s,c;function l(){return(l=e((()=>{o=t(n()),i(),s=r(),c=class extends o.Component{constructor(e){super(e),this.state={error:null}}static getDerivedStateFromError(e){return{error:e??Error(`Unhandled exception`)}}componentDidCatch(e,t){let{onError:n}=this.props;n?.(e,t)}render(){let{error:e}=this.state,{children:t,fallback:n}=this.props;return e?typeof n==`function`?n(e):n||(0,s.jsx)(a,{headerText:`Something went wrong`,customizedBodyText:e.message}):t}};try{c.displayName=`ErrorBoundary`,c.__docgenInfo={description:``,displayName:`ErrorBoundary`,filePath:`/home/runner/work/docspace-ui-kit-react/docspace-ui-kit-react/providers/error-boundary/ErrorBoundary.tsx`,methods:[],props:{fallback:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/providers/error-boundary/ErrorBoundary.tsx`,name:`TypeLiteral`}],description:"What to render instead of the subtree after a throw. A function receives the error. Without it the kit's own `ErrorContainer` is shown, with the error's message and an untranslated English heading.",name:`fallback`,required:!1,tags:{},type:{name:`ReactNode | ((error: Error) => ReactNode)`}},onError:{defaultValue:null,declarations:[{fileName:`docspace-ui-kit-react/providers/error-boundary/ErrorBoundary.tsx`,name:`TypeLiteral`}],description:`Called once with the error and React's component stack. Report it here; the boundary itself logs nothing.`,name:`onError`,required:!1,tags:{},type:{name:`((error: Error, errorInfo: ErrorInfo) => void) | undefined`}}},tags:{}}}catch{}})))()}var u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{l(),u=r(),d={title:`Components/Providers/ErrorProvider`,component:c,parameters:{},argTypes:{children:{control:!1,description:`Child components to render inside the error boundary`},fallback:{control:!1,description:"Custom fallback UI as a ReactNode or a render function `(error: Error) => ReactNode`"},onError:{control:!1,description:"Callback fired when an error is caught `(error: Error, errorInfo: ErrorInfo) => void`"}}},f={args:{children:(0,u.jsx)(`div`,{style:{padding:`16px`},children:(0,u.jsx)(`p`,{children:`Children are rendered normally when no error occurs.`})})},parameters:{docs:{description:{story:`Default usage where children render normally without any errors.`},source:{code:`<ErrorBoundary>
  <div style={{ padding: "16px" }}>
    <p>Children are rendered normally when no error occurs.</p>
  </div>
</ErrorBoundary>`}}}},p=()=>{throw Error(`Something broke!`)},m={args:{children:(0,u.jsx)(p,{})},parameters:{docs:{description:{story:`When a child component throws, the default ErrorContainer fallback is rendered.`},source:{code:`const ThrowingComponent = () => {
  throw new Error("Something broke!");
};

<ErrorBoundary>
  <ThrowingComponent />
</ErrorBoundary>`}}}},h={args:{fallback:(0,u.jsxs)(`div`,{style:{padding:`16px`,color:`red`},children:[(0,u.jsx)(`h3`,{children:`Custom Error UI`}),(0,u.jsx)(`p`,{children:`Something went wrong. Please try again.`})]}),children:(0,u.jsx)(p,{})},parameters:{docs:{description:{story:`A custom ReactNode can be provided as fallback for a fully customized error UI.`},source:{code:`<ErrorBoundary
  fallback={
    <div style={{ padding: "16px", color: "red" }}>
      <h3>Custom Error UI</h3>
      <p>Something went wrong. Please try again.</p>
    </div>
  }
>
  <ThrowingComponent />
</ErrorBoundary>`}}}},g={args:{fallback:e=>(0,u.jsxs)(`div`,{style:{padding:`16px`,color:`red`},children:[(0,u.jsx)(`h3`,{children:`Error Details`}),(0,u.jsx)(`p`,{children:e.message})]}),children:(0,u.jsx)(p,{})},parameters:{docs:{description:{story:`A render function receives the caught error, enabling dynamic fallback UI based on the error.`},source:{code:`<ErrorBoundary
  fallback={(error) => (
    <div style={{ padding: "16px", color: "red" }}>
      <h3>Error Details</h3>
      <p>{error.message}</p>
    </div>
  )}
>
  <ThrowingComponent />
</ErrorBoundary>`}}}},_=[`Default`,`WithError`,`WithCustomFallback`,`WithRenderFunctionFallback`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div style={{
      padding: "16px"
    }}>
        <p>Children are rendered normally when no error occurs.</p>
      </div>
  },
  parameters: {
    docs: {
      description: {
        story: "Default usage where children render normally without any errors."
      },
      source: {
        code: \`<ErrorBoundary>
  <div style={{ padding: "16px" }}>
    <p>Children are rendered normally when no error occurs.</p>
  </div>
</ErrorBoundary>\`
      }
    }
  }
}`,...f.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    children: <ThrowingComponent />
  },
  parameters: {
    docs: {
      description: {
        story: "When a child component throws, the default ErrorContainer fallback is rendered."
      },
      source: {
        code: \`const ThrowingComponent = () => {
  throw new Error("Something broke!");
};

<ErrorBoundary>
  <ThrowingComponent />
</ErrorBoundary>\`
      }
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    fallback: <div style={{
      padding: "16px",
      color: "red"
    }}>
        <h3>Custom Error UI</h3>
        <p>Something went wrong. Please try again.</p>
      </div>,
    children: <ThrowingComponent />
  },
  parameters: {
    docs: {
      description: {
        story: "A custom ReactNode can be provided as fallback for a fully customized error UI."
      },
      source: {
        code: \`<ErrorBoundary
  fallback={
    <div style={{ padding: "16px", color: "red" }}>
      <h3>Custom Error UI</h3>
      <p>Something went wrong. Please try again.</p>
    </div>
  }
>
  <ThrowingComponent />
</ErrorBoundary>\`
      }
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    fallback: (error: Error) => <div style={{
      padding: "16px",
      color: "red"
    }}>
        <h3>Error Details</h3>
        <p>{error.message}</p>
      </div>,
    children: <ThrowingComponent />
  },
  parameters: {
    docs: {
      description: {
        story: "A render function receives the caught error, enabling dynamic fallback UI based on the error."
      },
      source: {
        code: \`<ErrorBoundary
  fallback={(error) => (
    <div style={{ padding: "16px", color: "red" }}>
      <h3>Error Details</h3>
      <p>{error.message}</p>
    </div>
  )}
>
  <ThrowingComponent />
</ErrorBoundary>\`
      }
    }
  }
}`,...g.parameters?.docs?.source}}}})))()}v();export{f as Default,h as WithCustomFallback,m as WithError,g as WithRenderFunctionFallback,_ as __namedExportsOrder,d as default};