'use client'

import { ChangeEvent, FC, useState, useEffect } from 'react'
import { useStore } from '@/utils/store'
import { Voice } from '@/types'

interface PickLanguageProps {}

const PickLanguageForm: FC<PickLanguageProps> = () => {
  const {
    sttLanguage,
    setSttLanguage,
    ttsLanguage,
    setTtsLanguage,
    useGoogle,
    voices,
    setVoice,
  } = useStore()

  const [outputVoices, setOutputVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    const synth = window.speechSynthesis
    if (synth) {
      const voiceArray = synth.getVoices()
      const filteredVoices = voiceArray.filter(
        (voice) => voice.lang.includes('en') || voice.lang.includes('de')
      )
      setOutputVoices(filteredVoices)
    }
  }, [useGoogle])

  const handleSTTLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    setSttLanguage(event.target.value)
  }

  const handleTTSLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    const voiceIndex = parseInt(event.target.value)
    const voice = voices[voiceIndex]
    setVoice(voice)
  }

  const handleVoiceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const voiceIndex = parseInt(event.target.value)
    const voice = outputVoices[voiceIndex]
    setTtsLanguage(voice)
  }

  return (
    <div className="flex items-center justify-around">
      <div className="mb-2">
        <label htmlFor="input-picker" className="mr-2">
          input:
        </label>
        <select
          name="input-picker"
          id="input-picker"
          value={sttLanguage}
          onChange={handleSTTLanguage}
          disabled={!useGoogle}
        >
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
      <div className="mb-2">
        <label htmlFor="output-picker" className="mr-2">
          output:
        </label>
        {useGoogle && (
          <select
            name="output-picker"
            id="output-picker"
            onChange={handleTTSLanguage}
          >
            {outputVoices.length > 0 &&
              outputVoices.map((voice, index) => (
                <option
                  key={voice.lang + index.toString()}
                  value={index.toString()}
                >
                  {voice.voiceURI}
                </option>
              ))}
          </select>
        )}
        {!useGoogle && (
          <select
            name="output-picker"
            id="output-picker"
            onChange={handleVoiceChange}
          >
            {voices.map((voice, index) => (
              <option key={voice.uuid} value={index.toString()}>
                {voice.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}

export default PickLanguageForm
