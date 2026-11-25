import { useState, useEffect, useRef } from "react";

export const AnimationEvents = {
  END_ANIMATION: "ANIMATION_END",
  ANIMATION_STARTED: "ANIMATION_STARTED",
  ANIMATION_ENDED: "ANIMATION_ENDED",
  Forced_Animation: "FORCED_ANIMATION",
};

export type UseAnimationReturn = {
  animationPhase: "none" | "start" | "progress" | "finish";
  isAnimationReady: boolean;
  animationElementRef: React.RefObject<HTMLDivElement | null>;
  parentElementRef: React.RefObject<HTMLDivElement | null>;
  endWidth: number;
  triggerAnimation: () => void;
};

export const useAnimation = (isActive: boolean): UseAnimationReturn => {
  // Animation state management
  const [animationPhase, setAnimationPhase] = useState<
    "none" | "start" | "progress" | "finish"
  >("none");
  const [isAnimationReady, setIsAnimationReady] = useState(false);
  const [endWidth, setEndWidth] = useState(90);

  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  // The phase as of now, not as of the last render: a page that has loaded
  // may say so (`END_ANIMATION`) in the same commit that started the fill,
  // before a listener reading the rendered phase sees "progress", and the
  // fill then stopped short of the end.
  const phaseRef = useRef<"none" | "start" | "progress" | "finish">("none");
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setPhase = (phase: "none" | "start" | "progress" | "finish") => {
    phaseRef.current = phase;
    setAnimationPhase(phase);
  };
  const animationElementRef = useRef<HTMLDivElement>(null);
  const parentElementRef = useRef<HTMLDivElement>(null);

  // Function to start animation (CSS-based)
  const startAnimation = () => {
    window.dispatchEvent(new CustomEvent(AnimationEvents.ANIMATION_STARTED));

    // Clear any existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }

    // A fill finishing from a click before starts over.
    if (finishTimer.current) {
      clearTimeout(finishTimer.current);
      finishTimer.current = null;
    }

    // Start the animation sequence
    setIsAnimationReady(false);
    setPhase("progress");

    // CSS animation will handle the progress from 10% to 90%
    // No JavaScript interval needed
  };

  // Function to trigger animation with ready state
  const triggerAnimation = () => {
    // First show empty state
    setIsAnimationReady(true);
    // Start animation after a brief delay to show the empty state
    startAnimation();
  };

  // Handle active state changes
  useEffect(() => {
    if (!isActive) {
      // Reset everything when item becomes inactive
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      if (finishTimer.current) {
        clearTimeout(finishTimer.current);
        finishTimer.current = null;
      }
      setPhase("none");
      setIsAnimationReady(false);
    }
  }, [isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      if (finishTimer.current) {
        clearTimeout(finishTimer.current);
        finishTimer.current = null;
      }
    };
  }, []);

  // Event listener for ending animation: attached once, it reads the phase
  // from `phaseRef`, so an end said right after the click is not missed.
  useEffect(() => {
    const onEndAnimation = () => {
      if (phaseRef.current === "progress") {
        // Clear the interval
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
          progressInterval.current = null;
        }

        if (
          animationElementRef.current?.offsetWidth &&
          parentElementRef.current?.offsetWidth
        ) {
          setEndWidth(
            (animationElementRef.current.offsetWidth /
              parentElementRef.current.offsetWidth) *
              100,
          );
        }
        // Set to finish phase and complete the animation
        setPhase("finish");
        // Reset after a brief moment
        finishTimer.current = setTimeout(() => {
          finishTimer.current = null;
          setPhase("none");
          setIsAnimationReady(false);
          window.dispatchEvent(
            new CustomEvent(AnimationEvents.ANIMATION_ENDED),
          );
        }, 400);
      }
    };

    window.addEventListener(AnimationEvents.END_ANIMATION, onEndAnimation);

    return () => {
      window.removeEventListener(AnimationEvents.END_ANIMATION, onEndAnimation);
    };
  }, []);

  return {
    animationPhase,
    isAnimationReady,
    animationElementRef,
    parentElementRef,
    endWidth,
    triggerAnimation,
  };
};
