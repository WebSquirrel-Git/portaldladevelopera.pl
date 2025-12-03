'use client'
import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import Link from 'next/link'
// import { usePathname } from 'next/navigation'
import { CMSLink } from '@/components/Link'
import { LinkButton, LinkButtonSM } from '@/components/ui/LinkButton/LinkButton'

export const NavListDesktop: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  // const pathname = usePathname() || ''
  return (
    <nav className="xl:flex hidden flex-row items-center gap-6">
      <div className="group hover:bg-gradientOrange hover:pt-0 hover:pr-0 rounded-lg flex box-border p-[1px] h-fit w-fit">
        <Link
          className="group-hover:pt-[13px] group-hover:rounded-tr-sm group-hover:pr-[25px] rounded-lg box-border bg-black !text-white font-medium text-[16px] py-3 px-6 pl-4 cursor-pointer "
          href={process.env.NEXT_PUBLIC_APP_URL as string}
        >
          Home
        </Link>
      </div>

      <span className="w-[1px] bg-lightGrey h-6"></span>
      {navItems.map((item, i) => (
        <div
          key={i}
          className="group hover:bg-gradientOrange hover:pt-0 focus-within:pl-0 hover:pr-0 rounded-lg flex box-border p-[1px] h-fit w-fit"
        >
          <CMSLink
            key={item.id}
            {...item.link}
            className={`group-hover:pt-[13px] group-hover:rounded-tr-sm group-hover:pr-[25px] rounded-lg box-border bg-black !text-white font-medium text-[16px] py-3 pl-4 focus-within:pl-[25px] focus-within:!text-primaryOrange focus-within:rounded-tl-sm px-6 cursor-pointer `}
          />
        </div>
      ))}
      <LinkButtonSM url={`${process.env.NEXT_PUBLIC_APP_URL}`} label="Zaloguj się" />
    </nav>
  )

  // <nav className='lg:flex hidden flex-row gap-4'>
  //      {navItems.map(({ link }, i) => {
  //             return  <Link className={`text-[20px] font-medium ${pathname.includes(link.label.toLowerCase())?'text-accent':'text-black'}`} key={i} href={link.url?link.url:'/'}>{link.label}</Link>
  //           })}
  // </nav>
}
