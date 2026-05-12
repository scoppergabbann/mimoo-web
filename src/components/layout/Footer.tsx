import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { MimooLogo } from './MimooLogo';
import { HeartIcon } from '@/components/ui/Icons';

export function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  const linkSections = [
    {
      title: t('product'),
      links: [
        { label: t('links.howItWorks'), href: '/how-it-works' },
        { label: t('links.products'), href: '/products' },
        { label: t('links.pricing'), href: '/pricing' },
      ],
    },
    {
      title: t('company'),
      links: [
        { label: t('links.about'), href: '/about' },
        { label: t('links.blog'), href: '/blog' },
        { label: t('links.careers'), href: '/careers' },
        { label: t('links.contact'), href: '/contact' },
      ],
    },
    {
      title: t('support'),
      links: [
        { label: t('links.help'), href: '/help' },
        { label: t('links.faq'), href: '/faq' },
      ],
    },
    {
      title: t('legal'),
      links: [
        { label: t('links.privacy'), href: '/legal/privacy' },
        { label: t('links.terms'), href: '/legal/terms' },
      ],
    },
  ];

  return (
    <footer className="bg-mimoo-cream-100 border-t border-mimoo-purple-100/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <MimooLogo size="md" />
            <p className="mt-4 text-sm text-mimoo-ink-500 leading-relaxed max-w-xs">
              {t('tagline')}
            </p>
          </div>

          {/* Link columns */}
          {linkSections.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h3 className="font-semibold text-mimoo-ink-900 mb-3 text-sm">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-mimoo-ink-500 hover:text-mimoo-purple-700 transition-colors focus:outline-none focus-visible:underline focus-visible:underline-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-mimoo-purple-100/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-mimoo-ink-500 inline-flex items-center gap-1.5">
            <span>{t('madeWith')}</span>
            <HeartIcon className="w-4 h-4 text-mimoo-pink-400" />
            <span>{t('by')}</span>
            <span aria-hidden="true">🇮🇩</span>
          </p>
          <p className="text-xs text-mimoo-ink-300">
            © {currentYear} Mimoo. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
