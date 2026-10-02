import { useEffect, useState } from "react";

import { useApi } from "../../../providers/api";
import { resolvePortalUrl } from "./usePortal";

/**
 * An image from the portal's own storage, loaded so that it actually shows.
 *
 * Resolving the path against the portal (`portalUrl`) fixes the host and
 * nothing else: `/storage/userPhotos/...` and the other storage paths answer
 * 403 to a request that is not signed in. The ONLYOFFICE Apps client never meets
 * this, because it is served from the portal's origin and the browser sends
 * the session cookie with every `<img>`. A page on any other origin has no
 * such cookie, and an `<img>` cannot carry a header -- so the only way to show
 * the picture is to fetch it with the key, as a blob, and hand `<img>` an
 * object URL instead.
 *
 * Three rules this follows, and a copy of it should too:
 *
 *   - the key goes only to the portal. An absolute URL on another host is
 *     returned as is, because signing a request to a third party with the
 *     portal's key hands the key to that third party;
 *   - every object URL is revoked when the path changes or the component
 *     goes, or each render leaks an image into memory;
 *   - a failure returns "" -- `Avatar` then draws initials, and a broken
 *     image icon is worse than no image.
 */
export const usePortalImage = (path?: string | null) => {
  const { apiClient, baseUrl } = useApi();
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (!path) {
      setSrc("");
      return;
    }

    if (path.startsWith("data:") || path.startsWith("blob:")) {
      setSrc(path);
      return;
    }

    const url = resolvePortalUrl(path, baseUrl);

    // Not the portal's host: a public image somewhere else, fetched without
    // our credentials by the browser itself.
    if (!baseUrl || new URL(url).origin !== new URL(baseUrl).origin) {
      setSrc(url);
      return;
    }

    let objectUrl = "";
    let cancelled = false;

    apiClient.instance
      .get<Blob>(url, { responseType: "blob" })
      .then(({ data }) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(data);
        setSrc(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setSrc("");
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path, baseUrl, apiClient]);

  return src;
};
