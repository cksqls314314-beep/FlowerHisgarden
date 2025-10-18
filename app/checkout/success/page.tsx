'use client';
import { useEffect, useState } from 'react';
import { clearCart, loadCart } from '@/lib/cart';

export default function SuccessPage({ searchParams }: { searchParams: { paymentKey?: string; orderId?: string; amount?: string } }){
  const { paymentKey, orderId, amount } = searchParams;
  const [status, setStatus] = useState<'idle'|'confirming'|'done'|'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      if (!paymentKey || !orderId || !amount) return;
      setStatus('confirming');
      try {
        // 1) Toss 서버 검증
        const confirm = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) })
        }).then(r => r.json());
        if (!confirm.ok) throw new Error(confirm.message || '결제 검증 실패');

        // 2) 판매 기록 + 재고 차감 (Apps Script)
        const lineItems = loadCart().map(it => ({ isbn: it.isbn, qty: it.qty }));
        const record = await fetch('/api/orders/record', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, amount: Number(amount), lineItems })
        }).then(r => r.json());
        if (!record.ok) throw new Error(record.message || '재고 차감 실패');

        clearCart();
        setStatus('done');
        setMessage('결제가 완료되었습니다. 감사합니다!');
      } catch (e:any) {
        setStatus('error');
        setMessage(e.message);
      }
    })();
  }, [paymentKey, orderId, amount]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">결제 결과</h1>
      <div>{status === 'confirming' ? '검증 중...' : message}</div>
    </div>
  );
}
