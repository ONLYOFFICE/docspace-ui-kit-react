const PROMO_RETURN_PARAM = "topup";
const PROMO_RETURN_VALUE = "promo";

const currentPage = () =>
  `${window.location.origin}${window.location.pathname}`;

export const getPromoCodeReturnUrls = () => ({
  backUrl: `${currentPage()}?open=true&${PROMO_RETURN_PARAM}=${PROMO_RETURN_VALUE}`,
  successUrl: `${currentPage()}?complete=true&type=wallet&${PROMO_RETURN_PARAM}=${PROMO_RETURN_VALUE}`,
});

export const isPromoCodeReturn = () =>
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get(PROMO_RETURN_PARAM) ===
    PROMO_RETURN_VALUE;

export const clearPromoCodeReturn = () => {
  if (!isPromoCodeReturn()) return;

  window.history.replaceState({}, document.title, window.location.pathname);
};
