import { useDarkMode } from "@vueless/storybook-dark-mode";

import ArrowIcon from "../../assets/arrow2.react.svg";
import TickIcon from "../../assets/icons/12/tick.react.svg";
import PlanetIcon from "../../assets/icons/12/planet.react.svg";
import CatalogDocumentsIcon from "../../assets/icons/16/catalog.documents.react.svg";
import CatalogRoomsIcon from "../../assets/icons/16/catalog.rooms.react.svg";
import CodeIcon from "../../assets/icons/16/code.react.svg";
import DeveloperIcon from "../../assets/icons/16/catalog.developer.react.svg";
import SettingsIcon from "../../assets/icons/16/catalog-settings-common.svg";
import StatisticsIcon from "../../assets/icons/16/statistics.react.svg";
import { Button, ButtonSize } from "../../components/button";
import { CollapsibleCard } from "../../components/collapsible-card";
import { Link, LinkType } from "../../components/link";
import { QuickActions } from "../../components/quick-actions";
import {
  CreateAgentIcon,
  CreateDocumentIcon,
  CreateRoomIcon,
  CreateSpreadsheetIcon,
  QuickCollaborationRoomIcon,
  UseTemplateIcon,
} from "../../components/quick-actions/icons";
import { Text } from "../../components/text";
import { ThemeProviderComponent } from "../../components/theme-provider";
import type { TColorScheme } from "../../context/ThemeContext";
import { globalColors } from "../../providers/theme";
import styles from "./WelcomePage.module.scss";

/**
 * A docs page is not a story, so the preview's decorators never run over it:
 * without a provider of its own nothing stamps `light` / `dark` on the body,
 * and every component here -- this page included -- falls back to its light
 * defaults on a dark background. The two colour schemes mirror the ones
 * `.storybook/preview.tsx` gives the stories.
 */
const lightColorScheme: TColorScheme = {
  id: 1,
  name: "Light",
  main: {
    accent: globalColors.lightBlueMain,
    buttons: globalColors.lightBlueMain,
  },
  text: { accent: globalColors.white, buttons: globalColors.white },
};

const darkColorScheme: TColorScheme = {
  id: 2,
  name: "Dark",
  main: {
    accent: globalColors.lightSecondMain,
    buttons: globalColors.lightSecondMain,
  },
  text: { accent: globalColors.white, buttons: globalColors.white },
};

/**
 * Docs render inside the preview iframe, so a link to another page has to
 * address the manager instead: the top window's own pathname plus the story
 * id. A relative href would resolve against `/iframe.html`, and a root-relative
 * one would drop the `/storybook/` prefix this Storybook is proxied under --
 * reading the pathname back avoids both.
 */
const docsHref = (id: string) => {
  const top = window.top ?? window;

  return `${top.location.pathname}?path=/docs/${id}`;
};

const openDocs = (id: string) => {
  const top = window.top ?? window;
  top.location.href = docsHref(id);
};

const facts = [
  { label: "Package", value: "@onlyoffice/apps-ui-kit" },
  { label: "Version", value: "4.0.0" },
  { label: "Licence", value: "AGPL-3.0-only" },
  { label: "Peers", value: "react 19, react-dom 19, i18next" },
];

/** The rungs of the Samples ladder that are worth opening first. */
const sampleTiles = [
  {
    id: "sample-buttons",
    icon: <CreateDocumentIcon />,
    label: "Buttons and toasts",
    href: docsHref("samples-01-buttons-and-toasts--docs"),
  },
  {
    id: "sample-form",
    icon: <UseTemplateIcon />,
    label: "Sign-in form",
    href: docsHref("samples-02-sign-in-form--docs"),
  },
  {
    id: "sample-list",
    icon: <QuickCollaborationRoomIcon />,
    label: "File list",
    href: docsHref("samples-05-selectable-file-list--docs"),
  },
  {
    id: "sample-table",
    icon: <CreateSpreadsheetIcon />,
    label: "Sortable table",
    href: docsHref("samples-06-sortable-table--docs"),
  },
  {
    id: "sample-picker",
    icon: <CreateAgentIcon />,
    label: "People picker",
    href: docsHref("samples-09-people-picker--docs"),
  },
  {
    id: "sample-app",
    icon: <CreateRoomIcon />,
    label: "A small Files app",
    href: docsHref("samples-10-a-small-files-app--docs"),
  },
];

const modules = [
  {
    id: "components",
    icon: <CatalogDocumentsIcon />,
    title: "Components",
    badge: "Public API",
    description:
      "98 components -- buttons, inputs, tables, tiles, dialogs -- each self-contained and shipping its own CSS.",
    action: {
      label: "Open Structure",
      docsId: "getting-started-structure--docs",
    },
  },
  {
    id: "hooks",
    icon: <CodeIcon />,
    title: "Hooks and utils",
    badge: "Public API",
    description:
      "11 React hooks and 32 helper modules: dates, devices, URLs, cookies, e-mail and the rest.",
    action: { label: "Open Hooks", docsId: "getting-started-hooks--docs" },
  },
  {
    id: "theming",
    icon: <CatalogRoomsIcon />,
    title: "Theming",
    badge: "Public API",
    description:
      "Light, dark, RTL and the colour tokens every component reads. No component hardcodes a colour.",
    action: { label: "Open Themes", docsId: "getting-started-themes--docs" },
  },
  {
    id: "portal",
    icon: <DeveloperIcon />,
    title: "Portal modules",
    badge: "Portal-only",
    description:
      "The REST client, MobX-backed selectors, billing, the uploader, the editor wrapper and the AI agent.",
    action: { label: "Open API", docsId: "getting-started-api--docs" },
  },
];

