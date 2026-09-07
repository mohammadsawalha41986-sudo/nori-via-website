import {
  getSettings,
  getNavigation,
  getSocialLinks,
  getFloatingActions,
  getServiceCategories,
  getPublishedServices,
} from './content';
import { pick, type Locale } from './i18n';
import { getDictionary } from './dictionary';
import type { NavLink } from '@/components/public/Navbar';
import type {
  FooterBackground,
  FooterLink,
  FooterService,
  SocialLink,
} from '@/components/public/Footer';

export async function getLayoutData(locale: Locale) {
  const [settings, header, footer, socialRows, floatingRows, serviceCategories, services] =
    await Promise.all([
      getSettings(),
      getNavigation('header'),
      getNavigation('footer'),
      getSocialLinks(),
      getFloatingActions(),
      getServiceCategories(),
      getPublishedServices(),
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

  /**
   * The footer's Services column lists the practice groups rather than every
   * service, and only the groups that have something published in them — the
   * same rule the services index uses to decide which anchors exist, so a
   * footer link can never point at a heading that is not on the page.
   *
   * Capped at six so the column has a deliberate ending rather than growing
   * with the taxonomy; the footer renders an "all services" link after it.
   */
  const footerServices: FooterService[] = serviceCategories
    .filter((c) => services.some((s) => s.categoryId === c.id))
    .map((c) => ({ id: c.id, label: pick(c, 'name', locale) }))
    .slice(0, 6);

  const footerBackground: FooterBackground = {
    type: settings.footerBackgroundType,
    image: settings.footerBackgroundImage,
    color: settings.footerBackgroundColor,
  };

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
    footerServices,
    footerBackground,
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
