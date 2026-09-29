import CheckIcon from "../../assets/check.react.svg";

import styles from "./Infographics.module.scss";

// The pictures on the "Agent skills" page. Each one replaces a paragraph, so
// every figure carries its own words for a screen reader.

const SKILLS = [
  {
    name: "ui-kit",
    mark: "UI",
    where: "Your own React app",
    does: "Screens built from this kit: forms, dialogs, lists, theming, review",
    prompt: "A settings form in the ONLYOFFICE style",
  },
  {
    name: "plugin-sdk",
    mark: "PL",
    where: "Inside the portal",
    does: "Portal plugins: scaffold, scopes, items, a check against the loader",
    prompt: "Add 'Convert to PDF' to the file context menu",
  },
  {
    name: "embed-sdk",
    mark: "EM",
    where: "In your web page",
    does: "ONLYOFFICE Apps in an iframe: modes, sign-in, events, the editor",
    prompt: "Embed a room viewer on our intranet",
  },
];

/** The three skills, side by side: where each one applies and a prompt that loads it. */
export const SkillCards = () => (
  <ul className={`sb-unstyled ${styles.cards}`} aria-label="The three skills">
    {SKILLS.map((skill) => (
      <li key={skill.name} className={styles.card}>
        <span className={styles.mark} aria-hidden="true">
          {skill.mark}
        </span>
        <code className={styles.cardName}>{skill.name}</code>
        <span className={styles.where}>{skill.where}</span>
        <span className={styles.does}>{skill.does}</span>
        <span className={styles.prompt}>"{skill.prompt}"</span>
      </li>
    ))}
  </ul>
);

const BENEFITS = [
  {
    title: "The right prop, first time",
    note: "Knows which name each component shows and hides with",
    code: "visible \u00b7 isOpen \u00b7 opened \u00b7 open",
  },
  {
    title: "Labels and translations in place",
    note: "Mounts the two providers the kit expects",
    code: "<ThemeProvider> + <TranslationProvider>",
  },
  {
    title: "Forms that read well",
    note: "Captions, required markers and focus wired to each field",
    code: "labelVisible \u00b7 labelFor \u00b7 id",
  },
  {
    title: "Layouts that fit",
    note: "Gives the controls that need it a size of their own",
    code: "ToggleButton \u00b7 Textarea \u00b7 Loader",
  },
  {
    title: "Only the CSS you use",
    note: "Each component brings its own styles, nothing to import",
    code: 'import { Button } from "@onlyoffice/apps-ui-kit"',
  },
  {
    title: "The right modules for the job",
    note: "Keeps to the public components in your own app",
    code: "components \u00b7 hooks \u00b7 providers/theme",
  },
];

/** What the skill takes care of, one tile per area of the kit. */
export const SkillBenefits = () => (
  <ul
    className={`sb-unstyled ${styles.benefits}`}
    aria-label="What the skill takes care of"
  >
    {BENEFITS.map((benefit) => (
      <li key={benefit.title} className={styles.benefit}>
        <span className={styles.benefitIcon} aria-hidden="true">
          <CheckIcon />
        </span>
        <span className={styles.benefitTitle}>{benefit.title}</span>
        <span className={styles.benefitNote}>{benefit.note}</span>
        <code className={styles.benefitCode}>{benefit.code}</code>
      </li>
    ))}
  </ul>
);

type TStep = { title: string; note?: string; tone?: "bad" | "good" };

const WITHOUT: TStep[] = [
  { title: "You describe the screen" },
  { title: "The agent guesses", note: "props, defaults, imports" },
  { title: "It looks right", note: "compiles, renders" },
  {
    title: "It breaks later",
    note: "dark theme, another language, the keyboard",
    tone: "bad",
  },
];

const WITH: TStep[] = [
  { title: "You describe the screen" },
  { title: "The skill loads itself", note: "from what you asked" },
  { title: "The agent follows its rules", note: "version checked first" },
  { title: "check-usage.mjs runs", note: "finds the silent faults" },
  { title: "Handed over checked", tone: "good" },
];

const Flow = ({ label, steps }: { label: string; steps: TStep[] }) => (
  <div className={styles.flowRow}>
    <span className={styles.flowLabel}>{label}</span>
    <ol className={styles.flow}>
      {steps.map((step) => (
        <li key={step.title} className={styles.step} data-tone={step.tone}>
          <span className={styles.stepTitle}>{step.title}</span>
          {step.note ? (
            <span className={styles.stepNote}>{step.note}</span>
          ) : null}
        </li>
      ))}
    </ol>
  </div>
);

