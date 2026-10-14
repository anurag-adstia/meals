"use client";

import { useEffect } from "react";

const InitScript = () => {
  useEffect(() => {
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window?.adstiaScripts?.init();

        (async () => {
          await window?.adstiaScripts?.fetchUserLocationAndDeviceInfo();
        })();
      }
    }, 100);
  }, []);

  return null;
};

export default InitScript;
