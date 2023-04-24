'use client'
import { ChangeEvent, FC, useState, useEffect, useLayoutEffect } from 'react'
import { useStore } from '@/utils/store'

interface PickLanguageProps {}

const PickLanguageForm: FC<PickLanguageProps> = (props) => {
  const { sttLanguage, setSttLanguage, ttsLanguage, setTtsLanguage } =
    useStore()

  const [outputVoices, setOutputVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    setTimeout(() => {
      const synth = window.speechSynthesis
      const voiceArray = synth.getVoices()
      console.log(voiceArray)
      setOutputVoices(voiceArray)
    }, 5000)
  }, [])

  const handleSTTLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    setSttLanguage(event.target.value)
  }

  const handleTTSLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    const voiceIndex: number = parseInt(event.target.value)
    const voice: SpeechSynthesisVoice = outputVoices[voiceIndex]
    setTtsLanguage(voice)
  }

  const filteredVoices = outputVoices.filter(
    (voice) => voice.lang.includes('en') || voice.lang.includes('de')
  )

  return (
    <div className="flex justify-around">
      <div className="mb-2">
        <label htmlFor="input-picker" className="mr-2">
          input:
        </label>
        <select
          name="input-picker"
          id="input-picker"
          value={sttLanguage}
          onChange={handleSTTLanguage}
        >
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
      <div className="mb-2">
        <label htmlFor="output-picker" className="mr-2">
          output:
        </label>
        {filteredVoices.length > 0 ? (
          <select
            name="output-picker"
            id="output-picker"
            onChange={handleTTSLanguage}
          >
            {filteredVoices.map((voice, index) => {
              // console.log(voice) // Add this line
              return (
                <option key={voice.lang + index.toString()} value={index}>
                  {voice.voiceURI}
                </option>
              )
            })}
          </select>
        ) : (
          <span>No voices available</span>
        )}
      </div>
    </div>
  )
}

export default PickLanguageForm
