import { CallTheSuitGame } from "@/components/games/call-the-suit";
import { playMetadata } from "@/lib/seo";

export const metadata = playMetadata("suit");

export default function SuitPage() {
  return <CallTheSuitGame />;
}
