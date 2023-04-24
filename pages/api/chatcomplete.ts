import { Message } from '@/types'
import { OpenAIComplete } from '@/utils/openai'

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

    const result = await OpenAIComplete(messagesToSend, system)
    console.log(result) //returns JSON {message: {}, finish_reason: '', index: 0}

    return new Response(JSON.stringify(result))
  } catch (error) {
    console.error(error)
    return new Response('Error', { status: 500 })
  }
}

export default handler
