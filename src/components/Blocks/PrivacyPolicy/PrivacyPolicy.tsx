'use client'

import { PrivacyPolicyBlockPropsType } from '@/blocks/PrivacyPolicyBlock/Component'
import RichText from '@/components/RichText'
import { Icon } from '@iconify/react'
import Link from 'next/link'

export const PrivacyPolicy: React.FC<PrivacyPolicyBlockPropsType> = (props) => {
  const { headerSection, content } = props
  return (
    <div className="bg-black pt-[18px] pb-[96px] px-4 xl:pt-16 xl:pb-[120px] 2xl:px-[360px] flex flex-col xl:gap-12 gap-6">
      <div className="flex flex-col gap-[18px] xl:gap-[20px]">
        <div className="flex flex-row gap-0.5 items-center">
          <p className="!text-white text-[14px] font-medium">Blog</p>
          <Icon icon="material-symbols:chevron-right-rounded" className="text-grey" />
          <p className="text-[14px] font-medium gradient-orange-text">Polityka prywatnosci</p>
        </div>
        <RichText
          data={headerSection.headerSection}
          className="richtext-text-article mx-0 max-w-full"
        />
        <div className="flex flex-col gap-3">
          <p className="!text-white text-[16px]">Spis treści</p>
          <div className="flex pl-3 pb-6">
            <div className="flex flex-col pl-4 gap-2 border-solid border-l border-0 border-white/10">
              {headerSection.navMenu.map((navItem, i) => (
                <span key={i} className="text-[14px] text-primaryOrange">
                  {i + 1}.{' '}
                  <Link
                    className="text-[14px] leading-[22px] text-primaryOrange !underline decoration-1"
                    href={`#${i + 1}`}
                  >
                    {navItem.navItem}
                  </Link>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full xl:gap-[20px]">
        {content.map((content, i) => (
          <div
            key={i}
            id={`${content.navPoint}`}
            className="flex flex-col gap-[18px] xl:gap-[20px] py-[18px] xl:py-[20px]"
          >
            {content.headerSize === 'h2' && (
              <h2 className="text-white text-left">{content.header}</h2>
            )}
            {content.headerSize === 'h3' && (
              <h3 className="text-white text-left">{content.header}</h3>
            )}
            <RichText
              data={content.text}
              className="richtext-text-article mx-0 max-w-full w-full"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
