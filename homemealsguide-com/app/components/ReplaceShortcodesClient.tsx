'use client';

import { useEffect } from 'react';

const ReplaceShortcodesClient = () => {
  useEffect(() => {
    if (typeof window !== undefined) {
      setTimeout(() => {
        window?.adstiaScripts?.replaceDOMShortcodes();
      }, 100);
    }

    const observer = new MutationObserver(() => {
      setTimeout(() => {
        window?.adstiaScripts?.replaceDOMShortcodes();
      }, 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
};

export default ReplaceShortcodesClient;
