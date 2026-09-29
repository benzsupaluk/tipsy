import type { Suit } from "./cards";

export type Lang = "th" | "en";

export const LANG_COOKIE = "tipsy-lang";
export const DEFAULT_LANG: Lang = "th";

export function isLang(value: unknown): value is Lang {
  return value === "th" || value === "en";
}

export type GameId = "ladder" | "suit" | "doraemon";

const th = {
  brandTag: "เกมวงเหล้า",
  heroLine: "สับ ทาย ดื่ม มือถือเครื่องเดียวเวียนรอบวง แล้วให้ไพ่ตัดสินว่าใครดื่ม",
  playerN: (n: number) => `ผู้เล่น ${n}`,
  whoPlaying: "ใครเล่นบ้าง?",
  whoHint: "ส่งมือถือต่อไปทางซ้าย · 2 คนขึ้นไป",
  playersCount: (n: number) => `${n} คน`,
  addPlayer: "เพิ่มผู้เล่น",
  removePlayer: (name: string) => `ลบ ${name}`,
  houseRules: "กติกาในวง",
  randomize: "สุ่มลำดับการเล่น",
  randomizeHint: "ถ้าปิดไว้ จะเล่นตามลำดับที่ใส่ชื่อ",
  start: "เริ่มเลย",
  startShuffled: "สุ่มลำดับแล้วเริ่ม",
  responsible: "ดื่มอย่างรับผิดชอบ · เมาไม่ขับ",
  order: "ลำดับการเล่น",
  edit: "แก้ไข",
  reshuffleOrder: "สุ่มลำดับใหม่",
  pickGame: "เลือกเกม",
  back: "กลับ",
  rules: "กติกา",
  close: "ปิด",
  endGame: "จบเกม",
  round: (n: number) => `รอบ ${n}`,
  yourTurn: "ตาคุณ",
  nextUp: (name: string) => `ถัดไป ${name}`,
  cardsLeft: (n: number) => `เหลือ ${n} ใบ`,
  deckDone: "ไพ่หมดสำรับแล้ว สับสำรับใหม่ให้อัตโนมัติ",
  newDeck: "สับไพ่สำรับใหม่",
  passTo: (name: string) => `ส่งต่อให้ ${name}`,
  langLabel: "ภาษา",

  games: {
    ladder: {
      name: "Ladder",
      desc: "สูง ต่ำ หรือเท่ากันเป๊ะ",
    },
    suit: {
      name: "Call the Suit",
      desc: "โอกาส 1 ใน 4 ขอให้โชคดี",
    },
    doraemon: {
      name: "Doraemon",
      desc: "เปิดไพ่ ทำตามกฎ ห้ามชี้นิ้ว!",
    },
  } satisfies Record<GameId, { name: string; desc: string }>,

  suits: {
    clubs: "ดอกจิก",
    diamonds: "ข้าวหลามตัด",
    hearts: "โพธิ์แดง",
    spades: "โพธิ์ดำ",
  } satisfies Record<Suit, string>,

  ladder: {
    higher: "สูงกว่า",
    equal: "เท่ากันเป๊ะ",
    lower: "ต่ำกว่า",
    equalTag: "ทั้งวงดื่ม",
    question: "ใบต่อไปจะสูงหรือต่ำกว่า?",
    scale: "A ต่ำสุด · K สูงสุด",
    win: "รอด! ไม่ต้องดื่ม",
    lose: (name: string) => `${name} ดื่ม 1 ช็อต`,
    equalWin: (name: string) => `ทั้งวงดื่ม! ยกเว้น ${name}`,
    equalLose: (name: string) => `${name} ดื่ม 2 ช็อต`,
    rules: [
      "ระบบเปิดไพ่ 1 ใบไว้บนโต๊ะ แล้วคนที่ถึงตาทายว่าใบถัดไปจะ สูงกว่า ต่ำกว่า หรือ เท่ากัน",
      "A ต่ำสุด และ K สูงสุด",
      "ทาย สูงกว่า/ต่ำกว่า ถูก → รอด ไม่ต้องดื่ม",
      "ทาย สูงกว่า/ต่ำกว่า ผิด หรือออกเท่ากัน → คนทายดื่ม 1 ช็อต",
      "ทาย เท่ากัน (หน้าไพ่ตรงกัน) แล้วออกจริง → ทั้งวงดื่ม ยกเว้นคนทาย",
      "ทาย เท่ากัน แล้วไม่ออก → คนทายดื่ม 2 ช็อต",
    ],
  },

  suit: {
    question: "ใบต่อไปออกดอกอะไร?",
    correct: "ทายถูก! รอด",
    wrong: (name: string) => `${name} ดื่ม 1 ช็อต`,
    itWas: (suit: string) => `ออก${suit}`,
    rules: [
      "ระบบเปิดไพ่ 1 ใบไว้บนโต๊ะ แล้วคนที่ถึงตาทายว่าใบถัดไปจะออกดอกอะไร",
      "ดอกจิก ♣ · ข้าวหลามตัด ♦ · โพธิ์แดง ♥ · โพธิ์ดำ ♠",
      "ทายถูก → รอด",
      "ทายผิด → คนทายดื่ม 1 ช็อต",
    ],
  },

  dora: {
    draw: "เปิดไพ่",
    tapToDraw: "แตะที่สำรับหรือปุ่มด้านล่างเพื่อเปิดไพ่",
    noPointing: "ห้ามชี้นิ้ว! ชี้เมื่อไหร่ดื่ม 1 อึก",
    table: "สถานะบนโต๊ะ",
    kMeter: "K ที่ออกแล้ว",
    queen: "ห้ามคุยด้วย",
    noQueen: "ยังไม่มีใครได้ Q",
    buddies: "บัดดี้",
    noBuddies: "ยังไม่มีคู่",
    passes: "ไพ่เข้าห้องน้ำ",
    noPasses: "ยังไม่มีใครถือ",
    use: "ใช้",
    pickBuddy: (name: string) => `${name} เลือกบัดดี้ 1 คน`,
    skip: "ข้าม",
    sip: (n: number) => `ดื่ม ${n} อึก`,
    sipsTitle: (n: number) => `${n} อึก`,
    sipsBody: (name: string, n: number) => `${name} ดื่ม ${n} อึกตามหน้าไพ่`,
    r5: { title: "จับบัดดี้", body: "เลือกเพื่อน 1 คน จากนี้ถ้าใครในคู่โดนดื่ม อีกคนต้องดื่มด้วย" },
    r6: {
      title: "เกมหมวดหมู่",
      body: (name: string) => `${name} ตั้งหัวข้อ แล้วไล่ตอบกันไปทีละคน ใครตอบไม่ได้หรือช้า ดื่ม 1 อึก`,
    },
    r7: {
      title: "เกมเลข 7",
      body: "นับเลขไล่กันไป ข้ามเลขที่ลงท้ายด้วย 7 หรือหาร 7 ลงตัว ใครพลาดดื่ม 1 อึก",
    },
    r8: {
      title: "ไพ่เข้าห้องน้ำ",
      body: (name: string) => `${name} เก็บไว้ใช้เอง หรือยกให้เพื่อนก็ได้ ต้องมีไพ่นี้ถึงจะไปห้องน้ำได้`,
    },
    r9: { title: "คนทางซ้าย", body: (name: string) => `${name} ดื่ม 1 อึก` },
    r10: { title: "คนทางขวา", body: (name: string) => `${name} ดื่ม 1 อึก` },
    rJ: {
      title: "เกมจับคาง",
      body: (name: string) => `${name} แอบเอามือจับคางเมื่อไหร่ก็ได้ คนสุดท้ายที่ทำตาม ดื่ม 1 อึก`,
    },
    rQ: {
      title: "ห้ามคุยด้วย",
      body: (name: string) => `ห้ามใครพูดกับ ${name} ใครเผลอพูดด้วย ดื่ม 1 อึก`,
    },
    kTitle: (k: number) => `K ใบที่ ${k}`,
    kParts: ["กำหนด “ทำอะไร”", "กำหนด “ที่ไหน”", "กำหนด “ยังไง / นานเท่าไหร่”", "โดนเอง 💀"],
    kBody: (name: string) => `${name} เป็นคนกำหนด ใครได้ K ใบที่ 4 ต้องทำตามทั้งหมด`,
    kLast: (name: string) => `${name} ต้องทำตามทุกอย่างที่ K 3 ใบก่อนหน้ากำหนดไว้`,
    seatHint: "ซ้าย = คนถัดไป · ขวา = คนก่อนหน้า (ตามลำดับการเล่น)",
    rulesTable: [
      { card: "A–4", rule: "ดื่ม 1–4 อึกตามหน้าไพ่" },
      { card: "5", rule: "จับบัดดี้ 1 คน จากนี้ถ้าใครในคู่โดนดื่ม อีกคนต้องดื่มด้วย" },
      { card: "6", rule: "เกมหมวดหมู่ ตั้งหัวข้อแล้วไล่กันไป ใครตอบไม่ได้/ช้า ดื่ม 1 อึก" },
      { card: "7", rule: "เกมเลข 7 ข้ามเลขที่ลงท้ายด้วย 7 หรือหารด้วย 7 ลงตัว ผิดดื่ม 1 อึก" },
      { card: "8", rule: "ไพ่ติดตัว เก็บไว้ใช้เอง (หรือให้เพื่อน) เพื่อไปห้องน้ำ" },
      { card: "9", rule: "คนทางซ้ายของคนเปิด ดื่ม 1 อึก" },
      { card: "10", rule: "คนทางขวาของคนเปิด ดื่ม 1 อึก" },
      { card: "J", rule: "เกมจับคาง คนสุดท้ายที่ทำตาม ดื่ม 1 อึก" },
      { card: "Q", rule: "ห้ามพูดกับคนที่ได้ไพ่นี้ ถ้าพูดด้วยโดน 1 อึก" },
      { card: "K", rule: "ใบ 1 กำหนด “ทำอะไร” ใบ 2 “ที่ไหน” ใบ 3 “ยังไง/นานเท่าไหร่” ใบ 4 โดนเอง 💀" },
      { card: "ตลอดเกม", rule: "ห้ามชี้นิ้ว (เพราะเราเป็นโดเรมอน) ถ้าชี้ก็โดน 1 อึก" },
    ],
  },
};

