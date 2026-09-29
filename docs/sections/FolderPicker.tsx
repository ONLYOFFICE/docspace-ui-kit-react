import { useCallback, useEffect, useState } from "react";
import type {
  FileEntryDtoIntegerAllOfSecurity,
  RoomType,
} from "@onlyoffice/docspace-api-sdk";

import CatalogDocumentsSvg from "../../assets/icons/16/catalog.documents.react.svg";
import CatalogRoomsSvg from "../../assets/icons/16/catalog.rooms.react.svg";
import FolderSvgUrl from "../../assets/icons/32/folder.svg?url";
import FolderCompleteSvgUrl from "../../assets/icons/32/folderComplete.svg?url";
import FolderInProgressSvgUrl from "../../assets/icons/32/folderInProgress.svg?url";
import EmptyScreenFolderUrl from "../../assets/emptyFilter/empty.filter.rooms.light.svg?url";
import {
  BreadCrumbsLoader,
  RowLoader,
  Selector,
  type TBreadCrumb,
  type TSelectorItem,
} from "../../components/selector";
import {
  DEFAULT_ROOM_COLOR,
  formFolderOf,
  SECTION_TITLES,
  type SectionItem,
  type SectionKind,
  type SectionSource,
} from "./source";

/** Where the picker is: its own root, or a list inside the section. */
type Place =
  | { at: "root" }
  /** `folderId: null` is the section's own list. */
  | { at: "list"; folderId: number | null };

/** The crumb above the section; the picker's root, holding only it. */
const ROOT_CRUMB: TBreadCrumb = { id: "picker-root", label: "ONLYOFFICE" };
const SECTION_ID = "picker-section";

const SECTION_ICONS: Record<SectionKind, React.ReactElement> = {
  files: <CatalogDocumentsSvg />,
  rooms: <CatalogRoomsSvg />,
  forms: <CatalogDocumentsSvg />,
};

// A form room's Complete and In process folders have icons of their own.
const FORM_FOLDER_ICONS: Record<"done" | "progress" | "none", string> = {
  done: FolderCompleteSvgUrl,
  progress: FolderInProgressSvgUrl,
  none: FolderSvgUrl,
};

// A read-only picker opens and chooses; it reads no permission, so every row
// carries the same empty set.
const NO_SECURITY = {} as FileEntryDtoIntegerAllOfSecurity;

const sectionRow = (kind: SectionKind): TSelectorItem => ({
  id: SECTION_ID,
  key: SECTION_ID,
  label: SECTION_TITLES[kind],
  isFolder: true,
  parentId: 0,
  rootFolderType: kind,
  filesCount: 0,
  foldersCount: 0,
  security: NO_SECURITY,
  avatar: SECTION_ICONS[kind],
  disableMultiSelect: true,
});

const toRow = (item: SectionItem): TSelectorItem =>
  item.kind === "room"
    ? {
        id: item.id,
        key: `room-${item.id}`,
        label: item.title,
        isFolder: true,
        // A room from either source always carries its type.
        roomType: item.roomType as RoomType,
        shared: false,
        parentId: 0,
        rootFolderType: "",
        filesCount: 0,
        foldersCount: 0,
        security: NO_SECURITY,
        color: item.color || DEFAULT_ROOM_COLOR,
        disableMultiSelect: true,
      }
    : {
        id: item.id,
        key: `folder-${item.id}`,
        label: item.title,
        isFolder: true,
        parentId: 0,
        rootFolderType: "",
        filesCount: 0,
        foldersCount: 0,
        security: NO_SECURITY,
        icon: FORM_FOLDER_ICONS[formFolderOf(item) ?? "none"],
        disableMultiSelect: true,
      };

export type FolderPickerProps = {
  kind: SectionKind;
  /** The same source the list reads, so the picker and the list agree. */
  source: SectionSource;
  /** Called with the chosen folder or room, or `null` for the section itself. */
  onPick: (folderId: number | null) => void;
  onClose: () => void;
};

