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
  /** Called with the dropped files. It is skipped entirely when the drop carried none, and nothing is ever rejected: there is no accepted-type or size filter here. */
  onDrop?: (acceptedFiles: File[]) => void;
  /** Called on every drag-over with the drag-active flag as it stood when the current render began — on the first event of a drag that is still `false`. */
  onDragOver?: (isDragActive: boolean, e: React.DragEvent<HTMLElement>) => void;
  /** Called when the dragged selection leaves the target. */
  onDragLeave?: (e: React.DragEvent<HTMLElement>) => void;
  /** Ignored. Nothing reads it, and it is spread onto the outer element as an unknown attribute. */
  value?: string;
  /** Ignored. Nothing reads it, and React warns about a function landing on a DOM element. */
  targetFile?: (file?: File | null) => void;
  /** Inline style of the outer element, and where the `--dnd-*` custom properties go. */
  style?: React.CSSProperties;
  /** Ignored. The drop library supplies the element's ref, and this one is never attached. */
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
}
