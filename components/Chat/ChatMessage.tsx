import { Message } from '@/types'
import dynamic from 'next/dynamic'
import { FC } from 'react'
// import Speak from './TextToSpeech'

const Speak = dynamic(() => import('./TextToSpeech'), {
  ssr: false,
})

interface Props {
  message: Message
}

export const ChatMessage: FC<Props> = ({ message }) => {
  return (
    <div
      className={`flex flex-col ${
        message.role === 'assistant' ? 'items-start' : 'items-end'
      }`}
    >
      {message.role == 'assistant' ? (
        <div
          className="flex items-center bg-neutral-200 text-neutral-900 rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap"
          style={{ overflowWrap: 'anywhere' }}
        >
          <Speak>{message.content}</Speak>
        </div>
      ) : (
        <div
          className="flex items-center bg-blue-500 text-white rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap"
          style={{ overflowWrap: 'anywhere' }}
        >
          {message.content}
        </div>
      )}
    </div>
  )
}
