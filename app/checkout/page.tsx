'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window { TossPayments?: any }
}

function loadToss(clientKey: string) {
  return new Promise<void>((resolve, reject) => {
    if (window.TossPayments) return resolve()
    const s = document.createElement('script')
    s.src = 'https://js.tosspayments.com/v1'
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('failed to load toss sdk'))
    document.head.appendChild(s)
  })
}

function genOrderId() {
  const rand = Math.random().toString(36).slice(2, 8)
  return `HGCC-${Date.now()}-${rand}`
}

export default function CheckoutPage() {
  const [buyer, setBuyer] = useState({ name:'', phone:'', email:'' })
  const [amount, setAmount] = useState<number>(12000)
  const [orderName, setOrderName] = useState('중고도서 1권')
  const [loading, setLoading] = useState(false)
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string | undefined

  useEffect(() => {
    // demo: 샘플 아이템을 로컬스토리지에 저장
    const items = [{ isbn: '9791162243077', qty: 1, price: 12000 }]
    localStorage.setItem('hgcc_items', JSON.stringify(items))
    localStorage.setItem('hgcc_buyer', JSON.stringify(buyer))
  }, [])

  const pay = async () => {
    if (!clientKey) { alert('환경변수 NEXT_PUBLIC_TOSS_CLIENT_KEY가 없습니다'); return }
    if (!amount || amount <= 0) { alert('금액이 올바르지 않습니다'); return }
    setLoading(true)
    try {
      await loadToss(clientKey)
      const toss = window.TossPayments(clientKey)
      const orderId = genOrderId()
      localStorage.setItem('hgcc_buyer', JSON.stringify(buyer))

      await toss.requestPayment('카드', {
        amount,
        orderId,
        orderName,
        customerName: buyer.name || '고객',
        successUrl: window.location.origin + '/payments/toss/success',
        failUrl: window.location.origin + '/payments/toss/fail',
      })
    } catch (e: any) {
      alert(e?.message || '결제 시작에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 520, margin:'0 auto' }}>
      <h2>주문 / 결제 (샘플)</h2>
      <div style={{ display:'grid', gap:10 }}>
        <label>이름 <input value={buyer.name} onChange={e=>setBuyer({ ...buyer, name:e.target.value })}
          style={{ width:'100%', padding:10, border:'1px solid #ddd', borderRadius:8 }}/></label>
        <label>휴대폰 <input value={buyer.phone} onChange={e=>setBuyer({ ...buyer, phone:e.target.value })}
          style={{ width:'100%', padding:10, border:'1px solid #ddd', borderRadius:8 }}/></label>
        <label>이메일 <input value={buyer.email} onChange={e=>setBuyer({ ...buyer, email:e.target.value })}
          style={{ width:'100%', padding:10, border:'1px solid #ddd', borderRadius:8 }}/></label>
        <label>주문명 <input value={orderName} onChange={e=>setOrderName(e.target.value)}
          style={{ width:'100%', padding:10, border:'1px solid #ddd', borderRadius:8 }}/></label>
        <label>결제금액(원) <input inputMode="numeric" value={amount} onChange={e=>setAmount(Number(e.target.value)||0)}
          style={{ width:'100%', padding:10, border:'1px solid #ddd', borderRadius:8 }}/></label>
      </div>
      <button disabled={loading} onClick={pay}
        style={{ marginTop: 14, padding:'12px 16px', border:'1px solid #ddd', borderRadius:8, background:'#111', color:'#fff' }}>
        {loading ? '준비 중...' : '카드로 결제하기'}
      </button>
      <p style={{ marginTop:8, fontSize:12, color:'#666' }}>테스트용 샘플 페이지입니다. 실제론 장바구니에서 금액/품목을 넘겨받으세요.</p>
    </main>
  )
}
