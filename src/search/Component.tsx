'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const router = useRouter()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const limit = params.get('limit')

    params.delete('page')

    if (!debouncedValue) {
      params.delete('q')
    } else {
      params.set('q', debouncedValue)
    }

    const qs = params.toString()

    router.replace(`/blog${qs ? `?${qs}` : ''}`, { scroll: false })
  }, [debouncedValue])

  return (
    <div className="flex flex-col xl:flex-row gap-[20px] w-full justify-between">
      <h3 className="gradient-orange-text">Najnowsze wpisy</h3>

      <form onSubmit={(e) => e.preventDefault()}>
        <Label htmlFor="search" className="sr-only">
          Szukaj
        </Label>

        <div className="sm:w-fit w-full group rounded-lg focus-within:bg-gradientOrange bg-darkGrey flex p-[1px] h-10">
          <div className="sm:w-fit w-full flex rounded-lg flex-row py-2 px-3 gap-3 items-center bg-black">
            <Icon
              icon="ri:search-line"
              className="w-4 h-4 transition-colors group-focus-within:text-red-500 text-grey"
            />

            <Input
              id="search"
              onChange={(event) => setValue(event.target.value)}
              placeholder="Szukaj słów kluczowych"
              className="h-[22px] bg-transparent border-none p-0 sm:w-[308px] w-full text-white text-[14px]"
            />
          </div>
        </div>

        <button type="submit" className="sr-only">
          Potwierdź
        </button>
      </form>
    </div>
  )
}
