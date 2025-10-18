'use client';
import { loadCart, updateQty, removeItem, totalAmount } from '@/lib/cart';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartPage(){
  const [items, setItems] = useState(loadCart());
  useEffect(() => { const i = setInterval(() => setItems(loadCart()), 300); return () => clearInterval(i); }, []);

  const sum = totalAmount();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">장바구니</h1>
      {items.length === 0 ? (
        <div>비었습니다. <Link className="underline" href="/">계속 쇼핑하기</Link></div>
      ) : (
        <div className="space-y-3">
          {items.map(it => (
            <div key={it.isbn} className="p-3 rounded-xl border bg-white flex items-center gap-3">
              <div className="flex-1">
                <div className="font-medium">{it.title}</div>
                <div className="text-sm text-stone-500">{it.isbn}</div>
              </div>
              <input type="number" min={1} value={it.qty}
                onChange={e => { updateQty(it.isbn, Number(e.target.value)); setItems(loadCart()); }}
                className="w-16 px-2 py-1 rounded border"/>
              <div className="w-28 text-right">{(it.price*it.qty).toLocaleString()}원</div>
              <button className="px-3 py-1 rounded border" onClick={() => { removeItem(it.isbn); setItems(loadCart()); }}>삭제</button>
            </div>
          ))}
          <div className="text-right text-lg font-semibold">합계 {sum.toLocaleString()}원</div>
          <Link href="/checkout" className="inline-block px-4 py-2 rounded-xl bg-stone-900 text-white">결제하기</Link>
        </div>
      )}
    </div>
  );
}
