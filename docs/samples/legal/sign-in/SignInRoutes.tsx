import { useCallback, useEffect, useMemo, useState } from "react";

import { Avatar, AvatarRole, AvatarSize } from "../../../../components/avatar";
import { Button, ButtonSize } from "../../../../components/button";
import { FieldContainer } from "../../../../components/field-container";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../../components/heading";
import { Link, LinkTarget, LinkType } from "../../../../components/link";
import { RadioButtonGroup } from "../../../../components/radio-button-group";
import { Text } from "../../../../components/text";
import {
  InputSize,
  InputType,
  TextInput,
} from "../../../../components/text-input";
import { ApiProvider, useApi } from "../../../../providers/api";
import { type Persona, personaFromRoles, type PersonaInfo } from "../persona";
import { useOAuthAppSetup } from "../useOAuthAppSetup";
import { useOAuthSignIn } from "../useOAuthSignIn";
import { usePortal } from "../usePortal";
import { usePortalImage } from "../usePortalImage";
import styles from "../legal.module.scss";

/**
 * Who is signed in, and therefore which application they get.
 *
 * Three ways a request reaches the portal with an identity, and they are not
 * interchangeable:
 *
 *   API key        one identity, the key's owner. The firm's own back office.
 *   Portal session the person already signed in to the portal, when the
 *                  application is served from the portal's origin. What the
 *                  ONLYOFFICE Apps client itself does.
 *   OAuth          the person signs in on the portal and allows this
 *                  application; it gets a token that is theirs. The only one of
 *                  the three that lets a client use an application hosted
 *                  anywhere else as themselves.
 *
 * Whichever route, the persona -- lawyer's workspace or client cabinet -- is
 * read from the portal's own roles by `personaFromRoles`.
 */

/** Not secrets: a public client id and where it is registered to answer. */
const CLIENT_ID_KEY = "legal-samples-oauth-client-id";

const CLIENT_SCOPES = [
  "openid",
  "accounts.self:read",
  "rooms:read",
  "files:read",
  "files:write",
];

const WORKSPACES: Record<Persona, { title: string; items: string[] }> = {
  lawyer: {
    title: "Lawyer's workspace",
    items: ["Matter board", "Clients", "Document assembly", "Deadlines"],
  },
  client: {
    title: "Client cabinet",
    items: ["My matters", "Documents to provide", "Signed documents"],
  },
};

const PersonaBadge = ({ info }: { info: PersonaInfo }) => (
  <Text as="span" className={styles.badge}>
    {`${info.label} → ${WORKSPACES[info.persona].title}`}
  </Text>
);

const Identity = ({
  name,
  email,
  avatarPath,
  info,
}: {
  name: string;
  email: string;
  avatarPath?: string;
  info: PersonaInfo;
}) => {
  const avatar = usePortalImage(avatarPath);

  return (
    <div className={styles.identity}>
      <Avatar
        size={AvatarSize.base}
        role={info.persona === "client" ? AvatarRole.guest : AvatarRole.user}
        source={avatar}
        userName={name}
      />
      <div>
        <Text as="p" className={styles.factValue}>
          {name}
        </Text>
        <Text as="p" className={styles.factLabel}>
          {email}
        </Text>
      </div>
      <PersonaBadge info={info} />
    </div>
  );
};

/** Runs under the client's own token: every call here is the client's. */
const SignedInAs = ({ onPersona }: { onPersona: (p: PersonaInfo) => void }) => {
  const { profilesApi } = useApi();
  const [me, setMe] = useState<{
    name: string;
    email: string;
    avatar?: string;
    info: PersonaInfo;
  }>();
  const [failed, setFailed] = useState("");

  useEffect(() => {
    let cancelled = false;

    profilesApi
      .getSelfProfile()
      .then(({ data }) => {
        if (cancelled) return;
        const profile = data.response;
        const info = personaFromRoles(profile ?? {});
        setMe({
          name: profile?.displayName ?? profile?.email ?? "Unknown",
          email: profile?.email ?? "",
          avatar: profile?.hasAvatar
            ? (profile.avatarMedium ?? profile.avatar ?? undefined)
            : undefined,
          info,
        });
        onPersona(info);
      })
      .catch((error) => {
        if (!cancelled) setFailed((error as Error).message);
      });

    return () => {
      cancelled = true;
    };
  }, [profilesApi, onPersona]);

  if (failed) {
    return (
      <Text as="p" fontSize="13px">
        {`The token was issued, but the profile request failed: ${failed}.`}
      </Text>
    );
  }

  if (!me) return <Text fontSize="13px">Asking the portal who this is...</Text>;

  return (
    <Identity
      name={me.name}
      email={me.email}
      avatarPath={me.avatar}
      info={me.info}
    />
  );
};

