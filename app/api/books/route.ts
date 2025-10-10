import type { NextRequest } from 'next/server'

export const revalidate = 30; // cache 30s

// Robust CSV parser: handles quotes, commas, and newlines within quotes.
function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let cur: string[] = []
  let field = ''
  let i = 0
  const n = text.length
  let inQuotes = false

  while (i < n) {
    const ch = text[i]

    if (inQuotes) {
      if (ch === '"') {
        // peek next
        if (i + 1 < n && text[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        } else {
          inQuotes = false
          i++
          continue
        }
      } else {
        field += ch
        i++
        continue
      }
    } else {
      if (ch === '"') {
        inQuotes = true
        i++
        continue
      }
      if (ch === ',') {
        cur.push(field)
        field = ''
        i++
        continue
      }
      if (ch === '\r') { i++; continue }
      if (ch === '\n') {
        cur.push(field)
        rows.push(cur)
        cur = []
        field = ''
        i++
        continue
      }
      field += ch
      i++
      continue
    }
  }
  // push last field/row
  cur.push(field)
  rows.push(cur)
  return rows.filter(r => r.length && r.some(c => c.trim().length > 0))
}

export async function GET(req: NextRequest) {
  const url = process.env.SHEET_CSV_URL
  if (!url) {
    return new Response(JSON.stringify({ error: 'Missing SHEET_CSV_URL env' }), { status: 500 })
  }
  try {
    const res = await fetch(url, { cache: 'no-store' })
    const csv = await res.text()
    const rows = parseCSV(csv)

    if (!rows.length) {
      return new Response(JSON.stringify({ items: [] }), { headers: { 'content-type': 'application/json' } })
    }

    const header = rows[0].map(h => h.trim())
    const dataRows = rows.slice(1)

    const idx = (name: string) => header.findIndex(h => h === name)

    const col = {
      isbn: idx('ISBN'),
      title: idx('제목'),
      author: idx('저자'),
      publisher: idx('출판사'),
      pubDate: idx('출간일'),
      listPrice: idx('정가'),
      buyPrice: idx('매입가'),
      sellPrice: idx('판매가'),
      stock: idx('재고수량'),
      note: idx('비고'),
    }

    // Defensive: if a column is missing, keep index = -1 so we fallback safely
    const toNumber = (v: any) => {
      const n = Number(String(v ?? '').replace(/[^\d.-]/g, ''))
      return Number.isFinite(n) ? n : 0
    }

    const items = dataRows.map((r, i) => {
      const get = (k: number) => (k >= 0 && k < r.length) ? r[k] : ''
      const stock = toNumber(get(col.stock))
      return {
        id: `${get(col.isbn) || 'X'}-${i}`,
        isbn: get(col.isbn),
        title: get(col.title),
        author: get(col.author),
        publisher: get(col.publisher),
        pubDate: get(col.pubDate),
        listPrice: toNumber(get(col.listPrice)),
        sellPrice: toNumber(get(col.sellPrice)),
        stock,
        grade: get(col.note),
      }
    }).filter(x => x.stock > 0)

    return new Response(JSON.stringify({ items }), { headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'fetch failed' }), { status: 500 })
  }
}
