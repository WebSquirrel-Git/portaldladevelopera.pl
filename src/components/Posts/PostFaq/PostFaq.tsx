'use client'
import { useState } from 'react'
import { Faq } from '@/payload-types'
import { FaqCard } from '@/components/Blocks/PanelFaq/FaqCard'

interface PostFaqProps {
  questionsList: Faq[]
}

export const PostFaq: React.FC<PostFaqProps> = (props) => {
  const { questionsList } = props
  const [activeCard, setActiveCard] = useState('999999999')

  const onActiveCard = (id: string) => {
    if (id === activeCard) {
      setActiveCard('999999999')
    } else {
      setActiveCard(id)
    }
  }
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      {questionsList.map((question) => (
        <FaqCard
          key={question.id}
          onActiveCard={onActiveCard}
          activeCardId={activeCard}
          {...question}
        />
      ))}
    </div>
  )
}
