import type { Metadata } from "next";
import { CallTheSuitGame } from "@/components/games/call-the-suit";

export const metadata: Metadata = {
  title: "Call the Suit",
  description: "ทายดอกไพ่ใบถัดไป · Call the suit of the next card.",
};

export default function SuitPage() {
  return <CallTheSuitGame />;
}
