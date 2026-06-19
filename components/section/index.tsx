/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import equal from "fast-deep-equal";
import React, { useEffect, useMemo, memo, FC, PropsWithChildren } from "react";

import OperationsProgressButton from "../operations-progress-button";

import { Provider } from "../../utils";
import { DeviceType } from "../../enums";

import SectionContainer from "./sub-components/SectionContainer";
import SubSectionHeader from "./sub-components/SectionHeader";
import SubSectionFilter from "./sub-components/SectionFilter";
import SubSectionBody from "./sub-components/SectionBody";
import SubSectionBodyContent from "./sub-components/SectionBodyContent";
import InfoPanel from "./sub-components/InfoPanel";
import SubInfoPanelBody from "./sub-components/InfoPanelBody";
import SubInfoPanelHeader from "./sub-components/InfoPanelHeader";
import ChatPanelView from "./sub-components/ChatPanel";
import SubSectionFooter from "./sub-components/SectionFooter";
import SubSectionWarning from "./sub-components/SectionWarning";
import SubSectionSubmenu from "./sub-components/SectionSubmenu";

import { SectionProps } from "./Section.types";
import {
  SECTION_BODY_NAME,
  SECTION_FILTER_NAME,
  SECTION_FOOTER_NAME,
  SECTION_HEADER_NAME,
  SECTION_INFO_PANEL_BODY_NAME,
  SECTION_INFO_PANEL_HEADER_NAME,
  SECTION_CHAT_PANEL_NAME,
  SECTION_WARNING_NAME,
  SECTION_SUBMENU_NAME,
  SECTION_BANNER_NAME,
} from "./Section.constants";
import { parseChildren } from "./Section.utils";

export type { SectionProps };

const SectionHeader: FC<PropsWithChildren> = () => null;
SectionHeader.displayName = SECTION_HEADER_NAME;

const SectionFilter: FC<PropsWithChildren> = () => null;
SectionFilter.displayName = SECTION_FILTER_NAME;

const SectionBanner: FC<PropsWithChildren> = () => null;
SectionBanner.displayName = SECTION_BANNER_NAME;

const SectionBody: FC<PropsWithChildren> = () => null;
SectionBody.displayName = SECTION_BODY_NAME;

const SectionFooter: FC<PropsWithChildren> = () => null;
SectionFooter.displayName = SECTION_FOOTER_NAME;

const InfoPanelBody: FC<PropsWithChildren> = () => null;
InfoPanelBody.displayName = SECTION_INFO_PANEL_BODY_NAME;

const InfoPanelHeader: FC<PropsWithChildren> = () => null;
InfoPanelHeader.displayName = SECTION_INFO_PANEL_HEADER_NAME;

const ChatPanel: FC<PropsWithChildren> = () => null;
ChatPanel.displayName = SECTION_CHAT_PANEL_NAME;

const SectionWarning: FC<PropsWithChildren> = () => null;
SectionWarning.displayName = SECTION_WARNING_NAME;

const SectionSubmenu: FC<PropsWithChildren> = () => null;
SectionSubmenu.displayName = SECTION_SUBMENU_NAME;

