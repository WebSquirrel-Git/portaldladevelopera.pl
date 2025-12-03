'use client'
import PlusIcon from '@/assets/icons/plus.svg'
import MinusIcon from '@/assets/icons/minus.svg'
import RichText from '@/components/RichText'
import Image from 'next/image'
import styles from './panelFaq.module.scss'
import { motion, AnimatePresence } from 'framer-motion'

interface FaqCardProps {
  id: string
  title: string
  description: {
    root: {
      type: string
      children: {
        type: any
        version: number
        [k: string]: unknown
      }[]
      direction: ('ltr' | 'rtl') | null
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
      indent: number
      version: number
    }
    [k: string]: unknown
  }
  onActiveCard: (id: string) => void
  activeCardId: string
}

export const FaqCard: React.FC<FaqCardProps> = (props) => {
  const { id, title, description, onActiveCard, activeCardId } = props
  const isOpen = activeCardId === id

  return (
    <div className="flex flex-col gap-6 py-4 px-[20px] xl:py-[20px] xl:px-8 bg-darkGrey rounded-2xl w-full">
      <button
        onClick={() => onActiveCard(id)}
        key={id}
        className="px-0 cursor-pointer flex flex-row gap-2 border-0 w-full justify-between items-center bg-darkGrey"
      >
        <p className="text-left">{title}</p>

        {isOpen ? (
          <Image src={MinusIcon} alt="Minus" className="w-6 h-6 m-0" />
        ) : (
          <Image src={PlusIcon} alt="Plus" className="w-6 h-6 m-0" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-2">
              <RichText data={description} className={`${styles.faqRichText} mx-0`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
