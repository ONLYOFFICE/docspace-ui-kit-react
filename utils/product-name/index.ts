import { getBrandName } from "../../constants/brands";

const PRODUCT_NAME_KEY = "ProductName";

/**
 * The product's name as the portal brands it. The library's own lookup is the
 * identity until an application registers one, so an unwired lookup -- which
 * answers with the key itself -- falls back to the product's current name.
 */
export const getProductName = (): string => {
  const name = getBrandName(PRODUCT_NAME_KEY).trim();
  return name && name !== PRODUCT_NAME_KEY ? name : "ONLYOFFICE Apps";
};
