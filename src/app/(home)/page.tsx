import Image from "next/image";
import { Navbar } from "../../components/section/Navbar";
import { RecommendedSection } from "../../components/section/RecommendSection";
import { HeroCarousel } from "../../components/section/HeroCarousel";
import { Carousel } from "../../components/section/Carousel";

export default function Home() {
  return (
    <>
      <div>
        <Carousel />
        <RecommendedSection />
      </div>
    </>
  );
}
