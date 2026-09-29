import type { Metadata } from "next";
import { DoraemonGame } from "@/components/games/doraemon";

export const metadata: Metadata = {
  title: "Doraemon",
  description: "เปิดไพ่ทีละใบ ทำตามกฎของแต่ละหน้า และห้ามชี้นิ้ว · Flip a card, follow its rule, no pointing.",
};

export default function DoraemonPage() {
  return <DoraemonGame />;
}
