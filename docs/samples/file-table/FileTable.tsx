import { useMemo, useRef, useState } from "react";

import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../components/heading";
import { Link, LinkType } from "../../../components/link";
import { Scrollbar } from "../../../components/scrollbar";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
  type TTableColumn,
} from "../../../components/table";
import { Text } from "../../../components/text";
import { Toast, toastr } from "../../../components/toast";
import { SortByFieldName } from "../../../enums";
import { formatSampleDate, sampleFiles } from "../sample-data";
import { FileIcon } from "../file-icon";

/**
 * The same eight files as the previous sample, in the view people reach for
 * when they want to compare rather than browse.
 *
 * Sorting, resizing and hiding columns are three separate mechanisms:
 *
 *   sorting  -- yours. The column's `onClick` hands you its `sortBy`; the
 *               header only draws the arrow from `sortBy` + `sorted`.
 *   resizing -- the header's, and it remembers the widths under
 *               `columnStorageName` in localStorage.
 *   hiding   -- also the header's, behind `showSettings`; each column's
 *               `enable` is the state, and `onChange` is where you flip it.
 */
const COLUMN_STORAGE_NAME = "samples-file-table-columns";
const COLUMN_INFO_PANEL_STORAGE_NAME = "samples-file-table-columns-info";

type SortDirection = "asc" | "desc";

export const FileTable = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [sortBy, setSortBy] = useState<string>(SortByFieldName.Name);
  const [direction, setDirection] = useState<SortDirection>("asc");
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);

  const onColumnClick = (nextSortBy: string) => {
    if (nextSortBy === sortBy) {
      setDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(nextSortBy);
    setDirection("asc");
  };

  const onColumnToggle = (key: string) =>
    setHiddenColumns((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );

  const columns: TTableColumn[] = [
    {
      key: "name",
      title: "Name",
      sortBy: SortByFieldName.Name,
      default: true,
      minWidth: 220,
    },
    { key: "type", title: "Type", sortBy: SortByFieldName.Type },
    { key: "author", title: "Author", sortBy: SortByFieldName.Author },
    { key: "size", title: "Size", sortBy: SortByFieldName.Size },
    {
      key: "modified",
      title: "Modified",
      sortBy: SortByFieldName.ModifiedDate,
    },
  ].map((column) => ({
    ...column,
    resizable: true,
    enable: !hiddenColumns.includes(column.key),
    onClick: (nextSortBy: string) => onColumnClick(nextSortBy),
    onChange: (key: string) => onColumnToggle(key),
  }));

  const rows = useMemo(() => {
    const sorted = [...sampleFiles].sort((a, b) => {
      switch (sortBy) {
        case SortByFieldName.Type:
          return a.type.localeCompare(b.type);
        case SortByFieldName.Author:
          return a.author.localeCompare(b.author);
        case SortByFieldName.Size:
          return Number.parseFloat(a.size) - Number.parseFloat(b.size);
        case SortByFieldName.ModifiedDate:
          return a.modified.localeCompare(b.modified);
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return direction === "asc" ? sorted : sorted.reverse();
  }, [sortBy, direction]);

  const isVisible = (key: string) => !hiddenColumns.includes(key);

  return (
    <div style={{ maxWidth: "960px" }}>
      <Toast />

      {/*
        The heading stands alone here on purpose: the table header is
        `position: fixed`, so it keeps the place the layout gave it and would
        sit on top of anything else in this gap.
      */}
      <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
        Documents
      </Heading>

      {/*
        The header pins itself to the page's scroll container -- `#sectionScroll`,
        which `Section` provides in a real screen (see the last sample). A
        standalone table supplies its own, which is also what gives this sample
        its scrollable viewport.
      */}
      <div style={{ position: "relative", marginTop: "16px" }}>
        <Scrollbar
          id="sectionScroll"
          style={{ height: "420px" }}
          autoHide={false}
        >
          {/*
            TableContainer carries `margin-top: -25px` -- it expects the 25px
            the portal's section leaves above it. Without this spacer the fixed
            header climbs over whatever sits above the table.
          */}
          <div style={{ marginTop: "25px" }}>
            <TableContainer forwardedRef={containerRef} useReactWindow={false}>
              <TableHeader
                containerRef={containerRef}
                columns={columns}
                columnStorageName={COLUMN_STORAGE_NAME}
                columnInfoPanelStorageName={COLUMN_INFO_PANEL_STORAGE_NAME}
                sectionWidth={920}
                sortBy={sortBy}
                sorted={direction === "desc"}
                useReactWindow={false}
                settingsTitle="Columns"
                showSettings
                sortingVisible
              />
              <TableBody
                columnStorageName={COLUMN_STORAGE_NAME}
                columnInfoPanelStorageName={COLUMN_INFO_PANEL_STORAGE_NAME}
                fetchMoreFiles={async () => {}}
                filesLength={rows.length}
                hasMoreFiles={false}
                itemCount={rows.length}
                itemHeight={48}
                useReactWindow={false}
              >
                {rows.map((file) => (
                  <TableRow
                    key={file.id}
                    title={file.title}
                    contextOptions={[
                      {
                        key: "open",
                        label: "Open",
                        onClick: () => toastr.info(`Opening ${file.title}`),
                      },
                      {
                        key: "download",
                        label: "Download",
                        onClick: () => toastr.info(`Downloading ${file.title}`),
                      },
                      { key: "separator", isSeparator: true },
                      {
                        key: "delete",
                        label: "Move to Trash",
                        onClick: () =>
                          toastr.success(`${file.title} moved to Trash`),
                      },
                    ]}
                  >
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          minWidth: 0,
                        }}
                      >
                        <FileIcon fileExst={file.fileExst} />
                        <Link
                          type={LinkType.page}
                          isTextOverflow
                          fontSize="13px"
                        >
                          {file.title}
                        </Link>
                      </div>
                    </TableCell>
                    {isVisible("type") ? (
                      <TableCell>
                        <Text fontSize="12px">{file.type}</Text>
                      </TableCell>
                    ) : null}
                    {isVisible("author") ? (
                      <TableCell>
                        <Text fontSize="12px">{file.author}</Text>
                      </TableCell>
                    ) : null}
                    {isVisible("size") ? (
                      <TableCell>
                        <Text fontSize="12px">{file.size}</Text>
                      </TableCell>
                    ) : null}
                    {isVisible("modified") ? (
                      <TableCell>
                        <Text fontSize="12px">
                          {formatSampleDate(file.modified)}
                        </Text>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
              </TableBody>
            </TableContainer>
          </div>
        </Scrollbar>
      </div>
    </div>
  );
};
