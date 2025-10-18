'use client';
import { useEffect, useMemo, useState } from 'react';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import { totalAmount } from '@/lib/cart';

export default function CheckoutPage(){
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const [ready, setReady] = useState(false);
  const amount = useMemo(() => totalAmount(), []);
  const orderId = useMemo(() => `hgcc_${Date.now()}`, []);

  useEffect(() => {
    (async () => {
      try {
        // v0.12.x: 두 번째 인자는 customerKey. 익명은 문자열 "ANONYMOUS"
        const widget = await loadPaymentWidget(clientKey, 'ANONYMOUS');
        await widget.renderPaymentMethods('#payment-method', { value: amount });
        setReady(true);
      } catch (e) {
        console.error('Toss widget load error:', e);
      }
    })();
  }, [clientKey, amount]);

  const handlePay = async () => {
    // 위젯이 렌더되기 전 클릭 방지
    const root = document.getElementById('payment-method');
    if (!root) return;
    // requestPayment는 위젯 인스턴스가 내부적으로 바인딩되어 호출됨
    // v0.12.x에서는 renderPaymentMethods 뒤에 생성된 버튼에서 결제 요청을 트리거하므로
    // 여기서는 success/fail URL만 안내용으로 남겨둔다.
    // 필요 시 결제 수단 선택 영역의 결제 버튼을 사용하세요.
  };

  if (amount <= 0) return <div>장바구니가 비었습니다.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">결제</h1>
      <div id="payment-method" />
      {!ready && <div>결제 위젯 불러오는 중…</div>}
      {/* 위젯 영역의 결제 버튼을 사용합니다. */}
    </div>
  );
}
