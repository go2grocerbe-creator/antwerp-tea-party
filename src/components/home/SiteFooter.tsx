import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="visit" aria-labelledby="visit-title">
      <div>
        <p className="eyebrow">Visit</p>
        <h2 id="visit-title">Come find your tea.</h2>
      </div>
      <address>
        <strong>{site.address.street}</strong>
        <span>{site.address.city}</span>
      </address>
      <dl className="footer-list">
        <div>
          <dt>Opening hours</dt>
          <dd>{site.contact.hours}</dd>
        </div>
        <div>
          <dt>Telephone</dt>
          <dd>{site.contact.phone}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{site.contact.email}</dd>
        </div>
        <div>
          <dt>Instagram</dt>
          <dd>{site.contact.instagram}</dd>
        </div>
      </dl>
      <p className="philosophy">{site.philosophy}</p>
    </footer>
  );
}
