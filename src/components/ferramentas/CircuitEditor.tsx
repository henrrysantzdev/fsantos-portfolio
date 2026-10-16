import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { E_CIRC0, E_LOC, E_TIPOS } from "@/lib/tools-extra"
import { parseDecimal } from "@/lib/utils"

export type Circuit = {
  d: string
  tp: number
  P: string
  u: string
  fp: string
  V: number
  f: string
  L: string
  m: string
  ag: string
  T: string
  loc: number
}

type NumericKey = "P" | "fp" | "L" | "ag" | "T"

const tipos = E_TIPOS as string[]
const locais = E_LOC as string[]

const NUMERIC: [NumericKey, string, (value: number) => boolean][] = [
  ["P", "potência", (value) => value > 0],
  ["fp", "FP (0 a 1)", (value) => value > 0 && value <= 1],
  ["L", "comprimento", (value) => value > 0],
  ["ag", "agrupamento (1 a 30)", (value) => value >= 1 && value <= 30],
  ["T", "temperatura (10 a 60 °C)", (value) => value >= 10 && value <= 60],
]

const toText = (value: number) => String(value).replace(".", ",")
function fromEngine(circuit: Record<string, string | number>): Circuit {
  return {
    d: String(circuit.d),
    tp: Number(circuit.tp),
    P: toText(Number(circuit.P)),
    u: String(circuit.u),
    fp: toText(Number(circuit.fp)),
    V: Number(circuit.V),
    f: String(circuit.f),
    L: toText(Number(circuit.L)),
    m: String(circuit.m),
    ag: toText(Number(circuit.ag)),
    T: toText(Number(circuit.T)),
    loc: Number(circuit.loc),
  }
}

export const defaultCircuits = () => (E_CIRC0 as Record<string, string | number>[]).map(fromEngine)

export function readCircuits(circuits: Circuit[]) {
  const errors: string[] = []
  const parsed = circuits.map((circuit, index) => {
    const numbers = {} as Record<NumericKey, number>
    NUMERIC.forEach(([key, label, valid]) => {
      const value = parseDecimal(circuit[key])
      if (!Number.isFinite(value) || !valid(value)) errors.push(`Circuito ${index + 1}: valor inválido em ${label}`)
      numbers[key] = value
    })
    return { ...circuit, ...numbers }
  })
  return { parsed, errors }
}

export function CircuitEditor({ circuits, onChange }: { circuits: Circuit[]; onChange: (next: Circuit[]) => void }) {
  const update = (index: number, patch: Partial<Circuit>) =>
    onChange(circuits.map((circuit, current) => (current === index ? { ...circuit, ...patch } : circuit)))

  return (
    <fieldset className="min-w-0 space-y-3 rounded-lg border border-white/10 p-3">
      <legend className="px-1 text-sm font-medium">Circuitos terminais</legend>
      {circuits.map((circuit, index) => (
        <div key={index} className="space-y-3 rounded-lg bg-muted p-3">
          <div className="flex items-center justify-between gap-2">
            <b>Circuito {index + 1}</b>
            {circuits.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Remover circuito ${index + 1}`}
                onClick={() => onChange(circuits.filter((_, current) => current !== index))}
              >
                Remover
              </Button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 [&>*]:min-w-0">
            <Field label="Descrição" wide>
              <Input value={circuit.d} onChange={(event) => update(index, { d: event.target.value })} />
            </Field>
            <Field label="Tipo" wide>
              <Choice
                value={String(circuit.tp)}
                options={tipos.map((label, value) => [String(value), label])}
                onChange={(value) => update(index, { tp: Number(value) })}
              />
            </Field>
            <Field label="Potência">
              <Input inputMode="decimal" value={circuit.P} onChange={(event) => update(index, { P: event.target.value })} />
            </Field>
            <Field label="Unidade">
              <Choice value={circuit.u} options={[["W", "W"], ["VA", "VA"]]} onChange={(value) => update(index, { u: value })} />
            </Field>
            <Field label="Fator de potência">
              <Input inputMode="decimal" value={circuit.fp} onChange={(event) => update(index, { fp: event.target.value })} />
            </Field>
            <Field label="Tensão (V)">
              <Choice
                value={String(circuit.V)}
                options={["127", "220", "380"].map((value) => [value, value])}
                onChange={(value) => update(index, { V: Number(value) })}
              />
            </Field>
            <Field label="Fases">
              <Choice value={circuit.f} options={["1F", "2F", "3F"].map((value) => [value, value])} onChange={(value) => update(index, { f: value })} />
            </Field>
            <Field label="Comprimento (m)">
              <Input inputMode="decimal" value={circuit.L} onChange={(event) => update(index, { L: event.target.value })} />
            </Field>
            <Field label="Método de instalação">
              <Choice value={circuit.m} options={["B1", "B2", "C", "D"].map((value) => [value, value])} onChange={(value) => update(index, { m: value })} />
            </Field>
            <Field label="Circuitos agrupados">
              <Input inputMode="decimal" value={circuit.ag} onChange={(event) => update(index, { ag: event.target.value })} />
            </Field>
            <Field label="Temperatura ambiente (°C)">
              <Input inputMode="decimal" value={circuit.T} onChange={(event) => update(index, { T: event.target.value })} />
            </Field>
            <Field label="Local" wide>
              <Choice
                value={String(circuit.loc)}
                options={locais.map((label, value) => [String(value), label])}
                onChange={(value) => update(index, { loc: Number(value) })}
              />
            </Field>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange([...circuits, { d: "Novo circuito", tp: 1, P: "1000", u: "VA", fp: "0,8", V: 127, f: "1F", L: "15", m: "B1", ag: "1", T: "30", loc: 0 }])
        }
      >
        + Adicionar circuito
      </Button>
    </fieldset>
  )
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <Label className={`flex-col items-stretch gap-1.5 text-muted-foreground ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      {children}
    </Label>
  )
}

function Choice({ value, options, onChange }: { value: string; options: string[][]; onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={(next) => next && onChange(String(next))}>
      <SelectTrigger className="w-full min-w-0">
        <SelectValue className="block min-w-0 truncate">{(current) => options.find(([key]) => key === current)?.[1]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
