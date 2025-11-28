'use client'
import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import Link from 'next/link'
// import { usePathname } from 'next/navigation'
import { CMSLink } from '@/components/Link'

export const NavListDesktop: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  // const pathname = usePathname() || ''
  return (
    <nav className="xl:flex hidden flex-row items-center gap-6">
      <div className="hover:bg-gradientOrange transition-all duration-500 rounded-lg flex box-border p-[1px] h-fit w-fit">
        <Link
          className="rounded-lg box-border bg-black !text-white font-medium text-[16px] py-3 px-6 cursor-pointer "
          href={process.env.NEXT_PUBLIC_APP_URL as string}
        >
          Home
        </Link>
      </div>

      <span className="w-[1px] bg-lightGrey h-6"></span>
      {navItems.map((item, i) => (
        <div
          key={i}
          className="hover:bg-gradientOrange transition-all duration-500 rounded-lg flex box-border p-[1px] h-fit w-fit"
        >
          <CMSLink
            key={item.id}
            {...item.link}
            className={`rounded-lg box-border bg-black !text-white font-medium text-[16px] py-3 px-6 cursor-pointer `}
          />
        </div>
      ))}
      <Link
        href={`${process.env.NEXT_PUBLIC_APP_URL}`}
        className="text-black rounded-lg box-border bg-primaryOrange border-[1px] border-primaryOrange font-medium text-[16px] py-3 px-6 cursor-pointer"
      >
        Zaloguj się
      </Link>
    </nav>
  )

  // <nav className='lg:flex hidden flex-row gap-4'>
  //      {navItems.map(({ link }, i) => {
  //             return  <Link className={`text-[20px] font-medium ${pathname.includes(link.label.toLowerCase())?'text-accent':'text-black'}`} key={i} href={link.url?link.url:'/'}>{link.label}</Link>
  //           })}
  // </nav>
}
