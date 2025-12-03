import React from 'react'
// import { TextArticleBlock } from './TextArticleBlock/Component'
// import type { Post } from '@/payload-types'
// import { TableArticleBlock } from './TableArticleBlock/Component'
// import { FaqArticleBlock } from './FaqArticleBlock/Component'

// const postBlockComponents = {
//   textArticleBlock: TextArticleBlock,
//   tableArticleBlock: TableArticleBlock,
//   faqArticleBlock: FaqArticleBlock,
// }

export const RenderPostBlocks: React.FC<{
  // blocks: Post['content'][0][]
}> = () => {
  // const { blocks } = props

  // const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0
  // if (hasBlocks) {
  //   return (
  //     <Fragment>
  //       {blocks.map((block, index) => {
  //         const { blockType } = block

  //         if (blockType && blockType in postBlockComponents) {
  //           const Block = postBlockComponents[blockType]

  //           if (Block) {
  //             return (
  //               <div key={index}>
  //                 {/* @ts-expect-error there may be some mismatch between the expected types here */}
  //                 <Block {...block} disableInnerContainer />
  //               </div>
  //             )
  //           }
  //         }
  //         return null
  //       })}
  //     </Fragment>
  //   )
  // }
  return null
}
