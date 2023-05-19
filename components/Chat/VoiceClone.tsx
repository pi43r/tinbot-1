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
  const { isGoatTalking, setIsGoatTalking, mode } = useStore()

  function handleAudioEnd() {
    setIsGoatTalking(false)
  }

  async function generateVoiceClone() {
    if (!refAudioObj.current) return
    const response = await fetch('/api/uberduck/convert', {
      method: 'POST',
      body: JSON.stringify({
        voicemodel_uuid: '6a7e6e1e-0375-44ea-b6f1-6e296ede2a52',
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
    console.log('cloone')
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
        <h2 className="border rounded-md m-2">{refAudioObj.current.name}</h2>
      )}
    </>
  )
}

export default VoiceClone
