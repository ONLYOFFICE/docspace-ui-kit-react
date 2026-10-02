import React, { useEffect, useMemo } from "react";

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
  externalInfoBarData,
}: AIAgentSelectorProps) => {
  const t = useCommonTranslation();
  const { isBase } = useTheme();

  const {
    isFullLoadActive,
    isNextPageLoading,
    isContentLoading,
    startContentLoading,
    showBodyLoader,
  } = React.useContext(LoadersContext);

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
    setIsDataReady?.(!isFullLoadActive);
  }, [setIsDataReady, isFullLoadActive]);

  const onSearchAction = React.useCallback(
    (value: string, callback?: VoidFunction) => {
      afterSearch.current = true;
      startContentLoading();
      setSearchValue(() => {
        return value;
      });
      callback?.();
    },
    [startContentLoading],
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
      startContentLoading();
      setSearchValue(() => {
        return "";
      });
      callback?.();
    },
    [startContentLoading],
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
    isSearchLoading: isFullLoadActive && !searchValue && !afterSearch.current,
  };

  const infoBarData = useMemo(() => {
    if (externalInfoBarData) return externalInfoBarData;

    return {
      title: t("ChooseAIAgent", {
        aiAgent: t("AIAgent"),
      }),
      icon: <InfoIconSvgUrl />,
      onClose: () => setWithInfo((prev) => !prev),
      description: t("ChooseAIAgentDescription"),
    };
  }, [externalInfoBarData, t, setWithInfo]);

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
      isLoading={showBodyLoader}
      isContentLoading={isContentLoading}
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
      withInfoBar={Boolean(externalInfoBarData) || withInfo}
      infoBarData={infoBarData}
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
