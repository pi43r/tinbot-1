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
  const { isGoatTalking, setIsGoatTalking, mode, uberduckSingingVoice } =
    useStore()

  function handleAudioEnd() {
    setIsGoatTalking(false)
  }

  async function generateVoiceClone() {
    const randomReferenceAudio =
      referenceAudios[Math.floor(Math.random() * referenceAudios.length)].uuid
    const response = await fetch('/api/uberduck/convert', {
      method: 'POST',
      body: JSON.stringify({
        voicemodel_uuid: voicemodel,
        reference_audio_uuid: randomReferenceAudio,
        pitch_shift: 0,
      }),
    })
    const data = await response.json()
    console.log(data)
    const audioUrl = data.audio_url
    setIsGoatTalking(true)
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
    setIsGoatTalking(true)
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
    setIsGoatTalking(true)
    setSpeech(audioUrl)
  }

  async function generateSinging() {
    const response = await fetch('/api/uberduck', {
      method: 'POST',
      body: JSON.stringify({
        pace: 1,
        voicemodel_uuid: uberduckSingingVoice.uuid,
        speech: text,
      }),
    })

    const data = await response.blob()
    const audioUrl = URL.createObjectURL(data)
    setIsGoatTalking(true)
    setSpeech(audioUrl)
  }

  useEffect(() => {
    if (mode == 'dance_slow_sing_slow') {
      generateSinging()
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
