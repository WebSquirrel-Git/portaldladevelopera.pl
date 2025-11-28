'use client'
// import { usePathname } from 'next/navigation'
import React from 'react'

import type { Header } from '@/payload-types'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  // const pathname = usePathname()

  return (
    <header className="container relative z-20   ">
      <div className="py-8 flex justify-between">
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
