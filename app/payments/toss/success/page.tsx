'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function toNumber(v: any) {
  const n = Number(String(v ?? '').replace(/[^\d.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

export default function SuccessPage() {
  const search = useSearchParams()
  const router = useRouter()
  const [state, setState] = useState<any>({ loading: true })

  useEffect(() => {
    const paymentKey = search.get('paymentKey')
    const orderId = search.get('orderId')
    const amount = toNumber(search.get('amount'))
    const items = JSON.parse(localStorage.getItem('hgcc_items') || '[]')
    const buyer = JSON.parse(localStorage.getItem('hgcc_buyer') || '{}')

    const run = async () => {
      try {
        const res = await fetch('/api/payments/toss/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentKey, orderId, amount, items, buyer }),
        })
        const json = await res.json()
        if (!res.ok || json.error) {
          setState({ error: json.error || 'confirm failed', detail: json.detail })
          return
        }
        localStorage.removeItem('hgcc_items')
        localStorage.removeItem('hgcc_buyer')
        setState({ ok: true, orderId, amount, payment: json.payment })
      } catch (e: any) {
        setState({ error: e?.message || 'network failed' })
      }
    }

    if (paymentKey && orderId && amount > 0) run()
  }, [search])

  if (state.loading) {
    return <main style={{ padding: 24 }}>처리 중...</main>
  }
  if (state.error) {
    return <main style={{ padding: 24, color: 'crimson' }}>
      결제 확인 중 오류가 발생했습니다.<br/>사유: {String(state.error)}
      {state.detail && <pre>{JSON.stringify(state.detail, null, 2)}</pre>}
    </main>
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>주문 완료</h2>
      <p>주문번호: <b>{state.orderId}</b></p>
      <p>결제금액: <b>{state.amount?.toLocaleString()}원</b></p>
      <button onClick={() => router.push('/')}
        style={{ marginTop: 12, padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8 }}>홈으로</button>
    </main>
  )
}
