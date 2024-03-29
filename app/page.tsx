'use client'
import { Chat } from '@/components/Chat/Chat'
import { Footer } from '@/components/Layout/Footer'
import { Navbar } from '@/components/Layout/Navbar'
import { Sidebar } from '@/components/Layout/Sidebar'
import { SidebarRight } from '@/components/Layout/SidebarRight'
import { Message, pbPrompt } from '@/types'
import { useStore } from '@/utils/store'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Mode, ModePrompts } from '@/utils/modes'
import { getPrompts, subscribeToPrompts } from '@/utils/pb'

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
    sttLanguage,
    modePromptsDE,
    modePromptsEN,
    setModePromptsDE,
    setModePromptsEN,
    updatePromptChange,
    promptChange,
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
      handleSend(message)
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
    const fetchPrompts = async () => {
      const pbPromptsEN = await getPrompts('en')
      const pbPromptsDE = await getPrompts('de')
      setModePromptsEN({
        walking_chatting: pbPromptsEN[0].walking_chatting || '',
        walking_hectic_asking: pbPromptsEN[0].walking_hectic_asking || '',
        dance_slow_sing_slow: pbPromptsEN[0].dance_slow_sing_slow || '',
        speech_abstract: pbPromptsEN[0].speech_abstract || '',
      })
      setModePromptsDE({
        walking_chatting: pbPromptsDE[0].walking_chatting || '',
        walking_hectic_asking: pbPromptsDE[0].walking_hectic_asking || '',
        dance_slow_sing_slow: pbPromptsDE[0].dance_slow_sing_slow || '',
        speech_abstract: pbPromptsDE[0].speech_abstract || '',
      })
    }
    fetchPrompts()
    subscribeToPrompts(
      'en',
      updatePromptChange,
      setModePromptsDE,
      setModePromptsEN
    )
    subscribeToPrompts(
      'de',
      updatePromptChange,
      setModePromptsDE,
      setModePromptsEN
    )
  }, [])

  useEffect(() => {
    console.log('prompt change', promptChange)
    handleReset()
  }, [promptChange])

  useEffect(() => {
    console.log(mode)

    const modePrompts = sttLanguage === 'de' ? modePromptsDE : modePromptsEN
    const prompt = modePrompts[mode]

    if (!prompt) return
    setSystemPrompt(prompt)
  }, [mode, setSystemPrompt, sttLanguage])

  function generateRandomString(length: number) {
    let result = ''
    const characters = 'abcdefghijklmnopqrstuvw'
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
        {mode === 'as_weird_as_it_gets' && <LoadRandomAudio />}
        {mode === 'dance_slow_sing_slow' && (
          <Monolog
            onSend={handleSend}
            modeName={mode}
            interval={1000}
            content={sttLanguage == 'de' ? 'sing ein lied' : 'sing a song'}
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
            content={
              sttLanguage == 'de'
                ? 'stelle mir eine absurde Frage'
                : 'ask me a weird and short question'
            }
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
  const { isGoatTalking, systemPrompt, modePromptsDE, modePromptsEN } =
    useStore()

  const [finished, setFinished] = useState(false)

  const intervalFunction = () => {
    callbackFunction()
    setFinished(true)
  }

  const callbackFunction = useCallback(() => {
    const promptIsSame =
      Object.is(systemPrompt, modePromptsEN[modeName]) ||
      Object.is(systemPrompt, modePromptsDE[modeName])
    console.log({ isGoatTalking, promptIsSame })
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

const LoadRandomAudio: FC = () => {
  const path: string = '/sounds/'
  const fileNames: string[] = ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3']
  const pickRandomAudio = (): string =>
    path + fileNames[Math.floor(Math.random() * fileNames.length)]
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!audioRef.current) return
    const audio = audioRef.current
    const handleAudioEnded = (): void => {
      audio.src = pickRandomAudio()
      audio.play()
    }

    audioRef.current.addEventListener('ended', handleAudioEnded)
    audioRef.current.play()

    return () => {
      audio.removeEventListener('ended', handleAudioEnded)
    }
  }, [])

  return <audio ref={audioRef} src={pickRandomAudio()}></audio>
}
