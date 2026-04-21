export type BannerSlide = {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  bg: string;
  accent: string;
  image: string;
}

export const SLIDE_BANNER: BannerSlide[] = [
  {
    id: 1,
    tag: "New Drop",
    title: "CLASSIC\nCOLORS REVIVED",
    subtitle: "AJ11 Low University Blue",
    cta: "Shop Now",
    href: "/sneakers",
    bg: "#0a3728",
    accent: "#08a05c",
    image: ""
  },
  {
    id: 2,
    tag: "Just Dropped",
    title: "BLACK &\nWHITE ICON",
    subtitle: "Nike Dunk Low Panda",
    cta: "Buy Now",
    href: "/sneakers",
    bg: "#111111",
    accent: "#ffffff",
    image: "https://images-cs.stockx.com/v3/assets/blt818b0c67cf450811/bltde8eeadd6bf5f2a2/69d3c38a02aea82c50638ca1/Spring_New_Arrivals-Banners-ENPrimary_Desktop-Small.jpg?auto=webp&format=pjpg&width=1246&dpr=1&quality=80 1x, https://images-cs.stockx.com/v3/assets/blt818b0c67cf450811/bltde8eeadd6bf5f2a2/69d3c38a02aea82c50638ca1/Spring_New_Arrivals-Banners-ENPrimary_Desktop-Small.jpg?auto=webp&format=pjpg&width=1246&dpr=2&quality=75 2x, https://images-cs.stockx.com/v3/assets/blt818b0c67cf450811/bltde8eeadd6bf5f2a2/69d3c38a02aea82c50638ca1/Spring_New_Arrivals-Banners-ENPrimary_Desktop-Small.jpg?auto=webp&format=pjpg&width=1246&dpr=3&quality=50 3x",
  },
  {
    id: 3,
    tag: "Trending",
    title: "ZEBRA\nSEASON",
    subtitle: "Yeezy Boost 350 V2",
    cta: "See Prices",
    href: "/sneakers",
    bg: "#1a1040",
    accent: "#7c3aed",
    image: ""
  },
  {
    id: 4,
    tag: "Retro",
    title: "WOLF GREY\nRETURNS",
    subtitle: "Jordan 5 Retro Wolf Grey 2026",
    cta: "Shop Now",
    href: "/sneakers",
    bg: "#1c1c1c",
    accent: "#e5e5e5",
    image: ""
  },
]