export type Dict = typeof th;

const en: Dict = {
  brandTag: "Drinking games",
  heroLine: "Shuffle, guess, sip. One phone goes round the table and the deck decides who drinks.",
  playerN: (n) => `Player ${n}`,
  whoPlaying: "Who's playing?",
  whoHint: "Phone passes left. Two or more.",
  playersCount: (n) => `${n} players`,
  addPlayer: "add player",
  removePlayer: (name) => `Remove ${name}`,
  houseRules: "House rules",
  randomize: "Shuffle play order",
  randomizeHint: "If off, turns follow the order you entered",
  start: "Start",
  startShuffled: "Shuffle & start",
  responsible: "Drink responsibly · Never drink and drive",
  order: "Play order",
  edit: "Edit",
  reshuffleOrder: "Reshuffle order",
  pickGame: "Pick a game",
  back: "Back",
  rules: "Rules",
  close: "Close",
  endGame: "End game",
  round: (n) => `Round ${n}`,
  yourTurn: "your turn",
  nextUp: (name) => `Next: ${name}`,
  cardsLeft: (n) => `${n} left`,
  deckDone: "Deck finished, a fresh one is shuffled in",
  newDeck: "Shuffle a new deck",
  passTo: (name) => `Pass to ${name}`,
  langLabel: "Language",

  games: {
    ladder: {
      name: "Ladder",
      desc: "Higher, lower or dead equal",
    },
    suit: {
      name: "Call the Suit",
      desc: "One in four. Good luck.",
    },
    doraemon: {
      name: "Doraemon",
      desc: "Flip, follow the rule, no pointing",
    },
  },

  suits: {
    clubs: "Clubs",
    diamonds: "Diamonds",
    hearts: "Hearts",
    spades: "Spades",
  },

  ladder: {
    higher: "Higher",
    equal: "Exactly equal",
    lower: "Lower",
    equalTag: "Everyone drinks",
    question: "Is the next card higher or lower?",
    scale: "A lowest · K highest",
    win: "Safe! No drink",
    lose: (name) => `${name} drinks 1 shot`,
    equalWin: (name) => `Everyone drinks! Except ${name}`,
    equalLose: (name) => `${name} drinks 2 shots`,
    rules: [
      "One card is face up on the table. The player whose turn it is guesses whether the next card is Higher, Lower or Equal",
      "A is the lowest, K is the highest",
      "Correct Higher/Lower guess → safe, no drink",
      "Wrong Higher/Lower guess, or the card is equal → the guesser drinks 1 shot",
      "Guess Equal (same rank) and it hits → everyone except the guesser drinks",
      "Guess Equal and it misses → the guesser drinks 2 shots",
    ],
  },

  suit: {
    question: "What suit is next?",
    correct: "Called it! Safe",
    wrong: (name) => `${name} drinks 1 shot`,
    itWas: (suit) => `It was ${suit}`,
    rules: [
      "One card is face up on the table. The player whose turn it is calls the suit of the next card",
      "Clubs ♣ · Diamonds ♦ · Hearts ♥ · Spades ♠",
      "Right call → safe",
      "Wrong call → the guesser drinks 1 shot",
    ],
  },

  dora: {
    draw: "Flip a card",
    tapToDraw: "Tap the deck or the button below to flip",
    noPointing: "No pointing! Point and you sip",
    table: "On the table",
    kMeter: "Kings drawn",
    queen: "Silent treatment",
    noQueen: "No Queen yet",
    buddies: "Buddies",
    noBuddies: "No pairs yet",
    passes: "Bathroom passes",
    noPasses: "Nobody holds one",
    use: "Use",
    pickBuddy: (name) => `${name}, pick a buddy`,
    skip: "Skip",
    sip: (n) => `${n} sip${n > 1 ? "s" : ""}`,
    sipsTitle: (n) => `${n} sip${n > 1 ? "s" : ""}`,
    sipsBody: (name, n) => `${name} takes ${n} sip${n > 1 ? "s" : ""}, as the card says`,
    r5: { title: "Buddy up", body: "Pick one friend. From now on, whenever one of you drinks, the other drinks too" },
    r6: {
      title: "Categories",
      body: (name) => `${name} picks a category, then go around the circle. Blank or too slow, take a sip`,
    },
    r7: {
      title: "Sevens",
      body: "Count around the circle, skipping numbers ending in 7 or divisible by 7. Slip up, take a sip",
    },
    r8: {
      title: "Bathroom pass",
      body: (name) => `${name} keeps it (or gifts it). You need this card to go to the bathroom`,
    },
    r9: { title: "To the left", body: (name) => `${name} takes a sip` },
    r10: { title: "To the right", body: (name) => `${name} takes a sip` },
    rJ: {
      title: "Chin touch",
      body: (name) => `${name} secretly touches their chin any time. Last one to copy takes a sip`,
    },
    rQ: {
      title: "Silent treatment",
      body: (name) => `Nobody may talk to ${name}. Slip and speak, take a sip`,
    },
    kTitle: (k) => `King #${k}`,
    kParts: ["sets “what”", "sets “where”", "sets “how / how long”", "does it all 💀"],
    kBody: (name) => `${name} decides. Whoever draws the 4th King has to do all of it`,
    kLast: (name) => `${name} must do everything the first three Kings set`,
    seatHint: "Left = next player · Right = previous player (by play order)",
    rulesTable: [
      { card: "A–4", rule: "Sip 1–4 times, by the card's value" },
      { card: "5", rule: "Pick a buddy. When one of you drinks, the other drinks too" },
      { card: "6", rule: "Categories: pick a topic, go around. Blank or slow, sip" },
      { card: "7", rule: "Sevens: skip numbers ending in 7 or divisible by 7. Miss, sip" },
      { card: "8", rule: "Bathroom pass: keep it (or give it away) to use the bathroom" },
      { card: "9", rule: "Player on the drawer's left sips" },
      { card: "10", rule: "Player on the drawer's right sips" },
      { card: "J", rule: "Chin touch: the last to copy sips" },
      { card: "Q", rule: "Nobody may talk to whoever drew this. Talk, sip" },
      { card: "K", rule: "1st sets “what”, 2nd “where”, 3rd “how / how long”, 4th does it 💀" },
      { card: "Always", rule: "No pointing (we're Doraemon). Point and you sip" },
    ],
  },
};

export const dict: Record<Lang, Dict> = { th, en };
