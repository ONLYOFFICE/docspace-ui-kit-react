import type { IncomingMessage, ServerResponse } from "node:http";
import type { PluginOption } from "vite";

/**
 * Creates the legal-practice samples' OAuth app on a portal, from the dev
 * server rather than the browser.
 *
 * The browser cannot do it. Registering an OAuth app is two calls:
 *
 *   GET  /api/2.0/security/oauth2/token   with the API key -> a JWT, valid for
 *                                         five minutes, naming the caller
 *   POST /api/2.0/oauth2/clients          with that JWT in `x-signature`
 *
 * The first answers any origin. The second is served by the identity service,
 * which refuses every CORS preflight -- 403, even for the portal's own origin;
 * the ONLYOFFICE Apps client never sends one, being same-origin. So a page on
 * any other host cannot reach it, and a server can. This middleware is that
 * server, for `storybook dev` only: a static build has nothing to run it, and
 * the sample falls back to a link to the portal's own form there.
 *
 * It is idempotent. Before creating, it lists the caller's apps and returns
 * one already registered for the same redirect URI, so pressing the button
 * twice does not leave two apps behind.
 *
 * It is not a proxy. It answers one path, POST only, from this dev server's
 * own pages (checked by `Origin`), and forwards to exactly those two portal
 * routes -- anything looser on a localhost port is something any site the
 * developer visits could use.
 */
const ENDPOINT = "/__samples/oauth-app";

const readJson = (req: IncomingMessage) =>
  new Promise<Record<string, unknown>>((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });

const send = (res: ServerResponse, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};

type Upstream = { ok: boolean; status: number; body: unknown };

const call = async (
  url: string,
  init: RequestInit & { headers: Record<string, string> },
): Promise<Upstream> => {
  const response = await fetch(url, init);
  const text = await response.text();
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    // Not JSON -- keep the text for the error message.
  }
  return { ok: response.ok, status: response.status, body };
};

/**
 * The registry answers a refusal as an RFC 9457 problem: `detail` says what
 * kind ("Validation failed"), and `errors` names each field with the message
 * its constraint carries -- the only part that says what to change.
 */
type Problem = {
  detail?: string;
  errors?: { field?: string; message?: string }[];
};

const describeRefusal = (body: unknown) => {
  if (typeof body === "string") return body.slice(0, 300) || "No reason given.";
  const { detail, errors } = (body ?? {}) as Problem;
  const fields = (errors ?? [])
    .map(({ field, message }) => [field, message].filter(Boolean).join(": "))
    .filter(Boolean);
  if (fields.length) return fields.join("; ");
  return detail ?? "No reason given.";
};

type ClientDto = {
  client_id?: string;
  name?: string;
  redirect_uris?: string[];
};

export const oauthAppProxy = (): PluginOption => ({
  name: "apps-ui-kit:oauth-app-proxy",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      // Behind a path prefix the dev server still sees the path unprefixed.
      if (!(req.url ?? "").startsWith(ENDPOINT)) {
        next();
        return;
      }

      if (req.method !== "POST") {
        send(res, 405, { error: "POST only" });
        return;
      }

      const origin = req.headers.origin;
      if (!origin || new URL(origin).host !== req.headers.host) {
        send(res, 403, {
          error: "Only this dev server's own pages may call it.",
        });
        return;
      }

      try {
        const { portalUrl, authorization, app } = (await readJson(req)) as {
          portalUrl?: string;
          authorization?: string;
          app?: { redirect_uris?: string[] } & Record<string, unknown>;
        };

        const portal = portalUrl ? new URL(portalUrl) : null;
        if (
          !portal ||
          !/^https?:$/.test(portal.protocol) ||
          !authorization ||
          !app
        ) {
          send(res, 400, {
            error: "portalUrl, authorization and app are required.",
          });
          return;
        }

        const signature = await call(
          new URL("/api/2.0/security/oauth2/token", portal).toString(),
          { headers: { Authorization: authorization } },
        );
        const jwt = (signature.body as { response?: string })?.response;
        if (!signature.ok || !jwt) {
          send(res, signature.status || 502, {
            step: "signature",
            status: signature.status,
            error: "The portal did not issue a signature for this key.",
          });
          return;
        }

        const signed = { "x-signature": jwt };
        const clientsUrl = new URL("/api/2.0/oauth2/clients", portal);

        const listUrl = new URL(clientsUrl);
        listUrl.search = "page=0&limit=100";
        const list = await call(listUrl.toString(), { headers: signed });
        const wanted = app.redirect_uris?.[0];
        const existing = list.ok
          ? ((list.body as { data?: ClientDto[] })?.data ?? []).find((client) =>
              client.redirect_uris?.includes(wanted ?? ""),
            )
          : undefined;

        if (existing?.client_id) {
          send(res, 200, {
            clientId: existing.client_id,
            name: existing.name,
            existed: true,
          });
          return;
        }

        const created = await call(clientsUrl.toString(), {
          method: "POST",
          headers: { ...signed, "Content-Type": "application/json" },
          body: JSON.stringify(app),
        });
        const clientId = (created.body as ClientDto)?.client_id;

        if (!created.ok || !clientId) {
          send(res, created.status || 502, {
            step: "create",
            status: created.status,
            error: describeRefusal(created.body),
          });
          return;
        }

        send(res, 201, {
          clientId,
          name: (created.body as ClientDto).name,
          existed: false,
        });
      } catch (error) {
        send(res, 502, { error: (error as Error).message });
      }
    });
  },
});
