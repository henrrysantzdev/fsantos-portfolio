import { GUIA } from "./guia-data"
import "./guia-data2"

export type GuiaSecao = { id: string; t: string; steps: unknown[] }

export const SECOES = GUIA.S as GuiaSecao[]
export const secaoHtml = (secao: GuiaSecao, print = false) => GUIA.html(secao, print) as string
