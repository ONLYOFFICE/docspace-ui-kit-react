/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";

import {
  ModalDialog,
  ModalDialogType,
} from "../../../../../../components/modal-dialog";
import {
  InputSize,
  InputType,
  TextInput,
} from "../../../../../../components/text-input";
import { Button, ButtonSize } from "../../../../../../components/button";

import { useChatStore } from "../../../../store/chatStore";

import { RenameChatProps } from "../../../../Chat.types";
import { useCommonTranslation } from "../../../../../../utils/i18n";
import { toastr } from "../../../../../../components/toast";

const RenameChat = ({ chatId, prevTitle, onRenameToggle }: RenameChatProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const { renameChat } = useChatStore();
  const t = useCommonTranslation();

  const [newName, setNewName] = React.useState("");

  const handleRename = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewName(e.target.value);
    },
    [],
  );

  const onRenameClose = React.useCallback(() => {
    if (isLoading) return;
    onRenameToggle();
  }, [onRenameToggle, isLoading]);

  const onRenameAction = React.useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await renameChat(chatId, newName);
      onRenameToggle();
    } catch (error) {
      console.error(error);
      toastr.error(error as string);
    } finally {
      setIsLoading(false);
    }
  }, [chatId, newName, onRenameToggle, renameChat, isLoading]);

  React.useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onRenameAction();
      }
      if (e.key === "Escape") {
        onRenameClose();
      }
    };

    window.addEventListener("keydown", onKeydown);

    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, [onRenameAction, onRenameClose]);

  return (
    <ModalDialog
      visible
      onClose={onRenameClose}
      displayType={ModalDialogType.modal}
    >
      <ModalDialog.Header>{t("Rename")}</ModalDialog.Header>
      <ModalDialog.Body>
        <TextInput
          value={newName}
          onChange={handleRename}
          size={InputSize.base}
          type={InputType.text}
          maxLength={255}
          placeholder={prevTitle}
          scale
          autoFocus
        />
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          size={ButtonSize.normal}
          label={t("SaveButton")}
          onClick={onRenameAction}
          scale
          primary
          isLoading={isLoading}
          isDisabled={!newName || prevTitle === newName}
          testId="confirm-button"
        />
        <Button
          size={ButtonSize.normal}
          label={t("CancelButton")}
          onClick={onRenameToggle}
          scale
          isDisabled={isLoading}
          testId="cancel-button"
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default RenameChat;
