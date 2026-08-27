import Image from "next/image";
import { homeAssets } from "@/data/assets";
import { localePath, type Dictionary, type Locale } from "@/i18n";

export function TeaTableSection({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  return (
    <section className="tea-table" id="tastings" aria-labelledby="tea-table-title">
      <div className="tea-table__chair" aria-hidden="true">
        <Image src={homeAssets.isolatedChair.src} alt="" fill sizes="(max-width: 768px) 78vw, 34vw" />
      </div>
      <div className="tea-table__copy">
        <p className="eyebrow">{dictionary.table.eyebrow}</p>
        <h2 id="tea-table-title">{dictionary.table.title}</h2>
        <p>{dictionary.table.body}</p>
        <div className="cta-row">
          <a className="button" href={localePath(locale, "#visit")}>
            {dictionary.table.primaryCta}
          </a>
          <a className="text-link" href={localePath(locale, "#tastings")}>
            {dictionary.table.secondaryCta}
          </a>
        </div>
      </div>
    </section>
  );
}
