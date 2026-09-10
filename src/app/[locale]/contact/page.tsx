import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/public/PageHero';
import { sectionHero } from '@/lib/section-images';
import { ContactForm } from '@/components/public/ContactForm';
import { Reveal } from '@/components/ui/Reveal';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import { getPage, getSettings } from '@/lib/content';
import { buildMetadata, JsonLd, breadcrumbs, organizationSchema } from '@/lib/seo';
import { summarise } from '@/lib/seo-text';
import { brandName } from '@/lib/brand';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const page = await getPage('contact');
  return buildMetadata({
    row: page,
    locale,
    path: '/contact',
    fallbackTitle: getDictionary(locale).nav.contact,
    fallbackDescription: page ? summarise(pick(page, 'body', locale)) : '',
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const [page, settings] = await Promise.all([getPage('contact'), getSettings()]);

  const email = settings.contactEmail || settings.inquiryEmail;
  const address = pick(settings, 'address', locale);

  const rows = [
    email && { label: dict.common.email, value: email, href: `mailto:${email}` },
    settings.phone && { label: dict.common.phone, value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, '')}` },
    settings.whatsapp && {
      label: dict.common.whatsapp,
      value: settings.whatsapp,
      href: `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`,
    },
    address && { label: dict.common.location, value: address, href: settings.mapsUrl || undefined },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  const socials = (
    [
      ['Instagram', settings.instagram],
      ['TikTok', settings.tiktok],
      ['LinkedIn', settings.linkedin],
      ['X', settings.x],
      ['YouTube', settings.youtube],
    ] as const
  ).filter(([, href]) => Boolean(href));

  return (
    <>
      <JsonLd
        data={breadcrumbs(locale, [
          { name: brandName(locale), path: '/' },
          { name: dict.nav.contact, path: '/contact' },
        ])}
      />
      {/*
        The same organisation node as the homepage, not a second one: it repeats
        the `@id`, so the contact details published here attach to the existing
        entity rather than creating a look-alike company beside it.
      */}
      <JsonLd
        data={organizationSchema({
          locale,
          email,
          telephone: settings.phone,
          sameAs: socials.map(([, href]) => href as string),
          logoUrl: settings.logoUrl,
        })}
      />

      <PageHero
        eyebrow={dict.nav.contact}
        title={page ? pick(page, 'title', locale) : dict.nav.contact}
        description={page ? pick(page, 'body', locale) : undefined}
        image={sectionHero('contact')}
      />

      <section className="bg-bone py-24 sm:py-32">
        <div className="shell grid gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
          <Reveal>
            {rows.length > 0 ? (
              <dl className="border-t border-ink-900/10">
                {rows.map((r) => (
                  <div key={r.label} className="border-b border-ink-900/10 py-6">
                    <dt className="text-xs font-bold uppercase tracking-[0.22em] text-ink-400">{r.label}</dt>
                    <dd className="mt-2.5 text-lg text-ink-900">
                      {r.href ? (
                        <a
                          href={r.href}
                          target={r.href.startsWith('http') ? '_blank' : undefined}
                          rel={r.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          dir={r.label === dict.common.phone ? 'ltr' : undefined}
                          className="transition-colors duration-300 hover:text-brand"
                        >
                          {r.value}
                        </a>
                      ) : (
                        r.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="rounded-xl border border-dashed border-ink-900/20 p-6 text-sm text-ink-400">
                {dict.common.empty}
              </p>
            )}

            {socials.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {socials.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-full border border-ink-900/15 px-4 py-2 text-xs font-semibold transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-white"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>

          <Reveal delay={120}>
            <h2 className="mb-8 font-display text-2xl uppercase text-ink-900">
              {dict.contact.formTitle}
            </h2>
            <ContactForm dict={dict} locale={locale} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
