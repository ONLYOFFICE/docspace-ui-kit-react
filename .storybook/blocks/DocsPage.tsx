import React from "react";
import {
  Controls,
  Description,
  Primary,
  Stories,
  Title,
} from "@storybook/addon-docs/blocks";

import { ReadmeIntro, ReadmeReference, useHasReadme } from "./Readme";

// The autodocs template. Storybook's own is Title, Description, Primary,
// Controls, Stories; here the README replaces the story's description and
// its reference half closes the page, so a component with a README is
// described once, in the file the package ships. A story file without one
// (selectors, errors, the samples) keeps the default layout.
export const DocsPage = () => {
  const hasReadme = useHasReadme();

  return (
    <>
      <Title />
      {hasReadme ? <ReadmeIntro /> : <Description />}
      <Primary />
      <Controls />
      <Stories />
      {hasReadme ? <ReadmeReference /> : null}
    </>
  );
};
