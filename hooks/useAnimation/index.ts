/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
