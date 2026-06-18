'use client';

import { useEffect, useRef } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
  className?: string;
  fullWidthResponsive?: boolean;
}

export default function AdSense({
  adSlot,
  adFormat = 'auto',
  style = { display: 'block' },
  className = '',
  fullWidthResponsive = true,
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const adLoaded = useRef(false);

  useEffect(() => {
    if (adLoaded.current) return;
    
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
        adLoaded.current = true;
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client="ca-pub-1710447158146560"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive.toString()}
    />
  );
}
