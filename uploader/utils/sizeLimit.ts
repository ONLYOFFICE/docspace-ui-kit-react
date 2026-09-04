export const parseSizeLimit = (sizeString?: string): number | null => {
  if (!sizeString) return null;

  const match = sizeString.toLowerCase().match(/^(\d+)(kb|mb|gb)$/);
  if (!match) return null;

  const value = Number.parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "kb":
      return value * 1024;
    case "mb":
      return value * 1024 * 1024;
    case "gb":
      return value * 1024 * 1024 * 1024;
    default:
      return null;
  }
};
