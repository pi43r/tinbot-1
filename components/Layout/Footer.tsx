import { FC } from 'react'

export const Footer: FC = () => {
  return (
    <div className="flex flex-col border-t border-neutral-300 items-center sm:justify-between justify-center">
      <span className="text-sm">mode</span>
      <div className="w-full flex justify-evenly text-xs p-1">
        <div className="border p-1 rounded">nothing</div>
        <div className="border p-1 rounded bg-green-200">dialogue</div>
        <div className="border p-1 rounded">questions</div>
        <div className="border p-1 rounded">singing</div>
        <div className="border p-1 rounded">abstract</div>
        <div className="border p-1 rounded">dada</div>
        <div className="border p-1 rounded">no-net</div>
      </div>
    </div>
  )
}
