"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { homeAssets } from "@/data/assets";
import { prototypeOrigins } from "@/data/origins";
import { site } from "@/data/site";

gsap.registerPlugin(ScrollTrigger);

const leaves = [
  { className: "leaf-a", src: homeAssets.isolatedSingleLeaf.src },
  { className: "leaf-b", src: homeAssets.isolatedSingleLeaf.src },
  { className: "leaf-c", src: homeAssets.isolatedSingleLeaf.src },
  { className: "leaf-d", src: homeAssets.isolatedSingleLeaf.src },
  { className: "leaf-e", src: homeAssets.isolatedSingleLeaf.src },
  { className: "leaf-f", src: homeAssets.isolatedSingleLeaf.src },
];

function JourneyLeaf({ className, src }: { className: string; src: string }) {
  return (
    <Image
      className={`journey-leaf ${className}`}
      src={src}
      alt=""
      width={420}
      height={460}
      priority
    />
  );
}

function TinCanister({ className = "" }: { className?: string }) {
  return (
    <div className={`tin-scene tin-photo tin-photo--open ${className}`} aria-hidden="true">
      <Image
        src={homeAssets.isolatedTinOpen.src}
        alt=""
        fill
        sizes="(max-width: 768px) 58vw, 31vw"
      />
      <span className="tin-opening-mask" />
    </div>
  );
}

