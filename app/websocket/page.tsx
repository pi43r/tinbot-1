'use client'
import { useEffect, useState } from 'react'
import Websocket from '@/components/Websocket'

export default function Page() {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') setIsClient(true)
  }, [])

  return <>{isClient && <Websocket />}</>
}
