'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { normalizeImageUrl } from '@/lib/image-display';

type UploadedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string;
  fallbackSrc?: string | null;
  fallbackOnError?: boolean;
};

export default function UploadedImage({
  src,
  fallbackSrc = '/services-card.webp',
  fallbackOnError,
  alt,
  className,
  loading,
  decoding,
  ...rest
}: UploadedImageProps) {
  const normalizedFallback = useMemo(() => {
    if (fallbackSrc === null) {
      return '';
    }
    return normalizeImageUrl(fallbackSrc) || '/services-card.webp';
  }, [fallbackSrc]);
  const normalizedSource = useMemo(() => normalizeImageUrl(src), [src]);
  const preferred = useMemo(
    () => normalizedSource || normalizedFallback || '',
    [normalizedSource, normalizedFallback]
  );
  const shouldFallbackOnError =
    typeof fallbackOnError === 'boolean' ? fallbackOnError : !Boolean(normalizedSource);

  const [currentSrc, setCurrentSrc] = useState(preferred);

  useEffect(() => {
    setCurrentSrc(preferred);
  }, [preferred]);

  const resolvedLoading = loading || (rest.fetchPriority === 'high' ? 'eager' : 'lazy');

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={resolvedLoading}
      decoding={decoding || 'async'}
      onError={() => {
        if (!shouldFallbackOnError || !normalizedFallback) {
          return;
        }
        if (currentSrc !== normalizedFallback) {
          setCurrentSrc(normalizedFallback);
        }
      }}
      {...rest}
    />
  );
}
