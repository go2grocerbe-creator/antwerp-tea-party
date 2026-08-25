import { navigationItems } from "@/data/navigation";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="The Antwerp Tea Party homepage">
        <span>The Antwerp</span>
        <span>Tea Party</span>
      </a>
      <nav className="site-nav" aria-label="Primary navigation">
        {navigationItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
