'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PRACTICES, practiceFor, practiceLabel } from '@/lib/service-discovery';
import { ServiceList, type ServiceGroup } from './ServiceList';
import type { Locale } from '@/lib/i18n';

export function ServiceDiscovery({ groups, locale }: { groups: ServiceGroup[]; locale: Locale }) {
  const [mode, setMode] = useState<'need' | 'expertise'>('need');
  const [active, setActive] = useState('');
  const [query, setQuery] = useState('');
  const rows = groups.flatMap((g) => g.services);
  const available = PRACTICES.filter((p) => rows.some((s) => practiceFor(s.slug).id === p.id));
  const selected = available.find((p) => p.id === active) ?? available[0];
  const search = query.trim().toLocaleLowerCase();
  const shown = search
    ? rows.filter((s) => `${s.name} ${s.summary}`.toLocaleLowerCase().includes(search))
    : rows.filter((s) => practiceFor(s.slug).id === selected?.id);
  const ar = locale === 'ar';
  return (
    <div className="discovery">
      <div
        className="mb-8 flex flex-wrap gap-3"
        role="group"
        aria-label={ar ? 'طريقة تصفح الخدمات' : 'Browse services'}
      >
        {(['need', 'expertise'] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={`discovery-tab ${mode === m ? 'is-active' : ''}`}
          >
            {m === 'need' ? (ar ? 'حسب احتياجك' : 'By need') : ar ? 'حسب التخصص' : 'By expertise'}
          </button>
        ))}
        <label className="ms-auto w-full sm:w-80">
          <span className="sr-only">{ar ? 'البحث عن خدمة' : 'Search services'}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ar ? 'ابحث عن التحدي أو الخدمة' : 'Search a challenge or service'}
            className="w-full border-b border-ink-900/20 bg-transparent px-2 py-3"
          />
        </label>
      </div>
      <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div
          className="flex gap-2 overflow-x-auto pb-4 lg:sticky lg:top-28 lg:block lg:self-start"
          role="group"
          aria-label={ar ? 'مجالات العمل' : 'Business areas'}
        >
          {available.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={selected?.id === p.id && !search}
              onClick={() => {
                setActive(p.id);
                setQuery('');
              }}
              className={`practice-tab ${selected?.id === p.id && !search ? 'is-active' : ''}`}
            >
              {practiceLabel(p, locale, mode === 'need')}
              <span aria-hidden> →</span>
            </button>
          ))}
        </div>
        <div>
          <p className="mb-5 text-sm text-ink-500" role="status">
            {shown.length} {ar ? 'خدمة مرتبطة باحتياجك' : 'services for this need'}
          </p>
          {shown.length ? (
            <ServiceList
              locale={locale}
              groups={[
                {
                  id: selected?.id ?? 'results',
                  name: search
                    ? ar
                      ? 'نتائج البحث'
                      : 'Search results'
                    : selected
                      ? practiceLabel(selected, locale)
                      : '',
                  description: search
                    ? ''
                    : selected
                      ? ar
                        ? selected.summaryAr
                        : selected.summaryEn
                      : '',
                  services: shown,
                },
              ]}
            />
          ) : (
            <p>
              {ar
                ? 'لم نجد خدمة مطابقة. أخبرنا عن تحديك.'
                : 'No matching services. Tell us about your challenge.'}
            </p>
          )}
          <Link
            className="mt-8 inline-block text-sm font-semibold text-brand underline underline-offset-4"
            href={`/${locale}/start-a-project`}
          >
            {ar
              ? 'غير متأكد؟ لنحدد الأولوية معًا'
              : 'Not sure? Let’s identify the priority together'}
          </Link>
        </div>
      </div>
    </div>
  );
}
