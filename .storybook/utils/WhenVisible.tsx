import type React from "react";
import { useEffect, useRef, useState } from "react";

/**
 * Mounts its children only once it is on screen.
 *
 * Storybook keeps the story root at `display: none` while it prepares a
 * story, and a hidden element cannot take focus, so a component that focuses
 * itself on mount (`autoFocus`, `focusOnRender`) would land on `<body>` in the
 * Storybook UI. Wrapped in this it mounts the way it would in a dialog that
 * has just opened. The headless test run has no preparing phase and mounts
 * on the first frame.
 */
export const WhenVisible = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const check = () => {
      if (ref.current?.getClientRects().length) setVisible(true);
      else frame = requestAnimationFrame(check);
    };
    check();
    return () => cancelAnimationFrame(frame);
  }, []);

  return <div ref={ref}>{visible ? children : null}</div>;
};
