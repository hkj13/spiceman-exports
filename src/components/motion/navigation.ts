"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

let first: string | null = null;
let navigated = false;

/** True after the first client-side navigation. */
export const hasNavigated = () => navigated;

/** Mounted once in the layout to notice client-side navigations. */
export function NavigationWatcher() {
  const pathname = usePathname();
  useEffect(() => {
    if (first === null) first = pathname;
    else if (pathname !== first) navigated = true;
    document.documentElement.removeAttribute("data-tone");
  }, [pathname]);
  return null;
}
