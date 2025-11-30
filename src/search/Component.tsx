'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter } from 'next/navigation'

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const router = useRouter()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
  if (!debouncedValue) {
      router.replace('/blog', { scroll: false })
      return
    }
  router.replace(`/blog${debouncedValue ? `?q=${debouncedValue}` : ''}`, {
  scroll: false
})
}, [debouncedValue])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          Szukaj
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder="Szukaj"
        />
        <button type="submit" className="sr-only">
          Potwierdź
        </button>
      </form>
    </div>
  )
}
