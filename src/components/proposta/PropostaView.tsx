import type { OrcamentoDoc } from "@/lib/orcamento"
import { brl, num, ORC_CONFIG } from "@/lib/orcamento"
import { Button } from "@/components/ui/button"

export function PropostaView({
  orcamento,
  onClose,
}: {
  orcamento: OrcamentoDoc
  onClose: () => void
}) {
  const cliente = orcamento.cliente
  const hoje =
    orcamento.data instanceof Date
      ? orcamento.data.toLocaleDateString("pt-BR")
      : orcamento.data || new Date().toLocaleDateString("pt-BR")
  const area = orcamento.itens.reduce((sum, item) => sum + (+item.area || 0), 0)
  const multi = orcamento.itens.length > 1
  const blank = "________________"

  return (
    <div className="proposta-root fixed inset-0 z-50 overflow-auto bg-white text-neutral-900">
      <article className="mx-auto max-w-3xl px-6 py-10 font-serif leading-relaxed">
        <header className="flex items-center gap-4 border-b-4 border-[#0b1a30] pb-3">
          <img src="/assets/img/logo-fsantos.png" alt="" className="h-16" />
          <div>
            <strong>{ORC_CONFIG.empresa}</strong>
            <br />
            {ORC_CONFIG.responsavel} — CREA {ORC_CONFIG.crea}
          </div>
          {orcamento.numero && (
            <div className="ml-auto rounded-md border-2 border-primary px-2 py-1 font-sans text-sm font-bold text-[#0b1a30]">
              Nº {orcamento.numero}
            </div>
          )}
        </header>
        <p className="mt-4 border border-dashed border-amber-800 px-2 py-1 text-center font-sans text-sm font-semibold text-amber-800">
          Proposta preliminar — sujeita a confirmação
        </p>
        <h2 className="mt-4 text-center font-sans text-2xl font-semibold text-[#0b1a30]">PROPOSTA DE PREÇO</h2>
        <p className="text-center">Elaboração de Projeto de Arquitetura e Projetos Complementares</p>
        <p className="mt-4">
          {ORC_CONFIG.local}, {hoje}
        </p>
        <p>
          A(o): <b>{cliente.nome || blank}</b>
          <br />
          Projeto / obra: {orcamento.projeto || blank}
          <br />
          Cidade da obra: {orcamento.cidade || blank}
          <br />
          Telefone: {cliente.telefone || blank}
          {cliente.email ? (
            <>
              <br />
              E-mail: {cliente.email}
            </>
          ) : null}
        </p>
        <h3 className="mt-6 border-b-2 border-primary font-sans text-lg text-[#0b1a30]">1. Objeto</h3>
        <p>A presente proposta tem por objeto a elaboração dos projetos de arquitetura e complementares para a obra acima indicada, conforme disciplinas e valores descritos abaixo.</p>
        <h3 className="mt-6 border-b-2 border-primary font-sans text-lg text-[#0b1a30]">2. Área de referência</h3>
        <p>
          Área construída estimada: <b>{num(area)} m²</b>
          {multi
            ? ` (${orcamento.itens.map((item) => `${item.nome || "Projeto"}: ${num(item.area)} m²`).join("; ")}).`
            : "."}
        </p>
        <h3 className="mt-6 border-b-2 border-primary font-sans text-lg text-[#0b1a30]">3. Escopo e precificação</h3>
        {orcamento.itens.map((item, index) => (
          <div key={`${item.nome}-${index}`} className="mt-4">
            {multi && (
              <h4 className="font-sans font-semibold text-[#0b1a30]">
                3.{index + 1} {item.nome || `Projeto ${index + 1}`} — {num(item.area)} m²
              </h4>
            )}
            <table className="mt-2 w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#0b1a30] text-left text-white">
                  <th className="border border-neutral-400 px-2 py-1">Item</th>
                  <th className="border border-neutral-400 px-2 py-1">Disciplina</th>
                  <th className="border border-neutral-400 px-2 py-1">Coef.</th>
                  <th className="border border-neutral-400 px-2 py-1">Área projeto (m²)</th>
                  <th className="border border-neutral-400 px-2 py-1">R$/m²</th>
                  <th className="border border-neutral-400 px-2 py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {item.disciplinas.map((linha) => (
                  <tr key={linha.item}>
                    <td className="border border-neutral-400 px-2 py-1">{linha.item}</td>
                    <td className="border border-neutral-400 px-2 py-1">{linha.nome}</td>
                    <td className="border border-neutral-400 px-2 py-1">{num(linha.coef)}</td>
                    <td className="border border-neutral-400 px-2 py-1">{num(linha.areaProjeto)}</td>
                    <td className="border border-neutral-400 px-2 py-1">{brl(linha.preco)}</td>
                    <td className="border border-neutral-400 px-2 py-1">{brl(linha.total)}</td>
                  </tr>
                ))}
                <tr>
                  <td className="border border-neutral-400 px-2 py-1 font-semibold" colSpan={5}>
                    Subtotal
                  </td>
                  <td className="border border-neutral-400 px-2 py-1 font-semibold">{brl(item.subtotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
        <p className="mt-4 text-right text-lg">
          Valor total da proposta: <b>{brl(orcamento.total)}</b>{" "}
          <small>(média {brl(orcamento.totalPorM2)}/m²)</small>
        </p>
        <h3 className="mt-6 border-b-2 border-primary font-sans text-lg text-[#0b1a30]">4. Condições comerciais</h3>
        <ul className="list-disc pl-5">
          {ORC_CONFIG.condicoes.map((condicao) => (
            <li key={condicao}>{condicao}</li>
          ))}
        </ul>
        <h3 className="mt-6 border-b-2 border-primary font-sans text-lg text-[#0b1a30]">5. Aceite</h3>
        <p>Declaro estar de acordo com os termos desta proposta.</p>
        <div className="mt-12 flex flex-col items-center gap-10">
          <div className="w-full max-w-sm text-center">
            <div className="mb-2 h-10" />
            <div className="border-t border-black" />
            <p className="mt-2 text-sm">Assinatura do contratante</p>
          </div>
          <div className="w-full max-w-sm text-center text-sm">
            <img src="/assets/img/logo-fsantos.png" alt="" className="mx-auto mb-2 h-14" />
            <div className="border-t border-black" />
            <p className="mt-2">
              <b>ENG. CIVIL FRANCIRLEY PEREIRA SANTOS</b>
              <br />
              CREA: {ORC_CONFIG.crea}
              <br />
              {ORC_CONFIG.empresa}
              <br />
              Fone: {ORC_CONFIG.fone} | {ORC_CONFIG.email}
            </p>
          </div>
        </div>
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
