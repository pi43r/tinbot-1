import { FC, useEffect } from 'react'
import { useStore } from '@/utils/store'
import { Mode, modeOptions } from '@/utils/modes'

interface VoiceMsg {
  sing: string
  abstraction: string
  speed: string
  loudness: string
  dialogue: string
}

export const Footer: FC = () => {
  const { mode, setMode, voiceMsg } = useStore()

  useEffect(() => {
    /* 
      dialogue >90% = walking_chatting
      loudness >90% = hectic_asking
      singing >90% = dance_slow_sing_slow
      abstraction >40% && dialogue >80% = speech_abstract
      abstraction >90% = as_weird_as_it_gets
    */

    const { dialogue, loudness, sing, abstraction, speed } = voiceMsg

    let newMode: Mode = 'idle'

    if (parseFloat(abstraction) > 0.9) {
      newMode = 'as_weird_as_it_gets'
    } else if (dialogue > '0.8' && parseFloat(loudness) > 0.9) {
      newMode = 'walking_chatting'
    } else if (parseFloat(loudness) > 0.9 && parseFloat(speed) > 0.7) {
      newMode = 'walking_hectic_asking'
    } else if (parseFloat(sing) > 0.3) {
      newMode = 'dance_slow_sing_slow'
    } else if (parseFloat(abstraction) > 0.4 && parseFloat(dialogue) > 0.8) {
      newMode = 'speech_abstract'
    }

    setMode(newMode)
  }, [voiceMsg])

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
