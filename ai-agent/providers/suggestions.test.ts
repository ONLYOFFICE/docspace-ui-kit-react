import { describe, expect, it } from "vitest";

import { resolveSuggestions, type SuggestionSet } from "./suggestions";

const chip = (name: string) => ({ name, prompt: `${name} prompt` });

const SET: SuggestionSet = {
  default: [chip("section")],
  singleFile: [chip("single")],
  multipleFiles: [chip("multiple")],
  analyzableForm: [chip("form")],
};

describe("resolveSuggestions", () => {
  it("shows the section chips with an empty composer", () => {
    expect(resolveSuggestions(SET, [], [])).toEqual(SET.default);
  });

  it("switches on how many files are attached", () => {
    expect(resolveSuggestions(SET, ["a"], [])).toEqual(SET.singleFile);
    expect(resolveSuggestions(SET, ["a", "b"], [])).toEqual(SET.multipleFiles);
  });

  it("prefers the analyzable-form chips over the file lists", () => {
    // Two files attached, one of them an analyzable form: the form wins.
    expect(resolveSuggestions(SET, ["a", "att-1"], ["att-1"])).toEqual(
      SET.analyzableForm,
    );
  });

  // The form's own generated questions belong to the analyze mode: they are
  // asked for per attachment and waited for on the socket, so an ordinary
  // chat with a form attached keeps the host's static list.
  it("keeps the static form chips for an analyzable form outside the mode", () => {
    expect(resolveSuggestions(SET, ["att-1"], ["att-1"])).toEqual(
      SET.analyzableForm,
    );
  });

  it("ignores an analyzable id that is no longer attached", () => {
    expect(resolveSuggestions(SET, ["a"], ["att-1"])).toEqual(SET.singleFile);
  });

  it("falls back to the section chips when a list is not provided", () => {
    const sparse: SuggestionSet = { default: [chip("section")] };
    expect(resolveSuggestions(sparse, ["a"], [])).toEqual(sparse.default);
    expect(resolveSuggestions(sparse, ["a", "b"], [])).toEqual(sparse.default);
    expect(resolveSuggestions(sparse, ["a"], ["a"])).toEqual(sparse.default);
  });

  it("passes a bare array and an absent value through untouched", () => {
    const bare = [chip("fixed")];
    expect(resolveSuggestions(bare, ["a"], ["a"])).toBe(bare);
    expect(resolveSuggestions(undefined, [], [])).toBeUndefined();
  });
});

// "Analyze responses" makes the message about one form's answers: the chips
// are that form's generated questions, or nothing at all — the static list
// asks about the document, which is not what the user chose.
describe("resolveSuggestions in analyze mode", () => {
  const analyzeQuestions = [
    { question: "Per payment method?", prompt: "Count per value." },
  ];

  it("shows the generated questions instead of any static list", () => {
    expect(
      resolveSuggestions(SET, ["att-1"], ["att-1"], {
        active: true,
        questions: analyzeQuestions,
      }),
    ).toEqual([{ name: "Per payment method?", prompt: "Count per value." }]);
  });

  it("shows nothing while the questions are still being generated", () => {
    expect(
      resolveSuggestions(SET, ["att-1"], ["att-1"], {
        active: true,
        questions: null,
      }),
    ).toEqual([]);
  });

  it("falls back to the ordinary rules once the mode is gone", () => {
    expect(
      resolveSuggestions(SET, ["att-1"], ["att-1"], {
        active: false,
        questions: null,
      }),
    ).toEqual(SET.analyzableForm);
  });
});
