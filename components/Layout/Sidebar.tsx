import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react"
import PocketBase from "pocketbase"

const pb = new PocketBase("https://goatnet.pockethost.io")

interface Record {
  collectionId: string
  collectionName: string
  created: string
  id: string
  prompt?: string
  updated: string
  expand?: RecordExpand
}

interface RecordExpand {
  [key: string]: any
}

interface SidebarProps {
  visible: boolean
  systemPrompt: string
  setSystemPrompt: (systemPrompt: string) => void
}

export const Sidebar: FC<SidebarProps> = (props) => {
  const { visible, systemPrompt, setSystemPrompt } = props
  const [prompt, setPrompt] = useState(systemPrompt)
  const [records, setRecords] = useState<Record[]>([])

  const getRecords = async () => {
    const response = await pb.collection("system").getFullList({
      sort: "-created",
    })
    return response
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRecords()
        if (response.length > 0) {
          setRecords(response)
        }
      } catch (error) {
        // do nothing for now
      }
    }
    fetchData()
  }, [])

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
    const createPBEntry = async (prompt: string) => {
      const data = { prompt: prompt }
      const record: Record = await pb.collection("system").create(data)
      console.log(record)
      setRecords([record, ...records])
      return record
    }

    createPBEntry(systemPrompt)
  }

  return (
    <div
      className={`z-10 absolute md:relative h-[calc(100%-120px)] md:h-full w-full md:w-1/3 border border-gray-300 bg-white transition -translate-x-full 
                        ${visible ? "translate-x-0" : ""}
                        ${visible ? "md:block" : "md:hidden"}
                        `}
    >
      <div className="flex flex-col h-full w-full p-4 overflow-y-auto">
        <h2 className="mb-4 text-center">Pick Goat Personality</h2>
        <div className="flex-1">
          {records.length > 0 &&
            records.map((rec) => {
              return (
                <div
                  key={rec.id}
                  className="my-1 border border-gray-300 rounded-md p-2 cursor-pointer 
                                                        hover:bg-gray-400 hover:text-gray-50"
                  onClick={() => setSystemPrompt(rec.prompt ?? "")}
                >
                  {rec.prompt}
                </div>
              )
            })}
        </div>
        <div className="h-60">
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
      </div>
    </div>
  )
}
