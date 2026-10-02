import NewChat from "../../../new-chat";
import type { ChatProps } from "../../../new-chat/chat.types";

export type AiChatPanelBodyProps = Pick<ChatProps, "aiReady" | "noAccessProps">;

const AiChatPanelBody = ({ aiReady, noAccessProps }: AiChatPanelBodyProps) => {
  return <NewChat aiReady={aiReady} noAccessProps={noAccessProps} />;
};

export default AiChatPanelBody;
