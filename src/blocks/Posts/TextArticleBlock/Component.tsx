import RichText from '@/components/RichText'

export interface TextArticleBlockPropsType {
  header: string
  text: any
  navPoint: number
  headerSize: 'h2' | 'h3'
}

export const TextArticleBlock: React.FC<TextArticleBlockPropsType> = (props) => {
  const { header, text, navPoint, headerSize } = props
  return (
    <div
      id={`${navPoint}`}
      className="flex flex-col gap-[18px] xl:gap-[20px] px-3 xl:px-16 py-[18px] xl:py-[20px]"
    >
      {headerSize === 'h2' && <h2 className="text-white text-left">{header}</h2>}
      {headerSize === 'h3' && <h3 className="text-white text-left">{header}</h3>}
      <RichText data={text} className="richtext-text-article mx-0 max-w-full w-full" />
    </div>
  )
}
