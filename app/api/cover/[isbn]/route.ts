import type { NextRequest } from 'next/server'

export const revalidate = 86400; // 1 day

type AladinItem = {
  cover?: string
  title?: string
  author?: string
  publisher?: string
}

export async function GET(
  req: NextRequest,
  { params }: { params: { isbn: string } }
) {
  const key = process.env.TTB_KEY as string | undefined
  const { isbn } = params

  if (!key) {
    return new Response(JSON.stringify({ error: 'Missing TTB_KEY env' }), { status: 500 })
  }
  if (!isbn) {
    return new Response(JSON.stringify({ error: 'Missing isbn' }), { status: 400 })
  }

  const url = `https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${encodeURIComponent(
    key
  )}&itemIdType=ISBN13&ItemId=${encodeURIComponent(
    isbn
  )}&output=js&Version=20131101`

  try {
    const r = await fetch(url, { cache: 'no-store' })
    const text = await r.text()
    const data = JSON.parse(text)
    const item: AladinItem | undefined = (data && Array.isArray(data.item)) ? data.item[0] : undefined
    const cover = item?.cover || null
    return new Response(JSON.stringify({ cover, item }), {
      headers: { 'content-type': 'application/json' },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'fetch failed' }), { status: 500 })
  }
}
