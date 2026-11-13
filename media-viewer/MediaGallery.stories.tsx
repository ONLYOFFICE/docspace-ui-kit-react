import type { Meta, StoryObj } from "@storybook/react-vite";
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
// the demo folders hold pictures: no icon set is wired up here.
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
      emptyContent={<p style={{ padding: 24 }}>No media files here yet</p>}
      onDownload={() => {}}
    />
  );
};

const meta: Meta<StoryArgs> = {
  title: "Components/MediaGallery",
  render: (args) => <Gallery {...args} />,
  decorators: [withPortalGate("Media gallery")],
  argTypes: {
    folderId: {
      control: "text",
      description:
        "The folder or room whose media files are shown. 203 and 101 are folders of the demo portal; with a portal connected, type an id of its own.",
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
          "The media files of one portal folder or room in the viewer, with previous / next navigation. Reads the folder itself through the nearest ApiProvider.",
      },
      story: { inline: false, height: "480px" },
    },
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

const picture = (title: string) =>
  waitFor(() => expect(screen.getAllByText(title).length).toBeGreaterThan(0), {
    timeout: 5000,
  });

export const Default: Story = {
  args: { folderId: 203 },
  play: async () => {
    await picture("Banner mockup.png");
  },
};

export const StartFile: Story = {
  args: { folderId: 203, startFileId: 1207 },
  play: async () => {
    await picture("Social card.png");
  },
};

export const SmallPages: Story = {
  args: { folderId: 203, pageSize: 1 },
  play: async () => {
    await picture("Banner mockup.png");
  },
};

export const NoMedia: Story = {
  args: { folderId: 101 },
  play: async () => {
    await waitFor(
      () => expect(screen.getByText("No media files here yet")).toBeVisible(),
      { timeout: 5000 },
    );
  },
};
