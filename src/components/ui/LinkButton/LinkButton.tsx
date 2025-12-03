'use client'

import Link from 'next/link'

interface LinkButtonProps {
  url: string
  label: string
}

export const LinkButton: React.FC<LinkButtonProps> = (props) => {
  const { url, label } = props
  return (
    <Link
      className="transition-all duration:500 hover:bg-gradientOrange text-black rounded-lg box-border bg-primaryOrange border border-yellowStroke border-solid border-l-0 border-b-0 font-medium text-[18px] py-[18px] px-6 cursor-pointer"
      href={url}
    >
      {label}
    </Link>
  )
}

export const LinkButtonSM: React.FC<LinkButtonProps> = (props) => {
  const { url, label } = props
  return (
    <Link
      className="transition-all duration:500 hover:bg-gradientOrange text-black rounded-lg box-border bg-primaryOrange border border-yellowStroke border-solid border-l-0 border-b-0 font-medium text-[18px] py-[10px] px-6 cursor-pointer"
      href={url}
    >
      {label}
    </Link>
  )
}
