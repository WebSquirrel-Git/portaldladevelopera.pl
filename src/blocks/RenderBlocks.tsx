import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { MediaBlock } from './MediaBlock/Component'
import { PanelOverwiewBlock } from './PanelOverwiewBlock/Component'
import { PanelAdvantagesBlock } from './PanelAdvantagesBlock/Component'
import { PanelNeedBlock } from './PanelNeedBlock/Component'
import { PanelPresentationBlock } from './PanelPresentationBlock/Component'
import { PanelPhonesGalleryBlock } from './PanelPhonesGalleryBlock/Component'
import { PanelDevelopmentBlock } from './PanelDevelopmentBlock/Component'
import { PanelFaqBlock } from './PanelFaqBlock/Component'
import { TextArticleBlock } from './Posts/TextArticleBlock/Component'
import { PrivacyPolicyBlock } from './PrivacyPolicyBlock/Component'
import { RegulationsBlock } from './RegulationsBlock/Component'
import { ContactFormBlock } from './ContactFormBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  mediaBlock: MediaBlock,
  panelOverwiewBlock: PanelOverwiewBlock,
  panelAdvantagesBlock: PanelAdvantagesBlock,
  panelNeedBlock: PanelNeedBlock,
  panelPresentationBlock: PanelPresentationBlock,
  panelPhonesGalleryBlock: PanelPhonesGalleryBlock,
  panelDevelopmentBlock: PanelDevelopmentBlock,
  panelFaqBlock: PanelFaqBlock,
  textBlock: TextArticleBlock,
  privacyPolicyBlock: PrivacyPolicyBlock,
  regulationsBlock: RegulationsBlock,
  contactFormBlock:ContactFormBlock
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
