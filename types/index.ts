import { Mode } from '@/utils/modes'

export enum OpenAIModel {
  DAVINCI_TURBO = 'gpt-3.5-turbo-0613',
}

export interface Message {
  role: Role
  content: string
}

export type Role = 'assistant' | 'user'

export interface Record {
  collectionId: string
  collectionName: string
  created: string
  id: string
  prompt?: string
  updated: string
  expand?: RecordExpand
}

export interface pbPrompt {
  collectionId: string
  collectionName: string
  created: string
  id: string
  walking_chatting?: string
  walking_hectic_asking?: string
  dance_slow_sing_slow?: string
  speech_abstract?: string
  updated: string
  expand?: RecordExpand
}

export interface pbPromptModes {
  walking_chatting?: string
  walking_hectic_asking?: string
  dance_slow_sing_slow?: string
  speech_abstract?: string
}

export interface RecordExpand {
  [key: string]: any
}

export type Transcription = { timestamp: string; text: string }

export type UberduckVoice = { name: string; uuid: string }

export interface BodyMsg {
  abstraction: string
  dance: string
  speed: string
  t: string
}

export interface VoiceMsg {
  sing: string
  abstraction: string
  speed: string
  loudness: string
  dialogue: string
}

export interface ModeMsg {
  t: string
  key: Mode
  description: string
}
