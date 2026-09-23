import { useState } from "react";

import { Button, ButtonSize } from "../../../components/button";
import { ColorInput } from "../../../components/color-input";
import {
  ComboBox,
  ComboBoxSize,
  type TOption,
} from "../../../components/combobox";
import { FieldContainer } from "../../../components/field-container";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../components/heading";
import { HelpButton } from "../../../components/help-button";
import { RadioButtonGroup } from "../../../components/radio-button-group";
import { Slider } from "../../../components/slider";
import { Text } from "../../../components/text";
import { InputSize } from "../../../components/text-input";
import { Toast, toastr } from "../../../components/toast";
import { ToggleButton } from "../../../components/toggle-button";
import { globalColors } from "../../../providers/theme";

type RoomSettingsState = {
  fileLifetimeEnabled: boolean;
  watermarkEnabled: boolean;
  defaultAccess: string;
  lifetimePeriod: string;
  quotaGb: number;
  accentColor: string;
};

const lifetimeOptions: TOption[] = [
  { key: "30", label: "30 days" },
  { key: "60", label: "60 days" },
  { key: "90", label: "90 days" },
  { key: "365", label: "1 year" },
];

const accessOptions = [
  { value: "viewer", label: "Viewer" },
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Room admin" },
];

const initialState: RoomSettingsState = {
  fileLifetimeEnabled: true,
  watermarkEnabled: false,
  defaultAccess: "editor",
  lifetimePeriod: "90",
  quotaGb: 20,
  // The palette the kit itself ships, rather than a hex typed in by hand.
  accentColor: globalColors.lightBlueMain,
};

const sectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  maxWidth: "440px",
};

/**
 * The settings screen every product grows: a handful of controls and a footer
 * that only wakes up once something has actually changed.
 *
 * All six controls are uncontrolled-looking but fully controlled -- each one
 * takes its value and its handler, which is what makes the dirty check a
 * one-line comparison against the state the screen opened with. The footer is
 * the interesting part: "Save" stays disabled until it has something to save,
 * and that is a property of the state, not of six separate onChange handlers.
 */
export const RoomSettings = () => {
  const [settings, setSettings] = useState(initialState);
  const [savedState, setSavedState] = useState(initialState);

  const isDirty = JSON.stringify(settings) !== JSON.stringify(savedState);

  const update = <K extends keyof RoomSettingsState>(
    key: K,
    value: RoomSettingsState[K],
  ) => setSettings((current) => ({ ...current, [key]: value }));

  const selectedLifetime =
    lifetimeOptions.find((option) => option.key === settings.lifetimePeriod) ??
    lifetimeOptions[0];

  const onSave = () => {
    setSavedState(settings);
    toastr.success("Finance department • settings updated");
  };

  return (
    <div style={sectionStyle}>
      <Toast />

      <div>
        <Heading level={HeadingLevel.h2} size={HeadingSize.medium}>
          Room settings
        </Heading>
        <Text fontSize="13px" lineHeight="20px" style={{ marginTop: "4px" }}>
          Finance department • collaboration room • 8 members
        </Text>
      </div>

      <ToggleButton
        label="Delete files automatically"
        isChecked={settings.fileLifetimeEnabled}
        onChange={(e) => update("fileLifetimeEnabled", e.target.checked)}
      />

      {settings.fileLifetimeEnabled ? (
        <FieldContainer
          isVertical
          labelVisible
          removeMargin
          labelText="Keep files for"
          inlineHelpButton
          tooltipContent={
            <div>
              Files older than this move to Trash. Members are warned a week
              before it happens.
            </div>
          }
        >
          <ComboBox
            scaled
            size={ComboBoxSize.content}
            options={lifetimeOptions}
            selectedOption={selectedLifetime}
            onSelect={(option) => update("lifetimePeriod", String(option.key))}
          />
        </FieldContainer>
      ) : null}

      <FieldContainer
        isVertical
        labelVisible
        removeMargin
        labelText="Access for new members"
      >
        <RadioButtonGroup
          name="default-access"
          orientation="vertical"
          spacing="12px"
          options={accessOptions}
          selected={settings.defaultAccess}
          onClick={(e) => update("defaultAccess", e.target.value)}
        />
      </FieldContainer>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Text fontSize="13px" isBold>
            Storage per member • {settings.quotaGb} GB
          </Text>
          <HelpButton
            place="right"
            tooltipContent={
              <div>
                Uploads stop at the limit; nothing already in the room is
                removed.
              </div>
            }
          />
        </div>
        <Slider
          min={5}
          max={100}
          step={5}
          withPouring
          value={settings.quotaGb}
          onChange={(e) => update("quotaGb", Number(e.target.value))}
        />
      </div>

      <FieldContainer
        isVertical
        labelVisible
        removeMargin
        labelText="Room colour"
      >
        <ColorInput
          size={InputSize.base}
          defaultColor={settings.accentColor}
          handleChange={(color) => update("accentColor", color)}
        />
      </FieldContainer>

      <ToggleButton
        label="Watermark every document"
        isChecked={settings.watermarkEnabled}
        onChange={(e) => update("watermarkEnabled", e.target.checked)}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingTop: "4px",
        }}
      >
        <Button
          primary
          label="Save"
          size={ButtonSize.normal}
          isDisabled={!isDirty}
          onClick={onSave}
        />
        <Button
          label="Cancel"
          size={ButtonSize.normal}
          isDisabled={!isDirty}
          onClick={() => setSettings(savedState)}
        />
        <Text fontSize="12px" style={{ marginInlineStart: "4px" }}>
          {isDirty ? "Unsaved changes" : "Everything is up to date"}
        </Text>
      </div>
    </div>
  );
};
