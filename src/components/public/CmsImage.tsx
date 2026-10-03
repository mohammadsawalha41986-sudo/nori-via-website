import Image, { type ImageProps } from 'next/image';
import { publicImage } from '@/lib/public-media';
import type { Locale } from '@/lib/i18n';
/** Server-side metadata resolution: no CMS/database code enters the browser. */
export async function CmsImage({ locale, preferAlt = false, ...props }: ImageProps & { locale?: Locale; preferAlt?: boolean }) {
  const lang = locale ?? (/[\u0600-\u06ff]/.test(props.alt) ? 'ar' : 'en');
  const meta = typeof props.src === 'string' ? await publicImage(props.src, lang, props.alt) : null;
  return (
    <Image
      {...props}
      alt={preferAlt && props.alt ? props.alt : meta?.alt || props.alt}
      title={meta?.title}
      style={{ objectPosition: meta?.objectPosition, ...props.style }}
    />
  );
}
