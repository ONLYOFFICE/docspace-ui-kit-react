import { type FormEvent, useMemo, useState } from "react";

import { Button, ButtonSize } from "../../../../components/button";
import { Checkbox } from "../../../../components/checkbox";
import {
  ComboBox,
  ComboBoxSize,
  type TOption,
} from "../../../../components/combobox";
import { EmailInput } from "../../../../components/email-input";
import { FieldContainer } from "../../../../components/field-container";
import {
  ModalDialog,
  ModalDialogType,
} from "../../../../components/modal-dialog";
import { Text } from "../../../../components/text";
import {
  InputSize,
  InputType,
  TextInput,
} from "../../../../components/text-input";
import { useApi } from "../../../../providers/api";
import { demoSeedClient } from "../demo-portal";
import { type KnownStage, STAGES } from "../matter";
import {
  type MatterSpec,
  type OpenStep,
  openMatter,
  PRACTICES,
  REQUEST_TEMPLATES,
  validate,
} from "../openMatter";
import { sdkSeedClient } from "../seed";
import styles from "../legal.module.scss";

/**
 * The lawyer's form for a new matter: a name, a practice, a stage, the
 * client's email and the checklist to start with. Submitting it is four
 * writes to the portal in a row, each reported as it lands, so a refusal
 * halfway says which step and leaves what was made where the lawyer can
 * see it.
 *
 * `ModalDialog` as an aside with `withForm`: Enter submits, the footer's
 * primary button is the form's submit, and the body scrolls on a phone.
 */
const option = (value: string): TOption => ({ key: value, label: value });

