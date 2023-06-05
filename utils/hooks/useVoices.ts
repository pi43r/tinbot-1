'use client'
import { useState, useEffect } from 'react'
import { UberduckVoice } from '@/types'
import { useStore } from '../store'

export default function useVoices() {
  const [voices, setVoices] = useState<UberduckVoice[]>([])

  const { setUberduckVoice, uberduckVoices, setUberduckVoices } = useStore()

  useEffect(() => {
    if (voices.length == 0) return
    setUberduckVoices(voices)
    setUberduckVoice(voices[0])
  }, [voices, setUberduckVoice, setUberduckVoices])

  useEffect(() => {
    async function fetchVoices() {
      const response = await fetch('/uberduck-voices.json')
      const data: UberduckVoice[] = await response.json()
      setVoices(data)
    }

    fetchVoices()
  }, [])

  return voices
}
