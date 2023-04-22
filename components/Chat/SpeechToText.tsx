import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'

import { FC, useEffect, useState, Dispatch } from 'react'
import { IconMicrophone, IconMicrophoneOff } from '@tabler/icons-react'
import { useStore } from '@/utils/store'

interface SpeechRecognitionProps {
  result: result
  setResult: Dispatch<React.SetStateAction<result>>
}

type result = {
  text: string
  finished: boolean
}

const SpeechToText: FC<SpeechRecognitionProps> = ({ result, setResult }) => {
  const { isGoatTalking, sttLanguage } = useStore()
  const [isListeningActive, setIsListeningActive] = useState(false)

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition()

  const startListening = () => {
    setIsListeningActive(true)
    SpeechRecognition.startListening({
      continuous: true,
      language: sttLanguage,
    })
  }

  const stopListening = () => {
    setIsListeningActive(false)
    SpeechRecognition.stopListening()
  }

  // useEffect(() => {
  //   console.log('interim', interimTranscript)
  //   if (interimTranscript) {
  //     setResult({ text: interimTranscript, finished: false })
  //   }
  // }, [interimTranscript, setResult])

  useEffect(() => {
    if (transcript && !finalTranscript) {
      setResult({ text: transcript, finished: false })
    }
    if (finalTranscript) {
      console.log('final:', finalTranscript)
      setResult({ text: finalTranscript, finished: true })
      resetTranscript()
      setTimeout(() => {
        SpeechRecognition.stopListening()
      }, 100)
    }
  }, [finalTranscript, transcript])

  useEffect(() => {
    console.log('goat talk', isGoatTalking)
    if (isListeningActive && !isGoatTalking) {
      SpeechRecognition.startListening({
        continuous: true,
        language: sttLanguage,
      })
    }
  }, [isGoatTalking, isListeningActive, sttLanguage])

  return (
    <>
      {!browserSupportsSpeechRecognition ? (
        <button disabled>
          <IconMicrophoneOff />
        </button>
      ) : (
        <button disabled={isGoatTalking}>
          {!listening ? (
            <IconMicrophone
              className={`m-1 mt-0 h-12 w-12 ${
                isGoatTalking
                  ? 'bg-gray-200'
                  : 'hover:cursor-pointer hover:opacity-70 bg-rose-400 '
              }  rounded-full p-1 text-white `}
              onClick={() => {
                if (!isGoatTalking) startListening()
              }}
            />
          ) : (
            <IconMicrophoneOff
              className="m-1 mt-0 h-12 w-12 hover:cursor-pointer rounded-full p-1 bg-rose-500 text-white animate-pulse"
              onClick={stopListening}
            />
          )}
        </button>
      )}
    </>
  )
}

export default SpeechToText
