import type { ComponentProps } from "react";

type Variant = "primary" | "ghost";

const base =
  "inline-flex min-h-14 short:min-h-13 w-full items-center justify-center gap-2 rounded-full px-6 text-base font-bold transition duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary:
    "bg-amber text-ink shadow-[0_12px_32px_-12px_rgb(240_182_74/0.7)] hover:brightness-105",
  ghost: "border border-line bg-white/4 text-bone hover:bg-white/8",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button type="button" className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

/** Small pill for secondary actions; still a 44px touch target. */
export function PillButton({ className = "", ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-line bg-white/4 px-4 text-sm text-bone transition hover:bg-white/8 active:scale-95 disabled:opacity-40 ${className}`}
      {...props}
    />
  );
}

export function Label({ className = "", ...props }: ComponentProps<"p">) {
  return <p className={`label-caps text-mute ${className}`} {...props} />;
}

export function Badge({ className = "", ...props }: ComponentProps<"span">) {
  return (
    <span
      className={`inline-flex h-7 items-center rounded-full border border-amber/50 bg-amber/10 px-3 label-caps text-amber ${className}`}
      {...props}
    />
  );
}
