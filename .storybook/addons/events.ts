// Channel events between the preview and the manager's own tools.

/**
 * Sent by the demo banner's "Connect a portal" with `{ storyId }`: the API
 * Config tool opens its "Add custom" form -- after the manager has shown the
 * toolbar that holds the tool, when the reader had hidden it.
 */
export const CONNECT_PORTAL_EVENT = "docspace/api-config/connect";
