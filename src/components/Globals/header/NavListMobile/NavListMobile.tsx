'use client'
import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/assets/logo/logo.svg'
// import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import { motion } from 'motion/react'
import { CMSLink } from '@/components/Link'
interface NavListMobilePropsType {
  data: HeaderType
  showMenu: boolean
  onHideMenu: () => void
}

export const NavListMobile: React.FC<NavListMobilePropsType> = ({ data, showMenu, onHideMenu }) => {
  const navItems = data?.navItems || []
  // const pathname = usePathname() || ''

  if (!showMenu) return null

  return (
    <motion.div
      initial={{ height: '0px', opacity: 0 }}
      animate={{ height: '100vh', opacity: 1 }}
      exit={{ height: '0px', opacity: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed flex flex-col w-full top-0 left-0 p-4 pt-[14px] bg-black h-screen"
    >
      <div className="flex flex-row justify-between items-center w-full">
        <Link className="flex flex-col gap-1 items-start" href="/">
          <Image src={Logo} alt="Panel dla Developera" className="h-10 w-auto" />
          <span className="gradient-text bg-gradientGreyWhite bg-clip-text text-transparent text-[10px]">
            PanelDlaDewelopera.pl
          </span>
        </Link>
        <div
          className={`h-8 w-fit flex items-center pl-[1px] bg-grey xl:hidden ${showMenu ? 'flex' : 'hidden'}`}
        >
          <button
            role="button"
            aria-label="close"
            className="cursor-pointer flex box-border w-fit h-8 border-none pl-6 bg-black items-center justify-center "
            onClick={onHideMenu}
          >
            <Icon icon="line-md:close" className="w-6 h-6 text-primaryOrange" />
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full justify-end items-end">
        <div className="flex flex-col w-fit justify-start items-start pr-6">
          {navItems.map((navItem) => (
            <CMSLink
              key={navItem.id}
              {...navItem.link}
              className=" pr-9 py-8 text-left w-fit text-white min-w-[206px] font-medium text-[16px]"
            />
          ))}
          <Link
            className=" pr-9 py-8 text-left w-fit text-white min-w-[206px] font-medium text-[16px]"
            href={process.env.NEXT_PUBLIC_APP_URL as string}
          >
            Kontakt
          </Link>
          <Link
            href={`${process.env.NEXT_PUBLIC_APP_URL}`}
            className="w-full text-center text-black rounded-lg box-border bg-primaryOrange border-[1px] border-primaryOrange font-medium text-[16px] py-3 px-6 cursor-pointer"
          >
            Zaloguj się
          </Link>
          <div className="flex flex-row justify-start items-center gap-4 pr-9 py-8">
            <Link href="/" className="w-10 h-10 flex items-center justify-center">
              <Icon icon="ph:facebook-logo-fill" className="w-6 h-6 text-white" />
            </Link>
            <Link href="/" className="w-10 h-10 flex items-center justify-center">
              <Icon icon="ph:instagram-logo" className="w-6 h-6 text-white" />
            </Link>
          </div>
          <span className="flex pr-9 py-8 text-white text-[12px] leading-[20px]">
            Copyright © 2025,
            <br />
            Panel dla Dewelopera, Inc.
          </span>
        </div>
      </div>
    </motion.div>
  )
}
