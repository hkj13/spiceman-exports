import Image from "next/image";
import type { Photo } from "@/data/photos";

export type MaskShape = "leaf" | "seed" | "pod" | "pebble" | "arch" | "circle";

type Props = {
  photo: Photo;
  shape?: MaskShape;
  /** Tailwind sizing for the frame, including an aspect ratio */
  className?: string;
  /** next/image `sizes` */
  sizes: string;
  /** Focus point, e.g. "50% 40%" */
  position?: string;
  /** A second, offset copy of the shape in a spice colour behind the photo */
  echo?: string;
  priority?: boolean;
  /** Decorative photos are hidden from assistive tech */
  decorative?: boolean;
};

/**
 * A photograph cut to an organic shape (leaf, seed, pod…) with a warm grade,
 * so stock photography sits inside the illustrated world instead of on top
 * of it. The paper grain overlay in globals.css covers it like everything else.
 */
export function MaskedPhoto({
  photo,
  shape = "seed",
  className = "",
  sizes,
  position = "50% 50%",
  echo,
  priority,
  decorative,
}: Props) {
  return (
    <figure className={`relative ${className}`}>
      {echo && (
        <span
          aria-hidden
          className={`mask-${shape} absolute inset-0 translate-x-[5%] translate-y-[4%] opacity-90`}
          style={{ background: echo }}
        />
      )}
      <div className={`mask-${shape} absolute inset-0 overflow-hidden bg-paper-2`}>
        <Image
          src={photo.src}
          alt={decorative ? "" : photo.alt}
          fill
          sizes={sizes}
          placeholder="blur"
          priority={priority}
          className="photo-grade object-cover transition-transform duration-[1.2s] ease-(--ease-settle) group-hover:scale-[1.04]"
          style={{ objectPosition: position }}
        />
      </div>
    </figure>
  );
}
