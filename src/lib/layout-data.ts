import { getSettings, getNavigation } from './content';
import { pick, type Locale } from './i18n';
import { getDictionary } from './dictionary';
import type { NavLink } from '@/components/public/Navbar';
import type { FooterLink, SocialLink } from '@/components/public/Footer';

export async function getLayoutData(locale: Locale) {
  const [settings, header, footer] = await Promise.all([
    getSettings(),
    getNavigation('header'),
    getNavigation('footer'),
  ]);

  const dict = getDictionary(locale);

  const toLinks = (rows: typeof header): NavLink[] =>
    rows.map((r) => ({ id: r.id, label: pick(r, 'label', locale), href: r.href, external: r.external }));

  const socials: SocialLink[] = (
    [
      ['Instagram', settings.instagram],
      ['TikTok', settings.tiktok],
      ['LinkedIn', settings.linkedin],
      ['X', settings.x],
      ['YouTube', settings.youtube],
    ] as const
  )
    .filter(([, href]) => Boolean(href))
    .map(([label, href]) => ({ label, href }));

  return {
    settings,
    dict,
    companyName: pick(settings, 'companyName', locale) || 'Noriva',
    headerLinks: toLinks(header),
    footerLinks: toLinks(footer) as FooterLink[],
    socials,
    contact: {
      email: settings.contactEmail || settings.inquiryEmail,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      address: pick(settings, 'address', locale),
    },
  };
}
