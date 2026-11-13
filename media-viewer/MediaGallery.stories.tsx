import { useEffect } from "react";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useTranslation } from "react-i18next";
import { expect, screen, waitFor } from "storybook/test";

import { withPortalGate } from "../.storybook/decorators/PortalGate";
import { useWindowDevice } from "../.storybook/utils/useWindowDevice";

import MediaGallery from "./MediaGallery";
import type { MediaGalleryProps } from "./MediaGallery.types";

type StoryArgs = Pick<
  MediaGalleryProps,
  "folderId" | "requestToken" | "startFileId" | "pageSize" | "autoPlay"
>;

// The viewer shows a file icon only for audio and in the mobile header, and
// the demo folder holds pictures and a video: no icon set is wired up here.
const getIcon = () => "";

const EXTS_IMAGE_PREVIEWED = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"];

const Gallery = (args: StoryArgs) => {
  const { t } = useTranslation("Common");
  const currentDeviceType = useWindowDevice();

  return (
    <MediaGallery
      {...args}
      t={t}
      getIcon={getIcon}
      extsImagePreviewed={EXTS_IMAGE_PREVIEWED}
      currentDeviceType={currentDeviceType}
      emptyContent={
        <p style={{ padding: 24 }}>This folder has no media files.</p>
      }
      onDownload={() => {}}
    />
  );
};

// The wheel zooms the picture. On the Docs page the story sits in a frame
// that cannot scroll, so the same wheel would also scroll the page around it.
const withoutPageScroll: Decorator = (Story) => {
  useEffect(() => {
    const stop = (event: WheelEvent) => event.preventDefault();

    document.addEventListener("wheel", stop, { passive: false });
    return () => document.removeEventListener("wheel", stop);
  }, []);

  return <Story />;
};

const meta: Meta<StoryArgs> = {
  title: "Components/Media Gallery",
  render: (args) => <Gallery {...args} />,
  decorators: [withoutPageScroll, withPortalGate("Media gallery")],
  argTypes: {
    folderId: {
      control: "text",
      description:
        "The folder or room whose media files are shown. 203 is the demo portal's folder with three pictures and a video; with a portal connected, type an id of its own.",
    },
    requestToken: {
      control: "text",
      description: "The key of a public room link, for an anonymous visitor.",
    },
    startFileId: {
      control: "text",
      description: "The file to open first.",
    },
    pageSize: {
      control: "number",
      description: "How many files one request asks for.",
      table: { defaultValue: { summary: "100" } },
    },
    autoPlay: {
      control: "boolean",
      description: "Starts video and audio as soon as they open.",
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The media files of one portal folder or room in the viewer, with previous / next navigation. Reads the folder itself through the nearest ApiProvider. The title, the arrows and the toolbar show while the pointer moves and hide after a pause, as in the portal.",
      },
      story: { inline: false, height: "560px" },
    },
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

const opens = (title: string) =>
  waitFor(
    () =>
      expect(screen.getByTestId("media-viewer")).toHaveAccessibleName(
        new RegExp(title),
      ),
    { timeout: 5000 },
  );

export const Default: Story = {
  args: { folderId: 203 },
  parameters: {
    docs: {
      description: {
        story:
          "A folder with three pictures and a video. The first picture opens; the arrows at the edges, the arrow keys and a swipe move to the next file.",
      },
    },
  },
  play: async () => {
    await opens("Banner mockup.png");
    await expect(screen.getByTestId("next-button")).toBeInTheDocument();
  },
};

export const StartsWithVideo: Story = {
  args: { folderId: 203, startFileId: 1205 },
  parameters: {
    docs: {
      description: {
        story:
          "`startFileId` names the file to open first: here the video, the last file of the same folder, with the player controls in place of the picture toolbar.",
      },
    },
  },
  play: async () => {
    await opens("Teaser video.webm");
    await waitFor(() => expect(document.querySelector("video")).not.toBeNull());
  },
};

export const FolderWithoutMedia: Story = {
  args: { folderId: 101 },
  parameters: {
    docs: {
      description: {
        story:
          "A folder that holds only documents. The viewer does not open; the gallery renders `emptyContent`, which the application supplies.",
      },
    },
  },
  play: async () => {
    await waitFor(
      () =>
        expect(
          screen.getByText("This folder has no media files."),
        ).toBeVisible(),
      { timeout: 5000 },
    );
  },
};
