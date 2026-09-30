import type { Metadata } from "next";
import { SETUP_HREF, type GameId } from "./games";

export const SITE_URL = "https://www.tipsyparty.co";
export const SITE_NAME = "Tipsy";
export const OG_IMAGE = {
  url: "/images/banner/tipsy-banner.webp",
  width: 1200,
  height: 630,
  type: "image/webp",
  alt: "Tipsy เกมวงเหล้า เกมไพ่ออนไลน์ฟรี",
};

export const SITE_TITLE = "Tipsy เกมวงเหล้า ฟรี · เกมไพ่วงเหล้าออนไลน์ เล่นในมือถือ";
export const SITE_DESCRIPTION =
  "เกมวงเหล้าฟรี เล่นได้ทันทีในมือถือ ไม่ต้องโหลดแอป ไม่ต้องมีไพ่จริง รวมเกมไพ่วงเหล้ายอดฮิต เกมโดราเอมอน ออนไลน์ เกมทายไพ่สูงต่ำ (Ladder) และทายดอกไพ่ (Call the Suit) เวียนมือถือรอบวงแล้วให้ไพ่ตัดสินว่าใครดื่ม";

export const SITE_KEYWORDS = [
  "เกมวงเหล้า",
  "เกมวงเหล้า ฟรี",
  "เกมวงเหล้า ออนไลน์",
  "เกมวงเหล้า ไพ่",
  "เกมไพ่",
  "เกมไพ่ ฟรี",
  "เกมไพ่ ออนไลน์",
  "เกมไพ่วงเหล้า",
  "เกมโดราเอมอน",
  "เกมโดราเอมอน ออนไลน์",
  "ไพ่โดราเอมอน",
  "เกมปาร์ตี้",
  "เกมกินเหล้า",
  "drinking games",
  "drinking card games",
  "party games",
];

type GameSeo = { title: string; description: string; keywords: string[] };

/** Thai-first copy per game: these pages are the landing pages search engines index. */
export const GAME_SEO: Record<GameId, GameSeo> = {
  doraemon: {
    title: "เกมโดราเอมอน ออนไลน์ ฟรี · ไพ่โดราเอมอน วงเหล้า",
    description:
      "เล่นเกมโดราเอมอน ออนไลน์ฟรีในมือถือ ไม่ต้องมีไพ่จริง เปิดไพ่ทีละใบ ทำตามกฎของแต่ละหน้า และห้ามชี้นิ้ว! เกมไพ่วงเหล้ายอดฮิต เล่นได้ 2-20 คน",
    keywords: ["เกมโดราเอมอน", "เกมโดราเอมอน ออนไลน์", "ไพ่โดราเอมอน", "กฎไพ่โดราเอมอน", "เกมวงเหล้า", "doraemon drinking game"],
  },
  ladder: {
    title: "เกมทายไพ่ สูง ต่ำ (Ladder) · เกมไพ่วงเหล้า ฟรี",
    description:
      "เกมไพ่วงเหล้าฟรี ทายว่าไพ่ใบถัดไป สูงกว่า ต่ำกว่า หรือเท่ากัน ทายผิดดื่ม! เล่นออนไลน์ในมือถือเครื่องเดียวเวียนรอบวง ไม่ต้องมีไพ่จริง",
    keywords: ["เกมทายไพ่", "เกมไพ่ สูง ต่ำ", "เกมไพ่ ฟรี", "เกมไพ่วงเหล้า", "higher or lower drinking game"],
  },
  suit: {
    title: "เกมทายดอกไพ่ (Call the Suit) · เกมไพ่ ฟรี วงเหล้า",
    description:
      "เกมไพ่ฟรีสำหรับวงเหล้า ทายดอกไพ่ใบถัดไป โพดำ โพแดง ข้าวหลามตัด หรือดอกจิก โอกาส 1 ใน 4 ทายผิดดื่ม! เล่นออนไลน์ในมือถือ ไม่ต้องโหลดแอป",
    keywords: ["เกมทายดอกไพ่", "เกมไพ่ ฟรี", "เกมไพ่ ออนไลน์", "เกมวงเหล้า", "call the suit drinking game"],
  },
};

export function gameMetadata(game: GameId): Metadata {
  const { title, description, keywords } = GAME_SEO[game];
  const url = SETUP_HREF[game];
  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: [OG_IMAGE] },
    twitter: { title, description, images: [OG_IMAGE.url] },
  };
}

/** JSON-LD describing one game, for the game's landing page. */
export function gameJsonLd(game: GameId) {
  const { title, description } = GAME_SEO[game];
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    description,
    url: `${SITE_URL}${SETUP_HREF[game]}`,
    image: `${SITE_URL}${OG_IMAGE.url}`,
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    inLanguage: ["th", "en"],
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "THB" },
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here except for "<", which could close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/**
 * The play screens bounce to setup when nobody has joined, so crawlers never see them.
 * Keep them out of the index and point search engines at the setup page instead.
 */
export function playMetadata(game: GameId): Metadata {
  return {
    ...gameMetadata(game),
    robots: { index: false, follow: true },
  };
}
