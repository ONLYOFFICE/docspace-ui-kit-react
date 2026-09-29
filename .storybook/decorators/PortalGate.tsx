import React from "react";

import { useApi } from "../../providers/api";

import styles from "./PortalGate.module.scss";

export type PortalConnectionState = "checking" | "connected" | "failed";

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
  state: Exclude<PortalConnectionState, "connected">;
  description?: string;
};

/** The card a story shows while the check runs, or once it has failed. */
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
