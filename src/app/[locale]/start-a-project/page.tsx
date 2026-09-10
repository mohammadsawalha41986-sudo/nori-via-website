import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/public/PageHero';
import { InquiryForm } from '@/components/public/InquiryForm';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import { getPage, getSettings } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { summarise } from '@/lib/seo-text';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const page = await getPage('start-a-project');
  return buildMetadata({
    row: page,
    locale,
    path: '/start-a-project',
    fallbackTitle: getDictionary(locale).nav.start,
    fallbackDescription: page ? summarise(pick(page, 'body', locale)) : '',
  });
}

export default async function StartAProjectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const [page, settings] = await Promise.all([getPage('start-a-project'), getSettings()]);
  const email = settings.contactEmail || settings.inquiryEmail;

  return (
    <>
      <PageHero
        eyebrow={dict.nav.start}
        title={page ? pick(page, 'title', locale) : dict.nav.start}
        description={page ? pick(page, 'body', locale) : undefined}
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="shell max-w-3xl">
          <InquiryForm dict={dict} locale={locale} />

          {email && (
            <p className="mt-8 text-center text-sm text-ink-400">
              {dict.common.email}:{' '}
              <a href={`mailto:${email}`} className="font-semibold text-ink-700 underline transition-colors hover:text-brand">
                {email}
              </a>
            </p>
          )}
        </div>
      </section>
    </>
  );
}
