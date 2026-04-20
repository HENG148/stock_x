import Image from "next/image";
import { Navbar } from "../components/section/Navbar";
import { RecommendedSection } from "../components/section/RecommendSection";
import { HeroCarousel } from "../components/section/HeroCarousel";

export default function Home() {
  return (
    <>
      <div>
        <Navbar />
        <HeroCarousel />
        <RecommendedSection />
      </div>
    </>
  );
}
