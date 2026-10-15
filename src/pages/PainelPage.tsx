import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router"
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth"
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from "firebase/firestore"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PropostaView } from "@/components/proposta/PropostaView"
import { ADMIN_EMAIL, auth, db } from "@/lib/firebase"
import { brl, num, type ItemCalc, type OrcamentoDoc } from "@/lib/orcamento"

const STATUS = ["novo", "em análise", "enviado", "aprovado", "recusado"]

type Saved = OrcamentoDoc & {
  id: string
  numero: string
  status: string
  notas?: string
  createdAt?: Timestamp
}

function isAdmin(user: User | null) {
  return Boolean(user && user.email === ADMIN_EMAIL && user.emailVerified)
}

function areaOf(item: Saved) {
  return (item.itens || []).reduce((sum, current) => sum + (+current.area || 0), 0)
}

function createdDate(item: Saved) {
  return item.createdAt?.toDate ? item.createdAt.toDate() : null
}

export function PainelPage() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [rows, setRows] = useState<Saved[]>([])
  const [loadError, setLoadError] = useState("")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [selected, setSelected] = useState<Saved | null>(null)
  const [proposta, setProposta] = useState<OrcamentoDoc | null>(null)

  useEffect(() => {
    return onAuthStateChanged(auth, async (next) => {
      if (next && !isAdmin(next)) {
        await signOut(auth)
        setLoginError(`Acesso negado para ${next.email}.`)
        setUser(null)
      } else {
        setUser(next)
      }
      setReady(true)
    })
  }, [])

  useEffect(() => {
    if (!user) return
    void load()
  }, [user])

  async function load() {
    setLoadError("")
    try {
      const snap = await getDocs(query(collection(db, "orcamentos"), orderBy("createdAt", "desc")))
      setRows(snap.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Saved, "id">) })))
    } catch (error) {
      const err = error as { code?: string; message?: string }
      setLoadError(err.code || err.message || "Erro ao carregar")
    }
  }

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim()
    return rows.filter((item) => {
      const blob = [item.numero, item.cliente?.nome, item.cliente?.telefone, item.cliente?.email, item.projeto, item.cidade, item.notas]
        .join(" ")
        .toLowerCase()
      return (!status || item.status === status) && (!term || blob.includes(term))
    })
  }, [rows, search, status])

  async function entrar() {
    setLoginError("")
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (error) {
      const err = error as { code?: string; message?: string }
      setLoginError(
        location.protocol === "file:"
          ? "Login não funciona via file://. Abra por http://localhost."
          : `Falha no login: ${err.code || err.message}`,
      )
    }
  }

  function exportCsv() {
    const cell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`
    const header = ["data", "numero", "cliente", "telefone", "email", "projeto", "cidade", "area_m2", "itens", "total", "total_por_m2", "status", "notas"]
    const lines = filtered.map((item) =>
      [
        createdDate(item)?.toLocaleDateString("pt-BR") ?? "",
        item.numero,
        item.cliente?.nome,
        item.cliente?.telefone,
        item.cliente?.email,
        item.projeto,
        item.cidade,
        String(areaOf(item)).replace(".", ","),
        (item.itens || [])
          .map((entry) => `${entry.nome || "Projeto"} (${entry.area} m²): ${(entry.disciplinas || []).map((linha) => linha.nome).join("/")}`)
          .join(" | "),
        String(item.total).replace(".", ","),
        String(item.totalPorM2).replace(".", ","),
        item.status,
        item.notas,
      ]
        .map(cell)
        .join(";"),
    )
    const blob = new Blob(["\ufeff" + [header.join(";"), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `orcamentos-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <img src="/assets/img/logo-fsantos.png" alt="" className="h-9 w-auto" />
            FSantos Engenharia
          </Link>
          {user && (
            <div className="flex flex-wrap items-center justify-end gap-3 text-sm text-muted-foreground">
              <span className="max-w-full break-all">{user.email}</span>
              <Button type="button" variant="outline" size="sm" onClick={() => signOut(auth)}>
                Sair
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        {!ready ? (
          <p className="text-muted-foreground">Carregando…</p>
        ) : !user ? (
          <section className="mx-auto max-w-md rounded-2xl border border-white/10 bg-card p-8 text-center">
            <img src="/assets/img/logo-fsantos.png" alt="" className="mx-auto h-24" />
            <h1 className="mt-4 text-3xl font-semibold">Área restrita</h1>
            <p className="mt-2 text-muted-foreground">Painel de orçamentos da FSantos Engenharia. Acesso exclusivo do administrador.</p>
            <Button type="button" className="mt-6 h-10 px-4" onClick={entrar}>
              Entrar com Google
            </Button>
            {loginError && <p className="mt-3 text-sm text-destructive">{loginError}</p>}
          </section>
        ) : (
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="border-l-4 border-primary pl-3 text-3xl font-semibold">Orçamentos</h1>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => void load()}>
                  Atualizar
                </Button>
                <Button type="button" onClick={exportCsv}>
                  Exportar CSV
                </Button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Input className="h-10 max-w-md" placeholder="Buscar por número, cliente, projeto, cidade…" value={search} onChange={(event) => setSearch(event.target.value)} />
              <Select value={status || "todos"} onValueChange={(value) => setStatus(!value || value === "todos" ? "" : value)}>
                <SelectTrigger className="h-10 min-w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  {STATUS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {loadError ? `Erro ao carregar: ${loadError}` : `${filtered.length} de ${rows.length} orçamento(s)`}
            </p>
            <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Projeto</TableHead>
                    <TableHead>Área (m²)</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7}>Nenhum orçamento.</TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((item) => (
                      <TableRow key={item.id} className="cursor-pointer" onClick={() => setSelected(item)}>
                        <TableCell>{createdDate(item)?.toLocaleDateString("pt-BR") ?? "—"}</TableCell>
                        <TableCell>{item.numero}</TableCell>
                        <TableCell>{item.cliente?.nome}</TableCell>
                        <TableCell>{item.projeto}</TableCell>
                        <TableCell>{num(areaOf(item))}</TableCell>
                        <TableCell>{brl(item.total)}</TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        )}
      </main>
      {selected && (
        <OrcamentoDialog
          item={selected}
          onClose={() => setSelected(null)}
          onChange={(next) => {
            setRows((current) => current.map((row) => (row.id === next.id ? next : row)))
            setSelected(next)
          }}
          onDelete={(id) => {
            setRows((current) => current.filter((row) => row.id !== id))
            setSelected(null)
          }}
          onProposta={(item) => {
            setProposta({ ...item, data: createdDate(item) || new Date() })
            setSelected(null)
          }}
        />
      )}
      {proposta && (
        <PropostaView
          orcamento={proposta}
          onClose={() => {
            setProposta(null)
          }}
        />
      )}
      <SiteFooter />
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "novo"
      ? "bg-primary text-primary-foreground"
      : status === "aprovado"
        ? "bg-emerald-600 text-white"
        : status === "recusado"
          ? "bg-red-700 text-white"
          : "bg-secondary text-secondary-foreground"
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${tone}`}>{status}</span>
}

function OrcamentoDialog({
  item,
  onClose,
  onChange,
  onDelete,
  onProposta,
}: {
  item: Saved
  onClose: () => void
  onChange: (item: Saved) => void
  onDelete: (id: string) => void
  onProposta: (item: Saved) => void
}) {
  const [status, setStatus] = useState(item.status)
  const [notas, setNotas] = useState(item.notas || "")
  const [message, setMessage] = useState("")
  const [error, setError] = useState(false)
  const phone = String(item.cliente?.telefone || "").replace(/\D/g, "")
  const whatsapp = phone ? `https://wa.me/${phone.length <= 11 ? "55" + phone : phone}` : ""
  const when = createdDate(item)

  async function salvar() {
    try {
      await updateDoc(doc(db, "orcamentos", item.id), { status, notas, updatedAt: serverTimestamp() })
      onChange({ ...item, status, notas })
      setError(false)
      setMessage("Salvo.")
    } catch (err) {
      const errorInfo = err as { code?: string; message?: string }
      setError(true)
      setMessage(`Erro: ${errorInfo.code || errorInfo.message}`)
    }
  }

  async function excluir() {
    if (!confirm(`Excluir o orçamento ${item.numero} de ${item.cliente?.nome}? Esta ação não pode ser desfeita.`)) return
    try {
      await deleteDoc(doc(db, "orcamentos", item.id))
      onDelete(item.id)
    } catch (err) {
      const errorInfo = err as { code?: string; message?: string }
      setError(true)
      setMessage(`Erro: ${errorInfo.code || errorInfo.message}`)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item.numero}</DialogTitle>
        </DialogHeader>
        <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Data</dt>
          <dd>{when?.toLocaleString("pt-BR") ?? "—"}</dd>
          <dt className="text-muted-foreground">Cliente</dt>
          <dd>{item.cliente?.nome}</dd>
          <dt className="text-muted-foreground">Telefone</dt>
          <dd>{item.cliente?.telefone || "—"}</dd>
          <dt className="text-muted-foreground">E-mail</dt>
          <dd>{item.cliente?.email || "—"}</dd>
          <dt className="text-muted-foreground">Projeto</dt>
          <dd>{item.projeto || "—"}</dd>
          <dt className="text-muted-foreground">Cidade</dt>
          <dd>{item.cidade || "—"}</dd>
          <dt className="text-muted-foreground">Itens</dt>
          <dd>
            {(item.itens || []).map((entry: ItemCalc, index) => (
              <p key={index}>
                <b>{entry.nome || "Projeto"}</b> — {num(entry.area)} m² — {brl(entry.subtotal)}
                <br />
                <small>{(entry.disciplinas || []).map((linha) => linha.nome).join(", ")}</small>
              </p>
            ))}
          </dd>
          <dt className="text-muted-foreground">Total</dt>
          <dd>
            <b>{brl(item.total)}</b> ({brl(item.totalPorM2)}/m²)
          </dd>
        </dl>
        <Label className="mt-4 flex-col items-stretch gap-1.5">
          Status
          <Select value={status} onValueChange={(value) => value && setStatus(value)}>
            <SelectTrigger className="h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>
        <Label className="mt-3 flex-col items-stretch gap-1.5">
          Notas internas
          <Textarea maxLength={5000} value={notas} onChange={(event) => setNotas(event.target.value)} />
        </Label>
        <p className={error ? "text-sm text-destructive" : "text-sm text-primary"}>{message}</p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => void salvar()}>
            Salvar
          </Button>
          <Button type="button" variant="outline" onClick={() => onProposta({ ...item, status, notas })}>
            Gerar proposta (PDF)
          </Button>
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noopener" className="inline-flex h-8 items-center rounded-lg border px-3 text-sm">
              WhatsApp do cliente
            </a>
          )}
          <Button type="button" variant="destructive" onClick={() => void excluir()}>
            Excluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
