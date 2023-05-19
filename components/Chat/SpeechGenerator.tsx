'use client'
import { FC, useEffect, useState, useRef } from 'react'
import { useStore } from '@/utils/store'
import { referenceAudios } from '@/utils/modes'

interface SpeechGeneratorProps {
  voicemodel: string
  text: string
}

const SpeechGenerator: FC<SpeechGeneratorProps> = ({ voicemodel, text }) => {
  const [speech, setSpeech] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)
  const { isGoatTalking, setIsGoatTalking, mode } = useStore()

  function handleAudioEnd() {
    setIsGoatTalking(false)
  }

  async function generateVoiceClone() {
    const response = await fetch('/api/uberduck/convert', {
      method: 'POST',
      body: JSON.stringify({
        voicemodel_uuid: '6a7e6e1e-0375-44ea-b6f1-6e296ede2a52',
        reference_audio_uuid: referenceAudios[1].uuid,
        pitch_shift: 0,
      }),
    })
    const data = await response.json()
    console.log(data)
    const audioUrl = data.audio_url

    setSpeech(audioUrl)
  }

  async function generateRap() {
    const textArr = text.split('\n')
    const response = await fetch('/api/uberduck/rap', {
      method: 'POST',
      body: JSON.stringify({
        lyrics: [textArr],
        bpm: 90,
        voicemodel_uuid: '423710f0-00b8-45ea-a349-632991c9d401',
        format: 'binary',
      }),
    })
    const data = await response.blob()
    const audioUrl = URL.createObjectURL(data)

    setSpeech(audioUrl)
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
    console.log(mode)
    if (mode == 'dance_slow_sing_slow') {
      generateRap()
    } else if (mode == 'as_weird_as_it_gets') {
      console.log('cloone')
      generateVoiceClone()
    } else {
      generateSpeech()
    }
    setIsGoatTalking(true)
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
