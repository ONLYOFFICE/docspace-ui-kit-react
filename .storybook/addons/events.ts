// Channel events between the preview and the manager's own tools.

/**
 * Sent by the demo banner's "Connect a portal" with `{ storyId }`: the API
 * Config tool opens its "Add custom" form -- after the manager has switched to
 * the story's canvas, when the toolbar that holds the tool is hidden.
 */
export const CONNECT_PORTAL_EVENT = "docspace/api-config/connect";
