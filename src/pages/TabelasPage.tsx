import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProjectCta } from "@/components/ferramentas/ProjectCta"
import { PageHero } from "@/components/ferramentas/PageHero"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { TABELAS, type Tabela } from "@/data/tabelas"
import { cn } from "@/lib/utils"

const ALL = "todas"

const normalize = (value: unknown) =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/,/g, ".")
    .toLowerCase()

function formatCell(value: string | number, decimals?: number | null) {
  if (typeof value === "string") {
    const uncertain = value.endsWith("?")
    return { text: uncertain ? value.slice(0, -1) : value, uncertain }
  }
  const text =
    decimals == null
      ? String(value).replace(".", ",")
      : value.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return { text, uncertain: false }
}

function matchingRows(table: Tabela, term: string) {
  if (!term) return table.rows
  const titleHit = normalize(table.t).includes(term) || table.cols.some((col) => normalize(col).includes(term))
  return titleHit ? table.rows : table.rows.filter((row) => row.some((cell) => normalize(cell).includes(term)))
}

export function TabelasPage() {
  const grouped = useMemo(() => {
    const names = [...new Set(TABELAS.map((table) => table.g))]
    return names.map((group) => ({ group, items: TABELAS.filter((table) => table.g === group) }))
  }, [])
  const initial = location.hash.replace("#", "")
  const [selected, setSelected] = useState(initial === ALL || TABELAS.some((table) => table.id === initial) ? initial : TABELAS[0].id)
  const [query, setQuery] = useState("")
  const term = normalize(query.trim())

  useEffect(() => {
    history.replaceState(null, "", `#${selected}`)
  }, [selected])

  const visible = (term || selected === ALL ? TABELAS : TABELAS.filter((table) => table.id === selected))
    .map((table) => ({ table, rows: matchingRows(table, term) }))
    .filter(({ rows }) => rows.length > 0)

  function choose(id: string) {
    setSelected(id)
    setQuery("")
  }

  const label = (id: string) => (id === ALL ? "Todas as tabelas" : TABELAS.find((table) => table.id === id)?.t)

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="Consulta rápida"
        title="Tabelas de engenharia"
        note="Valores de referência para consulta. Confira sempre a norma ou o catálogo vigente do fabricante antes de usar em projeto."
      >
        Consulta rápida de aço, perfis metálicos, concreto, elétrica, cargas, hidráulica e alvenaria — com a fonte de cada tabela.
      </PageHero>
      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="no-print hidden space-y-4 lg:block">
          <Button type="button" variant={!term && selected === ALL ? "default" : "outline"} className="w-full justify-start" onClick={() => choose(ALL)}>
            Todas as tabelas
          </Button>
          {grouped.map(({ group, items }) => (
            <div key={group}>
              <p className="mb-2 font-mono text-[11px] font-semibold tracking-[0.08em] text-primary-soft uppercase">{group}</p>
              <div className="flex flex-col gap-1">
                {items.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    variant={!term && item.id === selected ? "default" : "ghost"}
                    className="h-auto justify-start py-2 text-left whitespace-normal"
                    onClick={() => choose(item.id)}
                  >
                    {item.t}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </aside>
        <section className="min-w-0">
          <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-end">
            <Label className="flex-col items-stretch gap-1.5 text-muted-foreground lg:hidden">
              Tabela
              <Select value={selected} onValueChange={(next) => next && choose(String(next))}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue>{(value) => label(String(value))}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todas as tabelas</SelectItem>
                  {grouped.map(({ group, items }) => (
                    <SelectGroup key={group}>
                      <SelectLabel>{group}</SelectLabel>
                      {items.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.t}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </Label>
            <Label className="flex-1 flex-col items-stretch gap-1.5 text-muted-foreground">
              Buscar em todas as tabelas
              <Input
                type="search"
                className="h-11 md:h-10"
                placeholder="Ex.: W 310, 12,5, disjuntor, laje"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </Label>
            <Button type="button" className="h-11 md:h-10" onClick={() => window.print()}>
              Imprimir / PDF
            </Button>
          </div>
          {term && (
            <p className="no-print mt-3 text-sm text-muted-foreground" role="status">
              {visible.length} tabela(s) com resultado
            </p>
          )}
          <div className="print-area mt-6 space-y-8">
            {visible.length === 0 && <p className="text-muted-foreground">Nenhum resultado para essa busca.</p>}
            {visible.map(({ table, rows }) => {
              const hasUncertain = table.rows.some((row) => row.some((cell) => typeof cell === "string" && cell.endsWith("?")))
              return (
                <article key={table.id} id={`t-${table.id}`} className="scroll-mt-24 rounded-2xl bg-card p-4 shadow-xl md:p-6">
                  <p className="mb-1 font-mono text-[11px] font-bold tracking-[0.08em] text-primary-soft uppercase">{table.g}</p>
                  <h2 className="text-lg font-bold text-balance md:text-xl">{table.t}</h2>
                  <Table className="mt-3">
                    <TableHeader>
                      <TableRow>
                        {table.cols.map((col) => (
                          <TableHead key={col} className={cn("bg-muted", col.length > 16 && "min-w-28 whitespace-normal")}>
                            {col}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => {
                            const { text, uncertain } = formatCell(cell, table.dec?.[cellIndex])
                            const numeric = typeof cell === "number" || /^[\d,.]+\??$/.test(String(cell))
                            return (
                              <TableCell
                                key={cellIndex}
                                className={cn(numeric && "text-right tabular-nums", text.length > 28 && "min-w-56 whitespace-normal")}
                                title={uncertain ? "Leitura incerta na foto de referência — conferir" : undefined}
                              >
                                {text}
                                {uncertain && <sup>*</sup>}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {table.note && <p className="mt-3 text-sm text-muted-foreground">{table.note}</p>}
                  {hasUncertain && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <sup>*</sup> Leitura incerta na foto de referência — conferir com a fonte original.
                    </p>
                  )}
                  <p className="mt-2 text-sm">
                    <b>Fonte:</b> {table.src}
                  </p>
                </article>
              )
            })}
          </div>
        </section>
      </main>
      <ProjectCta />
      <SiteFooter />
    </>
  )
}
