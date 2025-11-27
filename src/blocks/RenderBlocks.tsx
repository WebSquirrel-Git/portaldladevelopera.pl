import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { MediaBlock } from './MediaBlock/Component'
import { PanelOverwiewBlock } from './PanelOverwiewBlock/Component'
import { PanelAdvantagesBlock } from './PanelAdvantagesBlock/Component'
import { PanelNeedBlock } from './PanelNeedBlock/Component'
import { PanelPresentationBlock } from './PanelPresentationBlock/Component'
import { PanelPhonesGalleryBlock } from './PanelPhonesGalleryBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  mediaBlock: MediaBlock,
  panelOverwiewBlock:PanelOverwiewBlock,
  panelAdvantagesBlock:PanelAdvantagesBlock,
  panelNeedBlock:PanelNeedBlock,
  panelPresentationBlock:PanelPresentationBlock,
  panelPhonesGalleryBlock:PanelPhonesGalleryBlock
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
                <div className="my-16" key={index}>
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
