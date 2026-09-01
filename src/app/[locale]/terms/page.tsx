import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/public/PageHero';
import { Prose } from '@/components/ui/Prose';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import { getPage } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { summarise } from '@/lib/seo-text';

export const revalidate = 300;

const PAGE_KEY = 'terms';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const page = await getPage(PAGE_KEY);
  return buildMetadata({
    row: page,
    locale,
    path: `/${PAGE_KEY}`,
    fallbackTitle: page ? pick(page, 'title', locale) : PAGE_KEY,
    fallbackDescription: page ? summarise(pick(page, 'body', locale)) : '',
  });
}

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const page = await getPage(PAGE_KEY);
  if (!page) notFound();

  return (
    <>
      <PageHero title={pick(page, 'title', locale)} />
      <section className="bg-bone py-20 sm:py-28">
        <div className="shell max-w-3xl">
          <Prose text={pick(page, 'body', locale)} className="text-[1.0625rem]" />
        </div>
      </section>
    </>
  );
}
