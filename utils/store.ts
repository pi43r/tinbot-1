import { create } from 'zustand'
import { UberduckVoice, VoiceMsg } from '@/types'
import { Mode } from './modes'

interface globalStore {
  systemPrompt: string
  setSystemPrompt: (prompt: string) => void
  isGoatTalking: boolean
  setIsGoatTalking: (isTalking: boolean) => void
  sttLanguage: string
  setSttLanguage: (lang: string) => void
  googleOutputVoice: SpeechSynthesisVoice | undefined
  setGoogleOutputVoice: (voice: SpeechSynthesisVoice | undefined) => void
  useGoogle: boolean
  setUseGoogle: (bool: boolean) => void
  uberduckVoice: UberduckVoice
  setUberduckVoice: (voice: UberduckVoice) => void
  uberduckVoices: UberduckVoice[]
  setUberduckVoices: (arr: UberduckVoice[]) => void
  mode: Mode
  setMode: (str: Mode) => void
  voiceMsg: VoiceMsg
  setVoiceMsg: (msg: VoiceMsg) => void
  minDecibel: number
  setMinDecibel: (num: number) => void
}

export const useStore = create<globalStore>()((set) => ({
  systemPrompt: '',
  setSystemPrompt: (prompt: string) => set(() => ({ systemPrompt: prompt })),
  isGoatTalking: false,
  setIsGoatTalking: (isTalking: boolean) =>
    set(() => ({ isGoatTalking: isTalking })),
  sttLanguage: 'en',
  setSttLanguage: (lang: string) => set(() => ({ sttLanguage: lang })),
  googleOutputVoice: undefined,
  setGoogleOutputVoice: (voice: SpeechSynthesisVoice | undefined) =>
    set(() => ({ googleOutputVoice: voice })),
  useGoogle: true,
  setUseGoogle: (bool: boolean) => set(() => ({ useGoogle: bool })),
  uberduckVoice: { name: '', uuid: '' },
  setUberduckVoice: (voice: UberduckVoice) =>
    set(() => ({ uberduckVoice: voice })),
  uberduckVoices: [],
  setUberduckVoices: (arr: UberduckVoice[]) =>
    set(() => ({ uberduckVoices: arr })),
  mode: 'idle',
  setMode: (str: Mode) => set(() => ({ mode: str })),
  voiceMsg: {} as VoiceMsg,
  setVoiceMsg: (msg: VoiceMsg) => set(() => ({ voiceMsg: msg })),
  minDecibel: -60,
  setMinDecibel: (num: number) => set(() => ({ minDecibel: num })),
}))
