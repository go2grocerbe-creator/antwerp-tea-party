import Image from "next/image";
import { homeAssets } from "@/data/assets";

const paths = [
  {
    title: "Discover the shop",
    action: "Explore the tea collection",
    href: "#teas",
    image: homeAssets.shelfAngle,
  },
  {
    title: "Experience tea",
    action: "Book a tasting",
    href: "#tastings",
    image: homeAssets.teawareShelves,
  },
  {
    title: "Visit",
    action: "Find us in Antwerp",
    href: "#visit",
    image: homeAssets.exterior,
  },
];

export function ThreePaths() {
  return (
    <section className="three-paths" aria-label="Three ways to continue">
      {paths.map((path) => (
        <a className="path-panel" href={path.href} key={path.title}>
          <span className="path-panel__image">
            <Image src={path.image.src} alt={path.image.alt} fill sizes="(max-width: 768px) 100vw, 33vw" />
          </span>
          <span className="path-panel__text">
            <strong>{path.title}</strong>
            <span>{path.action}</span>
          </span>
        </a>
      ))}
    </section>
  );
}
