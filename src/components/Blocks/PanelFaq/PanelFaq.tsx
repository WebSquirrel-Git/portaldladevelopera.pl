'use client'
import { PanelFaqBlockPropsType } from '@/blocks/PanelFaqBlock/Component'
import { useState } from 'react'
import { FaqCard } from './FaqCard'

export const PanelFaq: React.FC<PanelFaqBlockPropsType> = (props) => {
  const { header, subheader, questionsList } = props
  const evenFaqList = questionsList.filter((_, i) => i % 2 === 0)
  const oddFaqList = questionsList.filter((_, i) => i % 2 !== 0)
  const [activeCard, setActiveCard] = useState('999999999')

  const onActiveCard = (id: string) => {
    if (id === activeCard) {
      setActiveCard('999999999')
    } else {
      setActiveCard(id)
    }
  }
  return (
    <div className="bg-black flex flex-col justify-center items-center py-[64px] xl:py-[96px] px-4 xl:px-[274px] gap-8 xl:gap-16">
      <div className="flex flex-col justify-center items-center px-2 gap-4 xl:gap-6">
        <h2 className="text-center text-white">{header}</h2>
        <h3 className="text-center text-[24px] leading-[32px] text-lightGrey">{subheader}</h3>
      </div>
      <div className="flex flex-col gap-3 2xl:flex-row 2xl:gap-8 w-full">
        <div className="flex flex-col 2xl:gap-4 gap-3 w-full">
          {evenFaqList.map((question) => (
            <FaqCard key={question.id} onActiveCard={onActiveCard} activeCardId={activeCard} {...question} />
          ))}
        </div>
        <div className="flex flex-col 2xl:gap-4 gap-3 w-full">
          {oddFaqList.map((question) => (
            <FaqCard key={question.id} onActiveCard={onActiveCard} activeCardId={activeCard} {...question} />
          ))}
        </div>
      </div>
    </div>
  )
}
