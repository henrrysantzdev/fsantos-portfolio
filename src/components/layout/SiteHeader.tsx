import { useState, type ReactNode } from "react"
import { Link, useLocation } from "react-router"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/#sobre", label: "Sobre", mobile: "Sobre a KF" },
  { href: "/#projetos", label: "Projetos", mobile: "Explorar projetos" },
  { href: "/#softwares", label: "Softwares", mobile: "Softwares & IA" },
  { href: "/ferramentas", label: "Ferramentas", mobile: "Ferramentas" },
  { href: "/#simulador", label: "", mobile: "Simular orçamento" },
  { href: "/#contato", label: "Contato", mobile: "Contato direto" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const close = () => setOpen(false)

  return (
    <header className="no-print sticky top-0 z-40 bg-white text-[#061c36] shadow-[0_1px_8px_rgb(0_0_0/6%)]">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-3 px-5 lg:h-20 lg:gap-6 lg:px-12">
        <Link to="/" className="shrink-0" aria-label="KF Engenharia — início" onClick={close}>
          <img src="/assets/img/logo-kf-720.png" alt="KF Engenharia" width={179} height={40} className="h-9 w-auto max-w-[150px] lg:h-10 lg:max-w-[170px]" />
        </Link>
        <nav aria-label="Navegação principal" className="ml-auto hidden items-center gap-6 text-base font-semibold text-[#354764] lg:flex">
          {links
            .filter((link) => link.label)
            .map((link) => (
              <NavLink key={link.href} href={link.href} pathname={pathname} className="transition-colors hover:text-[#061c36]">
                {link.label}
              </NavLink>
            ))}
        </nav>
        <a
          href="/#simulador"
          className="ml-auto hidden items-center gap-2 rounded-lg bg-primary px-[18px] py-3 text-sm font-bold whitespace-nowrap text-[#4e2600] transition hover:brightness-110 sm:inline-flex lg:ml-0 lg:shadow-[0_6px_20px_rgb(234_132_39/30%)]"
        >
          Simular orçamento <span aria-hidden="true">↗</span>
        </a>
        <button
          type="button"
          className="ml-auto grid size-11 shrink-0 place-items-center rounded-[10px] border border-[#e2e8f0] sm:ml-0 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Navegação do celular"
          className="grid max-h-[calc(100dvh-68px)] overflow-y-auto bg-white px-5 pt-2 pb-5 shadow-[0_20px_30px_rgb(2_20_41/10%)] lg:hidden"
        >
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              pathname={pathname}
              onNavigate={close}
              className="flex justify-between border-b border-[#e2e8f0] px-2 py-4 text-base font-semibold text-[#061c36]"
            >
              {link.mobile} <span aria-hidden="true" className="text-primary">↗</span>
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}

function NavLink({
  href,
  pathname,
  className,
  onNavigate,
  children,
}: {
  href: string
  pathname: string
  className: string
  onNavigate?: () => void
  children: ReactNode
}) {
  if (href.startsWith("/#")) {
    return (
      <a href={href} className={className} onClick={onNavigate}>
        {children}
      </a>
    )
  }
  const active = pathname === href || (href === "/ferramentas" && ["/orcamento-obra", "/guia-execucao", "/tabelas"].includes(pathname))
  return (
    <Link to={href} className={cn(className, active && "text-primary")} aria-current={pathname === href ? "page" : undefined} onClick={onNavigate}>
      {children}
    </Link>
  )
}
