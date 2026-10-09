import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./useTranslation-Bu8Vk4Ex.js";import{n as i,t as a}from"./withAiSetup-YbsVeo6U.js";import{r as o,t as s}from"./text-Cz_cI6Yf.js";import{C as c,l,s as u,v as d}from"./index-BYLLsszn-BCdUGgZ2.js";import{u as f}from"./AiChatPanel.stories-DNTlCz3M.js";import{r as p,t as m}from"./heading-BgSzvZkA.js";var h,g;function _(){return(_=e((()=>{f(),h=t(),g=()=>(0,h.jsx)(c,{hideHeader:!0,noPadding:!0})})))()}var v,y,b,x;function S(){return(S=e((()=>{v=`_modelAssignment_hs329_1`,y=`_defaultSetupTitle_hs329_21`,b=`_defaultSetupDescription_hs329_24`,x={modelAssignment:v,defaultSetupTitle:y,defaultSetupDescription:b}})))()}var C,w;function T(){return(T=e((()=>{r(),f(),p(),o(),S(),C=t(),w=()=>{let{t:e}=n([`Common`]);return(0,C.jsx)(u,{hideHeader:!0,noPadding:!0,className:x.modelAssignment,defaultModelLabel:``,defaultSetupHeader:(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)(m,{level:3,fontWeight:700,fontSize:`16px`,lineHeight:`22px`,className:x.defaultSetupTitle,children:e(`Common:DefaultAISetupTitle`)}),(0,C.jsx)(s,{lineHeight:`20px`,className:x.defaultSetupDescription,children:e(`Common:DefaultAISetupDescription`)})]})})}})))()}var E,D;function O(){return(O=e((()=>{f(),E=t(),D=()=>(0,E.jsx)(d,{hideHeader:!0,noPadding:!0})})))()}var k,A;function j(){return(j=e((()=>{k=`_webSearch_dtiti_1`,A={webSearch:k}})))()}var M,N;function P(){return(P=e((()=>{f(),j(),M=t(),N=()=>(0,M.jsx)(l,{hideHeader:!0,noPadding:!0,isHorizontal:!1,className:A.webSearch})})))()}var F,I;function L(){return(L=e((()=>{F=`_frame_e7rup_1`,I={frame:F}})))()}var R,z,B,V,H,U,W,G;function K(){return(K=e((()=>{a(),_(),O(),T(),P(),L(),R=t(),z=({children:e})=>(0,R.jsx)(`div`,{className:I.frame,children:e}),B={title:`Components/AI Settings`,parameters:{docs:{story:{inline:!1},description:{component:'The portal\'s AI settings screens, from `ai-agent/settings`. Each is a page of `@onlyoffice/ai-chat` with the kit\'s layout applied, and reads and writes the same AI service the chat talks to, so it has to sit inside `AiAgentProviders`. Without a portal the stories run against the demo portal the mock service worker plays, under a banner that says so: its models, assignments and MCP servers are made up, and a change is saved in memory only, until the page is reloaded.\n\n```tsx\nimport AiAgentProviders from "@onlyoffice/apps-ui-kit/ai-agent/providers";\nimport { AiModels } from "@onlyoffice/apps-ui-kit/ai-agent/settings";\n\n<AiAgentProviders locale="en" isAvailable>\n  <AiModels />\n</AiAgentProviders>;\n```'}}},argTypes:{locale:{control:`select`,options:[`en`,`de`,`fr`,`ar-SA`,`ja-JP`],description:`Language of the settings pages; also sets their direction`,table:{defaultValue:{summary:`en`}}},canUseAi:{table:{disable:!0}},isAvailable:{table:{disable:!0}}},args:{locale:`en`,canUseAi:!0,isAvailable:!0},decorators:[i]},V={render:()=>(0,R.jsx)(z,{children:(0,R.jsx)(g,{})}),parameters:{docs:{story:{height:`460px`},description:{story:`The AI models connected to the portal, one row each with its provider and a menu, and **Add Model** to connect another from a provider's API key or a locally hosted model. On the demo portal the list holds three made-up models, and one added or removed there is gone again after a reload.`},source:{code:`<AiAgentProviders locale="en" isAvailable>
  <AiModels />
