'use client'
import { Message } from '@/types'
import dynamic from 'next/dynamic'
import { FC, useEffect, useState } from 'react'
import Speak from './TextToSpeech'
import SpeechGenerator from './SpeechGenerator'
import { useStore } from '@/utils/store'

interface Props {
  message: Message
}

export const ChatMessage: FC<Props> = ({ message }) => {
  const { uberduckVoice, isGoogleOut } = useStore()

  return (
    <div
      className={`flex flex-col ${
        message.role === 'assistant' ? 'items-start' : 'items-end'
      }`}
    >
      {message.role == 'assistant' ? (
        <div
          className="flex items-center bg-neutral-200 text-neutral-900 rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap"
          style={{ overflowWrap: 'anywhere' }}
        >
          {isGoogleOut ? (
            <Speak>{message.content}</Speak>
          ) : (
            <>
              {message.content}
              {uberduckVoice?.name && (
                <SpeechGenerator
                  voicemodel={uberduckVoice.uuid}
                  text={message.content}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <div
          className="flex items-center bg-blue-500 text-white rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap"
          style={{ overflowWrap: 'anywhere' }}
        >
          {message.content}
        </div>
      )}
    </div>
  )
}
