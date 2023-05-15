'use client'
import { useEffect, useRef, useState } from 'react'
import { Communicator } from '@/utils/communicator'
import dynamic from 'next/dynamic'

const WS_ENDPOINT = `ws://localhost:8010`
const SUPERVISOR_ENDPOINT = `http://localhost:9001`

interface DanceMsg {
  abstraction: string
  dance: string
  speed: string
  t: string
}

interface VoiceMsg {
  sing: string
  abstraction: string
  speed: string
  loudness: string
  dialogue: string
}

export default function Websocket() {
  const [message, setMessage] = useState<DanceMsg | null>(null)
  const [voiceMessage, setVoiceMessage] = useState<VoiceMsg | null>(null)
  const comm = useRef<Communicator>()
  useEffect(() => {
    comm.current = new Communicator(WS_ENDPOINT)

    comm.current.subscribe('performance/body', (message: DanceMsg) => {
      setMessage(message)
    })
    comm.current.subscribe('performance/voice', (message: VoiceMsg) => {
      setVoiceMessage(message)
    })

    return () => {
      if (!comm.current) return
      comm.current.ws?.close()
    }
  }, [])

  function handleDance() {
    if (!comm.current) return
    comm.current.publish('performance/body', {
      abstraction: Math.random(),
      dance: Math.random(),
      speed: Math.random(),
      t: Math.random(),
    })
  }
  function handleVoice() {
    if (!comm.current) return
    comm.current.publish('performance/voice', {
      sing: Math.random(),
      abstraction: Math.random(),
      speed: Math.random(),
      loudness: Math.random(),
      dialogue: Math.random(),
    })
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl mb-4">Websocket Test</h1>
      {!message && (
        <span className="text-red-800">
          Problems connecting to localhost:8010
        </span>
      )}
      {message && (
        <>
          <h2 className="text-xl font-bold">body</h2>
          <p>abstraction: {message.abstraction}</p>
          <p>dance: {message.dance}</p>
          <p>speed: {message.speed}</p>
          <button
            className="p-2 my-2 bg-white border rounded-lg cursor-pointer hover:drop-shadow"
            onClick={handleDance}
          >
            send random dance
          </button>

          <h2 className="text-xl font-bold">voice</h2>
          <p>sing: {voiceMessage?.sing}</p>
          <p>abstraction: {voiceMessage?.abstraction}</p>
          <p>speed: {voiceMessage?.speed}</p>
          <p>loudness: {voiceMessage?.loudness}</p>
          <p>dialogue: {voiceMessage?.dialogue}</p>
          <button
            className="p-2 my-2 bg-white border rounded-lg cursor-pointer hover:drop-shadow"
            onClick={handleVoice}
          >
            send random voice
          </button>
        </>
      )}
    </div>
  )
}
