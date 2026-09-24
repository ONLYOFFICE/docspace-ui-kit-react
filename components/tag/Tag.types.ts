export type TagProps = {
  /** Ref to the outermost element. */
  ref?: React.RefObject<HTMLDivElement | null>;
  /** Identifier of the tag. It is handed to `onDelete`, and it is the text shown when `label` is left out. */
  tag: string;
  /** Text of the tag. It is also the `title` attribute and the accessible name. */
  label?: string;
  /** Applied to the outermost element. */
  className?: string;
  /** Applied to the outermost element. */
  id?: string;
  /** Merged into the outermost element's inline style, before `tagMaxWidth` is applied. */
  style?: React.CSSProperties;
  /** Whether the tag is drawn in its "new" colours. It is also what makes the delete cross appear. */
  isNewTag?: boolean;
  /** Whether the tag is inert. Pointer events are dropped in CSS as well, so hover does nothing either. */
  isDisabled?: boolean;
  /** Whether the tag counts as removed: `onClick` stops firing and the border greys out. */
  isDeleted?: boolean;
  /** Called on a click anywhere in the tag, with `{ label, roomType, providerType }` — not with the DOM event. */
  onClick?: (tag: TagClickEvent) => void;
  /** Called with `tag` when the cross is clicked. The cross is only rendered when `isNewTag` is set as well. */
  onDelete?: (tag?: string) => void;
  /** `max-width` of the tag, as a CSS length — `Tags` passes a percentage of its own width. */
  tagMaxWidth?: string;
  /** Glyph before the label: an SVG URL, or a component rendered as a 12px icon. */
  icon?: string | React.FC<React.SVGProps<SVGSVGElement>>;
  /** Applied to that glyph. */
  iconClassName?: string;
  /** Ignored. Nothing reads this prop on a single tag; it is `TagType.isDefault` that `Tags` acts on. */
  isDefault?: boolean;
  /** Whether the trailing margin is dropped, for the last tag in a row. */
  isLast?: boolean;
  /** Passed straight back through `onClick`. The component itself does nothing with it. */
  roomType?: number;
  /** Passed straight back through `onClick`. The component itself does nothing with it. */
  providerType?: number;
  /** `data-testid` of the outermost element. */
  dataTestId?: string;
  /** Called when the pointer enters the tag. */
  onMouseEnter?: () => void;
  /** Called when the pointer leaves the tag. */
  onMouseLeave?: () => void;
  /** Whether the label is rendered. Turn it off for a tag that is only its icon. */
  withLabel?: boolean;
  /** Extra text after the label, inside the same line. */
  labelSuffix?: string;
  /** CSS colour of that suffix. */
  labelSuffixColor?: string;
};

export type TagType = {
  /** React key for the tag. `Tags` falls back to the label when it is absent. */
  key?: string;
  /** Marks the tag as the room's default one. It only takes part in the width arithmetic. */
  isDefault?: boolean;
  /** Marks the tag as a third-party provider: it is given a fixed 44px width and its label is hidden. */
  isThirdParty?: boolean;
  /** Text of the tag. `Tags` also uses it as the React key. */
  label: string;
  /** `max-width` of the tag. `Tags` overwrites whatever is passed here with its own calculation. */
  maxWidth?: string;
  /** Labels listed in the overflow drop-down. `Tags` fills this in for the overflow tag itself. */
  advancedOptions?: string[];
  /** Whether the tag is inert. */
  isDisabled?: boolean;
  /** Passed back through `onSelectTag`. */
  roomType?: number;
  /** Glyph before the label: an SVG URL, or a component. */
  icon?: string | React.FC<React.SVGProps<SVGSVGElement>>;
  /** Passed back through `onSelectTag`. */
  providerType?: number;
  /** Ignored by `Tags`, which wires every tag to `onSelectTag` instead. */
  onClick?: () => void;
  /** Marks the tag as the overflow or create trigger. `Tags` sets this itself. */
  isOptionTag?: boolean;
  /** Extra text after the label. */
  labelSuffix?: string;
  /** CSS colour of that suffix. */
  labelSuffixColor?: string;
};

export type TagClickEvent = {
  label: string;
  roomType?: number;
  providerType?: number;
};
