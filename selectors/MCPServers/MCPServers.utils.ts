import { getBrandName } from "../../constants/brands";

/**
 * The label of the portal's own (system) MCP server: the product's name, as
 * the brand lookup gives it.
 *
 * The organisation is prefixed only when the product name does not already
 * carry it. A portal whose brands say "ONLYOFFICE" + "DocSpace" reads
 * "ONLYOFFICE DocSpace"; one whose product name is "ONLYOFFICE" or
 * "ONLYOFFICE Apps" reads just that, never "ONLYOFFICE ONLYOFFICE".
 */
export const systemServerLabel = (): string => {
  const organization = getBrandName("OrganizationName").trim();
  const product = getBrandName("ProductName").trim();

  if (!organization) return product;
  if (!product) return organization;

  // Whole words only, so "Acme" is found in "Acme Apps" but not in "Acmeware".
  const padded = (value: string) =>
    ` ${value.toLowerCase().split(/\s+/).join(" ")} `;
  if (padded(product).includes(padded(organization))) return product;

  return `${organization} ${product}`;
};
