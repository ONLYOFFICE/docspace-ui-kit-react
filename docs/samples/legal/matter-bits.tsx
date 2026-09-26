import { RoomIcon } from "../../../components/room-icon";
import { Text } from "../../../components/text";
import type { Matter } from "./matter";
import { usePortalImage } from "./usePortalImage";
import styles from "./legal.module.scss";

/**
 * The small pieces every screen that shows a matter shares: its picture, its
 * stage, and the line that says who the portal thinks is reading.
 */
export const plural = (count: number, one: string, many = `${one}s`) =>
  `${count} ${count === 1 ? one : many}`;

export const MatterLogo = ({
  matter,
  size = "32px",
}: {
  matter: Matter;
  size?: "32px" | "48px";
}) => {
  const { logo } = matter;
  // A cover the portal drew is inline SVG data, and `RoomIcon` recolours it.
  // An uploaded picture is a protected path on the portal: fetch it signed.
  const cover = logo?.cover?.data
    ? { data: logo.cover.data, id: logo.cover.id ?? "" }
    : undefined;
  const picture = usePortalImage(cover ? "" : logo?.medium);
  const color = logo?.color || "555F6B";

  return (
    <RoomIcon
      title={matter.title}
      color={color}
      logo={
        cover
          ? { cover, color, original: "", large: "", medium: "", small: "" }
          : picture || undefined
      }
      size={size}
      // Without a logo it would draw an empty <img>, not the initials.
      showDefault={!cover && !picture}
    />
  );
};

export const StageBadge = ({ matter }: { matter: Matter }) => (
  <Text
    as="span"
    className={`${styles.badge} ${matter.stageKnown && !matter.isClosed ? styles.badgeStage : ""}`}
  >
    {matter.stage}
  </Text>
);

export const Who = ({ name, label }: { name: string; label: string }) => (
  <div className={styles.statusRow}>
    <Text as="span" className={styles.badge}>
      {label}
    </Text>
    <Text fontSize="13px">{name}</Text>
  </div>
);
