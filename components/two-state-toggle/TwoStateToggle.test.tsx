import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TwoStateToggle } from ".";
import { getBrandName, setBrandLookup } from "../../constants/brands";

vi.mock("react-device-detect", () => ({
  isSafari: false,
  isTablet: false,
  isMobileOnly: false,
  isMobile: false,
}));

const LS_KEY = "useDocSpace";

describe("TwoStateToggle", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses the default aria-label", () => {
    render(<TwoStateToggle />);

    expect(
      screen.getByRole("switch", { name: "Switch ONLYOFFICE Apps design" }),
    ).toBeInTheDocument();
  });

  it("names the product through the brand lookup, not a literal", () => {
    const saved = (globalThis as Record<symbol, unknown>)[
      Symbol.for("@onlyoffice/apps-ui-kit#brandLookup")
    ];
    setBrandLookup((key) => (key === "ProductName" ? "Acme Apps" : key));
    try {
      render(<TwoStateToggle />);
      expect(
        screen.getByRole("switch", { name: "Switch Acme Apps design" }),
      ).toBeInTheDocument();
      expect(screen.getByText("Acme Apps design")).toBeInTheDocument();
    } finally {
      (globalThis as Record<symbol, unknown>)[
        Symbol.for("@onlyoffice/apps-ui-kit#brandLookup")
      ] = saved;
    }
    expect(getBrandName("ProductName")).not.toBe("Acme Apps");
  });

  it("falls back to ONLYOFFICE Apps when no brand lookup is registered", () => {
    const slot = Symbol.for("@onlyoffice/apps-ui-kit#brandLookup");
    const holder = globalThis as Record<symbol, unknown>;
    const saved = holder[slot];
    delete holder[slot];
    try {
      render(<TwoStateToggle />);
      expect(
        screen.getByRole("switch", { name: "Switch ONLYOFFICE Apps design" }),
      ).toBeInTheDocument();
    } finally {
      holder[slot] = saved;
    }
  });

  it("uses ariaLabel when given", () => {
    render(<TwoStateToggle ariaLabel="Changer de design" />);

    expect(
      screen.getByRole("switch", { name: "Changer de design" }),
    ).toBeInTheDocument();
  });

  it("starts in the new view when nothing is stored", () => {
    render(<TwoStateToggle />);

    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("starts in the old view when storage holds old", () => {
    localStorage.setItem(LS_KEY, "old");
    render(<TwoStateToggle />);

    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("navigates to /dashboard immediately when switching old to new", async () => {
    localStorage.setItem(LS_KEY, "old");
    const onNavigate = vi.fn();
    render(<TwoStateToggle onNavigate={onNavigate} />);

    await userEvent.click(screen.getByRole("switch"));

    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith("/dashboard");
    expect(localStorage.getItem(LS_KEY)).toBe("new");
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("asks for confirmation, then navigates to / when switching new to old", async () => {
    const onNavigate = vi.fn();
    render(<TwoStateToggle onNavigate={onNavigate} confirmOk="Proceed" />);

    await userEvent.click(screen.getByRole("switch"));

    expect(onNavigate).not.toHaveBeenCalled();
    expect(screen.getByText("Switch to Old Design")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Proceed" }));

    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith("/");
    expect(localStorage.getItem(LS_KEY)).toBe("old");
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("changes nothing when the confirmation is cancelled", async () => {
    const onNavigate = vi.fn();
    render(<TwoStateToggle onNavigate={onNavigate} confirmCancel="Stay" />);

    await userEvent.click(screen.getByRole("switch"));
    await userEvent.click(screen.getByRole("button", { name: "Stay" }));

    expect(onNavigate).not.toHaveBeenCalled();
    expect(localStorage.getItem(LS_KEY)).toBeNull();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("renders in the new view and still navigates when storage throws", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    const onNavigate = vi.fn();

    render(<TwoStateToggle onNavigate={onNavigate} confirmOk="Proceed" />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");

    await userEvent.click(toggle);
    await userEvent.click(screen.getByRole("button", { name: "Proceed" }));
    expect(onNavigate).toHaveBeenLastCalledWith("/");
    expect(toggle).toHaveAttribute("aria-checked", "false");

    await userEvent.click(toggle);
    expect(onNavigate).toHaveBeenLastCalledWith("/dashboard");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });
});
