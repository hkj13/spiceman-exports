import Image from "next/image";
import type { Photo } from "@/data/photos";

type Props = {
  photo: Photo;
  /** Sizing for the frame, including an aspect ratio (e.g. "aspect-[4/5] w-full") */
  className?: string;
  /** next/image `sizes` */
  sizes: string;
  /** Focus point, e.g. "50% 40%" */
  position?: string;
  priority?: boolean;
  /** Decorative photos are hidden from assistive tech */
  decorative?: boolean;
};

/** A photograph in a plain rectangular frame with a light, warm grade. */
export function PhotoFrame({ photo, className = "", sizes, position = "50% 50%", priority, decorative }: Props) {
  const positioned = /\b(absolute|fixed)\b/.test(className) ? "" : "relative";
  return (
    <figure className={`${positioned} overflow-hidden rounded-[4px] bg-paper-2 ${className}`}>
      <Image
        src={photo.src}
        alt={decorative ? "" : photo.alt}
        fill
        sizes={sizes}
        placeholder="blur"
        priority={priority}
        className="photo-grade object-cover transition-transform duration-[1.2s] ease-(--ease-settle) group-hover:scale-[1.03]"
        style={{ objectPosition: position }}
      />
    </figure>
  );
}
