'use client'
import { Chat } from '@/components/Chat/Chat'
import { Footer } from '@/components/Layout/Footer'
import { Navbar } from '@/components/Layout/Navbar'
import { Sidebar } from '@/components/Layout/Sidebar'
import { SidebarRight } from '@/components/Layout/SidebarRight'
import { Message } from '@/types'
import { useStore } from '@/utils/store'
import { useEffect, useRef, useState } from 'react'
import useVoices from '@/utils/hooks/useVoices'
import { modePrompts } from '@/utils/modes'
import SpeechGenerator from '@/components/Chat/SpeechGenerator'
import VoiceClone from '@/components/Chat/VoiceClone'

export default function Home() {
  const [sidebar, setSidebar] = useState(false)
  const [sidebarRight, setSidebarRight] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const {
    systemPrompt,
    setSystemPrompt,
    isGoatTalking,
    setIsGoatTalking,
    setVoice,
    voice,
    voices,
    setVoices,
    mode,
  } = useStore()

  const fetchedVoices = useVoices()

  useEffect(() => {
    setVoices(fetchedVoices)
    setVoice(fetchedVoices[0])
  }, [fetchedVoices, setVoice, setVoices])

  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message]

    setMessages(updatedMessages)
    setLoading(true)
    setIsGoatTalking(true)

    const response = await fetch('/api/chatcomplete', {
      method: 'POST',
      body: JSON.stringify({
        system: systemPrompt,
        messages: updatedMessages,
      }),
    })

    if (!response.ok) {
      setLoading(false)
      throw new Error(response.statusText)
    }

    const { result } = await response.json()
    if (!result) {
      return
    }
    setLoading(false)
    setMessages((messages) => [...messages, result.message])

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
    setIsGoatTalking(false)
  }

  // useEffect(() => {
  //   setMessages([
  //     {
  //       role: 'assistant',
  //       content: systemPrompt,
  //     },
  //   ])
  // }, [systemPrompt])

  useEffect(() => {
    const prompt = modePrompts[mode]
    if (prompt) {
      setSystemPrompt(prompt)
    }
  }, [mode, setSystemPrompt])

  return (
    <>
      <div className="flex flex-col chat-container">
        <Navbar
          setSidebar={setSidebar}
          sidebar={sidebar}
          setSidebarRight={setSidebarRight}
          sidebarRight={sidebarRight}
        />
        <div className="relative h-full flex flex-row overflow-hidden">
          <Sidebar visible={sidebar} />
          <div className="max-w-[800px] mt-1 mx-auto">
            {mode === 'as_weird_as_it_gets' && <VoiceClone />}
            <Chat
              messages={messages}
              loading={loading}
              onSend={handleSend}
              onReset={handleReset}
            />
          </div>
          <SidebarRight visible={sidebarRight} />
        </div>
        <Footer />
      </div>
    </>
  )
}
