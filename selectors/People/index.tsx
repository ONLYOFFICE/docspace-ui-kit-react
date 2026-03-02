// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import DefaultUserPhoto from "../../assets/default_user_photo_size_82-82.png";
import EmptyScreenPersonsLight from "../../assets/empty.filter.people.light.react.svg";
import EmptyScreenPersonsDark from "../../assets/empty.filter.people.dark.react.svg";

import axios from "axios";
import { useState, useCallback, useRef, useEffect } from "react";

import {
  Selector,
  SelectorAccessRightsMode,
  RowLoader,
  SearchLoader,
  type TSelectorAccessRights,
  type TSelectorCancelButton,
  type TSelectorCheckbox,
  type TSelectorHeader,
  type TSelectorInfo,
  type TSelectorItem,
  type TSelectorSearch,
  type TSelectorTabs,
  type TSelectorWithAside,
} from "../../components/selector";
import {
  EmployeeStatus,
  Area,
  type EmployeeFullDto,
  type GroupDto,
  type EmployeeType as SdkEmployeeType,
} from "@onlyoffice/docspace-api-sdk";
import { useApi } from "../../providers/api/ApiProvider";
import { getCommonTranslation } from "../../utils/i18n";
import { getUserAvatarRoleByType, getUserType } from "../../utils/common";
import { Text } from "../../components/text";
import { globalColors } from "../../providers/theme";
import { isNextImage } from "../../utils/typeGuards";
import { toastr } from "../../components/toast";
import { useTheme } from "../../context/ThemeContext";

import type { PeopleSelectorProps } from "./PeopleSelector.types";
import StyledSendClockIcon from "./components/SendClockIcon";
import styles from "./PeopleSelector.module.scss";

const PEOPLE_TAB_ID = "0";
const GROUP_TAB_ID = "1";
const GUESTS_TAB_ID = "2";

const toListItem = (
  item: EmployeeFullDto | GroupDto,
  baseUrl: string,
  disableDisabledUsers?: boolean,
  disableInvitedUsers?: string[],
  isRoom?: boolean,
  checkIfUserInvited?: (user: EmployeeFullDto) => void,
  disabledInvitedText?: string,
): TSelectorItem => {
  if ("displayName" in item) {
    const {
      id: userId,
      email,
      avatar,
      displayName,
      hasAvatar,
      isOwner,
      isAdmin,
      isVisitor,
      isCollaborator,
      isRoomAdmin,
      status,
      shared,
      groups,
    } = item;

    const access = (item as Record<string, unknown>).access as
      | number
      | undefined;

    const role = getUserType(item);

    const defaultUserPhotoURL = isNextImage(DefaultUserPhoto)
      ? DefaultUserPhoto.src
      : DefaultUserPhoto;

    const avatarPath = hasAvatar && avatar ? avatar : defaultUserPhotoURL;
    const userAvatar =
      typeof avatarPath === "string" && avatarPath.startsWith("/")
        ? `${baseUrl}${avatarPath}`
        : avatarPath;

    const isInvited = checkIfUserInvited
      ? checkIfUserInvited(item)
      : (userId && disableInvitedUsers?.includes(userId)) || (isRoom && shared);

    const isDisabled =
      disableDisabledUsers && status === EmployeeStatus.Terminated;

    const disabledText = isInvited
      ? (disabledInvitedText ?? getCommonTranslation("Invited"))
      : isDisabled
        ? getCommonTranslation("Disabled")
        : "";

    const avatarRole = getUserAvatarRoleByType(role);

    const i: TSelectorItem = {
      id: userId,
      email: email ?? "",
      avatar: userAvatar,
      label: displayName || email || "",
      displayName: displayName || email || "",
      role: avatarRole,
      userType: role as unknown as SdkEmployeeType,
      isOwner: isOwner ?? false,
      isAdmin: isAdmin ?? false,
      isVisitor: isVisitor ?? false,
      isCollaborator: isCollaborator ?? false,
      isRoomAdmin: isRoomAdmin ?? false,
      hasAvatar: hasAvatar ?? false,
      isDisabled: !!isInvited || isDisabled,
      disabledText,
      status: status!,
      groups: groups?.map((g) => ({
        id: g.id,
        manager: g.manager ?? "",
        name: g.name ?? "",
      })),
      access,
    };

    return i;
  }

  const groupItem = item as GroupDto;
  const { id, name: groupName, shared, isSystem } = groupItem;

  const isInvited =
    (id && disableInvitedUsers?.includes(id)) || (isRoom && shared);
  const disabledText = isInvited
    ? (disabledInvitedText ?? getCommonTranslation("Invited"))
    : "";

  return {
    id,
    name: groupName ?? "",
    isGroup: true,
    label: groupName ?? "",
    disabledText,
    isDisabled: !!isInvited,
    isSystem: isSystem ?? undefined,
  };
};

