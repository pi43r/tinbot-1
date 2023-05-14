import { NextRequest, NextResponse } from 'next/server'

const USERNAME = process.env.UBERDUCK_PUB // your Key starts with pub_
const PASSWORD = process.env.UBERDUCK_SECRET // your Secret starts with pk_

export async function POST(req: NextRequest) {
  const auth = `${USERNAME}:${PASSWORD}`
  const authHeader = `Basic ${Buffer.from(auth).toString('base64')}` // needs to be transformed to base-64
  const headers = {
    Authorization: authHeader,
    'Content-Type': 'application/json',
  }

  const apiUrl = 'https://api.uberduck.ai/speak-synchronous' // using synchronous
  try {
    const payload = await req.json()
    console.log(payload)
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })
    if (response.ok) {
      const audio = await response.arrayBuffer()
      // returns blob that can be used like this:
      //   const data = await response.blob()
      //   const audioUrl = URL.createObjectURL(data)
      return new NextResponse(audio, {
        headers: {
          'Content-Type': 'audio/wav',
        },
      })
    }
    throw new Error(response.statusText)
  } catch (error) {
    console.error(error)
    return NextResponse.error()
  }
}
