import { DEFAULT_FONT_FAMILY, SYSTEM_FONT_FAMILY } from "../themes/constants";

export const RTL_LANGUAGES = Object.freeze([
  "ar",
  "arc",
  "dv",
  "fa",
  "ha",
  "he",
  "khw",
  "ks",
  "ku",
  "ps",
  "ur",
  "yi",
]);

export const isLanguageRtl = (lng: string) => {
  if (!lng) return;

  const splittedLng = lng.split("-");
  return RTL_LANGUAGES.includes(splittedLng[0]);
};

export const getDirectionByLanguage = (lng: string) => {
  return isLanguageRtl(lng) ? "rtl" : "ltr";
};

/* Returns correct text-align value depending on interface direction (ltr/rtl) */
export const getCorrectTextAlign = (
  currentTextAlign: string,
  interfaceDirection: "ltr" | "rtl" | string,
) => {
  if (!currentTextAlign) return interfaceDirection === "rtl" ? "right" : "left";

  if (interfaceDirection === "ltr") return currentTextAlign;

  switch (currentTextAlign) {
    case "left":
      return "right";
    case "right":
      return "left";
    default:
      return currentTextAlign;
  }
};

/* Returns correct four values style (margin/padding etc) depending on interface direction (ltr/rtl)
 * Not suitable for border-radius! */
export const getCorrectFourValuesStyle = (
  styleStr: string,
  interfaceDirection: "ltr" | "rtl" | string,
) => {
  if (interfaceDirection === "ltr") return styleStr;

  const styleArr = styleStr.split(" ");
  if (styleArr.length !== 4) return styleStr;

  const styleRightValue = styleArr[1];
  const styleLeftValue = styleArr[3];

  styleArr[1] = styleLeftValue;
  styleArr[3] = styleRightValue;

  return styleArr.join(" ");
};

/* Returns correct border-radius value depending on interface direction (ltr/rtl) */
export const getCorrectBorderRadius = (
  borderRadiusStr: string,
  interfaceDirection: "ltr" | "rtl" | string,
) => {
  if (interfaceDirection === "ltr") return borderRadiusStr;

  const borderRadiusArr = borderRadiusStr.split(" ");

  switch (borderRadiusArr.length) {
    // [10px] => "10px"
    case 1: {
      return borderRadiusStr;
    }
    // [10px 20px] => [20px 10px]
    case 2: {
      borderRadiusArr.splice(0, 0, borderRadiusArr.splice(1, 1)[0]);
      break;
    }
    // [10px 20px 30px] => [20px 10px 20px 30px]
    case 3: {
      borderRadiusArr.splice(0, 0, borderRadiusArr[1]);
      break;
    }
    // [10px 20px 30px 40px] => [20px 10px 40px 30px]
    case 4: {
      borderRadiusArr.splice(0, 0, borderRadiusArr.splice(1, 1)[0]);
      borderRadiusArr.splice(2, 0, borderRadiusArr.splice(3, 1)[0]);
      break;
    }
    default:
  }

  return borderRadiusArr.join(" ");
};

/* Returns system font family for arabic lang */
export const getFontFamilyDependingOnLanguage = (lng: string) => {
  const arabicLocale = "ar-SA";
  const shouldUseSystemFont = lng?.toLowerCase() === arabicLocale.toLowerCase();

  return shouldUseSystemFont ? SYSTEM_FONT_FAMILY : DEFAULT_FONT_FAMILY;
};
