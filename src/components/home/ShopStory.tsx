import Image from "next/image";
import { homeAssets } from "@/data/assets";
import type { Dictionary } from "@/i18n";

export function ShopStory({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="shop-story" id="teas" aria-labelledby="shop-story-title">
      <div className="shop-story__image">
        <Image
          src={homeAssets.heroStore.src}
          alt={homeAssets.heroStore.alt}
          fill
          sizes="(max-width: 768px) 100vw, 64vw"
        />
      </div>
      <div className="shop-story__copy">
        <p className="eyebrow">{dictionary.shop.eyebrow}</p>
        <h2 id="shop-story-title">{dictionary.shop.title}</h2>
        <p>{dictionary.shop.body}</p>
        <div className="category-line" aria-label="Shop categories">
          {dictionary.shop.categories.map((category) => (
            <span key={category}>{category}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
