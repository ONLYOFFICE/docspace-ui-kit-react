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

import React, { useEffect } from "react";

import InfoIconSvgUrl from "../../assets/info.outline.react.svg";
import EmptyScreenAIAgentsSelectorLight from "../../assets/ai.agents.selector.light.react.svg";
import EmptyScreenAIAgentsSelectorDark from "../../assets/ai.agents.selector.dark.react.svg";

import { useTheme } from "../../context/ThemeContext";
import { useCommonTranslation } from "../../utils/i18n";

import {
  Selector,
  SearchLoader,
  RowLoader,
  type TSelectorItem,
  type TSelectorCancelButton,
  type TSelectorHeader,
  type TSelectorSearch,
} from "../../components/selector";

import useSocketHelper from "../utils/hooks/useSocketHelper";
import useAgentsHelper from "../utils/hooks/useAgentsHelper";
import {
  LoadersContext,
  LoadersContextProvider,
} from "../utils/contexts/Loaders";

import type { AIAgentSelectorProps } from "./AIAgent.types";
import { convertToItems } from "./AIAgent.utils";

const AIAgentSelectorComponent = ({
  id,
  className,
  style,

  excludeItems,

  onSubmit,

  withPadding,

  setIsDataReady,

  onClose,

  withInit,
  initItems,
  initTotal,
  initHasNextPage,
  initSearchValue,
  disableBySecurity,
}: AIAgentSelectorProps) => {
  const t = useCommonTranslation();
  const { isBase } = useTheme();

  const {
    isFirstLoad,
    isNextPageLoading,
    setIsFirstLoad,
    showBodyLoader,
  } = React.useContext(LoadersContext);

  const [isContentLoading, setIsContentLoadingRaw] = React.useState(false);
  const [wasEmptyScreen, setWasEmptyScreen] = React.useState(false);

  const setIsContentLoading = React.useCallback((value: boolean) => {
    setIsContentLoadingRaw(value);
    if (!value) {
      setWasEmptyScreen(false);
    }
  }, []);

  const [searchValue, setSearchValue] = React.useState(() =>
    withInit ? initSearchValue : "",
  );
  const [hasNextPage, setHasNextPage] = React.useState(() =>
    withInit ? initHasNextPage : false,
  );
  const [selectedItem, setSelectedItem] = React.useState<TSelectorItem | null>(
    null,
  );
  const [withInfo, setWithInfo] = React.useState(true);

  const [total, setTotal] = React.useState(() => (withInit ? initTotal : -1));
  const [items, setItems] = React.useState<TSelectorItem[]>(
    withInit
      ? convertToItems(initItems, disableBySecurity).filter((x) =>
          excludeItems ? !excludeItems.includes(x.id) : true,
        )
      : [],
  );

  const isInitRef = React.useRef<boolean>(!withInit);
  const afterSearch = React.useRef(false);

  const setIsInit = React.useCallback((value: boolean) => {
    isInitRef.current = value;
  }, []);

  const onSelect = (
    item: TSelectorItem,
    isDoubleClick: boolean,
    doubleClickCallback: () => void,
  ) => {
    if (
      item.security &&
      "UseChat" in item.security &&
      !item.security?.UseChat
    ) {
      setSelectedItem(null);

      return;
    }

    setSelectedItem((el) => {
      if (el?.id === item.id) return null;

      if (
        item.security &&
        "UseChat" in item.security &&
        !item.security?.UseChat
      ) {
        return null;
      }

      return item;
    });
    if (isDoubleClick) {
      doubleClickCallback();
    }
  };

  useEffect(() => {
    setIsDataReady?.(!isFirstLoad);
  }, [setIsDataReady, isFirstLoad]);

  const onSearchAction = React.useCallback(
    (value: string, callback?: VoidFunction) => {
      afterSearch.current = true;
      if (isFirstLoad) {
        setIsFirstLoad(true);
      } else {
        setIsContentLoading(true);
      }
      setSearchValue(() => {
        return value;
      });
      callback?.();
    },
    [isFirstLoad, setIsFirstLoad, setIsContentLoading],
  );

  const { subscribe } = useSocketHelper({
    withCreate: true,
    setTotal,
    setItems,
    disabledItems: [],
    disableBySecurity,
  });

  const onClearSearchAction = React.useCallback(
    (callback?: VoidFunction) => {
      afterSearch.current = true;
      if (isFirstLoad) {
        setIsFirstLoad(true);
      } else {
        if (items.length === 0) {
          setWasEmptyScreen(true);
        }
        setIsContentLoading(true);
      }
      setSearchValue(() => {
        return "";
      });
      callback?.();
    },
    [isFirstLoad, setIsFirstLoad, setIsContentLoading, items.length],
  );

  const { getAgentList: onLoadNextPage } = useAgentsHelper({
    withCreate: true,
    isInit: isInitRef.current,
    setIsInit,
    createDefineLabel: t("CreateAIAgent", {
      aiAgent: t("AIAgent"),
    }),
    excludeItems,
    searchValue,
    setHasNextPage,
    setTotal,
    setItems,
    withInit,
    subscribe,
    disableBySecurity,
    setIsContentLoading,
  });

  React.useEffect(() => {
    const withInfo =
      items.length > 1
        ? items.length === 2
          ? !items[1].isInputItem
          : true
        : false;

    setWithInfo(withInfo);
  }, [items]);

  const headerSelectorProps: TSelectorHeader = {
    withHeader: true,
    headerProps: {
      headerLabel: t("AIAgents"),
      onCloseClick: onClose,
      isCloseable: true,
    },
  };

  const cancelButtonSelectorProps: TSelectorCancelButton = {
    withCancelButton: true,
    cancelButtonLabel: t("CancelButton"),
    onCancel: onClose,
  };

  const searchSelectorProps: TSelectorSearch = {
    withSearch: true,
    searchPlaceholder: t("Search"),
    searchValue,
    onSearch: onSearchAction,
    onClearSearch: onClearSearchAction,
    searchLoader: <SearchLoader />,
    isSearchLoading: isFirstLoad && !searchValue && !afterSearch.current,
  };

  return (
    <Selector
      id={id}
      className={className}
      style={style}
      {...headerSelectorProps}
      {...cancelButtonSelectorProps}
      {...searchSelectorProps}
      withPadding={withPadding}
      onSelect={onSelect}
      items={items}
      submitButtonLabel={t("SelectAction")}
      onSubmit={onSubmit}
      isMultiSelect={false}
      emptyScreenImage={
        isBase ? (
          <EmptyScreenAIAgentsSelectorLight />
        ) : (
          <EmptyScreenAIAgentsSelectorDark />
        )
      }
      emptyScreenHeader={t("NoAIAgents", {
        aiAgents: t("AIAgents"),
      })}
      emptyScreenDescription={t("NoAIAgentsDescription")}
      searchEmptyScreenImage={
        isBase ? (
          <EmptyScreenAIAgentsSelectorLight />
        ) : (
          <EmptyScreenAIAgentsSelectorDark />
        )
      }
      searchEmptyScreenHeader={t("NoAIAgentsSearch", {
        aiAgents: t("AIAgents"),
      })}
      searchEmptyScreenDescription={t("NoAIAgentsSearchDescription")}
      totalItems={total}
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      loadNextPage={onLoadNextPage}
      isLoading={showBodyLoader || isContentLoading}
      isContentLoading={isContentLoading}
      wasEmptyScreen={wasEmptyScreen}
      disableSubmitButton={!selectedItem}
      alwaysShowFooter={items.length !== 0 || Boolean(searchValue)}
      rowLoader={
        <RowLoader
          isMultiSelect={false}
          isContainer={showBodyLoader}
          isUser={false}
        />
      }
      isSSR={withInit}
      dataTestId="ai_agent_selector"
      useAside
      onClose={onClose}
      withInfoBar={withInfo}
      infoBarData={{
        title: t("ChooseAIAgent", {
          aiAgent: t("AIAgent"),
        }),
        icon: <InfoIconSvgUrl />,
        onClose: () => setWithInfo(!withInfo),
        description: t("ChooseAIAgentDescription"),
      }}
      hideBackButton
    />
  );
};

const AIAgentSelector = (props: AIAgentSelectorProps) => {
  const { withInit } = props;

  return (
    <LoadersContextProvider withInit={withInit}>
      <AIAgentSelectorComponent {...props} />
    </LoadersContextProvider>
  );
};

export default AIAgentSelector;
