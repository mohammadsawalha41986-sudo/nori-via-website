import { getSettings, getNavigation, getSocialLinks, getFloatingActions } from './content';
import { pick, type Locale } from './i18n';
import { getDictionary } from './dictionary';
import type { NavLink } from '@/components/public/Navbar';
import type { FooterLink, SocialLink } from '@/components/public/Footer';

export async function getLayoutData(locale: Locale) {
  const [settings, header, footer, socialRows, floatingRows] = await Promise.all([
    getSettings(),
    getNavigation('header'),
    getNavigation('footer'),
    getSocialLinks(),
    getFloatingActions(),
  ]);

  const dict = getDictionary(locale);

  const toLinks = (rows: typeof header): NavLink[] =>
    rows.map((r) => ({ id: r.id, label: pick(r, 'label', locale), href: r.href, external: r.external }));

  /**
   * Social channels are managed as rows in Admin. The original fixed columns on
   * SiteSettings remain the fallback, so a site that has not migrated its links
   * yet keeps rendering exactly what it renders today.
   */
  const legacySocials: SocialLink[] = (
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

  const socials: SocialLink[] = socialRows.length
    ? socialRows.map((row) => ({
        label: pick(row, 'label', locale) || PLATFORM_LABELS[row.platform] || row.platform,
        href: row.url,
      }))
    : legacySocials;

  const floatingActions = floatingRows.map((row) => ({
    id: row.id,
    kind: row.kind,
    label: pick(row, 'label', locale) || defaultActionLabel(row.kind, dict),
    value: row.value,
  }));

  return {
    settings,
    dict,
    companyName: pick(settings, 'companyName', locale) || 'Noriva',
    headerLinks: toLinks(header),
    floatingActions,
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


const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  x: 'X',
  facebook: 'Facebook',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  whatsapp: 'WhatsApp',
  snapchat: 'Snapchat',
  threads: 'Threads',
  pinterest: 'Pinterest',
  website: 'Website',
};

/** Falls back to a translated label when an editor leaves the label empty. */
function defaultActionLabel(kind: string, dict: ReturnType<typeof getDictionary>) {
  switch (kind) {
    case 'phone':
      return dict.common.phone;
    case 'email':
      return dict.common.email;
    case 'link':
      return dict.nav.contact;
    default:
      return dict.common.whatsapp;
  }
}
