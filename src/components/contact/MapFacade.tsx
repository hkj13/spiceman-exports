"use client";

import { useRef, useState } from "react";
import { pinShape, PATHS } from "@/components/motion/particles/silhouettes";
import { useParticleScene } from "@/components/motion/useParticleScene";
import { site } from "@/config/site";

const query = encodeURIComponent(site.mapQuery);

/**
 * A drawn stand-in for the map. The Google Maps embed only loads when asked
 * for, so the contact page stays fast. Particles gather into the pin first.
 */
export function MapFacade() {
  const [live, setLive] = useState(false);
  const pin = useRef<HTMLDivElement>(null);
  const revealed = useParticleScene(
    () => ({
      id: "contact-pin",
      parts: [{ anchor: pin.current, shape: pinShape, colors: ["#BF201B", "#A11C18", "#C8231E", "#8F1A16"] }],
      handoff: true,
      duration: 1200,
      scatter: 100,
    }),
    "contact-pin",
  );

  return (
    <figure className="relative">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[3px] bg-paper-2">
        {live ? (
          <iframe
            title={`Map: ${site.address.street}, ${site.address.locality}`}
            src={`https://www.google.com/maps?q=${query}&output=embed`}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <>
            {/* Street pattern, not a real map */}
            <svg viewBox="0 0 400 300" aria-hidden className="absolute inset-0 h-full w-full">
              <g stroke="#DDCFB4" strokeWidth="10" fill="none" strokeLinecap="round">
                <path d="M-10 80C80 90 160 60 260 70s120 20 160 10" />
                <path d="M-10 210c90-20 170 10 250-5s130-35 170-25" />
                <path d="M120 -10c10 90-10 170 5 320" />
                <path d="M300 -10c-15 100 10 200-5 320" />
              </g>
              <g stroke="#E8DCC4" strokeWidth="4" fill="none">
                <path d="M-10 140c100 5 200-15 420 0" />
                <path d="M210 -10c5 110-5 210 0 320" />
                <path d="M40 -10c-5 90 10 200 0 320" />
              </g>
            </svg>
            <div ref={pin} className="absolute left-1/2 top-[44%] h-[34%] -translate-x-1/2 -translate-y-1/2 aspect-[100/130]">
              <svg
                viewBox="0 0 100 130"
                aria-hidden
                className="h-full w-full transition-opacity duration-500"
                style={{ opacity: revealed ? 1 : 0 }}
              >
                <path d={PATHS.pin} fill="#BF201B" fillRule="evenodd" />
              </svg>
            </div>
            <p className="mono-label absolute bottom-4 left-4 right-4 text-brown">
              Ashok Nagar, Lawspet · Pondicherry 605008
            </p>
          </>
        )}
      </div>
      <figcaption className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {!live && (
          <button type="button" onClick={() => setLive(true)} className="mono-label link-draw text-green">
            Load the map
          </button>
        )}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mono-label link-draw text-green"
        >
          Open in Google Maps ↗
        </a>
      </figcaption>
    </figure>
  );
}
