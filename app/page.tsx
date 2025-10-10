'use client'

import { useEffect, useMemo, useState } from 'react'

type Book = {
  id: string
  isbn: string
  title: string
  author: string
  publisher: string
  pubDate: string
  listPrice: number | string | null
  sellPrice: number | string | null
  stock: number | string | null
  grade: string
}

// 숫자 변환(문자/공백/원/쉼표 섞여도 안전하게)
const toNumber = (v: any): number => {
  if (typeof v === 'number') return v
  const n = Number(String(v ?? '').replace(/[^\d.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

// 1,234 식 포맷 (숫자 아니면 '0')
const fmt = (v: any): string => {
  const n = toNumber(v)
  return Number.isFinite(n) ? n.toLocaleString() : '0'
}

// 표시/필터에 사용할 가격 선택: 판매가(H) 우선, 없으면 정가(F), 둘 다 없으면 null
const pickPrice = (b: Book): number | null => {
  const sell = toNumber(b.sellPrice)
  const list = toNumber(b.listPrice)
  if (sell > 0) return sell
  if (list > 0) return list
  return null
}

export default function Page() {
  const [q, setQ] = useState('')
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [items, setItems] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/books', { cache: 'no-store' })
        const json = await res.json()
        if (json.error) throw new Error(json.error)
        setItems(json.items || [])
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    let arr = items.filter(b => toNumber(b.stock) > 0)

    if (q.trim()) {
      const s = q.trim().toLowerCase()
      arr = arr.filter(b =>
        (b.title || '').toLowerCase().includes(s) ||
        (b.author || '').toLowerCase().includes(s) ||
        (b.publisher || '').toLowerCase().includes(s) ||
        (b.isbn || '').includes(s)
      )
    }

    const minN = toNumber(min)
    const maxN = toNumber(max)

    if (minN) arr = arr.filter(b => {
      const p = pickPrice(b)
      return (p ?? 0) >= minN
    })

    if (maxN) arr = arr.filter(b => {
      const p = pickPrice(b)
      return (p ?? 0) <= maxN
    })

    return arr
  }, [items, q, min, max])

  return (
    <main>
      <section style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'end', marginBottom: 16 }}>
        <div style={{ gridColumn: '1 / span 2' }}>
          <label style={{ fontSize: 12, color: '#444' }}>검색 (제목/저자/출판사/ISBN)</label>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="예: 유시민, 무라카미, 979..."
            style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8 }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#444' }}>가격 필터 (원)</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input inputMode="numeric" value={min} onChange={e=>setMin(e.target.value)} placeholder="최소" style={{ flex:1, padding: 10, border:'1px solid #ddd', borderRadius:8 }}/>
            <input inputMode="numeric" value={max} onChange={e=>setMax(e.target.value)} placeholder="최대" style={{ flex:1, padding: 10, border:'1px solid #ddd', borderRadius:8 }}/>
          </div>
        </div>
      </section>

      {loading && <p>불러오는 중...</p>}
      {error && <p style={{ color: 'crimson' }}>에러: {error}</p>}

      <ul style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', listStyle:'none', padding:0 }}>
        {filtered.map(b => {
          const price = pickPrice(b)
          const haveSell = toNumber(b.sellPrice) > 0
          const haveList = toNumber(b.listPrice) > 0

          return (
            <li key={b.id} style={{ border:'1px solid #eee', borderRadius: 12, padding: 14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', gap:8 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{b.title}</div>
                  <div style={{ color:'#555', fontSize: 13 }}>{b.author} · {b.publisher}</div>
                  <div style={{ color:'#777', fontSize: 12 }}>출간일 {b.pubDate || '-'}</div>
                </div>
                <div style={{ fontSize: 12, color:'#666' }}>{b.grade || ''}</div>
              </div>

              <div style={{ marginTop: 10, display:'flex', gap:10, alignItems:'baseline' }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {price !== null ? `${fmt(price)}원` : '가격문의'}
                </div>
                {(haveSell && haveList) ? (
                  <div style={{ fontSize:12, color:'#999' }}>정가 {fmt(b.listPrice)}원</div>
                ) : null}
              </div>

              <div style={{ marginTop: 6, fontSize: 12, color: '#444' }}>ISBN {b.isbn}</div>
              <div style={{ marginTop: 8, display:'flex', gap:8 }}>
                <span style={{ fontSize: 12, padding:'4px 8px', border:'1px solid #eee', borderRadius: 999 }}>재고 {toNumber(b.stock)}권</span>
                {b.grade && <span style={{ fontSize: 12, padding:'4px 8px', border:'1px solid #eee', borderRadius: 999 }}>{b.grade}</span>}
              </div>
            </li>
          )
        })}
      </ul>

      {!loading && filtered.length === 0 && (
        <p style={{ color:'#666' }}>검색 결과가 없습니다.</p>
      )}
    </main>
  )
}
