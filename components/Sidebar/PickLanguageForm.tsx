'use client'

import { ChangeEvent, FC, useState, useEffect } from 'react'
import { useStore } from '@/utils/store'

export const InputPicker: FC = () => {
  const { sttLanguage, setSttLanguage, useGoogle } = useStore()
  const handleInputChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSttLanguage(event.target.value)
  }

  return (
    <div className="flex flex-col my-4 text-lg">
      <label htmlFor="input-picker" className="text-gray-500">
        language
      </label>
      <select
        name="input-picker"
        id="input-picker"
        value={sttLanguage}
        onChange={handleInputChange}
        disabled={!useGoogle}
      >
        <option value="en">English</option>
        <option value="de">Deutsch</option>
      </select>
    </div>
  )
}

export const OutputPicker: FC = () => {
  const { setGoogleOutputVoice, useGoogle, uberduckVoices, setUberduckVoice } =
    useStore()

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

  const handleUberduckOutputLanguage = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const voiceIndex = parseInt(event.target.value)
    const voice = uberduckVoices[voiceIndex]
    setUberduckVoice(voice)
  }

  const handleGoogleOutputLanguage = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const voiceIndex = parseInt(event.target.value)
    const voice = outputVoices[voiceIndex]
    console.log(voice)
    setGoogleOutputVoice(voice)
  }

  return (
    <div className="flex flex-col my-4 text-lg">
      <label htmlFor="output-picker" className="text-gray-400">
        Voice
      </label>
      {useGoogle && (
        <select
          name="output-picker"
          id="output-picker"
          onChange={handleGoogleOutputLanguage}
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
          onChange={handleUberduckOutputLanguage}
        >
          {uberduckVoices.map((voice, index) => (
            <option key={voice.uuid} value={index.toString()}>
              {voice.name}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
