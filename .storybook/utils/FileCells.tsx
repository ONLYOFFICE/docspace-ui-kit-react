import React from "react";

import Cell24Svg from "../../assets/icons/24/cell.svg";
import Image24Svg from "../../assets/icons/24/image.svg";
import Pdf24Svg from "../../assets/icons/24/pdf.svg";
import Slide24Svg from "../../assets/icons/24/slide.svg";
import Word24Svg from "../../assets/icons/24/word.svg";
import {
  type DataTableColumn,
  DataTableRowCheckbox,
  settingsColumn,
} from "../../components/data-table";
import { Link, LinkType } from "../../components/link";
import { Text } from "../../components/text";
import { SortByFieldName } from "../../enums";
import { globalColors } from "../../providers/theme";

export type StoryFile = { name: string; type: string; tags: string };

export const storyFiles: StoryFile[] = [
  { name: "Annual Report 2025.docx", type: "Document", tags: "Finance" },
  { name: "Q4 Budget.xlsx", type: "Spreadsheet", tags: "Finance" },
  { name: "Team Presentation.pptx", type: "Presentation", tags: "Marketing" },
  { name: "Logo Design.png", type: "Image", tags: "Design" },
  { name: "Meeting Notes.docx", type: "Document", tags: "General" },
  { name: "Product Roadmap.pdf", type: "PDF", tags: "Product" },
  { name: "User Research.docx", type: "Document", tags: "UX" },
  { name: "Sprint Backlog.xlsx", type: "Spreadsheet", tags: "Engineering" },
  { name: "Brand Guidelines.pdf", type: "PDF", tags: "Marketing" },
  { name: "Architecture Diagram.png", type: "Image", tags: "Engineering" },
];

const icons: Record<string, React.ReactNode> = {
  ".docx": <Word24Svg />,
  ".xlsx": <Cell24Svg />,
  ".pptx": <Slide24Svg />,
  ".pdf": <Pdf24Svg />,
  ".png": <Image24Svg />,
};

// The icon square, 8px, then the name, as the old table's 40px element
// wrapper laid them out.
const nameCellStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  minWidth: 0,
};

const nameStyle: React.CSSProperties = {
  paddingInlineEnd: "8px",
};

const sideCellStyle: React.CSSProperties = {
  minWidth: 0,
  paddingInlineEnd: "8px",
};

const FileName = ({
  file,
  checked,
  onSelect,
}: {
  file: StoryFile;
  checked: boolean;
  onSelect?: (checked: boolean) => void;
}) => {
  const dot = file.name.lastIndexOf(".");
  const exst = file.name.slice(dot);

  return (
    <div style={nameCellStyle}>
      <DataTableRowCheckbox
        icon={icons[exst]}
        label={`Select ${file.name}`}
        checked={checked}
        onChange={(value) => onSelect?.(value)}
      />
      <Link
        type={LinkType.page}
        title={file.name}
        fontSize="13px"
        fontWeight={600}
        style={nameStyle}
        isTextOverflow
        truncate
      >
        {file.name.slice(0, dot)}
        <span style={{ color: globalColors.gray }}>{exst}</span>
      </Link>
    </div>
  );
};

const side = (value: string) => (
  <div style={sideCellStyle}>
    <Text fontSize="12px" fontWeight={600} color={globalColors.gray} truncate>
      {value}
    </Text>
  </div>
);

/**
 * The columns of a files table over `storyFiles`, for a `DataTable`: the name
 * with the file's icon, which turns into the row's checkbox, then the type and
 * the tags, which the settings button at the end shows and hides. The three
 * sort by the client's sort keys.
 */
export const storyFileColumns = ({
  isChecked = () => false,
  onSelect,
}: {
  isChecked?: (file: StoryFile) => boolean;
  onSelect?: (file: StoryFile, checked: boolean) => void;
} = {}): DataTableColumn<StoryFile>[] => [
  {
    id: "Name",
    title: "Name",
    width: { type: "fill" },
    sortKey: SortByFieldName.Name,
    cell: (file) => (
      <FileName
        file={file}
        checked={isChecked(file)}
        onSelect={(checked) => onSelect?.(file, checked)}
      />
    ),
  },
  {
    id: "Type",
    title: "Type",
    width: { type: "flex" },
    sortKey: SortByFieldName.Type,
    hideable: true,
    cell: (file) => side(file.type),
  },
  {
    id: "Tags",
    title: "Tags",
    width: { type: "flex" },
    sortKey: SortByFieldName.Tags,
    hideable: true,
    cell: (file) => side(file.tags),
  },
  settingsColumn<StoryFile>({ title: "Choose columns" }),
];
