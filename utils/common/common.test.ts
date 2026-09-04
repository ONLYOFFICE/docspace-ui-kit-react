import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getUserTypeTranslation,
  RoomsTypeValues,
  RoomsTypes,
  isManagement,
} from ".";
import { EmployeeType, RoomsType } from "../../enums";
import * as i18n from "../i18n";

vi.mock("../i18n", () => ({
  getCommonTranslation: vi.fn((key: string) => {
    const mocks: Record<string, string> = {
      Owner: "Owner",
      PortalAdmin: "Admin of {{productName}}",
      ProductName: "DocSpace",
      RoomAdmin: "Room Admin",
      User: "User",
      Guest: "Guest",
    };
    return mocks[key] || key;
  }),
}));

describe("Common Utilities", () => {
  describe("getUserTypeTranslation", () => {
    it("translates Owner", () => {
      expect(getUserTypeTranslation(EmployeeType.Owner)).toBe("Owner");
    });

    it("translates Admin with product name", () => {
      expect(getUserTypeTranslation(EmployeeType.Admin)).toBe(
        "Admin of DocSpace",
      );
    });

    it("translates RoomAdmin", () => {
      expect(getUserTypeTranslation(EmployeeType.RoomAdmin)).toBe("Room Admin");
    });

    it("translates User", () => {
      expect(getUserTypeTranslation(EmployeeType.User)).toBe("User");
    });

    it("translates Guest/Default", () => {
      expect(getUserTypeTranslation(EmployeeType.Guest)).toBe("Guest");
      // @ts-ignore
      expect(getUserTypeTranslation("unknown")).toBe("Guest");
    });

    it("uses custom translation function if provided", () => {
      const customT = vi.fn().mockReturnValue("custom");
      expect(getUserTypeTranslation(EmployeeType.Owner, customT)).toBe(
        "custom",
      );
      expect(customT).toHaveBeenCalledWith("Common:Owner");
    });

    it("falls back to key if translation is missing in default translation", () => {
      const spy = vi
        .spyOn(i18n, "getCommonTranslation")
        .mockReturnValueOnce("");
      // When translation is empty string (falsy), it should return the full key string
      expect(getUserTypeTranslation(EmployeeType.Owner)).toBe("Common:Owner");
      spy.mockRestore();
    });

    it("handles parameters in translation", () => {
      const spy = vi.spyOn(i18n, "getCommonTranslation");
      spy.mockImplementation((key) => {
        if (key === "PortalAdmin") return "Administrator of {{productName}}";
        return key;
      });

      // productName comes from getBrandName("ProductName") which returns "DocSpace"
      expect(getUserTypeTranslation(EmployeeType.Admin)).toBe(
        "Administrator of DocSpace",
      );
      spy.mockRestore();
    });
  });

  describe("RoomsType Constants", () => {
    it("RoomsTypeValues filters out AIRoom and non-numbers", () => {
      expect(RoomsTypeValues).toContain(RoomsType.PublicRoom);
      expect(RoomsTypeValues).toContain(RoomsType.FormRoom);
      expect(RoomsTypeValues).not.toContain(RoomsType.AIRoom);
      // Ensure it only contains numbers from the enum
      RoomsTypeValues.forEach((val) => {
        expect(typeof val).toBe("number");
      });
    });

    it("RoomsTypes is a correct mapping object", () => {
      expect(RoomsTypes[RoomsType.PublicRoom]).toBe(RoomsType.PublicRoom);
      expect(RoomsTypes[RoomsType.FormRoom]).toBe(RoomsType.FormRoom);
      expect(RoomsTypes[RoomsType.AIRoom]).toBeUndefined();
    });
  });

  describe("isManagement", () => {
    const originalLocation = window.location;

    beforeEach(() => {
      vi.stubGlobal("location", {
        ...originalLocation,
        pathname: "",
      });
    });

    it("returns true when pathname contains management", () => {
      vi.stubGlobal("location", { pathname: "/management/users" });
      expect(isManagement()).toBe(true);
    });

    it("returns false when pathname does not contain management", () => {
      vi.stubGlobal("location", { pathname: "/rooms/1" });
      expect(isManagement()).toBe(false);
    });
  });
});
