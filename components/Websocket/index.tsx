'use client'
import { useEffect, useRef, useState } from 'react'
import { Communicator } from '@/utils/communicator'
import { useStore } from '@/utils/store'
import { BodyMsg, VoiceMsg, ModeMsg } from '@/types'

const WS_ENDPOINT = `ws://localhost:8010`
const SUPERVISOR_ENDPOINT = `http://localhost:9001`

export default function Websocket() {
  const [bodyMessage, setBodyMessage] = useState<BodyMsg | null>(null)
  const [voiceMessage, setVoiceMessage] = useState<VoiceMsg | null>(null)
  const [modeMessage, setModeMessage] = useState<any | null>(null)
  const [error, setError] = useState<any>(null)
  const { mode, setMode, setVoiceMsg } = useStore()
  const [wsEndpoint, setWsEndpoint] = useState<string>(
    () => window.localStorage.getItem('wsEndpoint') || 'ws://localhost:8010'
  )
  const comm = useRef<Communicator>()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const updatedEndpoint = (
      event.currentTarget.elements.namedItem('wsEndpoint') as HTMLInputElement
    )?.value
    window.localStorage.setItem('wsEndpoint', updatedEndpoint)
    setWsEndpoint(updatedEndpoint)
  }

  const startComm = (wsEndpoint: string) => {
    // stop comm and start a new one when wsEndpoint changes
    if (comm.current) {
      comm.current.ws?.close()
    }

    comm.current = new Communicator(wsEndpoint)

    comm.current.subscribe('performance/movement', (message: BodyMsg) => {
      setBodyMessage(message)
    })

    comm.current.subscribe('performance/voice', (message: VoiceMsg) => {
      setVoiceMessage(message)
    })

    comm.current.subscribe('performance/mode', (message: ModeMsg) => {
      setModeMessage(message)
      // if (mode !== message?.key) {
      //   setMode(message?.key)
      // }
    })

    /*
      Add error handling
      on error is an event that get's returned from here:
      comm.current.ws?.onerror
    */
  }

  useEffect(() => {
    startComm(wsEndpoint)

    return () => {
      if (!comm.current) return
      console.warn('closing ' + wsEndpoint)
      comm.current.ws?.close()
    }
  }, [wsEndpoint])

  useEffect(() => {
    if (!voiceMessage) return
    setVoiceMsg(voiceMessage)
  }, [voiceMessage])

  // useEffect(() => {
  //   if (!modeMessage) return
  //   if (mode !== modeMessage.key) {
  //     comm.current?.publish('performance/change', { key: mode })
  //   }
  // }, [mode])

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
      <form onSubmit={handleSubmit}>
        <input
          className="border p-1 mr-2"
          type="text"
          id="wsEndpoint"
          name="wsEndpoint"
          defaultValue={wsEndpoint}
        />
        <button className="border rounded-md p-1" type="submit">
          save
        </button>
      </form>
      <h1 className="text-2xl mb-4">Websocket Test</h1>

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
