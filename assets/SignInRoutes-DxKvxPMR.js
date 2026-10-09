import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n,p as r}from"./blocks-D1qLjfJS.js";import{t as i}from"./jsx-runtime-BdxMnOeJ.js";import{i as a,r as o}from"./react-qN2cStNd.js";import{n as s,t as c}from"./Source-CbxT880K.js";import{n as l,r as u,t as d}from"./SignInRoutes.stories-UZXLUUk0.js";var f;function p(){return(p=e((()=>{f=`import { useCallback, useEffect, useRef, useState } from "react";

import { createPkcePair, createState } from "./pkce";

/**
 * "Sign in with ONLYOFFICE" for a client who should see only their own matters.
 *
 * The flow, as the portal documents it for a public client with PKCE:
 *
 *   1. open a popup at the portal's authorize endpoint, carrying the app's
 *      client id, the redirect URI registered for it, the scopes, a \`state\`
 *      nonce and the S256 \`code_challenge\`;
 *   2. the client signs in on the portal and allows the app;
 *   3. the portal sends the popup to the redirect URI with \`?code&state\`;
 *      that page (\`.storybook/public/oauth-callback.html\` here) posts
 *      both back to this window and closes;
 *   4. this window checks \`state\`, then trades the code and the
 *      \`code_verifier\` for an access token at the token endpoint.
 *
 * The token goes to \`ApiProvider\` as \`apiKey\`, which sends it as \`Bearer\`, and
 * everything below it runs as the client. It stays in memory: storage that
 * survives a reload is storage any script on the page can read.
 *
 * Four details that decide whether it works at all:
 *
 *   - the popup is opened synchronously in the click, before any \`await\`,
 *     and pointed at the portal afterwards. Opening it after hashing the
 *     verifier loses the click and the browser blocks it;
 *   - the answer comes by \`postMessage\`, accepted only from this origin and
 *     only with the \`state\` this request made. The kit's \`getOAuthToken\`
 *     polls \`localStorage\` instead and checks no \`state\`;
 *   - the endpoints come from the portal's discovery document, which, like
 *     the token endpoint, answers any origin;
 *   - \`scope\` is the last parameter of the authorize URL, or the portal's
 *     consent page drops \`state\` and the challenge -- see \`authorizeUrl\`.
 */
export type OAuthStatus =
  "idle" | "waiting" | "exchanging" | "signed-in" | "error";

export type OAuthSignIn = {
  status: OAuthStatus;
  token: string;
  error: string;
  signIn: () => void;
  signOut: () => void;
};

type Endpoints = { authorize: string; token: string };

const CALLBACK_SOURCE = "docspace-oauth-callback";

/**
 * The authorize URL, with \`scope\` deliberately last.
 *
 * The order matters on a real portal. Its consent page keeps the authorize URL
 * in a cookie, and when it has to send the browser round once more -- the
 * first time a person consents, before their signature cookie exists -- it
 * rebuilds the URL as everything before \`&scope=\` plus the scopes it
 * understood. Whatever came after \`scope\` is gone: with \`state\` there, the
 * code comes back without it; with \`code_challenge\` there, the exchange has
 * nothing to check the verifier against.
 */
export const authorizeUrl = (
  endpoint: string,
  params: {
    clientId: string;
    redirectUri: string;
    state: string;
    codeChallenge: string;
    scopes: string[];
  },
) => {
  const url = new URL(endpoint);
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    state: params.state,
    code_challenge_method: "S256",
    code_challenge: params.codeChallenge,
    scope: params.scopes.join(" "),
  }).toString();
  return url.toString();
};

const discover = async (portalUrl: string): Promise<Endpoints> => {
  const fallback = {
    authorize: new URL("/oauth2/authorize", portalUrl).toString(),
    token: new URL("/oauth2/token", portalUrl).toString(),
  };

  try {
    const response = await fetch(
      new URL("/.well-known/openid-configuration", portalUrl),
    );
    if (!response.ok) return fallback;
    const config = await response.json();
    return {
      authorize: config.authorization_endpoint ?? fallback.authorize,
      token: config.token_endpoint ?? fallback.token,
    };
  } catch {
    return fallback;
  }
};

export const useOAuthSignIn = ({
  portalUrl,
  clientId,
  redirectUri,
  scopes,
}: {
  portalUrl: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
}): OAuthSignIn => {
  const [status, setStatus] = useState<OAuthStatus>("idle");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  // Everything the answer has to be checked against lives here, and only here.
  const pending = useRef<{
    state: string;
    verifier: string;
    endpoints: Endpoints;
    popup: Window | null;
  } | null>(null);

  const fail = useCallback((message: string) => {
    pending.current?.popup?.close();
    pending.current = null;
    setError(message);
    setStatus("error");
  }, []);

  useEffect(() => {
    const onMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.source !== CALLBACK_SOURCE) return;

      const request = pending.current;
      if (!request) return;

      const {
        code,
        state,
        error: denied,
      } = event.data as {
        code?: string;
        state?: string;
        error?: string;
      };

      if (denied) return fail(\`The portal answered "\${denied}".\`);
      if (!code) return fail("The portal sent no authorization code back.");
      if (!state) {
        return fail(
          "The code came back without the state this request sent, so it was ignored.",
        );
      }
      if (state !== request.state) {
        return fail(
          "The code came back for a different request, so it was ignored.",
        );
      }

      pending.current = null;
      setStatus("exchanging");

      try {
        const response = await fetch(request.endpoints.token, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            code_verifier: request.verifier,
          }),
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok || !payload.access_token) {
          return fail(
            payload.error_description ??
              payload.error ??
              \`The token endpoint answered \${response.status}.\`,
          );
        }

        setToken(payload.access_token);
        setStatus("signed-in");
      } catch (exception) {
        fail((exception as Error).message ?? "The token request failed.");
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [clientId, redirectUri, fail]);

  // A popup the user closes answers nothing; notice, and stop waiting.
  useEffect(() => {
    if (status !== "waiting") return;

    const timer = window.setInterval(() => {
      if (pending.current?.popup?.closed) {
        pending.current = null;
        setStatus("idle");
      }
    }, 500);

    return () => window.clearInterval(timer);
  }, [status]);

  const signIn = useCallback(() => {
    if (!portalUrl || !clientId) return;

    // Synchronously, inside the click -- see the note above.
    const popup = window.open(
      "",
      "docspace-oauth",
      "popup,width=520,height=720",
    );

    if (!popup) {
      fail(
        "The browser blocked the sign-in window. Allow pop-ups for this page.",
      );
      return;
    }

    setError("");
    setStatus("waiting");

    (async () => {
      const [endpoints, pkce] = await Promise.all([
        discover(portalUrl),
        createPkcePair(),
      ]);
      const state = createState();

      pending.current = { state, verifier: pkce.verifier, endpoints, popup };

      popup.location.href = authorizeUrl(endpoints.authorize, {
        clientId,
        redirectUri,
        state,
        codeChallenge: pkce.challenge,
        scopes,
      });
    })().catch((exception) => fail((exception as Error).message));
  }, [portalUrl, clientId, redirectUri, scopes, fail]);

  const signOut = useCallback(() => {
    pending.current = null;
    setToken("");
    setError("");
    setStatus("idle");
  }, []);

  return { status, token, error, signIn, signOut };
};
`})))()}var m;function h(){return(h=e((()=>{m=`/**
 * PKCE (RFC 7636) for a public OAuth client: the proof that the code coming
 * back is being redeemed by the page that asked for it.
 *
 * The portal takes it on an OAuth app with "Allow public client (PKCE)" ticked:
 * the token request then carries \`code_verifier\` instead of a client secret,
 * which is the only way a browser application can sign a user in -- a secret
 * shipped in a bundle is not a secret.
 *
 * Web Crypto, not a library: \`crypto.getRandomValues\` and \`crypto.subtle\` are
 * in every browser this kit supports and in Node, so this needs no dependency.
 * The challenge is base64url without padding, which is what S256 specifies --
 * the portal's own docs show a crypto-js snippet producing plain base64, but
 * their example value is base64url, and base64url is what the standard asks.
 */
const base64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\\+/g, "-")
    .replace(/\\//g, "_")
    .replace(/=+$/, "");

const randomToken = (byteLength: number) => {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
};

/** The S256 challenge for a verifier. */
export const challengeFor = async (verifier: string) => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return base64Url(new Uint8Array(digest));
};

export type PkcePair = { verifier: string; challenge: string };

/** 32 random bytes give a 43-character verifier, the shortest RFC 7636 allows. */
export const createPkcePair = async (): Promise<PkcePair> => {
  const verifier = randomToken(32);
  return { verifier, challenge: await challengeFor(verifier) };
};

/** The \`state\` parameter: a nonce that ties the answer to this request. */
export const createState = () => randomToken(24);
`})))()}var g;function _(){return(_=e((()=>{g=`/**
 * Which of the two applications a signed-in person belongs in.
 *
 * The answer comes from the portal, not from this application: the portal
 * already says what everyone may do, and a second list of roles kept here
 * would drift from it the first time someone's type changes on the portal.
 * The mapping is the firm's convention, and the one every later sample uses:
 *
 *   Guest              -> the client cabinet. Clients are invited as guests,
 *                         who see only the rooms shared with them.
 *   Owner, admin       -> the lawyer's workspace, with firm settings.
 *   Room admin         -> the lawyer's workspace: room admins open and run
 *                         matters.
 *   Power user, user   -> the lawyer's workspace, working inside matters
 *                         others opened.
 */
export type Persona = "lawyer" | "client";

export type PersonaInfo = {
  persona: Persona;
  /** What the firm calls this person. */
  label: string;
  /** Why the portal's role leads here, in one sentence for the screen. */
  reason: string;
};

export type RoleFlags = {
  isOwner?: boolean | null;
  isAdmin?: boolean | null;
  isRoomAdmin?: boolean | null;
  isCollaborator?: boolean | null;
  isVisitor?: boolean | null;
};

export const personaFromRoles = (flags: RoleFlags): PersonaInfo => {
  if (flags.isVisitor) {
    return {
      persona: "client",
      label: "Client",
      reason:
        "A guest on the portal, so they see only the matters shared with them.",
    };
  }

  if (flags.isOwner || flags.isAdmin) {
    return {
      persona: "lawyer",
      label: "Managing partner",
      reason:
        "A portal admin, so the whole practice and its settings are theirs.",
    };
  }

  if (flags.isRoomAdmin) {
    return {
      persona: "lawyer",
      label: "Lawyer",
      reason: "A room admin, so they open matters and decide who joins them.",
    };
  }

  return {
    persona: "lawyer",
    label: flags.isCollaborator ? "Paralegal" : "Staff",
    reason: "Works inside matters that a lawyer opened and shared with them.",
  };
};
`})))()}var v;function y(){return(y=e((()=>{v=`import { useCallback, useState } from "react";

import FormIconUrl from "../../../assets/icons/32/form.svg?url";
import { useApi } from "../../../providers/api";

/**
 * Registers the sample's OAuth app on the portal for whoever holds the API
 * key, so a reader does not fill the portal's form by hand.
 *
 * It asks the dev server (\`.storybook/oauth-app-proxy.ts\`) to do it, because
 * the portal's client-management service answers no cross-origin request --
 * see that file. \`available\` is therefore false in a static build, and the
 * screen offers the portal's own form instead, with the values to paste.
 *
 * The app is exactly what the sign-in needs: PKCE on, the redirect URI and
 * origin of this page, the scopes a client cabinet uses. The portal insists on
 * an icon and three URLs; the icon is one of the kit's own, the URLs point at
 * this sample where the portal accepts it as a URL.
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

/**
 * Where the app's home page, terms, policy and logout redirect point when this
 * page cannot be one of them. The registry checks those four against a pattern
 * that wants a dotted host name or an IPv4 address, so \`http://localhost:6006\`
 * is refused with 400 -- while the redirect URI and the origin, checked as
 * plain URLs, may name localhost. On a dev server the four therefore point at
 * the package's home page instead.
 */
const PUBLIC_FALLBACK = "https://www.onlyoffice.com";

const publicPage = (url: URL) =>
  url.hostname.includes(".") ? url.toString() : PUBLIC_FALLBACK;

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
      // Storybook's manager page, wherever this Storybook is served from.
      const samplePage = publicPage(
        new URL(
          "./?path=/docs/samples-legal-practice-setup-who-is-signed-in--docs",
          document.baseURI,
        ),
      );

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
          \`\${step}\${payload.status ? \` (\${payload.status})\` : ""}: \${payload.error ?? response.statusText}\`,
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
        ? new URL(\`/developer-tools/oauth/\${clientId}\`, baseUrl).toString()
        : "",
    createUrl: baseUrl
      ? new URL("/developer-tools/oauth/create", baseUrl).toString()
      : "",
  };
};
`})))()}var b;function x(){return(x=e((()=>{b=`import { useCallback, useEffect, useMemo, useState } from "react";

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
import {
  CLIENT_SCOPES,
  callbackUrl,
  readClientId,
  writeClientId,
} from "../clientApp";
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
 * read from the portal's own roles by \`personaFromRoles\`.
 */

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
    {\`\${info.label} → \${WORKSPACES[info.persona].title}\`}
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
        {\`The token was issued, but the profile request failed: \${failed}.\`}
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

  const [clientId, setClientId] = useState(readClientId);
  const redirectUri = useMemo(callbackUrl, []);

  const rememberClientId = useCallback((value: string) => {
    setClientId(value);
    writeClientId(value);
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
              ? "No portal is configured — connect one from the toolbar, as in Connect to a portal."
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
            : \`This page is \${window.location.origin}\${
                baseUrl ? \`, the portal is \${new URL(baseUrl).origin}\` : ""
              } — the portal's session cookie never reaches it.\`}
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
                {\`Registers it for \${portal.me?.displayName ?? "the key's owner"}: PKCE on, this redirect URI and origin, these scopes.\`}
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
          <div className={styles.statusRow}>
            <Text as="span" className={\`\${styles.badge} \${styles.badgeOk}\`}>
              {appSetup.existed ? "Already registered" : "App created"}
            </Text>
            <Text fontSize="13px" lineHeight="20px">
              {appSetup.existed
                ? "Found the app for this redirect URI — nothing new was created."
                : "Its Client ID is in the field above."}
            </Text>
          </div>
        ) : null}

        {appSetup.status === "error" ? (
          <div className={styles.statusRow} role="alert">
            <Text as="span" className={\`\${styles.badge} \${styles.badgeError}\`}>
              App not created
            </Text>
            <Text fontSize="13px" lineHeight="20px">
              {appSetup.error}
            </Text>
          </div>
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
          <div className={styles.statusRow} role="alert">
            <Text as="span" className={\`\${styles.badge} \${styles.badgeError}\`}>
              Sign-in failed
            </Text>
            <Text fontSize="13px" lineHeight="20px">
              {oauth.error}
            </Text>
          </div>
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
`})))()}function S(e){let t={a:`a`,code:`code`,em:`em`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,ol:`ol`,p:`p`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...a(),...e.components};return(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(n,{of:l}),`
`,(0,w.jsx)(t.h1,{id:`who-is-signed-in`,children:`Who is signed in`}),`
`,(0,w.jsx)(t.p,{children:`A law firm needs two applications from one portal: a workspace for its lawyers
and a cabinet for its clients. This screen decides which one a person gets —
and, more importantly, makes sure a client is really themselves.`}),`
`,(0,w.jsx)(r,{of:d}),`
`,(0,w.jsx)(t.h2,{id:`three-routes-and-they-are-not-interchangeable`,children:`Three routes, and they are not interchangeable`}),`
`,(0,w.jsxs)(t.table,{children:[(0,w.jsx)(t.thead,{children:(0,w.jsxs)(t.tr,{children:[(0,w.jsx)(t.th,{children:`Route`}),(0,w.jsx)(t.th,{children:`Whose identity`}),(0,w.jsx)(t.th,{children:`Good for`})]})}),(0,w.jsxs)(t.tbody,{children:[(0,w.jsxs)(t.tr,{children:[(0,w.jsx)(t.td,{children:(0,w.jsx)(t.strong,{children:`API key`})}),(0,w.jsx)(t.td,{children:`the key's owner, always`}),(0,w.jsx)(t.td,{children:`the lawyer's workspace — the application acts for the firm`})]}),(0,w.jsxs)(t.tr,{children:[(0,w.jsx)(t.td,{children:(0,w.jsx)(t.strong,{children:`Portal session`})}),(0,w.jsx)(t.td,{children:`whoever is signed in to the portal`}),(0,w.jsx)(t.td,{children:`an application the portal serves itself, like a plugin`})]}),(0,w.jsxs)(t.tr,{children:[(0,w.jsx)(t.td,{children:(0,w.jsx)(t.strong,{children:`OAuth`})}),(0,w.jsx)(t.td,{children:`the person who signed in and allowed the app`}),(0,w.jsx)(t.td,{children:`a client cabinet hosted anywhere`})]})]})]}),`
`,(0,w.jsxs)(t.p,{children:[`The API key from
`,(0,w.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-setup-connect-to-a-portal--docs`,children:`Connect to a portal`}),`
is one person. Filtering rooms by a
client's name on top of it would look like a cabinet and behave like a data
leak: every client would be one URL edit away from every other client's
matters. The portal session is the ONLYOFFICE Apps client's own route — it passes the
`,(0,w.jsx)(t.code,{children:`asc_auth_key`}),` cookie to `,(0,w.jsx)(t.code,{children:`ApiProvider`}),` as `,(0,w.jsx)(t.code,{children:`apiKey`}),` — and works only for a page
the portal serves. That leaves OAuth for a client cabinet on its own domain.`]}),`
`,(0,w.jsx)(t.h2,{id:`the-persona-comes-from-the-portal`,children:`The persona comes from the portal`}),`
`,(0,w.jsxs)(t.p,{children:[(0,w.jsx)(t.code,{children:`personaFromRoles`}),` reads the portal's own flags. A client is invited as a
`,(0,w.jsx)(t.strong,{children:`guest`}),`, who sees only the rooms shared with them; a room admin is a lawyer,
because room admins open matters and decide who joins them. Keeping a second
list of roles in the application would drift the first time someone's type
changes on the portal.`]}),`
`,(0,w.jsx)(c,{code:g,language:`tsx`}),`
`,(0,w.jsx)(t.h2,{id:`signing-a-client-in-with-oauth`,children:`Signing a client in with OAuth`}),`
`,(0,w.jsx)(t.h3,{id:`1-register-the-application-on-the-portal`,children:`1. Register the application on the portal`}),`
`,(0,w.jsxs)(t.p,{children:[(0,w.jsxs)(t.strong,{children:[`With the portal already connected by its API key, press `,(0,w.jsx)(t.em,{children:`Create the OAuth
app`}),`.`]}),` It registers exactly what the sign-in needs — PKCE on, this page's
redirect URI and origin, the scopes below, one of the kit's icons — fills in the
Client ID, and links to the app's page in the portal's Developer Tools. Press it
again and it finds the app it made rather than registering a second one.`]}),`
`,(0,w.jsxs)(t.p,{children:[`The button needs `,(0,w.jsx)(t.code,{children:`pnpm storybook`}),`. Registering an app is two portal calls: the
API key buys a five-minute JWT from `,(0,w.jsx)(t.code,{children:`GET /api/2.0/security/oauth2/token`}),`, and
`,(0,w.jsx)(t.code,{children:`POST /api/2.0/oauth2/clients`}),` takes it in an `,(0,w.jsx)(t.code,{children:`x-signature`}),` header. The first
answers any origin. The second is the portal's identity service, which refuses
every CORS preflight — 403, even for the portal's own origin, which never sends
one — so no page on another host can reach it. `,(0,w.jsx)(t.code,{children:`.storybook/oauth-app-proxy.ts`}),`
makes both calls from the dev server instead. It answers one path, POST only,
from this dev server's own pages, and forwards to those two routes and nothing
else.`]}),`
`,(0,w.jsxs)(t.p,{children:[`The portal also wants a home page, terms, a privacy policy and a logout
redirect, and checks those four against a pattern that needs a dotted host name
or an IPv4 address: `,(0,w.jsx)(t.code,{children:`http://localhost:6006/…`}),` is refused with 400, although the
redirect URI and the origin may name `,(0,w.jsx)(t.code,{children:`localhost`}),`. On a dev server the four
therefore point at `,(0,w.jsx)(t.code,{children:`https://www.onlyoffice.com`}),`; an application of your own
points them at its real pages. When the portal refuses, the screen shows which
fields and why — the registry names each one in the `,(0,w.jsx)(t.code,{children:`errors`}),` of its answer.`]}),`
`,(0,w.jsxs)(t.p,{children:[(0,w.jsx)(t.strong,{children:`In a static build`}),` — the published Storybook — the button becomes a link to
the portal's own form, `,(0,w.jsx)(t.strong,{children:`Developer Tools → OAuth → Create app`}),`:`]}),`
`,(0,w.jsxs)(t.ul,{children:[`
`,(0,w.jsxs)(t.li,{children:[`tick `,(0,w.jsx)(t.strong,{children:`Allow public client (PKCE)`}),` — without it the portal asks for a
client secret, and a secret in a browser bundle is not a secret;`]}),`
`,(0,w.jsx)(t.li,{children:`add the redirect URI and the allowed origin this screen shows;`}),`
`,(0,w.jsxs)(t.li,{children:[`give it the scopes a client needs and nothing more:
`,(0,w.jsx)(t.code,{children:`openid accounts.self:read rooms:read files:read files:write`}),`.`]}),`
`]}),`
`,(0,w.jsxs)(t.p,{children:[`Either way the `,(0,w.jsx)(t.strong,{children:`Client ID`}),` ends up in the field above. It is not a secret — a
public client's id never is — so the screen remembers it in `,(0,w.jsx)(t.code,{children:`localStorage`}),`.`]}),`
`,(0,w.jsx)(c,{code:v,language:`tsx`}),`
`,(0,w.jsxs)(t.h3,{id:`2-what-happens-on-sign-in-with-onlyoffice`,children:[`2. What happens on `,(0,w.jsx)(t.strong,{children:`Sign in with ONLYOFFICE`})]}),`
`,(0,w.jsxs)(t.ol,{children:[`
`,(0,w.jsxs)(t.li,{children:[`A popup opens at the portal's `,(0,w.jsx)(t.code,{children:`authorize`}),` endpoint with the client id, the
redirect URI, the scopes, a `,(0,w.jsx)(t.code,{children:`state`}),` nonce and an S256 `,(0,w.jsx)(t.code,{children:`code_challenge`}),`.`]}),`
`,(0,w.jsxs)(t.li,{children:[`The client signs in on the portal and presses `,(0,w.jsx)(t.strong,{children:`Allow`}),`.`]}),`
`,(0,w.jsxs)(t.li,{children:[`The portal sends the popup to `,(0,w.jsx)(t.code,{children:`oauth-callback.html?code=…&state=…`}),`. That page
posts both to this window and closes.`]}),`
`,(0,w.jsxs)(t.li,{children:[`This window checks `,(0,w.jsx)(t.code,{children:`state`}),` and exchanges the code, together with the
`,(0,w.jsx)(t.code,{children:`code_verifier`}),` that never left it, for an access token.`]}),`
`,(0,w.jsxs)(t.li,{children:[`A nested `,(0,w.jsx)(t.code,{children:`ApiProvider`}),` gets the token as `,(0,w.jsx)(t.code,{children:`apiKey`}),`. Everything below it — here
one `,(0,w.jsx)(t.code,{children:`getSelfProfile()`}),` — runs as the client.`]}),`
`]}),`
`,(0,w.jsxs)(t.p,{children:[`The endpoints come from the portal's own
`,(0,w.jsx)(t.code,{children:`/.well-known/openid-configuration`}),`, and both it and the token endpoint answer
any origin, so a static page can do all of this with no server of its own.`]}),`
`,(0,w.jsx)(c,{code:f,language:`tsx`}),`
`,(0,w.jsx)(t.h3,{id:`details-that-decide-whether-it-works`,children:`Details that decide whether it works`}),`
`,(0,w.jsxs)(t.ul,{children:[`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsxs)(t.strong,{children:[`Open the popup inside the click, before any `,(0,w.jsx)(t.code,{children:`await`}),`.`]}),` Hashing the
verifier first loses the user's gesture and the browser blocks the window. The
hook opens a blank popup synchronously and points it at the portal once the
challenge is ready.`]}),`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsxs)(t.strong,{children:[`Put `,(0,w.jsx)(t.code,{children:`scope`}),` last in the authorize URL.`]}),` The first time a person allows
an app, the portal's consent page sends the browser round once more and
rebuilds the authorize URL as everything before `,(0,w.jsx)(t.code,{children:`&scope=`}),` plus the scopes.
Anything after `,(0,w.jsx)(t.code,{children:`scope`}),` is lost: `,(0,w.jsx)(t.code,{children:`state`}),` comes back missing and the exchange
has no `,(0,w.jsx)(t.code,{children:`code_challenge`}),` to check the verifier against. The second sign-in
works either way, which is what makes this one hard to see.`]}),`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsxs)(t.strong,{children:[`Answer by `,(0,w.jsx)(t.code,{children:`postMessage`}),`, checked twice.`]}),` Only messages from this origin,
only with the `,(0,w.jsx)(t.code,{children:`state`}),` this request made. The kit's `,(0,w.jsx)(t.code,{children:`utils/get-oauth-token`}),`
polls `,(0,w.jsx)(t.code,{children:`localStorage`}),` instead and checks no `,(0,w.jsx)(t.code,{children:`state`}),`, which is why this sample
does not use it.`]}),`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsx)(t.strong,{children:`Keep the token in memory.`}),` Anything that survives a reload can be read by
any script on the page. A real cabinet adds refresh with the `,(0,w.jsx)(t.code,{children:`refresh_token`}),`
the portal returns; this sample signs out on reload.`]}),`
`,(0,w.jsxs)(t.li,{children:[(0,w.jsxs)(t.strong,{children:[`The callback is a plain `,(0,w.jsx)(t.code,{children:`.html`}),` file`]}),` in `,(0,w.jsx)(t.code,{children:`.storybook/public/`}),`. Storybook's
dev server serves a static file only by its full path, and `,(0,w.jsx)(t.code,{children:`serve`}),` — behind
`,(0,w.jsx)(t.code,{children:`pnpm storybook-serve`}),` — would redirect `,(0,w.jsx)(t.code,{children:`*.html`}),` to a clean URL and drop the
query with the code in it, until the `,(0,w.jsx)(t.code,{children:`serve.json`}),` next to the page told it not
to.`]}),`
`]}),`
`,(0,w.jsx)(c,{code:m,language:`tsx`}),`
`,(0,w.jsxs)(t.p,{children:[`The challenge is base64url without padding, as S256 specifies, and
`,(0,w.jsx)(t.code,{children:`pkce.test.ts`}),` checks it against the worked example in RFC 7636 itself.`]}),`
`,(0,w.jsxs)(t.p,{children:[`The app registered here is the one every later screen signs a client in with:
`,(0,w.jsx)(t.a,{href:`?path=/docs/samples-legal-practice-screens-01-my-matters--docs`,children:`01. My matters`}),` uses it
to show a client the matters shared with them, and nothing else.`]}),`
`,(0,w.jsx)(t.h2,{id:`the-code`,children:`The code`}),`
`,(0,w.jsxs)(t.p,{children:[`Imports here are relative to this repository. In your application they come
from the package — `,(0,w.jsx)(t.code,{children:`@onlyoffice/apps-ui-kit/providers/api`}),` and the component
subpaths.`]}),`
`,(0,w.jsx)(c,{code:b,language:`tsx`})]})}function C(e={}){let{wrapper:t}={...a(),...e.components};return t?(0,w.jsx)(t,{...e,children:(0,w.jsx)(S,{...e})}):S(e)}var w;function T(){return(T=e((()=>{w=i(),o(),t(),s(),u(),p(),h(),_(),y(),x()})))()}T();export{C as default};