export const OpenMatterDialog = ({
  visible,
  onClose,
  onOpened,
}: {
  visible: boolean;
  onClose: () => void;
  /** Called with the new room's id once every step has landed. */
  onOpened: (roomId: number) => void;
}) => {
  const api = useApi();
  // The same words the demo-data page speaks to a portal, or to the demo.
  const writer = useMemo(
    () => (api.baseUrl ? sdkSeedClient(api) : demoSeedClient()),
    [api],
  );

  const [title, setTitle] = useState("");
  const [practice, setPractice] = useState<string>(PRACTICES[0]);
  const [stage, setStage] = useState<KnownStage>("Intake");
  const [email, setEmail] = useState("");
  const [requests, setRequests] = useState<string[]>(
    REQUEST_TEMPLATES.slice(0, 3),
  );
  const [extra, setExtra] = useState("");
  const [error, setError] = useState("");
  const [steps, setSteps] = useState<OpenStep[]>([]);
  const [busy, setBusy] = useState(false);

  const toggle = (request: string) =>
    setRequests((current) =>
      current.includes(request)
        ? current.filter((item) => item !== request)
        : [...current, request],
    );

  const addExtra = () => {
    const value = extra.trim();
    if (value && !requests.includes(value)) {
      setRequests((current) => [...current, value]);
    }
    setExtra("");
  };

  const reset = () => {
    setTitle("");
    setPractice(PRACTICES[0]);
    setStage("Intake");
    setEmail("");
    setRequests(REQUEST_TEMPLATES.slice(0, 3));
    setExtra("");
    setError("");
    setSteps([]);
  };

  const close = () => {
    if (busy) return;
    reset();
    onClose();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const spec: MatterSpec = {
      title,
      practice,
      stage,
      requests,
      clientEmail: email,
    };
    const problem = validate(spec);
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setSteps([]);
    setBusy(true);
    try {
      const { roomId } = await openMatter(writer, spec, (step) =>
        setSteps((current) => [...current, step]),
      );
      reset();
      onOpened(roomId);
    } catch {
      // The failed step is already in the log.
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalDialog
      visible={visible}
      displayType={ModalDialogType.aside}
      withBodyScroll
      withForm
      onSubmit={submit}
      onClose={close}
      isCloseable={!busy}
    >
      <ModalDialog.Header>New matter</ModalDialog.Header>
      <ModalDialog.Body>
        <Text as="p" fontSize="13px" lineHeight="20px" className={styles.hint}>
          A room on the portal, tagged with the practice and the stage, with the
          checklist folders ready and the client added to it.
        </Text>

        <FieldContainer
          isVertical
          labelVisible
          isRequired
          labelText="Matter"
          hasError={Boolean(error) && !title.trim()}
        >
          <TextInput
            type={InputType.text}
            size={InputSize.base}
            scale
            value={title}
            placeholder="Nguyen v. Harbor Freight"
            isAutoFocussed
            isDisabled={busy}
            onChange={(event) => setTitle(event.target.value)}
          />
        </FieldContainer>

        <div className={styles.columns2}>
          <FieldContainer isVertical labelVisible labelText="Practice">
            <ComboBox
              scaled
              size={ComboBoxSize.content}
              options={PRACTICES.map(option)}
              selectedOption={option(practice)}
              onSelect={(picked) => setPractice(String(picked.key))}
              isDisabled={busy}
            />
          </FieldContainer>
          <FieldContainer isVertical labelVisible labelText="Stage">
            <ComboBox
              scaled
              size={ComboBoxSize.content}
              options={STAGES.map(option)}
              selectedOption={option(stage)}
              onSelect={(picked) => setStage(picked.key as KnownStage)}
              isDisabled={busy}
            />
          </FieldContainer>
        </div>

        <FieldContainer
          isVertical
          labelVisible
          labelText="Client's email"
          hasError={Boolean(error) && error.includes("email")}
          errorMessage={error.includes("email") ? error : undefined}
        >
          <EmailInput
            scale
            size={InputSize.base}
            value={email}
            placeholder="Optional. They are added to the room and can sign in."
            isDisabled={busy}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FieldContainer>

        <FieldContainer isVertical labelVisible labelText="Ask the client for">
          <div className={styles.checkGrid}>
            {REQUEST_TEMPLATES.map((request) => (
              <Checkbox
                key={request}
                label={request}
                isChecked={requests.includes(request)}
                isDisabled={busy}
                onChange={() => toggle(request)}
              />
            ))}
            {requests
              .filter(
                (request) =>
                  !(REQUEST_TEMPLATES as readonly string[]).includes(request),
              )
              .map((request) => (
                <Checkbox
                  key={request}
                  label={request}
                  isChecked
                  isDisabled={busy}
                  onChange={() => toggle(request)}
                />
              ))}
          </div>
          <div className={styles.askRow}>
            <TextInput
              type={InputType.text}
              size={InputSize.base}
              scale
              value={extra}
              placeholder="Something else, e.g. Medical records"
              isDisabled={busy}
              onChange={(event) => setExtra(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addExtra();
                }
              }}
            />
            <Button
              size={ButtonSize.small}
              label="Add"
              isDisabled={busy || !extra.trim()}
              onClick={addExtra}
            />
          </div>
        </FieldContainer>

        {error && !error.includes("email") ? (
          <div role="alert">
            <Text as="p" fontSize="13px" lineHeight="20px">
              {error}
            </Text>
          </div>
        ) : null}

        {steps.length ? (
          <ul className={styles.stepList}>
            {steps.map((step) => (
              <li key={step.label} className={styles.statusRow}>
                <Text
                  as="span"
                  className={`${styles.badge} ${step.status === "done" ? styles.badgeOk : styles.badgeError}`}
                >
                  {step.status === "done" ? step.label : `${step.label} failed`}
                </Text>
                <Text fontSize="13px">{step.detail}</Text>
              </li>
            ))}
          </ul>
        ) : null}
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          primary
          scale
          type="submit"
          size={ButtonSize.normal}
          label={busy ? "Opening..." : "Open the matter"}
          isLoading={busy}
        />
        <Button
          scale
          size={ButtonSize.normal}
          label="Cancel"
          isDisabled={busy}
          onClick={close}
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};
