'use client'

import {
  ChangeEvent,
  FC,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from 'react'
import { useStore } from '@/utils/store'
import useVoices from '@/utils/hooks/useVoices'

export const InputPicker: FC = () => {
  const { sttLanguage, setSttLanguage, isGoogleIn } = useStore()
  const handleInputChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value
    setSttLanguage(selectedLanguage)
    localStorage.setItem('sttLanguage', selectedLanguage) // save to local storage
  }

  useEffect(() => {
    /* retrieve sttLanguage from local storage when website first loads and set it to our state */
    const storedLanguage = localStorage.getItem('sttLanguage')
    if (storedLanguage && storedLanguage !== sttLanguage) {
      setSttLanguage(storedLanguage)
    }
  }, [sttLanguage, setSttLanguage])

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
        disabled={!isGoogleIn}
      >
        <option value="en">English</option>
        <option value="de">Deutsch</option>
      </select>
    </div>
  )
}

export const OutputPicker: FC = () => {
  const { isGoogleOut } = useStore()

  return (
    <div className="flex flex-col my-4 text-lg">
      <label htmlFor="output-picker" className="text-gray-400">
        Voice
      </label>

      {isGoogleOut && <GoogleOutputPicker />}

      {!isGoogleOut && <UberduckOutputPicker />}
    </div>
  )
}

const UberduckOutputPicker: FC = () => {
  const { setUberduckVoice, uberduckVoice } = useStore()
  const uberduckOutputPickerRef = useRef<HTMLSelectElement>(null)
  const uberduckVoices = useVoices()

  // handle Uberduck
  useEffect(() => {
    if (uberduckVoices.length > 0 && !uberduckVoice?.name) {
      setUberduckVoice(uberduckVoices[0])
      return
    }
    if (!uberduckVoice) return
    if (uberduckOutputPickerRef.current) {
      const value = uberduckVoice.name
      const index = uberduckVoices.findIndex((voice) => voice.name === value)
      uberduckOutputPickerRef.current.selectedIndex = index
    }
  }, [setUberduckVoice, uberduckVoice, uberduckVoices])

  useEffect(() => {
    // first get and set from storage
    const localUber = localStorage.getItem('uberduckVoice')
    if (localUber) {
      const voice = JSON.parse(localUber)
      setUberduckVoice(voice)
    }
  }, [])

  const handleUberduckOutputLanguage = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>): void => {
      const voiceIndex = parseInt(event.target.value)
      const voice = uberduckVoices[voiceIndex]
      setUberduckVoice(voice)
      localStorage.setItem('uberduckVoice', JSON.stringify(voice))
    },
    [setUberduckVoice, uberduckVoices]
  )

  return (
    <select
      name="output-picker"
      id="output-picker"
      ref={uberduckOutputPickerRef}
      onChange={handleUberduckOutputLanguage}
    >
      {uberduckVoices.map((voice, index) => (
        <option key={voice.uuid} value={index}>
          {voice.name}
        </option>
      ))}
    </select>
  )
}

const GoogleOutputPicker: FC = () => {
  const { googleOutputVoice, setGoogleOutputVoice } = useStore()
  const [googleVoices, setGoogleVoices] = useState<SpeechSynthesisVoice[]>([])
  const googleOutputPickerRef = useRef<HTMLSelectElement>(null)

  function getGoogleVoices(): Promise<SpeechSynthesisVoice[]> {
    const checkVoices = () => {
      return window.speechSynthesis
        .getVoices()
        .filter(
          (voice) => voice.lang.includes('en') || voice.lang.includes('de')
        )
    }

    return new Promise((resolve) => {
      if (window.speechSynthesis.getVoices().length > 0) {
        resolve(checkVoices())
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          resolve(checkVoices())
        }
      }
    })
  }

  useEffect(() => {
    getGoogleVoices().then((voices) => {
      setGoogleVoices(voices)
    })

    return () => {
      window.speechSynthesis.cancel()
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  useEffect(() => {
    const storedGoogleOutputVoice = JSON.parse(
      localStorage.getItem('googleOutputVoice')!
    )

    if (storedGoogleOutputVoice && googleVoices.length > 0) {
      const desiredVoice = googleVoices.find(
        (voice) => voice.voiceURI === storedGoogleOutputVoice
      )
      setGoogleOutputVoice(desiredVoice)
    }
  }, [setGoogleOutputVoice, googleVoices])

  useEffect(() => {
    if (googleOutputPickerRef.current) {
      const index = googleVoices.findIndex(
        (voice) => voice.voiceURI === googleOutputVoice?.voiceURI
      )
      googleOutputPickerRef.current.selectedIndex = index
    }
  }, [googleOutputVoice, googleVoices])

  const handleGoogleOutputLanguage = useCallback(
    (event: ChangeEvent<HTMLSelectElement>): void => {
      const voiceIndex = parseInt(event.target.value)
      const voice = googleVoices[voiceIndex]
      setGoogleOutputVoice(voice)
      localStorage.setItem('googleOutputVoice', JSON.stringify(voice.voiceURI))
    },
    [setGoogleOutputVoice, googleVoices]
  )

  return (
    <select
      name="output-picker"
      id="output-picker"
      ref={googleOutputPickerRef}
      onChange={handleGoogleOutputLanguage}
    >
      {googleVoices.map((voice, index) => (
        <option key={voice.lang + index} value={index}>
          {voice.voiceURI}
        </option>
      ))}
    </select>
  )
}
