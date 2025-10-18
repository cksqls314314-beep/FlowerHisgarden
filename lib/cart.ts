import { CartItem } from './types';

const KEY = 'hgcc.cart.v1';

export function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(item: CartItem) {
  const items = loadCart();
  const idx = items.findIndex(x => x.isbn === item.isbn);
  if (idx >= 0) items[idx].qty += item.qty;
  else items.push(item);
  saveCart(items);
}

export function updateQty(isbn: string, qty: number) {
  const items = loadCart();
  const it = items.find(x => x.isbn === isbn);
  if (it) { it.qty = Math.max(1, qty); saveCart(items); }
}

export function removeItem(isbn: string) {
  saveCart(loadCart().filter(x => x.isbn !== isbn));
}

export function clearCart() { saveCart([]); }

export function totalAmount(): number {
  return loadCart().reduce((s, x) => s + x.price * x.qty, 0);
}
