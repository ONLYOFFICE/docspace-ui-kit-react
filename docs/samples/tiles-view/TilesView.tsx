import { useState } from "react";

import ViewRowsReactSvg from "../../../assets/view-rows.react.svg";
import ViewTilesReactSvg from "../../../assets/view-tiles.react.svg";
import { Badge } from "../../../components/badge";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../components/heading";
import { IconButton } from "../../../components/icon-button";
import { Link, LinkType } from "../../../components/link";
import { Row, RowContainer, RowContent } from "../../../components/rows";
import { Text } from "../../../components/text";
import {
  FileTile,
  FolderTile,
  TileContainer,
  TileContent,
} from "../../../components/tiles";
import { Toast, toastr } from "../../../components/toast";
import { FileType } from "../../../enums";
import { sampleFiles, sampleFolders } from "../sample-data";
import { FileIcon } from "../file-icon";

const fileTypeByExst: Record<string, FileType> = {
  ".docx": FileType.Document,
  ".xlsx": FileType.Spreadsheet,
  ".pptx": FileType.Presentation,
  ".pdf": FileType.PDF,
  ".png": FileType.Image,
};

/**
 * One selection, two layouts. The switch in the header changes nothing about
 * the data or the selected ids -- it only decides which component renders
 * them, which is exactly how the portal's own view switcher works.
 *
 * `TileContainer` sorts its children into two groups by itself: anything whose
 * item has `isFolder` goes under `headingFolders`, the rest under
 * `headingFiles`. Pass the headings and folders stay first, however the array
 * you hand it is ordered.
 */
export const TilesView = () => {
  const [viewAs, setViewAs] = useState<"tile" | "row">("tile");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isSelected = (id: string) => selectedIds.includes(id);

  const toggle = (id: string, checked: boolean) =>
    setSelectedIds((current) =>
      checked ? [...current, id] : current.filter((item) => item !== id),
    );

  const contextOptions = (title: string) => [
    {
      key: "open",
      label: "Open",
      onClick: () => toastr.info(`Opening ${title}`),
    },
    {
      key: "link",
      label: "Copy link",
      onClick: () => toastr.success("Link copied"),
    },
  ];

  return (
    <div style={{ maxWidth: "900px" }}>
      <Toast />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <div>
          <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
            Documents
          </Heading>
          <Text fontSize="13px" style={{ marginTop: "4px" }}>
            {selectedIds.length > 0
              ? `${selectedIds.length} selected — the selection survives the switch`
              : "Select a tile, then switch the view"}
          </Text>
        </div>

        <div style={{ display: "flex", gap: "4px", paddingTop: "4px" }}>
          <IconButton
            size={16}
            title="List"
            iconNode={<ViewRowsReactSvg />}
            color={viewAs === "row" ? "accent" : undefined}
            onClick={() => setViewAs("row")}
          />
          <IconButton
            size={16}
            title="Tiles"
            iconNode={<ViewTilesReactSvg />}
            color={viewAs === "tile" ? "accent" : undefined}
            onClick={() => setViewAs("tile")}
          />
        </div>
      </div>

      {viewAs === "tile" ? (
        <TileContainer
          headingFolders={
            <Text fontSize="13px" isBold>
              Folders
            </Text>
          }
          headingFiles={
            <Text fontSize="13px" isBold>
              Files
            </Text>
          }
        >
          {sampleFolders.map((folder) => (
            <FolderTile
              key={`folder-${folder.id}`}
              item={{
                id: folder.id,
                title: folder.title,
                isFolder: true,
              }}
              checked={isSelected(`folder-${folder.id}`)}
              element={<FileIcon fileExst="folder" />}
              temporaryIcon={<FileIcon fileExst="folder" size={96} />}
              contextOptions={contextOptions(folder.title)}
              onSelect={(checked) => toggle(`folder-${folder.id}`, checked)}
            >
              <TileContent>
                <Link type={LinkType.page} isTextOverflow fontSize="13px">
                  {folder.title}
                </Link>
              </TileContent>
            </FolderTile>
          ))}

          {sampleFiles.map((file) => (
            <FileTile
              key={`file-${file.id}`}
              item={{
                id: file.id,
                title: file.title,
                fileExst: file.fileExst,
                fileType: fileTypeByExst[file.fileExst],
              }}
              checked={isSelected(`file-${file.id}`)}
              element={<FileIcon fileExst={file.fileExst} />}
              temporaryIcon={<FileIcon fileExst={file.fileExst} size={96} />}
              badges={file.isFavorite ? <Badge label="Favorite" /> : undefined}
              contextOptions={contextOptions(file.title)}
              onSelect={(checked) => toggle(`file-${file.id}`, checked)}
            >
              <TileContent>
                <Link type={LinkType.page} isTextOverflow fontSize="13px">
                  {file.title}
                </Link>
              </TileContent>
            </FileTile>
          ))}
        </TileContainer>
      ) : (
        <RowContainer useReactWindow={false} itemHeight={56}>
          {sampleFiles.map((file) => (
            <Row
              key={file.id}
              checked={isSelected(`file-${file.id}`)}
              element={<FileIcon fileExst={file.fileExst} />}
              contextOptions={contextOptions(file.title)}
              onSelect={(checked) => toggle(`file-${file.id}`, checked)}
            >
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
      )}
    </div>
  );
};
