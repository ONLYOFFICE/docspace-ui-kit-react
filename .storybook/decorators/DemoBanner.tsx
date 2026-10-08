import React from "react";
import { addons } from "storybook/preview-api";

import { CONNECT_PORTAL_EVENT } from "../addons/events";

import styles from "./DemoBanner.module.scss";

// Where someone without a portal gets one; the key is then issued in the
// portal under Developer Tools -> API keys.
export const REGISTER_PORTAL_URL =
  "https://www.onlyoffice.com/docspace-registration";

type ChannelWindow = Window & {
  __STORYBOOK_ADDONS_CHANNEL__?: ReturnType<typeof addons.getChannel>;
};

/**
 * Asks the manager to open the API Config form. A Docs page renders a story
 * with `docs.story.inline: false` (the AI chat and settings) in an
 * `iframe.html` of its own, whose channel posts to its parent -- the Docs
 * preview, not the manager -- so the request would go nowhere. Emit on the
 * channel of the preview the manager itself embeds instead.
 */
export const requestPortalConnection = (storyId?: string) => {
  let preview: ChannelWindow = window;
  try {
    while (preview.parent !== preview && preview.parent !== window.top) {
      preview = preview.parent as ChannelWindow;
    }
  } catch {
    // A parent on another origin: fall back to this frame's own channel.
    preview = window;
  }
  const channel = preview.__STORYBOOK_ADDONS_CHANNEL__ ?? addons.getChannel();
  channel.emit(CONNECT_PORTAL_EVENT, { storyId });
};

type DemoBannerProps = {
  /** The id of the story it sits above; the manager reopens it on the canvas. */
  storyId: string;
};

/**
 * Says, above a story that would talk to a portal, that none is connected and
 * what is on screen is made up -- and points at the one place a real portal
 * is connected: the API Config tool in the toolbar above the page.
 * "Connect a portal" asks the manager to open that tool's form.
 */
export const DemoBanner = ({ storyId }: DemoBannerProps) => {
  const connect = () => requestPortalConnection(storyId);

  return (
    <div className={styles.banner} role="note" data-testid="demo-banner">
      <span className={styles.arrow} aria-hidden="true">
        {"↑"}
      </span>
      <div className={styles.text}>
        <strong className={styles.title}>Demo data</strong>
        <span>
          No portal is connected, so everything below is made up and nothing is
          saved. Connect a real one in the toolbar above: the API Config menu,
          which reads <b>Default</b>.
        </span>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.connect} onClick={connect}>
          Connect a portal
        </button>
        <a
          className={styles.register}
          href={REGISTER_PORTAL_URL}
          target="_blank"
          rel="noreferrer"
        >
          Get a free portal
        </a>
      </div>
    </div>
  );
};
