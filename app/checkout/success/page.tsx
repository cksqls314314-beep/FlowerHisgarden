// app/checkout/success/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SuccessPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'idle'|'confirming'|'recording'|'done'|'error'>('idle');
  const [msg, setMsg] = useState<string>('결제 승인 중...');

  useEffect(() => {
    const paymentKey = sp.get('paymentKey');
    const orderId = sp.get('orderId');
    const amount = sp.get('amount');

    if (!paymentKey || !orderId || !amount) {
      setStatus('error');
      setMsg('필수 파라미터 누락(paymentKey/orderId/amount)');
      return;
    }

    (async () => {
      try {
        setStatus('confirming');
        setMsg('토스 결제 승인 중...');
        const confirmRes = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
        });
        const confirmData = await confirmRes.json();
        if (!confirmRes.ok) throw new Error(confirmData?.message || '결제 승인 실패');

        setStatus('recording');
        setMsg('주문 기록 및 재고 차감 중...');

        // lineItems는 실제 앱에서 서버 계산값으로 가져오도록 설계하세요.
        const lineItems = confirmData?.lineItems || []; // 기본은 빈 배열

        const recordRes = await fetch('/api/orders/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, amount: Number(amount), lineItems }),
        });
        const recordData = await recordRes.json();
        if (!recordRes.ok) throw new Error(recordData?.message || '시트 기록 실패');

        setStatus('done');
        setMsg('완료! 주문 상세로 이동합니다.');
        router.replace(`/order/${orderId}`);
      } catch (e: any) {
        setStatus('error');
        setMsg(e?.message || '처리 중 오류');
      }
    })();
  }, [sp, router]);

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">결제 성공</h1>
      <p className="text-gray-700">{msg}</p>
    </main>
  );
}
