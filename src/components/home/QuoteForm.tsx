import { Fragment, useMemo, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  brl,
  calcItem,
  calcTotal,
  numeroOrcamento,
  ORC_CONFIG,
  whatsappHref,
  type OrcamentoDoc,
} from "@/lib/orcamento"
import { PropostaView } from "@/components/proposta/PropostaView"

type Draft = { id: number; nome: string; area: string; sel: number[] }

const defaultSel = ORC_CONFIG.disciplinas.map((item, index) => (item.incluir ? index : -1)).filter((index) => index >= 0)

function parseArea(value: string) {
  return parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0
}

export function QuoteForm() {
  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [email, setEmail] = useState("")
  const [projeto, setProjeto] = useState("")
  const [cidade, setCidade] = useState("Manaus/AM")
  const [itens, setItens] = useState<Draft[]>([{ id: 1, nome: "", area: "100", sel: defaultSel }])
  const [nextId, setNextId] = useState(2)
  const [message, setMessage] = useState("")
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState(false)
  const [proposta, setProposta] = useState<OrcamentoDoc | null>(null)

  const orcamento = useMemo<OrcamentoDoc>(() => {
    const calculated = itens.map((item) => calcItem({ nome: item.nome.trim(), area: parseArea(item.area), sel: item.sel }))
    const totals = calcTotal(calculated)
    return {
      cliente: {
        nome: nome.trim().slice(0, 120),
        telefone: telefone.trim().slice(0, 40),
        email: email.trim().slice(0, 120),
      },
      projeto: projeto.trim().slice(0, 160),
      cidade: cidade.trim().slice(0, 100),
      itens: calculated,
      total: totals.total,
      totalPorM2: totals.totalPorM2,
    }
  }, [cidade, email, itens, nome, projeto, telefone])

  function updateItem(id: number, patch: Partial<Draft>) {
    setItens((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  async function gerar() {
    setError(false)
    if (!orcamento.cliente.nome) {
      setMessage("Informe o nome do cliente.")
      setError(true)
      return
    }
    if (!orcamento.itens.length || orcamento.itens.some((item) => !item.area || !item.disciplinas.length)) {
      setMessage("Cada projeto precisa de área e de ao menos uma disciplina.")
      setError(true)
      return
    }
    const numero = numeroOrcamento()
    const salvo = { ...orcamento, numero, data: new Date() }
    setSaving(true)
    try {
      const [{ db }, firestore] = await Promise.all([
        import("@/lib/firebase"),
        import("firebase/firestore"),
      ])
      await Promise.race([
        firestore.addDoc(firestore.collection(db, "orcamentos"), {
          numero,
          cliente: orcamento.cliente,
          projeto: orcamento.projeto,
          cidade: orcamento.cidade,
          itens: orcamento.itens,
          total: orcamento.total,
          totalPorM2: orcamento.totalPorM2,
          status: "novo",
          createdAt: firestore.serverTimestamp(),
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 12000)),
      ])
      setMessage(`Orçamento ${numero} registrado. Entraremos em contato.`)
      setError(false)
    } catch (err) {
      console.error(err)
      salvo.numero = ""
      setMessage(
        "Não foi possível registrar o orçamento agora (sem conexão ou serviço indisponível). A proposta foi gerada mesmo assim; envie pelo WhatsApp para confirmar.",
      )
      setError(true)
    } finally {
      setSaving(false)
    }
    setProposta(salvo)
  }

  return (
    <section id="orcamento" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <h2 className="border-l-4 border-primary pl-3 text-3xl font-semibold">Orçamento online</h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Simule os honorários de elaboração de projeto conforme a tabela padrão da KF Engenharia (valores por m² de área de projeto). Você pode incluir mais de um projeto no mesmo orçamento.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Nome do cliente *">
          <Input value={nome} maxLength={120} required onChange={(event) => setNome(event.target.value)} />
        </Field>
        <Field label="Telefone">
          <Input value={telefone} maxLength={40} inputMode="tel" onChange={(event) => setTelefone(event.target.value)} />
        </Field>
        <Field label="E-mail">
          <Input type="email" value={email} maxLength={120} onChange={(event) => setEmail(event.target.value)} />
        </Field>
        <Field label="Nome do projeto / obra">
          <Input value={projeto} maxLength={160} onChange={(event) => setProjeto(event.target.value)} />
        </Field>
        <Field label="Cidade">
          <Input value={cidade} maxLength={100} onChange={(event) => setCidade(event.target.value)} />
        </Field>
      </div>
      {itens.map((item, index) => (
        <fieldset key={item.id} className="mt-4 rounded-xl border border-white/10 bg-card p-4">
          <legend className="px-2 text-primary">Projeto {index + 1}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Descrição do projeto">
              <Input
                value={item.nome}
                maxLength={160}
                placeholder="Ex.: Residência térrea"
                onChange={(event) => updateItem(item.id, { nome: event.target.value })}
              />
            </Field>
            <Field label="Área construída (m²)">
              <Input
                inputMode="decimal"
                value={item.area}
                onChange={(event) => updateItem(item.id, { area: event.target.value })}
              />
            </Field>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {ORC_CONFIG.disciplinas.map((disciplina, disciplinaIndex) => (
              <Label key={disciplina.item} className="font-normal">
                <Checkbox
                  checked={item.sel.includes(disciplinaIndex)}
                  onCheckedChange={(checked) =>
                    updateItem(item.id, {
                      sel: checked
                        ? [...item.sel, disciplinaIndex]
                        : item.sel.filter((value) => value !== disciplinaIndex),
                    })
                  }
                />
                {disciplina.nome}
              </Label>
            ))}
          </div>
          {itens.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              className="mt-3 text-destructive"
              onClick={() => setItens((current) => current.filter((currentItem) => currentItem.id !== item.id))}
            >
              Remover projeto
            </Button>
          )}
        </fieldset>
      ))}
      <Button
        type="button"
        variant="outline"
        className="mt-4"
        disabled={itens.length >= 10}
        onClick={() => {
          setItens((current) => [...current, { id: nextId, nome: "", area: "100", sel: defaultSel }])
          setNextId((id) => id + 1)
        }}
      >
        + Adicionar projeto
      </Button>
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead className="text-right">Área projeto (m²)</TableHead>
              <TableHead className="text-right">R$/m²</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orcamento.itens.map((item, index) => (
              <Fragment key={item.nome + index}>
                {orcamento.itens.length > 1 && (
                  <TableRow key={`g-${index}`}>
                    <TableCell colSpan={5} className="font-semibold text-primary">
                      {item.nome || `Projeto ${index + 1}`} — {item.area.toLocaleString("pt-BR")} m²
                    </TableCell>
                  </TableRow>
                )}
                {item.disciplinas.length === 0 ? (
                  <TableRow key={`e-${index}`}>
                    <TableCell colSpan={5}>Selecione ao menos uma disciplina.</TableCell>
                  </TableRow>
                ) : (
                  item.disciplinas.map((linha) => (
                    <TableRow key={`${index}-${linha.item}`}>
                      <TableCell>{linha.item}</TableCell>
                      <TableCell>{linha.nome}</TableCell>
                      <TableCell className="text-right">{linha.areaProjeto.toLocaleString("pt-BR")}</TableCell>
                      <TableCell className="text-right">{brl(linha.preco)}</TableCell>
                      <TableCell className="text-right">{brl(linha.total)}</TableCell>
                    </TableRow>
                  ))
                )}
                {orcamento.itens.length > 1 && (
                  <TableRow key={`s-${index}`}>
                    <TableCell colSpan={4} className="text-right text-muted-foreground">
                      Subtotal
                    </TableCell>
                    <TableCell className="text-right">{brl(item.subtotal)}</TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-right font-semibold text-primary">
                TOTAL GERAL
              </TableCell>
              <TableCell className="text-right font-semibold text-primary">{brl(orcamento.total)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} className="text-right font-semibold text-primary">
                Valor médio por m²
              </TableCell>
              <TableCell className="text-right font-semibold text-primary">{brl(orcamento.totalPorM2)}/m²</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Valores de referência; a proposta final depende da análise do projeto. Ao gerar a proposta, seus dados são registrados para contato da KF Engenharia.
      </p>
      <p className={error ? "mt-2 text-sm text-destructive" : "mt-2 text-sm text-primary"} role="status">
        {message}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" className="h-10 px-4" disabled={saving} onClick={gerar}>
          {saving ? "Salvando…" : "Gerar proposta"}
        </Button>
        <a href={whatsappHref(orcamento)} target="_blank" rel="noopener" className="inline-flex h-10 items-center rounded-lg border border-primary px-4 text-sm font-medium text-primary">
          Enviar pelo WhatsApp
        </a>
      </div>
      {proposta && <PropostaView orcamento={proposta} onClose={() => setProposta(null)} />}
    </section>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Label className="flex-col items-stretch gap-1.5 text-muted-foreground">
      {label}
      {children}
    </Label>
  )
}
