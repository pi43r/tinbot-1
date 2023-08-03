import { Message, OpenAIModel } from '@/types'
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser'

export const OpenAIComplete = async (messages: Message[], system: string) => {
  console.log('openai', messages.length, system)
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model: "gpt-3.5-turbo-16k",
      messages: [
        ...messages,
        {
          role: 'system',
          content: system,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
      stream: false,
    }),
  })
  if (res.status !== 200) {
    throw new Error('OpenAI API returned an error')
  }

  const body = await res.json()
  return body.choices[0]
}

export const OpenAIStream = async (messages: Message[], system: string) => {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  console.log('openai', messages.length, system)
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model: OpenAIModel.DAVINCI_TURBO,
      messages: [
        ...messages,
        {
          role: 'system',
          content: system,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
      stream: true,
    }),
  })

  if (res.status !== 200) {
    throw new Error('OpenAI API returned an error')
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data

          if (data === '[DONE]') {
            controller.close()
            return
          }

          try {
            const json = JSON.parse(data)
            const text = json.choices[0].delta.content
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          } catch (e) {
            controller.error(e)
          }
        }
      }

      const parser = createParser(onParse)

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk))
      }
    },
  })

  return stream
}
