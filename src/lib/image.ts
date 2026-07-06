import type { StaticImageData } from "next/image";

export const imageSrc = (image: string | StaticImageData) => {
  return typeof image === "string" ? image : image.src;
};
