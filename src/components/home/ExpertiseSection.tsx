import Image from "next/image";
import { homeAssets } from "@/data/assets";
import type { Dictionary } from "@/i18n";

export function ExpertiseSection({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="expertise" id="about" aria-labelledby="expertise-title">
      <div className="expertise__copy">
        <p className="eyebrow">{dictionary.knowledge.eyebrow}</p>
        <h2 id="expertise-title">{dictionary.knowledge.title}</h2>
        {/* TODO: replace with owner-selecting-tea photography when available. */}
        <p>{dictionary.knowledge.body}</p>
      </div>
      <div className="detail-grid" aria-label="Shop details">
        <figure>
          <Image
            src={homeAssets.shelfAngle.src}
            alt={homeAssets.shelfAngle.alt}
            fill
            sizes="(max-width: 768px) 50vw, 24vw"
          />
        </figure>
        <figure>
          <Image
            src={homeAssets.blackTin.src}
            alt={homeAssets.blackTin.alt}
            fill
            sizes="(max-width: 768px) 50vw, 24vw"
          />
        </figure>
      </div>
    </section>
  );
}
