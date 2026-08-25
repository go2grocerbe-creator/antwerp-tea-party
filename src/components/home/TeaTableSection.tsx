import Image from "next/image";
import { homeAssets } from "@/data/assets";
import { site } from "@/data/site";

export function TeaTableSection() {
  return (
    <section className="tea-table" id="tastings" aria-labelledby="tea-table-title">
      <div className="tea-table__chair" aria-hidden="true">
        <Image src={homeAssets.isolatedChair.src} alt="" fill sizes="(max-width: 768px) 78vw, 34vw" />
      </div>
      <div className="tea-table__copy">
        <p className="eyebrow">The table</p>
        <h2 id="tea-table-title">Some teas are better shared.</h2>
        <p>Tea tastings · Private gatherings · Conversations about tea</p>
        <div className="cta-row">
          <a className="button" href={site.ctas.bookTasting}>
            Book a tasting
          </a>
          <a className="text-link" href={site.ctas.experiences}>
            Discover tea experiences
          </a>
        </div>
      </div>
    </section>
  );
}
