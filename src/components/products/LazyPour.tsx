"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const PulsePour = dynamic(() => import("./PulsePour"), { ssr: false });

/** Loads the pour toy only when it is about to scroll into view. */
export function LazyPour() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[440px] md:min-h-[520px]">
      {show && <PulsePour />}
    </div>
  );
}
