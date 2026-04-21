'use client'

import { SLIDE_BANNER } from "@/src/data/SlideBanner";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const AUTOPLAY_DELAY = 5000;

export function Carousel() {
  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true)
    setCurrent(idx)
    setTimeout(() => setAnimating(false), 400);
  }, [animating])

  const prev = useCallback(() => {
    goTo(current === 0 ? SLIDE_BANNER.length - 1 : current - 1)
  }, [current, goTo])

  const next = useCallback(() => {
    goTo(current === SLIDE_BANNER.length - 1 ? 0 : current + 1);
  }, [current, goTo]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [next, isHovered])
  const slide = SLIDE_BANNER[current];

  return (
    <div
      className="select-none max-w-350 mx-auto py-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative w-full h-50 sm:h-60 md:h-75 rounded-2xl overflow-hidden transition-colors duration-500"
        style={{ background: slide.bg }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10"
          style={{ background: slide.accent }}
        />
        <div
          className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full opacity-10"
          style={{ background: slide.accent }}
        />
 
        {/* Side vertical labels */}
        <div className="absolute right-0 top-0 bottom-0 w-6 flex flex-col items-center justify-around py-4 border-l border-white/10">
          {["STOCK", "X"].map((t, i) => (
            <span
              key={i}
              className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase"
              style={{ writingMode: "vertical-rl" }}
            >
              {t}
            </span>
          ))}
        </div>
 
        {/* Text content */}
        <div className="absolute inset-0 flex flex-col justify-center pl-8 md:pl-12 pr-32 md:pr-48 z-10">
          {/* Tag */}
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 w-fit"
            style={{ background: `${slide.accent}22`, color: slide.accent }}
          >
            {slide.tag}
          </span>
 
          {/* Title */}
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-2 whitespace-pre-line text-white"
          >
            {slide.title}
          </h2>
          <p className="text-white/60 text-sm md:text-base mb-5 font-medium">
            {slide.subtitle}
          </p>
          <Link
            href={slide.href}
            className="inline-flex items-center gap-2 w-fit text-sm font-bold text-white no-underline group"
          >
            <span
              className="underline underline-offset-4 decoration-white/40 group-hover:decoration-white transition-all"
            >
              {slide.cta}
            </span>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="group-hover:translate-x-1 transition-transform text-white"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 flex items-center justify-center transition-all backdrop-blur-sm cursor-pointer"
          aria-label="Previous"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 flex items-center justify-center transition-all backdrop-blur-sm cursor-pointer"
          aria-label="Next"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
 
      {/* ── Dots ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {SLIDE_BANNER.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 cursor-pointer border-none ${
              i === current
                ? "w-6 h-1.5 bg-gray-900"
                : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-500"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}