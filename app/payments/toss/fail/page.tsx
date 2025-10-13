'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function FailInner() {
  const search = useSearchParams()
  const router = useRouter()
  const code = search.get('code')
  const message = search.get('message') || '결제가 실패했습니다.'

  return (
    <main style={{ padding: 24 }}>
      <h2>결제 실패</h2>
      <p style={{ color:'crimson' }}>{message}</p>
      {code && <p>코드: {code}</p>}
      <button onClick={() => router.push('/checkout')}
        style={{ marginTop: 12, padding:'10px 14px', border:'1px solid #ddd', borderRadius:8 }}>다시 시도</button>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<main style={{ padding:24 }}>불러오는 중...</main>}>
      <FailInner />
    </Suspense>
  )
}
