import { useEffect, useMemo, useState, type MouseEvent } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { ProjectCta } from "@/components/ferramentas/ProjectCta"
import { PageHero } from "@/components/ferramentas/PageHero"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { SECOES, secaoHtml } from "@/lib/guia"
import { cn } from "@/lib/utils"

const CATS: [string, string, string[]][] = [
  ["preliminares", "Serviços preliminares", ["locacao"]],
  ["fundacoes", "Fundações", ["sapata", "radier", "estacas"]],
  ["concreto", "Estrutura de concreto", ["pilar", "viga", "junta"]],
  ["lajes", "Lajes", ["laje", "trelicada"]],
  ["metalica-cat", "Estrutura metálica", ["metalica"]],
  ["alvenaria-cat", "Alvenaria e revestimentos", ["alvenaria", "verga", "reboco", "contrapiso", "ceramica"]],
  ["instalacoes-cat", "Instalações", ["instalacoes"]],
  ["cobertura", "Cobertura (telhado, rufo, calhas)", ["telhado", "rufo", "calhas"]],
  ["contencoes", "Contenções e pavimentos", ["muro", "terra-armada", "pavimento"]],
  ["drenagem-cat", "Drenagem", ["drenagem"]],
  ["impermeabilizacao-cat", "Impermeabilização", ["impermeabilizacao", "impermeabilizacao-laje", "impermeabilizacao-fundacoes"]],
  ["seguranca-cat", "Segurança", ["seguranca"]],
]

const secao = (id: string) => SECOES.find((item) => item.id === id)
const catOf = (sectionId: string) => CATS.find(([, , ids]) => ids.includes(sectionId))?.[0]
const contagem = (n: number, singular: string, plural: string) => `${n} ${n === 1 ? singular : plural}`
const printButtonClass = buttonVariants({ variant: "outline", size: "sm" })

type PrintState = { only: string } | null

function initialOpen() {
  const hash = decodeURIComponent(location.hash.slice(1))
  if (secao(hash)) return { cats: [catOf(hash) ?? ""], secs: [hash] }
  if (CATS.some(([id]) => id === hash)) return { cats: [hash], secs: [] }
  return { cats: [], secs: [] }
}

export function GuiaPage() {
  const [openCats, setOpenCats] = useState<string[]>(() => initialOpen().cats)
  const [openSecs, setOpenSecs] = useState<string[]>(() => initialOpen().secs)
  const [printing, setPrinting] = useState<PrintState>(null)
  const html = useMemo(() => new Map<string, string>(), [])

  function sectionHtml(id: string) {
    const item = secao(id)
    if (!item) return ""
    if (!html.has(id)) {
      html.set(
        id,
        secaoHtml(item)
          .replace(/^<section class="gsec" id="[^"]+">/, '<div class="gin">')
          .replace(/<\/section>$/, "</div>")
          .replace('class="btn ghost gpr"', `class="gpr ${printButtonClass}"`),
      )
    }
    return html.get(id) ?? ""
  }

  useEffect(() => {
    const hash = decodeURIComponent(location.hash.slice(1))
    if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ block: "start" }), 100)
  }, [])

  useEffect(() => {
    if (!printing) return
    const restore = () => setPrinting(null)
    addEventListener("afterprint", restore)
    const timer = setTimeout(() => print(), 150)
    return () => {
      clearTimeout(timer)
      removeEventListener("afterprint", restore)
    }
  }, [printing])

  const toggleCat = (id: string, open: boolean) =>
    setOpenCats((current) => (open ? [...new Set([...current, id])] : current.filter((item) => item !== id)))
  const toggleSec = (id: string, open: boolean) => {
    setOpenSecs((current) => (open ? [...new Set([...current, id])] : current.filter((item) => item !== id)))
    if (open) history.replaceState(null, "", `#${id}`)
  }

  function goToCat(id: string) {
    toggleCat(id, true)
    history.replaceState(null, "", `#${id}`)
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50)
  }

  function onContentClick(event: MouseEvent<HTMLDivElement>) {
    const button = (event.target as HTMLElement).closest<HTMLElement>(".gpr")
    if (button?.dataset.sec) setPrinting({ only: button.dataset.sec })
  }

  const printAll = printing?.only === ""
  const catVisible = (ids: string[]) => !printing || printAll || ids.includes(printing.only)
  const secVisible = (id: string) => !printing || printAll || printing.only === id

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="Canteiro de obras"
        title="Guia prático de execução"
        note="Guia orientativo e genérico — siga sempre o projeto executivo, as especificações e o responsável técnico."
        actions={
          <Button type="button" className="h-11 px-5" onClick={() => setPrinting({ only: "" })}>
            Gerar PDF do guia
          </Button>
        }
      >
        Passo a passo ilustrado de cada etapa de obra — fôrmas, armaduras, espaçadores, cobrimentos, tolerâncias e segurança — com referência às normas
        ABNT e DNIT.
      </PageHero>
      <main className="mx-auto max-w-6xl px-5 py-8">
        <nav aria-label="Etapas da obra" className="no-print grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATS.map(([id, title, ids]) => (
            <button
              key={id}
              type="button"
              onClick={() => goToCat(id)}
              className="flex min-h-11 flex-col items-start gap-1 rounded-2xl bg-card p-4 text-left shadow-xl transition hover:-translate-y-0.5 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring md:p-5"
            >
              <span className="font-mono text-[11px] font-bold tracking-[0.08em] text-primary-soft uppercase">
                {contagem(ids.length, "seção", "seções")}
              </span>
              <b className="font-bold">{title}</b>
            </button>
          ))}
        </nav>
        <div className="guia-content print-area mt-8 space-y-3" onClick={onContentClick}>
          {CATS.map(([catId, title, ids]) => (
            <details
              key={catId}
              id={catId}
              open={printAll || (printing ? ids.includes(printing.only) : openCats.includes(catId))}
              onToggle={(event) => !printing && toggleCat(catId, event.currentTarget.open)}
              className={cn("scroll-mt-24 rounded-2xl bg-card shadow-xl", !catVisible(ids) && "print:hidden")}
            >
              <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 px-4 py-3 text-lg font-bold md:px-5">
                {title}
                <small className="font-normal text-muted-foreground">{contagem(ids.length, "seção", "seções")}</small>
              </summary>
              <div className="space-y-2 px-3 pb-3">
                {ids.map((sectionId) => {
                  const item = secao(sectionId)
                  if (!item) return null
                  const open = printAll || (printing ? printing.only === sectionId : openSecs.includes(sectionId))
                  return (
                    <details
                      key={sectionId}
                      id={sectionId}
                      open={open}
                      onToggle={(event) => !printing && toggleSec(sectionId, event.currentTarget.open)}
                      className={cn("guia-sec scroll-mt-24 rounded-xl bg-background/70", !secVisible(sectionId) && "print:hidden")}
                    >
                      <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 py-3 font-medium">
                        {item.t}
                        <small className="font-normal text-muted-foreground">{contagem(item.steps.length, "etapa", "etapas")}</small>
                      </summary>
                      {open && <div className="px-3 pb-3" dangerouslySetInnerHTML={{ __html: sectionHtml(sectionId) }} />}
                    </details>
                  )
                })}
              </div>
            </details>
          ))}
        </div>
      </main>
      <ProjectCta />
      <SiteFooter />
    </>
  )
}
