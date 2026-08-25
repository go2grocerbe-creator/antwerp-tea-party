import { ExpertiseSection } from "@/components/home/ExpertiseSection";
import { OriginJourney } from "@/components/home/OriginJourney";
import { ShopStory } from "@/components/home/ShopStory";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import { TeaTableSection } from "@/components/home/TeaTableSection";
import { ThreePaths } from "@/components/home/ThreePaths";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <OriginJourney />
        <ShopStory />
        <ExpertiseSection />
        <TeaTableSection />
        <ThreePaths />
      </main>
      <SiteFooter />
    </>
  );
}
