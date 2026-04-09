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

// Done in a similar way to server code
// https://github.com/ONLYOFFICE/DocSpace-server/blob/master/common/ASC.Common/Utils/CommonFileSizeComment.cs
export const getPowerFromBytes = (bytes: number, maxPower = 6) => {
  const power = Math.floor(Math.log(bytes) / Math.log(1024));
  return power <= maxPower ? power : maxPower;
};

export const getSizeFromBytes = (bytes: number, power: number) => {
  const size = bytes / 1024 ** power;
  const truncateToTwo = Math.trunc(size * 100) / 100;

  return truncateToTwo;
};

export const getConvertedSize = (
  t: (key: string) => string,
  bytes: number,
  withoutSizeName: boolean = false,
) => {
  let power = 0;
  let resultSize = bytes;

  const sizeNames = [
    t("Common:Bytes"),
    t("Common:Kilobyte"),
    t("Common:Megabyte"),
    t("Common:Gigabyte"),
    t("Common:Terabyte"),
    t("Common:Petabyte"),
    t("Common:Exabyte"),
  ];

  if (bytes <= 0) return `${`0 ${t("Common:Bytes")}`}`;

  if (bytes >= 1024) {
    power = getPowerFromBytes(bytes, sizeNames.length - 1);
    resultSize = getSizeFromBytes(bytes, power);
  }

  if (withoutSizeName) return `${resultSize}`;

  return `${resultSize} ${sizeNames[power]}`;
};

export const calculateTotalPrice = (
  quantity: number,
  unitPrice: number,
): number => {
  return Number((quantity * unitPrice).toFixed(2));
};

export const truncateNumberToFraction = (
  value: number,
  digits: number = 2,
): string => {
  const [intPart, fracPart = ""] = value.toString().split(".");
  const truncated = fracPart.slice(0, digits).padEnd(digits, "0");
  return `${intPart}.${truncated}`;
};

export const formatCurrencyValue = (
  language: string,
  amount: number,
  currency: string,
  fractionDigits: number = 3,
) => {
  const truncatedStr = truncateNumberToFraction(amount, fractionDigits);
  const truncated = Number(truncatedStr);

  const formatter = new Intl.NumberFormat(language, {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  return formatter.format(truncated);
};
