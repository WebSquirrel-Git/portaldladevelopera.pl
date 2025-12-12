import { PriceList } from '@/payload-types';
import { getPayload } from 'payload';
import configPromise from '@payload-config'
import { PricingOverwiew } from '@/components/Blocks/PricingOverwiew/PricingOverwiew';

export type PricingCard = {
    
    orientation: 'vertical' | 'horizontal';
  featured?: boolean | null;
  title: string;
  subheader: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  featuredTag?: string | null;
  monthPricing?: {
    monthMonthPrice: number;
    monthYearPrice: number;
  };
  yearPricing?: {
    yearMonthPrice: number;
    yearYearPriceBlock: {
      yearPrice: number;
      yearPricePromo?: string | null;
    };
  };
  button: {
    label: string;
    url: string;
  };
  limits:any;
  includes:any;
  notContains?:any;
  }

export interface PricingOverwiewBlockPropsType {
  header: any;
  subheader:string;
  cards:PriceList[]
}

function isCard(p: any): p is PriceList {
  return p && typeof p === 'object' && 'id' in p
}

export const PricingOverwiewBlock: React.FC<PricingOverwiewBlockPropsType> = async(props) => {
  const payload = await getPayload({ config: configPromise })
  const cardsIds = props.cards.map((r) => (typeof r === 'string' ? r : r.id))
  const { docs: cards } = await payload.find({
    collection: 'priceList',
    depth: 2,
    select: {
      orientation:true,
      featured:true,
      title:true,
      subheader:true,
      featuredTag:true,
      monthPricing:true,
      yearPricing:true,
      button:true,
      limits:true,
      includes:true,
      notContains:true
    },
    where: {
      id: {
        in: cardsIds,
      },
    },
  })
  const orderedCards: PriceList[] = cardsIds.map((id) => cards.find((p) => p?.id === id)).filter(isCard)
  return <PricingOverwiew header={props.header} subheader={props.subheader} cards={orderedCards}/>
}
