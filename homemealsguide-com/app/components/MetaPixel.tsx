"use client";

import { PIXEL_ID } from "@/app/lib/meals";
import { useEffect } from "react";

// Meta Pixel, loaded after the page is interactive so it never blocks rendering
const MetaPixel = () => {
  useEffect(() => {
    if (!PIXEL_ID) return;

    const load = () => {
      const w = window as any;
      if (!w.fbq) {
        const n: any = (w.fbq = function (...args: unknown[]) {
          n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
        });
        if (!w._fbq) w._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        const t = document.createElement("script");
        t.async = true;
        t.src = "https://connect.facebook.net/en_US/fbevents.js";
        const s = document.getElementsByTagName("script")[0];
        s.parentNode?.insertBefore(t, s);
      }
      w.fbq("init", PIXEL_ID);
      w.fbq("track", "PageView");
    };

    if (document.readyState === "complete") {
      load();
      return;
    }
    window.addEventListener("load", load);
    return () => window.removeEventListener("load", load);
  }, []);

  return null;
};

export default MetaPixel;
