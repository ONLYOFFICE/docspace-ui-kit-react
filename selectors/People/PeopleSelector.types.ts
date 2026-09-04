import type {
  EmployeeFullDto,
  EmployeeStatus as EmployeeStatusType,
  Area,
} from "@onlyoffice/docspace-api-sdk";
import type {
  TSelectorAccessRights,
  TSelectorCancelButton,
  TSelectorCheckbox,
  TSelectorHeader,
  TSelectorInfo,
  TSelectorSubmitButton,
  TSelectorWithAside,
} from "../../components/selector";
import type { EmployeeType } from "../../enums";

export type PeopleFilter = {
  employeeStatus?: EmployeeStatusType;
  role?: EmployeeType[];
  area?: Area;
  includeShared?: boolean;
};

export type UserTooltipProps = {
  avatarUrl: string;
  label: string;
  email: string;
  position: string;
  className?: string;

  // Accessibility attributes
  "aria-label"?: string;
};

export type ContactsSelectorGroups =
  | { withGroups: true; isGroupsOnly?: boolean }
  | { withGroups?: never; isGroupsOnly?: never };

export type ContactsSelectorGuests =
  | { withGuests: boolean; isGuestsOnly?: boolean }
  | { withGuests?: never; isGuestsOnly?: never };

export type PeopleSelectorProps = TSelectorHeader &
  TSelectorInfo &
  TSelectorCancelButton &
  TSelectorCheckbox &
  TSelectorAccessRights &
  TSelectorWithAside &
  TSelectorSubmitButton & {
    targetEntityType?: "file" | "folder" | "room";
    disabledInvitedText?: string;
    id?: string;
    className?: string;
    style?: React.CSSProperties;

    filter?: PeopleFilter | (() => PeopleFilter);

    isMultiSelect?: boolean;

    currentUserId?: string;
    filterUserId?: string;
    withOutCurrentAuthorizedUser?: boolean;

    excludeItems?: string[];
    disableInvitedUsers?: string[];
    disableDisabledUsers?: boolean;

    emptyScreenHeader?: string;
    emptyScreenDescription?: string;

    roomId?: string | number;
    setActiveTab?: (id: string) => void;

    checkIfUserInvited?: (user: EmployeeFullDto) => boolean;
    injectedElement?: React.ReactElement;
    alwaysShowFooter?: boolean;
    onlyRoomMembers?: boolean;
    isAgent?: boolean;
    // Accessibility attributes
    "aria-label"?: string;
    "data-selector-type"?: string;
    "data-test-id"?: string;
  } & ContactsSelectorGroups &
  ContactsSelectorGuests;

