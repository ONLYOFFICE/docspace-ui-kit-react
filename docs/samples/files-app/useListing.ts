import { useCallback, useEffect, useState } from "react";

import { explainPortalError } from "../legal/explain";
import type { FilesSource, Listing, Query } from "./source";

/**
 * One listing at a time. A new query starts a new read and the answer to an
 * old one is dropped, so a fast click through three folders never shows the
 * second folder's files under the third folder's name. The previous listing
 * stays on screen while the next one loads; `reload` asks for the same
 * query again after a write.
 */
export type ListingState = {
  listing: Listing | null;
  loading: boolean;
  /** Why the last read failed; empty when it did not. */
  error: string;
};

export const useListing = (source: FilesSource, query: Query) => {
  const [state, setState] = useState<ListingState>({
    listing: null,
    loading: true,
    error: "",
  });
  const [attempt, setAttempt] = useState(0);
  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  const { place, folderId, search, type, sortBy, ascending } = query;

  useEffect(() => {
    let cancelled = false;
    setState((current) => ({ ...current, loading: true, error: "" }));

    source.list({ place, folderId, search, type, sortBy, ascending }).then(
      (listing) => {
        if (!cancelled) setState({ listing, loading: false, error: "" });
      },
      (error: unknown) => {
        if (!cancelled) {
          setState((current) => ({
            listing: current.listing,
            loading: false,
            error: explainPortalError(error, "read this folder"),
          }));
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [source, place, folderId, search, type, sortBy, ascending, attempt]);

  return { ...state, reload };
};
