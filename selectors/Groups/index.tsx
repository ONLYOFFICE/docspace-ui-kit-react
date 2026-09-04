import { useCallback, useRef, useState } from "react";

import EmptyScreenGroupLight from "../../assets/emptyview/empty.groups.light.svg";
import EmptyScreenGroupDark from "../../assets/emptyview/empty.groups.dark.svg";

import { useApi } from "../../providers/api/ApiProvider";
import { useCommonTranslation } from "../../utils/i18n";
import {
  RowLoader,
  SearchLoader,
  Selector,
  type TSelectorItem,
  type TSelectorWithAside,
} from "../../components/selector";
import { toastr, type TData } from "../../components/toast";
import { useTheme } from "../../context/ThemeContext";
import useContentLoading from "../utils/hooks/useContentLoading";

import type { GroupsSelectorProps } from "./GroupsSelector.types";

const GroupsSelector = (props: GroupsSelectorProps) => {
  const {
    id,
    className,

    headerProps,

    useAside,
    onClose,
    withoutBackground,
    withBlur,

    onSubmit,
  } = props;

  const t = useCommonTranslation();
  const { groupApi } = useApi();
  const { isBase } = useTheme();

  const emptyScreenImg = isBase ? (
    <EmptyScreenGroupLight />
  ) : (
    <EmptyScreenGroupDark />
  );

  const [searchValue, setSearchValue] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [itemsList, setItemsList] = useState<TSelectorItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<TSelectorItem | null>(null);
  const { isContentLoading, startContentLoading, finishContentLoading } =
    useContentLoading();

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const afterSearch = useRef(false);
  const totalRef = useRef(0);

  const onSelect = (
    item: TSelectorItem,
    isDoubleClick: boolean,
    doubleClickCallback: () => void,
  ) => {
    setSelectedItem((el) => {
      if (el?.id === item.id) return null;

      return item;
    });

    if (isDoubleClick) {
      doubleClickCallback();
    }
  };
  const onSearch = useCallback(
    (value: string, callback?: () => void) => {
      afterSearch.current = true;
      startContentLoading();
      setSearchValue(() => {
        return value;
      });
      callback?.();
    },
    [startContentLoading],
  );

  const onClearSearch = useCallback(
    (callback?: () => void) => {
      afterSearch.current = true;
      startContentLoading();
      setSearchValue(() => {
        return "";
      });
      callback?.();
    },
    [startContentLoading],
  );

  const onSubmitAction = useCallback(
    (items: TSelectorItem[]) => {
      onSubmit?.(items);
    },
    [onSubmit],
  );

  const onLoadNextPage = useCallback(
    async (startIndex: number) => {
      const pageCount = 100;
      setIsNextPageLoading(true);

      try {
        const res = await groupApi.getGroups({
          count: pageCount,
          startIndex,
          filterValue: searchValue,
        });

        const items = res.data.response ?? [];
        const total = res.data.count ?? 0;

        const convertedItems: TSelectorItem[] = items.map((group) => ({
          id: group.id,
          label: group.name ?? "",
          name: group.name ?? "",
          isGroup: true,
        }));

        if (startIndex === 0) {
          totalRef.current = total;
          setItemsList([...convertedItems]);
          setHasNextPage(convertedItems.length < total);
        } else {
          setItemsList((value) => {
            const arr = [...value, ...convertedItems];
            setHasNextPage(arr.length < total);
            return arr;
          });
        }
      } catch (error) {
        toastr.error(error as TData);
      } finally {
        setIsNextPageLoading(false);
        setIsFirstLoad(false);
        finishContentLoading();
      }
    },
    [searchValue, groupApi, finishContentLoading],
  );

  const withAside: TSelectorWithAside = useAside
    ? { useAside, onClose, withBlur, withoutBackground }
    : {};

  return (
    <Selector
      id={id}
      className={className}
      withHeader
      {...withAside}
      headerProps={{
        ...headerProps,
        onCloseClick: headerProps?.onCloseClick ?? onClose ?? (() => {}),
        headerLabel: headerProps?.headerLabel || t("Groups"),
      }}
      alwaysShowFooter={itemsList.length !== 0 || Boolean(searchValue)}
      withSearch
      searchPlaceholder={t("Search")}
      onSearch={onSearch}
      searchValue={searchValue}
      onClearSearch={onClearSearch}
      isSearchLoading={false}
      disableSubmitButton={!selectedItem}
      isMultiSelect={false}
      items={itemsList}
      submitButtonLabel={t("SelectAction")}
      onSubmit={onSubmitAction}
      emptyScreenImage={emptyScreenImg}
      emptyScreenHeader={t("NotFoundGroups")}
      emptyScreenDescription={t("GroupsNotFoundDescription")}
      searchEmptyScreenImage={emptyScreenImg}
      searchEmptyScreenHeader={t("NotFoundGroups")}
      searchEmptyScreenDescription={t("GroupsNotFoundDescription")}
      totalItems={totalRef.current}
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      loadNextPage={onLoadNextPage}
      isLoading={isFirstLoad}
      isContentLoading={isContentLoading}
      searchLoader={<SearchLoader />}
      onSelect={onSelect}
      rowLoader={
        <RowLoader
          isMultiSelect={false}
          isContainer={isFirstLoad}
          isUser={false}
        />
      }
      dataTestId="groups_selector"
    />
  );
};

export default GroupsSelector;
