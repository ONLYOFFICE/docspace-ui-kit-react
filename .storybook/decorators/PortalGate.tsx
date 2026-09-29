import React from "react";
import type { Decorator } from "@storybook/react-vite";

import { useApi } from "../../providers/api";
import { DEFAULT_API_KEY, DEFAULT_API_URL } from "../globals";
import { resolveApiConfig } from "../utils/apiProviders";

import { DemoBanner, REGISTER_PORTAL_URL } from "./DemoBanner";
import { CONNECT_PORTAL_EVENT } from "../addons/events";
import { addons } from "storybook/preview-api";

import styles from "./PortalGate.module.scss";

export type PortalConnectionState = "checking" | "connected" | "failed";

/**
 * Whether the `apiConfig` toolbar global names a portal at all. With none,
 * `withApiProvider` points the clients at the demo portal, which the mock
 * service worker plays (`.storybook/mocks`), and a story shows made-up data
 * under a banner that says so.
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
  /** Lets "Connect a portal" reopen this story on the canvas, where the toolbar is. */
  storyId?: string;
};

/**
 * The card a story shows while the check runs, once it has failed, or
 * instead of it when no portal is selected.
 */
export const PortalGateCard = ({
  title,
  state,
  description = "A portal connection is required to load these components.",
  storyId,
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
            <span className={styles.arrow} aria-hidden="true">
              {"↑"}
            </span>
            No portal is selected. Add one in the toolbar above, with the API
            Config menu that reads <b>Default</b>, to see this story with real
            data.
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.connect}
              onClick={() =>
                addons.getChannel().emit(CONNECT_PORTAL_EVENT, { storyId })
              }
            >
              Connect a portal
            </button>
            <a href={REGISTER_PORTAL_URL} target="_blank" rel="noreferrer">
              Get a free portal
            </a>
          </div>
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

export type PortalGateOptions = {
  /**
   * Whether the module renders against the demo portal when none is
   * selected. `false` for one the fixtures cannot stand in for -- the
   * document editor needs a real Document Server -- which then shows the
   * card instead.
   * @default true
   */
  demo?: boolean;
};

type PortalGateProps = PortalGateOptions & {
  apiConfig: string | undefined;
  title: string;
  description?: string;
  storyId?: string;
  children: React.ReactNode;
};

/**
 * Renders its children against a portal that answered. With no portal
 * selected -- the state every story has to render in on the published
 * Storybook, where no key is baked in -- it renders them against the demo
 * portal under a banner saying the data is made up, or, with `demo: false`,
 * shows the card and makes no request at all.
 */
export const PortalGate = ({
  apiConfig,
  title,
  description,
  storyId,
  demo = true,
  children,
}: PortalGateProps) => {
  const hasPortal = hasPortalConfigured(apiConfig);
  const connection = usePortalConnection(hasPortal);

  if (!hasPortal) {
    if (demo && storyId) {
      return (
        <>
          <DemoBanner storyId={storyId} />
          {children}
        </>
      );
    }
    return (
      <PortalGateCard
        title={title}
        state="none"
        description={description}
        storyId={storyId}
      />
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
  (
    title: string,
    description?: string,
    options: PortalGateOptions = {},
  ): Decorator =>
  (Story, context) => (
    <PortalGate
      apiConfig={context.globals.apiConfig}
      title={title}
      description={description}
      storyId={context.id}
      demo={options.demo}
    >
      <Story />
    </PortalGate>
  );
