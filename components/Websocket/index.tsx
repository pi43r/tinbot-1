'use client'
import { useEffect, useRef, useState } from 'react'
import { Communicator } from '@/utils/communicator'
import dynamic from 'next/dynamic'
import { useStore } from '@/utils/store'
import { Mode } from '@/utils/modes'

const WS_ENDPOINT = `ws://localhost:8010`
const SUPERVISOR_ENDPOINT = `http://localhost:9001`

interface BodyMsg {
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

interface ModeMsg {
  t: string
  key: Mode
  description: string
}

export default function Websocket() {
  const [bodyMessage, setBodyMessage] = useState<BodyMsg | null>(null)
  const [voiceMessage, setVoiceMessage] = useState<VoiceMsg | null>(null)
  const [modeMessage, setModeMessage] = useState<any | null>(null)
  const { mode, setMode } = useStore()
  const comm = useRef<Communicator>()
  useEffect(() => {
    comm.current = new Communicator(WS_ENDPOINT)

    comm.current.subscribe('performance/movement', (message: BodyMsg) => {
      setBodyMessage(message)
    })
    comm.current.subscribe('performance/voice', (message: VoiceMsg) => {
      // console.log(message)
      setVoiceMessage(message)
    })

    comm.current.subscribe('performance/mode', (message: ModeMsg) => {
      // console.log(message)
      setModeMessage(message)
      if (mode != message?.key) {
        setMode(message?.key)
      }
    })

    return () => {
      if (!comm.current) return
      comm.current.ws?.close()
    }
  }, [])

  useEffect(() => {
    if (!modeMessage) return
    if (mode !== modeMessage.key) {
      comm.current?.publish('performance/change', { key: mode })
    }
  }, [mode])

  function handleDance() {
    if (!comm.current) return
    comm.current.publish('performance/movement', {
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

  function prettyPrint(msg: any) {
    let result = []
    for (const key in msg) {
      if (Object.hasOwnProperty.call(msg, key)) {
        const element = msg[key]

        let formattedValue = element.toString()

        if (key == 't') {
          formattedValue = element.toFixed(1) + ' s'
        } else if (isNumeric(element)) {
          formattedValue = (element * 100).toFixed(2) + ' %'
        }

        result.push(`${key} = ${formattedValue}`)
      }
    }

    return result
  }

  function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n)
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl mb-4">Websocket Test</h1>

      <h2 className="text-xl font-bold">body</h2>
      {prettyPrint(bodyMessage).map((e, i) => (
        <p key={'body' + i}>{e}</p>
      ))}
      <button
        className="p-2 my-2 bg-white border rounded-lg cursor-pointer hover:drop-shadow"
        onClick={handleDance}
      >
        send random dance
      </button>

      <h2 className="text-xl font-bold">voice</h2>
      {prettyPrint(voiceMessage).map((e, i) => (
        <p key={'voice' + i}>{e}</p>
      ))}
      <button
        className="p-2 my-2 bg-white border rounded-lg cursor-pointer hover:drop-shadow"
        onClick={handleVoice}
      >
        send random voice
      </button>
      <h2 className="text-xl font-bold">Mode</h2>
      <p>current: {mode}</p>
      {prettyPrint(modeMessage).map((e, i) => (
        <p key={'mode' + i}>{e}</p>
      ))}
    </div>
  )
}