</AiAgentProviders>`}}}},H={name:`Model Assignment`,render:()=>(0,R.jsx)(z,{children:(0,R.jsx)(w,{})}),parameters:{docs:{story:{height:`940px`},description:{story:`Which model answers by default, and which one each task uses instead of it: chat, code, summarization, translation, OCR, vision and the rest. The **Default AI model** heading and its description come from the kit's translations; the field's own caption is turned off because it would repeat the heading.`},source:{code:`<AiAgentProviders locale="en" isAvailable>
  <ModelAssignment />
</AiAgentProviders>`}}}},U={name:`MCP Servers`,render:()=>(0,R.jsx)(z,{children:(0,R.jsx)(D,{})}),parameters:{docs:{story:{height:`500px`},description:{story:`The MCP servers whose tools the chat may call. **Edit configuration** opens an inline editor for the servers' JSON configuration, with **Save** and **Cancel**. On the demo portal the page lists the portal's own server and two made-up custom ones; with no server connected, that button is all the page shows.`},source:{code:`<AiAgentProviders locale="en" isAvailable>
  <McpServers />
</AiAgentProviders>`}}}},W={name:`Web Search`,render:()=>(0,R.jsx)(z,{children:(0,R.jsx)(N,{})}),parameters:{docs:{story:{height:`440px`},description:{story:`The search engine the chat uses to look things up on the web, and its API key. The fields are stacked rather than side by side, to fit a settings column. **Save** stays disabled until a key is entered.`},source:{code:`<AiAgentProviders locale="en" isAvailable>
  <WebSearch />
</AiAgentProviders>`}}}},G=[`Models`,`ModelAssignmentPage`,`McpServersList`,`WebSearchSettings`],V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: () => <SettingsFrame>
      <AiModels />
    </SettingsFrame>,
  parameters: {
    docs: {
      story: {
        height: "460px"
      },
      description: {
        story: "The AI models connected to the portal, one row each with its provider and a menu, and **Add Model** to connect another from a provider's API key or a locally hosted model. On the demo portal the list holds three made-up models, and one added or removed there is gone again after a reload."
      },
      source: {
        code: \`<AiAgentProviders locale="en" isAvailable>
  <AiModels />
</AiAgentProviders>\`
      }
    }
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  name: "Model Assignment",
  render: () => <SettingsFrame>
      <ModelAssignment />
    </SettingsFrame>,
  parameters: {
    docs: {
      story: {
        height: "940px"
      },
      description: {
        story: "Which model answers by default, and which one each task uses instead of it: chat, code, summarization, translation, OCR, vision and the rest. The **Default AI model** heading and its description come from the kit's translations; the field's own caption is turned off because it would repeat the heading."
      },
      source: {
        code: \`<AiAgentProviders locale="en" isAvailable>
  <ModelAssignment />
</AiAgentProviders>\`
      }
    }
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  name: "MCP Servers",
  render: () => <SettingsFrame>
      <McpServers />
    </SettingsFrame>,
  parameters: {
    docs: {
      story: {
        height: "500px"
      },
      description: {
        story: "The MCP servers whose tools the chat may call. **Edit configuration** opens an inline editor for the servers' JSON configuration, with **Save** and **Cancel**. On the demo portal the page lists the portal's own server and two made-up custom ones; with no server connected, that button is all the page shows."
      },
      source: {
        code: \`<AiAgentProviders locale="en" isAvailable>
  <McpServers />
</AiAgentProviders>\`
      }
    }
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  name: "Web Search",
  render: () => <SettingsFrame>
      <WebSearch />
    </SettingsFrame>,
  parameters: {
    docs: {
      story: {
        height: "440px"
      },
      description: {
        story: "The search engine the chat uses to look things up on the web, and its API key. The fields are stacked rather than side by side, to fit a settings column. **Save** stays disabled until a key is entered."
      },
      source: {
        code: \`<AiAgentProviders locale="en" isAvailable>
  <WebSearch />
</AiAgentProviders>\`
      }
    }
  }
}`,...W.parameters?.docs?.source}}}})))()}K();export{U as McpServersList,H as ModelAssignmentPage,V as Models,W as WebSearchSettings,G as __namedExportsOrder,B as default};