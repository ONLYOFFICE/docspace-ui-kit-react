import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, render } from "@testing-library/react";
import { RoomIcon } from ".";
import type { TModel } from "./RoomIcon.types";
import styles from "./RoomIcon.module.scss";

const mockImgSrc = "test-image.jpg";
const mockTitle = "Test Room";
const mockSize = "96px";
const mockColor = "FFFFFF";

const baseProps = {
  title: mockTitle,
  size: mockSize,
  color: mockColor,
  imgSrc: mockImgSrc,
  showDefault: true,
};

const mockModel: TModel[] = [
  {
    label: "Upload",
    icon: "upload.svg",
    key: "upload",
    onClick: vi.fn(),
  },
  {
    label: "Remove",
    icon: "remove.svg",
    key: "remove",
    onClick: vi.fn(),
  },
];

describe("<RoomIcon />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error", () => {
    render(<RoomIcon {...baseProps} />);
    expect(screen.getByTestId("room-icon")).toBeInTheDocument();
  });

  it("renders title when showDefault is true", () => {
    render(<RoomIcon {...baseProps} />);
    const title = screen.getByTestId("room-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("TR");
  });

  it("draws the initials, not an empty image, when there is no logo", () => {
    render(<RoomIcon title="Harper v. Northwind" color="3B72A7" />);
    expect(screen.getByTestId("room-title")).toHaveTextContent("HN");
    expect(screen.queryByTestId("room-icon-image")).toBeNull();
    expect(screen.queryByTestId("room-icon-cover")).toBeNull();
  });

  it("renders empty icon state correctly", () => {
    render(<RoomIcon {...baseProps} isEmptyIcon />);
    const emptyIcon = screen.getByTestId("empty-icon");
    expect(emptyIcon).toBeInTheDocument();
    expect(screen.getByTestId("icon-button")).toBeInTheDocument();
  });

  it("renders edit mode correctly", () => {
    render(<RoomIcon {...baseProps} withEditing model={mockModel} />);
    const editButton = screen.getByTestId("icon-button");
    expect(editButton).toBeInTheDocument();
    expect(screen.getByTestId("room-icon")).toHaveAttribute(
      "data-has-editing",
      "true",
    );
  });

  it("opens dropdown on edit icon click", () => {
    render(<RoomIcon {...baseProps} withEditing model={mockModel} />);
    const editButton = screen.getByTestId("icon-button");
    fireEvent.click(editButton);
    expect(screen.getByText(mockModel[0].label)).toBeInTheDocument();
  });

  it("handles file input change", () => {
    const onChangeFile = vi.fn();
    render(
      <RoomIcon
        {...baseProps}
        withEditing
        model={mockModel}
        onChangeFile={onChangeFile}
      />,
    );
    const input = screen.getByTestId("customFileInput");
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onChangeFile).toHaveBeenCalled();
  });

  it("renders badge correctly", () => {
    const badgeUrl = "badge.svg";
    const onBadgeClick = vi.fn();
    render(
      <RoomIcon
        {...baseProps}
        badgeUrl={badgeUrl}
        onBadgeClick={onBadgeClick}
      />,
    );
    const badge = screen.getByTestId("icon-button");
    expect(badge).toBeInTheDocument();
    fireEvent.click(badge);
    expect(onBadgeClick).toHaveBeenCalled();
  });

  it("handles hover state correctly", () => {
    const hoverSrc = "hover-image.jpg";
    render(<RoomIcon {...baseProps} hoverSrc={hoverSrc} />);
    const hoverImg = screen.getByTestId("hover-image");
    expect(hoverImg).toHaveAttribute("src", hoverSrc);
  });

  it("handles archive state correctly", () => {
    render(<RoomIcon {...baseProps} isArchive />);
    expect(screen.getByTestId("room-icon")).toHaveAttribute(
      "data-is-archive",
      "true",
    );
  });

  it("adds tooltip attributes to badge when tooltipContent is provided", () => {
    const tooltipId = "room-tooltip";
    render(
      <RoomIcon
        {...baseProps}
        badgeUrl="badge.svg"
        tooltipContent="Tooltip content"
        tooltipId={tooltipId}
      />,
    );

    const badgeButton = screen.getByTestId("icon-button");
    expect(badgeButton).toHaveAttribute("data-tooltip-id", tooltipId);
  });

  it("adds isHovered class when tooltipContent is provided", () => {
    render(
      <RoomIcon
        {...baseProps}
        badgeUrl="badge.svg"
        tooltipContent="Tooltip content"
        tooltipId="room-tooltip"
      />,
    );
    const badgeButton = screen.getByTestId("icon-button");
    expect(badgeButton).toHaveClass(styles.isHovered);
  });

  it("does not add tooltip attributes when tooltipContent is not provided", () => {
    render(<RoomIcon {...baseProps} badgeUrl="badge.svg" />);
    const badgeButton = screen.getByTestId("icon-button");
    expect(badgeButton).not.toHaveAttribute("data-tooltip-id");
    const buttonWithClass = screen.getByTestId("icon-button");
    expect(buttonWithClass).not.toHaveClass(styles.isHovered);
  });

  it("handles template icon state", () => {
    render(<RoomIcon {...baseProps} isTemplate />);
    const roomIcon = screen.getByTestId("room-icon");
    expect(roomIcon).toHaveAttribute("data-is-template", "true");
  });

  describe("logo menu", () => {
    const isOpen = () =>
      /open/.test(screen.getByTestId("dropdown").className ?? "");

    it("opens on the pencil and closes on a second click", () => {
      render(<RoomIcon {...baseProps} withEditing model={mockModel} />);
      const pencil = screen.getByTestId("icon-button");

      fireEvent.click(pencil);
      expect(isOpen()).toBe(true);

      fireEvent.click(pencil);
      expect(isOpen()).toBe(false);
    });

    it("closes when an entry is picked, without reopening", () => {
      render(<RoomIcon {...baseProps} withEditing model={mockModel} />);
      fireEvent.click(screen.getByTestId("room-icon"));
      expect(isOpen()).toBe(true);

      fireEvent.click(screen.getByText("Remove"));
      expect(mockModel[1].onClick).toHaveBeenCalledTimes(1);
      expect(isOpen()).toBe(false);
    });

    it("does not open without entries", () => {
      render(<RoomIcon {...baseProps} withEditing model={[]} />);
      fireEvent.click(screen.getByTestId("room-icon"));
      expect(isOpen()).toBe(false);
    });
  });

  it("gives every file input an id of its own", () => {
    render(
      <>
        <RoomIcon {...baseProps} withEditing onChangeFile={vi.fn()} />
        <RoomIcon {...baseProps} withEditing onChangeFile={vi.fn()} />
      </>,
    );
    const [first, second] = screen.getAllByTestId("customFileInput");
    expect(first.id).not.toBe("customFileInput");
    expect(first.id).not.toBe(second.id);
  });

  it("marks a colourless logo that failed to load as a wrong image", async () => {
    const OriginalImage = window.Image;
    class FailingImage {
      onerror: (() => void) | null = null;
      set src(_value: string) {
        setTimeout(() => this.onerror?.(), 0);
      }
    }
    window.Image = FailingImage as unknown as typeof Image;

    try {
      render(
        <RoomIcon
          title="Broken"
          color="4781D1"
          logo={{ medium: "broken.png" } as never}
        />,
      );
      await vi.waitFor(() =>
        expect(screen.getByTestId("room-icon")).toHaveAttribute(
          "data-is-wrong-image",
          "true",
        ),
      );
      expect(screen.getByTestId("room-title")).toHaveTextContent("B");
    } finally {
      window.Image = OriginalImage;
    }
  });
});
