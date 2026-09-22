export type LoaderWrapperProps = {
  /** The tree that is dimmed and made unclickable. Nothing is added around it beyond the wrapper's own flex column. */
  children: React.ReactNode;
  /** Whether the content is busy. It fades the wrapper and sets `pointer-events: none`; it renders no spinner of its own and does not stop the keyboard. */
  isLoading: boolean;
  /** Replaces the wrapper's `data-testid`. */
  testId?: string;
};
