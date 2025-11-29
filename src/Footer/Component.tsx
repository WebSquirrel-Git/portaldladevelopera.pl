import { getCachedGlobal } from '@/utilities/getGlobals'
import { FooterClient } from '@/components/Globals/footer/FooterClient'
import { Footer as FooterType } from '@/payload-types'

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 2)()) as FooterType

  return <FooterClient data={await footerData}/>
}
