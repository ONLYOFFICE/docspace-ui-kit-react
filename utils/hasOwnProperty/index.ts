export const hasOwnProperty = (obj: unknown, propertyName: string): boolean => {
  if (!obj) return false;

  try {
    return Object.hasOwn(obj as object, propertyName);
  } catch {
    return false;
  }
};
