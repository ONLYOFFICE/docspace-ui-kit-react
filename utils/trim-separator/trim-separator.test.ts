import { describe, it, expect } from "vitest";
import { trimSeparator } from ".";
import type { ContextMenuModel } from "../../components/context-menu";

const createItem = (key: string, disabled = false): ContextMenuModel => ({
  key,
  label: key,
  disabled,
});

const createSeparator = (): ContextMenuModel => ({
  key: "separator",
  isSeparator: true,
});

describe("trimSeparator", () => {
  describe("edge cases", () => {
    it("returns undefined for undefined input", () => {
      expect(
        trimSeparator(undefined as unknown as ContextMenuModel[]),
      ).toBeUndefined();
    });

    it("returns null for null input", () => {
      expect(trimSeparator(null as unknown as ContextMenuModel[])).toBeNull();
    });

    it("returns empty array for empty array input", () => {
      expect(trimSeparator([])).toEqual([]);
    });

    it("returns input for non-array input", () => {
      expect(
        trimSeparator("not an array" as unknown as ContextMenuModel[]),
      ).toBe("not an array");
    });
  });

  describe("separator removal", () => {
    it("removes leading separators", () => {
      const input = [createSeparator(), createItem("edit"), createItem("copy")];
      const result = trimSeparator(input);
      expect(result[0]?.isSeparator).toBeFalsy();
      expect(result).toHaveLength(2);
    });

    it("removes trailing separators", () => {
      const input = [createItem("edit"), createItem("copy"), createSeparator()];
      const result = trimSeparator(input);
      expect(result[result.length - 1]?.isSeparator).toBeFalsy();
    });

    it("removes consecutive separators", () => {
      const input = [
        createItem("edit"),
        createSeparator(),
        createSeparator(),
        createSeparator(),
        createItem("copy"),
      ];
      const result = trimSeparator(input);
      // With fewer than 6 non-separator items and no destructive action, all separators are removed
      const separatorCount = result.filter((item) => item?.isSeparator).length;
      expect(separatorCount).toBe(0);
    });

    it("removes separator between items when fewer than 6 items and no destructive action", () => {
      const input = [createItem("edit"), createSeparator(), createItem("copy")];
      const result = trimSeparator(input);
      // With fewer than 6 non-separator items and no destructive action, separator is removed
      expect(result).toHaveLength(2);
      expect(result.find((item) => item?.isSeparator)).toBeUndefined();
    });
  });

  describe("disabled items", () => {
    it("removes disabled items", () => {
      const input = [
        createItem("edit"),
        createItem("disabled-item", true),
        createItem("copy"),
      ];
      const result = trimSeparator(input);
      expect(result).toHaveLength(2);
      expect(
        result.find((item) => item.key === "disabled-item"),
      ).toBeUndefined();
    });

    it("removes separators when they become adjacent after disabled item removal", () => {
      const input = [
        createItem("edit"),
        createSeparator(),
        createItem("disabled", true),
        createSeparator(),
        createItem("copy"),
      ];
      const result = trimSeparator(input);
      const separatorCount = result.filter((item) => item?.isSeparator).length;
      expect(separatorCount).toBeLessThanOrEqual(1);
    });
  });

  describe("destructive actions (fewer than 6 items)", () => {
    it("keeps separator before delete action", () => {
      const input = [
        createItem("edit"),
        createItem("copy"),
        createSeparator(),
        createItem("delete"),
      ];
      const result = trimSeparator(input);
      expect(result).toHaveLength(4);
      expect(result[2]?.isSeparator).toBe(true);
    });

    it("keeps separator before unsubscribe action", () => {
      const input = [
        createItem("view"),
        createSeparator(),
        createItem("unsubscribe"),
      ];
      const result = trimSeparator(input);
      expect(result).toHaveLength(3);
      expect(result[1]?.isSeparator).toBe(true);
    });

    it("keeps separator before remove-from-recent action", () => {
      const input = [
        createItem("open"),
        createSeparator(),
        createItem("remove-from-recent"),
      ];
      const result = trimSeparator(input);
      expect(result[1]?.isSeparator).toBe(true);
    });

    it("removes non-destructive separators when fewer than 6 items", () => {
      const input = [
        createItem("edit"),
        createSeparator(),
        createItem("copy"),
        createSeparator(),
        createItem("paste"),
      ];
      const result = trimSeparator(input);
      const separatorCount = result.filter((item) => item?.isSeparator).length;
      expect(separatorCount).toBe(0);
    });
  });

  describe("many items (6 or more)", () => {
    it("preserves separators when 6 or more non-separator items", () => {
      const input = [
        createItem("item1"),
        createItem("item2"),
        createSeparator(),
        createItem("item3"),
        createItem("item4"),
        createSeparator(),
        createItem("item5"),
        createItem("item6"),
      ];
      const result = trimSeparator(input);
      const separatorCount = result.filter((item) => item?.isSeparator).length;
      expect(separatorCount).toBe(2);
    });

    it("still removes trailing separator with many items", () => {
      const input = [
        createItem("item1"),
        createItem("item2"),
        createItem("item3"),
        createItem("item4"),
        createItem("item5"),
        createItem("item6"),
        createSeparator(),
      ];
      const result = trimSeparator(input);
      expect(result[result.length - 1]?.isSeparator).toBeFalsy();
    });
  });

  describe("complex scenarios", () => {
    it("handles mix of separators, disabled items, and destructive actions", () => {
      const input = [
        createItem("edit"),
        createItem("disabled1", true),
        createSeparator(),
        createItem("copy"),
        createSeparator(),
        createItem("delete"),
      ];
      const result = trimSeparator(input);

      // Should have: edit, separator, copy, separator, delete (if destructive separator kept)
      expect(result.find((item) => item.key === "disabled1")).toBeUndefined();
      expect(result.find((item) => item.key === "delete")).toBeDefined();
    });

    it("handles only separators input", () => {
      const input = [createSeparator(), createSeparator(), createSeparator()];
      const result = trimSeparator(input);
      expect(result).toHaveLength(0);
    });

    it("handles single item", () => {
      const input = [createItem("edit")];
      const result = trimSeparator(input);
      expect(result).toHaveLength(1);
      expect(result[0]?.key).toBe("edit");
    });

    it("handles single separator", () => {
      const input = [createSeparator()];
      const result = trimSeparator(input);
      expect(result).toHaveLength(0);
    });
  });
});
