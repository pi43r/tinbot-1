export enum OpenAIModel {
  DAVINCI_TURBO = 'gpt-3.5-turbo',
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

export interface RecordExpand {
  [key: string]: any
}

export type Transcription = { timestamp: string; text: string }

export type Voice = { name: string; uuid: string }
