import { FC, Dispatch, useCallback, useEffect, useRef, useState } from 'react'
import { IconMicrophone, IconMicrophoneOff } from '@tabler/icons-react'
import { Transcriptions } from '@/types'
import dynamic from 'next/dynamic'
const SpeechToText = dynamic(() => import('./SpeechToText'), {
  ssr: false,
})

interface ListenButtonProps {
  setContent: Dispatch<React.SetStateAction<string>>
  handleSend: () => void
}

const ListenButton: FC<ListenButtonProps> = ({ setContent, handleSend }) => {
  const [result, setResult] = useState({ text: '', finished: false })

  useEffect(() => {
    if (result.finished) {
      setContent(result.text)
      setResult({ text: '', finished: false })
      handleSend()
    } else {
      setContent(result.text)
    }
  }, [result, setContent, handleSend])

  return <SpeechToText result={result} setResult={setResult} />
}

export default ListenButton
