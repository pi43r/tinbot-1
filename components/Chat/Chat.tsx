import { Message } from '@/types'
import { FC, useEffect, useRef } from 'react'
import { ChatInput } from './ChatInput'
import { ChatLoader } from './ChatLoader'
import { ChatMessage } from './ChatMessage'
import { ResetChat } from './ResetChat'

interface Props {
  messages: Message[]
  loading: boolean
  onSend: (message: Message) => void
  onReset: () => void
}

export const Chat: FC<Props> = ({ messages, loading, onSend, onReset }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex flex-row justify-between items-center mt-0 mb-2 sm:mb-8">
          <ResetChat onReset={onReset} />
        </div>
        <div className="flex-1 overflow-y-auto rounded-lg px-2 sm:p-4 sm:border border-neutral-300">
          <div className="flex flex-col">
            {messages.map((message, index) => (
              <div key={index} className="my-1 sm:my-1.5">
                <ChatMessage message={message} />
              </div>
            ))}

            {loading && (
              <div className="my-1 sm:my-1.5">
                <ChatLoader />
              </div>
            )}
          </div>
          <div ref={messagesEndRef}></div>
        </div>

        <div className="mt-4 sm:mt-8 bottom-[56px] left-0 w-full">
          <ChatInput onSend={onSend} />
        </div>
      </div>
    </>
  )
}
