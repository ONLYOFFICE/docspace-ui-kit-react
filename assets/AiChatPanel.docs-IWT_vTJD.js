import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r,r as i}from"./blocks-D1qLjfJS.js";import{t as a}from"./jsx-runtime-BdxMnOeJ.js";import{i as o,r as s}from"./react-qN2cStNd.js";import{a as c,c as l,i as u,l as d,n as f,o as p,r as m,s as h,t as g}from"./AiChatPanel.stories-DNTlCz3M.js";function _(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...o(),...e.components};return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(n,{of:g}),`
`,(0,y.jsx)(t.h1,{id:`ai-chat`,children:`AI Chat`}),`
`,(0,y.jsx)(t.p,{children:`A conversation with the portal's AI models, about the files and rooms the user is working in.
Every section of ONLYOFFICE Apps mounts the same chat; what changes between them is a handful
of props — which chips it suggests, whether the model can be changed, whether the user may
write at all.`}),`
`,(0,y.jsx)(r,{of:f}),`
`,(0,y.jsx)(t.h3,{id:`putting-it-on-a-screen`,children:`Putting it on a screen`}),`
`,(0,y.jsxs)(t.p,{children:[`There is no `,(0,y.jsx)(t.code,{children:`AiChatPanel`}),` component to render. `,(0,y.jsx)(t.code,{children:`useAiChatPanel()`}),` returns the panel content
and the state to place it by, and the host decides where it goes — in the DocSpace client, the
info panel beside a section.`]}),`
`,(0,y.jsx)(t.pre,{children:(0,y.jsx)(t.code,{className:`language-tsx`,children:`import { observer } from "mobx-react";

import AiAgentProviders from "@onlyoffice/apps-ui-kit/ai-agent/providers";
import {
  useAiChatPanel,
  useOpenAiChat,
} from "@onlyoffice/apps-ui-kit/ai-agent/ai-chat-panel";

const ChatPanel = observer(() => {
  const { chatPanelContent, isChatPanelVisible, isChatPanelFullscreen, chatPanelWidth } =
    useAiChatPanel();

  if (!isChatPanelVisible) return null;
  return (
    <aside style={{ width: isChatPanelFullscreen ? "100%" : chatPanelWidth }}>
      {chatPanelContent}
    </aside>
  );
});

// Anywhere below the providers: an "Ask AI" action, a deep link.
const AskAiButton = () => <button onClick={useOpenAiChat()}>Ask AI</button>;

<AiAgentProviders locale="en" isAvailable>
  <AskAiButton />
  <ChatPanel />
</AiAgentProviders>;
`})}),`
`,(0,y.jsx)(t.p,{children:`Three things a host has to get right:`}),`
`,(0,y.jsxs)(t.ul,{children:[`
`,(0,y.jsxs)(t.li,{children:[(0,y.jsxs)(t.strong,{children:[`Everything sits inside `,(0,y.jsx)(t.code,{children:`AiAgentProviders`})]}),`, which mounts the store the hook reads; without it the hook throws. Consumers are `,(0,y.jsx)(t.code,{children:`observer`}),`s, or the visibility flags stop updating.`]}),`
`,(0,y.jsxs)(t.li,{children:[(0,y.jsx)(t.strong,{children:`Offering AI is the host's decision.`}),` `,(0,y.jsx)(t.code,{children:`useIsAiChatAvailable()`}),` is `,(0,y.jsx)(t.code,{children:`canUseAi && isAvailable`}),`: whether the session may reach AI at all, and whether this view offers it. Check it before showing a way into the chat.`]}),`
`,(0,y.jsxs)(t.li,{children:[(0,y.jsx)(t.strong,{children:`The surface is the host's.`}),` The panel content has no background or edge of its own; the frame on this page draws both from `,(0,y.jsx)(t.code,{children:`--info-panel-background`}),` and `,(0,y.jsx)(t.code,{children:`--info-panel-border-color`}),`, as the client's info panel does.`]}),`
`]}),`
`,(0,y.jsxs)(t.p,{children:[(0,y.jsx)(t.code,{children:`@onlyoffice/ai-chat`}),` is an optional peer dependency: importing anything under `,(0,y.jsx)(t.code,{children:`ai-agent/`}),`
without it fails at build time, naming the missing package.`]}),`
`,(0,y.jsx)(t.h2,{id:`scenarios`,children:`Scenarios`}),`
`,(0,y.jsx)(t.h3,{id:`suggestions-for-the-section`,children:`Suggestions for the section`}),`
`,(0,y.jsxs)(t.p,{children:[`Chips on the empty chat put a ready prompt into the composer. The host passes a
`,(0,y.jsx)(t.code,{children:`SuggestionSet`}),` — `,(0,y.jsx)(t.code,{children:`default`}),` for an empty composer, `,(0,y.jsx)(t.code,{children:`singleFile`}),` once a file is attached,
`,(0,y.jsx)(t.code,{children:`multipleFiles`}),` for more — and the provider switches between them itself, since only it sees
what is attached.`]}),`
`,(0,y.jsx)(r,{of:h}),`
`,(0,y.jsx)(t.h3,{id:`a-fixed-model-not-shown`,children:`A fixed model, not shown`}),`
`,(0,y.jsxs)(t.p,{children:[(0,y.jsx)(t.code,{children:`hideProfilePicker`}),` removes the picker and its label altogether, for a chat that always talks
to one assistant.`]}),`
`,(0,y.jsx)(r,{of:l}),`
`,(0,y.jsx)(t.h3,{id:`read-only-access`,children:`Read-only access`}),`
`,(0,y.jsxs)(t.p,{children:[(0,y.jsx)(t.code,{children:`composerDisabled`}),` locks the composer while the history stays readable, and `,(0,y.jsx)(t.code,{children:`composerHeader`}),`
says why, above it.`]}),`
`,(0,y.jsx)(r,{of:p}),`
`,(0,y.jsx)(t.h3,{id:`no-ai-model-configured-yet`,children:`No AI model configured yet`}),`
`,(0,y.jsxs)(t.p,{children:[`When the portal has no usable model, the chat opens on a screen that says so. It takes both
`,(0,y.jsx)(t.code,{children:`aiReady: false`}),` and `,(0,y.jsx)(t.code,{children:`noAccessProps`}),` — who the user is, and the handlers behind the screen's
buttons; a button is drawn only when its handler is passed.`]}),`
`,(0,y.jsxs)(t.p,{children:[`On a cloud portal an admin can activate AI on the spot — `,(0,y.jsx)(t.code,{children:`onActivateAI`}),` with a linked card,
`,(0,y.jsx)(t.code,{children:`onTopUpAndActivateAI`}),` without one:`]}),`
`,(0,y.jsx)(r,{of:m}),`
`,(0,y.jsxs)(t.p,{children:[`On a server installation (`,(0,y.jsx)(t.code,{children:`standalone`}),`) an admin is sent to connect a provider, through
`,(0,y.jsx)(t.code,{children:`goToAISettings`}),`:`]}),`
`,(0,y.jsx)(r,{of:c}),`
`,(0,y.jsx)(t.p,{children:`Anyone else is told to ask their administrator:`}),`
`,(0,y.jsx)(r,{of:u}),`
`,(0,y.jsx)(t.p,{children:`A host with no settings page to send the user to — the embedded sdk layouts — leaves both out
and gets the chat widget's own setup screen, which configures a model in place.`}),`
`,(0,y.jsx)(t.h3,{id:`right-to-left`,children:`Right to left`}),`
`,(0,y.jsxs)(t.p,{children:[(0,y.jsx)(t.code,{children:`locale`}),` sets the widget's own strings, and the page's direction mirrors the layout. The texts
the kit passes in — the welcome line, the placeholder — come from the host's translations; this
Storybook loads English only, so those stay in English.`]}),`
`,(0,y.jsxs)(t.p,{children:[`The example is on `,(0,y.jsx)(t.a,{href:`?path=/story/components-ai-chat--right-to-left`,children:`its own page`}),` rather than
here: the kit sets the direction on the whole document, so a right-to-left block on this page
would turn every other block with it.`]}),`
`,(0,y.jsx)(t.h2,{id:`what-renders-in-storybook`,children:`What renders in Storybook`}),`
`,(0,y.jsxs)(t.p,{children:[`The chat follows the `,(0,y.jsx)(t.strong,{children:`API Config`}),` toolbar, like billing and the selectors. With a portal
picked there (or `,(0,y.jsx)(t.code,{children:`.env`}),` filled in), every `,(0,y.jsx)(t.code,{children:`/api/2.0/ai`}),` request goes to that portal with
`,(0,y.jsx)(t.code,{children:`Authorization: Bearer <key>`}),`, through the `,(0,y.jsx)(t.code,{children:`serverApi`}),` prop of `,(0,y.jsx)(t.code,{children:`AiAgentProviders`}),`, and the chat
runs as the key's owner — their threads, their models. The portal's AI service has to accept
the Storybook origin, which it does once `,(0,y.jsx)(t.code,{children:`core:cors`}),` allows it.`]}),`
`,(0,y.jsxs)(t.p,{children:[`With nothing configured, the chat talks to the demo portal instead, under a `,(0,y.jsx)(t.strong,{children:`Demo data`}),`
banner: a mock service worker answers it from `,(0,y.jsx)(t.code,{children:`.storybook/mocks/`}),`, in `,(0,y.jsx)(t.code,{children:`pnpm storybook`}),` and the
static build alike. It has three made-up models, two past threads, and a streamed reply that
echoes the prompt; everything is kept in memory until the page reloads, and nothing reaches a
model. `,(0,y.jsx)(t.strong,{children:`Connect a portal`}),` on the banner opens the API Config form.`]}),`
`,(0,y.jsx)(t.h2,{id:`properties`,children:`Properties`}),`
`,(0,y.jsx)(i,{})]})}function v(e={}){let{wrapper:t}={...o(),...e.components};return t?(0,y.jsx)(t,{...e,children:(0,y.jsx)(_,{...e})}):_(e)}var y;function b(){return(b=e((()=>{y=a(),s(),t(),d()})))()}b();export{v as default};