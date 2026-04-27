"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

type Slide = {
  id: number;
  badge?: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  bg: string;  
  textColor: string;
  image: string;       
  imageLeft?: string;  
  sideLabel?: string; 
};

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "CLASSIC\nCOLORS REVIVED",
    subtitle: "AJ11 Low University Blue",
    cta: "Shop Now",
    href: "/sneakers",
    bg: "#0a3728",
    textColor: "#ffffff",
    image: "https://images-cs.stockx.com/v3/assets/blt818b0c67cf450811/bltde8eeadd6bf5f2a2/69d3c38a02aea82c50638ca1/Spring_New_Arrivals-Banners-ENPrimary_Desktop-Small.jpg?auto=webp&format=pjpg&width=1246&dpr=1&quality=80 1x, https://images-cs.stockx.com/v3/assets/blt818b0c67cf450811/bltde8eeadd6bf5f2a2/69d3c38a02aea82c50638ca1/Spring_New_Arrivals-Banners-ENPrimary_Desktop-Small.jpg?auto=webp&format=pjpg&width=1246&dpr=2&quality=75 2x, https://images-cs.stockx.com/v3/assets/blt818b0c67cf450811/bltde8eeadd6bf5f2a2/69d3c38a02aea82c50638ca1/Spring_New_Arrivals-Banners-ENPrimary_Desktop-Small.jpg?auto=webp&format=pjpg&width=1246&dpr=3&quality=50 3x",
    sideLabel: "Jordan",
  },
  {
    id: 2,
    title: "JUST\nDROP TODAY",
    subtitle: "Nike Dunk Low Panda",
    cta: "Buy Now",
    href: "/sneakers",
    bg: "#111111",
    textColor: "#ffffff",
    image: "https://images-cs.stockx.com/v3/assets/blt818b0c67cf450811/blt3489cb8549d4c8aa/696935d6c113250008ad02bd/NikeMind001Slides_PrimaryDesktop-Half.jpg?auto=webp&format=pjpg&quality=75&dpr=2&width=1246",
    sideLabel: "Nike",
  },
  {
    id: 3,
    title: "ULTRA\nBOOST SEASON",
    subtitle: "Yeezy Boost 350 V2 Zebra",
    cta: "See Prices",
    href: "/sneakers",
    bg: "#1a1a2e",
    textColor: "#ffffff",
    image: "https://images-cs.stockx.com/v3/assets/blt818b0c67cf450811/blt37fd4e44461d2c03/69e25f813d1e363eb59cd6eb/AJ11_Low_University_Blue-Banners-ENPrimary_Desktop-Small.jpg?auto=webp&format=pjpg&quality=75&dpr=2&width=1246",
    sideLabel: "Adidas",
  },
  // {
  //   id: 4,
  //   title: "RETRO\nREBORN",
  //   subtitle: "Jordan 5 Retro Wolf Grey",
  //   cta: "Shop Now",
  //   href: "/sneakers",
  //   bg: "#2d2d2d",
  //   textColor: "#ffffff",
  //   image: "https://images.stockx.com/images/Air-Jordan-5-Retro-Wolf-Grey-2024-Product.jpg",
  //   sideLabel: "Jordan",
  // },
];

const AUTOPLAY_DELAY = 5000;

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? SLIDES.length - 1 : c - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c === SLIDES.length - 1 ? 0 : c + 1));
  }, []);

  // Autoplay
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [next, isHovered]);

  const slide = SLIDES[current];

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative w-full h-55 md:h-70 rounded-2xl overflow-hidden transition-colors duration-500 mx-auto max-w-338`}
        style={{ background: slide.bg }}
      >
        {slide.sideLabel && (
          <div className="absolute right-0 top-0 bottom-0 w-7 flex flex-col items-center justify-center gap-3 border-l border-white/10">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="text-[10px] font-bold tracking-widest text-white/30 uppercase"
                style={{ writingMode: "vertical-rl" }}
              >
                {slide.sideLabel}
              </span>
            ))}
          </div>
        )}

        <div className="absolute left-0 top-0 bottom-0 w-55 hidden md:block">
          <Image
            src={slide.image}
            alt=""
            fill
            className="object-contain object-right scale-110 opacity-20 -translate-x-16"
            sizes="220px"
          />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10">
          <h2
            className={`text-3xl md:text-4xl font-black leading-tight mb-2 whitespace-pre-line ${slide.textColor}`}
            // style={{ color: slide.textColor }}
          >
            {slide.title}
          </h2>
          <p className="text-white/70 text-sm md:text-base mb-4 font-medium">
            {slide.subtitle}
          </p>
          <Link
            href={slide.href}
            className="inline-flex items-center gap-2 text-sm font-bold no-underline border-b-2 pb-0.5 transition-opacity hover:opacity-70"
            style={{ color: slide.textColor, borderColor: slide.textColor }}
          >
            {slide.cta}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="absolute right-8 md:right-16 top-0 bottom-0 w-45 md:w-65">
          <Image
            src={slide.image}
            alt={slide.subtitle}
            fill
            className="object-contain object-center drop-shadow-2xl"
            sizes="260px"
            priority
          />
        </div>

        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-all backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-10 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-all backdrop-blur-sm"
          aria-label="Next slide"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* ── Dot indicators ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-5 h-1.5 bg-gray-900"
                : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}