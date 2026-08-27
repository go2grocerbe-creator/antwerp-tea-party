import { localePath, locales, type Dictionary, type Locale } from "@/i18n";

export function SiteHeader({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const navigationItems = [
    { label: dictionary.navigation.teas, href: "#teas" },
    { label: dictionary.navigation.about, href: "#about" },
    { label: dictionary.navigation.tastings, href: "#tastings" },
    { label: dictionary.navigation.visit, href: "#visit" },
  ];

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label={dictionary.navigation.home}>
        <span>The Antwerp</span>
        <span>Tea Party</span>
      </a>
      <div className="site-header__controls">
        <nav className="site-nav" aria-label={dictionary.navigation.label}>
          {navigationItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <nav className="language-switcher" aria-label={dictionary.language.label}>
          {locales.map((item) => (
            <a
              aria-current={item === locale ? "page" : undefined}
              aria-label={dictionary.language[item]}
              className={item === locale ? "is-active" : undefined}
              href={localePath(item)}
              key={item}
            >
              {item.toUpperCase()}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
