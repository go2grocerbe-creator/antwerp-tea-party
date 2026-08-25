import Image from "next/image";
import { homeAssets } from "@/data/assets";

const categories = ["Rare teas", "Pu Erh", "Matcha", "Teaware", "Gifts"];

export function ShopStory() {
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
        <p className="eyebrow">Inside the shop</p>
        <h2 id="shop-story-title">A tea shop built for curiosity.</h2>
        <p>
          Ask questions. Smell the leaves. Discover something unfamiliar. Or simply find
          the tea you already love.
        </p>
        <div className="category-line" aria-label="Shop categories">
          {categories.map((category) => (
            <span key={category}>{category}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
