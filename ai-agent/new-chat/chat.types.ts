import type { ChatNoAccessScreenProps } from "./components/chat-no-access-screen";

export interface ChatProps {
  isAgents?: boolean;
  aiReady?: boolean;
  noAccessProps?: ChatNoAccessScreenProps;
}
