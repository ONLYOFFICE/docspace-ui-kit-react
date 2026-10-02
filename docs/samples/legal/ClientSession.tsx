import { type ReactNode, useMemo, useState } from "react";

import { Button, ButtonSize } from "../../../components/button";
import { Link, LinkTarget, LinkType } from "../../../components/link";
import { Text } from "../../../components/text";
import { ApiProvider, useApi } from "../../../providers/api";
import { CLIENT_SCOPES, callbackUrl, readClientId } from "./clientApp";
import { useOAuthSignIn } from "./useOAuthSignIn";
import styles from "./legal.module.scss";

/**
 * The client's half of any screen: sign a client in with the sample's OAuth
 * app, then render `children` under a provider that holds the client's own
 * token, so every call inside runs as them and the portal shows them only
 * what is theirs.
 *
 * With no portal configured, `demo` is rendered instead -- the same children,
 * fed the portal's imitated answer for a client.
 */
export const ClientSession = ({
  children,
  demo,
}: {
  children: ReactNode;
  demo: ReactNode;
}) => {
  const { baseUrl } = useApi();
  const [clientId] = useState(readClientId);
  const redirectUri = useMemo(callbackUrl, []);
  const oauth = useOAuthSignIn({
    portalUrl: baseUrl,
    clientId,
    redirectUri,
    scopes: CLIENT_SCOPES,
  });

  if (!baseUrl) return demo;

  if (!clientId) {
    return (
      <Text as="p" fontSize="13px" lineHeight="20px">
        A client signs in as themselves, with the sample&apos;s OAuth app.
        Register it once in{" "}
        <Link
          type={LinkType.page}
          href={new URL(
            "./?path=/docs/samples-legal-practice-setup-who-is-signed-in--docs",
            document.baseURI,
          ).toString()}
          target={LinkTarget.top}
          color="accent"
          isHovered
          fontSize="13px"
        >
          Who is signed in
        </Link>
        , then come back here.
      </Text>
    );
  }

  if (oauth.status === "signed-in") {
    return (
      <>
        <div className={styles.statusRow}>
          <Button
            size={ButtonSize.small}
            label="Sign out"
            onClick={oauth.signOut}
          />
          <Text fontSize="12px">
            Everything below runs with the client&apos;s token.
          </Text>
        </div>
        <ApiProvider
          url={baseUrl}
          apiKey={oauth.token}
          initSocket={false}
          useBearerForRawClient
        >
          {children}
        </ApiProvider>
      </>
    );
  }

  return (
    <>
      <div className={styles.statusRow}>
        <Button
          primary
          size={ButtonSize.small}
          label={
            oauth.status === "waiting"
              ? "Waiting for the portal..."
              : oauth.status === "exchanging"
                ? "Getting the token..."
                : "Sign in with ONLYOFFICE"
          }
          isLoading={
            oauth.status === "waiting" || oauth.status === "exchanging"
          }
          onClick={oauth.signIn}
        />
        <Text fontSize="12px">
          Sign in as a client — a guest on the portal — to see only what was
          shared with them.
        </Text>
      </div>
      {oauth.error ? (
        <div className={styles.statusRow} role="alert">
          <Text as="span" className={`${styles.badge} ${styles.badgeError}`}>
            Sign-in failed
          </Text>
          <Text fontSize="13px" lineHeight="20px">
            {oauth.error}
          </Text>
        </div>
      ) : null}
    </>
  );
};
