import { useState } from "react";

import { Button, ButtonSize } from "../../../components/button";
import { Checkbox } from "../../../components/checkbox";
import {
  ComboBox,
  ComboBoxSize,
  type TOption,
} from "../../../components/combobox";
import { EmailInput } from "../../../components/email-input";
import { FieldContainer } from "../../../components/field-container";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../components/heading";
import { ModalDialog, ModalDialogType } from "../../../components/modal-dialog";
import { Text } from "../../../components/text";
import { InputSize } from "../../../components/text-input";
import { Toast, toastr } from "../../../components/toast";
import { sampleFiles } from "../sample-data";

const accessOptions: TOption[] = [
  { key: "viewer", label: "Viewer" },
  { key: "editor", label: "Editor" },
  { key: "admin", label: "Room admin" },
];

const selection = sampleFiles.slice(0, 3);

/**
 * Two dialogs, one screen. `ModalDialog` is the same component both times --
 * `displayType` decides whether it arrives as a centred modal or slides in
 * from the side, and `displayTypeDetailed` can make that answer depend on the
 * viewport.
 *
 * Both dialogs here are destructive-or-consequential, so both follow the same
 * two rules: the confirming button repeats the verb ("Delete", not "OK"), and
 * the dialog reports the outcome after it closes rather than trusting the user
 * to notice.
 */
export const Dialogs = () => {
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [isInviteVisible, setIsInviteVisible] = useState(false);

  const [deletePermanently, setDeletePermanently] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteAccess, setInviteAccess] = useState(accessOptions[1]);
  const [inviteError, setInviteError] = useState("");

  const onDelete = () => {
    setIsDeleting(true);

    window.setTimeout(() => {
      setIsDeleting(false);
      setIsDeleteVisible(false);

      toastr.success(
        deletePermanently
          ? `${selection.length} files deleted permanently`
          : `${selection.length} files moved to Trash`,
      );

      setDeletePermanently(false);
    }, 800);
  };

  const onInvite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inviteEmail) {
      setInviteError("Enter an email address to invite");
      return;
    }

    setIsInviteVisible(false);
    toastr.success(
      `${inviteEmail} invited as ${String(inviteAccess.label).toLowerCase()}`,
    );
    setInviteEmail("");
    setInviteError("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Toast />

      <div>
        <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
          Finance department
        </Heading>
        <Text fontSize="13px" lineHeight="20px" style={{ marginTop: "4px" }}>
          {selection.length} files selected • 8 members
        </Text>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <Button
          primary
          label="Invite people"
          size={ButtonSize.normal}
          onClick={() => setIsInviteVisible(true)}
        />
        <Button
          label={`Delete ${selection.length} files`}
          size={ButtonSize.normal}
          onClick={() => setIsDeleteVisible(true)}
        />
      </div>

      {/* A centred modal: short, blocking, one decision. */}
      <ModalDialog
        visible={isDeleteVisible}
        displayType={ModalDialogType.modal}
        onClose={() => setIsDeleteVisible(false)}
      >
        <ModalDialog.Header>Delete files</ModalDialog.Header>
        <ModalDialog.Body>
          <Text fontSize="13px" lineHeight="20px">
            These files will be moved to Trash and kept for 30 days:
          </Text>
          <ul style={{ margin: "12px 0", paddingInlineStart: "20px" }}>
            {selection.map((file) => (
              <li key={file.id}>
                <Text as="span" fontSize="13px">
                  {file.title}
                </Text>
              </li>
            ))}
          </ul>
          <Checkbox
            label="Delete permanently, skip the Trash"
            isChecked={deletePermanently}
            onChange={(e) => setDeletePermanently(e.target.checked)}
          />
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            primary
            scale
            label={deletePermanently ? "Delete permanently" : "Move to Trash"}
            size={ButtonSize.normal}
            isLoading={isDeleting}
            onClick={onDelete}
          />
          <Button
            scale
            label="Cancel"
            size={ButtonSize.normal}
            isDisabled={isDeleting}
            onClick={() => setIsDeleteVisible(false)}
          />
        </ModalDialog.Footer>
      </ModalDialog>

      {/* The same component as an aside: a form with room to breathe. */}
      <ModalDialog
        visible={isInviteVisible}
        displayType={ModalDialogType.aside}
        withBodyScroll
        withForm
        onSubmit={onInvite}
        onClose={() => setIsInviteVisible(false)}
      >
        <ModalDialog.Header>Invite people</ModalDialog.Header>
        <ModalDialog.Body>
          <Text
            fontSize="13px"
            lineHeight="20px"
            style={{ marginBottom: "16px" }}
          >
            They will get an email with a link to the Finance department room.
          </Text>

          <FieldContainer
            isVertical
            labelVisible
            isRequired
            labelText="Email"
            hasError={Boolean(inviteError)}
            errorMessage={inviteError}
          >
            <EmailInput
              scale
              size={InputSize.base}
              value={inviteEmail}
              placeholder="name@example.com"
              hasError={Boolean(inviteError)}
              onChange={(e) => {
                setInviteEmail(e.target.value);
                setInviteError("");
              }}
            />
          </FieldContainer>

          <FieldContainer isVertical labelVisible labelText="Access">
            <ComboBox
              scaled
              size={ComboBoxSize.content}
              options={accessOptions}
              selectedOption={inviteAccess}
              onSelect={(option) => setInviteAccess(option)}
            />
          </FieldContainer>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <Button
            primary
            scale
            type="submit"
            label="Send invitation"
            size={ButtonSize.normal}
          />
          <Button
            scale
            label="Cancel"
            size={ButtonSize.normal}
            onClick={() => setIsInviteVisible(false)}
          />
        </ModalDialog.Footer>
      </ModalDialog>
    </div>
  );
};
