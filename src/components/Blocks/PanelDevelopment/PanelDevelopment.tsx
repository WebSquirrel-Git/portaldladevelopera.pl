'use client'
import { PanelDevelopmentBlockPropsType } from '@/blocks/PanelDevelopmentBlock/Component'
import RichText from '@/components/RichText'
import { useState } from 'react'
import { Icon } from '@iconify/react'

export const PanelDevelopment: React.FC<PanelDevelopmentBlockPropsType> = (props) => {
  const { header, categoriesList } = props
  const [activeCategory, setActiveCategory] = useState(0)
  return (
    <div className="bg-black px-4 py-4 gap-6 xl:gap-[48px] xl:pt-[50px] xl:pb-[180px] flex flex-col xl:px-[274px] justify-center items-center">
      <RichText
        data={header}
        className="richtext-h2-with-gradient !text-white mx-0 text-center max-w-[850px]"
      />
      <div className="flex flex-col gap-2 lg:gap-6 max-w-[560px] 2xl:flex-row w-full 2xl:w-fit border bg-dark border-white/10 border-solid border-b-0 rounded-[31px] p-[10px]">
        {categoriesList.map((category, i) => (
          <button
            onClick={() => setActiveCategory(i)}
            key={i}
            className={`${activeCategory === i ? 'gradient-orange' : 'bg-white/0 text-lightGrey'} cursor-pointer transition-all duration-500 ease-in-out w-full 2xl:w-fit rounded-[30px] py-[10px] px-[20px] xl:py-[12px] text-black text-[14px] font-medium border-0`}
          >
            {category.category.title}
          </button>
        ))}
      </div>
      <div className="flex flex-col 2xl:flex-row gap-[20px] xl:gap-6 w-fit justify-start">
        {categoriesList[activeCategory].category.subcategoriesList.map((subCat, z) => (
          <div
            key={z}
            className={`max-w-[560px] 2xl:max-w-[384px] flex flex-col ${z===0?'gradient-black-brown':'bg-dark/90'} rounded-[20px] border-solid border border-white/10 border-b-0`}
          >
            <div className="flex items-center justify-center py-6 xl:py-8 rounded-[20px]">
              <div className="flex items-center justify-center w-[60px] xl:w-[80px] h-[60px] xl:h-[80px] rounded-full border border-solid border-white/10 gradient-brown">
                <div className="flex items-center justify-center gradient-orange w-10 h-10 rounded-full">
                  <Icon icon={subCat.icon} className="text-black w-4 h-4" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[18px] px-[20px] pb-8 xl:px-8">
              <h3 className="text-white text-center">{subCat.title}</h3>
              <RichText data={subCat.description} className="text-lightGrey text-center" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
