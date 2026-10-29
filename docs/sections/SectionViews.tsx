import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { RoomType } from "@onlyoffice/docspace-api-sdk";

import type { ContextMenuModel } from "../../components/context-menu";
import { Link, LinkType } from "../../components/link";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
  type TTableColumn,
} from "../../components/table";
import { Text } from "../../components/text";
import {
  FileTile,
  FolderTile,
  RoomTile,
  TileContainer,
  TileContent,
} from "../../components/tiles";
import { SortByFieldName } from "../../enums";
import type { SectionItem, SectionKind, SortKey } from "./source";
import styles from "./SectionList.module.scss";

/**
 * A room type as the client names it on a tile's tag (`getRoomTypeName`): the
 * short form, "Custom" rather than "Custom room".
 */
export const ROOM_TYPE_NAMES: Partial<Record<RoomType, string>> = {
  [RoomType.EditingRoom]: "Collaboration",
  [RoomType.PublicRoom]: "Public room",
  [RoomType.CustomRoom]: "Custom",
  [RoomType.VirtualDataRoom]: "Virtual data room",
  [RoomType.FillingFormsRoom]: "Form space",
};

/**
 * The time of the last change, as the client writes it in every view:
 * "10/27/2026 5:53 PM".
 */
export const changedAt = (iso: string) =>
  iso
    ? new Date(iso)
        .toLocaleString("en-US", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
        .replace(", ", " ")
    : "";

/** A name with a file's extension greyed, as the client draws it. */
export const NameText = ({ item }: { item: SectionItem }) =>
  item.fileExst ? (
    <>
      {item.title.slice(0, -item.fileExst.length)}
      <span className={styles.extension}>{item.fileExst}</span>
    </>
  ) : (
    <>{item.title}</>
  );

type ViewProps = {
  kind: SectionKind;
  items: SectionItem[];
  /** Whether the list is a section's rooms rather than a folder's contents. */
  roomsList: boolean;
  iconOf: (item: SectionItem, size?: number) => ReactElement;
  open: (item: SectionItem) => void;
  contextOptions: (item: SectionItem) => ContextMenuModel[];
};

/** Width of the element, kept current: the header lays its columns out by it. */
const useWidth = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width)),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
};

type SectionTableProps = ViewProps & {
  sortBy: SortKey;
  ascending: boolean;
  onSort: (sortBy: SortKey) => void;
};

/**
 * The desktop view: the client's table. A section's rooms show Name, Tags
 * and Last activity; a folder's contents Name, Modified and Size. The name
 * and the date columns sort, the others do not.
 */
