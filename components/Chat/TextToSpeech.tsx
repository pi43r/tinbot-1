'use client'
import { useTts } from 'tts-react'
import type { TTSHookProps } from 'tts-react'
import { useStore } from '@/utils/store'
import { useEffect } from 'react'

type SpeakProps = Pick<TTSHookProps, 'children'>

export const Speak = ({ children }: SpeakProps) => {
  const { setIsGoatTalking, googleOutputVoice, sttLanguage } = useStore()

  function handleEnd() {
    setIsGoatTalking(false)
  }

  function handleError(e: string) {
    console.error(e)
    setIsGoatTalking(false)
  }

  function handlePause() {
    console.log('speaking paused')
    setIsGoatTalking(false)
  }

  function handleStart() {
    console.log('speaking started')
    setIsGoatTalking(true)
  }

  return (
    <>
      {
        useTts({
          children,
          lang: sttLanguage,
          voice: googleOutputVoice,
          autoPlay: true,
          onEnd: handleEnd,
          onError: (msg) => handleError(msg),
          onPause: handlePause,
          onStart: handleStart,
        }).ttsChildren
      }
    </>
  )
}

export default Speak
