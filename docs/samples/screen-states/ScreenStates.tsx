import { useState } from "react";

import EmptyFilterFilesDarkUrl from "../../../assets/emptyFilter/empty.filter.files.dark.svg?url";
import EmptyFilterFilesLightUrl from "../../../assets/emptyFilter/empty.filter.files.light.svg?url";
import EmptyRoomsDarkSvg from "../../../assets/emptyview/empty.rooms.root.user.dark.svg";
import EmptyRoomsLightSvg from "../../../assets/emptyview/empty.rooms.root.user.light.svg";
import PlusReactSvg from "../../../assets/icons/16/button.plus.react.svg";
import { Button, ButtonSize } from "../../../components/button";
import { EmptyScreenContainer } from "../../../components/empty-screen-container";
import { EmptyView } from "../../../components/empty-view";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../components/heading";
import { Link, LinkType } from "../../../components/link";
import { Row, RowContainer, RowContent } from "../../../components/rows";
import { RowsSkeleton } from "../../../components/rows";
import { Tabs, TabsTypes } from "../../../components/tabs";
import { Text } from "../../../components/text";
import { Toast, toastr } from "../../../components/toast";
import { useTheme } from "../../../context/ThemeContext";
import { sampleFiles } from "../sample-data";
import { FileIcon } from "../file-icon";

const box: React.CSSProperties = {
  minHeight: "360px",
  paddingTop: "16px",
};

/**
 * The three screens nobody designs until the demo breaks: still loading,
 * nothing here yet, and it went wrong.
 *
 * Each one has a component of its own, and the difference between them is the
 * question the user is asking:
 *
 *   loading      -- "is it coming?"   -> a skeleton shaped like the answer
 *   empty        -- "what now?"       -> EmptyView, which is a list of ways out
 *   no results   -- "where is it?"    -> EmptyScreenContainer, keep the filter
 *   error        -- "is it me?"       -> say what failed, offer the retry
 *
 * Note `isBase` from `useTheme()`: raster and SVG illustrations do not follow
 * CSS custom properties, so the two-file light/dark pair is picked in JS. This
 * is the one place in the kit where the theme is a JavaScript concern.
 */
export const ScreenStates = () => {
  const { isBase } = useTheme();
  const [state, setState] = useState("loading");

  const loading = (
    <div style={box}>
      <RowsSkeleton count={6} />
    </div>
  );

  const empty = (
    <div style={box}>
      <EmptyView
        icon={isBase ? <EmptyRoomsLightSvg /> : <EmptyRoomsDarkSvg />}
        title="No files in Finance department yet"
        description="Upload what the team needs, or start from a form template."
        options={[
          {
            key: "upload",
            type: "button",
            title: "Upload files",
            primary: true,
            onClick: () => toastr.info("The file picker would open here"),
          },
          {
            key: "or",
            type: "separator",
            text: "or",
          },
          {
            key: "create",
            type: "action",
            title: "Create a document",
            icon: <PlusReactSvg />,
            onClick: () => toastr.info("A new document would open here"),
          },
        ]}
      />
    </div>
  );

  const noResults = (
    <div style={box}>
      <EmptyScreenContainer
        imageSrc={isBase ? EmptyFilterFilesLightUrl : EmptyFilterFilesDarkUrl}
        imageAlt="No files match the filter"
        headerText='Nothing matches "budget 2024"'
        descriptionText="No file in this room has that name. Try a shorter query, or clear the filter."
        buttons={
          <Link
            type={LinkType.action}
            isHovered
            fontSize="13px"
            role="button"
            tabIndex={0}
            onClick={() => toastr.success("Filter cleared")}
          >
            Reset filter
          </Link>
        }
      />
    </div>
  );

  const failed = (
    <div style={box}>
      {/* No illustration on purpose: the sleeping-folder art says "empty", and
          an empty room and a failed request are not the same news. A failure
          gets the plain facts, what was not changed, and two ways out. */}
      <div style={{ maxWidth: "460px", paddingTop: "24px" }}>
        <Heading level={HeadingLevel.h3} size={HeadingSize.small}>
          We could not load this room
        </Heading>
        <Text fontSize="13px" lineHeight="20px" style={{ marginTop: "8px" }}>
          The request timed out after 30 seconds. Nothing was changed, and your
          files are untouched.
        </Text>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <Button
            primary
            label="Try again"
            size={ButtonSize.normal}
            onClick={() => toastr.info("Retrying...")}
          />
          <Link
            type={LinkType.action}
            isHovered
            fontSize="13px"
            role="button"
            tabIndex={0}
            onClick={() => toastr.info("Opening the status page")}
          >
            Check the service status
          </Link>
        </div>
      </div>
    </div>
  );

  const loaded = (
    <div style={box}>
      <RowContainer useReactWindow={false} itemHeight={56}>
        {sampleFiles.slice(0, 4).map((file) => (
          <Row key={file.id} element={<FileIcon fileExst={file.fileExst} />}>
            <RowContent>
              <Link type={LinkType.page} isTextOverflow fontSize="13px">
                {file.title}
              </Link>
              <div />
              <Text as="span" fontSize="12px" containerMinWidth="80px">
                {file.size}
              </Text>
            </RowContent>
          </Row>
        ))}
      </RowContainer>
    </div>
  );

  return (
    <div style={{ maxWidth: "820px" }}>
      <Toast />

      <div style={{ marginBottom: "16px" }}>
        <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
          Every state this screen can be in
        </Heading>
        <Text fontSize="13px" style={{ marginTop: "4px" }}>
          Switch the theme in the toolbar as well — the illustrations follow.
        </Text>
      </div>

      <Tabs
        type={TabsTypes.Primary}
        selectedItemId={state}
        onSelect={(item) => setState(item.id)}
        items={[
          { id: "loading", name: "Loading", content: loading },
          { id: "empty", name: "Empty", content: empty },
          { id: "no-results", name: "No results", content: noResults },
          { id: "error", name: "Failed", content: failed },
          { id: "loaded", name: "Loaded", content: loaded },
        ]}
      />
    </div>
  );
};
