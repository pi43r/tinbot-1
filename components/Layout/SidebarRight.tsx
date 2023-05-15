'use client'
import { FC, useEffect, useState } from 'react'
import Websocket from '@/components/Websocket'

interface SidebarProps {
  visible: boolean
}

export const SidebarRight: FC<SidebarProps> = (props) => {
  const { visible } = props
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') setIsClient(true)
  }, [])

  return (
    <div
      className={`z-11 absolute right-0 top-0 md:relative h-full w-full md:w-1/3 border border-gray-300 bg-white transition-all
                ${visible ? 'left-0' : 'left-full'}`}
    >
      <div className="flex flex-col h-full w-full p-4 overflow-y-auto">
        {isClient && <Websocket />}
      </div>
    </div>
  )
}