const Section = (props: SectionProps) => {
  const {
    onDrop,
    uploadFiles,
    viewAs,
    withBodyScroll = true,
    children,
    onOpenUploadPanel,
    isInfoPanelAvailable = true,
    settingsStudio = false,
    isInfoPanelScrollLocked,
    infoPanelWithoutScroll,
    currentDeviceType,

    isInfoPanelVisible,
    setIsInfoPanelVisible,
    isChatPanelAvailable = false,
    isChatPanelVisible,
    setIsChatPanelVisible,
    inert,
    isMobileHidden,
    canDisplay,
    anotherDialogOpen,
    getContextModel,
    isIndexEditingMode,

    pathname,
    secondaryOperationsCompleted,
    secondaryActiveOperations = [],
    clearSecondaryProgressData,
    cancelSecondaryOperationById,
    primaryOperationsArray = [],
    clearPrimaryProgressData,
    primaryOperationsCompleted,
    cancelUpload,
    secondaryOperationsStopped,
    secondaryOperationsAlert,
    mainButtonVisible,

    primaryOperationsAlert,
    primaryOperationsCanceled,
    needErrorChecking,

    withTabs,

    withoutFooter = false,
    onDragOverEmpty,
    onDragLeaveEmpty,
    dragging,
    clearDropPreviewLocation,
    dropTargetPreview,
    startDropPreview,
    fullHeightBody,
    asideInfoPanel,

    pluginOperations = [],
    pluginOperationsCompleted,
    pluginOperationsAlert,
    pluginShowCancelButton,
    scrollableBanner,
    stickyTableHeader,
  } = props;

  const [sectionSize, setSectionSize] = React.useState<{
    width?: number;
    height?: number;
  }>({});

  const containerRef = React.useRef<null | HTMLDivElement>(null);
  const timerRef = React.useRef<null | ReturnType<typeof setTimeout>>(null);

  const [
    sectionHeaderContent,
    sectionFilterContent,
    sectionBodyContent,
    sectionFooterContent,
    sectionWarningContent,
    infoPanelBodyContent,
    infoPanelHeaderContent,
    chatPanelContent,
    sectionSubmenuContent,
    sectionBannerContent,
  ] = parseChildren(children);

  const isSectionHeaderAvailable = !!sectionHeaderContent;
  const isSectionFilterAvailable = !!sectionFilterContent;
  const isSectionSubmenuAvailable = !!sectionSubmenuContent;
  const isSectionBodyAvailable =
    !!sectionBodyContent || isSectionFilterAvailable;
  const isSectionAvailable =
    isSectionHeaderAvailable ||
    isSectionFilterAvailable ||
    isSectionBodyAvailable;

  useEffect(() => {
    if (!containerRef.current) return;

    const measure = () => {
      if (!containerRef.current) return;
      const computedStyles = window.getComputedStyle(
        containerRef.current,
        null,
      );
      const width = +computedStyles.getPropertyValue("width").replace("px", "");
      const height = +computedStyles
        .getPropertyValue("height")
        .replace("px", "");
      setSectionSize(() => ({ width, height }));
      window.dispatchEvent(new Event("resize"));
    };

    measure();
    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [isInfoPanelVisible, isChatPanelVisible]);

  const onResize = React.useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      if (!containerRef.current) return;

      const computedStyles = window.getComputedStyle(
        containerRef.current,
        null,
      );
      const width = +computedStyles.getPropertyValue("width").replace("px", "");
      const height = +computedStyles
        .getPropertyValue("height")
        .replace("px", "");

      setSectionSize(() => ({ width, height }));
    }, 100);
  }, []);

  React.useEffect(() => {
    const elem = containerRef.current;

    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(onResize);

    if (elem) ro.observe(elem);
    return () => {
      if (elem) ro.unobserve(elem);
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  const providerValue = useMemo(
    () => ({
      sectionWidth: sectionSize.width,
      sectionHeight: sectionSize.height,
    }),
    [sectionSize.width, sectionSize.height],
  );

  const isShowOperationButton =
    secondaryActiveOperations?.length ||
    primaryOperationsArray?.length ||
    pluginOperations?.length ||
    startDropPreview;

  const isCompletedOperations = useMemo(() => {
    const hasMultipleOperations =
      (secondaryActiveOperations?.length || 0) +
        (primaryOperationsArray?.length || 0) +
        (pluginOperations?.length || 0) >
      1;

    if (hasMultipleOperations) {
      const completionStates = [];

      if (secondaryActiveOperations?.length)
        completionStates.push(secondaryOperationsCompleted);

      if (primaryOperationsArray?.length)
        completionStates.push(primaryOperationsCompleted);

      if (pluginOperations?.length)
        completionStates.push(pluginOperationsCompleted);

      return completionStates.every((state) => state);
    }

    if (pluginOperations?.length > 0) return pluginOperationsCompleted;

    if (secondaryActiveOperations?.length > 0)
      return secondaryOperationsCompleted;

    return primaryOperationsCompleted;
  }, [
    secondaryOperationsCompleted,
    primaryOperationsCompleted,
    pluginOperationsCompleted,
    secondaryActiveOperations,
    primaryOperationsArray,
    pluginOperations,
  ]);

  const totalOperationsCount =
    (secondaryActiveOperations?.length || 0) +
    (primaryOperationsArray?.length || 0) +
    (pluginOperations?.length || 0);

  const showCancelButton =
    (primaryOperationsArray.length > 0 &&
      !primaryOperationsCompleted &&
      primaryOperationsArray.some((op) => op.operation === "upload")) ||
    pluginShowCancelButton ||
    (totalOperationsCount === 1 &&
      secondaryActiveOperations.length === 1 &&
      !secondaryOperationsCompleted);

  const isInfoVisible = canDisplay && (isInfoPanelVisible || isChatPanelVisible);

  if (!isSectionAvailable) return null;

  return (
    <Provider value={providerValue}>
      <SectionContainer
        viewAs={viewAs}
        ref={containerRef}
        isSectionHeaderAvailable={isSectionHeaderAvailable}
        isInfoPanelVisible={isInfoPanelVisible}
        withBodyScroll={withBodyScroll}
        currentDeviceType={currentDeviceType}
        bannerContent={sectionBannerContent}
        scrollableBanner={scrollableBanner}
        stickyTableHeader={stickyTableHeader}
        inert={inert}
      >
        {currentDeviceType !== DeviceType.mobile ? (
          <div className="section-sticky-container">
            {isSectionHeaderAvailable ? (
              <SubSectionHeader className="section-header_header">
                {sectionHeaderContent}
              </SubSectionHeader>
            ) : null}

            {isSectionSubmenuAvailable ? (
              <SubSectionSubmenu>{sectionSubmenuContent}</SubSectionSubmenu>
            ) : null}

            {isSectionFilterAvailable &&
            !stickyTableHeader &&
            currentDeviceType === DeviceType.desktop ? (
              <SubSectionFilter className="section-header_filter">
                {sectionFilterContent}
              </SubSectionFilter>
            ) : null}
          </div>
        ) : null}

        {isSectionBodyAvailable ? (
          <SubSectionBody
            onDrop={onDrop}
            onDragOverEmpty={onDragOverEmpty}
            onDragLeaveEmpty={onDragLeaveEmpty}
            uploadFiles={uploadFiles}
            withScroll={withBodyScroll}
            autoFocus={currentDeviceType === DeviceType.desktop}
            viewAs={viewAs}
            settingsStudio={settingsStudio}
            currentDeviceType={currentDeviceType}
            getContextModel={getContextModel}
            isIndexEditingMode={isIndexEditingMode}
            pathname={pathname}
            withoutFooter={withoutFooter}
            fullHeightBody={fullHeightBody}
          >
            {isSectionHeaderAvailable &&
            currentDeviceType === DeviceType.mobile ? (
              <SubSectionHeader className="section-body_header">
                {sectionHeaderContent}
              </SubSectionHeader>
            ) : null}
            {scrollableBanner && sectionBannerContent ? (
              <div className="section-banner">{sectionBannerContent}</div>
            ) : null}
            {isSectionFilterAvailable &&
            stickyTableHeader &&
            currentDeviceType === DeviceType.desktop ? (
              <SubSectionFilter className="section-body_sticky-filter">
                {sectionFilterContent}
              </SubSectionFilter>
            ) : null}
            {currentDeviceType !== DeviceType.desktop ? (
              <SubSectionWarning>{sectionWarningContent}</SubSectionWarning>
            ) : null}
            {isSectionSubmenuAvailable &&
            currentDeviceType === DeviceType.mobile ? (
              <SubSectionSubmenu>{sectionSubmenuContent}</SubSectionSubmenu>
            ) : null}
            {isSectionFilterAvailable &&
            currentDeviceType !== DeviceType.desktop ? (
              <SubSectionFilter
                withTabs={withTabs}
                className="section-body_filter"
              >
                {sectionFilterContent}
              </SubSectionFilter>
            ) : null}
            <SubSectionBodyContent>{sectionBodyContent}</SubSectionBodyContent>
            {withoutFooter ? null : (
              <SubSectionFooter>{sectionFooterContent}</SubSectionFooter>
            )}
          </SubSectionBody>
        ) : null}

        {isShowOperationButton ? (
          <OperationsProgressButton
            clearOperationsData={clearSecondaryProgressData}
            cancelSecondaryOperationById={cancelSecondaryOperationById}
            operations={[
              ...(secondaryActiveOperations || []),
              ...(pluginOperations || []),
            ]}
            operationsCompleted={isCompletedOperations}
            clearPanelOperationsData={clearPrimaryProgressData}
            clearDropPreviewLocation={clearDropPreviewLocation}
            operationsStopped={secondaryOperationsStopped}
            operationsAlert={
              primaryOperationsAlert ||
              secondaryOperationsAlert ||
              pluginOperationsAlert
            }
            operationsCanceled={primaryOperationsCanceled}
            needErrorChecking={needErrorChecking}
            panelOperations={primaryOperationsArray}
            cancelUpload={cancelUpload}
            onOpenPanel={onOpenUploadPanel}
            mainButtonVisible={mainButtonVisible}
            showCancelButton={showCancelButton}
            isInfoPanelVisible={isInfoVisible}
            dropTargetFolderName={dropTargetPreview}
            isDragging={dragging}
          />
        ) : null}
      </SectionContainer>

      {isInfoPanelAvailable ? (
        <InfoPanel
          isVisible={isInfoPanelVisible}
          setIsVisible={setIsInfoPanelVisible}
          isMobileHidden={isMobileHidden}
          canDisplay={canDisplay}
          anotherDialogOpen={anotherDialogOpen}
          viewAs={viewAs}
          currentDeviceType={currentDeviceType}
          asideInfoPanel={asideInfoPanel}
          withoutBodyScroll={infoPanelWithoutScroll}
        >
          <SubInfoPanelHeader>{infoPanelHeaderContent}</SubInfoPanelHeader>
          <SubInfoPanelBody
            isInfoPanelScrollLocked={isInfoPanelScrollLocked}
            withoutScroll={infoPanelWithoutScroll}
          >
            {infoPanelBodyContent}
          </SubInfoPanelBody>
        </InfoPanel>
      ) : null}

      {isChatPanelAvailable ? (
        <ChatPanelView
          isVisible={isChatPanelVisible}
          setIsVisible={setIsChatPanelVisible}
          currentDeviceType={currentDeviceType}
        >
          {chatPanelContent}
        </ChatPanelView>
      ) : null}
    </Provider>
  );
};

// Define the type for components with static properties
type SectionComponentType = FC<SectionProps> & {
  SectionHeader: typeof SectionHeader;
  SectionFilter: typeof SectionFilter;
  SectionBody: typeof SectionBody;
  SectionFooter: typeof SectionFooter;
  InfoPanelBody: typeof InfoPanelBody;
  InfoPanelHeader: typeof InfoPanelHeader;
  ChatPanel: typeof ChatPanel;
  SectionWarning: typeof SectionWarning;
  SectionSubmenu: typeof SectionSubmenu;
  SectionBanner: typeof SectionBanner;
};

// Create the memoized component with explicit type assertion
const MemoizedSection = memo(Section, equal) as unknown as SectionComponentType;

MemoizedSection.SectionHeader = SectionHeader;
MemoizedSection.SectionFilter = SectionFilter;
MemoizedSection.SectionBody = SectionBody;
MemoizedSection.SectionFooter = SectionFooter;
MemoizedSection.InfoPanelBody = InfoPanelBody;
MemoizedSection.InfoPanelHeader = InfoPanelHeader;
MemoizedSection.ChatPanel = ChatPanel;
MemoizedSection.SectionWarning = SectionWarning;
MemoizedSection.SectionSubmenu = SectionSubmenu;
MemoizedSection.SectionBanner = SectionBanner;

export default MemoizedSection;
