import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { paymentKey, orderId, amount, items, buyer } = await req.json()

    if (!paymentKey || !orderId || !amount) {
      return new Response(JSON.stringify({ error: 'Missing params' }), { status: 400 })
    }

    const secretKey = process.env.TOSS_SECRET_KEY
    if (!secretKey) {
      return new Response(JSON.stringify({ error: 'Missing TOSS_SECRET_KEY env' }), { status: 500 })
    }

    const basic = Buffer.from(`${secretKey}:`).toString('base64')
    const confirmRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
      cache: 'no-store'
    })

    const confirmJson: any = await confirmRes.json()
    if (!confirmRes.ok) {
      return new Response(JSON.stringify({ error: 'Toss confirm failed', detail: confirmJson }), { status: 400 })
    }

    const scriptUrl = process.env.APPS_SCRIPT_WEBAPP_URL
    let scriptResult: any = null
    if (scriptUrl) {
      try {
        const scriptRes = await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'ORDER_CONFIRMED',
            orderId,
            amount,
            items,
            buyer,
            payment: confirmJson,
          }),
        })
        scriptResult = await scriptRes.json().catch(() => ({}))
      } catch (e: any) {
        scriptResult = { error: e?.message || 'script call failed' }
      }
    }

    return new Response(JSON.stringify({ ok: true, payment: confirmJson, scriptResult }), {
      headers: { 'content-type': 'application/json' }
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'unknown error' }), { status: 500 })
  }
}
