'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic' // prevent prerender issues with search params

function VAFailInner() {
  const search = useSearchParams()
  const router = useRouter()
  const code = search.get('code')
  const message = search.get('message') || '가상계좌 생성이 실패했습니다.'

  return (
    <main style={{ padding: 24 }}>
      <h2>실패</h2>
      <p style={{ color:'crimson' }}>{message}</p>
      {code && <p>코드: {code}</p>}
      <button onClick={() => router.push('/checkout-va')}
        style={{ marginTop: 12, padding:'10px 14px', border:'1px solid #ddd', borderRadius:8 }}>다시 시도</button>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<main style={{ padding:24 }}>불러오는 중...</main>}>
      <VAFailInner />
    </Suspense>
  )
}
