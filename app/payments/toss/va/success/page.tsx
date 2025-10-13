'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic' // prevent prerender issues with search params

function VASuccessInner() {
  const search = useSearchParams()
  const router = useRouter()
  const [state, setState] = useState<any>({ loading: true })

  useEffect(() => {
    const paymentKey = search.get('paymentKey')
    const orderId = search.get('orderId')
    const amount = search.get('amount')

    const run = async () => {
      try {
        const res = await fetch('/api/payments/toss/va/details?paymentKey=' + encodeURIComponent(String(paymentKey)), { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok || json.error) {
          setState({ error: json.error || '조회 실패', detail: json.detail })
          return
        }
        setState({ ok: true, orderId, amount, info: json })
      } catch (e: any) {
        setState({ error: e?.message || '네트워크 오류' })
      }
    }
    if (paymentKey) run()
    else setState({ error: '잘못된 요청입니다.' })
  }, [search, router])

  if (state.loading) return <main style={{ padding:24 }}>가상계좌 정보를 불러오는 중...</main>
  if (state.error) return <main style={{ padding:24, color:'crimson' }}>오류: {String(state.error)}</main>

  const va = state.info?.virtualAccount || {}
  return (
    <main style={{ padding: 24 }}>
      <h2>입금 안내</h2>
      <p>주문번호: <b>{state.orderId}</b></p>
      <div style={{ border:'1px solid #eee', borderRadius:12, padding:16, maxWidth:480 }}>
        <div>은행: <b>{va?.bank || '-'}</b></div>
        <div>계좌번호: <b>{va?.accountNumber || '-'}</b></div>
        <div>예금주: <b>{va?.customerName || '-'}</b></div>
        <div>입금금액: <b>{Number(state.amount||0).toLocaleString()}원</b></div>
        {va?.dueDate && <div>입금기한: <b>{new Date(va.dueDate).toLocaleString()}</b></div>}
      </div>
      <p style={{ marginTop:12, color:'#555', fontSize:13 }}>입금이 완료되면 자동으로 주문이 확정됩니다.</p>
      <button onClick={() => router.push('/')}
        style={{ marginTop: 12, padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8 }}>홈으로</button>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<main style={{ padding:24 }}>처리 중...</main>}>
      <VASuccessInner />
    </Suspense>
  )
}
