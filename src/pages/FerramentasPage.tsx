import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { CircuitEditor, defaultCircuits, readCircuits, type Circuit } from "@/components/ferramentas/CircuitEditor"
import { ProjectCta } from "@/components/ferramentas/ProjectCta"
import { PageHero } from "@/components/ferramentas/PageHero"
import { ESTACAS, TRELICADA, TOOLS, f } from "@/lib/tools-engine"
import { EXTRA_TOOLS } from "@/lib/tools-extra"
import { parseDecimal } from "@/lib/utils"

type Tool = {
  id: string
  g: string
  t: string
  refs: string[]
  hip: string[]
  table?: boolean
  circ?: boolean
  inp: [string, string, string, string | number, number?, number?, string[]?][]
  calc: (values: Record<string, unknown>) => {
    steps: [string, string, string][]
    res: [string, string][]
    warn: string[]
    html?: string
  }
}

const tools = [...TOOLS, ...EXTRA_TOOLS] as Tool[]

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
  const [circuits, setCircuits] = useState<Circuit[]>(defaultCircuits)

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
    let circ: ReturnType<typeof readCircuits>["parsed"] | undefined
    if (tool.circ) {
      const circuitData = readCircuits(circuits)
      circ = circuitData.parsed
      errors.push(...circuitData.errors)
    }
    tool.inp.forEach(([id, label, , , min, max, options]) => {
      const raw = values[id] ?? ""
      if (options) {
        parsed[id] = raw
        return
      }
      const number = parseDecimal(raw)
      const lo = min ?? (id === "n" ? 0 : 1e-9)
      const hi = max ?? 1e7
      if (!Number.isFinite(number) || number < lo || number > hi) {
        errors.push(`${label}: valor inválido${min != null || max != null ? ` (${min ?? "…"} a ${max ?? "…"})` : " (deve ser > 0)"}`)
      } else parsed[id] = number
    })
    return { parsed, circ, errors }
  }

  const { parsed, circ, errors } = read()
  const result = errors.length ? null : tool.calc({ ...parsed, circ })

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
      <PageHero
        eyebrow="Acesso livre"
        title="Ferramentas de pré-dimensionamento"
        note="Pré-dimensionamento orientativo — não substitui projeto estrutural com ART."
      >
        Calculadoras gratuitas para estimativas iniciais em concreto armado e estruturas metálicas, com memória de cálculo em PDF.
      </PageHero>
      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[240px_1fr]">
        <div className="min-w-0 lg:hidden">
          <Label className="flex-col items-stretch gap-1.5 text-muted-foreground">
            Calculadora
            <NativeSelect value={tool.id} onChange={(event) => selectTool(event.target.value)}>
              {grouped.map(({ group, items }) => (
                <optgroup key={group} label={group}>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.t}
                    </option>
                  ))}
                </optgroup>
              ))}
            </NativeSelect>
          </Label>
        </div>
        <aside className="hidden space-y-4 lg:block">
          {grouped.map(({ group, items }) => (
            <div key={group}>
              <p className="mb-2 font-mono text-[11px] font-semibold tracking-[0.08em] text-primary-soft uppercase">{group}</p>
              <div className="flex flex-col gap-1">
                {items.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    variant={item.id === tool.id ? "default" : "ghost"}
                    className="h-10 justify-start px-3"
                    onClick={() => selectTool(item.id)}
                  >
                    {item.t}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </aside>
        <section className="min-w-0">
          <p className="mb-1 font-mono text-[11px] font-bold tracking-[0.08em] text-primary-soft uppercase">{tool.g}</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-balance md:text-[28px]">{tool.t}</h2>
          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            <form className="min-w-0 space-y-3 rounded-2xl bg-card p-4 shadow-xl md:p-6" onSubmit={(event) => event.preventDefault()}>
              {tool.inp.map(([id, label, unit, , , , options]) => (
                <Label key={id} className="flex-col items-stretch gap-1.5 text-muted-foreground">
                  {label}
                  {unit && unit !== "—" ? ` (${unit})` : ""}
                  {options ? (
                    <NativeSelect
                      value={values[id] ?? ""}
                      onChange={(event) => {
                        const next = event.target.value
                        if (tool.id === "estacas" && id === "tipo") changeEstaca(next)
                        else setValues((current) => ({ ...current, [id]: next }))
                      }}
                    >
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </NativeSelect>
                  ) : (
                    <Input
                      inputMode="decimal"
                      value={values[id] ?? ""}
                      onChange={(event) => setValues((current) => ({ ...current, [id]: event.target.value }))}
                    />
                  )}
                </Label>
              ))}
              {tool.circ && <CircuitEditor circuits={circuits} onChange={setCircuits} />}
              {tool.table && (
                <details className="rounded-lg bg-background/60 px-3">
                  <summary className="flex min-h-11 cursor-pointer items-center">Tabela de vãos máximos (editável)</summary>
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
                                  const number = parseDecimal(event.target.value)
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
              <details className="rounded-lg bg-background/60 px-3">
                <summary className="flex min-h-11 cursor-pointer items-center">Hipóteses adotadas</summary>
                <ul className="list-disc pb-3 pl-5 text-sm text-muted-foreground">
                  {tool.hip.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </details>
            </form>
            <div className="min-w-0 self-start rounded-2xl bg-secondary p-4 shadow-2xl md:p-6">
              {errors.length ? (
                <p className="text-sm text-destructive">{errors.join(" ")}</p>
              ) : result ? (
                <>
                  <p className="font-mono text-[11px] font-bold tracking-[0.08em] text-primary-soft uppercase">Resultado</p>
                  <dl className="mt-3 space-y-2">
                    {result.res.map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4 border-b border-border pb-2 text-sm md:text-base">
                        <dt className="text-muted-foreground">{label}</dt>
                        <dd className="text-right font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  {result.warn.length > 0 && <p className="mt-3 text-sm text-primary-soft">{result.warn.join(" ")}</p>}
                  <details open className="mt-4">
                    <summary className="flex min-h-11 cursor-pointer items-center font-semibold">Passo a passo</summary>
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
                  <Button
                    type="button"
                    className="mt-4 h-12 w-full px-6 font-semibold shadow-[0_6px_20px_rgb(234_132_39/30%)] sm:w-auto"
                    onClick={() => setMemorial(true)}
                    disabled={!result.steps.length}
                  >
                    Gerar memória de cálculo
                  </Button>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Pré-dimensionamento orientativo — não substitui projeto estrutural com ART.
                  </p>
                </>
              ) : null}
            </div>
          </div>
          {result?.html && <div className="tool-report mt-6 rounded-2xl bg-card p-4 shadow-xl md:p-6" dangerouslySetInnerHTML={{ __html: result.html }} />}
        </section>
      </main>
      <ProjectCta />
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
        <header className="flex items-center gap-4 border-b-4 border-[#10253f] pb-3">
          <img src="/assets/img/logo-kf.png" alt="" className="h-16" />
          <div>
            <strong>KF Engenharia</strong>
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
            <tr className="bg-[#10253f] text-white">
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
        {result.html && <div className="tool-report print-report mt-4" dangerouslySetInnerHTML={{ __html: result.html }} />}
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
