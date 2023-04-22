import { FC, Dispatch, useCallback, useEffect, useRef, useState } from 'react'
import { IconMicrophone, IconMicrophoneOff } from '@tabler/icons-react'
import { Transcriptions } from '@/types'
import dynamic from 'next/dynamic'
const SpeechToText = dynamic(() => import('./SpeechToText'), {
  ssr: false,
})
import { Message } from '@/types'

interface ListenButtonProps {
  setContent: Dispatch<React.SetStateAction<string>>
  handleSend: () => void
  onSend: (message: Message) => void
  content: string
}

const ListenButton: FC<ListenButtonProps> = ({
  content,
  setContent,
  handleSend,
  onSend,
}) => {
  const [result, setResult] = useState({ text: '', finished: false })
  const [processingResult, setProcessingResult] = useState(false)

  useEffect(() => {
    if (result.finished && !processingResult) {
      setContent(result.text)
      setProcessingResult(true)
      setTimeout(() => {
        // handleSend() // for some reason this is not sending the final result...
        onSend({ role: 'user', content: result.text })
        setProcessingResult(false)
        setResult({ text: '', finished: false })
      }, 1000)
    }

    if (!result.finished && !processingResult) {
      setContent(result.text)
    }
  }, [onSend, processingResult, result, setContent])

  return <SpeechToText result={result} setResult={setResult} />
}

export default ListenButton
