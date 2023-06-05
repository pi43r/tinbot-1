'use client'
import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react'
import { Record } from '@/types'
import { getRecords } from '@/utils/pb'
import { PromptForm } from '../Sidebar/PromptForm'
import { InputPicker, OutputPicker } from '../Sidebar/PickLanguageForm'
import { useStore } from '@/utils/store'
import dynamic from 'next/dynamic'

interface SidebarProps {
  visible: boolean
}

export const Sidebar: FC<SidebarProps> = (props) => {
  const { visible } = props
  const [records, setRecords] = useState<Record[]>([])
  const { isGoogleIn, setisGoogleIn, isGoogleOut, setisGoogleOut } = useStore()

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

    // retrieve the saved state of isGoogleIn from local storage, if any
    const savedStateIn = localStorage.getItem('isGoogleIn')
    if (savedStateIn !== null) {
      setisGoogleIn(JSON.parse(savedStateIn))
    }

    // retrieve the saved state of isGoogleOut from local storage, if any
    const savedStateOut = localStorage.getItem('isGoogleOut')
    if (savedStateOut !== null) {
      setisGoogleOut(JSON.parse(savedStateOut))
    }

    fetchData()
  }, [])

  // save the state of isGoogleIn and isGoogleOut to local storage when the checkbox is clicked
  useEffect(() => {
    localStorage.setItem('isGoogleIn', JSON.stringify(isGoogleIn))
  }, [isGoogleIn])

  useEffect(() => {
    localStorage.setItem('isGoogleOut', JSON.stringify(isGoogleOut))
  }, [isGoogleOut])
  return (
    <div
      className={`z-10 absolute md:relative h-full w-full md:w-1/3 md:min-w-[300px] border border-gray-300 bg-white transition -translate-x-full 
                        ${visible ? 'translate-x-0' : ''}
                        ${visible ? 'md:block' : 'md:hidden'}
                        `}
    >
      <div className="w-full grid grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="flex flex-col align-center p-4 overflow-y-auto">
          <h4 className="bold text-center m-4">input</h4>
          <Toggle setBool={setisGoogleIn} bool={isGoogleIn} id="inputSwitch">
            {isGoogleIn ? 'use whisper' : 'use google'}
          </Toggle>
          <InputPicker />
          {!isGoogleIn && <DecibelForm />}
        </div>
        <div className="flex flex-col align-center p-4 overflow-y-auto">
          <h4 className="bold text-center m-4">output</h4>
          <Toggle setBool={setisGoogleOut} bool={isGoogleOut} id="inputSwitch">
            {isGoogleOut ? 'use uberduck' : 'use google'}
          </Toggle>
          <OutputPicker />
        </div>
      </div>
      {/* <h2 className="mb-4 text-center">Pick Goat Personality</h2>
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
        /> */}
    </div>
  )
}

interface ToggleProps {
  setBool: (bool: boolean) => void
  bool: boolean
  id: string
  children: string
}

const Toggle: FC<ToggleProps> = ({ setBool, bool, id, children }) => {
  return (
    <div className="flex mx-auto items-center">
      <input type="checkbox" className="hidden" checked={bool} readOnly />
      <label
        htmlFor="useGoogle"
        className={`border rounded-lg p-1 cursor-pointer ${
          bool ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
        onClick={() => setBool(!bool)}
      >
        {children}
      </label>
    </div>
  )
}

const DecibelForm: FC = () => {
  const { minDecibel, setMinDecibel } = useStore()

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinDecibel(Number(event.target.value))
  }

  return (
    <div>
      <label className="text-gray" htmlFor="decibel-slider">
        min decibel
      </label>
      <input
        className="w-full"
        id="decibel-slider"
        type="range"
        min="-120"
        max="0"
        step="1"
        value={minDecibel}
        onChange={handleSliderChange}
      />
      {minDecibel}
    </div>
  )
}
