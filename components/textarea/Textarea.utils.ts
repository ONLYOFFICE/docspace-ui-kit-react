import jsonBeautifier from "csvjson-json_beautifier";

export function isJSON(value: string): boolean {
  if (typeof value !== "string") return false;
  try {
    const result = JSON.parse(value);
    return typeof result === "object" && result !== null;
  } catch {
    return false;
  }
}

export function beautifyJSON(jsonString: string) {
  return jsonBeautifier(JSON.parse(jsonString), {
    inlineShortArrays: true,
  });
}

export function jsonify(value: string, isJSONField?: boolean) {
  if (isJSONField && value && isJSON(value)) {
    return beautifyJSON(value);
  }
  return value;
}
