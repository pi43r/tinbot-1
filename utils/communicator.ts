import { encode, decode } from '@msgpack/msgpack'

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

export class Communicator {
  endpoint: string
  ws: WebSocket | null = null
  reconnectRetryS = 10.0
  eventBus: TinyEventBus
  topics: Set<string>
  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.ws = null

    this.reconnectRetryS = 10.0

    this.eventBus = new TinyEventBus()

    this.topics = new Set()

    this.connect()
  }

  connect() {
    console.warn('Connecting to', this.endpoint)

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
      console.warn('WebSocket connection is null')
      return
    }
    let payload = { cmd: 'publish', topic: topic, ttl: ttl, msg: msg }
    this.ws.send(encode(payload))
  }

  onWsOpen(event: Event) {
    if (this.ws == null) {
      console.warn('WebSocket connection is null')
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
    console.warn('WebSocket Close', event)
    let reason = 'unknown'

    if (event.code == 1006) {
      console.warn('WebSocket seems to be limited')
      reason = 'congested'
    } else {
      console.warn('Connection failed for another reason')
    }

    this.eventBus.emit('close', reason)

    if (this.reconnectRetryS > 0.1) {
      console.warn('Will reconnect in', this.reconnectRetryS, 'seconds')
      setTimeout((_) => this.connect(), this.reconnectRetryS * 1000.0)
    }
  }

  onWsError(event: Event) {
    // console.warn('WebSocket Error', event)
    return event
  }

  onWsMsg(event: MessageEvent) {
    var msgPacked = decode(event.data) as any

    let topic = msgPacked.topic
    let msg = msgPacked.msg

    // console.log(msgPacked)

    this.eventBus.emit(topic, msg)
  }
}
