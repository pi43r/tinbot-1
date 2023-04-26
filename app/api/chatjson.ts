import { Message } from '@/types'
import { OpenAIStream } from '@/utils/openai'

export const config = {
  runtime: 'edge',
}

const handler = async (req: Request): Promise<Response> => {
  try {
    const { messages, system } = (await req.json()) as {
      messages: Message[]
      system: string
    }

    const charLimit = 12000
    let charCount = 0
    let messagesToSend = []

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i]
      if (charCount + message.content.length > charLimit) {
        break
      }
      charCount += message.content.length
      messagesToSend.push(message)
    }

    const stream = await OpenAIStream(messagesToSend, system)

    return new Response(stream)
  } catch (error) {
    console.error(error)
    return new Response('Error', { status: 500 })
  }
}

export default handler
