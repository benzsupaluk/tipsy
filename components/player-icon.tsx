import Image from "next/image";
import { characterSrc } from "@/lib/characters";

export function PlayerIcon({ id, size = 40, className = "" }: { id: string; size?: number; className?: string }) {
  if (!id) return null;
  return (
    <Image
      src={characterSrc(id)}
      alt=""
      width={size}
      height={size}
      draggable={false}
      className={`shrink-0 select-none object-contain ${className}`}
    />
  );
}
