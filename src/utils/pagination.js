/** Devuelve las páginas a mostrar, con 'gap-N' donde hay saltos. */
export function getPageItems(current, total, siblings = 1) {
  if (total <= 0) return []
  const pages = new Set([1, total])
  for (let p = current - siblings; p <= current + siblings; p++) {
    if (p >= 1 && p <= total) pages.add(p)
  }
  const sorted = [...pages].sort((a, b) => a - b)
  const items = []
  sorted.forEach((p, i) => {
    if (i > 0) {
      const gap = p - sorted[i - 1]
      if (gap === 2) items.push(p - 1)
      else if (gap > 2) items.push(`gap-${p}`)
    }
    items.push(p)
  })
  return items
}
