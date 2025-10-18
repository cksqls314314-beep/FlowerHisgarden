'use client';
import Link from 'next/link';
import { totalAmount } from '@/lib/cart';
import { useEffect, useState } from 'react';

export default function CartButton() {
  const [sum, setSum] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setSum(totalAmount()), 400);
    return () => clearInterval(i);
  }, []);
  return (
    <Link href="/cart" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border">
      장바구니 <span className="text-stone-500">{sum.toLocaleString()}원</span>
    </Link>
  );
}
