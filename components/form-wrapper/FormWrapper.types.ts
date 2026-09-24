import React from "react";

export type FormWrapperProps = {
  /** The form. Every child is centred horizontally by the wrapper's own flex column. */
  children: React.ReactNode;
  /** Applied to the card. */
  id?: string;
  /** Applied to the card. */
  className?: string;
  /** Applied to the card. */
  style?: React.CSSProperties;
};
