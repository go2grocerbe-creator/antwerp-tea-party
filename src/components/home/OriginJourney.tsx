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
      gsap.set([".tin-opening", ".tin-body", ".shelf-reveal", ".story-copy"], {
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
          .fromTo(leafRef.current, { autoAlpha: 0, scale: 0.92, rotate: -4 }, { autoAlpha: 1, scale: 1, rotate: 2, duration: 0.18 })
          .fromTo(labels, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, stagger: 0.035, duration: 0.2 }, 0.13)
          .to(titleRef.current, { y: -28, autoAlpha: 0.56, duration: 0.22 }, 0.18)
          .to(labels, { x: 0, y: 18, scale: 0.82, autoAlpha: 0, stagger: 0.015, duration: 0.22 }, 0.36)
          .to(leafRef.current, { y: "28vh", rotate: 9, scale: 0.9, duration: 0.25 }, 0.42)
          .fromTo(".tin-opening", { autoAlpha: 0, scale: 0.62 }, { autoAlpha: 1, scale: 1, duration: 0.2 }, 0.43)
          .fromTo(".tin-body", { autoAlpha: 0, y: 80, scale: 1.08 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.24 }, 0.5)
          .to(leafRef.current, { y: "42vh", scale: 0.34, autoAlpha: 0, duration: 0.16 }, 0.62)
          .fromTo(".tin-copy", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.65)
          .to(tinRef.current, { scale: 0.48, y: "-4vh", duration: 0.28 }, 0.72)
          .fromTo(shelfRef.current, { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 1, scale: 1, duration: 0.32 }, 0.76)
          .fromTo(".shelf-copy", { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.18 }, 0.86);
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
          .fromTo(leafRef.current, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.2 })
          .fromTo(labels, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.025, duration: 0.18 }, 0.12)
          .to(labels, { autoAlpha: 0, scale: 0.9, duration: 0.2 }, 0.36)
          .to(titleRef.current, { autoAlpha: 0, y: -18, duration: 0.18 }, 0.38)
          .to(leafRef.current, { y: "24vh", rotate: 7, scale: 0.82, duration: 0.28 }, 0.42)
          .fromTo(".tin-opening", { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.18 }, 0.48)
          .fromTo(".tin-body", { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.56)
          .to(leafRef.current, { autoAlpha: 0, y: "34vh", scale: 0.28, duration: 0.14 }, 0.67)
          .fromTo(".tin-copy", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.7)
          .to(tinRef.current, { scale: 0.64, y: "-2vh", duration: 0.24 }, 0.78)
          .fromTo(shelfRef.current, { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.24 }, 0.82)
          .fromTo(".shelf-copy", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.9);
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
          <h1 id="home-title">The Antwerp Tea Party</h1>
          <p>Every cup begins somewhere.</p>
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
          <div className="tin-opening" />
          <div className="tin-body">
            <Image
              src={homeAssets.blackTin.src}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 70vw, 420px"
            />
            <div className="tin-label">
              <span>PU ERH</span>
              <small>Demo label</small>
            </div>
          </div>
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
