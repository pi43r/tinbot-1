'use client'
import { useEffect, useState } from 'react'
import Websocket from '@/components/Websocket'

export default function Page() {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])

  return <>{isClient && <Websocket />}</>
}
