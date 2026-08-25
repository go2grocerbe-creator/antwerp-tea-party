import Image from "next/image";
import { homeAssets } from "@/data/assets";

export function ExpertiseSection() {
  return (
    <section className="expertise" id="about" aria-labelledby="expertise-title">
      <div className="expertise__copy">
        <p className="eyebrow">Knowledge</p>
        <h2 id="expertise-title">Tea chosen with knowledge.</h2>
        {/* TODO: replace with owner-selecting-tea photography when available. */}
        <p>
          A good tea shop is not only about selection. It is about helping someone
          discover what suits them.
        </p>
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
