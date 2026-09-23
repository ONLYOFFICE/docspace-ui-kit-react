import { useState } from "react";

import CopyReactSvg from "../../../assets/icons/16/copy.react.svg";
import { Button, ButtonSize } from "../../../components/button";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../components/heading";
import { Link, LinkType } from "../../../components/link";
import { Text } from "../../../components/text";
import { Toast, toastr } from "../../../components/toast";

const actions: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "8px",
};

/**
 * Twenty lines of product: a document that can be saved, shared and thrown
 * away -- and that says so afterwards.
 *
 * The bit worth stealing is the last toast. `toastr` takes a React node, not
 * just a string, so "Moved to Trash • Undo" is one call and the undo link is a
 * real component. That is the difference between a notification and an
 * apology.
 */
export const ButtonsAndToasts = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isInTrash, setIsInTrash] = useState(false);

  const onSave = () => {
    setIsSaving(true);

    window.setTimeout(() => {
      setIsSaving(false);
      toastr.success("Annual report 2025.docx • all changes saved");
    }, 1200);
  };

  const onShare = () => {
    toastr.info("Link copied. Anyone in Finance can now open the report.");
  };

  const onTrash = () => {
    setIsInTrash(true);

    toastr.success(
      <span>
        Moved to Trash •{" "}
        <Link
          type={LinkType.action}
          isHovered
          isBold
          role="button"
          tabIndex={0}
          onClick={() => {
            setIsInTrash(false);
            toastr.clear();
            toastr.info("Annual report 2025.docx is back in Documents");
          }}
        >
          Undo
        </Link>
      </span>,
      null,
      8000,
      true,
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "640px",
      }}
    >
      <Toast />

      <div>
        <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
          Annual report 2025.docx
        </Heading>
        <Text fontSize="13px" lineHeight="20px" style={{ marginTop: "4px" }}>
          {isInTrash
            ? "In Trash — deleted items are kept for 30 days."
            : "Edited by Anna Petrova • 18 Sep 2026 • 2.4 MB"}
        </Text>
      </div>

      <div style={actions}>
        <Button
          primary
          label={isSaving ? "Saving..." : "Save"}
          size={ButtonSize.normal}
          isLoading={isSaving}
          isDisabled={isInTrash}
          onClick={onSave}
        />
        <Button
          label="Copy link"
          size={ButtonSize.normal}
          icon={<CopyReactSvg />}
          isDisabled={isInTrash}
          onClick={onShare}
        />
        <Button
          label={isInTrash ? "In Trash" : "Move to Trash"}
          size={ButtonSize.normal}
          isDisabled={isInTrash}
          onClick={onTrash}
        />
      </div>

      <Text fontSize="12px" lineHeight="16px">
        Try the Save button twice: the loader, the disabled state and the
        keyboard focus ring all come with the component. Nothing below sets a
        colour — the accent is the portal&apos;s, so the same screen follows a
        rebranded portal and the dark theme for free.
      </Text>

      <div>
        <Text fontSize="13px" isBold style={{ marginBottom: "8px" }}>
          The other three tones
        </Text>
        <div style={actions}>
          <Button
            label="Almost full"
            size={ButtonSize.small}
            onClick={() =>
              toastr.warning("Finance department is at 92% of its quota")
            }
          />
          <Button
            label="Upload failed"
            size={ButtonSize.small}
            onClick={() =>
              // Timeout 0 keeps it on screen until dismissed, and the last
              // argument adds the close button: an error the user must read.
              toastr.error(
                "Q4 budget.xlsx — the network dropped",
                null,
                0,
                true,
              )
            }
          />
          <Button
            label="Dismiss all"
            size={ButtonSize.small}
            onClick={() => toastr.clear()}
          />
        </div>
      </div>
    </div>
  );
};
