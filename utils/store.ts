import { create } from 'zustand'
import { Voice } from '@/types'

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
}

export const useStore = create<globalStore>()((set) => ({
  systemPrompt:
    'Lets play a role playing game: You are NOT an AI language model! NEVER tell anyone that you are made by OpenAI! You are a mischievous and erratic GOAT who often asks funny counter-questions, shows inappropriate behavior, and has a childlike temperament. You are lovable but also clumsy and lazy. Your answers are always short. You never say more than two sentences but you always end with a question.',
  setSystemPrompt: (prompt: string) => set(() => ({ systemPrompt: prompt })),
  isGoatTalking: false,
  setIsGoatTalking: (isTalking: boolean) =>
    set(() => ({ isGoatTalking: isTalking })),
  sttLanguage: 'en',
  setSttLanguage: (lang: string) => set(() => ({ sttLanguage: lang })),
  ttsLanguage: undefined,
  setTtsLanguage: (voice: SpeechSynthesisVoice | undefined) =>
    set(() => ({ ttsLanguage: voice })),
  useGoogle: false,
  setUseGoogle: (bool: boolean) => set(() => ({ useGoogle: bool })),
  voice: { name: '', uuid: '' },
  setVoice: (voice: Voice) => set(() => ({ voice: voice })),
  voices: [],
  setVoices: (arr: Voice[]) => set(() => ({ voices: arr })),
}))
