// Shared helper for the stubs that stand in for the optional peers of
// `@onlyoffice/ai-chat` this package does not install. See react-shiki.mjs for
// why they are absent and `.storybook/main.ts` for how the stubs are wired in.
//
// Every one of these is only ever reached by code Storybook does not run: the
// vendor SDKs are constructed inside a provider's request path, and the portal
// answers the AI calls through `/api/2.0/ai` rather than talking to a vendor
// from the browser. Rather than fake a client, each stub throws the moment
// something actually tries to use it, naming the package to install.

/**
 * Builds a value that is inert until used and then explains itself: callable,
 * constructible, and a template for any property access the widget makes.
 *
 * @param {string} pkg npm name of the peer this stands in for.
 * @param {string} name the export being stood in for.
 */
export const missingPeer = (pkg, name) => {
  const fail = () => {
    throw new Error(
      `${pkg} is not installed, so "${name}" is a Storybook stub. ` +
        `It is an optional peer of @onlyoffice/ai-chat that this package ` +
        `deliberately does not depend on; install it in the consuming app ` +
        `to use this code path.`,
    );
  };

  return new Proxy(fail, {
    construct: fail,
    apply: fail,
    get: (target, property) =>
      property in target
        ? target[property]
        : missingPeer(pkg, `${name}.${String(property)}`),
  });
};
