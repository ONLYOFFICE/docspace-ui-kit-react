"use client";
import * as React from "react";
import type { Scrollbar } from "./Scrollbar";

export type ScrollbarContextValue = { parentScrollbar: Scrollbar | null };

const ScrollbarContext: React.Context<ScrollbarContextValue> =
  React.createContext({
    parentScrollbar: null,
  } as ScrollbarContextValue);

export default ScrollbarContext;
