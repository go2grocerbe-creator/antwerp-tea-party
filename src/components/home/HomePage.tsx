import { ExpertiseSection } from "@/components/home/ExpertiseSection";
import { OriginJourney } from "@/components/home/OriginJourney";
import { ShopStory } from "@/components/home/ShopStory";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import { TeaTableSection } from "@/components/home/TeaTableSection";
import { ThreePaths } from "@/components/home/ThreePaths";
import type { Dictionary, Locale } from "@/i18n";

export function HomePage({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  return (
    <>
      <SiteHeader locale={locale} dictionary={dictionary} />
      <main>
        <OriginJourney locale={locale} dictionary={dictionary} />
        <ShopStory dictionary={dictionary} />
        <ExpertiseSection dictionary={dictionary} />
        <TeaTableSection locale={locale} dictionary={dictionary} />
        <ThreePaths dictionary={dictionary} />
      </main>
      <SiteFooter dictionary={dictionary} />
    </>
  );
}
