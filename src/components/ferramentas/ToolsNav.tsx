import { Link, useLocation } from "react-router"
import { cn } from "@/lib/utils"

const pages = [
  { href: "/ferramentas", label: "Calculadoras" },
  { href: "/orcamento-obra", label: "Orçamento de obra (SINAPI)" },
  { href: "/guia-execucao", label: "Guia de execução" },
  { href: "/tabelas", label: "Tabelas de engenharia" },
]

export function ToolsNav() {
  const { pathname } = useLocation()
  return (
    <nav
      aria-label="Ferramentas"
      className="no-print -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {pages.map((page) => {
        const active = pathname === page.href
        return (
          <Link
            key={page.href}
            to={page.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              active ? "bg-white font-bold text-background" : "bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {page.label}
          </Link>
        )
      })}
    </nav>
  )
}
