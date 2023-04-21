import { FC, useState, FormEvent, ChangeEvent } from 'react'
import { Record } from '@/types'
import { createRecord } from '@/utils/pb'
import { useStore } from '@/utils/store'

interface PromptFormProps {
  systemPrompt: string
  setSystemPrompt: (systemPrompt: string) => void
  records: Record[]
  setRecords: (records: Record[]) => void
}

export const PromptForm: FC<PromptFormProps> = (props) => {
  const { records, setRecords } = props
  const { systemPrompt, setSystemPrompt } = useStore()

  const [prompt, setPrompt] = useState(systemPrompt)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const newPrompt = (event.currentTarget.prompt as HTMLTextAreaElement).value
    setSystemPrompt(newPrompt)
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setPrompt(event.target.value)
  }

  function savePrompt() {
    if (!systemPrompt) return
    if (records.some((record) => record.prompt === systemPrompt)) {
      console.log(`Prompt "${systemPrompt}" already exists in records.`)
      return
    }
    createRecord(systemPrompt)
    setRecords([createDummyRecord(systemPrompt), ...records])

    function createDummyRecord(prompt: string): Record {
      return {
        prompt,
        collectionId: '',
        collectionName: '',
        created: '',
        id: '',
        updated: '',
      }
    }
  }

  return (
    <div className="h-60 mt-4">
      <form onSubmit={handleSubmit}>
        <textarea
          className="input"
          placeholder="describe your GOAT personality"
          rows={6}
          id="prompt"
          name="prompt"
          value={prompt}
          onChange={handleChange}
        />

        <div className="h-7 overflow-x-auto">
          current prompt: {systemPrompt}
        </div>

        <button className="btn" type="submit">
          update
        </button>
        <button
          className="btn-secondary mx-2"
          type="button"
          onClick={savePrompt}
        >
          save
        </button>
      </form>
    </div>
  )
}
