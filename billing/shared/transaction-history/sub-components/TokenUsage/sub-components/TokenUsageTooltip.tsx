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

import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";

import { Tooltip } from "../../../../../../components/tooltip";
import type { TGetTooltipContent } from "../../../../../../components/tooltip";

import { TOKEN_USAGE_TOOLTIP_ID, parseTokenUsage } from "../../../utils";

import { TokenUsageContent } from "./TokenUsageContent";

const TOOLTIP_TEST_ID = "token_usage_tooltip";

export const TokenUsageTooltip = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pinned = useRef(false);

  useEffect(() => {
    if (isMobile) return;

    const close = () => {
      pinned.current = false;
      setIsOpen(false);
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;

      if (target?.closest(`[data-tooltip-id="${TOKEN_USAGE_TOOLTIP_ID}"]`)) {
        pinned.current = !pinned.current;
        setIsOpen(true);
        return;
      }

      if (target?.closest(`[data-testid="${TOOLTIP_TEST_ID}"]`)) return;

      close();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    // Capture phase: the history scrolls inside its own container.
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, []);

  const onOpenChange = (value: boolean) => {
    if (!value && pinned.current) return;

    setIsOpen(value);
  };

  const getContent = ({ content }: TGetTooltipContent) => {
    const usage = parseTokenUsage(content);

    return usage ? <TokenUsageContent usage={usage} /> : null;
  };

  return (
    <Tooltip
      id={TOKEN_USAGE_TOOLTIP_ID}
      place="bottom"
      maxWidth="320px"
      clickable
      openOnClick={isMobile}
      isOpen={isMobile ? undefined : isOpen}
      setIsOpen={isMobile ? undefined : onOpenChange}
      getContent={getContent}
      dataTestId={TOOLTIP_TEST_ID}
    />
  );
};
