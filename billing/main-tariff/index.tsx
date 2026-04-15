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

import { observer } from "mobx-react";
import { useCommonTranslation } from "../../utils/i18n";

import PaymentsLoader from "../loader";

import { usePaymentStore } from "../store/PaymentStoreProvider";

import PaymentContainer from "./PaymentContainer";
import StorageTariffDeactivated from "../dialogs/StorageTariffDeactivated";

type SaaSPageProps = {
  language?: string;
  user?: object;
  isUpdatingTariff?: boolean;
  showPortalSettingsLoader?: boolean;
  onSetDocumentTitle?: (title: string) => void;
};

const SaaSPage = observer(
  ({
    isUpdatingTariff = false,
    showPortalSettingsLoader = false,
    onSetDocumentTitle,
  }: SaaSPageProps) => {
    const paymentStore = usePaymentStore();
    const {
      isInitPaymentPage,
      resetTariffContainerToBasic,
      isShowStorageTariffDeactivatedModal,
      init,
    } = paymentStore;

    const t = useCommonTranslation();
    const shouldShowLoader =
      !isInitPaymentPage || isUpdatingTariff || showPortalSettingsLoader;

    const isQuotasLoaded = paymentStore.quotas.isLoaded;

    useEffect(() => {
      if (!isQuotasLoaded) return;

      init(t);
      return () => resetTariffContainerToBasic();
    }, [isQuotasLoaded]);

    useEffect(() => {
      const title = t("Billing");
      if (onSetDocumentTitle) {
        onSetDocumentTitle(title);
      } else {
        document.title = title;
      }
    }, []);

    return shouldShowLoader ? (
      <PaymentsLoader />
    ) : (
      <div data-testid="saas-page">
        <PaymentContainer t={t} />
        {isShowStorageTariffDeactivatedModal ? (
          <StorageTariffDeactivated
            visible={isShowStorageTariffDeactivatedModal}
          />
        ) : null}
      </div>
    );
  },
);

export default SaaSPage;

