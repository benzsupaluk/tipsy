import { LadderGame } from "@/components/games/ladder";
import { playMetadata } from "@/lib/seo";

export const metadata = playMetadata("ladder");

export default function LadderPage() {
  return <LadderGame />;
}
