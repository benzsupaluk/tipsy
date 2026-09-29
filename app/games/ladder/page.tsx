import type { Metadata } from "next";
import { LadderGame } from "@/components/games/ladder";

export const metadata: Metadata = {
  title: "Ladder",
  description: "ทายไพ่ สูง ต่ำ หรือเท่ากัน · Guess higher, lower or equal.",
};

export default function LadderPage() {
  return <LadderGame />;
}
