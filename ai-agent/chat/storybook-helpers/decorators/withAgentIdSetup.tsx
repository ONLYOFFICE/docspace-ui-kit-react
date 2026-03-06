import React from "react";
import type { Decorator } from "@storybook/react-vite";

import AgentIdSetup from "../components/AgentIdSetup";
import usePersistedAgentId from "../hooks/usePersistedAgentId";
import TrashIcon from "../../../../assets/icons/16/trash.react.svg";

import styles from "./withAgentIdSetup.module.scss";

const AgentIdSetupWrapper: React.FC<{
  children: (agentId: string | number) => React.ReactNode;
}> = ({ children }) => {
  const { agentId, saveAgentId, clearAgentId } = usePersistedAgentId();

  const [validatedAgentId, setValidatedAgentId] = React.useState<
    string | number | null
  >(agentId);
  const [showSetup, setShowSetup] = React.useState(!agentId);

  React.useEffect(() => {
    if (agentId) {
      setValidatedAgentId(agentId);
      setShowSetup(false);
    } else {
      setValidatedAgentId(null);
      setShowSetup(true);
    }
  }, [agentId]);

  const handleAgentIdConfigured = React.useCallback(
    (newAgentId: string | number) => {
      saveAgentId(newAgentId);
      setValidatedAgentId(newAgentId);
      setShowSetup(false);
    },
    [saveAgentId],
  );

  const handleReset = React.useCallback(() => {
    clearAgentId();
  }, [clearAgentId]);

  if (showSetup || !validatedAgentId) {
    return (
      <AgentIdSetup
        onAgentIdConfigured={handleAgentIdConfigured}
      />
    );
  }

  return (
    <>
      {children(validatedAgentId)}
      <button onClick={handleReset} className={styles.resetButton}>
        <TrashIcon className={styles.icon} />
        <span className={styles.label}>Reset AI agent</span>
      </button>
    </>
  );
};

export const withAgentIdSetup: Decorator = (Story, context) => {
  const needsAgentId = context.parameters?.requireAgentId !== false;

  if (!needsAgentId) {
    return <Story />;
  }

  return (
    <AgentIdSetupWrapper>
      {(agentId) => <Story args={{ ...context.args, agentId }} />}
    </AgentIdSetupWrapper>
  );
};
