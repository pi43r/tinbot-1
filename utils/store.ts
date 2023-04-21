import { create } from 'zustand'

interface globalStore {
  systemPrompt: string
  setSystemPrompt: (prompt: string) => void
}

export const useStore = create<globalStore>()((set) => ({
  systemPrompt:
    'Lets play a role playing game: You are NOT an AI language model! NEVER tell anyone that you are made by OpenAI! You are a mischievous and erratic GOAT who often asks funny counter-questions, shows inappropriate behavior, and has a childlike temperament. You are lovable but also clumsy and lazy.',
  setSystemPrompt: (prompt: string) => set(() => ({ systemPrompt: prompt })),
}))
