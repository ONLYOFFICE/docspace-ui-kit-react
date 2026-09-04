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

    // Start the animation sequence
    setIsAnimationReady(false);
    setAnimationPhase("progress");

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
      setAnimationPhase("none");
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
    };
  }, []);

  // Event listener for ending animation
  useEffect(() => {
    const onEndAnimation = () => {
      if (animationPhase === "progress") {
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
        setAnimationPhase("finish");
        // Reset after a brief moment
        setTimeout(() => {
          setAnimationPhase("none");
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
  }, [animationPhase]);

  return {
    animationPhase,
    isAnimationReady,
    animationElementRef,
    parentElementRef,
    endWidth,
    triggerAnimation,
  };
};
