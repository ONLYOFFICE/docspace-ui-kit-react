import { McpServersPage } from "@onlyoffice/ai-chat";
import type { ToolPrefsScope } from "@onlyoffice/ai-chat";

type McpServersProps = {
  /**
   * Which disabled tool list the page edits. Pass `"tenant"` only where the
   * viewer administers the portal, so a tool switched off there is off for
   * every user (Bug 84381). Omitted, the page edits the viewer's own list -
   * the right scope for anyone else, since a non-administrator's toggles
   * must never land in the list that applies to the whole portal.
   */
  toolPrefsScope?: ToolPrefsScope;
};

const McpServers = ({ toolPrefsScope }: McpServersProps) => {
  return (
    <McpServersPage hideHeader noPadding toolPrefsScope={toolPrefsScope} />
  );
};

export default McpServers;
