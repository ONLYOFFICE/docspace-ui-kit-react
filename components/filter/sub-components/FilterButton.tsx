import React from "react";

import { FilterButtonProps } from "../Filter.types";

import FilterBlock from "./FilterBlock";
import FilterIcon from "./FilterIcon";

const FilterButton = ({
  onFilter,
  getFilterData,
  selectedFilterValue,
  filterHeader,
  selectorLabel,
  isRooms,
  isContactsPage,
  isContactsPeoplePage,
  isContactsGroupsPage,
  isContactsInsideGroupPage,
  isContactsGuestsPage,
  id,
  title,
  userId,
  disableThirdParty,
  renderSelector,
}: FilterButtonProps) => {
  const [showFilterBlock, setShowFilterBlock] = React.useState(false);

  const changeShowFilterBlock = React.useCallback(() => {
    setShowFilterBlock((value) => !value);
  }, [setShowFilterBlock]);

  return (
    <>
      <FilterIcon
        id={id}
        title={title}
        onClick={changeShowFilterBlock}
        isOpen={showFilterBlock}
        isShowIndicator={
          selectedFilterValue ? selectedFilterValue.size > 0 : false
        }
      />
      {showFilterBlock ? (
        <FilterBlock
          filterHeader={filterHeader}
          selectedFilterValue={selectedFilterValue}
          hideFilterBlock={changeShowFilterBlock}
          getFilterData={getFilterData}
          onFilter={onFilter}
          selectorLabel={selectorLabel}
          isRooms={isRooms}
          isContactsPage={isContactsPage}
          isContactsPeoplePage={isContactsPeoplePage}
          isContactsGroupsPage={isContactsGroupsPage}
          isContactsInsideGroupPage={isContactsInsideGroupPage}
          isContactsGuestsPage={isContactsGuestsPage}
          userId={userId}
          disableThirdParty={disableThirdParty}
          renderSelector={renderSelector}
        />
      ) : null}
    </>
  );
};

export default React.memo(FilterButton);
