export { cn } from "cn"

// Formato brasileiro: vírgula decimal e ponto de milhar ("1.500,75"); sem vírgula, ponto em grupos de 3 é milhar ("1.500") e os demais são decimal ("2.5").
export function parseDecimal(raw: string | number) {
  const text = String(raw).replace(/\s/g, "")
  let normalized: string
  if (text.includes(",")) {
    if (!/^-?(\d{1,3}(\.\d{3})+|\d+),\d*$/.test(text)) return NaN
    normalized = text.replace(/\./g, "").replace(",", ".")
  } else if (/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(text)) {
    normalized = text.replace(/\./g, "")
  } else normalized = text
  return /^-?(\d+\.?\d*|\.\d+)$/.test(normalized) ? Number(normalized) : NaN
}
