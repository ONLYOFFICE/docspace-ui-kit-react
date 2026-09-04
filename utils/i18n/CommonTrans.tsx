import { type ReactNode, type ReactElement, cloneElement, Fragment, createElement } from "react";
import { getCommonTranslation } from "./i18n-utils";

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
        // No component for this tag — still interpolate {{values}} and
        // nested tags inside its content instead of emitting it verbatim.
        result.push(...renderCommonTrans(content, values, components));
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
