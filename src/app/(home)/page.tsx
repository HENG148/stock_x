import Image from "next/image";
import { Navbar } from "../../components/section/Navbar";
import { RecommendedSection } from "../../components/section/RecommendSection";
import { HeroCarousel } from "../../components/section/HeroCarousel";
import { Carousel } from "../../components/section/Carousel";
import { TrendingSection } from "@/src/components/section/TrendingSection";
import { NewArrivalsSection } from "@/src/components/section/NewArriveSection";

export default function Home() {
  return (
    <>
      <div>
        <Carousel />
        <RecommendedSection />
        <TrendingSection />
        <NewArrivalsSection />
      </div>
    </>
  );
}
