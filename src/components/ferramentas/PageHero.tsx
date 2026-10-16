import type { ReactNode } from "react"
import { ToolsNav } from "@/components/ferramentas/ToolsNav"

export function PageHero({
  eyebrow,
  title,
  note,
  children,
  actions,
}: {
  eyebrow: string
  title: string
  note: string
  children: ReactNode
  actions?: ReactNode
}) {
  return (
    <section className="no-print relative overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundSize: "32px 32px",
          backgroundImage: "linear-gradient(to right, #d4e3ff 1px, transparent 1px), linear-gradient(to bottom, #d4e3ff 1px, transparent 1px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 -left-48 size-[34rem]"
        style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--color-primary) 10%, transparent) 45%, transparent)" }}
      />
      <div className="relative mx-auto max-w-6xl px-5 pt-10 pb-6 md:pt-16 md:pb-8">
        <span className="mb-4 inline-flex items-center rounded-full bg-card px-3 py-1 font-mono text-[11px] leading-4 font-semibold tracking-[0.08em] text-[#9ccaff] uppercase">
          {eyebrow}
        </span>
        <h1 className="max-w-3xl text-[clamp(28px,8vw,32px)] leading-tight font-extrabold tracking-tight text-balance md:text-[44px] md:leading-[52px]">
          {title}
        </h1>
        <div className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground md:text-base">{children}</div>
        <p className="mt-3 max-w-2xl text-sm text-primary-soft">{note}</p>
        {actions && <div className="mt-5 flex flex-wrap gap-3">{actions}</div>}
        <ToolsNav />
      </div>
    </section>
  )
}
