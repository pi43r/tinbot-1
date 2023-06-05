import { FC, Dispatch, useCallback, useEffect, useRef, useState } from 'react'
import { IconMicrophone, IconMicrophoneOff } from '@tabler/icons-react'
import { Message, Transcription } from '@/types'
import { useStore } from '@/utils/store'

interface ListenButtonProps {
  setContent: Dispatch<React.SetStateAction<string>>
  onSend: (message: Message) => void
}

const POST_DATA = true
const ListenButton: FC<ListenButtonProps> = ({ setContent, onSend }) => {
  const { mode, isGoatTalking, setIsGoatTalking, minDecibel } = useStore()
  const [result, setResult] = useState<Transcription>({} as Transcription)
  const [isRecording, setIsRecording] = useState(false)
  const [, , startRecording, stopRecording, stream, recorder] = useMic()
  const requestAnimationId = useRef<number>()

  const recStartModes = new Set(['walking_chatting', 'walking_hectic_asking'])
  useEffect(() => {
    const shouldRecord = recStartModes.has(mode)

    if (shouldRecord && !isRecording) {
      setIsRecording(true)
      handleStart()
    } else if (!shouldRecord && isRecording) {
      setIsRecording(false)
      handleStop()
    }
  }, [mode])

  const sendChunks = useCallback(
    async (chunks: Blob) => {
      if (POST_DATA) {
        const formData = new FormData()
        const timestamp = Date.now().toString()

        formData.append('audio', chunks)
        // formData.append('prompt', prompt.current || '')
        formData.append('timestamp', timestamp)
        setIsGoatTalking(true)
        const res = await fetch('/api/transcription', {
          method: 'POST',
          body: formData,
        }).then((r) => r.json())

        if (!!res.error) {
          console.warn(res.error.message)
          setIsGoatTalking(false)
          return
        }

        if (!res.text || res.text === '\n') {
          setIsGoatTalking(false)
        }
        setResult(res)
        //   setResult((text) => {
        //     const nextResult = [...text]
        //     nextResult.push({ timestamp: res.timestamp, text: res.result })
        //     // prompt.current = prompt.current + ' ' + res.result
        //     return nextResult
        //   })
      } else {
        console.log('POST DATA')
      }
    },
    [setIsGoatTalking]
  )

  /**
   * https://stackoverflow.com/questions/46543341/how-can-i-extract-the-preceding-audio-from-microphone-as-a-buffer-when-silence
   */
  const toggleStreamOnSilence = useCallback(() => {
    if (!stream) return
    const audioCtx = new AudioContext()
    const source = audioCtx.createMediaStreamSource(stream as MediaStream)
    const analyser = audioCtx.createAnalyser()

    // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/minDecibels
    analyser.minDecibels = minDecibel
    // analyser.maxDecibels = -10
    // analyser.smoothingTimeConstant = 0.9

    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    source.connect(analyser)

    let silenceStart = performance.now()
    let triggered = false
    const toggle: FrameRequestCallback = (time) => {
      requestAnimationId.current = requestAnimationFrame(toggle)
      analyser.getByteFrequencyData(dataArray)

      // if there is data above the given db limit
      if (dataArray.some((v) => v)) {
        if (!triggered) {
          if (recorder?.state === 'inactive') recorder?.start()
          triggered = true
        }
        silenceStart = time
      }
      if (triggered && time - silenceStart > 1500) {
        if (recorder?.state === 'recording') recorder?.stop()
        triggered = false
      }
    }

    //@ts-expect-error
    toggle()
  }, [recorder, stream])

  useEffect(() => {
    return () => {
      if (requestAnimationId.current)
        cancelAnimationFrame(requestAnimationId.current)
    }
  }, [])

  const handleStart = useCallback(() => {
    startRecording((data: BlobEvent) => {
      sendChunks(data.data)
    })
    toggleStreamOnSilence()
  }, [sendChunks, startRecording, toggleStreamOnSilence])

  const handleStop = () => {
    stopRecording()
    if (requestAnimationId.current)
      cancelAnimationFrame(requestAnimationId.current)
  }

  useEffect(() => {
    console.log('setContent', result)
    if (!result.text || result.text == '\n') return
    const text = removeNewLine(result.text)
    setContent(text)
    setTimeout(() => {
      onSend({ role: 'user', content: text })
      setContent('')
    }, 1000)
  }, [result, setContent])

  function removeNewLine(text: string) {
    if (text.endsWith('\n')) {
      return text.substring(0, text.length - 1)
    }
    return text
  }

  useEffect(() => {
    console.log('Goat talking', isGoatTalking)
    console.log('recording', isRecording)
    if (isGoatTalking && isRecording) handleStop()
    if (!isGoatTalking && isRecording) handleStart()
  }, [isGoatTalking])

  return (
    <button>
      {!isRecording ? (
        <IconMicrophone
          className="m-1 mt-0 h-12 w-12 hover:cursor-pointer rounded-full p-1 bg-orange-400 text-white hover:opacity-80"
          onClick={() => {
            setIsRecording(true)
            handleStart()
          }}
        />
      ) : (
        <IconMicrophoneOff
          className={`m-1 mt-0 h-12 w-12 ${
            isGoatTalking
              ? 'bg-gray-200'
              : 'hover:cursor-pointer hover:opacity-70 bg-orange-400 '
          }  rounded-full p-1 text-white `}
          onClick={() => {
            if (!isGoatTalking) {
              setIsRecording(false)
              handleStop()
            }
          }}
        />
      )}
    </button>
  )
}

export default ListenButton

function useMic(): [
  Function,
  Function,
  (callback: (ev: BlobEvent) => void) => void,
  Function,
  MediaStream | undefined,
  MediaRecorder | undefined
] {
  const [stream, setStream] = useState<MediaStream>()
  const recorder = useRef<MediaRecorder>()

  async function startMicrophone() {
    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
      setStream(streamData)
      recorder.current = new MediaRecorder(streamData, {
        mimeType: 'audio/webm',
      })
    } catch (err) {
      alert(err)
    }
  }

  function stopMicrophone() {
    if (!stream) return
    stream.getTracks().forEach((track) => track.stop())
  }

  const startRecording = (callback: (ev: BlobEvent) => void) => {
    if (!recorder.current) return
    recorder.current.ondataavailable = callback
    recorder.current.start()
  }

  function stopRecording() {
    if (!recorder.current) return
    if (recorder.current.state == 'inactive') return
    recorder.current?.stop()
  }

  useEffect(() => {
    startMicrophone()
  }, [])

  return [
    startMicrophone,
    stopMicrophone,
    startRecording,
    stopRecording,
    stream,
    recorder.current,
  ]
}
