import Image from "next/image";
import { homeAssets } from "@/data/assets";
import type { Dictionary } from "@/i18n";

export function ThreePaths({ dictionary }: { dictionary: Dictionary }) {
  const paths = [
    {
      title: dictionary.paths.discoverTitle,
      action: dictionary.paths.discoverAction,
      href: "#teas",
      image: homeAssets.shelfAngle,
    },
    {
      title: dictionary.paths.experienceTitle,
      action: dictionary.paths.experienceAction,
      href: "#tastings",
      image: homeAssets.teawareShelves,
    },
    {
      title: dictionary.paths.visitTitle,
      action: dictionary.paths.visitAction,
      href: "#visit",
      image: homeAssets.exterior,
    },
  ];

  return (
    <section className="three-paths" aria-label={dictionary.paths.label}>
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
