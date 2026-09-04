'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';

export type PreviewRoute = { href: string; label: string; group: string };

const DEVICES = {
  desktop: { label: 'Desktop', width: 1440, height: 900 },
  tablet: { label: 'Tablet', width: 834, height: 1112 },
  mobile: { label: 'Mobile', width: 390, height: 844 },
} as const;

type DeviceKey = keyof typeof DEVICES;

/**
 * Renders the real public site in a same-origin iframe at true device widths,
 * scaled to fit. Because it loads the actual routes, what an editor sees here
 * is exactly what a visitor gets — including RTL and the saved design tokens.
 */
export function SitePreview({ routes }: { routes: PreviewRoute[] }) {
  const [device, setDevice] = useState<DeviceKey>('desktop');
  const [locale, setLocale] = useState<'en' | 'ar'>('en');
  const [path, setPath] = useState(routes[0]?.href ?? '/');
  const [nonce, setNonce] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);

  // Scale the device viewport down to whatever space the panel has.
  useEffect(() => {
    const measure = () => setFrameWidth(document.getElementById('preview-stage')?.clientWidth ?? 0);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { width, height, label } = DEVICES[device];
  const scale = frameWidth ? Math.min(1, (frameWidth - 8) / width) : 1;
  const src = `/${locale}${path === '/' ? '' : path}?preview=1&v=${nonce}`;

  const groups = [...new Set(routes.map((r) => r.group))];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
        <div className="flex rounded-md border border-slate-200 p-0.5" role="group" aria-label="Device">
          {(Object.keys(DEVICES) as DeviceKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setDevice(key)}
              aria-pressed={device === key}
              className={clsx(
                'rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors',
                device === key ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900',
              )}
            >
              {DEVICES[key].label}
            </button>
          ))}
        </div>

        <div className="flex rounded-md border border-slate-200 p-0.5" role="group" aria-label="Language">
          {(['en', 'ar'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setLocale(key)}
              aria-pressed={locale === key}
              className={clsx(
                'rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors',
                locale === key ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900',
              )}
            >
              {key === 'en' ? 'English' : 'العربية'}
            </button>
          ))}
        </div>

        <label className="min-w-[14rem] flex-1">
          <span className="sr-only">Page</span>
          <select
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
          >
            {groups.map((group) => (
              <optgroup key={group} label={group}>
                {routes
                  .filter((r) => r.group === group)
                  .map((route) => (
                    <option key={route.href} value={route.href}>
                      {route.label}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => setNonce((n) => n + 1)}
          className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>

        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Open ↗
        </a>
      </div>

      <div id="preview-stage" className="rounded-lg border border-slate-200 bg-slate-200/60 p-4">
        <p className="mb-3 text-center text-xs text-slate-500">
          {label} · {width}×{height} · {locale === 'ar' ? 'RTL' : 'LTR'}
          {scale < 1 && ` · ${Math.round(scale * 100)}%`}
        </p>

        <div className="mx-auto overflow-hidden" style={{ width: width * scale, height: height * scale }}>
          <iframe
            key={`${device}-${locale}-${path}-${nonce}`}
            src={src}
            title={`${label} preview`}
            width={width}
            height={height}
            className="border-0 bg-white shadow-lg"
            style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
          />
        </div>
      </div>
    </div>
  );
}
