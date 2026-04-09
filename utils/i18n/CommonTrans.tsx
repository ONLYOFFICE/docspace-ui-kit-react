/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
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
