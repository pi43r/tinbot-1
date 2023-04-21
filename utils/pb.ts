import PocketBase from 'pocketbase'
import { Record } from '@/types'

const pb = new PocketBase('https://goatnet.pockethost.io')

export const getRecords = async (): Promise<Record[]> => {
  const response = await pb.collection('system').getFullList({
    sort: '-created',
  })
  return response
}

export const createRecord = async (prompt: string): Promise<Record> => {
  const data = { prompt: prompt }
  const record: Record = await pb.collection('system').create(data)
  return record
}
