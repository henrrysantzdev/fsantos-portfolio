export function ProjectCta({
  title = "Precisa do projeto completo?",
  text = "A KF Engenharia faz os projetos de arquitetura, estrutura, fundações e instalações da sua obra, todos com ART.",
}: {
  title?: string
  text?: string
}) {
  return (
    <section className="no-print mx-auto max-w-6xl px-5 py-12 md:py-16">
      <div className="rounded-2xl bg-card p-6 text-center shadow-xl md:p-10">
        <p className="mb-2 font-mono text-[11px] font-bold tracking-[0.08em] text-primary-soft uppercase">KF Engenharia</p>
        <h2 className="text-[26px] leading-tight font-extrabold tracking-tight text-balance md:text-4xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{text}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="/#simulador"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 font-semibold text-[#4e2600] shadow-[0_6px_20px_rgb(234_132_39/30%)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Simular orçamento
          </a>
          <a
            href="https://wa.me/5592992262786"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-secondary px-6 font-semibold shadow-md transition hover:-translate-y-0.5 hover:bg-[#25364d]"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
