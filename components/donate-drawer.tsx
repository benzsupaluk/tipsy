"use client";

import Image from "next/image";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Label } from "./ui";

const QR_SRC = "/images/promptpay-qr.jpg";
const INSTAGRAM = ["benzsupalukk", "nk_el_nino"];

function InstagramGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

/** Small CTA that opens a bottom sheet with the PromptPay QR and our Instagram handles. */
export function DonateDrawer({ className }: { className?: string }) {
  const { t } = useApp();

  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger
        className={cn(
          "inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-amber underline decoration-amber/40 underline-offset-4 transition hover:decoration-amber active:scale-95",
          className,
        )}
      >
        {t.donate}
      </DrawerTrigger>

      <DrawerContent className="mx-auto max-w-md bg-surface">
        <div className="overflow-y-auto px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)]">
          <DrawerHeader className="px-0 pt-2">
            <DrawerTitle className="font-display text-2xl font-bold text-bone">{t.donateTitle}</DrawerTitle>
            <DrawerDescription className="text-mute">{t.donateHint}</DrawerDescription>
          </DrawerHeader>

          <div className="mt-4 flex flex-col items-center gap-3">
            <Image
              src={QR_SRC}
              alt="PromptPay QR"
              width={885}
              height={1200}
              className="h-auto w-full max-w-64 rounded-2xl"
            />
            <a
              href={QR_SRC}
              download="tipsy-promptpay-qr.jpg"
              className="inline-flex min-h-11 items-center rounded-full border border-line bg-white/4 px-4 text-sm text-bone transition hover:bg-white/8 active:scale-95"
            >
              {t.saveQr}
            </a>
          </div>

          <section className="mt-6">
            <Label>{t.followUs}</Label>
            <ul className="mt-2 flex flex-col gap-2">
              {INSTAGRAM.map((handle) => (
                <li key={handle}>
                  <a
                    href={`https://instagram.com/${handle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="panel flex min-h-13 items-center gap-3 rounded-2xl px-4 text-[15px] font-semibold text-bone transition hover:border-amber/60 active:scale-[0.98]"
                  >
                    <InstagramGlyph className="size-5 shrink-0 text-amber" />@{handle}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
