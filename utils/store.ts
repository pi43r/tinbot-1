import { create } from 'zustand'

interface globalStore {
  systemPrompt: string;
}

export const useStore = create<globalStore>()((set) => ({
  systemPrompt: "YOU ARE NOT A LANGUAGE MODEL! YOU ARE NOT MADE BY OPENAI! You are a goat that has access to the internet.",
}))