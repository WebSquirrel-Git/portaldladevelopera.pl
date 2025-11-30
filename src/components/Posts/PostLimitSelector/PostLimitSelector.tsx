"use client"

import { Icon } from '@iconify/react'
import { useRouter, useSearchParams } from "next/navigation"

export function LimitSelector() {
  const router = useRouter()
  const params = useSearchParams()

  const currentLimit = params.get("limit") ?? "6"

  const handleChange = (value: string) => {
    const newParams = new URLSearchParams(params.toString())

    // ustawia nowy limit
    newParams.set("limit", value)

    // resetuje stronę do 1 przy zmianie limitu
    newParams.delete("page")

    router.replace(`/blog?${newParams.toString()}`, { scroll: false })
  }

  return (
    <div className='sm:flex flex-row gap-4 hidden items-center'>
   <div className="relative">
  <select
    className="appearance-none outline-none focus:outline-none focus:ring-0 cursor-pointer text-grey bg-darkGrey p-3 pr-10 rounded-lg border-none min-w-[140px]"
    value={currentLimit}
    onChange={(e) => handleChange(e.target.value)}
  >
    <option value="1">1 wynik</option>
    <option value="2">2 wyniki</option>
    <option value="3">3 wyniki</option>
    <option value="4">4 wyniki</option>
  </select>
  <Icon icon='majesticons:chevron-down-line' className='text-grey w-[20px] h-[20px] absolute right-3 top-[11px] -translate-y-1/2 pointer-events-none'/>
    </div>
    </div>
  )
}
