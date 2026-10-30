import { useEffect, useId, useRef, useState } from "react";

import { getTabStops } from "../../../../hooks/useFocusTrap";

/**
 * Ties the tab bar to the panel under it, as the WAI-ARIA tabs pattern asks:
 * every tab gets an id, the selected one names the panel it controls, and the
 * panel is labelled by that tab.
 *
 * Only the selected tab's panel is rendered, so only that tab carries
 * `aria-controls` -- the others would point at an element that does not
 * exist.
 *
 * Tab from the bar goes on into the panel by the document's own order. A
 * panel with nothing in it to tab to is made a stop of its own, so the
 * keyboard can still reach its content and a screen reader announces it.
 */
const useTabPanel = (selectedIndex: number, hasPanel: boolean) => {
  const baseId = useId();
  const panelId = `${baseId}-panel`;
  const tabId = (index: number) => `${baseId}-tab-${index}`;

  const panelRef = useRef<HTMLDivElement>(null);
  const [panelHasStops, setPanelHasStops] = useState(true);

  useEffect(() => {
    const panel = panelRef.current;
    if (!hasPanel || !panel) return;

    const update = () => setPanelHasStops(getTabStops(panel).length > 0);
    update();

    // The content loads and changes after the panel is shown.
    const observer = new MutationObserver(update);
    observer.observe(panel, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["tabindex", "disabled", "hidden", "style", "class"],
    });
    return () => observer.disconnect();
  }, [hasPanel, selectedIndex]);

  const getTabProps = (index: number) => ({
    id: tabId(index),
    "aria-controls": hasPanel && index === selectedIndex ? panelId : undefined,
  });

  const panelProps = {
    ref: panelRef,
    id: panelId,
    role: "tabpanel",
    "aria-labelledby": tabId(selectedIndex),
    tabIndex: panelHasStops ? undefined : 0,
  };

  return { getTabProps, panelProps };
};

export default useTabPanel;
