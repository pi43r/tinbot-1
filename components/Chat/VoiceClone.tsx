'use client'
import { FC, useEffect, useState, useRef } from 'react'
import { useStore } from '@/utils/store'
import { referenceAudios } from '@/utils/modes'

type AudioObj = {
  uuid: string
  name: string
  transcription: null | string
  url: string
}

const VoiceClone: FC = () => {
  const [speech, setSpeech] = useState('')
  const refAudioObj = useRef<AudioObj | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { isGoatTalking, setIsGoatTalking, uberduckVoice } = useStore()

  function handleAudioEnd() {
    setIsGoatTalking(false)
  }

  async function generateVoiceClone() {
    if (!refAudioObj.current) return
    const response = await fetch('/api/uberduck/convert', {
      method: 'POST',
      body: JSON.stringify({
        voicemodel_uuid: uberduckVoice.uuid,
        reference_audio_uuid: refAudioObj.current.uuid,
        pitch_shift: 0,
      }),
    })
    const data = await response.json()
    console.log(data)
    const audioUrl = data.audio_url

    setSpeech(audioUrl)
  }

  useEffect(() => {
    refAudioObj.current =
      referenceAudios[Math.floor(Math.random() * referenceAudios.length)]
    console.log('clone')
    generateVoiceClone()

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
      {refAudioObj.current && (
        <h2 className="border rounded-md my-2 p-2">
          voice cloning: {refAudioObj.current.name}
        </h2>
      )}
    </>
  )
}

export default VoiceClone
