'use client'
import RichText from '@/components/RichText';
import { PriceList } from '@/payload-types';
import styles from './richtextTable.module.scss'
import { Table } from './Table';
import LockCardIcon from '@/assets/icons/lock-table-card.svg'
import Image from 'next/image';

interface PricingTableType{
infoCard1: any;
  infoCard2:{
    list:any;
    card:any;
  }
  tables:PriceList[]
}

export const PricingTable: React.FC<PricingTableType> = (props) => {
  const { infoCard1,infoCard2,tables} = props;
  return (
    <div className="pt-10 gap-20 px-4 xl:pb-[160px] pb-4 bg-white flex flex-col 2xl:pt-[40px] 2xl:px-[274px] xl:rounded-[64px] rounded-[24px] justify-center items-center">
    <div className='flex rounded-[20px] w-full justify-start items-start p-[20px] border border-solid border-darkGrey'>
<RichText className={`mx-0 ${styles.infoCard1}`} data={infoCard1}/>
    </div>
    <div className='flex flex-col gap-8 justify-center items-center w-full'>
       <div className='flex flex-col gap-3 xl:gap-4 items-center'>
<h2 className='!text-black'>Porównanie planów</h2>
<p className='!text-darkGrey'>Tabelka podsumowująca:</p>
       </div>
      
<Table tables={tables}/>
    </div>
     <div className='flex bg-black flex-col gap-6 xl:gap-10  rounded-[20px] w-full justify-start items-start p-[20px] border border-solid border-darkGrey'>
<div className='flex flex-col xl:flex-row gap-[20px]'>
<Image alt='Zasada bezpieczeństwa danych' src={LockCardIcon} className='w-12 h-12'/>
<RichText className={`mx-0 ${styles.infoCard2}`} data={infoCard2.list}/>
</div>
<div className='flex w-full p-[20px] xl:p-8 border border-solid border-primaryOrange gradient-black-brown rounded-[16px]'>
  <RichText className={`mx-0 ${styles.infoCard3}`} data={infoCard2.card}/>
</div>
    </div>
    </div>
  )
}