/**
 * Picks a place in one section: its own root holds that section and
 * nothing else -- Files, Rooms or Forms -- and inside it only folders and
 * rooms are listed, since a file is not somewhere to go. A click on a row
 * opens it; the button takes wherever the picker stands, the section's own
 * list included.
 *
 * Built on the kit's `Selector` rather than `FilesSelector`: that one cannot
 * narrow its root to Rooms or to Forms alone (My documents is always kept),
 * and it has no demo data, so with no portal connected it would open empty.
 */
export const FolderPicker = ({
  kind,
  source,
  onPick,
  onClose,
}: FolderPickerProps) => {
  const [place, setPlace] = useState<Place>({ at: "root" });
  // The trail below the root, outermost first; its last entry is where the
  // picker stands.
  const [trail, setTrail] = useState<TBreadCrumb[]>([]);
  const [rows, setRows] = useState<TSelectorItem[]>([sectionRow(kind)]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (place.at === "root") {
      setRows([sectionRow(kind)]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    source
      .list({
        folderId: place.folderId,
        search: "",
        filters: [],
        sortBy: "AZ",
        ascending: true,
      })
      .then(
        (listing) => {
          if (cancelled) return;
          setRows(
            listing.items.filter((item) => item.kind !== "file").map(toRow),
          );
        },
        () => {
          if (!cancelled) setRows([]);
        },
      )
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [kind, place, source]);

  const open = useCallback(
    (item: TSelectorItem) => {
      if (item.id === SECTION_ID) {
        setPlace({ at: "list", folderId: null });
        setTrail([{ id: SECTION_ID, label: SECTION_TITLES[kind] }]);
        return;
      }
      setPlace({ at: "list", folderId: Number(item.id) });
      setTrail((current) => [
        ...current,
        { id: item.id ?? "", label: item.label, isRoom: "roomType" in item },
      ]);
    },
    [kind],
  );

  const onSelectBreadCrumb = (crumb: TBreadCrumb) => {
    if (crumb.id === ROOT_CRUMB.id) {
      setPlace({ at: "root" });
      setTrail([]);
      return;
    }
    const index = trail.findIndex((item) => item.id === crumb.id);
    if (index < 0) return;
    setTrail(trail.slice(0, index + 1));
    setPlace({
      at: "list",
      folderId: crumb.id === SECTION_ID ? null : Number(crumb.id),
    });
  };

  const goBack = () => {
    const parent = trail.at(-2);
    if (parent) onSelectBreadCrumb(parent);
    else onSelectBreadCrumb(ROOT_CRUMB);
  };

  return (
    <Selector
      useAside
      onClose={onClose}
      withHeader
      headerProps={
        place.at === "root"
          ? // Leaving `withoutBackButton` out is what hides the arrow.
            { headerLabel: "Select a folder", onCloseClick: onClose }
          : {
              headerLabel: "Select a folder",
              onCloseClick: onClose,
              withoutBackButton: false,
              onBackClick: goBack,
              withoutBorder: false,
            }
      }
      withBreadCrumbs
      breadCrumbs={[ROOT_CRUMB, ...trail]}
      breadCrumbsLoader={<BreadCrumbsLoader />}
      isBreadCrumbsLoading={false}
      onSelectBreadCrumb={onSelectBreadCrumb}
      bodyIsLoading={loading}
      items={rows}
      onSelect={open}
      isMultiSelect={false}
      submitButtonLabel="Open"
      // At the root there is only the section to go into; the choice is
      // made from inside it, where "here" is the section or a folder.
      disableSubmitButton={place.at === "root" || loading}
      onSubmit={() => {
        if (place.at === "list") onPick(place.folderId);
      }}
      withCancelButton
      cancelButtonLabel="Cancel"
      onCancel={onClose}
      alwaysShowFooter
      disableFirstFetch
      isLoading={loading}
      rowLoader={<RowLoader isMultiSelect={false} isContainer={loading} />}
      hasNextPage={false}
      isNextPageLoading={false}
      totalItems={rows.length}
      loadNextPage={async () => {}}
      emptyScreenImage={<img src={EmptyScreenFolderUrl} alt="" />}
      emptyScreenHeader="No folders here"
      emptyScreenDescription="Open this place to see its files."
      searchEmptyScreenImage={<img src={EmptyScreenFolderUrl} alt="" />}
      searchEmptyScreenHeader="Nothing found"
      searchEmptyScreenDescription=""
    />
  );
};
