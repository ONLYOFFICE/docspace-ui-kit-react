export type MessageMarkdownFieldProps = {
  chatMessage: string;
  propLanguage?: string;
  isFirst?: boolean;
  successCopyMessage?: string;
  openLink?: (url: string) => void;
  openFile?: (fileId: string) => void;
};

export type MessageCodeBlockProps = {
  language?: string;
  content: string;
  successCopyMessage?: string;
};
