import { NextRequest } from 'next/server';

export async function POST(req: NextRequest){
  try {
    const { paymentKey, orderId, amount } = await req.json();
    if (!paymentKey || !orderId || !amount) return Response.json({ ok:false, message:'params missing' }, { status: 400 });

    const secretKey = process.env.TOSS_SECRET_KEY!;
    const auth = Buffer.from(`${secretKey}:`).toString('base64');

    const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentKey, orderId, amount })
    });
    const data = await res.json();
    if (!res.ok) return Response.json({ ok:false, message: data.message || 'toss error', data }, { status: res.status });

    return Response.json({ ok:true, data });
  } catch (e:any) {
    return Response.json({ ok:false, message: e.message }, { status: 500 });
  }
}
