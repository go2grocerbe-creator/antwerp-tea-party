"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { localePath, locales, type Dictionary, type Locale } from "@/i18n";

/** Swaps only the leading /{locale} segment, so switching language keeps the current page. */
function pathForLocale(pathname: string, target: Locale) {
  const segments = pathname.split("/");
  segments[1] = target;
  return segments.join("/") || `/${target}`;
}

export function SiteHeader({
  locale,
  dictionary,
  cartCount = 0,
}: {
  locale: Locale;
  dictionary: Dictionary;
  cartCount?: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    { label: dictionary.navigation.teas, href: localePath(locale, "/shop") },
    { label: dictionary.navigation.about, href: localePath(locale, "#about") },
    { label: dictionary.navigation.tastings, href: localePath(locale, "#tastings") },
    { label: dictionary.navigation.visit, href: localePath(locale, "#visit") },
  ];

  // Escape closes the drawer, focus returns to the toggle button.
  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // Focus the panel when it opens so keyboard/screen-reader users land inside it immediately.
  useEffect(() => {
    if (menuOpen) panelRef.current?.focus();
  }, [menuOpen]);

  // Trap Tab focus inside the open drawer.
  useEffect(() => {
    if (!menuOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <Link className="wordmark" href={localePath(locale, "#top")} aria-label={dictionary.navigation.home}>
        <span>The Antwerp</span>
        <span>Tea Party</span>
      </Link>

      <div className="site-header__controls">
        <nav className="site-nav" aria-label={dictionary.navigation.label}>
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          className="cart-link"
          href={localePath(locale, "/cart")}
          aria-label={`${dictionary.navigation.cart}${cartCount > 0 ? ` (${cartCount})` : ""}`}
        >
          <CartIcon />
          {cartCount > 0 && <span className="cart-link__badge">{cartCount}</span>}
        </Link>

        <details className="language-switcher" aria-label={dictionary.language.label}>
          <summary aria-label={dictionary.language[locale]}>{locale.toUpperCase()}</summary>
          <nav className="language-switcher__menu" aria-label={dictionary.language.label}>
            {locales.map((item) => (
              <a
                aria-current={item === locale ? "page" : undefined}
                aria-label={dictionary.language[item]}
                className={item === locale ? "is-active" : undefined}
                href={pathForLocale(pathname, item)}
                key={item}
              >
                {item.toUpperCase()}
              </a>
            ))}
          </nav>
        </details>

        <button
          ref={menuButtonRef}
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls={panelId}
          aria-label={menuOpen ? dictionary.navigation.menuClose : dictionary.navigation.menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="menu-toggle__bar" />
          <span className="menu-toggle__bar" />
          <span className="menu-toggle__bar" />
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu-scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}

      <div
        id={panelId}
        ref={panelRef}
        className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={dictionary.navigation.label}
        tabIndex={-1}
        hidden={!menuOpen}
      >
        <nav aria-label={dictionary.navigation.label} className="mobile-menu__nav">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href={localePath(locale, "/cart")} onClick={() => setMenuOpen(false)}>
            {dictionary.navigation.cart}
            {cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>
        </nav>
        <button type="button" className="mobile-menu__close text-link" onClick={() => setMenuOpen(false)}>
          {dictionary.navigation.menuClose}
        </button>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path
        d="M4 6h2l1.6 9.6A2 2 0 0 0 9.57 17.4h7.86a2 2 0 0 0 1.97-1.7L20.5 9H6.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="21" r="1.3" fill="currentColor" />
      <circle cx="17.5" cy="21" r="1.3" fill="currentColor" />
    </svg>
  );
}
