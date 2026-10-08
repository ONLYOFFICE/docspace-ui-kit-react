export type TRoomLogoParams = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const calculateRoomLogoParams = (
  img: HTMLImageElement,
  x: number,
  y: number,
  zoom: number,
): TRoomLogoParams => {
  let imgWidth: number;
  let imgHeight: number;
  let dimensions: number;

  if (img.width > img.height) {
    imgWidth = Math.min(1280, img.width);
    imgHeight = Math.round(img.height / (img.width / imgWidth));
    dimensions = Math.round(imgHeight / zoom);
  } else {
    imgHeight = Math.min(1280, img.height);
    imgWidth = Math.round(img.width / (img.height / imgHeight));
    dimensions = Math.round(imgWidth / zoom);
  }

  const croppedX = Math.round(x * imgWidth - dimensions / 2);
  const croppedY = Math.round(y * imgHeight - dimensions / 2);

  return { x: croppedX, y: croppedY, width: dimensions, height: dimensions };
};
