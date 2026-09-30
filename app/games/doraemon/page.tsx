import { DoraemonGame } from "@/components/games/doraemon";
import { playMetadata } from "@/lib/seo";

export const metadata = playMetadata("doraemon");

export default function DoraemonPage() {
  return <DoraemonGame />;
}
