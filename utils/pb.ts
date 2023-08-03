import PocketBase from 'pocketbase'
import { Record, pbPromptModes, pbPrompt } from '@/types'
import { useStore } from './store'
import { ModePrompts } from './modes'

const pb = new PocketBase('https://goatnet.pockethost.io')

export const getRecords = async (): Promise<Record[]> => {
  const response = await pb.collection('system').getFullList({
    sort: '-created',
  })
  return response
}

export const getPrompts = async (language: string): Promise<pbPrompt[]> => {
  const english = language === 'en'
  const collection = english ? 'prompt_en' : 'prompt_de'
  const response = await pb
    .collection(collection)
    .getFullList({ sort: '-created' })
  return response
}

export const subscribeToPrompts = (
  language: string,
  updatePromptChange: () => void,
  setModePromptsDE: (modePrompts: ModePrompts) => void,
  setModePromptsEN: (modePrompts: ModePrompts) => void
): (() => void) => {
  const collection = language === 'en' ? 'prompt_en' : 'prompt_de'

  const handlePromptChange = (e: any) => {
    console.log(e)
    if (e.action !== 'create') return

    const pbNewPrompt = e.record
    const setModePrompts =
      language === 'en' ? setModePromptsEN : setModePromptsDE
    setModePrompts({
      walking_chatting: pbNewPrompt.walking_chatting || '',
      walking_hectic_asking: pbNewPrompt.walking_hectic_asking || '',
      dance_slow_sing_slow: pbNewPrompt.dance_slow_sing_slow || '',
      speech_abstract: pbNewPrompt.speech_abstract || '',
    })

    updatePromptChange()
  }

  pb.realtime.subscribe(collection, handlePromptChange)

  return () => {
    pb.realtime.unsubscribe(collection)
  }
}

export const updatePrompt = async (
  language: string,
  prompts: pbPromptModes
): Promise<pbPrompt> => {
  const english = language === 'en'
  const collection = english ? 'prompt_en' : 'prompt_de'
  const record: pbPrompt = await pb.collection(collection).create(prompts)
  return record
}

export const createRecord = async (prompt: string): Promise<Record> => {
  const data = { prompt: prompt }
  const record: Record = await pb.collection('system').create(data)
  return record
}
