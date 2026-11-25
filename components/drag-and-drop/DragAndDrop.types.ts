export interface DragAndDropProps {
  /** What the drop target wraps. The component adds no layout of its own beyond filling its parent's height. */
  children: React.ReactNode;
  /** Added after the component's own classes on the outer element. */
  className?: string;
  /** Lets drag events bubble out of this element to a drop target above it. Without it they are stopped here. */
  isDropZone?: boolean;
  /** Your own "a drag is in progress" flag. **Nothing is highlighted without it** — the accept colour is nested inside this state. */
  dragging?: boolean;
  /** Fades the element to 40%. It does not stop the drop: `onDrop` still fires. */
  isDragDisabled?: boolean;
  /** Called when the pointer is pressed. It is passed straight to the element, not through the drop library. */
  onMouseDown?: () => void;
  /**
   * Called with the dropped files, and skipped when the drop carried none.
   * Nothing is rejected: there is no type or size filter here.
   */
  onDrop?: (acceptedFiles: File[]) => void;
  /**
   * Called on every drag-over with the drag-active flag from the last render.
   * On the first event of a drag that flag is still `false`.
   */
  onDragOver?: (isDragActive: boolean, e: React.DragEvent<HTMLElement>) => void;
  /** Called when the dragged selection leaves the target. */
  onDragLeave?: (e: React.DragEvent<HTMLElement>) => void;
  /** Inline style of the outer element, and where the `--dnd-*` custom properties go. */
  style?: React.CSSProperties;
}
