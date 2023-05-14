'use client'
import SpeechGenerator from '@/components/Chat/SpeechGenerator'
import useVoices from '@/utils/hooks/useVoices'
import { useEffect, useState } from 'react'
import { Voice } from '@/types'

function getRandomVoice(voices: Voice[]): Voice {
  const randomIndex = Math.floor(Math.random() * voices.length)
  return voices[randomIndex]
}

export default function SpeechPage() {
  const [voiceModel, setVoiceModel] = useState<Voice>({
    name: '',
    uuid: '',
  })
  const voices = useVoices()

  useEffect(() => {
    if (voices.length === 0) return
    const randomVoice = getRandomVoice(voices)
    setVoiceModel(randomVoice)
  }, [voices])
  return (
    <div>
      <h1>Speech Generator</h1>
      {voiceModel.name && (
        <SpeechGenerator voicemodel={voiceModel.uuid} text="Hello World :)" />
      )}
    </div>
  )
}
