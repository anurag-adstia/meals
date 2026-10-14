'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface VoluumScriptProps {
  url: string;
}

export function VoluumScript({ url }: VoluumScriptProps) {
  const landingSlugs = ['/landers/*'];
  const offerSlugs = ['/quiz/*'];
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window?.VoluumScripts?.init(url, pathname, landingSlugs, offerSlugs);
      }, 100);
    }
  }, [url]);

  return null;
}
