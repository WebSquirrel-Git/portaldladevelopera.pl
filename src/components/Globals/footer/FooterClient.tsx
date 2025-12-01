'use client'
import React from 'react'
import { Footer } from '@/payload-types'
import { FooterContent } from './FooterContent'
interface FooterProps {
  data: Footer
}

export const FooterClient: React.FC<FooterProps> = ({ data }) => {
  return (
    <footer className="flex bg-[url(/background-footer2.png)] bg-bottom bg-cover bg-black px-4 pt-12 pb-20 xl:px-[240px] xl:py-[180px]">
      <FooterContent {...data} />
    </footer>
  )
}
