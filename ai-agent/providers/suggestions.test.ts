// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import { describe, expect, it } from "vitest";

import { resolveSuggestions, type SuggestionSet } from "./suggestions";

const chip = (name: string) => ({ name, prompt: `${name} prompt` });

const SET: SuggestionSet = {
  default: [chip("section")],
  singleFile: [chip("single")],
  multipleFiles: [chip("multiple")],
  analyzableForm: [chip("form")],
};

const QUESTIONS = {
  "att-1": [{ question: "Per payment method?", prompt: "Count per value." }],
};

describe("resolveSuggestions", () => {
  it("shows the section chips with an empty composer", () => {
    expect(resolveSuggestions(SET, [], [], {})).toEqual(SET.default);
  });

  it("switches on how many files are attached", () => {
    expect(resolveSuggestions(SET, ["a"], [], {})).toEqual(SET.singleFile);
    expect(resolveSuggestions(SET, ["a", "b"], [], {})).toEqual(
      SET.multipleFiles,
    );
  });

  it("prefers the analyzable-form chips over the file lists", () => {
    // Two files attached, one of them an analyzable form: the form wins.
    expect(resolveSuggestions(SET, ["a", "att-1"], ["att-1"], {})).toEqual(
      SET.analyzableForm,
    );
  });

  it("prefers the form's own generated questions over every static list", () => {
    expect(
      resolveSuggestions(SET, ["a", "att-1"], ["att-1"], QUESTIONS),
    ).toEqual([
      { name: "Per payment method?", prompt: "Count per value." },
    ]);
  });

  it("ignores questions of an attachment that is no longer attached", () => {
    // The user removed the form's chip: its questions must not outlive it.
    expect(resolveSuggestions(SET, ["a"], ["att-1"], QUESTIONS)).toEqual(
      SET.singleFile,
    );
  });

  it("ignores an analyzable id that has no questions yet", () => {
    expect(resolveSuggestions(SET, ["att-2"], ["att-2"], QUESTIONS)).toEqual(
      SET.analyzableForm,
    );
    expect(
      resolveSuggestions(SET, ["att-2"], ["att-2"], { "att-2": [] }),
    ).toEqual(SET.analyzableForm);
  });

  it("falls back to the section chips when a list is not provided", () => {
    const sparse: SuggestionSet = { default: [chip("section")] };
    expect(resolveSuggestions(sparse, ["a"], [], {})).toEqual(sparse.default);
    expect(resolveSuggestions(sparse, ["a", "b"], [], {})).toEqual(
      sparse.default,
    );
    expect(resolveSuggestions(sparse, ["a"], ["a"], {})).toEqual(
      sparse.default,
    );
  });

  it("passes a bare array and an absent value through untouched", () => {
    const bare = [chip("fixed")];
    expect(resolveSuggestions(bare, ["a"], ["a"], QUESTIONS)).toBe(bare);
    expect(resolveSuggestions(undefined, [], [], {})).toBeUndefined();
  });
});
