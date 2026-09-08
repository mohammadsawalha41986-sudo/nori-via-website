import {
  getSettings,
  getNavigation,
  getSocialLinks,
  getFloatingActions,
  getServiceCategories,
  getPublishedServices,
} from './content';
import { pick, type Locale } from './i18n';
import { env } from './env';
import { publicWebsiteUrl } from './site-url';
import { getDictionary } from './dictionary';
import type { NavLink } from '@/components/public/Navbar';
import type {
  FooterBackground,
  FooterLink,
  FooterServiceGroup,
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
      ['instagram', 'Instagram', settings.instagram],
      ['tiktok', 'TikTok', settings.tiktok],
      ['linkedin', 'LinkedIn', settings.linkedin],
      ['x', 'X', settings.x],
      ['youtube', 'YouTube', settings.youtube],
    ] as const
  )
    .filter(([, , href]) => Boolean(href))
    .map(([platform, label, href]) => ({ platform, label, href }));

  const socials: SocialLink[] = socialRows.length
    ? socialRows.map((row) => ({
        platform: row.platform.toLowerCase(),
        label: pick(row, 'label', locale) || PLATFORM_LABELS[row.platform] || row.platform,
        href: row.url,
      }))
    : legacySocials;

  /**
   * The footer's service columns.
   *
   * Each column is a practice group with its published services beneath it —
   * the shape the reference layout asks for, and far more useful than a single
   * long list. Only groups that actually have something published become a
   * column, so a footer link can never point at an empty page.
   *
   * How many columns there are is decided by the data, not by the layout: with
   * three or more populated groups the footer shows three, with two it shows
   * two, and with one it shows one. Services inside a group are capped so a
   * column has a deliberate ending rather than growing with the taxonomy; the
   * group heading itself links to the full list.
   */
  const populatedGroups = serviceCategories
    .map((category) => ({
      category,
      items: services.filter((s) => s.categoryId === category.id),
    }))
    .filter((g) => g.items.length > 0);

  const groupCount = Math.min(populatedGroups.length, FOOTER_SERVICE_GROUPS);
  // Fewer columns means each one can carry more before it looks thin.
  const perGroup = groupCount >= 3 ? 6 : groupCount === 2 ? 8 : 10;

  const footerServiceGroups: FooterServiceGroup[] = populatedGroups
    .slice(0, groupCount)
    .map(({ category, items }) => ({
      id: category.id,
      label: pick(category, 'name', locale),
      href: `/services#group-${category.id}`,
      items: items.slice(0, perGroup).map((s) => ({
        id: s.id,
        label: pick(s, 'name', locale),
        href: `/services/${s.slug}`,
      })),
    }));

  const footerBackground: FooterBackground = {
    type: settings.footerBackgroundType,
    image: settings.footerBackgroundImage,
    color: settings.footerBackgroundColor,
    position: settings.footerBackgroundPosition,
    overlayColor: settings.footerOverlayColor,
    overlayOpacity: settings.footerOverlayOpacity,
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
    footerServiceGroups,
    footerBackground,
    socials,
    contact: {
      email: settings.contactEmail || settings.inquiryEmail,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      address: pick(settings, 'address', locale),
      // The public site URL, shown in the footer as the studio's own address.
      // It comes from configuration rather than being typed into a component,
      // and is resolved so a hosting platform's hostname can never surface
      // here in place of the brand's domain.
      website: publicWebsiteUrl(env.siteUrl),
    },
  };
}


/** The most service columns the footer will show, however deep the taxonomy. */
const FOOTER_SERVICE_GROUPS = 3;

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
