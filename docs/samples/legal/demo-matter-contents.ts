import { CLIENT_FOLDER, FIRM_FOLDER, type FolderContents } from "./matterRoom";

/**
 * What the demo portal answers for a folder: the same shape
 * `getFolderByFolderId` returns, keyed by folder id, so the demo goes through
 * the same walk a real room does. Rooms not listed here answer empty, which
 * is what a room that nobody has set up looks like.
 */
const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const folder = (
  id: number,
  title: string,
  filesCount: number,
  foldersCount: number,
  createdDaysAgo: number,
  updatedDaysAgo = createdDaysAgo,
) => ({
  id,
  title,
  filesCount,
  foldersCount,
  created: daysAgo(createdDaysAgo),
  updated: daysAgo(updatedDaysAgo),
});

const file = (
  id: number,
  title: string,
  bytes: number,
  by: string,
  updatedDaysAgo: number,
) => ({
  id,
  title,
  fileExst: title.slice(title.lastIndexOf(".")),
  pureContentLength: bytes,
  createdBy: { displayName: by },
  created: daysAgo(updatedDaysAgo),
  updated: daysAgo(updatedDaysAgo),
  // No portal, so no page to open.
  webUrl: "",
});

const CLIENT = "Emma Harper";

export const DEMO_FOLDERS: Record<number, FolderContents> = {
  // Harper v. Northwind Logistics: the matter most of the demo is about.
  101: {
    folders: [
      folder(1011, CLIENT_FOLDER, 0, 5, 12, 3),
      folder(1012, FIRM_FOLDER, 2, 0, 12, 1),
      folder(1013, "Working files", 14, 2, 12, 0),
    ],
    files: [],
  },
  1011: {
    folders: [
      folder(10111, "Passport", 1, 0, 12, 5),
      folder(10112, "Employment contract", 1, 0, 12, 4),
      folder(10113, "Payslips, last 3 months", 0, 0, 12),
      folder(10114, "Dismissal letter", 1, 0, 12, 9),
      folder(10115, "Correspondence with HR", 0, 0, 3),
    ],
    files: [],
  },
  10111: {
    folders: [],
    files: [file(1, "passport-scan.pdf", 1240000, CLIENT, 5)],
  },
  10112: {
    folders: [],
    files: [file(2, "Employment contract 2023.pdf", 380000, CLIENT, 4)],
  },
  10114: {
    folders: [],
    files: [file(3, "Dismissal letter.pdf", 210000, CLIENT, 9)],
  },
  1012: {
    folders: [],
    files: [
      file(4, "Engagement letter.docx", 48000, "Daniel Reyes", 12),
      file(5, "Draft claim.docx", 96000, "Daniel Reyes", 1),
    ],
  },

  // Lease renewal, 14 Canal Street: the client's other matter.
  104: {
    folders: [
      folder(1041, CLIENT_FOLDER, 0, 3, 20, 7),
      folder(1042, FIRM_FOLDER, 1, 0, 20, 1),
    ],
    files: [],
  },
  1041: {
    folders: [
      folder(10411, "Current lease", 1, 0, 20, 8),
      folder(10412, "Landlord's proposal", 0, 0, 2),
      folder(10413, "Floor plan", 1, 0, 20, 7),
    ],
    files: [],
  },
  10411: {
    folders: [],
    files: [file(6, "Lease 2021.pdf", 2100000, CLIENT, 8)],
  },
  10413: {
    folders: [],
    files: [file(7, "floor-plan.png", 3400000, CLIENT, 7)],
  },
  1042: {
    folders: [],
    files: [file(8, "Counter-proposal v2.docx", 71000, "Tom Whitfield", 1)],
  },

  // Estate of Margaret Ellis: opened yesterday, nothing asked for yet.
  102: {
    folders: [],
    files: [file(9, "Intake notes.docx", 12000, "Priya Nair", 0)],
  },
};
