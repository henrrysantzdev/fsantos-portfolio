export const ORC_CONFIG = {
  empresa: "Santos Projetos & Orçamentos",
  responsavel: "Eng. Civil Francirley Pereira Santos",
  crea: "31.410-AM",
  fone: "(92) 99226-2786",
  email: "leyfps@gmail.com",
  local: "Manaus/AM",
  whatsapp: "5592992262786",
  disciplinas: [
    { item: "001.", nome: "Projeto de Arquitetura", coef: 1, preco: 13.5, incluir: true },
    { item: "002.", nome: "Projeto Estrutural", coef: 1, preco: 14, incluir: true },
    { item: "003.", nome: "Projeto de Instalações Elétricas", coef: 0.8, preco: 12.5, incluir: true },
    { item: "004.", nome: "Projeto Hidráulico de Água Fria", coef: 0.7, preco: 9.5, incluir: true },
    { item: "005.", nome: "Projeto de Esgoto Sanitário", coef: 0.6, preco: 10.5, incluir: true },
    { item: "006.", nome: "Projeto de Drenagem de Águas Pluviais", coef: 0.6, preco: 9.5, incluir: true },
    { item: "007.", nome: "Projeto de SPDA / Para-raios", coef: 0.4, preco: 8, incluir: false },
    { item: "008.", nome: "Projeto de Combate a Incêndio (PPCI)", coef: 0.7, preco: 12, incluir: false },
    { item: "009.", nome: "Projeto de Gás", coef: 0.3, preco: 8.5, incluir: false },
    { item: "010.", nome: "Projeto de Ar-condicionado", coef: 0.5, preco: 10, incluir: false },
    { item: "011.", nome: "Memorial Descritivo / ART-RRT", coef: 1, preco: 3.5, incluir: false },
  ],
  condicoes: [
    "Entregáveis: arquivos digitais DWG e PDF em .ZIP.",
    "Revisões técnicas inclusas até aprovação no órgão competente, sem mudança significativa de escopo.",
    "Prazo estimado: 30 dias úteis após recebimento de todas as informações necessárias.",
    "Pagamento: 50% no início; saldo conforme cronograma acordado.",
    "Validade desta proposta: 30 (trinta) dias.",
    "Para fundações, o contratante deverá fornecer laudo de sondagem.",
  ],
}

export type Cliente = { nome: string; telefone: string; email: string }
export type DisciplinaLinha = {
  item: string
  nome: string
  coef: number
  preco: number
  areaProjeto: number
  total: number
}
export type ItemCalc = {
  nome: string
  area: number
  disciplinas: DisciplinaLinha[]
  subtotal: number
}
export type OrcamentoDoc = {
  numero?: string
  cliente: Cliente
  projeto: string
  cidade: string
  itens: ItemCalc[]
  total: number
  totalPorM2: number
  data?: Date | string
  status?: string
  notas?: string
}

const r2 = (n: number) => Math.round(n * 100) / 100

export const brl = (n: number) =>
  (+n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export const num = (n: number) =>
  (+n || 0).toLocaleString("pt-BR", { maximumFractionDigits: 2 })

export function calcItem(it: { nome: string; area: number; sel: number[] }): ItemCalc {
  const A = Math.max(0, +it.area || 0)
  const disciplinas = ORC_CONFIG.disciplinas
    .map((d, i) => ({ d, i }))
    .filter((x) => it.sel.includes(x.i))
    .map(({ d }) => ({
      item: d.item,
      nome: d.nome,
      coef: d.coef,
      preco: d.preco,
      areaProjeto: r2(A * d.coef),
      total: r2(A * d.coef * d.preco),
    }))
  return {
    nome: String(it.nome || "").slice(0, 160),
    area: A,
    disciplinas,
    subtotal: r2(disciplinas.reduce((s, x) => s + x.total, 0)),
  }
}

export function calcTotal(itens: ItemCalc[]) {
  const total = r2(itens.reduce((s, i) => s + i.subtotal, 0))
  const area = itens.reduce((s, i) => s + i.area, 0)
  return { total, area, totalPorM2: area ? r2(total / area) : 0 }
}

export function numeroOrcamento() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const bytes = crypto.getRandomValues(new Uint8Array(4))
  const code = [...bytes].map((b) => alphabet[b % alphabet.length]).join("")
  return `ORC-${new Date().getFullYear()}-${code}`
}

export function whatsappHref(o: OrcamentoDoc) {
  const text =
    `Olá! Gostaria de um orçamento.\nCliente: ${o.cliente.nome || "-"}\nProjeto: ${o.projeto || "-"}\nCidade: ${o.cidade || "-"}\n` +
    o.itens
      .map(
        (it, k) =>
          `• ${it.nome || "Projeto " + (k + 1)} (${num(it.area)} m²): ${it.disciplinas.map((x) => x.nome).join(", ")}`,
      )
      .join("\n") +
    `\nTotal estimado: ${brl(o.total)}`
  return `https://wa.me/${ORC_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`
}
