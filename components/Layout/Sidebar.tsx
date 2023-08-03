'use client'
import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react'
import { Record } from '@/types'
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
        <a
          href="/prompt"
          target="_blank"
          rel="noopener noreferrer"
          className="text-center m-2 mx-auto border py-1 px-2"
        >
          Edit Prompts
        </a>
      </div>
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
