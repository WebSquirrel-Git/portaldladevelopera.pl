'use client'
import { RegulationsBlockPropsType } from '@/blocks/RegulationsBlock/Component'
import RichText from '@/components/RichText'
import { Icon } from '@iconify/react'

export const Regulations: React.FC<RegulationsBlockPropsType> = (props) => {
  const { headerSection, content } = props
  return (
    <div className="bg-black pt-[18px] pb-[96px] px-4 xl:pt-16 xl:pb-[120px] 2xl:px-[360px] flex flex-col xl:gap-12 gap-6">
      <div className="flex flex-col gap-[18px] xl:gap-[20px]">
        <div className="flex flex-row gap-0.5 items-center">
          <p className="!text-white text-[14px] font-medium">Home</p>
          <Icon icon="material-symbols:chevron-right-rounded" className="text-grey" />
          <p className="text-[14px] font-medium gradient-orange-text">Regulamin</p>
        </div>
        <RichText
          data={headerSection.headerSection}
          className="richtext-text-article mx-0 max-w-full pb-[20px] border-solid border-grey border-0 border-b"
        />
      </div>
      <div className="w-full xl:gap-[20px]">
        {content.map((content, i) => (
          <div
            key={i}
            className="pb-[20px] border-solid border-grey border-0 border-b flex flex-col gap-[18px] xl:gap-[20px] py-[18px] xl:py-[20px]"
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
