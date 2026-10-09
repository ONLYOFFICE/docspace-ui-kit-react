import{n as e,r as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./ApiProvider-D8tgkuYF.js";var a=t({Default:()=>c,__namedExportsOrder:()=>l,default:()=>s}),o,s,c,l;function u(){return(u=e((()=>{r(),o=n(),s={title:`Components/Providers/ApiProvider`,tags:[`!autodocs`],component:i,parameters:{docs:{description:{component:`Provides API client context to all child components using the ONLYOFFICE Apps API SDK.

### Features

- **API Client Instances**: Creates and manages multiple API clients (Profiles, Settings, Folders, Rooms, Files, Groups, Search)
- **Bearer Token Auth**: Configures axios instances with Bearer token authentication
- **React Context**: Exposes API clients via \`useApi()\` hook
- **Memoized Initialization**: API clients are memoized based on URL and API key changes
- **Generic Request Helper**: Includes a reusable \`apiClient.request()\` method for custom API calls

### Usage

\`\`\`tsx
import { ApiProvider, useApi } from "@onlyoffice/apps-ui-kit/providers/api";

// Wrap your app with ApiProvider
<ApiProvider url="https://docspace.example.com" apiKey="your-api-key">
  <App />
</ApiProvider>

// Access API clients in child components
const MyComponent = () => {
  const { profilesApi, foldersApi } = useApi();
  // Use API clients...
};
\`\`\``}}},argTypes:{url:{control:`text`,description:`Base URL of the ONLYOFFICE Apps API server`},apiKey:{control:`text`,description:`API key used for Bearer token authentication`},initSocket:{control:`boolean`,description:`Fetches the portal settings and connects the portal WebSocket on mount`,table:{defaultValue:{summary:`true`}}},children:{control:!1,description:`Child components that can access API clients via useApi() hook`}}},c={render:e=>(0,o.jsx)(i,{...e,children:(0,o.jsx)(`div`,{style:{padding:`16px`},children:(0,o.jsxs)(`p`,{children:[`Children are rendered with access to API clients via the`,` `,(0,o.jsx)(`code`,{children:`useApi()`}),` hook.`]})})}),args:{url:`https://docspace.example.com`,apiKey:`example-api-key`,initSocket:!1},parameters:{docs:{description:{story:`Default ApiProvider wrapping child content. Children can access API clients via the useApi() hook.`},source:{code:`<ApiProvider url="https://docspace.example.com" apiKey="your-api-key">
  <App />
</ApiProvider>`}}}},l=[`Default`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <ApiProvider {...args}>
      <div style={{
      padding: "16px"
    }}>
        <p>
          Children are rendered with access to API clients via the{" "}
          <code>useApi()</code> hook.
        </p>
      </div>
    </ApiProvider>,
  args: {
    url: "https://docspace.example.com",
    apiKey: "example-api-key",
    // Off: with it on, the story fetches the settings of and opens a socket
    // to a portal that does not exist, from every Storybook that opens it.
    initSocket: false
  },
  parameters: {
    docs: {
      description: {
        story: "Default ApiProvider wrapping child content. Children can access API clients via the useApi() hook."
      },
      source: {
        code: \`<ApiProvider url="https://docspace.example.com" apiKey="your-api-key">
  <App />
</ApiProvider>\`
      }
    }
  }
}`,...c.parameters?.docs?.source}}}})))()}export{c as n,u as r,a as t};