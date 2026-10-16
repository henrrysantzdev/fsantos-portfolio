import { useEffect } from "react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProjectCta } from "@/components/ferramentas/ProjectCta"
import { PageHero } from "@/components/ferramentas/PageHero"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { montarOrcamentoObra } from "@/lib/obra/obra-app"
import { cn } from "@/lib/utils"
import "@/styles/orcamento-obra.css"

const primary = cn(buttonVariants(), "h-10 px-4")
const outline = cn(buttonVariants({ variant: "outline" }), "h-10 px-4")
const outlineSmall = cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 px-3")

export function OrcamentoObraPage() {
  useEffect(() => montarOrcamentoObra(), [])

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="SINAPI · Manaus/AM"
        title="Orçamento estimativo de obra"
        note="Orçamento ESTIMATIVO — não substitui orçamento executivo elaborado a partir de projetos completos."
      >
        <p>
          Casas de baixo, médio e alto padrão e galpões. Informe o terreno e os ambientes e receba um orçamento analítico por etapa, com composições
          SINAPI da Caixa para Manaus/AM.
        </p>
        <p className="mt-2 text-sm" id="oref" />
      </PageHero>
      <main className="obra-app ob simples mx-auto max-w-6xl px-5 py-8">
        <form id="ob-form" className="oform" autoComplete="on" onSubmit={(event) => event.preventDefault()}>
          <fieldset id="auth">
            <legend>1. Sua conta</legend>
            <div id="au-out">
              <p className="onote">Para gerar e salvar o orçamento é preciso entrar ou criar uma conta gratuita.</p>
              <p>
                <button type="button" className={primary} id="au-google">
                  Entrar com Google
                </button>
              </p>
              <div className="autabs">
                <button type="button" className="on" data-m="login">
                  Entrar com e-mail
                </button>
                <button type="button" data-m="cad">
                  Criar conta
                </button>
              </div>
              <div className="ogrid">
                <label className="au-cad" hidden>
                  Nome completo*
                  <Input id="au-nome" maxLength={120} autoComplete="name" />
                </label>
                <label className="au-cad" hidden>
                  Telefone / WhatsApp*
                  <Input id="au-tel" maxLength={40} inputMode="tel" autoComplete="tel" />
                </label>
                <label>
                  E-mail*
                  <Input id="au-email" type="email" maxLength={120} autoComplete="email" />
                </label>
                <label>
                  Senha*
                  <Input id="au-pass" type="password" minLength={6} autoComplete="current-password" />
                </label>
              </div>
              <p>
                <button type="button" className={outline} id="au-go">
                  Entrar
                </button>{" "}
                <button type="button" className="linkbtn" id="au-reset">
                  Esqueci a senha
                </button>
              </p>
            </div>
            <div id="au-in" hidden>
              <p>
                Conectado como <b id="au-who" />{" "}
                <button type="button" className="linkbtn" id="au-sair">
                  Sair
                </button>
              </p>
              <div className="ogrid">
                <label>
                  Nome*
                  <Input id="c-nome" maxLength={120} autoComplete="name" />
                </label>
                <label>
                  Telefone / WhatsApp*
                  <Input id="c-tel" maxLength={40} inputMode="tel" autoComplete="tel" />
                </label>
                <label>
                  E-mail
                  <Input id="c-email" maxLength={120} type="email" readOnly />
                </label>
                <label>
                  Cidade da obra
                  <Input id="c-cid" maxLength={100} defaultValue="Manaus/AM" />
                </label>
              </div>
            </div>
            <p className="omsg" id="au-msg" role="status" />
          </fieldset>

          <div className="omodo" role="radiogroup" aria-label="Modo do orçamento">
            <button type="button" role="radio" id="md-s" aria-checked="true" className="on">
              Modo simples
            </button>
            <button type="button" role="radio" id="md-a" aria-checked="false">
              Modo avançado
            </button>
            <small id="md-txt">Informe tipo, terreno, muro e área; os ambientes seguem a distribuição típica do padrão.</small>
          </div>

          <fieldset>
            <legend>2. Tipo de obra e parâmetros</legend>
            <div className="ogrid">
              <label>
                <span className="lt">
                  Obra <small>(nome/descrição)</small>
                </span>
                <Input id="p-obra" maxLength={160} placeholder="Ex.: Residência Silva — Ponta Negra" />
              </label>
              <label>
                <span className="lt">
                  Cliente <small>(nome)</small>
                </span>
                <Input id="p-cli" maxLength={120} placeholder="Nome do cliente da obra" />
              </label>
              <label>
                Tipo de obra
                <select id="p-tipo" defaultValue="medio">
                  <option value="baixo">Casa — baixo padrão</option>
                  <option value="medio">Casa — médio padrão</option>
                  <option value="alto">Casa — alto padrão</option>
                  <option value="galpao_ind">Galpão industrial</option>
                  <option value="galpao_com">Galpão comercial</option>
                  <option value="muro_contencao">Muro de contenção</option>
                </select>
              </label>
              <label className="cont-only">
                Sistema do muro
                <select id="p-csis" defaultValue="cortina">
                  <option value="cortina">Cortina de concreto armado</option>
                  <option value="bloco">Bloco de concreto armado (estrutural grauteado)</option>
                </select>
              </label>
              <label className="cont-only">
                Comprimento do muro (m)
                <Input id="p-cl" inputMode="decimal" defaultValue="20,00" />
              </label>
              <label className="cont-only">
                Altura de terra contida (m)
                <Input id="p-ch" inputMode="decimal" defaultValue="2,50" />
              </label>
              <label id="l-area" className="s-only nc">
                Área construída (m²)
                <Input id="p-area" inputMode="decimal" defaultValue="100,00" />
              </label>
              <label id="l-pav" className="nc">
                Nº de pavimentos
                <Input id="p-pav" type="number" min={1} max={4} defaultValue={1} />
              </label>
              <label id="l-cob" className="nc adv-only">
                Cobertura
                <select id="p-cob" defaultValue="simples">
                  <option value="simples">Simples (telhado + forro)</option>
                  <option value="completa">Completa (laje + estrutura metálica + telhado)</option>
                </select>
              </label>
              <label className="nc adv-only">
                Telha
                <select id="p-telha" defaultValue="simples">
                  <option value="simples">Simples (padrão do tipo)</option>
                  <option value="termo">Termoacústica (sanduíche)</option>
                </select>
              </label>
              <label id="l-pis" className="nc adv-only">
                Piscina
                <select id="p-pis" defaultValue="0">
                  <option value="0">Sem piscina</option>
                  <option value="1">Com piscina</option>
                </select>
              </label>
              <label className="nc l-pisd adv-only" hidden>
                Comprimento (m)
                <Input id="p-pisc" inputMode="decimal" defaultValue="8,00" />
              </label>
              <label className="nc l-pisd adv-only" hidden>
                Largura (m)
                <Input id="p-pisl" inputMode="decimal" defaultValue="4,00" />
              </label>
              <label className="nc l-pisd adv-only" hidden>
                Profundidade (m)
                <Input id="p-pisp" inputMode="decimal" defaultValue="1,40" />
              </label>
              <label id="l-mez" className="nc adv-only" hidden>
                Mezanino
                <select id="p-mez" defaultValue="0">
                  <option value="0">Sem mezanino</option>
                  <option value="1">Com mezanino</option>
                </select>
              </label>
              <label id="l-meza" className="adv-only" hidden>
                Área do mezanino (m²)
                <Input id="p-meza" inputMode="decimal" defaultValue="100,00" />
              </label>
              <label className="nc adv-only">
                Pé-direito (m)
                <Input id="p-pd" inputMode="decimal" defaultValue="2,80" />
              </label>
              <label>
                Regime SINAPI
                <select id="p-reg" defaultValue="nd">
                  <option value="nd">Não desonerado</option>
                  <option value="d">Desonerado</option>
                </select>
              </label>
              <label>
                BDI (%)
                <Input id="p-bdi" inputMode="decimal" defaultValue="25" />
              </label>
              <label className="nc ck">
                <span>
                  <input type="checkbox" id="p-cal" defaultChecked /> Calibrar pelo CUB-AM (casas)
                </span>
              </label>
            </div>
          </fieldset>

          <fieldset className="nc">
            <legend>3. Terreno e muro</legend>
            <div className="ogrid">
              <label>
                Largura / frente (m)
                <Input id="t-l" inputMode="decimal" defaultValue="10" />
              </label>
              <label>
                Comprimento (m)
                <Input id="t-c" inputMode="decimal" defaultValue="25" />
              </label>
              <label className="ck">
                <span>
                  <input type="checkbox" id="m-on" defaultChecked /> Murar o terreno
                </span>
              </label>
              <label>
                Altura do muro (m)
                <Input id="m-h" inputMode="decimal" defaultValue="2,00" />
              </label>
            </div>
            <div className="disc" id="m-lados">
              <label>
                <input type="checkbox" id="m-frente" /> Frente
              </label>
              <label>
                <input type="checkbox" id="m-fundos" defaultChecked /> Fundos
              </label>
              <label>
                <input type="checkbox" id="m-esq" defaultChecked /> Lateral esquerda
              </label>
              <label>
                <input type="checkbox" id="m-dir" defaultChecked /> Lateral direita
              </label>
            </div>
          </fieldset>

          <fieldset className="nc">
            <legend>
              4. Ambientes <small>(indique o pavimento de cada um — padrão Térreo; “Todos” repete o ambiente em cada pavimento)</small>
            </legend>
            <div className="otab">
              <table className="obamb">
                <thead>
                  <tr>
                    <th>Ambiente</th>
                    <th>Tipo</th>
                    <th>Largura (m)</th>
                    <th>Comprimento (m)</th>
                    <th className="c-pav">Pavimento</th>
                    <th>Área (m²)</th>
                    <th>
                      <span className="sr-only">Remover</span>
                    </th>
                  </tr>
                </thead>
                <tbody id="amb" />
              </table>
            </div>
            <p className="onote warn" id="a-note" hidden />
            <p className="onote" id="a-sum" />
            <p className="s-only">
              <button type="button" className={outlineSmall} id="a-adv">
                Personalizar no modo avançado
              </button>
            </p>
            <p className="adv-only amb-actions">
              <select id="a-kind" aria-label="Tipo de ambiente a adicionar" defaultValue="">
                <option value="">Ambiente genérico</option>
                <option value="gourmet">Área gourmet</option>
                <option value="edicula">Edícula (+ banheiro)</option>
                <option value="escritorio">Escritório</option>
              </select>
              <button type="button" className={outlineSmall} id="a-add">
                + Ambiente
              </button>
              <button type="button" className={outlineSmall} id="a-pre">
                Restaurar ambientes padrão do tipo
              </button>
            </p>
          </fieldset>
        </form>

        <section id="res" className="obres" aria-live="polite" />
        <p className="omsg" id="ob-msg" role="status" />
        <p className="omsg" id="sinapi-msg" role="status" />
        <div className="obact">
          <button type="button" className={primary} id="b-pdf">
            Gerar orçamento em PDF
          </button>
          <button type="button" className={outline} id="b-csv">
            Exportar CSV
          </button>
          <button type="button" className={outline} id="b-xlsx">
            Exportar XLSX
          </button>
          <button type="button" className={outline} id="b-sinapi">
            Verificar atualização SINAPI
          </button>
          <a className={outline} id="b-wa" href="https://wa.me/5592992262786" target="_blank" rel="noopener">
            Enviar PDF pelo WhatsApp
          </a>
        </div>
        <section id="meus" className="obmeus" hidden>
          <h3>Meus orçamentos</h3>
          <p className="omsg" id="meus-msg" role="status" />
          <p id="ed-bar" className="onote" hidden>
            <b id="ed-txt" />{" "}
            <button type="button" className="linkbtn" id="ed-cancel">
              Cancelar edição
            </button>
          </p>
          <div className="otab">
            <table className="obt">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Número</th>
                  <th>Tipo</th>
                  <th>Área (m²)</th>
                  <th>Total</th>
                  <th>R$/m²</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody id="meus-rows" />
            </table>
          </div>
        </section>
        <details className="obreg">
          <summary>Regras de cálculo dos quantitativos (premissas)</summary>
          <ol id="regras" />
        </details>
        <section id="tab" />
      </main>
      <ProjectCta
        title="Quer um orçamento executivo?"
        text="O orçamento executivo é feito a partir dos projetos completos (arquitetura, estrutura e instalações), com levantamento real de quantitativos."
      />
      <SiteFooter />
      <div id="proposta" className="obra-proposta proposta-root" />
    </>
  )
}
