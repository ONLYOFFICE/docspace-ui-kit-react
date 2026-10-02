import Cell32Svg from "../../assets/icons/32/cell.svg";
import File32Svg from "../../assets/icons/32/file.svg";
import Folder32Svg from "../../assets/icons/32/folder.svg";
import Image32Svg from "../../assets/icons/32/image.svg";
import Pdf32Svg from "../../assets/icons/32/pdf.svg";
import Slide32Svg from "../../assets/icons/32/slide.svg";
import Word32Svg from "../../assets/icons/32/word.svg";
import Cell96Svg from "../../assets/icons/96/cell.svg";
import File96Svg from "../../assets/icons/96/file.svg";
import Folder96Svg from "../../assets/icons/96/folder.svg";
import Image96Svg from "../../assets/icons/96/image.svg";
import Pdf96Svg from "../../assets/icons/96/pdf.svg";
import Slide96Svg from "../../assets/icons/96/slide.svg";
import Word96Svg from "../../assets/icons/96/word.svg";

type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

/**
 * Extension to icon, in both the sizes the samples need.
 *
 * The portal has a service for this (`getIcon(size, fileExst)`), which the
 * kit's own components accept as a prop. The samples run without a portal, so
 * they keep the same shape -- one lookup, two sizes -- locally. The icons
 * themselves ship inside the package under `assets/icons/`.
 */
const icons: Record<string, { small: IconComponent; large: IconComponent }> = {
  ".docx": { small: Word32Svg, large: Word96Svg },
  ".xlsx": { small: Cell32Svg, large: Cell96Svg },
  ".pptx": { small: Slide32Svg, large: Slide96Svg },
  ".pdf": { small: Pdf32Svg, large: Pdf96Svg },
  ".png": { small: Image32Svg, large: Image96Svg },
  folder: { small: Folder32Svg, large: Folder96Svg },
};

const fallback = { small: File32Svg, large: File96Svg };

export const FileIcon = ({
  fileExst,
  size = 32,
}: {
  /** Extension with the dot, or `"folder"`. */
  fileExst: string;
  size?: 32 | 96;
}) => {
  const Icon = (icons[fileExst] ?? fallback)[size === 96 ? "large" : "small"];

  return <Icon width={size} height={size} />;
};
