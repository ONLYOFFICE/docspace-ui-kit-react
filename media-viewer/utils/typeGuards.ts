import type {
  ContextMenuModel,
  SeparatorType,
} from "../../components/context-menu";

export const includesMethod = <T extends object, MethodName extends string>(
  obj: T,
  method: MethodName,
): obj is T & Record<MethodName, (...args: unknown[]) => unknown> => {
  return method in obj && typeof obj[method as keyof object] === "function";
};

export const isSeparator = (arg: ContextMenuModel): arg is SeparatorType => {
  return arg?.isSeparator !== undefined && arg.isSeparator;
};

export const isNullOrUndefined = (arg: unknown): arg is null | undefined => {
  return arg === undefined || arg === null;
};
