'use client'
import { useEffect, useRef, useState } from 'react'
import { Communicator } from '@/utils/communicator'
import dynamic from 'next/dynamic'

const WS_ENDPOINT = `ws://${window.location.hostname}:8010`
const SUPERVISOR_ENDPOINT = `http://${window.location.hostname}:9001`

interface DanceMsg {
  abstraction: string
  dance: string
  speed: string
  t: string
}

export default function Websocket() {
  const [message, setMessage] = useState<DanceMsg | null>(null)
  const comm = useRef<Communicator>()
  useEffect(() => {
    comm.current = new Communicator(WS_ENDPOINT)

    comm.current.subscribe('performance/body', (message: DanceMsg) => {
      setMessage(message)
    })

    return () => {
      if (!comm.current) return
      comm.current.ws?.close()
    }
  }, [])

  useEffect(() => {
    console.log('dance', message)
  }, [message])

  function handleDance() {
    if (!comm.current) return
    comm.current.publish('performance/body', {
      abstraction: Math.random(),
      dance: Math.random(),
      speed: Math.random(),
      t: Math.random(),
    })
  }

  return (
    <div className="m-8">
      <h1 className="text-4xl mb-4">Websocket Test Page</h1>
      {message && (
        <>
          <h2 className="text-xl font-bold">dance</h2>
          <p>abstraction: {message.abstraction}</p>
          <p>dance: {message.dance}</p>
          <p>speed: {message.speed}</p>
          <button
            className="p-2 my-2 bg-white border rounded-lg cursor-pointer hover:drop-shadow"
            onClick={handleDance}
          >
            send Dance
          </button>
        </>
      )}
    </div>
  )
}
