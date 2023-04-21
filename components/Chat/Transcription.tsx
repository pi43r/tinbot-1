import React from 'react'
import { Transcriptions } from '@/types'

type Props = {
  transcriptions: Transcriptions
}

function Transcriptions({ transcriptions }: Props) {
  console.log('transcriptions: ', transcriptions)
  // Check if the transcriptions array exists and it is not empty
  if (!transcriptions || transcriptions.length === 0) {
    console.error('Transcriptions array is empty or not defined')
    return null
  }

  // Filter out invalid transcriptions
  const validTranscriptions = transcriptions.filter(
    (transcription) =>
      transcription.hasOwnProperty('timestamp') &&
      transcription.hasOwnProperty('transcript') &&
      !isNaN(new Date(transcription.timestamp).getTime())
  )
  console.log('validTranscriptions: ', validTranscriptions)

  // Sort the valid transcriptions by timestamp
  const sorted = validTranscriptions.sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  )
  console.log('sorted: ', sorted)

  return <pre>{JSON.stringify(transcriptions, null, 2)}</pre>
}

export default Transcriptions
