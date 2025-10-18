'use client';
import Image from 'next/image';
import { addToCart } from '@/lib/cart';

export default function ProductCard({
  isbn, title, author, price, sellPrice, cover
}: {
  isbn: string; title: string; author?: string; price?: number; sellPrice?: number; cover?: string;
}) {
  const unit = sellPrice || price || 0;
  return (
    <div className="p-4 rounded-2xl border bg-white flex gap-4">
      <div className="w-24 h-32 relative overflow-hidden rounded">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={title} className="w-full h-full object-cover" />
        ) : (
          <Image src="/placeholder.png" alt="placeholder" fill />
        )}
      </div>
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        {author && <div className="text-sm text-stone-500">{author}</div>}
        <div className="mt-2">
          <span className="text-lg font-semibold">{unit.toLocaleString()}원</span>
        </div>
        <button
          className="mt-4 px-3 py-2 rounded-xl bg-stone-900 text-white text-sm"
          onClick={() => addToCart({ isbn, title, price: unit, qty: 1 })}
        >장바구니</button>
      </div>
    </div>
  );
}