export function OriginJourney() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const labels = gsap.utils.toArray<HTMLElement>(".origin-label");
    const journeyLeaves = gsap.utils.toArray<HTMLElement>(".journey-leaf");
    const originPaths = gsap.utils.toArray<SVGPathElement>(".origin-path");

    if (reduceMotion) {
      gsap.set(
        [
          ".origin-title",
          ".origin-map",
          ".tin-scene",
          ".shelf-reveal",
          ".shelf-copy",
          ".teapot-layer",
          ".hero-cup",
          ".hero-scroll-cue",
          ".journey-leaf",
        ],
        { autoAlpha: 1 },
      );
      gsap.set(labels, { autoAlpha: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set([".teapot-layer", ".origin-map", ".tin-scene", ".tin-copy", ".shelf-reveal", ".shelf-copy"], {
        autoAlpha: 0,
      });
      gsap.set(".teapot-steam-line", { autoAlpha: 0, y: 18, scaleY: 0.72 });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        const timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=560%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        timeline
          .fromTo(".hero-cup", { autoAlpha: 1, y: 0, scale: 1 }, { autoAlpha: 1, y: -10, scale: 1.012, duration: 0.1 }, 0)
          .to(".hero-scroll-cue", { autoAlpha: 0, y: 18, duration: 0.08 }, 0.08)
          .to(".hero-cup", { autoAlpha: 0, y: -62, scale: 0.92, duration: 0.12 }, 0.12)
          .fromTo(".teapot-layer", { autoAlpha: 0, y: 42, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.14 }, 0.16)
          .fromTo(".teapot-steam-line", { autoAlpha: 0, y: 26, scaleY: 0.72 }, { autoAlpha: 0.55, y: 0, scaleY: 1, stagger: 0.025, duration: 0.14 }, 0.2)
          .to(".teapot-layer", { autoAlpha: 0, y: -36, scale: 0.96, duration: 0.12 }, 0.32)
          .fromTo(journeyLeaves, { autoAlpha: 0, scale: 0.58, rotate: -8 }, { autoAlpha: 1, scale: 0.82, rotate: 0, stagger: 0.035, duration: 0.08 }, 0.34)
          .to(".leaf-a", { x: -72, y: -38, rotate: -18, scale: 0.9, duration: 0.14 }, 0.36)
          .to(".leaf-b", { x: 88, y: -24, rotate: 16, scale: 0.82, duration: 0.14 }, 0.36)
          .to(".leaf-c", { x: -96, y: 62, rotate: 22, scale: 0.78, duration: 0.14 }, 0.36)
          .to(".leaf-d", { x: 116, y: 70, rotate: -24, scale: 0.86, duration: 0.14 }, 0.36)
          .to(".leaf-e", { x: -12, y: 118, rotate: 10, scale: 0.72, duration: 0.14 }, 0.36)
          .to(".leaf-f", { x: 12, y: -112, rotate: -8, scale: 0.76, duration: 0.14 }, 0.36)

          .to(".origin-title", { autoAlpha: 0, y: -22, duration: 0.1 }, 0.42)
          .fromTo(".origin-map", { autoAlpha: 0, scale: 0.98 }, { autoAlpha: 1, scale: 1, duration: 0.12 }, 0.42)
          .fromTo(labels, { autoAlpha: 0, y: 8 }, { autoAlpha: 0.9, y: 0, stagger: 0.02, duration: 0.12 }, 0.45)
          .fromTo(originPaths, { autoAlpha: 0, strokeDashoffset: 1 }, { autoAlpha: 0.55, strokeDashoffset: 0, stagger: 0.015, duration: 0.12 }, 0.46)
          .to(".leaf-a", { x: "-30vw", y: "-19vh", rotate: -35, scale: 0.48, duration: 0.18 }, 0.46)
          .to(".leaf-b", { x: "27vw", y: "-17vh", rotate: 26, scale: 0.5, duration: 0.18 }, 0.46)
          .to(".leaf-c", { x: "-34vw", y: "11vh", rotate: 38, scale: 0.46, duration: 0.18 }, 0.46)
          .to(".leaf-d", { x: "32vw", y: "8vh", rotate: -34, scale: 0.5, duration: 0.18 }, 0.46)
          .to(".leaf-e", { x: "-17vw", y: "27vh", rotate: 20, scale: 0.44, duration: 0.18 }, 0.46)
          .to(".leaf-f", { x: "15vw", y: "27vh", rotate: -18, scale: 0.44, duration: 0.18 }, 0.46)

          .to(labels, { autoAlpha: 0, y: 10, scale: 0.92, stagger: 0.01, duration: 0.1 }, 0.64)
          .to(originPaths, { autoAlpha: 0, duration: 0.08 }, 0.65)
          .to(".origin-map", { autoAlpha: 0, scale: 0.96, duration: 0.12 }, 0.68)
          .to(journeyLeaves, { x: 0, y: "23vh", rotate: 7, scale: 0.72, stagger: 0.012, duration: 0.16 }, 0.68)
          .fromTo(".storage-tin", { autoAlpha: 0, y: "18vh", scale: 0.94 }, { autoAlpha: 1, y: "4vh", scale: 1, duration: 0.14 }, 0.74)
          .to(journeyLeaves, { y: "38vh", scale: 0.22, autoAlpha: 0, stagger: 0.01, duration: 0.12 }, 0.82)
          .fromTo(".tin-copy", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.88)

          .to(".tin-copy", { autoAlpha: 0, y: -12, duration: 0.08 }, 0.96)
          .fromTo(".shelf-reveal", { autoAlpha: 0, scale: 1.12, x: "4vw" }, { autoAlpha: 1, scale: 1, x: 0, duration: 0.16 }, 0.98)
          .to(".storage-tin", { scale: 0.18, y: "-10vh", x: "-3vw", autoAlpha: 0, duration: 0.14 }, 0.98)
          .fromTo(".shelf-copy", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 1.08);
      });

      mm.add("(max-width: 768px)", () => {
        const mobileLeaves = journeyLeaves.slice(0, 4);
        const hiddenLeaves = journeyLeaves.slice(4);
        gsap.set(hiddenLeaves, { display: "none" });

        const timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=450%",
            scrub: 0.85,
            pin: true,
          },
        });

        timeline
          .fromTo(".hero-cup", { autoAlpha: 1, y: 0, scale: 1 }, { autoAlpha: 1, y: -6, scale: 1.012, duration: 0.1 }, 0)
          .to(".hero-scroll-cue", { autoAlpha: 0, y: 16, duration: 0.08 }, 0.08)
          .to(".hero-cup", { autoAlpha: 0, y: -42, scale: 0.9, duration: 0.12 }, 0.13)
          .fromTo(".teapot-layer", { autoAlpha: 0, y: 30, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.14 }, 0.16)
          .fromTo(".teapot-steam-line", { autoAlpha: 0, y: 20, scaleY: 0.74 }, { autoAlpha: 0.5, y: 0, scaleY: 1, stagger: 0.02, duration: 0.14 }, 0.2)
          .to(".teapot-layer", { autoAlpha: 0, y: -28, scale: 0.96, duration: 0.12 }, 0.32)
          .fromTo(mobileLeaves, { autoAlpha: 0, scale: 0.54 }, { autoAlpha: 1, scale: 0.74, stagger: 0.03, duration: 0.1 }, 0.34)
          .to(".leaf-a", { x: -48, y: -34, rotate: -18, scale: 0.72, duration: 0.12 }, 0.36)
          .to(".leaf-b", { x: 48, y: -24, rotate: 14, scale: 0.68, duration: 0.12 }, 0.36)
          .to(".leaf-c", { x: -46, y: 56, rotate: 20, scale: 0.66, duration: 0.12 }, 0.36)
          .to(".leaf-d", { x: 52, y: 62, rotate: -22, scale: 0.68, duration: 0.12 }, 0.36)
          .to(".origin-title", { autoAlpha: 0, y: -18, duration: 0.1 }, 0.42)
          .fromTo(".origin-map", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.44)
          .fromTo(labels.slice(0, 4), { autoAlpha: 0, y: 8 }, { autoAlpha: 0.9, y: 0, stagger: 0.02, duration: 0.12 }, 0.45)
          .to(".leaf-a", { x: "-30vw", y: "-12vh", scale: 0.34, rotate: -28, duration: 0.16 }, 0.46)
          .to(".leaf-b", { x: "28vw", y: "-10vh", scale: 0.34, rotate: 24, duration: 0.16 }, 0.46)
          .to(".leaf-c", { x: "-28vw", y: "13vh", scale: 0.32, rotate: 30, duration: 0.16 }, 0.46)
          .to(".leaf-d", { x: "28vw", y: "12vh", scale: 0.32, rotate: -30, duration: 0.16 }, 0.46)
          .to(labels, { autoAlpha: 0, duration: 0.08 }, 0.64)
          .to(".origin-map", { autoAlpha: 0, duration: 0.1 }, 0.66)
          .to(mobileLeaves, { x: 0, y: "22vh", rotate: 7, scale: 0.45, stagger: 0.012, duration: 0.14 }, 0.68)
          .fromTo(".storage-tin", { autoAlpha: 0, y: "14vh", scale: 0.82 }, { autoAlpha: 1, y: "2vh", scale: 0.88, duration: 0.14 }, 0.74)
          .to(mobileLeaves, { autoAlpha: 0, y: "32vh", scale: 0.18, stagger: 0.01, duration: 0.1 }, 0.82)
          .fromTo(".tin-copy", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.88)
          .to(".tin-copy", { autoAlpha: 0, y: -10, duration: 0.08 }, 0.96)
          .fromTo(".shelf-reveal", { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.16 }, 0.98)
          .to(".storage-tin", { scale: 0.25, y: "-7vh", autoAlpha: 0, duration: 0.12 }, 1)
          .fromTo(".shelf-copy", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 1.08);
      });

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="origin-journey" id="top" ref={sectionRef} aria-labelledby="home-title">
      <div className="origin-journey__stage">
        <div className="origin-title">
          <p className="eyebrow">Leaf · origin · storage · cup</p>
          <h1 id="home-title">Every cup begins somewhere.</h1>
          <p>Follow the leaf into the shop, the kettle, and the quiet of the table.</p>
        </div>

        <div className="hero-cup" aria-hidden="true">
          <Image
            src={homeAssets.isolatedCupLeaves.src}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 76vw, 36vw"
          />
        </div>

        <div className="hero-scroll-cue" aria-hidden="true">
          <span>Scroll to follow the journey</span>
          <i />
        </div>

        <div className="teapot-layer" aria-hidden="true">
          <Image
            className="teapot-layer__image"
            src={homeAssets.isolatedFloralTeapot.src}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 78vw, 36vw"
          />
          <svg className="teapot-steam" viewBox="0 0 220 240">
            <path className="teapot-steam-line teapot-steam-one" d="M74 220 C54 178 104 155 82 116 C60 79 101 61 94 24" />
            <path className="teapot-steam-line teapot-steam-two" d="M116 222 C94 180 143 151 118 111 C96 76 133 58 130 18" />
            <path className="teapot-steam-line teapot-steam-three" d="M156 216 C137 180 179 150 155 112 C134 80 170 64 164 29" />
          </svg>
        </div>

        <div className="leaf-field" aria-hidden="true">
          {leaves.map((leaf) => (
            <JourneyLeaf className={leaf.className} key={leaf.className} src={leaf.src} />
          ))}
        </div>

        <div className="origin-map" aria-label="Tea sourcing locations">
          <svg className="origin-paths" viewBox="0 0 100 100" aria-hidden="true">
            <path className="origin-path" pathLength="1" d="M50 50 C40 35 34 27 25 22" />
            <path className="origin-path" pathLength="1" d="M50 50 C61 34 69 26 78 23" />
            <path className="origin-path" pathLength="1" d="M50 50 C36 54 29 62 19 70" />
            <path className="origin-path" pathLength="1" d="M50 50 C62 54 72 60 82 68" />
            <path className="origin-path" pathLength="1" d="M50 50 C43 68 39 78 35 88" />
            <path className="origin-path" pathLength="1" d="M50 50 C58 68 63 78 68 88" />
          </svg>
          {prototypeOrigins.map((origin) => (
            <span className={`origin-label ${origin.className}`} key={origin.name}>
              {origin.name}
            </span>
          ))}
        </div>

        <TinCanister className="storage-tin" />

        <div className="tin-copy story-copy">
          <h2>Stored with care.</h2>
          <p>Selected with knowledge.</p>
        </div>

        <div className="shelf-reveal">
          <Image
            src={homeAssets.journeyShelf.src}
            alt={homeAssets.journeyShelf.alt}
            fill
            priority
            sizes="100vw"
          />
        </div>

        <div className="shelf-copy story-copy">
          <h2>Hundreds of teas. One place to discover them.</h2>
          <p>Find the tea that feels like yours.</p>
          <a className="button" href={site.ctas.exploreTeas}>
            Explore the teas
          </a>
        </div>
      </div>
    </section>
  );
}
