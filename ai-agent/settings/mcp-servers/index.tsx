import { McpServersPage } from "@onlyoffice/ai-chat";

// Rendered in the portal's administrator settings: a tool switched off here
// is off for every user, so the page edits the tenant list, not the
// administrator's own (Bug 84381). The composer's toggles stay personal.
const McpServers = () => {
  return <McpServersPage hideHeader noPadding toolPrefsScope="tenant" />;
};

export default McpServers;
