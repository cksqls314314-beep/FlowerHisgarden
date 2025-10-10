'use client'

import { useEffect, useState } from 'react'

export default function Cover({ isbn, alt }: { isbn: string, alt?: string }) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        if (!isbn) return
        const res = await fetch(`/api/cover/${encodeURIComponent(isbn)}`)
        const json = await res.json()
        if (!alive) return
        if (json?.cover) setSrc(json.cover as string)
      } catch {}
    }
    load()
    return () => { alive = false }
  }, [isbn])

  if (!src) {
    return (
      <div style={{ width: 72, height: 96, background: '#f5f5f5', border: '1px solid #eee', borderRadius: 6 }} />
    )
  }

  return (
    <img
      src={src}
      alt={alt || 'cover'}
      width={72}
      height={96}
      style={{ objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }}
      loading="lazy"
    />
  )
}
