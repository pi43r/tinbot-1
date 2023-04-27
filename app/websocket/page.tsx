'use client'
import { encode, decode } from '@msgpack/msgpack'
import { useEffect, useRef, useState } from 'react'

const WS_ENDPOINT = `ws://${window.location.hostname}:8010`
const SUPERVISOR_ENDPOINT = `http://${window.location.hostname}:9001`

interface DanceMsg {
  abstraction: string
  dance: string
  speed: string
  t: string
}

export default function Page() {
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

class TinyEventBus {
  events: { [key: string]: Function[] } = {}

  emit(event: string, ...args: any[]) {
    for (let i of this.events[event] || []) {
      i(...args)
    }
  }

  on(event: string, cb: Function) {
    ;(this.events[event] = this.events[event] || []).push(cb)
    return () =>
      (this.events[event] = this.events[event].filter((i) => i !== cb))
  }
}

class Communicator {
  endpoint: string
  ws: WebSocket | null = null
  reconnectRetryS = 5.0
  eventBus: TinyEventBus
  topics: Set<string>
  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.ws = null

    this.reconnectRetryS = 5.0

    this.eventBus = new TinyEventBus()

    this.topics = new Set()

    this.connect()
  }

  connect() {
    console.log('Connecting to', this.endpoint)

    let ws = new WebSocket(this.endpoint)
    this.ws = ws

    ws.binaryType = 'arraybuffer'
    ws.onopen = (event) => this.onWsOpen(event)
    ws.onclose = (event) => this.onWsClose(event)
    ws.onerror = (event) => this.onWsError(event)

    ws.onmessage = (event) => this.onWsMsg(event)
  }

  on(topic: string, handler: any) {
    this.eventBus.on(topic, handler)
  }

  subscribe(topic: string, handler: any) {
    console.debug('Subscribing to', topic)

    this.topics.add(topic)
    this.eventBus.on(topic, handler)
  }

  publish(topic: string, msg: any, ttl = 0.0) {
    if (this.ws == null) {
      console.log('WebSocket connection is null')
      return
    }
    let payload = { cmd: 'publish', topic: topic, ttl: ttl, msg: msg }
    this.ws.send(encode(payload))
  }

  onWsOpen(event: Event) {
    if (this.ws == null) {
      console.log('WebSocket connection is null')
      return
    }
    this.eventBus.emit('open')

    console.log('WebSocket is now open.')

    for (let topic of this.topics) {
      let payload = { cmd: 'subscribe', topic: topic }
      this.ws.send(encode(payload))
    }
  }

  onWsClose(event: CloseEvent) {
    console.error('WebSocket Close', event)
    let reason = 'unknown'

    if (event.code == 1006) {
      console.warn('WebSocket seems to be limited')
      reason = 'congested'
    } else {
      console.warn('Connection failed for another reason')
    }

    this.eventBus.emit('close', reason)

    if (this.reconnectRetryS > 0.1) {
      console.log('Will reconnect in', this.reconnectRetryS, 'seconds')
      setTimeout((_) => this.connect(), this.reconnectRetryS * 1000.0)
    }
  }

  onWsError(event: Event) {
    console.log('WebSocket Error', event)
  }

  onWsMsg(event: MessageEvent) {
    var msgPacked = decode(event.data) as any

    let topic = msgPacked.topic
    let msg = msgPacked.msg

    // console.log(msgPacked)

    this.eventBus.emit(topic, msg)
  }
}
