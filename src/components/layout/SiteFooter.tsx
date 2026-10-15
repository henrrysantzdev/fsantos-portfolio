import { Link } from "react-router"

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-8 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} FSantos Engenharia · Manaus-AM ·{" "}
      <Link to="/painel" className="hover:text-foreground">
        Área restrita
      </Link>
    </footer>
  )
}
