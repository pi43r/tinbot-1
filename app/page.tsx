'use client'
import { Chat } from '@/components/Chat/Chat'
import { Footer } from '@/components/Layout/Footer'
import { Navbar } from '@/components/Layout/Navbar'
import { Sidebar } from '@/components/Layout/Sidebar'
import { SidebarRight } from '@/components/Layout/SidebarRight'
import { Message } from '@/types'
import { useStore } from '@/utils/store'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { modePrompts, Mode } from '@/utils/modes'
import VoiceClone from '@/components/Chat/VoiceClone'

export default function Home() {
  const [sidebar, setSidebar] = useState(false)
  const [sidebarRight, setSidebarRight] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const {
    systemPrompt,
    setSystemPrompt,
    setIsGoatTalking,
    isGoatTalking,
    mode,
  } = useStore()

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
  }

  const handleReset = () => {
    setMessages([])
    setIsGoatTalking(false)
  }

  useEffect(() => {
    console.log(mode)
    const prompt = modePrompts[mode]
    if (prompt) {
      setSystemPrompt(prompt)
    }
  }, [mode, setSystemPrompt])

  function generateRandomString(length: number) {
    let result = ''
    const characters = 'abcdefghijklmnopqrstuvwxyz'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      // randomly select a character and append it to the result string
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result.charAt(0).toUpperCase() + result.slice(1) // capitalize the first letter
  }

  function generateRandomWords(numWords: number) {
    let words = []
    for (let i = 0; i < numWords; i++) {
      words.push(generateRandomString(Math.ceil(Math.random() * 5))) // generate a word of length 5
    }
    return words.join(' ') // concatenate words with space
  }

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
            <Chat
              messages={messages}
              loading={loading}
              onSend={handleSend}
              onReset={handleReset}
            />
          </div>
          <SidebarRight visible={sidebarRight} />
        </div>
        {mode === 'as_weird_as_it_gets' && <VoiceClone />}
        {mode === 'dance_slow_sing_slow' && (
          <Monolog
            onSend={handleSend}
            modeName={mode}
            interval={1000}
            content="sing a song"
          />
        )}
        {mode === 'speech_abstract' && (
          <Monolog
            onSend={handleSend}
            modeName={mode}
            interval={1000}
            content={generateRandomWords(6)}
          />
        )}
        {mode === 'walking_hectic_asking' && (
          <Monolog
            onSend={handleSend}
            modeName={mode}
            interval={3000}
            content="ask me a weird and short question"
          />
        )}
        <Footer />
      </div>
    </>
  )
}

interface MonologProps {
  onSend: (message: Message) => void
  modeName: Mode
  interval: number
  content: string
}
const Monolog: FC<MonologProps> = ({ onSend, modeName, interval, content }) => {
  const { isGoatTalking, systemPrompt } = useStore()

  const [finished, setFinished] = useState(false)

  const intervalFunction = () => {
    callbackFunction()
    setFinished(true)
  }

  const callbackFunction = useCallback(() => {
    const promptIsSame = Object.is(systemPrompt, modePrompts[modeName])
    // console.log({ isGoatTalking, promptIsSame })
    if (isGoatTalking || !promptIsSame) return
    onSend({
      role: 'user',
      content: content,
    })
  }, [isGoatTalking, systemPrompt, onSend])

  useEffect(() => {
    setFinished(false)
    const timer = setTimeout(intervalFunction, interval)
    return () => clearTimeout(timer)
  }, [finished])

  return null
}
