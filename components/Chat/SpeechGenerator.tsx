'use client'
import { FC, useEffect, useState, useRef } from 'react'
import { useStore } from '@/utils/store'

interface SpeechGeneratorProps {
  voicemodel: string
  text: string
}

const SpeechGenerator: FC<SpeechGeneratorProps> = ({ voicemodel, text }) => {
  const [speech, setSpeech] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)
  const { isGoatTalking, setIsGoatTalking } = useStore()

  function handleAudioEnd() {
    setIsGoatTalking(false)
  }

  async function generateSpeech() {
    const response = await fetch('/api/uberduck', {
      method: 'POST',
      body: JSON.stringify({
        pace: 1,
        voicemodel_uuid: voicemodel,
        speech: text,
      }),
    })
    const data = await response.blob()
    const audioUrl = URL.createObjectURL(data)

    setSpeech(audioUrl)
  }

  useEffect(() => {
    generateSpeech()
  }, [])

  return (
    <>
      {speech && (
        <audio
          autoPlay
          src={speech}
          ref={audioRef}
          onEnded={handleAudioEnd}
        ></audio>
      )}
    </>
  )
}

export default SpeechGenerator
