import { useEffect, useMemo, useState } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { ESTACAS, TRELICADA, TOOLS, f } from "@/lib/tools-engine"
import { cn } from "@/lib/utils"

type Tool = {
  id: string
  g: string
  t: string
  refs: string[]
  hip: string[]
  table?: boolean
  inp: [string, string, string, string | number, number?, number?, string[]?][]
  calc: (values: Record<string, number | string>) => {
    steps: [string, string, string][]
    res: [string, string][]
    warn: string[]
  }
}

const tools = TOOLS as Tool[]

function formatDefault(value: string | number) {
  return String(value).replace(".", ",")
}

function defaultsFor(item: Tool) {
  const next: Record<string, string> = {}
  item.inp.forEach(([id, , , def]) => {
    next[id] = formatDefault(def)
  })
  return next
}

export function FerramentasPage() {
  const grouped = useMemo(() => {
    const names = [...new Set(tools.map((tool) => tool.g))]
    return names.map((group) => ({ group, items: tools.filter((tool) => tool.g === group) }))
  }, [])
  const initialTool = tools.find((item) => item.id === location.hash.replace("#", "")) ?? tools[0]
  const [toolId, setToolId] = useState(initialTool.id)
  const tool = tools.find((item) => item.id === toolId) ?? tools[0]
  const [values, setValues] = useState<Record<string, string>>(() => defaultsFor(initialTool))
  const [memorial, setMemorial] = useState(false)

  useEffect(() => {
    history.replaceState(null, "", `#${tool.id}`)
  }, [tool.id])

  function selectTool(id: string) {
    const next = tools.find((item) => item.id === id) ?? tools[0]
    setToolId(next.id)
    setValues(defaultsFor(next))
    setMemorial(false)
  }

  function read() {
    const parsed: Record<string, number | string> = {}
    const errors: string[] = []
    tool.inp.forEach(([id, label, , , min, max, options]) => {
      const raw = values[id] ?? ""
      if (options) {
        parsed[id] = raw
        return
      }
      const number = parseFloat(String(raw).replace(",", "."))
      const lo = min ?? (id === "n" ? 0 : 1e-9)
      const hi = max ?? 1e7
      if (!Number.isFinite(number) || number < lo || number > hi) {
        errors.push(`${label}: valor inválido${min != null || max != null ? ` (${min ?? "…"} a ${max ?? "…"})` : " (deve ser > 0)"}`)
      } else parsed[id] = number
    })
    return { parsed, errors }
  }

  const { parsed, errors } = read()
  const result = errors.length ? null : tool.calc({ ...parsed })

  function changeEstaca(tipo: string) {
    const pair = (ESTACAS as Record<string, number[]>)[tipo]
    setValues((current) => ({
      ...current,
      tipo,
      ...(pair ? { Q: String(pair[1]), phi: String(pair[0]) } : {}),
    }))
  }

  return (
    <>
      <SiteHeader />
      <section className="border-b border-white/10 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="border-l-4 border-primary pl-3 text-3xl font-semibold">Ferramentas de pré-dimensionamento</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Calculadoras gratuitas para estimativas iniciais em concreto armado e estruturas metálicas, com memória de cálculo em PDF.
          </p>
          <p className="mt-3 text-sm text-primary">Pré-dimensionamento orientativo — não substitui projeto estrutural com ART.</p>
        </div>
      </section>
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[240px_1fr]">
        <div className="lg:hidden">
          <Label className="flex-col items-stretch gap-1.5 text-muted-foreground">
            Calculadora
            <Select value={tool.id} onValueChange={(next) => next && selectTool(next)}>
              <SelectTrigger className="h-8 w-full">
                <SelectValue>{(value) => tools.find((item) => item.id === value)?.t}</SelectValue>
              </SelectTrigger>
              <SelectContent>
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
        </div>
        <aside className="hidden space-y-4 lg:block">
          {grouped.map(({ group, items }) => (
            <div key={group}>
              <p className="mb-2 text-xs tracking-wide text-muted-foreground uppercase">{group}</p>
              <div className="flex flex-col gap-1">
                {items.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    variant={item.id === tool.id ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => selectTool(item.id)}
                  >
                    {item.t}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </aside>
        <section>
          <h2 className="text-2xl font-semibold">{tool.t}</h2>
          <p className="text-sm text-primary">{tool.g}</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <form className="space-y-3" onSubmit={(event) => event.preventDefault()}>
              {tool.inp.map(([id, label, unit, , , , options]) => (
                <Label key={id} className="flex-col items-stretch gap-1.5 text-muted-foreground">
                  {label}
                  {unit && unit !== "—" ? ` (${unit})` : ""}
                  {options ? (
                    <Select
                      value={values[id] ?? ""}
                      onValueChange={(next) => {
                        if (!next) return
                        if (tool.id === "estacas" && id === "tipo") changeEstaca(next)
                        else setValues((current) => ({ ...current, [id]: next }))
                      }}
                    >
                      <SelectTrigger className="h-8 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      inputMode="decimal"
                      value={values[id] ?? ""}
                      onChange={(event) => setValues((current) => ({ ...current, [id]: event.target.value }))}
                    />
                  )}
                </Label>
              ))}
              {tool.table && (
                <details className="rounded-lg border border-white/10 p-3">
                  <summary>Tabela de vãos máximos (editável)</summary>
                  <div className="overflow-x-auto">
                  <table className="mt-3 w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left">Laje</th>
                        {(TRELICADA.cargas as number[]).map((carga) => (
                          <th key={carga}>q ≤ {f(carga, 1)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(TRELICADA.linhas as (string | number)[][]).map((row, rowIndex) => (
                        <tr key={String(row[0])}>
                          <td>{row[0]}</td>
                          {row.slice(1).map((cell, cellIndex) => (
                            <td key={cellIndex}>
                              <Input
                                value={f(cell, 1)}
                                onChange={(event) => {
                                  const number = parseFloat(event.target.value.replace(",", "."))
                                  if (number > 0) TRELICADA.linhas[rowIndex][cellIndex + 1] = number
                                  setValues((current) => ({ ...current }))
                                }}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </details>
              )}
              <details className="rounded-lg border border-white/10 p-3">
                <summary>Hipóteses adotadas</summary>
                <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                  {tool.hip.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </details>
            </form>
            <div className="rounded-xl border border-white/10 bg-card p-4">
              {errors.length ? (
                <p className="text-sm text-destructive">{errors.join(" ")}</p>
              ) : result ? (
                <>
                  <h3 className="text-lg font-semibold">Resultado</h3>
                  <dl className="mt-3 space-y-2">
                    {result.res.map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4 border-b border-white/10 pb-2">
                        <dt className="text-muted-foreground">{label}</dt>
                        <dd className="text-right font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  {result.warn.length > 0 && <p className="mt-3 text-sm text-primary">{result.warn.join(" ")}</p>}
                  <details open className="mt-4">
                    <summary>Passo a passo</summary>
                    <ol className="mt-2 list-decimal space-y-3 pl-5 text-sm">
                      {result.steps.map(([title, formula, value]) => (
                        <li key={title}>
                          <b>{title}</b>
                          <br />
                          <code>{formula}</code>
                          <br />
                          {value}
                        </li>
                      ))}
                    </ol>
                  </details>
                  <Button type="button" className="mt-4" onClick={() => setMemorial(true)} disabled={!result.steps.length}>
                    Gerar memória de cálculo
                  </Button>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Pré-dimensionamento orientativo — não substitui projeto estrutural com ART.
                  </p>
                </>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <section className="mx-auto max-w-6xl px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold">Precisa do projeto completo?</h2>
        <p className="mt-2 text-muted-foreground">Projeto estrutural, fundações, instalações e arquitetura com ART.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a href="/#orcamento" className={cn(buttonVariants(), "h-10 px-4")}>
            Gerar orçamento
          </a>
          <a
            href="https://wa.me/5592992262786"
            target="_blank"
            rel="noopener"
            className={cn(buttonVariants({ variant: "outline" }), "h-10 border-primary px-4 text-primary")}
          >
            Conversar no WhatsApp
          </a>
        </div>
      </section>
      <SiteFooter />
      {memorial && result && (
        <Memorial tool={tool} values={parsed} result={result} onClose={() => setMemorial(false)} />
      )}
    </>
  )
}

function Memorial({
  tool,
  values,
  result,
  onClose,
}: {
  tool: Tool
  values: Record<string, number | string>
  result: ReturnType<Tool["calc"]>
  onClose: () => void
}) {
  const hoje = new Date().toLocaleDateString("pt-BR")
  return (
    <div className="proposta-root fixed inset-0 z-50 overflow-auto bg-white text-neutral-900">
      <article className="mx-auto max-w-3xl px-6 py-10 font-serif">
        <header className="flex items-center gap-4 border-b-4 border-[#0b1a30] pb-3">
          <img src="/assets/img/logo-fsantos.png" alt="" className="h-16" />
          <div>
            <strong>FSantos Engenharia — Santos Projetos & Orçamentos</strong>
            <br />
            Eng. Civil Francirley Pereira Santos — CREA 31.410-AM
          </div>
        </header>
        <p className="mt-4 border border-dashed border-amber-800 px-2 py-1 text-center text-sm font-semibold text-amber-800">
          Pré-dimensionamento orientativo — não substitui projeto estrutural com ART
        </p>
        <h2 className="mt-4 text-center font-sans text-2xl">MEMÓRIA DE CÁLCULO</h2>
        <p className="text-center">
          {tool.g} — {tool.t}
        </p>
        <p className="mt-4">Manaus/AM, {hoje}</p>
        <h3 className="mt-6 font-sans text-lg">1. Dados de entrada</h3>
        <table className="mt-2 w-full border-collapse text-sm">
          <tbody>
            {tool.inp.map(([id, label, unit]) => (
              <tr key={id}>
                <td className="border border-neutral-400 px-2 py-1">{label}</td>
                <td className="border border-neutral-400 px-2 py-1">
                  {typeof values[id] === "number" ? f(values[id], Number(values[id]) % 1 ? 2 : 0) : values[id]}{" "}
                  {unit && unit !== "—" ? unit : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="mt-6 font-sans text-lg">2. Hipóteses</h3>
        <ul className="list-disc pl-5">
          {tool.hip.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3 className="mt-6 font-sans text-lg">3. Cálculo passo a passo</h3>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#0b1a30] text-white">
              <th className="border border-neutral-400 px-2 py-1 text-left">Etapa</th>
              <th className="border border-neutral-400 px-2 py-1 text-left">Fórmula</th>
              <th className="border border-neutral-400 px-2 py-1 text-left">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {result.steps.map(([title, formula, value]) => (
              <tr key={title}>
                <td className="border border-neutral-400 px-2 py-1">{title}</td>
                <td className="border border-neutral-400 px-2 py-1">{formula}</td>
                <td className="border border-neutral-400 px-2 py-1">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="mt-6 font-sans text-lg">4. Resultados</h3>
        <table className="mt-2 w-full border-collapse text-sm">
          <tbody>
            {result.res.map(([label, value]) => (
              <tr key={label}>
                <td className="border border-neutral-400 px-2 py-1 font-semibold">{label}</td>
                <td className="border border-neutral-400 px-2 py-1 font-semibold">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {result.warn.length > 0 && (
          <p className="mt-3">
            <b>Observações:</b> {result.warn.join(" ")}
          </p>
        )}
        <h3 className="mt-6 font-sans text-lg">5. Referências</h3>
        <ul className="list-disc pl-5">
          {tool.refs.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="no-print mt-8 flex justify-center gap-3 font-sans">
          <Button type="button" onClick={() => window.print()}>
            Imprimir / salvar PDF
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </article>
    </div>
  )
}
