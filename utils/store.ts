import { create } from 'zustand'
import { Voice } from '@/types'
import { Mode } from './modes'

interface globalStore {
  systemPrompt: string
  setSystemPrompt: (prompt: string) => void
  isGoatTalking: boolean
  setIsGoatTalking: (isTalking: boolean) => void
  sttLanguage: string
  setSttLanguage: (lang: string) => void
  ttsLanguage: SpeechSynthesisVoice | undefined
  setTtsLanguage: (voice: SpeechSynthesisVoice | undefined) => void
  useGoogle: boolean
  setUseGoogle: (bool: boolean) => void
  voice: Voice
  setVoice: (voice: Voice) => void
  voices: Voice[]
  setVoices: (arr: Voice[]) => void
  mode: Mode
  setMode: (str: Mode) => void
}

export const useStore = create<globalStore>()((set) => ({
  systemPrompt: '',
  setSystemPrompt: (prompt: string) => set(() => ({ systemPrompt: prompt })),
  isGoatTalking: false,
  setIsGoatTalking: (isTalking: boolean) =>
    set(() => ({ isGoatTalking: isTalking })),
  sttLanguage: 'en',
  setSttLanguage: (lang: string) => set(() => ({ sttLanguage: lang })),
  ttsLanguage: undefined,
  setTtsLanguage: (voice: SpeechSynthesisVoice | undefined) =>
    set(() => ({ ttsLanguage: voice })),
  useGoogle: true,
  setUseGoogle: (bool: boolean) => set(() => ({ useGoogle: bool })),
  voice: { name: '', uuid: '' },
  setVoice: (voice: Voice) => set(() => ({ voice: voice })),
  voices: [],
  setVoices: (arr: Voice[]) => set(() => ({ voices: arr })),
  mode: 'idle',
  setMode: (str: Mode) => set(() => ({ mode: str })),
}))
