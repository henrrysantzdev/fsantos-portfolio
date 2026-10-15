import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router"
import { HomePage } from "@/pages/HomePage"

const FerramentasPage = lazy(() => import("@/pages/FerramentasPage").then((module) => ({ default: module.FerramentasPage })))
const PainelPage = lazy(() => import("@/pages/PainelPage").then((module) => ({ default: module.PainelPage })))

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p className="mx-auto max-w-6xl px-4 py-10 text-muted-foreground">Carregando…</p>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ferramentas" element={<FerramentasPage />} />
          <Route path="/painel" element={<PainelPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
