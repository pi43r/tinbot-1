import { Chat } from '@/components/Chat/Chat'
import { Footer } from '@/components/Layout/Footer'
import { Navbar } from '@/components/Layout/Navbar'
import { Sidebar } from '@/components/Layout/Sidebar'
import { Message } from '@/types'
import { useStore } from '@/utils/store'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [sidebar, setSidebar] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { systemPrompt, isGoatTalking, setIsGoatTalking } = useStore()

  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message]

    setMessages(updatedMessages)
    setLoading(true)
    setIsGoatTalking(true)

    const response = await fetch('/api/chatcomplete', {
      //
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system: systemPrompt,
        messages: updatedMessages,
      }),
    })

    if (!response.ok) {
      setLoading(false)
      throw new Error(response.statusText)
    }

    const data = await response.json()
    if (!data) {
      return
    }
    setLoading(false)
    setMessages((messages) => [...messages, data.message])

    /* chat Stream
    const response = await fetch('/api/chat', { //
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system: systemPrompt,
        messages: updatedMessages,
      }),
    })

    if (!response.ok) {
      setLoading(false)
      throw new Error(response.statusText)
    }

    const data = response.body

    if (!data) {
      return
    }

    setLoading(false)

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false
    let isFirst = true

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)

      if (done) {
        setIsGoatTalking(false)
      }
      if (isFirst) {
        isFirst = false
        setMessages((messages) => [
          ...messages,
          {
            role: 'assistant',
            content: chunkValue,
          },
        ])
      } else {
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1]
          const updatedMessage = {
            ...lastMessage,
            content: lastMessage.content + chunkValue,
          }
          return [...messages.slice(0, -1), updatedMessage]
        })
      }
    }
    UNTIL HERE */
  }

  const handleReset = () => {
    setMessages([])
  }

  // useEffect(() => {
  //   setMessages([
  //     {
  //       role: 'assistant',
  //       content: systemPrompt,
  //     },
  //   ])
  // }, [systemPrompt])

  return (
    <>
      <Head>
        <title>GOAT</title>
        <meta name="description" content="Quick Goat starter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar setSidebar={setSidebar} sidebar={sidebar} />
        <div className="h-full flex flex-row overflow-auto">
          <Sidebar visible={sidebar} />
          <div className="max-w-[800px] mt-1 mx-auto">
            <Chat
              messages={messages}
              loading={loading}
              onSend={handleSend}
              onReset={handleReset}
            />
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
