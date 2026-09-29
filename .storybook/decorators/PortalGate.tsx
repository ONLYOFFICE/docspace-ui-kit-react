import React from "react";
import type { Decorator } from "@storybook/react-vite";

import { useApi } from "../../providers/api";
import { DEFAULT_API_KEY, DEFAULT_API_URL } from "../globals";
import { resolveApiConfig } from "../utils/apiProviders";

import styles from "./PortalGate.module.scss";

export type PortalConnectionState = "checking" | "connected" | "failed";

/**
 * Whether the `apiConfig` toolbar global names a portal at all. With none,
 * `withApiProvider` hands out clients whose base URL is empty, and every call
 * goes to Storybook's own origin and comes back 404 -- so a story that needs
 * a portal should not make a single one.
 */
export const hasPortalConfigured = (apiConfig: string | undefined): boolean => {
  const { url, apiKey } = resolveApiConfig(apiConfig, {
    url: DEFAULT_API_URL,
    apiKey: DEFAULT_API_KEY,
  });
  return Boolean(url && apiKey);
};

/**
 * Asks the portal behind the nearest `ApiProvider` who the key belongs to --
 * the cheapest call that fails on a wrong URL, a wrong key and a refused CORS
 * preflight alike. `enabled: false` skips it and reports "connected", for a
 * story that has a demo mode of its own and needs no portal.
 */
export const usePortalConnection = (enabled = true): PortalConnectionState => {
  const { profilesApi } = useApi();
  const [state, setState] = React.useState<PortalConnectionState>(
    enabled ? "checking" : "connected",
  );

  React.useEffect(() => {
    if (!enabled) {
      setState("connected");
      return;
    }

    let cancelled = false;
    setState("checking");

    profilesApi
      .getSelfProfile()
      .then(() => {
        if (!cancelled) setState("connected");
      })
      .catch(() => {
        if (!cancelled) setState("failed");
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, profilesApi]);

  return state;
};

type PortalGateCardProps = {
  title: string;
  /** `"none"`: no portal is selected, so nothing was asked. */
  state: Exclude<PortalConnectionState, "connected"> | "none";
  description?: string;
};

/**
 * The card a story shows while the check runs, once it has failed, or
 * instead of it when no portal is selected.
 */
export const PortalGateCard = ({
  title,
  state,
  description = "A portal connection is required to load these components.",
}: PortalGateCardProps) => (
  <div className={styles.container}>
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      {state === "checking" ? (
        <p className={styles.spinner}>Checking portal connection...</p>
      ) : state === "none" ? (
        <>
          <p className={styles.description}>{description}</p>
          <p className={styles.notice}>
            No portal is selected. Add one in the API Config toolbar to see this
            story with real data.
          </p>
        </>
      ) : (
        <>
          <p className={styles.description}>{description}</p>
          <div className={styles.error}>
            <span>{"⚠"}</span>
            <span>
              Failed to connect to the portal. Please check your API settings in
              the API Config.
            </span>
          </div>
        </>
      )}
    </div>
  </div>
);

type PortalGateProps = {
  apiConfig: string | undefined;
  title: string;
  description?: string;
  children: React.ReactNode;
};

/**
 * Renders its children only against a portal that answered. With no portal
 * selected it shows the card straight away and makes no request -- the state
 * every story has to render in on the published Storybook, where no key is
 * baked in.
 */
export const PortalGate = ({
  apiConfig,
  title,
  description,
  children,
}: PortalGateProps) => {
  const hasPortal = hasPortalConfigured(apiConfig);
  const connection = usePortalConnection(hasPortal);

  if (!hasPortal) {
    return (
      <PortalGateCard title={title} state="none" description={description} />
    );
  }

  if (connection !== "connected") {
    return (
      <PortalGateCard
        title={title}
        state={connection}
        description={description}
      />
    );
  }

  return children;
};

/**
 * `withPortalGate("Files selector")` for the stories of a module that reads
 * everything it shows from the portal. `withApiProvider` remounts the tree
 * when the toolbar picks another portal, so the check runs again then.
 */
export const withPortalGate =
  (title: string, description?: string): Decorator =>
  (Story, context) => (
    <PortalGate
      apiConfig={context.globals.apiConfig}
      title={title}
      description={description}
    >
      <Story />
    </PortalGate>
  );
