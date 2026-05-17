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

import { type ReactNode, type ReactElement, cloneElement, Fragment, createElement } from "react";
import { getCommonTranslation } from ".";

export type CommonTransComponent =
  ReactElement<{ children?: ReactNode }>;

function renderCommonTrans(
  template: string,
  values: Record<string, ReactNode>,
  components: Record<number, CommonTransComponent>,
): ReactNode[] {
  const REGEX = /<(\d+)>(.*?)<\/\1>|<([a-zA-Z]+)>(.*?)<\/\3>|{{(.*?)}}/gs;
  const result: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = REGEX.exec(template))) {
    if (match.index > lastIndex) {
      result.push(template.slice(lastIndex, match.index));
    }

    // <1>...</1> (numbered tags)
    if (match[1]) {
      const index = Number(match[1]);
      const content = match[2];
      const component = components[index];

      if (!component) {
        result.push(content);
      } else {
        result.push(
          cloneElement(component, {
            key: result.length,
            children: renderCommonTrans(content, values, components),
          }),
        );
      }
    }
    // <strong>...</strong> (HTML tags) - render as React elements
    else if (match[3]) {
      const tagName = match[3];
      const content = match[4];
      const children = renderCommonTrans(content, values, components);
      
      result.push(
        createElement(
          tagName,
          { key: result.length },
          ...children,
        ),
      );
    }

    // {{value}}
    if (match[5]) {
      result.push(values[match[5]] ?? `{{${match[5]}}}`);
    }

    lastIndex = REGEX.lastIndex;
  }

  if (lastIndex < template.length) {
    result.push(template.slice(lastIndex));
  }

  return result;
}

type CommonTransProps = {
  i18nKey: string;
  values?: Record<string, ReactNode>;
  components?: Record<number, CommonTransComponent>;
  namespaces?: string[];
};

export function CommonTrans({
  i18nKey,
  values = {},
  components = {},
  namespaces,
}: CommonTransProps) {
  const template = getCommonTranslation(i18nKey, undefined, namespaces);

  return <Fragment>{renderCommonTrans(template, values, components)}</Fragment>;
}
