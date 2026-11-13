import { TPasswordSettings } from "../PasswordInput.types";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = LOWERCASE.toUpperCase();
const DIGITS = "0123456789";

const DEFAULT_LENGTH = 8;
const UINT32_RANGE = 0x100000000;

/**
 * A uniform integer in `[0, max)` from the platform's cryptographic generator.
 * A generated password guards an account or an encryption key, so it never
 * comes from `Math.random`, and there is no fallback to it: without
 * `crypto.getRandomValues` the call throws.
 */
export const secureRandomInt = (max: number): number => {
  if (!Number.isInteger(max) || max <= 0 || max > UINT32_RANGE) {
    throw new RangeError("secureRandomInt: max must be an integer in 1..2^32");
  }

  // Values at and above the limit are drawn again: taking them modulo `max`
  // would make the low results more likely than the high ones.
  const limit = UINT32_RANGE - (UINT32_RANGE % max);
  const buffer = new Uint32Array(1);

  do {
    globalThis.crypto.getRandomValues(buffer);
  } while (buffer[0] >= limit);

  return buffer[0] % max;
};

const pick = (charset: string): string =>
  charset.charAt(secureRandomInt(charset.length));

/**
 * A password of `settings.minLength` characters (8 without settings) that
 * meets the rules of `settings`: one capital, one digit and one of `special`
 * where the rule asks for it, the rest drawn evenly from every allowed
 * character, in a random order.
 */
export const generatePassword = (
  settings: TPasswordSettings | undefined,
  special: string,
): string => {
  const length = settings?.minLength || DEFAULT_LENGTH;
  const withSpecial = !!settings?.specSymbols && special.length > 0;

  const required: string[] = [];
  let alphabet = LOWERCASE;

  if (settings?.upperCase) {
    required.push(UPPERCASE);
    alphabet += UPPERCASE;
  }
  if (settings?.digits) {
    required.push(DIGITS);
    alphabet += DIGITS;
  }
  if (withSpecial) {
    required.push(special);
    alphabet += special;
  }

  const chars = required.slice(0, length).map(pick);
  while (chars.length < length) chars.push(pick(alphabet));

  // Fisher-Yates: every order is equally likely, so the required characters
  // do not stay at the front.
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = secureRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
};
