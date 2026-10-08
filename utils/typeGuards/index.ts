type StaticImageData = {
  src: string;
  height: number;
  width: number;
};

export const isNextImage = (item: unknown): item is StaticImageData => {
  return typeof item === "object" && item !== null && "src" in item;
};
