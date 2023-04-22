import { Message } from '@/types'
import { IconSend } from '@tabler/icons-react'
import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react'
import ListenButton from './ListenButtonGoogle'

interface Props {
  onSend: (message: Message) => void
}

export const ChatInput: FC<Props> = ({ onSend }) => {
  const [content, setContent] = useState<string>('')

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length > 4000) {
      alert('Message limit is 4000 characters')
      return
    }

    setContent(value)
  }

  const handleSend = () => {
    console.log('handle', content)
    if (!content) {
      textareaRef.current?.classList.add('border-rose-200')
      setTimeout(() => {
        textareaRef.current?.classList.remove('border-rose-200')
      }, 3000)
      return
    }
    onSend({ role: 'user', content })
    setContent('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = 'inherit'
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`
    }
  }, [content])

  return (
    <div className="flex flex-row mb-4">
      <textarea
        ref={textareaRef}
        className="flex-1 min-h-[32px] rounded-lg pl-4 pr-12 py-2 w-full focus:outline-none focus:ring-1 focus:ring-neutral-300 border-2 border-neutral-200"
        style={{ resize: 'none' }}
        placeholder="Type a message..."
        value={content}
        rows={1}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <div className="flex justify-between">
        <ListenButton
          content={content}
          setContent={setContent}
          onSend={onSend}
          handleSend={handleSend}
        />
        <button onClick={() => handleSend()}>
          <IconSend className="m-1 mt-0 w-12 h-12 hover:cursor-pointer rounded-full p-1 bg-blue-500 text-white hover:opacity-80" />
        </button>
      </div>
    </div>
  )
}
