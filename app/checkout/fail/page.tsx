// app/checkout/fail/page.tsx
'use client';
import { useSearchParams } from 'next/navigation';

export default function FailPage() {
  const sp = useSearchParams();
  return (
    <main className="max-w-xl mx-auto p-6 space-y-2">
      <h1 className="text-2xl font-semibold">결제 실패</h1>
      <p>사유: {sp.get('message') || '알 수 없는 오류'}</p>
      <p>코드: {sp.get('code') || '-'}</p>
    </main>
  );
}
