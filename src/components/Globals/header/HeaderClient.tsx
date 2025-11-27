'use client'
import Link from 'next/link'
// import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import type { Header } from '@/payload-types'
import Logo from '@/assets/logo/logo.svg'
import Image from 'next/image'
import { NavListDesktop } from './NavListDesktop/NavListDesktop'
import { NavListMobile } from './NavListMobile/NavListMobile'
import { Icon } from '@iconify/react'
interface HeaderProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  // const pathname = usePathname() || ''
  const [showMenu, setShowMenu] = useState(false)
  const onShowMenu = () => {
    setShowMenu(true)
  }
  const onHideMenu = () => {
    setShowMenu(false)
  }


  return (
    <header className="w-full flex flex-row box-border justify-between items-center h-fit z-20 py-[14px] 2xl:py-[20px] px-4 2xl:px-[200px] xl:px-[100px] bg-black">
      
        <Link className='flex flex-col xl:flex-row gap-1 xl:gap-5 xl:items-center items-start' href="/">
          <Image src={Logo} alt="Piotr Wilk Meble" className="h-10 w-auto" />
          <span className='gradient-text bg-gradientGreyWhite bg-clip-text text-transparent xl:text-[24px] text-[10px]'>PanelDlaDewelopera.pl</span>
        </Link>
        <NavListDesktop data={data} />
        <div className={`h-8 w-fit flex items-center pl-[1px] bg-grey xl:hidden ${showMenu ? 'hidden' : 'flex'}`}>
  <button
          role="button"
          aria-label="navigate"
          className='cursor-pointer flex box-border w-fit h-8 border-none pl-6 bg-black items-center justify-center '
          onClick={onShowMenu}
        >
          <Icon icon="charm:menu-hamburger" className="w-6 h-6 text-white" />
        </button>
        </div>
      
        <NavListMobile
          data={data}
          onHideMenu={onHideMenu}
          showMenu={showMenu}
        />
    </header>
  )
}
