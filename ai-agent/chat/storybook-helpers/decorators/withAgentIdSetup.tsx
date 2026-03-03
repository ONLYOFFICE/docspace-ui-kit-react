import React from "react";
import type { Decorator } from "@storybook/react-vite";

import AgentIdSetup from "../components/AgentIdSetup";
import usePersistedAgentId from "../hooks/usePersistedAgentId";
import useAgentIdValidation from "../hooks/useAgentIdValidation";
import ManageConnectionIcon from "../../../../assets/manage.connection.react.svg";

import styles from "./withAgentIdSetup.module.scss";

const AgentIdSetupWrapper: React.FC<{
  children: (agentId: string | number) => React.ReactNode;
}> = ({ children }) => {
  const { agentId, saveAgentId, clearAgentId } = usePersistedAgentId();
  const { validateAgentId } = useAgentIdValidation();

  const [validatedAgentId, setValidatedAgentId] = React.useState<
    string | number | null
  >(null);
  const [isValidating, setIsValidating] = React.useState(false);
  const [validationError, setValidationError] = React.useState<
    string | undefined
  >();
  const [showSetup, setShowSetup] = React.useState(false);

  React.useEffect(() => {
    const validatePersistedAgentId = async () => {
      if (!agentId) {
        setShowSetup(true);
        return;
      }

      setIsValidating(true);
      const result = await validateAgentId(agentId);

      if (result.isValid && result.agentId) {
        setValidatedAgentId(result.agentId);
        setShowSetup(false);
      } else {
        setValidationError(result.error);
        setShowSetup(true);
      }
      setIsValidating(false);
    };

    validatePersistedAgentId();
  }, [agentId, validateAgentId]);

  const handleAgentIdConfigured = React.useCallback(
    (newAgentId: string | number) => {
      saveAgentId(newAgentId);
      setValidatedAgentId(newAgentId);
      setValidationError(undefined);
      setShowSetup(false);
    },
    [saveAgentId],
  );

  const handleReset = React.useCallback(() => {
    clearAgentId();
    setValidatedAgentId(null);
    setValidationError(undefined);
    setShowSetup(true);
  }, [clearAgentId]);

  if (isValidating) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontSize: "16px",
          color: "#666",
        }}
      >
        Validating Agent ID...
      </div>
    );
  }

  if (showSetup || !validatedAgentId) {
    return (
      <AgentIdSetup
        onAgentIdConfigured={handleAgentIdConfigured}
        initialAgentId={agentId || undefined}
        initialError={validationError}
      />
    );
  }

  return (
    <>
      {children(validatedAgentId)}
      <button onClick={handleReset} className={styles.configButton}>
        <ManageConnectionIcon className={styles.icon} />
        <span className={styles.label}>Configure AI agent</span>
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
