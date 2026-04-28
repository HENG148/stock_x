import { RecommendedSection } from "../../components/section/RecommendSection";
import { Carousel } from "../../components/section/Carousel";
import { TrendingSection } from "@/src/components/section/TrendingSection";
import { NewArrivalsSection } from "@/src/components/section/NewArriveSection";
import { PopularBrands } from "@/src/components/section/PopularBrand";

export default function Home() {
  return (
    <>
      <div>
        <Carousel />
        <RecommendedSection />
        <TrendingSection />
        <PopularBrands />
        <NewArrivalsSection />
      </div>
    </>
  );
}
