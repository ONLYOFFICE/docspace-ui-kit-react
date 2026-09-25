import { useCallback, useState } from "react";

import FormIconUrl from "../../../assets/icons/32/form.svg?url";
import { useApi } from "../../../providers/api";

/**
 * Registers the sample's OAuth app on the portal for whoever holds the API
 * key, so a reader does not fill the portal's form by hand.
 *
 * It asks the dev server (`.storybook/oauth-app-proxy.ts`) to do it, because
 * the portal's client-management service answers no cross-origin request --
 * see that file. `available` is therefore false in a static build, and the
 * screen offers the portal's own form instead, with the values to paste.
 *
 * The app is exactly what the sign-in needs: PKCE on, the redirect URI and
 * origin of this page, the scopes a client cabinet uses. The portal insists on
 * an icon and three URLs; the icon is one of the kit's own, the URLs point at
 * this sample.
 */
export type OAuthAppSetup = {
  available: boolean;
  status: "idle" | "working" | "done" | "error";
  clientId: string;
  existed: boolean;
  error: string;
  create: () => void;
  /** The app's page in the portal's Developer Tools. */
  appUrl: (clientId: string) => string;
  /** The portal's own form, for a static build. */
  createUrl: string;
};

const toDataUrl = async (url: string) => {
  const blob = await (await fetch(url)).blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
};

export const useOAuthAppSetup = ({
  redirectUri,
  scopes,
  onCreated,
}: {
  redirectUri: string;
  scopes: string[];
  onCreated: (clientId: string) => void;
}): OAuthAppSetup => {
  const { apiClient, baseUrl } = useApi();
  const [state, setState] = useState<{
    status: OAuthAppSetup["status"];
    clientId: string;
    existed: boolean;
    error: string;
  }>({ status: "idle", clientId: "", existed: false, error: "" });

  const create = useCallback(async () => {
    setState({ status: "working", clientId: "", existed: false, error: "" });

    try {
      // The provider's own header, key and scheme as it sends them.
      const authorization = (
        apiClient.instance.defaults.headers as Record<string, unknown>
      ).Authorization;

      const origin = window.location.origin;
      const samplePage = new URL(
        "/?path=/docs/samples-legal-practice-02-who-is-signed-in--docs",
        origin,
      ).toString();

      const response = await fetch(
        new URL("__samples/oauth-app", document.baseURI),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            portalUrl: baseUrl,
            authorization,
            app: {
              name: "Legal practice samples",
              description:
                "The client cabinet from the ONLYOFFICE Apps UI Kit samples: signs a client in with PKCE.",
              logo: await toDataUrl(FormIconUrl),
              scopes,
              allow_pkce: true,
              is_public: false,
              website_url: samplePage,
              terms_url: samplePage,
              policy_url: samplePage,
              redirect_uris: [redirectUri],
              allowed_origins: [origin],
              logout_redirect_uri: samplePage,
            },
          }),
        },
      );

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload.clientId) {
        const step =
          payload.step === "signature"
            ? "The key was refused for a signature"
            : payload.step === "create"
              ? "The portal refused to create the app"
              : "The request failed";
        throw new Error(
          `${step}${payload.status ? ` (${payload.status})` : ""}: ${payload.error ?? response.statusText}`,
        );
      }

      setState({
        status: "done",
        clientId: payload.clientId,
        existed: Boolean(payload.existed),
        error: "",
      });
      onCreated(payload.clientId);
    } catch (error) {
      setState({
        status: "error",
        clientId: "",
        existed: false,
        error: (error as Error).message,
      });
    }
  }, [apiClient, baseUrl, redirectUri, scopes, onCreated]);

  return {
    available: import.meta.env.DEV,
    ...state,
    create,
    appUrl: (clientId) =>
      baseUrl
        ? new URL(`/developer-tools/oauth/${clientId}`, baseUrl).toString()
        : "",
    createUrl: baseUrl
      ? new URL("/developer-tools/oauth/create", baseUrl).toString()
      : "",
  };
};
