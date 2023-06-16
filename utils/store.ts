import { create } from 'zustand'
import { UberduckVoice, VoiceMsg } from '@/types'
import { Mode } from './modes'

interface GlobalStore {
  systemPrompt: string
  setSystemPrompt: (prompt: string) => void
  isGoatTalking: boolean
  setIsGoatTalking: (isTalking: boolean) => void
  sttLanguage: string
  setSttLanguage: (lang: string) => void
  googleOutputVoice: SpeechSynthesisVoice | undefined
  setGoogleOutputVoice: (voice: SpeechSynthesisVoice | undefined) => void
  isGoogleIn: boolean
  setisGoogleIn: (bool: boolean) => void
  isGoogleOut: boolean
  setisGoogleOut: (bool: boolean) => void
  uberduckVoice: UberduckVoice
  setUberduckVoice: (voice: UberduckVoice) => void
  uberduckSingingVoice: UberduckVoice
  setUberduckSingingVoice: (voice: UberduckVoice) => void
  uberduckVoices: UberduckVoice[]
  setUberduckVoices: (arr: UberduckVoice[]) => void
  mode: Mode
  setMode: (str: Mode) => void
  voiceMsg: VoiceMsg
  setVoiceMsg: (msg: VoiceMsg) => void
  minDecibel: number
  setMinDecibel: (num: number) => void
}

export const useStore = create<GlobalStore>()((set) => ({
  systemPrompt: '',
  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
  isGoatTalking: false,
  setIsGoatTalking: (isTalking) => set({ isGoatTalking: isTalking }),
  sttLanguage: 'en',
  setSttLanguage: (lang) => set({ sttLanguage: lang }),
  googleOutputVoice: undefined,
  setGoogleOutputVoice: (voice) => set({ googleOutputVoice: voice }),
  isGoogleIn: true,
  setisGoogleIn: (bool) => set({ isGoogleIn: bool }),
  isGoogleOut: true,
  setisGoogleOut: (bool) => set({ isGoogleOut: bool }),
  uberduckVoice: {} as UberduckVoice,
  setUberduckVoice: (voice) => set({ uberduckVoice: voice }),
  uberduckSingingVoice: {} as UberduckVoice,
  setUberduckSingingVoice: (voice) => set({ uberduckSingingVoice: voice }),
  uberduckVoices: [],
  setUberduckVoices: (arr) => set({ uberduckVoices: arr }),
  mode: 'idle',
  setMode: (str) => set({ mode: str }),
  voiceMsg: {} as VoiceMsg,
  setVoiceMsg: (msg) => set({ voiceMsg: msg }),
  minDecibel: -60,
  setMinDecibel: (num) => set({ minDecibel: num }),
}))