export const SignInRoutes = () => {
  const portal = usePortal();
  const { baseUrl } = useApi();

  const [clientId, setClientId] = useState(() => {
    try {
      return localStorage.getItem(CLIENT_ID_KEY) ?? "";
    } catch {
      return "";
    }
  });

  // The page next to the preview, so it is right under a path prefix too.
  const redirectUri = useMemo(
    () => new URL("oauth-callback.html", document.baseURI).toString(),
    [],
  );

  const rememberClientId = useCallback((value: string) => {
    setClientId(value);
    try {
      localStorage.setItem(CLIENT_ID_KEY, value);
    } catch {
      // A private window: the id simply is not remembered.
    }
  }, []);

  const appSetup = useOAuthAppSetup({
    redirectUri,
    scopes: CLIENT_SCOPES,
    onCreated: rememberClientId,
  });

  const oauth = useOAuthSignIn({
    portalUrl: baseUrl,
    clientId,
    redirectUri,
    scopes: CLIENT_SCOPES,
  });

  const [oauthPersona, setOauthPersona] = useState<PersonaInfo>();
  const [demoPersona, setDemoPersona] = useState<Persona>("lawyer");

  useEffect(() => {
    if (oauth.status !== "signed-in") setOauthPersona(undefined);
  }, [oauth.status]);

  const keyPersona =
    portal.status === "connected" && portal.me
      ? personaFromRoles(portal.me.roles)
      : undefined;

  // The screen follows the most specific identity it has.
  const shown: Persona =
    oauthPersona?.persona ?? keyPersona?.persona ?? demoPersona;

  const sameOrigin =
    Boolean(baseUrl) && new URL(baseUrl).origin === window.location.origin;

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeading}>
        <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
          Who is signed in
        </Heading>
        <Text as="p" className={styles.sectionSubtitle}>
          Three routes carry an identity to the portal. The persona — lawyer or
          client — is read from the portal&apos;s own roles, whichever route it
          came by.
        </Text>
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          API key — the firm&apos;s own identity
        </Text>
        {keyPersona && portal.me ? (
          <Identity
            name={portal.me.displayName}
            email={portal.me.email}
            avatarPath={portal.me.avatar}
            info={keyPersona}
          />
        ) : (
          <Text as="p" fontSize="13px" lineHeight="20px">
            {portal.status === "demo"
              ? "No portal is configured — connect one from the toolbar, as in the previous sample."
              : portal.status === "loading"
                ? "Asking the portal..."
                : (portal.detail ?? "The portal did not answer.")}
          </Text>
        )}
        <Text as="p" fontSize="12px" lineHeight="18px">
          One person — whoever issued the key. Right for the lawyer&apos;s
          workspace, where the application acts for the firm; wrong for a
          client, who must never see another client&apos;s matters.
        </Text>
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          Portal session — served from the portal
        </Text>
        <Text as="p" fontSize="13px" lineHeight="20px">
          {sameOrigin
            ? "This page is on the portal's origin, so the session cookie is sent with every request."
            : `This page is ${window.location.origin}${
                baseUrl ? `, the portal is ${new URL(baseUrl).origin}` : ""
              } — the portal's session cookie never reaches it.`}
        </Text>
        <Text as="p" fontSize="12px" lineHeight="18px">
          The ONLYOFFICE Apps client works this way: it passes the{" "}
          <code>asc_auth_key</code> cookie to <code>ApiProvider</code> as its{" "}
          <code>apiKey</code>. An application of your own can do the same only
          if the portal serves it — a plugin, say.
        </Text>
      </div>

      <div className={styles.card}>
        <Text as="p" className={styles.sectionTitle}>
          OAuth — the client signs in as themselves
        </Text>

        <FieldContainer
          isVertical
          labelVisible
          removeMargin
          labelText="Client ID"
        >
          <TextInput
            type={InputType.text}
            size={InputSize.base}
            scale
            value={clientId}
            placeholder="From Developer Tools → OAuth on the portal"
            onChange={(event) => rememberClientId(event.target.value.trim())}
          />
        </FieldContainer>

        {clientId && baseUrl ? (
          <Link
            type={LinkType.page}
            href={appSetup.appUrl(clientId)}
            target={LinkTarget.blank}
            color="accent"
            isHovered
            fontSize="13px"
          >
            Open the app in ONLYOFFICE
          </Link>
        ) : null}

        {!clientId && keyPersona ? (
          appSetup.available ? (
            <div className={styles.statusRow}>
              <Button
                size={ButtonSize.small}
                label="Create the OAuth app"
                isLoading={appSetup.status === "working"}
                onClick={appSetup.create}
              />
              <Text fontSize="12px" lineHeight="18px">
                {`Registers it for ${portal.me?.displayName ?? "the key's owner"}: PKCE on, this redirect URI and origin, these scopes.`}
              </Text>
            </div>
          ) : (
            <Text as="p" fontSize="13px" lineHeight="20px">
              <Link
                type={LinkType.page}
                href={appSetup.createUrl}
                target={LinkTarget.blank}
                color="accent"
                isHovered
                fontSize="13px"
              >
                Create it in ONLYOFFICE
              </Link>{" "}
              — tick <b>Allow public client (PKCE)</b>, add the redirect URI and
              the origin below, choose the scopes, then paste the Client ID
              here. A static build cannot create it for you: the portal&apos;s
              app registry answers no request from another origin.
            </Text>
          )
        ) : null}

        {appSetup.status === "done" ? (
          <Text as="p" fontSize="12px" lineHeight="18px">
            {appSetup.existed
              ? "Found the app already registered for this redirect URI — nothing new was created."
              : "Created on the portal. Its Client ID is in the field above."}
          </Text>
        ) : null}

        {appSetup.status === "error" ? (
          <Text as="p" fontSize="13px" lineHeight="20px">
            {appSetup.error}
          </Text>
        ) : null}

        <div className={styles.facts}>
          <div>
            <Text as="p" className={styles.factLabel}>
              Redirect URI to register
            </Text>
            <Text as="p" className={styles.factValue}>
              {redirectUri}
            </Text>
          </div>
          <div>
            <Text as="p" className={styles.factLabel}>
              Allowed origin to register
            </Text>
            <Text as="p" className={styles.factValue}>
              {window.location.origin}
            </Text>
          </div>
          <div>
            <Text as="p" className={styles.factLabel}>
              Scopes
            </Text>
            <Text as="p" className={styles.factValue}>
              {CLIENT_SCOPES.join(" ")}
            </Text>
          </div>
        </div>

        <div className={styles.statusRow}>
          {oauth.status === "signed-in" ? (
            <Button
              size={ButtonSize.small}
              label="Sign out"
              onClick={oauth.signOut}
            />
          ) : (
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
              isDisabled={!baseUrl || !clientId}
              onClick={oauth.signIn}
            />
          )}
          {!baseUrl ? (
            <Text fontSize="12px">Needs a connected portal.</Text>
          ) : !clientId ? (
            <Text fontSize="12px">Needs the Client ID of a PKCE app.</Text>
          ) : null}
        </div>

        {oauth.error ? (
          <Text as="p" fontSize="13px" lineHeight="20px">
            {oauth.error}
          </Text>
        ) : null}

        {oauth.status === "signed-in" ? (
          <ApiProvider
            url={baseUrl}
            apiKey={oauth.token}
            initSocket={false}
            useBearerForRawClient
          >
            <SignedInAs onPersona={setOauthPersona} />
          </ApiProvider>
        ) : null}
      </div>

      <div className={styles.card}>
        <div className={styles.statusRow}>
          <Text as="p" className={styles.sectionTitle}>
            What they get
          </Text>
          {!oauthPersona && !keyPersona ? (
            <RadioButtonGroup
              name="demo-persona"
              orientation="horizontal"
              spacing="16px"
              selected={demoPersona}
              options={[
                { value: "lawyer", label: "Show as a lawyer" },
                { value: "client", label: "Show as a client" },
              ]}
              onClick={(event) => setDemoPersona(event.target.value as Persona)}
            />
          ) : null}
        </div>
        <div className={styles.columns2}>
          {(Object.keys(WORKSPACES) as Persona[]).map((persona) => (
            <div
              key={persona}
              className={styles.card}
              style={{ opacity: persona === shown ? 1 : 0.45 }}
            >
              <Text as="p" className={styles.factValue}>
                {WORKSPACES[persona].title}
              </Text>
              <ul className={styles.list}>
                {WORKSPACES[persona].items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
