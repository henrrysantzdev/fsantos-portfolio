// PDF do simulador de honorários: usa os mesmos valores exibidos no resumo (área × taxa de cada disciplina marcada).
const PDF_LIB = "https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.2/dist/html2pdf.bundle.min.js"
const CONDICOES = [
  "Entregáveis: arquivos digitais DWG e PDF em .ZIP.",
  "Revisões técnicas inclusas até aprovação no órgão competente, sem mudança significativa de escopo.",
  "Prazo estimado: 30 dias úteis após recebimento de todas as informações necessárias.",
  "Pagamento: 50% no início; saldo conforme cronograma acordado.",
  "Validade desta estimativa: 30 (trinta) dias.",
  "Para fundações, o contratante deverá fornecer laudo de sondagem.",
]
let pdfLib = null

function loadPdfLib() {
  if (window.html2pdf) return Promise.resolve(window.html2pdf)
  pdfLib ||= new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = PDF_LIB
    script.onload = () => resolve(window.html2pdf)
    script.onerror = () => {
      pdfLib = null
      reject(new Error("html2pdf"))
    }
    document.head.append(script)
  })
  return pdfLib
}

const esc = (value) => String(value).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c])
const brl = (value) => "R$ " + value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const field = (id) => document.getElementById(id).value.trim()

function documentHtml(data) {
  const navy = "#10253f", orange = "#ea8427"
  const cell = "border:1px solid #c9d3e3;padding:6px 8px;"
  const rows = data.itens
    .map(
      (item) =>
        `<tr><td style="${cell}">${esc(item.label)}</td><td style="${cell}text-align:right">${brl(item.rate)}</td><td style="${cell}text-align:right">${data.area} m²</td><td style="${cell}text-align:right">${brl(item.subtotal)}</td></tr>`
    )
    .join("")
  const info = [
    ["Contratante", data.nome],
    ["Telefone / WhatsApp", data.telefone],
    ["E-mail", data.email || "—"],
    ["Cidade / UF", data.cidade || "—"],
    ["Obra", data.obra || "—"],
  ]
    .map(([k, v]) => `<tr><td style="${cell}width:34%;color:#475569">${k}</td><td style="${cell}font-weight:600">${esc(v)}</td></tr>`)
    .join("")
  return `<div style="width:190mm;font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:10.5pt;line-height:1.45;color:#111;background:#fff">
  <div style="display:flex;align-items:center;gap:12px;background:${navy};border-bottom:3px solid ${orange};padding:10px 14px;color:#fff">
    <img src="/assets/img/logo-kf-720.png" alt="KF Engenharia" style="height:36px;background:#fff;border-radius:6px;padding:4px 8px">
    <div style="flex:1;font-size:9pt;color:#c9d3e3"><b style="display:block;font-size:12pt;color:${orange}">KF Engenharia — Projetos de Engenharia</b>Responsável técnico: Eng. Civil Francirley Pereira Santos — CREA 31.410-AM</div>
    <div style="text-align:right;font-size:8.5pt"><b style="color:${orange}">Nº ${esc(data.numero)}</b><br>${esc(data.data)}</div>
  </div>
  <h1 style="margin:18px 0 2px;font-weight:800;text-align:center;font-size:17pt;color:${navy}">Memória de cálculo de honorários</h1>
  <p style="margin:0 0 14px;text-align:center;color:#475569">Estimativa gerada pelo simulador online da KF Engenharia</p>
  <h2 style="font-weight:700;margin:14px 0 6px;border-bottom:2px solid ${orange};font-size:11.5pt;color:${navy}">1. Dados da obra</h2>
  <table style="width:100%;border-collapse:collapse">${info}</table>
  <h2 style="font-weight:700;margin:16px 0 6px;border-bottom:2px solid ${orange};font-size:11.5pt;color:${navy}">2. Composição dos honorários</h2>
  <table style="width:100%;border-collapse:collapse">
    <thead><tr style="background:${navy};color:#fff"><th style="${cell}text-align:left">Disciplina</th><th style="${cell}text-align:right">Taxa</th><th style="${cell}text-align:right">Área</th><th style="${cell}text-align:right">Subtotal</th></tr></thead>
    <tbody>${rows}<tr style="background:#fde9d4;font-weight:700;color:${navy}"><td style="${cell}" colspan="3">Valor total estimado (taxa agrupada ${brl(data.taxa)}/m²)</td><td style="${cell}text-align:right">${brl(data.total)}</td></tr></tbody>
  </table>
  <p style="margin:8px 0 0;font-size:9pt;color:#334155">Compatibilização BIM inclusa (LOD 400) · ART formal de projeto inclusa.</p>
  <h2 style="font-weight:700;margin:16px 0 6px;border-bottom:2px solid ${orange};font-size:11.5pt;color:${navy}">3. Condições</h2>
  <ul style="margin:0;padding-left:18px;list-style:disc;font-size:9.5pt">${CONDICOES.map((c) => `<li>${c}</li>`).join("")}</ul>
  <p style="margin:12px 0 0;padding:8px 10px;border:1px dashed #a14b00;color:#7a3a00;font-size:9pt">Valores estimados a partir da área informada. O valor final é confirmado após a análise do projeto e do escopo pela equipe técnica.</p>
  <div style="margin:34px auto 0;width:60%;text-align:center;font-size:9.5pt"><div style="border-top:1px solid #111;padding-top:6px"><b>ENG. CIVIL FRANCIRLEY PEREIRA SANTOS</b><br>CREA 31.410-AM</div></div>
  <div style="margin-top:22px;border-top:2px solid ${orange};padding-top:5px;display:flex;justify-content:space-between;font-size:8pt;color:${navy}"><span>KF Engenharia · WhatsApp (92) 99226-2786 · kfengenhariacontato@gmail.com</span><span>Manaus-AM</span></div>
</div>`
}