/** The same request, vibe coded without the skill and with it. */
export const VibeFlow = () => (
  <figure className={`sb-unstyled ${styles.figure}`}>
    <Flow label="Without" steps={WITHOUT} />
    <Flow label="With the skill" steps={WITH} />
  </figure>
);

const RESULTS = [
  { suite: "ui-kit: five build tasks", with: [70, 70], without: [58, 70] },
  { suite: "ui-kit: review a faulty file", with: [13, 13], without: [8, 13] },
  {
    suite: "Plugin and embed questions",
    with: [100, 100],
    without: [32, 100],
    percent: true,
  },
];

const Bar = ({
  series,
  value,
  of,
  percent,
}: {
  series: "with" | "without";
  value: number;
  of: number;
  percent?: boolean;
}) => {
  const share = value / of;
  const label = percent ? `${Math.round(share * 100)}%` : `${value}/${of}`;
  return (
    <div
      className={styles.barRow}
      title={`${series === "with" ? "With the skill" : "Without"}: ${label}`}
    >
      <span
        className={styles.bar}
        data-series={series}
        style={{ width: `${share * 100}%` }}
      />
      <span className={styles.barValue}>{label}</span>
    </div>
  );
};

/**
 * Recorded results of the A/B evals: the same task with the skill and
 * without, graded against the same checks. The baseline had the kit's own
 * documentation, so the gap is not about missing docs.
 */
export const EvalResults = () => (
  <figure className={`sb-unstyled ${styles.figure}`}>
    <div className={styles.legend} aria-hidden="true">
      <span className={styles.key} data-series="with" /> With the skill
      <span className={styles.key} data-series="without" /> Without
    </div>
    <div className={styles.chart}>
      {RESULTS.map((row) => (
        <div key={row.suite} className={styles.chartRow}>
          <span className={styles.suite}>{row.suite}</span>
          <div className={styles.bars}>
            <Bar
              series="with"
              value={row.with[0]}
              of={row.with[1]}
              percent={row.percent}
            />
            <Bar
              series="without"
              value={row.without[0]}
              of={row.without[1]}
              percent={row.percent}
            />
          </div>
        </div>
      ))}
    </div>
    <table className={styles.srOnly}>
      <caption>Eval results, with the skill and without</caption>
      <thead>
        <tr>
          <th scope="col">Suite</th>
          <th scope="col">With the skill</th>
          <th scope="col">Without</th>
        </tr>
      </thead>
      <tbody>
        {RESULTS.map((row) => (
          <tr key={row.suite}>
            <th scope="row">{row.suite}</th>
            <td>
              {row.percent
                ? `${row.with[0]}%`
                : `${row.with[0]}/${row.with[1]}`}
            </td>
            <td>
              {row.percent
                ? `${row.without[0]}%`
                : `${row.without[0]}/${row.without[1]}`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <figcaption className={styles.caption}>
      The same task run twice and graded by the same checks. The run without the
      skill had the kit's own documentation.
    </figcaption>
  </figure>
);

/** Where the skills' knowledge of this kit comes from. */
export const SyncDiagram = () => (
  <figure className={`sb-unstyled ${styles.figure}`}>
    <div className={styles.sync}>
      <div className={styles.node}>
        <span className={styles.nodeTitle}>components/*/README.md</span>
        <span className={styles.nodeNote}>this repository</span>
      </div>
      <span className={styles.edge}>
        <span aria-hidden="true">{"→"}</span> sync-ui-kit.mjs
      </span>
      <div className={styles.node}>
        <span className={styles.nodeTitle}>ui-kit skill pages</span>
        <span className={styles.nodeNote}>generated, never edited</span>
      </div>
      <span className={styles.edge}>
        <span aria-hidden="true">{"→"}</span> the agent
      </span>
    </div>
    <div className={styles.sync}>
      <div className={styles.node}>
        <span className={styles.nodeTitle}>kit source</span>
        <span className={styles.nodeNote}>defaults, margins, sizes</span>
      </div>
      <span className={styles.edge}>
        <span aria-hidden="true">{"→"}</span> sync-ui-kit-reference
      </span>
      <div className={styles.node} data-tone="manual">
        <span className={styles.nodeTitle}>
          plugin-sdk: references/ui-kit.md
        </span>
        <span className={styles.nodeNote}>hand-written, checked on demand</span>
      </div>
    </div>
    <figcaption className={styles.caption}>
      A README here is read by people and by agents: a stale sentence misleads
      both, after the next sync.
    </figcaption>
  </figure>
);
