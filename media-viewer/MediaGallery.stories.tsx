import { useEffect, useState } from "react";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useTranslation } from "react-i18next";
import { expect, screen, waitFor } from "storybook/test";

import {
  DemoPortal,
  withPortalGate,
} from "../.storybook/decorators/PortalGate";
import { DEMO_PORTAL_URL } from "../.storybook/mocks/demoPortal";
import { useApi } from "../providers/api";
import { useWindowDevice } from "../.storybook/utils/useWindowDevice";

import MediaGallery from "./MediaGallery";
import type { MediaGalleryProps } from "./MediaGallery.types";

type StoryArgs = Pick<
  MediaGalleryProps,
  "requestToken" | "startFileId" | "pageSize" | "autoPlay"
> & {
  folderId?: MediaGalleryProps["folderId"];
};

// The viewer shows a file icon only for audio and in the mobile header, and
// the demo folder holds pictures and a video: no icon set is wired up here.
const getIcon = () => "";

const EXTS_IMAGE_PREVIEWED = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"];

// The demo portal's folder with three pictures and a video.
const DEMO_FOLDER_ID = 203;

// A connected portal's "My documents": the one folder every account has.
const MY_DOCUMENTS = "@my";

const Note = ({ children }: { children: React.ReactNode }) => (
  <p style={{ padding: 24 }}>{children}</p>
);

const Gallery = ({ folderId, ...args }: StoryArgs) => {
  const { baseUrl } = useApi();

  // With no folder named, each portal opens the one it is sure to have.
  const folder =
    folderId || (baseUrl === DEMO_PORTAL_URL ? DEMO_FOLDER_ID : MY_DOCUMENTS);

  return <FolderGallery key={String(folder)} {...args} folderId={folder} />;
};

const FolderGallery = (
  args: StoryArgs & Pick<MediaGalleryProps, "folderId">,
) => {
  const { t } = useTranslation("Common");
  const currentDeviceType = useWindowDevice();
  const [isFailed, setIsFailed] = useState(false);

  if (isFailed) {
    return (
      <Note>
        Could not open folder {String(args.folderId)} on this portal. Check that
        it exists and that the key may read it.
      </Note>
    );
  }

  return (
    <MediaGallery
      {...args}
      onLoadError={() => setIsFailed(true)}
      t={t}
      getIcon={getIcon}
      extsImagePreviewed={EXTS_IMAGE_PREVIEWED}
      currentDeviceType={currentDeviceType}
      emptyContent={<Note>This folder has no media files.</Note>}
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
        "The folder or room whose media files are shown. Left empty, the story opens the demo portal's folder with three pictures and a video, or My documents (`@my`) of a connected portal; type the id of another folder or room to open it.",
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
  parameters: {
    docs: {
      description: {
        story:
          "On the demo portal, a folder with three pictures and a video. The first picture opens; the arrows at the edges, the arrow keys and a swipe move to the next file.",
      },
    },
  },
  play: async () => {
    await opens("Banner mockup.png");
    await expect(screen.getByTestId("next-button")).toBeInTheDocument();
  },
};

export const StartsWithVideo: Story = {
  args: { startFileId: 1205 },
  parameters: {
    docs: {
      description: {
        story:
          "`startFileId` names the file to open first: here the demo folder's video, its last file, with the player controls in place of the picture toolbar. A file id that the folder does not hold opens the first media file.",
      },
    },
  },
  play: async () => {
    await opens("Teaser video.webm");
    await waitFor(() => expect(document.querySelector("video")).not.toBeNull());
  },
};

// A story about one state needs a folder known to be in it, and only the demo
// portal has one: this keeps the story on the demo portal whichever portal
// the toolbar has connected.
const onDemoPortal: Decorator = (Story, context) => {
  const { baseUrl } = useApi();

  if (baseUrl === DEMO_PORTAL_URL) return <Story />;

  return (
    <DemoPortal storyId={context.id}>
      <Story />
    </DemoPortal>
  );
};

export const FolderWithoutMedia: Story = {
  args: { folderId: 101 },
  decorators: [onDemoPortal],
  parameters: {
    docs: {
      description: {
        story:
          "A folder that holds only documents. The viewer does not open; the gallery renders `emptyContent`, which the application supplies. Always shown on the demo portal, whose folder 101 is such a folder.",
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