async function generateSimulatedPDF(event) {
  if (!validSimulatorForm()) return
  const button = event?.currentTarget || document.querySelector('[onclick^="generateSimulatedPDF"]')
  const label = button?.querySelector("span:last-child")
  const original = label?.textContent

  const area = readArea()
  const itens = [...document.querySelectorAll(".discipline-cb:checked")].map((cb) => {
    const rate = parseFloat(cb.dataset.rate)
    return { label: cb.dataset.label, rate, subtotal: area * rate }
  })
  const now = new Date()
  const pad = (n) => String(n).padStart(2, "0")
  const nome = field("calc-name")
  const data = {
    nome,
    telefone: field("calc-phone"),
    email: field("calc-email"),
    cidade: field("calc-city"),
    obra: field("calc-desc"),
    area: area.toFixed(0),
    itens,
    taxa: itens.reduce((sum, item) => sum + item.rate, 0),
    total: itens.reduce((sum, item) => sum + item.subtotal, 0),
    numero: `SIM-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`,
    data: now.toLocaleDateString("pt-BR"),
  }
  const slug = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") || "cliente"

  if (button) button.disabled = true
  if (label) label.textContent = "Gerando PDF…"
  try {
    const html2pdf = await loadPdfLib()
    await html2pdf()
      .set({
        margin: [10, 10, 12, 10],
        filename: `Orcamento-KF-${slug}.pdf`,
        image: { type: "jpeg", quality: 0.95 },
        // scrollX/scrollY: 0 evita PDF em branco com a página rolada; windowWidth sem a barra de rolagem evita corte na borda direita
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          scrollX: 0,
          scrollY: 0,
          windowWidth: document.documentElement.clientWidth,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .from(documentHtml(data), "string")
      .save()
  } catch {
    alert("Não foi possível gerar o PDF agora. Verifique sua conexão e tente novamente.")
  } finally {
    if (button) button.disabled = false
    if (label) label.textContent = original
  }
}

window.generateSimulatedPDF = generateSimulatedPDF
