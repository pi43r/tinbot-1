import {
  IconAdjustmentsHorizontal,
  IconPlugConnected,
} from '@tabler/icons-react'
import Link from 'next/link'
import { FC } from 'react'

interface NavbarProps {
  sidebar: boolean
  setSidebar: (sidebar: boolean) => void
  sidebarRight: boolean
  setSidebarRight: (sidebar: boolean) => void
}

export const Navbar: FC<NavbarProps> = (props) => {
  const { sidebar, setSidebar, sidebarRight, setSidebarRight } = props
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
      <IconPlugConnected
        className="cursor-pointer"
        onClick={() => setSidebarRight(!sidebarRight)}
      />
    </div>
  )
}
