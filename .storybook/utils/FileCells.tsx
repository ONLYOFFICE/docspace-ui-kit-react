import React from "react";

import Cell24Svg from "../../assets/icons/24/cell.svg";
import Image24Svg from "../../assets/icons/24/image.svg";
import Pdf24Svg from "../../assets/icons/24/pdf.svg";
import Slide24Svg from "../../assets/icons/24/slide.svg";
import Word24Svg from "../../assets/icons/24/word.svg";
import { Checkbox } from "../../components/checkbox";
import { Link, LinkType } from "../../components/link";
import { TableCell } from "../../components/table";
import { Text } from "../../components/text";
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

const elementWrapperStyle: React.CSSProperties = {
  minWidth: "40px",
  border: "none",
};

const elementContainerStyle: React.CSSProperties = {
  width: "32px",
  height: "32px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

// As the client's files table sets it. The label is laid out with a 12px gap
// after the box for a text it does not have, so at its natural width it is
// centred in the 32px container 8px to the left of the icon it replaces;
// narrowed to 12px, the box overflows into that gap and lands on the icon.
const checkboxStyle: React.CSSProperties = {
  width: "12px",
};

const nameStyle: React.CSSProperties = {
  paddingBlock: "14px",
  paddingInlineEnd: "8px",
};

const FileCells = ({
  file,
  checked = false,
  onSelect,
}: {
  file: StoryFile;
  checked?: boolean;
  onSelect?: (checked: boolean) => void;
}) => {
  const dot = file.name.lastIndexOf(".");
  const exst = file.name.slice(dot);

  return (
    <>
      <TableCell>
        <TableCell
          className="table-container_element-wrapper"
          style={elementWrapperStyle}
          hasAccess
          checked={checked}
        >
          <div
            className="table-container_element-container"
            style={elementContainerStyle}
          >
            <div className="table-container_element">{icons[exst]}</div>
            <Checkbox
              className="table-container_row-checkbox"
              style={checkboxStyle}
              isChecked={checked}
              onChange={(e) => onSelect?.(e.target.checked)}
            />
          </div>
        </TableCell>
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
      </TableCell>
      <TableCell>
        <Text
          fontSize="12px"
          fontWeight={600}
          color={globalColors.gray}
          truncate
        >
          {file.type}
        </Text>
      </TableCell>
      <TableCell>
        <Text
          fontSize="12px"
          fontWeight={600}
          color={globalColors.gray}
          truncate
        >
          {file.tags}
        </Text>
      </TableCell>
    </>
  );
};

export default FileCells;
