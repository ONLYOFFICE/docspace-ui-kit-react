import React from "react";
import type { Decorator } from "@storybook/react-vite";

import AgentIdSetup from "../components/AgentIdSetup";
import usePersistedAgentId from "../hooks/usePersistedAgentId";
import useAgentIdValidation from "../hooks/useAgentIdValidation";

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
      <button
        onClick={handleReset}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 16px",
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 500,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          zIndex: 9999,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f5f5f5";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#fff";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
        }}
      >
        🔄 Change Agent ID
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