const PeopleSelector = ({
  submitButtonLabel,
  submitButtonId,
  disableSubmitButton,
  onSubmit,

  id,
  className,
  style,

  withCancelButton,
  cancelButtonLabel,
  onCancel,

  filter,

  excludeItems,

  filterUserId,
  currentUserId,

  // Accessibility attributes
  "aria-label": ariaLabel,
  "data-selector-type": dataSelectorType,
  "data-test-id": dataTestId,
  withOutCurrentAuthorizedUser,

  withFooterCheckbox,
  footerCheckboxLabel,
  isChecked,

  withHeader,
  headerProps,

  disableDisabledUsers,
  disableInvitedUsers,
  isMultiSelect,

  withInfo,
  infoText,

  emptyScreenHeader,
  emptyScreenDescription,

  roomId,

  checkIfUserInvited,

  withGroups,
  isGroupsOnly,

  withGuests,
  isGuestsOnly,

  withAccessRights,
  accessRights,
  selectedAccessRight,
  onAccessRightsChange,
  accessRightsMode,

  useAside,
  onClose,
  withoutBackground,
  withBlur,
  setActiveTab,
  injectedElement,
  alwaysShowFooter = false,
  onlyRoomMembers,
  targetEntityType = "room",
  disabledInvitedText,
  isAgent,
}: PeopleSelectorProps) => {
  const { peopleSearchApi, groupSearchApi, baseUrl } = useApi();
  const { isBase } = useTheme();

  const [activeTabId, setActiveTabId] = useState<string>(
    isGuestsOnly ? GUESTS_TAB_ID : isGroupsOnly ? GROUP_TAB_ID : PEOPLE_TAB_ID,
  );

  const [itemsList, setItemsList] = useState<TSelectorItem[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [total, setTotal] = useState<number>(-1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<TSelectorItem[]>([]);
  const isFirstLoadRef = useRef(true);
  const afterSearch = useRef(false);
  const totalRef = useRef(0);
  const searchTab = useRef(PEOPLE_TAB_ID);
  const abortControllerRef = useRef(new AbortController());

  useEffect(() => () => abortControllerRef.current.abort(), []);

  const onSelect = (
    item: TSelectorItem,
    isDoubleClick: boolean,
    doubleClickCallback: () => void,
  ) => {
    setSelectedItems((prevItems) => {
      if (!isMultiSelect) {
        return item.isSelected ? [] : [item];
      }

      return item.isSelected
        ? prevItems.filter((p) => p.id !== item.id)
        : [...prevItems, item];
    });
    if (isDoubleClick) {
      doubleClickCallback();
    }
  };

  const moveCurrentUserToTopOfList = useCallback(
    (listUser: TSelectorItem[]) => {
      const currentUserIndex = listUser.findIndex(
        (user) => user.id === currentUserId,
      );

      // return if the current user is already at the top of the list or not found
      if (currentUserIndex < 1) return listUser;

      const [currentUser] = listUser.splice(currentUserIndex, 1);

      listUser.splice(0, 0, currentUser);

      return listUser;
    },
    [currentUserId],
  );

  const removeCurrentUserFromList = useCallback(
    (listUser: TSelectorItem[]) => {
      if (filterUserId) {
        return listUser.filter((user) => user.id !== filterUserId);
      }
      return listUser.filter((user) => user.id !== currentUserId);
    },
    [currentUserId, filterUserId],
  );

  const loadNextPage = useCallback(
    async (startIndex: number) => {
      try {
        if (searchTab.current !== activeTabId && searchValue) {
          setSearchValue("");
          searchTab.current = activeTabId;
          return;
        }
        const pageCount = 100;

        setIsNextPageLoading(true);

        const isGroupsTab =
          (withGroups || withGuests) && activeTabId === GROUP_TAB_ID;

        const currentFilter =
          typeof filter === "function" ? filter() : (filter ?? {});

        let area: Area | undefined;
        if (activeTabId === GUESTS_TAB_ID) {
          area = Area.Guests;
        } else if (activeTabId === PEOPLE_TAB_ID) {
          area = currentFilter.area ?? Area.People;
        }

        const includeShared = onlyRoomMembers || currentFilter.includeShared;
        const filterValue = searchValue || undefined;
        const signal = (() => {
          abortControllerRef.current.abort();
          abortControllerRef.current = new AbortController();
          return abortControllerRef.current.signal;
        })();

        let items: (EmployeeFullDto | GroupDto)[] = [];
        let responseTotal = 0;

        if (!roomId) {
          const res = await peopleSearchApi.searchUsersByExtendedFilter(
            currentFilter.employeeStatus,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            area,
            pageCount,
            startIndex,
            undefined,
            undefined,
            undefined,
            filterValue,
            { signal },
          );
          items = res.data.response ?? [];
          responseTotal = res.data.count ?? 0;
        } else if (isGroupsTab) {
          const id = Number(roomId);
          const fetcher =
            targetEntityType === "file"
              ? groupSearchApi.getGroupsWithFilesShared.bind(groupSearchApi)
              : targetEntityType === "folder"
                ? groupSearchApi.getGroupsWithFoldersShared.bind(groupSearchApi)
                : groupSearchApi.getGroupsWithRoomsShared.bind(groupSearchApi);

          const res = await fetcher(
            id,
            undefined,
            pageCount,
            startIndex,
            filterValue,
            { signal },
          );
          items = (res.data.response ?? []).map((g) => ({
            ...g,
            isGroup: true,
          }));
          responseTotal = res.data.count ?? 0;
        } else {
          const id = Number(roomId);
          const fetcher =
            targetEntityType === "file"
              ? peopleSearchApi.getUsersWithFilesShared.bind(peopleSearchApi)
              : targetEntityType === "folder"
                ? peopleSearchApi.getUsersWithFoldersShared.bind(
                    peopleSearchApi,
                  )
                : peopleSearchApi.getUsersWithRoomShared.bind(peopleSearchApi);

          const res = await fetcher(
            id,
            currentFilter.employeeStatus,
            undefined,
            undefined,
            includeShared,
            undefined,
            undefined,
            area,
            undefined,
            pageCount,
            startIndex,
            undefined,
            filterValue,
            { signal },
          );
          items = res.data.response ?? [];
          responseTotal = res.data.count ?? 0;
        }

        let totalDifferent = startIndex ? responseTotal - totalRef.current : 0;

        const data = items
          .filter((item) => {
            if (
              (excludeItems && item.id && excludeItems.includes(item.id)) ||
              ("status" in item && item.status === EmployeeStatus.Terminated)
            ) {
              totalDifferent += 1;
              return false;
            }
            return true;
          })
          .map((item) =>
            toListItem(
              item,
              baseUrl,
              disableDisabledUsers,
              disableInvitedUsers,
              !!roomId,
              checkIfUserInvited,
              disabledInvitedText,
            ),
          );

        const newTotal = withOutCurrentAuthorizedUser
          ? responseTotal - totalDifferent - 1
          : responseTotal - totalDifferent;

        if (isFirstLoadRef.current) {
          const newItems = withOutCurrentAuthorizedUser
            ? removeCurrentUserFromList(data)
            : moveCurrentUserToTopOfList(data);

          setHasNextPage(newItems.length < newTotal);
          setItemsList(newItems);
        } else {
          setItemsList((i) => {
            const tempItems = [...i, ...data];

            const ids = new Set();
            const filteredTempItems = tempItems.filter(
              (item) => !ids.has(item.id) && ids.add(item.id),
            );

            const newItems = withOutCurrentAuthorizedUser
              ? removeCurrentUserFromList(filteredTempItems)
              : moveCurrentUserToTopOfList(filteredTempItems);

            setHasNextPage(newItems.length < newTotal);

            return newItems;
          });
        }

        setTotal(newTotal);
        totalRef.current = newTotal;

        setIsNextPageLoading(false);
        isFirstLoadRef.current = false;
      } catch (error) {
        if (axios.isCancel(error)) return;

        console.error(error);
        toastr.error(error as Error);
      }
    },
    [
      activeTabId,
      checkIfUserInvited,
      disableDisabledUsers,
      disableInvitedUsers,
      excludeItems,
      filter,
      moveCurrentUserToTopOfList,
      removeCurrentUserFromList,
      roomId,
      searchValue,
      withGroups,
      withGuests,
      withOutCurrentAuthorizedUser,
      onlyRoomMembers,
      targetEntityType,
      peopleSearchApi,
      groupSearchApi,
      disabledInvitedText,
    ],
  );

  const resetSelectorList = useCallback(() => {
    setItemsList([]);
    setHasNextPage(true);
    setTotal(-1);
    totalRef.current = 0;
    isFirstLoadRef.current = true;
  }, []);

  const onSearch = useCallback(
    (value: string, callback?: VoidFunction) => {
      afterSearch.current = true;
      searchTab.current = activeTabId;
      resetSelectorList();

      setSearchValue(() => {
        return value;
      });
      callback?.();
    },
    [activeTabId, resetSelectorList],
  );

  const onClearSearch = useCallback(
    (callback?: VoidFunction) => {
      afterSearch.current = true;
      resetSelectorList();
      setSearchValue(() => {
        return "";
      });

      // Trigger initial load after clearing search
      loadNextPage(0);

      callback?.();
    },
    [resetSelectorList, loadNextPage],
  );

  const emptyScreenImage = isBase ? (
    <EmptyScreenPersonsLight />
  ) : (
    <EmptyScreenPersonsDark />
  );

  const headerSelectorProps: TSelectorHeader = withHeader
    ? {
        withHeader,
        headerProps: {
          ...headerProps,
          headerLabel:
            headerProps.headerLabel || getCommonTranslation("Contacts"),
        },
      }
    : ({} as TSelectorHeader);

  const cancelButtonSelectorProps: TSelectorCancelButton = withCancelButton
    ? {
        withCancelButton,
        cancelButtonLabel:
          cancelButtonLabel || getCommonTranslation("CancelButton"),
        onCancel,
      }
    : ({} as TSelectorCancelButton);

  const searchSelectorProps: TSelectorSearch = {
    withSearch: true,
    searchPlaceholder: getCommonTranslation("Search"),
    searchValue,
    onSearch,
    onClearSearch,
    searchLoader: <SearchLoader />,
    isSearchLoading:
      isFirstLoadRef.current && !searchValue && !afterSearch.current,
  };

  const infoProps: TSelectorInfo = withInfo
    ? {
        withInfo,
        infoText,
      }
    : {};

  const checkboxSelectorProps: TSelectorCheckbox = withFooterCheckbox
    ? {
        withFooterCheckbox,
        footerCheckboxLabel,
        isChecked,
      }
    : {};

  const renderCustomItem = (
    label: string,
    userType?: string,
    email?: string,
    isGroup?: boolean,
    status?: EmployeeStatus,
    id?: string | number,
  ) => {
    return (
      <div
        style={{ width: "100%", overflow: "hidden", marginInlineEnd: "16px" }}
        aria-label={`${isGroup ? "Group" : "User"}: ${label}${
          email ? `, ${email}` : ""
        }`}
      >
        <div
          style={{
            display: "flex",
            boxSizing: "border-box",
            alignItems: "center",
          }}
        >
          <Text
            className="selector-item_label"
            fontWeight={600}
            fontSize="14px"
            noSelect
            truncate
            title={label}
            aria-label={label}
            dir="auto"
          >
            {label}
          </Text>
          {!isGroup && String(id) === currentUserId ? (
            <Text className={styles.isMeLabel} fontWeight={600} fontSize="14px">
              ({getCommonTranslation("MeLabel")})
            </Text>
          ) : null}
          {status === EmployeeStatus.Pending ? <StyledSendClockIcon /> : null}
        </div>
        {!isGroup ? (
          <div style={{ display: "flex" }}>
            <Text
              className="selector-item_label"
              fontWeight={400}
              fontSize="12px"
              noSelect
              truncate
              color={globalColors.gray}
              dir="auto"
            >
              {`${userType} | ${email}`}
            </Text>
          </div>
        ) : null}
      </div>
    );
  };

  const changeActiveTab = useCallback(
    (tab: number | string) => {
      if (setActiveTab) setActiveTab(`${tab}`);
      setActiveTabId(`${tab}`);
      onSearch("");
      resetSelectorList();
    },
    [onSearch, resetSelectorList, setActiveTab],
  );

  const withTabsProps: TSelectorTabs =
    (withGroups || withGuests) && !isGroupsOnly && !isGuestsOnly
      ? {
          withTabs: true,
          tabsData: [
            {
              id: PEOPLE_TAB_ID,
              name: getCommonTranslation("Members"),
              onClick: () => changeActiveTab(PEOPLE_TAB_ID),
              content: null,
            },
            ...[
              withGroups && {
                id: GROUP_TAB_ID,
                name: getCommonTranslation("Groups"),
                onClick: () => changeActiveTab(GROUP_TAB_ID),
                content: null,
              },
            ],
            ...[
              withGuests && {
                id: GUESTS_TAB_ID,
                name: getCommonTranslation("Guests"),
                onClick: () => changeActiveTab(GUESTS_TAB_ID),
                content: null,
              },
            ],
          ].filter((i) => !!i),
          activeTabId,
        }
      : {};

  const withAccessRightsProps: TSelectorAccessRights =
    withAccessRights && isMultiSelect
      ? {
          withAccessRights: true,
          accessRights,
          selectedAccessRight,
          onAccessRightsChange,
          accessRightsMode:
            accessRightsMode ?? SelectorAccessRightsMode.Detailed,
        }
      : {};

  const withAside: TSelectorWithAside = useAside
    ? { useAside, onClose, withBlur, withoutBackground }
    : {};

  return (
    <Selector
      {...headerSelectorProps}
      {...searchSelectorProps}
      {...checkboxSelectorProps}
      {...cancelButtonSelectorProps}
      {...infoProps}
      {...withTabsProps}
      {...withAccessRightsProps}
      {...withAside}
      id={id}
      injectedElement={injectedElement}
      alwaysShowFooter={
        itemsList.length !== 0 || Boolean(searchValue) || alwaysShowFooter
      }
      className={className}
      style={style}
      renderCustomItem={renderCustomItem}
      aria-label={ariaLabel || "People Selector"}
      data-selector-type={dataSelectorType || "people"}
      dataTestId={dataTestId || "people-selector"}
      items={itemsList}
      submitButtonLabel={
        submitButtonLabel || getCommonTranslation("SelectAction")
      }
      onSubmit={onSubmit}
      disableSubmitButton={disableSubmitButton || !selectedItems.length}
      selectedItem={isMultiSelect ? null : selectedItems[0]}
      submitButtonId={submitButtonId}
      emptyScreenImage={emptyScreenImage}
      emptyScreenHeader={
        emptyScreenHeader ??
        (activeTabId === GUESTS_TAB_ID
          ? getCommonTranslation("NotFoundGuests")
          : activeTabId === PEOPLE_TAB_ID
            ? getCommonTranslation("EmptyHeader")
            : getCommonTranslation("NotFoundGroups"))
      }
      emptyScreenDescription={
        emptyScreenDescription ??
        (activeTabId === GUESTS_TAB_ID
          ? isAgent
            ? getCommonTranslation("NotFoundGuestsDescriptionAgent")
            : getCommonTranslation("NotFoundGuestsDescription")
          : activeTabId === PEOPLE_TAB_ID
            ? getCommonTranslation("EmptyDescription", {
                productName: getCommonTranslation("ProductName"),
              })
            : getCommonTranslation("GroupsNotFoundDescription"))
      }
      searchEmptyScreenImage={emptyScreenImage}
      searchEmptyScreenHeader={
        activeTabId === GUESTS_TAB_ID
          ? getCommonTranslation("NotFoundGuestsFilter")
          : activeTabId === PEOPLE_TAB_ID
            ? getCommonTranslation("NotFoundMembers")
            : getCommonTranslation("NotFoundGroups")
      }
      searchEmptyScreenDescription={
        activeTabId === GUESTS_TAB_ID
          ? getCommonTranslation("NotFoundFilterGuestsDescription")
          : activeTabId === PEOPLE_TAB_ID
            ? getCommonTranslation("NotFoundUsersDescription")
            : getCommonTranslation("GroupsNotFoundDescription")
      }
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      loadNextPage={loadNextPage}
      isMultiSelect={isMultiSelect ?? false}
      totalItems={total}
      isLoading={isFirstLoadRef.current}
      rowLoader={
        <RowLoader
          isUser
          isContainer={isFirstLoadRef.current}
          isMultiSelect={isMultiSelect}
        />
      }
      onSelect={onSelect}
    />
  );
};

export default PeopleSelector;
