import { Link } from "react-router"

export function SiteFooter() {
  return (
    <footer className="no-print bg-[#091c32] pt-10 pb-6">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-12">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-sm flex-col gap-4">
            <span className="inline-flex w-fit rounded-lg bg-white px-3 py-1.5">
              <img src="/assets/img/logo-kf-720.png" alt="KF Engenharia" width={179} height={40} loading="lazy" className="h-8 w-auto" />
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Engenharia estrutural, modelagem OpenBIM e compatibilização multidisciplinar em Manaus-AM.
            </p>
          </div>
          <div className="flex flex-col text-sm text-muted-foreground md:gap-2">
            <h4 className="mb-1 text-base font-semibold text-foreground md:mb-0">Atendimento Manaus</h4>
            <a href="https://wa.me/5592992262786" target="_blank" rel="noopener noreferrer" className="py-2.5 transition-colors hover:text-primary md:py-0">
              Chamar no WhatsApp
            </a>
            <a href="mailto:kfengenhariacontato@gmail.com" className="py-2.5 break-all transition-colors hover:text-primary md:py-0">
              kfengenhariacontato@gmail.com
            </a>
            <Link to="/painel" className="py-2.5 transition-colors hover:text-primary md:py-0">
              Área restrita
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-2 rounded-lg bg-surface-lowest/50 px-4 py-2 text-center md:flex-row md:text-left">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} KF Engenharia. Todos os direitos reservados. Manaus-AM.</p>
          <p className="font-mono text-[11px] font-semibold tracking-[0.08em] text-[#b4c7ea]">CREA-AM • NBR 6118 • OpenBIM</p>
        </div>
      </div>
    </footer>
  )
}
