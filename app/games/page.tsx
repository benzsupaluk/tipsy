import type { Metadata } from "next";
import { GamePicker } from "@/components/game-picker";

export const metadata: Metadata = {
  title: "เลือกเกม · Pick a game",
};

export default function GamesPage() {
  return <GamePicker />;
}
