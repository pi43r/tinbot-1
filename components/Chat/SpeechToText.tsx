import useSpeechToText, { ResultType } from 'react-hook-speech-to-text'
import { FC, useEffect, Dispatch } from 'react'
import {
  IconMicrophone,
  IconMicrophone2Off,
  IconMicrophoneOff,
} from '@tabler/icons-react'

interface SpeechRecognitionProps {
  result: result
  setResult: Dispatch<React.SetStateAction<result>>
}

type result = {
  text: string
  finished: boolean
}

const SpeechRecognition: FC<SpeechRecognitionProps> = ({
  result,
  setResult,
}) => {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  })

  useEffect(() => {
    if (interimResult) {
      setResult({ text: interimResult, finished: false })
    }
  }, [interimResult, setResult])

  useEffect(() => {
    if (results.length > 0) {
      const lastResult = results[results.length - 1] as ResultType
      console.log(lastResult.transcript)
      if (lastResult.transcript) {
        setResult({ text: lastResult.transcript, finished: true })
      }
    }
  }, [results])

  return (
    <>
      {error ? (
        <button disabled>
          <IconMicrophoneOff />
        </button>
      ) : (
        <button>
          {!isRecording ? (
            <IconMicrophone
              className="m-1 mt-0 h-12 w-12 hover:cursor-pointer rounded-full p-1 bg-rose-400 text-white hover:opacity-70"
              onClick={startSpeechToText}
            />
          ) : (
            <IconMicrophoneOff
              className="m-1 mt-0 h-12 w-12 hover:cursor-pointer rounded-full p-1 bg-rose-500 text-white animate-pulse"
              onClick={stopSpeechToText}
            />
          )}
        </button>
      )}
    </>
  )
}

export default SpeechRecognition