const references = [
  {
    id: "utils",
    icon: <StatisticsIcon />,
    name: "Utils",
    href: docsHref("getting-started-utils--docs"),
  },
  {
    id: "constants",
    icon: <SettingsIcon />,
    name: "Constants and enums",
    href: docsHref("getting-started-constants--docs"),
  },
  {
    id: "translation",
    icon: <PlanetIcon />,
    name: "Translation",
    href: docsHref("getting-started-translation--docs"),
  },
  {
    id: "samples",
    icon: <CatalogDocumentsIcon />,
    name: "All ten samples",
    href: docsHref("samples-01-buttons-and-toasts--docs"),
  },
  {
    id: "github",
    icon: <CodeIcon />,
    name: "GitHub repository",
    href: "https://github.com/ONLYOFFICE/docspace-ui-kit-react",
    external: true,
  },
  {
    id: "apps-api",
    icon: <DeveloperIcon />,
    name: "ONLYOFFICE Apps API",
    href: "https://api.onlyoffice.com/docspace/",
    external: true,
  },
];

export const WelcomePage = () => {
  const isDark = useDarkMode();

  return (
    <ThemeProviderComponent
      theme={{
        isBase: !isDark,
        interfaceDirection: "ltr",
        fontFamily: "Open Sans, sans-serif, Arial",
      }}
      currentColorScheme={isDark ? darkColorScheme : lightColorScheme}
    >
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <Text as="h1" className={styles.title}>
              ONLYOFFICE Apps UI Kit
            </Text>
            <div className={styles.subline}>
              <Text as="span" fontSize="13px" lineHeight="20px">
                Version 4.0.0 &bull; AGPL-3.0-only &bull; not on the public npm
                registry yet
              </Text>
              <Link
                type={LinkType.page}
                href="#installation"
                color="accent"
                isHovered
                className={styles.sublineLink}
              >
                How to install it
              </Link>
            </div>
          </div>
        </header>

        <div className={styles.factsCard}>
          <Text as="p" className={styles.factsTitle}>
            The package at a glance
          </Text>
          <div className={styles.factsGrid}>
            {facts.map((fact) => (
              <div key={fact.label} className={styles.factsField}>
                <Text as="span" className={styles.factsLabel}>
                  {fact.label}
                </Text>
                <Text as="span" className={styles.factsValue}>
                  {fact.value}
                </Text>
              </div>
            ))}
          </div>
        </div>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <Text as="p" className={styles.sectionTitle}>
              Start with a sample
            </Text>
            <Text as="p" className={styles.sectionSubtitle}>
              Ten working screens, from a single button to a small Files app.
              Each one runs here and carries its own source.
            </Text>
          </div>
          <QuickActions
            items={sampleTiles.map((tile) => ({ ...tile, target: "_top" }))}
            className={styles.quickActions}
            prevLabel="Previous"
            nextLabel="Next"
          />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <Text as="p" className={styles.sectionTitle}>
              What is inside
            </Text>
            <Text as="p" className={styles.sectionSubtitle}>
              The published surface, and the portal-coupled modules that ship
              alongside it without the same compatibility promise.
            </Text>
          </div>
          <div className={styles.modulesGrid}>
            {modules.map((mod) => (
              <div key={mod.id} className={styles.moduleCard}>
                <div className={styles.moduleHeader}>
                  <span className={styles.moduleIcon}>{mod.icon}</span>
                  <div className={styles.moduleHeadings}>
                    <Text as="p" className={styles.moduleTitle}>
                      {mod.title}
                    </Text>
                    <Text as="span" className={styles.moduleBadge}>
                      {mod.badge === "Public API" ? <TickIcon /> : null}
                      {mod.badge}
                    </Text>
                  </div>
                </div>

                <Text as="p" className={styles.moduleDescription}>
                  {mod.description}
                </Text>

                <div className={styles.moduleFooter}>
                  <Button
                    scale
                    size={ButtonSize.small}
                    label={mod.action.label}
                    onClick={() => openDocs(mod.action.docsId)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <CollapsibleCard
          title="The rest of the documentation"
          description="Helpers, constants, translations and the two places this package comes from."
          defaultOpen
        >
          <div className={styles.referenceGrid}>
            {references.map((ref) => (
              <a
                key={ref.id}
                className={styles.referenceTile}
                href={ref.href}
                target={ref.external ? "_blank" : "_top"}
                rel={ref.external ? "noreferrer" : undefined}
              >
                <span className={styles.referenceIcon}>{ref.icon}</span>
                <Text as="span" className={styles.referenceName} truncate>
                  {ref.name}
                </Text>
                <ArrowIcon
                  aria-hidden="true"
                  className={styles.referenceArrow}
                />
              </a>
            ))}
          </div>
        </CollapsibleCard>
      </div>
    </ThemeProviderComponent>
  );
};
