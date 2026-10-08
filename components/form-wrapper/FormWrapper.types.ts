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
  /** Makes the card itself the `<form>` and calls this on submit, with the browser's navigation already prevented. Give the main button `type="submit"` so that it, and Enter in a field, submit. Without it the card is a `<div>`. */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  /** Names the card. With `onSubmit` set this turns the `<form>` into a form landmark. */
  "aria-label"?: string;
  /** Names the card by the id of an element inside it, usually the heading. With `onSubmit` set this turns the `<form>` into a form landmark. */
  "aria-labelledby"?: string;
};
