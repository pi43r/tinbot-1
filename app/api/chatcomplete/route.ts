import { Message } from '@/types'
import { OpenAIComplete } from '@/utils/openai'
import { NextResponse, NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { messages, system } = (await req.json()) as {
      messages: Message[]
      system: string
    }

    const charLimit = 12000
    let charCount = 0
    let messagesToSend = messages.slice(-2)

    console.log(messagesToSend)

    const result = await OpenAIComplete(messagesToSend, system)
    console.log(result) //returns JSON {message: {}, finish_reason: '', index: 0}

    return NextResponse.json({ result })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(
      {
        error: {
          message: `An error occurred during your request: ${error.message}`,
        },
      },
      { status: 500 }
    )
  }
}
