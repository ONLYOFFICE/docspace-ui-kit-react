/**
 * Data the samples share.
 *
 * Every sample from the file list on renders the same eight files, so the list,
 * the table and the tile grid are three views of one data set rather than
 * three unrelated demos. Nothing here touches the portal: the
 * samples are built on the published component API only, and a consumer can
 * paste this file into their own project unchanged.
 */

export type SampleFile = {
  id: number;
  title: string;
  /** Extension with the dot, the way the file components expect it. */
  fileExst: string;
  /** Human-readable type, used as a table column and tile caption. */
  type: string;
  size: string;
  author: string;
  /** ISO date, formatted by the sample that displays it. */
  modified: string;
  tag: string;
  isFavorite: boolean;
};

export type SampleUser = {
  id: string;
  displayName: string;
  email: string;
  role: string;
};

export const sampleFiles: SampleFile[] = [
  {
    id: 1,
    title: "Annual report 2025.docx",
    fileExst: ".docx",
    type: "Document",
    size: "2.4 MB",
    author: "Anna Petrova",
    modified: "2026-09-18",
    tag: "Finance",
    isFavorite: true,
  },
  {
    id: 2,
    title: "Q4 budget.xlsx",
    fileExst: ".xlsx",
    type: "Spreadsheet",
    size: "846 KB",
    author: "Ivan Sokolov",
    modified: "2026-09-17",
    tag: "Finance",
    isFavorite: false,
  },
  {
    id: 3,
    title: "Team presentation.pptx",
    fileExst: ".pptx",
    type: "Presentation",
    size: "12.1 MB",
    author: "Maria Kim",
    modified: "2026-09-15",
    tag: "Marketing",
    isFavorite: false,
  },
  {
    id: 4,
    title: "Brand guidelines.pdf",
    fileExst: ".pdf",
    type: "PDF",
    size: "5.7 MB",
    author: "Maria Kim",
    modified: "2026-09-12",
    tag: "Marketing",
    isFavorite: true,
  },
  {
    id: 5,
    title: "Onboarding checklist.docx",
    fileExst: ".docx",
    type: "Document",
    size: "128 KB",
    author: "Pavel Orlov",
    modified: "2026-09-11",
    tag: "People",
    isFavorite: false,
  },
  {
    id: 6,
    title: "Product roadmap.pdf",
    fileExst: ".pdf",
    type: "PDF",
    size: "1.9 MB",
    author: "Anna Petrova",
    modified: "2026-09-08",
    tag: "Product",
    isFavorite: false,
  },
  {
    id: 7,
    title: "Sprint backlog.xlsx",
    fileExst: ".xlsx",
    type: "Spreadsheet",
    size: "512 KB",
    author: "Ivan Sokolov",
    modified: "2026-09-04",
    tag: "Engineering",
    isFavorite: false,
  },
  {
    id: 8,
    title: "Architecture diagram.png",
    fileExst: ".png",
    type: "Image",
    size: "3.3 MB",
    author: "Pavel Orlov",
    modified: "2026-09-01",
    tag: "Engineering",
    isFavorite: true,
  },
];

export const sampleFolders = [
  { id: 101, title: "Contracts", filesCount: 12 },
  { id: 102, title: "Design assets", filesCount: 47 },
];

export const sampleUsers: SampleUser[] = [
  {
    id: "u-1",
    displayName: "Anna Petrova",
    email: "anna.petrova@example.com",
    role: "Room admin",
  },
  {
    id: "u-2",
    displayName: "Ivan Sokolov",
    email: "ivan.sokolov@example.com",
    role: "Power user",
  },
  {
    id: "u-3",
    displayName: "Maria Kim",
    email: "maria.kim@example.com",
    role: "User",
  },
  {
    id: "u-4",
    displayName: "Pavel Orlov",
    email: "pavel.orlov@example.com",
    role: "User",
  },
  {
    id: "u-5",
    displayName: "Elena Volkova",
    email: "elena.volkova@example.com",
    role: "Guest",
  },
  {
    id: "u-6",
    displayName: "Dmitry Isaev",
    email: "dmitry.isaev@example.com",
    role: "User",
  },
];

/** Formats an ISO date the way the samples show it in lists and tables. */
export const formatSampleDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
