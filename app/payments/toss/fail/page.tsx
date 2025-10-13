'use client'

import { useSearchParams, useRouter } from 'next/navigation'

export default function FailPage() {
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
