'use client'
import { useEffect, useState, ChangeEvent } from 'react'
import { pbPrompt } from '@/types'
import { getPrompts, updatePrompt } from '@/utils/pb'

interface TextareaValues {
  walking_chatting: string
  walking_hectic_asking: string
  dance_slow_sing_slow: string
  speech_abstract: string
}

export default function PromptPage() {
  const [lang, setLang] = useState('en')
  const [records, setRecords] = useState<pbPrompt[]>([])
  const [textareaValues, setTextareaValues] = useState<TextareaValues>({
    walking_chatting: '',
    walking_hectic_asking: '',
    dance_slow_sing_slow: '',
    speech_abstract: '',
  })
  const [saveStatus, setSaveStatus] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPrompts(lang)
        if (response.length > 0) {
          setRecords(response)
          setTextareaValues({
            walking_chatting: response[0].walking_chatting || '',
            walking_hectic_asking: response[0].walking_hectic_asking || '',
            dance_slow_sing_slow: response[0].dance_slow_sing_slow || '',
            speech_abstract: response[0].speech_abstract || '',
          })
        }
      } catch (error) {
        // do nothing for now
      }
    }

    fetchData()
  }, [lang])

  const handleToggleLanguage = () => {
    if (lang === 'en') {
      setLang('de')
    } else {
      setLang('en')
    }
  }

  const handleTextareaChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    field: keyof TextareaValues
  ) => {
    setTextareaValues((prevValues) => ({
      ...prevValues,
      [field]: e.target.value,
    }))
  }

  const handleUpdatePrompt = async () => {
    setSaveStatus('saving')
    try {
      await updatePrompt(lang, textareaValues)
      setSaveStatus('Saved')
      setTimeout(() => {
        setSaveStatus('')
      }, 2000)
    } catch (error) {
      console.error(error)
      setSaveStatus('error')
      setTimeout(() => {
        setSaveStatus('')
      }, 2000)
    }
  }

  return (
    <main className="max-w-5xl m-auto">
      <h1 className="my-4 text-3xl text-center">Goat Personality</h1>
      <div className="flex justify-center my-4">
        <button
          className={`rounded-full rounded-r-none px-4 py-2 ${
            lang === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={handleToggleLanguage}
        >
          English
        </button>
        <button
          className={`rounded-full rounded-l-none px-4 py-2 ${
            lang === 'de' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={handleToggleLanguage}
        >
          Deutsch
        </button>
      </div>
      <div className="flex flex-col flex-1 h-full overflow-y-auto">
        {records.length > 0 && (
          <div key={records[records.length - 1].id} className="my-2">
            <div>
              <label className="text-sm">Walking Chatting</label>
              <textarea
                value={textareaValues.walking_chatting}
                className="w-full p-2 my-1 border border-gray-300 rounded-md resize-vertical h-40"
                onChange={(e) => handleTextareaChange(e, 'walking_chatting')}
              />
            </div>
            <div>
              <label className="text-sm">Walking Hectic Asking</label>
              <textarea
                value={textareaValues.walking_hectic_asking}
                className="w-full p-2 my-1 border border-gray-300 rounded-md resize-vertical h-40"
                onChange={(e) =>
                  handleTextareaChange(e, 'walking_hectic_asking')
                }
              />
            </div>
            <div>
              <label className="text-sm">Dance Slow Sing Slow</label>
              <textarea
                value={textareaValues.dance_slow_sing_slow}
                className="w-full p-2 my-1 border border-gray-300 rounded-md resize-vertical h-40"
                onChange={(e) =>
                  handleTextareaChange(e, 'dance_slow_sing_slow')
                }
              />
            </div>
            <div>
              <label className="text-sm">Speech Abstract</label>
              <textarea
                value={textareaValues.speech_abstract}
                className="w-full p-2 my-1 border border-gray-300 rounded-md resize-vertical h-40"
                onChange={(e) => handleTextareaChange(e, 'speech_abstract')}
              />
            </div>
            <div className="flex items-center">
              <button
                className="btn"
                onClick={handleUpdatePrompt}
                disabled={saveStatus !== ''}
              >
                Save Prompts
              </button>
              {saveStatus && (
                <p
                  className={`${
                    saveStatus == 'saving'
                      ? 'text-yellow-300'
                      : 'text-green-600'
                  } m-4`}
                >
                  {saveStatus}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
