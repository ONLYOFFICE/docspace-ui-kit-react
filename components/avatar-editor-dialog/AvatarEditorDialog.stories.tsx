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

import type { ComponentProps } from "react";
import React, { useCallback, useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type { TImage } from "../image-editor/ImageEditor.types";
import type { TTranslation } from "../../utils";
import { Button, ButtonSize } from "../button";

import { AvatarEditorDialog } from ".";

// The dialog takes its translator as a prop rather than using the hook, so the
// stories supply a stub that echoes the key -- enough to show which label is
// which without wiring i18n into Storybook.
const t = ((key: string) => key.replace("Common:", "")) as TTranslation;

const meta = {
  title: "UI/Overlays/AvatarEditorDialog",
  component: AvatarEditorDialog,
  parameters: {
    docs: {
      description: {
        component: `Modal wrapper around the image editor for choosing and cropping an avatar.

### Features

- **Crop and zoom**: hosts \`ImageEditor\`, keeping zoom and offset in the \`image\` value
- **Circular or square crop**: \`editorBorderRadius\` selects the mask
- **Size limit**: \`maxImageSize\` rejects oversized uploads
- **Loading state**: \`isLoading\` disables the save action while the upload is in flight

### Usage

Controlled: the caller owns \`visible\` and the \`image\` value, and receives the cropped result through \`onSave\`. The stories below own that state and expose a button to reopen the dialog after it closes.`,
      },
    },
  },
  argTypes: {
    visible: { control: "boolean", description: "Whether the dialog is open" },
    title: { control: "text", description: "Dialog heading" },
    isLoading: {
      control: "boolean",
      description: "Disables saving while busy",
    },
    editorBorderRadius: {
      control: "number",
      description: "Crop mask radius; 110 gives a circle at the default size",
    },
  },
} satisfies Meta<typeof AvatarEditorDialog>;

type Story = StoryObj<ComponentProps<typeof AvatarEditorDialog>>;

export default meta;

type DemoProps = Pick<
  ComponentProps<typeof AvatarEditorDialog>,
  "visible" | "title" | "isLoading" | "editorBorderRadius" | "maxImageSize"
>;

const AvatarEditorDialogDemo = ({ visible, ...rest }: DemoProps) => {
  const [isVisible, setIsVisible] = useState(!!visible);
  const [image, setImage] = useState<TImage>({ zoom: 1, x: 0.5, y: 0.5 });

  useEffect(() => {
    setIsVisible(!!visible);
  }, [visible]);

  const onChangeImage = useCallback((next: TImage) => setImage(next), []);

  const onChangeFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage((prev) => ({ ...prev, uploadedFile: file }));
  }, []);

  return (
    <>
      <Button
        label="Open dialog"
        size={ButtonSize.small}
        onClick={() => setIsVisible(true)}
      />
      <AvatarEditorDialog
        {...rest}
        t={t}
        visible={isVisible}
        image={image}
        onClose={() => setIsVisible(false)}
        onSave={() => setIsVisible(false)}
        onChangeImage={onChangeImage}
        onChangeFile={onChangeFile}
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => <AvatarEditorDialogDemo {...args} />,
  args: {
    visible: true,
    title: "Change avatar",
    editorBorderRadius: 110,
  },
};

export const Loading: Story = {
  render: (args) => <AvatarEditorDialogDemo {...args} />,
  args: {
    ...Default.args,
    isLoading: true,
  },
};

export const SquareCrop: Story = {
  render: (args) => <AvatarEditorDialogDemo {...args} />,
  args: {
    ...Default.args,
    title: "Change cover",
    editorBorderRadius: 0,
  },
};
