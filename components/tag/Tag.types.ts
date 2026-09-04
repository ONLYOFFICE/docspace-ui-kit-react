import type { TDirectionY } from "../../types";

export type TagProps = {
  /** Accepts the ref */
  ref?: React.RefObject<HTMLDivElement | null>;
  /** Accepts the tag id */
  tag: string;
  /** Accepts the tag label */
  label?: string;
  /** Accepts class */
  className?: string;
  /** Accepts id */
  id?: string;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** Accepts the tag styles as new and adds the delete button */
  isNewTag?: boolean;
  /** Accepts the tag styles as disabled and disables clicking */
  isDisabled?: boolean;
  /** Accepts the tag styles as deleted and disables clicking */
  isDeleted?: boolean;
  /** Accepts the function that is called when the tag is clicked */
  onClick?: (tag: TagClickEvent) => void;
  /** Accepts the function that ist called when the tag delete button is clicked */
  onDelete?: (tag?: string) => void;
  /** Accepts the max width of the tag */
  tagMaxWidth?: string;
  /** Accepts the icon associated with the tag */
  icon?: string | React.FC<React.SVGProps<SVGSVGElement>>;
  /** Accepts the icon class name */
  iconClassName?: string;
  /** Indicates if the tag is a default tag */
  isDefault?: boolean;
  /** Indicates if the tag is the last in a series */
  isLast?: boolean;
  /** Determines whether to show a remove icon for the tag */
  roomType?: number;
  /** Indicates the type of provider associated with the tag */
  providerType?: number;
  /** Data test id for the tag */
  dataTestId?: string;
  /** Mouse enter event handler */
  onMouseEnter?: () => void;
  /** Mouse leave event handler */
  onMouseLeave?: () => void;
  /** Accepts the tag label */
  withLabel?: boolean;
  /** Accepts an optional suffix to append after the label */
  labelSuffix?: string;
  /** Accepts the color for the label suffix */
  labelSuffixColor?: string;
};

export type TagType = {
  /** Accepts a unique key for the tag. */
  key?: string;
  /** Indicates if the tag is a default tag. */
  isDefault?: boolean;
  /** Indicates if the tag is associated with a third-party provider. */
  isThirdParty?: boolean;
  /** Accepts the tag label */
  label: string;
  /** Accepts the max width of the tag */
  maxWidth?: string;
  /** Accepts the dropdown options */
  advancedOptions?: string[];
  /** Accepts the tag styles as disabled and disables clicking */
  isDisabled?: boolean;
  /** Indicates the type of room associated with the tag. */
  roomType?: number;
  /** Accepts the icon associated with the tag. */
  icon?: string | React.FC<React.SVGProps<SVGSVGElement>>;
  /** Indicates the type of provider associated with the tag. */
  providerType?: number;
  /** Accepts the function that is called when the tag is clicked */
  onClick?: () => void;
  /** Indicates if the tag is an overflow trigger */
  isOptionTag?: boolean;
  /** Accepts an optional suffix to append after the label */
  labelSuffix?: string;
  /** Accepts the color for the label suffix */
  labelSuffixColor?: string;
};

export type TagClickEvent = {
  label: string;
  roomType?: number;
  providerType?: number;
};
