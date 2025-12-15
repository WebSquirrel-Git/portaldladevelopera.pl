import { PriceList } from '@/payload-types';
import { getPayload } from 'payload';
import configPromise from '@payload-config'
import { PricingTable } from '@/components/Blocks/PricingTable/PricingTable';


export interface PricingTableBlockPropsType {
  infoCard1: any;
  infoCard2:{
    list:any;
    card:any;
  }
  table:PriceList[]
}

function isTable(p: any): p is PriceList {
  return p && typeof p === 'object' && 'id' in p
}

export const PricingTableBlock: React.FC<PricingTableBlockPropsType> = async(props) => {
  const payload = await getPayload({ config: configPromise })
  const tablesIds = props.table.map((r) => (typeof r === 'string' ? r : r.id))
  const { docs: tables } = await payload.find({
    collection: 'priceList',
    depth: 2,
    select: {
      table:true,
      monthPricing:true,
      button:true
    },
    where: {
      id: {
        in: tablesIds,
      },
    },
  })
  const orderedTables: PriceList[] = tablesIds.map((id) => tables.find((p) => p?.id === id)).filter(isTable)
  return <PricingTable infoCard1={props.infoCard1} infoCard2={props.infoCard2} tables={orderedTables}/>
}
