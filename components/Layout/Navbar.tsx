'use client'
import {
  IconAdjustmentsHorizontal,
  IconPlugConnected,
  IconDeviceTablet,
  IconDeviceTabletFilled,
} from '@tabler/icons-react'
import Link from 'next/link'
import { FC, useRef, useState, useEffect } from 'react'
import useIsClient from '@/utils/hooks/useIsClient'

interface NavbarProps {
  sidebar: boolean
  setSidebar: (sidebar: boolean) => void
  sidebarRight: boolean
  setSidebarRight: (sidebar: boolean) => void
}

export const Navbar: FC<NavbarProps> = (props) => {
  const { sidebar, setSidebar, sidebarRight, setSidebarRight } = props

  const isClient = useIsClient()

  return (
    <div className="flex h-[50px] sm:h-[60px] border-b border-neutral-300 py-2 px-2 sm:px-8 items-center justify-between">
      <IconAdjustmentsHorizontal
        className="hover:opacity-50 cursor-pointer"
        onClick={() => setSidebar(!sidebar)}
      />
      <div className="font-bold text-3xl flex items-center m-auto">
        <Link className="ml-2 hover:opacity-50" href="/">
          GOAT
        </Link>
      </div>
      <div className="flex">
        {isClient && <ScreenAwakeToggle />}
        <IconPlugConnected
          className="ml-4 cursor-pointer"
          onClick={() => setSidebarRight(!sidebarRight)}
        />
      </div>
    </div>
  )
}

import { useWakeLock } from 'react-screen-wake-lock'
const ScreenAwakeToggle: FC = () => {
  const { isSupported, released, request, release } = useWakeLock({
    onRequest: () => console.log('Screen Wake Lock: requested!'),
    onError: () => console.log('Screen Wake Lock: error'),
    onRelease: () => console.log('Screen Wake Lock: released!'),
  })

  useEffect(() => {
    if (released == undefined) {
      request()
    }
  }, [])

  if (!isSupported) {
    // console.log('wake lock support:', isSupported)
    return null
  }

  return (
    <div
      className="cursor-pointer"
      onClick={() => (released === false ? release() : request())}
    >
      {released || released == undefined ? (
        <IconDeviceTablet />
      ) : (
        <IconDeviceTabletFilled className="text-green-500" />
      )}
    </div>
  )
}