export const SectionTable = ({
  kind,
  items,
  roomsList,
  iconOf,
  open,
  contextOptions,
  sortBy,
  ascending,
  onSort,
}: SectionTableProps) => {
  const [frameRef, width] = useWidth();
  const containerRef = useRef<HTMLDivElement>(null);
  // One layout per list shape: the header saves the widths under this key.
  // Both keys are needed: without the info-panel one the header lays out
  // nothing and the body renders nothing, whatever the types say.
  const storage = `section-${kind}-${roomsList ? "rooms" : "items"}-columns`;

  const sort = (key: string) => onSort(key as SortKey);

  const columns: TTableColumn[] = [
    {
      key: "Name",
      title: "Name",
      enable: true,
      default: true,
      resizable: true,
      minWidth: 210,
      sortBy: SortByFieldName.Name,
      onClick: sort,
    },
    roomsList
      ? { key: "Tags", title: "Tags", enable: true, resizable: true }
      : {
          key: "Modified",
          title: "Modified",
          enable: true,
          resizable: true,
          sortBy: SortByFieldName.ModifiedDate,
          onClick: sort,
        },
    roomsList
      ? {
          key: "Activity",
          title: "Last activity",
          enable: true,
          resizable: true,
          sortBy: SortByFieldName.ModifiedDate,
          onClick: sort,
        }
      : { key: "Size", title: "Size", enable: true, resizable: true },
  ];

  const side = (value: string) => (
    <TableCell>
      <Text
        fontSize="12px"
        fontWeight={600}
        color="var(--section-story-row-side)"
        truncate
      >
        {value}
      </Text>
    </TableCell>
  );

  return (
    <div ref={frameRef} className={styles.table}>
      {width ? (
        <TableContainer forwardedRef={containerRef} useReactWindow={false}>
          <TableHeader
            containerRef={containerRef}
            columns={columns}
            columnStorageName={storage}
            columnInfoPanelStorageName={`${storage}-info-panel`}
            sectionWidth={width}
            useReactWindow={false}
            showSettings={false}
            sortBy={sortBy}
            sorted={!ascending}
          />
          <TableBody
            columnStorageName={storage}
            columnInfoPanelStorageName={`${storage}-info-panel`}
            filesLength={items.length}
            itemCount={items.length}
            itemHeight={48}
            hasMoreFiles={false}
            useReactWindow={false}
            fetchMoreFiles={() => Promise.resolve()}
          >
            {items.map((item) => (
              <TableRow
                key={`${item.kind}-${item.id}`}
                contextOptions={contextOptions(item)}
                getContextModel={() => contextOptions(item)}
              >
                <TableCell className={styles.nameCell}>
                  <div className={styles.nameIcon}>{iconOf(item)}</div>
                  <Link
                    type={LinkType.page}
                    title={item.title}
                    fontSize="13px"
                    fontWeight={600}
                    isTextOverflow
                    truncate
                    onClick={() => open(item)}
                  >
                    <NameText item={item} />
                  </Link>
                </TableCell>
                {roomsList
                  ? side((item.tags ?? []).join(", "))
                  : side(changedAt(item.updated))}
                {roomsList
                  ? side(changedAt(item.updated))
                  : side(item.kind === "file" ? item.detail : "")}
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
      ) : null}
    </div>
  );
};

/**
 * The tile view. A section's rooms are room tiles with their tags, or the
 * room's type when it has none; a folder's contents are folder tiles, then
 * file tiles, under the client's "Folders" and "Files" headings.
 */
export const SectionTiles = ({
  items,
  roomsList,
  iconOf,
  open,
  contextOptions,
}: ViewProps) => {
  const heading = (text: string) => (
    <Text fontSize="16px" fontWeight={600} className={styles.tileHeading}>
      {text}
    </Text>
  );

  // The client's FilesTileContent: 16px for a room, 13px for a folder or a
  // file on a desktop.
  const name = (item: SectionItem, fontSize = "13px") => (
    <TileContent>
      <Link
        type={LinkType.page}
        title={item.title}
        fontSize={fontSize}
        fontWeight={600}
        isTextOverflow
        onClick={() => open(item)}
      >
        <NameText item={item} />
      </Link>
    </TileContent>
  );

  if (roomsList) {
    return (
      <TileContainer className={styles.tiles}>
        {items.map((item) => (
          <RoomTile
            key={`room-${item.id}`}
            item={{
              id: item.id,
              title: item.title,
              isRoom: true,
              roomType: String(item.roomType),
              tags: item.tags,
              contextOptions: contextOptions(item),
            }}
            element={iconOf(item)}
            contextOptions={contextOptions(item)}
            getContextModel={() => contextOptions(item)}
            columnCount={2}
            getRoomTypeName={(type) =>
              ROOM_TYPE_NAMES[Number(type) as RoomType] ?? "Room"
            }
            selectTag={() => {}}
            selectOption={() => {}}
            thumbnailClick={() => open(item)}
          >
            {name(item, "16px")}
          </RoomTile>
        ))}
      </TileContainer>
    );
  }

  return (
    <TileContainer
      className={styles.tiles}
      headingFolders={heading("Folders")}
      headingFiles={heading("Files")}
    >
      {items.map((item) =>
        item.kind === "file" ? (
          <FileTile
            key={`file-${item.id}`}
            item={{
              id: item.id,
              title: item.title,
              fileExst: item.fileExst,
              fileType: item.fileType,
              contextOptions: [],
            }}
            element={iconOf(item)}
            temporaryIcon={iconOf(item, 96)}
            contextOptions={contextOptions(item)}
            getContextModel={() => contextOptions(item)}
            thumbnailClick={() => open(item)}
          >
            {name(item)}
          </FileTile>
        ) : (
          <FolderTile
            key={`${item.kind}-${item.id}`}
            item={{
              id: item.id,
              title: item.title,
              isFolder: true,
              contextOptions: [],
            }}
            element={iconOf(item)}
            contextOptions={contextOptions(item)}
            getContextModel={() => contextOptions(item)}
            thumbnailClick={() => open(item)}
          >
            {name(item)}
          </FolderTile>
        ),
      )}
    </TileContainer>
  );
};
