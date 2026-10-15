import { useState } from "react"
import { Link, useLocation } from "react-router"
import { Menu } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const links = [
  { href: "/#sobre", label: "Sobre" },
  { href: "/#portfolio", label: "Portfólio" },
  { href: "/#softwares", label: "Softwares" },
  { href: "/ferramentas", label: "Ferramentas" },
  { href: "/#orcamento", label: "Orçamento" },
  { href: "/#contato", label: "Contato" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <img src="/assets/img/logo-fsantos.png" alt="" className="h-9 w-auto" />
          FSantos Engenharia
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} pathname={pathname} className="text-foreground/90 transition-colors hover:text-primary" />
          ))}
        </nav>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")} aria-label="Abrir menu">
            <Menu />
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {links.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  pathname={pathname}
                  className="rounded-lg px-3 py-3 text-base hover:bg-muted"
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function NavLink({
  href,
  pathname,
  className,
  onNavigate,
}: {
  href: string
  pathname: string
  className: string
  onNavigate?: () => void
}) {
  const label = links.find((link) => link.href === href)?.label
  const active = !href.startsWith("/#") && pathname === href
  const classes = cn(className, active && "text-primary")
  if (href.startsWith("/#")) {
    return (
      <a href={href} className={classes} onClick={onNavigate}>
        {label}
      </a>
    )
  }
  return (
    <Link to={href} className={classes} onClick={onNavigate}>
      {label}
    </Link>
  )
}
