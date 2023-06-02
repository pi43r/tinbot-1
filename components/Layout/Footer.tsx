import { FC, useEffect } from 'react'
import { useStore } from '@/utils/store'
import { modeOptions } from '@/utils/modes'
export const Footer: FC = () => {
  const { mode, setMode } = useStore()

  return (
    <div className="flex flex-col border-t border-neutral-300 items-center sm:justify-between justify-center">
      <div className="w-full flex flex-wrap justify-evenly text-xs p-1">
        {modeOptions.map((modeName) => (
          <div
            key={modeName}
            className={`border m-1 p-1 cursor-pointer rounded${
              mode === modeName ? ' bg-green-200' : ''
            }`}
            onClick={() => {
              if (modeName == 'no_internet') return
              setMode(modeName)
            }}
          >
            {modeName}
          </div>
        ))}
      </div>
    </div>
  )
}
