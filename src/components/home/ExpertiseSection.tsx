import Image from "next/image";
import { homeAssets } from "@/data/assets";

export function ExpertiseSection() {
  return (
    <section className="expertise" id="about" aria-labelledby="expertise-title">
      <div className="expertise__copy">
        <p className="eyebrow">Knowledge</p>
        <h2 id="expertise-title">Tea chosen with knowledge.</h2>
        <p>
          A good tea shop is not only about selection. It is about helping someone
          discover what suits them.
        </p>
      </div>
      <div className="detail-grid" aria-label="Shop details">
        <figure>
          <Image
            src={homeAssets.porcelain.src}
            alt={homeAssets.porcelain.alt}
            fill
            sizes="(max-width: 768px) 50vw, 24vw"
          />
        </figure>
        <figure>
          <Image
            src={homeAssets.teapot.src}
            alt={homeAssets.teapot.alt}
            fill
            sizes="(max-width: 768px) 50vw, 24vw"
          />
        </figure>
      </div>
    </section>
  );
}
