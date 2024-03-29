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
// import useVoices from '@/utils/hooks/useVoices'
import { uberduckVoices } from '@/utils/modes'

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
    if (storedLanguage === '') {
      setSttLanguage(storedLanguage)
      return
    }
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
        className="p-2"
        name="input-picker"
        id="input-picker"
        value={sttLanguage}
        onChange={handleInputChange}
        // disabled={!isGoogleIn}
      >
        <option value="">Any</option>
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
  const {
    setUberduckVoice,
    uberduckVoice,
    uberduckSingingVoice,
    setUberduckSingingVoice,
  } = useStore()
  const uberduckOutputPickerRef = useRef<HTMLSelectElement>(null)
  const uberduckSingingPickerRef = useRef<HTMLSelectElement>(null)
  // const uberduckVoices = useVoices()

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
    if (uberduckVoices.length > 0 && !uberduckSingingVoice?.name) {
      setUberduckSingingVoice(uberduckVoices[uberduckVoices.length - 2])
      return
    }
    if (!uberduckSingingVoice) return
    if (uberduckSingingPickerRef.current) {
      const value = uberduckSingingVoice.name
      const index = uberduckVoices.findIndex((voice) => voice.name === value)
      uberduckSingingPickerRef.current.selectedIndex = index
    }
  }, [setUberduckSingingVoice, uberduckSingingVoice, uberduckVoices])

  useEffect(() => {
    const uberVoice = localStorage.getItem('uberduckVoice')
    if (uberVoice) {
      const storedVoice = JSON.parse(uberVoice)
      setUberduckVoice(storedVoice)
    }
    const uberSinging = localStorage.getItem('uberduckSingingVoice')
    if (uberSinging) {
      const storedSingingVoice = JSON.parse(uberSinging)
      setUberduckSingingVoice(storedSingingVoice)
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

  const handleUberduckSingingVoice = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>): void => {
      const voiceIndex = parseInt(event.target.value)
      const voice = uberduckVoices[voiceIndex]
      setUberduckSingingVoice(voice)
      localStorage.setItem('uberduckSingingVoice', JSON.stringify(voice))
    },
    [setUberduckSingingVoice, uberduckVoices]
  )

  return (
    <>
      <select
        className="p-2"
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
      <p className="text-gray-400">singing voice</p>
      <select
        className="p-2"
        name="singing-voice-picker"
        id="singing-voice-picker"
        ref={uberduckSingingPickerRef}
        onChange={handleUberduckSingingVoice}
      >
        {uberduckVoices.map((voice, index) => (
          <option
            key={voice.uuid}
            value={index}
            selected={uberduckSingingVoice?.name === voice.name}
          >
            {voice.name}
          </option>
        ))}
      </select>
    </>
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
    <>
      <select
        className="p-2"
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
      <span className="text-xs text-gray-400">
        does not work on my phone. Input Language changes the voice
      </span>
    </>
  )
}
