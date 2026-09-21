import { useMemo, useState } from "react";

import DownloadReactSvgUrl from "../../../assets/icons/16/download.react.svg?url";
import MoveReactSvgUrl from "../../../assets/icons/16/move.react.svg?url";
import TrashReactSvgUrl from "../../../assets/icons/16/trash.react.svg?url";
import { Badge } from "../../../components/badge";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../components/heading";
import { Link, LinkType } from "../../../components/link";
import { Row, RowContainer, RowContent } from "../../../components/rows";
import { TableGroupMenu } from "../../../components/table";
import type { TGroupMenuItem } from "../../../components/table";
import { Text } from "../../../components/text";
import { Toast, toastr } from "../../../components/toast";
import { formatSampleDate, sampleFiles, type SampleFile } from "../sample-data";
import { FileIcon } from "../file-icon";

/**
 * A list you can actually work with: select a few rows and the header turns
 * into a toolbar for exactly those rows.
 *
 * `Row` gives every line its checkbox, its leading element and its context
 * menu; `RowContent` decides what survives a narrow screen. The children of
 * `RowContent` are positional, which is the one thing to remember:
 *
 *   [0] the title       -- always visible
 *   [1] badges          -- next to the title
 *   [2...] side columns -- dropped first when the row runs out of room
 */
const FileRowContent = ({ file }: { file: SampleFile }) => (
  <RowContent>
    <Link type={LinkType.page} isTextOverflow fontSize="13px" isBold>
      {file.title}
    </Link>
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {file.isFavorite ? <Badge label="Favorite" isMutedBadge /> : null}
    </div>
    <Text as="span" fontSize="12px" containerMinWidth="120px">
      {file.author}
    </Text>
    <Text as="span" fontSize="12px" containerMinWidth="70px">
      {file.size}
    </Text>
    <Text as="span" fontSize="12px" containerMinWidth="100px">
      {formatSampleDate(file.modified)}
    </Text>
  </RowContent>
);

export const FileList = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const selectedCount = selectedIds.length;
  const isAllSelected = selectedCount === sampleFiles.length;

  const toggleOne = (file: SampleFile, isSelected: boolean) =>
    setSelectedIds((current) =>
      isSelected
        ? [...current, file.id]
        : current.filter((id) => id !== file.id),
    );

  const toggleAll = (isChecked: boolean) =>
    setSelectedIds(isChecked ? sampleFiles.map((file) => file.id) : []);

  const groupMenu: TGroupMenuItem[] = useMemo(
    () => [
      {
        id: "download",
        label: "Download",
        title: "Download",
        iconUrl: DownloadReactSvgUrl,
        disabled: false,
        onClick: () => toastr.info(`Preparing ${selectedCount} files...`),
      },
      {
        id: "move",
        label: "Move to",
        title: "Move to",
        iconUrl: MoveReactSvgUrl,
        disabled: false,
        onClick: () => toastr.info("Pick a destination folder"),
      },
      {
        id: "delete",
        label: "Delete",
        title: "Delete",
        iconUrl: TrashReactSvgUrl,
        disabled: false,
        onClick: () => {
          toastr.success(`${selectedCount} files moved to Trash`);
          setSelectedIds([]);
        },
      },
    ],
    [selectedCount],
  );

  return (
    <div style={{ maxWidth: "820px" }}>
      <Toast />

      <div style={{ minHeight: "52px", marginBottom: "8px" }}>
        {selectedCount > 0 ? (
          <TableGroupMenu
            isChecked={isAllSelected}
            isIndeterminate={!isAllSelected}
            headerMenu={groupMenu}
            withComboBox={false}
            withoutInfoPanelToggler
            headerLabel={`${selectedCount} selected`}
            isCloseable
            onCloseClick={() => setSelectedIds([])}
            onChange={toggleAll}
          />
        ) : (
          <div>
            <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
              Documents
            </Heading>
            <Text fontSize="13px" style={{ marginTop: "4px" }}>
              {sampleFiles.length} files • select a row to see what changes
            </Text>
          </div>
        )}
      </div>

      <RowContainer useReactWindow={false} itemHeight={56}>
        {sampleFiles.map((file) => (
          <Row
            key={file.id}
            checked={selectedIds.includes(file.id)}
            element={<FileIcon fileExst={file.fileExst} size={32} />}
            contextTitle={file.title}
            onSelect={(isSelected) => toggleOne(file, isSelected)}
            onRowClick={() => toastr.info(`Opening ${file.title}`)}
            contextOptions={[
              {
                key: "open",
                label: "Open",
                onClick: () => toastr.info(`Opening ${file.title}`),
              },
              {
                key: "link",
                label: "Copy link",
                onClick: () => toastr.success("Link copied"),
              },
              { key: "separator", isSeparator: true },
              {
                key: "delete",
                label: "Move to Trash",
                onClick: () => toastr.success(`${file.title} moved to Trash`),
              },
            ]}
          >
            <FileRowContent file={file} />
          </Row>
        ))}
      </RowContainer>
    </div>
  );
};
