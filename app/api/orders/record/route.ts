import { NextRequest } from 'next/server';

export async function POST(req: NextRequest){
  try {
    const { orderId, amount, lineItems } = await req.json();
    const url = process.env.SHEETS_WEBAPP_URL!;
    const token = process.env.SHEETS_WEBAPP_TOKEN!;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, action: 'recordSale', payload: { orderId, amount, lineItems } })
    });
    const data = await res.json();

    // Apps Script는 상태코드 고정 → body.code 참고
    if (data && (data.ok || data.code === 200)) return Response.json({ ok:true, data });
    return Response.json({ ok:false, message: data?.message || 'webapp error', data }, { status: 500 });
  } catch (e:any) {
    return Response.json({ ok:false, message: e.message }, { status: 500 });
  }
}
