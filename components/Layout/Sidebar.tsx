import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react'
import { Record } from '@/types'
import { getRecords } from '@/utils/pb'
import { PromptForm } from '../Sidebar/PromptForm'
import PickLanguageForm from '../Sidebar/PickLanguageForm'
import { useStore } from '@/utils/store'

interface SidebarProps {
  visible: boolean
}

export const Sidebar: FC<SidebarProps> = (props) => {
  const { visible } = props
  const [records, setRecords] = useState<Record[]>([])
  const { systemPrompt, setSystemPrompt, sttLanguage, setSttLanguage } =
    useStore()

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

  return (
    <div
      className={`z-10 absolute md:relative h-[calc(100%-120px)] md:h-full w-full md:w-1/3 border border-gray-300 bg-white transition -translate-x-full 
                        ${visible ? 'translate-x-0' : ''}
                        ${visible ? 'md:block' : 'md:hidden'}
                        `}
    >
      <div className="flex flex-col h-full w-full p-4 overflow-y-auto">
        <PickLanguageForm />
        <h2 className="mb-4 text-center">Pick Goat Personality</h2>
        <div className="flex-1 overflow-y-auto">
          {records.length > 0 &&
            records.map((rec) => {
              return (
                <div
                  key={rec.id}
                  className="my-1 text-xs border border-gray-300 rounded-md p-2 cursor-pointer 
                                                        hover:bg-gray-400 hover:text-gray-50"
                  onClick={() => setSystemPrompt(rec.prompt ?? '')}
                >
                  {rec.prompt}
                </div>
              )
            })}
        </div>
        <PromptForm
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
          records={records}
          setRecords={setRecords}
        />
      </div>
    </div>
  )
}
