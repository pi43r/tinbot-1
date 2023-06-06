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
          <Toggle
            setBool={setisGoogleIn}
            bool={isGoogleIn}
            id="inputSwitch"
            label1="google"
            label2="whisper"
          />
          <InputPicker />
          {!isGoogleIn && <DecibelForm />}
        </div>
        <div className="flex flex-col align-center p-4 overflow-y-auto">
          <h4 className="bold text-center m-4">output</h4>
          <Toggle
            setBool={setisGoogleOut}
            bool={isGoogleOut}
            id="inputSwitch"
            label1="google"
            label2="uberduck"
          />
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
  label1: string
  label2: string
}

const Toggle: FC<ToggleProps> = ({ setBool, bool, id, label1, label2 }) => {
  const commonStyles = `border cursor-pointer outline-none h-full flex-1 p-2 text-md`
  const leftStyles = `${commonStyles} rounded-l-md ${
    bool ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
  }`
  const rightStyles = `${commonStyles} rounded-r-md ${
    !bool ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
  }`

  return (
    <div className="flex items-center border overflow-hidden rounded-md">
      <button className={leftStyles} onClick={() => setBool(true)}>
        {label1}
      </button>
      <button className={rightStyles} onClick={() => setBool(false)}>
        {label2}
      </button>
    </div>
  )
}

const DecibelForm: FC = () => {
  const { minDecibel, setMinDecibel } = useStore()

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    setMinDecibel(value)
    localStorage.setItem('minDecibel', JSON.stringify(value))
  }

  useEffect(() => {
    const storedValue = localStorage.getItem('minDecibel')
    if (storedValue !== null) {
      setMinDecibel(JSON.parse(storedValue))
    }
  }, [])

  return (
    <div>
      <label className="w-full text-gray" htmlFor="decibel-slider">
        min decibel
      </label>
      <span className="ml-4 text-end">[{minDecibel}]</span>
      <input
        className="w-full"
        id="decibel-slider"
        type="range"
        min="-120"
        max="-31"
        step="1"
        value={minDecibel}
        onChange={handleSliderChange}
      />
      <span className="text-xs text-gray-400">refresh page to take effect</span>
    </div>
  )
}
