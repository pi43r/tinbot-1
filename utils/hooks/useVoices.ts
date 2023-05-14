'use client'
import { useState, useEffect } from 'react'
import { Voice } from '@/types'

export default function useVoices() {
  const [voices, setVoices] = useState<Voice[]>([])

  useEffect(() => {
    async function fetchVoices() {
      const response = await fetch('/uberduck-voices.json')
      const data: Voice[] = await response.json()
      setVoices(data)
    }

    fetchVoices()
  }, [])

  return voices
}
