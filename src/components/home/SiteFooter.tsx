import { site } from "@/data/site";
import type { Dictionary } from "@/i18n";

export function SiteFooter({ dictionary }: { dictionary: Dictionary }) {
  return (
    <footer className="site-footer" id="visit" aria-labelledby="visit-title">
      <div>
        <p className="eyebrow">{dictionary.footer.eyebrow}</p>
        <h2 id="visit-title">{dictionary.footer.title}</h2>
      </div>
      <address>
        <strong>{site.address.street}</strong>
        <span>{site.address.city}</span>
      </address>
      <dl className="footer-list">
        <div>
          <dt>{dictionary.footer.openingHours}</dt>
          <dd>{dictionary.footer.hoursValue}</dd>
        </div>
        <div>
          <dt>{dictionary.footer.telephone}</dt>
          <dd>{dictionary.footer.phoneValue}</dd>
        </div>
        <div>
          <dt>{dictionary.footer.email}</dt>
          <dd>{dictionary.footer.emailValue}</dd>
        </div>
        <div>
          <dt>{dictionary.footer.instagram}</dt>
          <dd>{dictionary.footer.instagramValue}</dd>
        </div>
      </dl>
      <p className="philosophy">{site.philosophy}</p>
    </footer>
  );
}
