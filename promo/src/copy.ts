export type Lang = "th" | "en";

/** Promo copy. In-app strings (buttons, results) match lib/i18n.ts. */
const th = {
  hook: ["วงเหล้าเงียบ?", "เล่นอะไรกันดี 🤔"],
  brandTag: "เกมวงเหล้า",
  brandLine: "เล่นในมือถือ ไม่ต้องมีไพ่จริง",

  players: ["มิว", "บอส"],
  rules: "กติกา",
  endGame: "จบเกม",
  passTo: (name: string) => `ส่งต่อให้ ${name}`,

  ladder: {
    headline: "ทายไพ่ สูง / ต่ำ",
    sub: "ทายผิด ดื่ม!",
    name: "Ladder",
    question: "ใบต่อไปจะสูงหรือต่ำกว่า?",
    higher: "สูงกว่า",
    equal: "เท่ากันเป๊ะ",
    lower: "ต่ำกว่า",
    lose: "ดื่ม 1 ช็อต",
    detail: "สูงกว่า · 9♠ → 4♥",
    scale: "A ต่ำสุด · K สูงสุด",
  },
  suit: {
    headline: "ทายดอกไพ่",
    sub: "โอกาส 1 ใน 4 ขอให้โชคดี",
    name: "Call the Suit",
    question: "ใบต่อไปออกดอกอะไร?",
    suits: { clubs: "ดอกจิก", diamonds: "ข้าวหลามตัด", hearts: "โพธิ์แดง", spades: "โพธิ์ดำ" },
    correct: "ทายถูก! รอด",
    detail: "ออกโพธิ์แดง ♥",
  },
  dora: {
    headline: "ไพ่โดราเอมอน",
    sub: "เปิดไพ่ ทำตามกฎ",
    name: "Doraemon",
    noPointing: "ห้ามชี้นิ้ว! ชี้เมื่อไหร่ดื่ม 1 อึก",
    title: "เกมเลข 7",
    body: "นับเลขตั้งแต่ 1 ขึ้นไป แต่ให้ข้ามเลขที่ลงท้ายด้วย 7 หรือหาร 7 ลงตัว",
    draw: "เปิดไพ่",
  },

  pitchTitle: "เล่นฟรี",
  pitch: ["ไม่ต้องโหลดแอป", "ไม่ต้องมีไพ่จริง", "มือถือเครื่องเดียว เวียนทั้งวง"],

  ctaLine: "เปิดเว็บ เล่นได้เลย 🍻",
  ctaUrl: "tipsyparty.co",
  ctaHint: "ลิงก์ในไบโอ",
};

export type Copy = typeof th;

const en: Copy = {
  hook: ["Party gone quiet?", "What do we play? 🤔"],
  brandTag: "Drinking games",
  brandLine: "On your phone. No cards needed.",

  players: ["Mew", "Boss"],
  rules: "Rules",
  endGame: "End game",
  passTo: (name) => `Pass to ${name}`,

  ladder: {
    headline: "Higher or lower",
    sub: "Guess wrong, you drink!",
    name: "Ladder",
    question: "Is the next card higher or lower?",
    higher: "Higher",
    equal: "Exactly equal",
    lower: "Lower",
    lose: "Drinks 1 shot",
    detail: "Higher · 9♠ → 4♥",
    scale: "A lowest · K highest",
  },
  suit: {
    headline: "Call the suit",
    sub: "One in four. Good luck.",
    name: "Call the Suit",
    question: "What suit is next?",
    suits: { clubs: "Clubs", diamonds: "Diamonds", hearts: "Hearts", spades: "Spades" },
    correct: "Called it! Safe",
    detail: "It was Hearts ♥",
  },
  dora: {
    headline: "Doraemon cards",
    sub: "Flip. Follow the rule.",
    name: "Doraemon",
    noPointing: "No pointing! Point and you sip",
    title: "Sevens",
    body: "Count around the circle, skipping numbers ending in 7 or divisible by 7",
    draw: "Flip a card",
  },

  pitchTitle: "Free to play",
  pitch: ["No app to download", "No real cards needed", "One phone, passed around"],

  ctaLine: "Open the site and play 🍻",
  ctaUrl: "tipsyparty.co",
  ctaHint: "Link in bio",
};

export const COPY: Record<Lang, Copy> = { th, en };
