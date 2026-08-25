"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { homeAssets } from "@/data/assets";
import { prototypeOrigins } from "@/data/origins";
import { site } from "@/data/site";

gsap.registerPlugin(ScrollTrigger);

export function OriginJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const leafRef = useRef<HTMLImageElement>(null);
  const tinRef = useRef<HTMLDivElement>(null);
  const shelfRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const labels = gsap.utils.toArray<HTMLElement>(".origin-label");

    if (reduceMotion) {
      gsap.set(labels, { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set([".tin-scene", ".shelf-reveal", ".story-copy"], {
        autoAlpha: 1,
      });
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        const timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=330%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        timeline
          .fromTo(leafRef.current, { autoAlpha: 0, scale: 0.9, rotate: -3 }, { autoAlpha: 1, scale: 1.08, rotate: 1.5, duration: 0.1 })
          .fromTo(titleRef.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0)
          .fromTo(labels, { autoAlpha: 0, y: 14, scale: 0.96 }, { autoAlpha: 0.86, y: 0, scale: 1, stagger: 0.035, duration: 0.25 }, 0.1)
          .to(titleRef.current, { y: -24, autoAlpha: 0, duration: 0.18 }, 0.28)
          .to(labels, { y: 16, scale: 0.86, autoAlpha: 0, stagger: 0.012, duration: 0.14 }, 0.36)
          .to(leafRef.current, { y: "27vh", rotate: 7, scale: 0.98, duration: 0.2 }, 0.45)
          .fromTo(".tin-scene", { autoAlpha: 0, y: "18vh", scale: 0.92 }, { autoAlpha: 1, y: "4vh", scale: 1, duration: 0.18 }, 0.53)
          .to(leafRef.current, { y: "41vh", scale: 0.42, autoAlpha: 0, duration: 0.13 }, 0.64)
          .fromTo(".tin-copy", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.68)
          .to(".tin-copy", { autoAlpha: 0, y: -12, duration: 0.12 }, 0.8)
          .to(tinRef.current, { scale: 0.34, y: "-10vh", autoAlpha: 0.72, duration: 0.18 }, 0.79)
          .fromTo(shelfRef.current, { autoAlpha: 0, scale: 1.08, x: "3vw" }, { autoAlpha: 1, scale: 1, x: 0, duration: 0.22 }, 0.8)
          .to([titleRef.current, leafRef.current, labels, tinRef.current, ".tin-copy"], { autoAlpha: 0, duration: 0.08 }, 0.91)
          .fromTo(".shelf-copy", { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.94);
      });

      mm.add("(max-width: 768px)", () => {
        const timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=210%",
            scrub: 0.8,
            pin: true,
          },
        });

        timeline
          .fromTo(leafRef.current, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1.05, duration: 0.12 })
          .fromTo(titleRef.current, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0)
          .fromTo(labels, { autoAlpha: 0, y: 10 }, { autoAlpha: 0.88, y: 0, stagger: 0.025, duration: 0.2 }, 0.12)
          .to(labels, { autoAlpha: 0, scale: 0.88, duration: 0.14 }, 0.36)
          .to(titleRef.current, { autoAlpha: 0, y: -18, duration: 0.14 }, 0.35)
          .to(leafRef.current, { y: "23vh", rotate: 7, scale: 0.9, duration: 0.24 }, 0.45)
          .fromTo(".tin-scene", { autoAlpha: 0, y: "15vh", scale: 0.9 }, { autoAlpha: 1, y: "2vh", scale: 1, duration: 0.18 }, 0.54)
          .to(leafRef.current, { autoAlpha: 0, y: "34vh", scale: 0.3, duration: 0.12 }, 0.66)
          .fromTo(".tin-copy", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.14 }, 0.69)
          .to(".tin-copy", { autoAlpha: 0, y: -10, duration: 0.1 }, 0.8)
          .to(tinRef.current, { scale: 0.46, y: "-8vh", autoAlpha: 0.68, duration: 0.16 }, 0.79)
          .fromTo(shelfRef.current, { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 0.2 }, 0.82)
          .to([titleRef.current, leafRef.current, labels, tinRef.current, ".tin-copy"], { autoAlpha: 0, duration: 0.08 }, 0.91)
          .fromTo(".shelf-copy", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.94);
      });

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="origin-journey" id="top" ref={sectionRef} aria-labelledby="home-title">
      <div className="origin-journey__stage">
        <div className="origin-title" ref={titleRef}>
          <p className="eyebrow">Origin · leaf · tin · table</p>
          <h1 id="home-title">Every cup begins somewhere.</h1>
          <p>Tea traditions shaped by place, climate and time.</p>
        </div>

        <div className="origin-orbit" aria-label="Prototype tea origins">
          {prototypeOrigins.map((origin) => (
            <span className={`origin-label ${origin.className}`} key={origin.name}>
              {origin.name}
            </span>
          ))}
        </div>

        <Image
          className="tea-leaf"
          ref={leafRef}
          src="/illustrations/tea-leaf.svg"
          alt="Botanical tea leaf illustration"
          width={220}
          height={360}
          priority
        />

        <div className="tin-scene" ref={tinRef} aria-hidden="true">
          <div className="tin-back-rim" />
          <div className="tin-mouth" />
          <div className="tin-body" />
          <div className="tin-front-rim" />
        </div>

        <div className="tin-copy story-copy">
          <h2>Stored with care.</h2>
          <p>Selected with knowledge.</p>
        </div>

        <div className="shelf-reveal" ref={shelfRef}>
          <Image
            src={homeAssets.shelfReveal.src}
            alt={homeAssets.shelfReveal.alt}
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
