import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SetupForm } from "@/components/setup-form";
import { GAME_IDS, isGameId } from "@/lib/games";
import { gameJsonLd, gameMetadata, JsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return GAME_IDS.map((game) => ({ game }));
}

export async function generateMetadata({ params }: PageProps<"/setup/[game]">): Promise<Metadata> {
  const { game } = await params;
  if (!isGameId(game)) return {};
  return gameMetadata(game);
}

export default async function SetupPage({ params }: PageProps<"/setup/[game]">) {
  const { game } = await params;
  if (!isGameId(game)) notFound();
  return (
    <>
      <JsonLd data={gameJsonLd(game)} />
      <SetupForm game={game} />
    </>
  );
}
