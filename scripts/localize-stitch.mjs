import fs from "node:fs"

const srcPath = `${process.env.TEMP}/fsantos-stitch.html`
let html = fs.readFileSync(srcPath, "utf8")

const urls = [
  ...new Set(
    [...html.matchAll(/https:\/\/lh3\.googleusercontent\.com\/aida-public\/[^"\s]+/g)].map((m) => m[0]),
  ),
]

const png = new Set([1, 9])
for (const [index, url] of urls.entries()) {
  const n = index + 1
  const ext = png.has(n) ? "png" : "jpg"
  html = html.split(url).join(`/stitch/img/stitch-${n}.${ext}`)
}

html = html.replace(
  'border border-slate-700 hover:border-primary" href="#orcamento-simulador"',
  'border border-slate-700 hover:border-primary" href="https://fsantoscalcfoundation.com.br/home" target="_blank" rel="noopener"',
)
html = html.replace(
  'hover:shadow-cyan-500/30 transition-all" href="#portfolio"',
  'hover:shadow-cyan-500/30 transition-all" href="https://santos-archirender-ai-96744710742.us-west1.run.app/" target="_blank" rel="noopener"',
)
html = html.replace(
  'onclick="scrollToEstimator()"',
  'onclick="window.top.location.href=\'/ferramentas\'"',
)

const mobile = `<details class="relative lg:hidden"><summary class="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-slate-200 text-navy-900 [&::-webkit-details-marker]:hidden" aria-label="Abrir menu"><span class="material-symbols-outlined">menu</span></summary><div class="absolute right-0 top-14 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"><a class="block rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="#sobre">Sobre o Engenheiro</a><a class="block rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="#portfolio">Portfólio de Obras</a><a class="block rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="#ferramentas">Softwares &amp; IA</a><a class="block rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="#orcamento-simulador">Simulador 2026</a><a class="block rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="#contato">Contato Direto</a><a class="block rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100" href="/ferramentas" target="_top">Ferramentas</a></div></details>`

const marker = "</nav><!-- Botões de Ação -->"
if (!html.includes(marker)) {
  console.error("nav marker missing")
  process.exit(1)
}
html = html.replace(marker, `</nav>${mobile}<!-- Botões de Ação -->`)

const checks = [
  ["calc", html.includes("fsantoscalcfoundation.com.br")],
  ["render", html.includes("santos-archirender-ai")],
  ["tools", html.includes("window.top.location.href='/ferramentas'")],
  ["menu", html.includes("Abrir menu")],
  ["img", html.includes("/stitch/img/stitch-1.png") && html.includes("/stitch/img/stitch-8.jpg")],
  ["remote", !html.includes("lh3.googleusercontent.com")],
  ["accent", html.includes("Portfólio")],
]
for (const [name, ok] of checks) {
  if (!ok) {
    console.error("failed", name)
    process.exit(1)
  }
}

fs.writeFileSync("public/stitch/index.html", html)
console.log("urls", urls.length, "bytes", Buffer.byteLength(html))
