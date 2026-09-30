import { GamePicker } from "@/components/game-picker";
import { GAME_IDS, SETUP_HREF } from "@/lib/games";
import { GAME_SEO, JsonLd, OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      alternateName: ["Tipsy เกมวงเหล้า", "Tipsy Party"],
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: ["th", "en"],
      image: `${SITE_URL}${OG_IMAGE.url}`,
    },
    {
      "@type": "ItemList",
      name: "เกมวงเหล้า ฟรี",
      itemListElement: GAME_IDS.map((game, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: GAME_SEO[game].title,
        url: `${SITE_URL}${SETUP_HREF[game]}`,
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <GamePicker />
    </>
  );
}
