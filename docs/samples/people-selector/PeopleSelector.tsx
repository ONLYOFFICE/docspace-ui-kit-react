import { useMemo, useState } from "react";
import { EmployeeStatus, EmployeeType } from "@onlyoffice/docspace-api-sdk";

import EmptyFilterPeopleDarkUrl from "../../../assets/emptyFilter/empty.filter.people.dark.svg?url";
import EmptyFilterPeopleLightUrl from "../../../assets/emptyFilter/empty.filter.people.light.svg?url";
import PeopleReactSvgUrl from "../../../assets/icons/16/people.react.svg?url";
import { AvatarRole } from "../../../components/avatar";
import { Button, ButtonSize } from "../../../components/button";
import { Loader, LoaderTypes } from "../../../components/loader";
import { Selector } from "../../../components/selector";
import type { TAccessRight, TSelectorItem } from "../../../components/selector";
import { Text } from "../../../components/text";
import { Toast, toastr } from "../../../components/toast";
import { useTheme } from "../../../context/ThemeContext";
import { globalColors } from "../../../providers/theme";
import { sampleUsers } from "../sample-data";

const accessRights: TAccessRight[] = [
  { key: "admin", label: "Room admin", access: 0 },
  { key: "editor", label: "Editor", access: 1 },
  { key: "viewer", label: "Viewer", access: 2 },
];

/** A portal user, in the shape the Selector's item union calls a user. */
const toSelectorItem = (user: (typeof sampleUsers)[number]): TSelectorItem => ({
  id: user.id,
  key: user.id,
  label: user.displayName,
  email: user.email,
  avatar: "",
  hasAvatar: false,
  role: AvatarRole.user,
  userType: EmployeeType.User,
  status: EmployeeStatus.Active,
  isOwner: false,
  isAdmin: false,
  isRoomAdmin: user.role === "Room admin",
  isCollaborator: false,
  isVisitor: user.role === "Guest",
});

/**
 * The people picker, opened from a real button and answering back.
 *
 * `Selector` is one component with a lot of opt-in parts, and the opt-ins are
 * typed as pairs: `withSearch` demands the search handlers, `withSelectAll`
 * demands the label and the callback, `withAccessRights` demands the rights and
 * their change handler. TypeScript will not let you turn a section on and
 * forget to wire it -- which is the whole reason those unions look the way they
 * do.
 *
 * Selection is the component's own business. You hand it `items` and the
 * initial `selectedItems`, and it hands the final answer to `onSubmit`
 * together with the chosen access right.
 */
export const PeopleSelector = () => {
  const { isBase } = useTheme();

  const [isOpen, setIsOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [access, setAccess] = useState<TAccessRight>(accessRights[1]);
  const [invited, setInvited] = useState<string[]>([]);

  const items = useMemo(() => {
    const matches = query
      ? sampleUsers.filter((user) =>
          `${user.displayName} ${user.email}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
      : sampleUsers;

    return matches.map(toSelectorItem);
  }, [query]);

  const emptyImage = isBase
    ? EmptyFilterPeopleLightUrl
    : EmptyFilterPeopleDarkUrl;

  if (!isOpen) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Toast />
        <Text fontSize="13px">
          {invited.length > 0
            ? `Invited: ${invited.join(", ")}`
            : "Nobody was invited."}
        </Text>
        <Button
          primary
          label="Open the picker again"
          size={ButtonSize.normal}
          style={{ width: "fit-content" }}
          onClick={() => setIsOpen(true)}
        />
      </div>
    );
  }

  return (
    <div>
      <Toast />

      {/* The Selector fills its container: give it one with a size. */}
      <div
        style={{
          width: "480px",
          height: "560px",
          border: `1px solid ${
            isBase ? globalColors.grayLightMid : globalColors.grayDarkStrong
          }`,
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <Selector
          withHeader
          headerProps={{
            headerLabel: "Invite people",
            onCloseClick: () => setIsOpen(false),
          }}
          items={items}
          isMultiSelect
          selectedItems={[]}
          withSelectAll
          selectAllLabel="All members of the portal"
          selectAllIcon={PeopleReactSvgUrl}
          onSelectAll={() => undefined}
          withSearch
          searchPlaceholder="Search by name or email"
          searchValue={query}
          isSearchLoading={false}
          searchLoader={<Loader type={LoaderTypes.track} size="20px" />}
          onSearch={(value, callback) => {
            setQuery(value);
            callback?.();
          }}
          onClearSearch={(callback) => {
            setQuery("");
            callback?.();
          }}
          withAccessRights
          accessRights={accessRights}
          selectedAccessRight={access}
          onAccessRightsChange={setAccess}
          submitButtonLabel="Invite"
          disableSubmitButton={false}
          onSubmit={(selected, selectedAccess) => {
            setInvited(selected.map((item) => item.label));
            setIsOpen(false);
            toastr.success(
              `${selected.length} invited as ${String(
                selectedAccess?.label ?? access.label,
              ).toLowerCase()}`,
            );
          }}
          withCancelButton
          cancelButtonLabel="Cancel"
          onCancel={() => setIsOpen(false)}
          emptyScreenImage={emptyImage}
          emptyScreenHeader="No members yet"
          emptyScreenDescription="People invited to the portal will show up here."
          searchEmptyScreenImage={emptyImage}
          searchEmptyScreenHeader="Nobody matches that"
          searchEmptyScreenDescription="Try a shorter query, or invite them by email instead."
          totalItems={items.length}
          hasNextPage={false}
          isNextPageLoading={false}
          isLoading={false}
          loadNextPage={async () => {}}
          rowLoader={<Loader type={LoaderTypes.track} size="20px" />}
        />
      </div>
    </div>
  );
};
