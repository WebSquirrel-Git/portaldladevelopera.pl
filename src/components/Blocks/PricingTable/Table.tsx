'use client'

import { LinkButtonSM } from '@/components/ui/LinkButton/LinkButton'
import { PriceList } from '@/payload-types'
import Link from 'next/link'
import LockIcon from '@/assets/icons/lock-table.svg'
import CheckIcon from '@/assets/icons/check-table.svg'
import Image from 'next/image'

export const Table:React.FC<{tables:PriceList[]}> = (props) =>{

    const {tables} = props
  const TABLE_ROWS = [
  { key: 'position1', label: 'Firmy deweloperskie' },
  { key: 'position2', label: 'Inwestycje' },
  { key: 'position3', label: 'Lokale' },
  { key: 'position4', label: 'Użytkownicy' },
  { key: 'position5', label: 'Generowanie XML + MD5 zgodne z UOKiK' },
  { key: 'position6', label: 'Eksport do dane.gov.pl' },
  { key: 'position7', label: 'Historia zmian cen i statusów' },
  { key: 'position8', label: 'Chatbot-AI (pomoc w obsłudze panelu)' },
  { key: 'position9', label: 'AI-asystent danych (opisy, automatyzacja)' },
  { key: 'position10', label: 'Analiza AI rynku (ceny m², trendy)' },
  { key: 'position11', label: 'Biblioteka' },
  { key: 'position12', label: 'Linki / foldery do dysku Google' },
  { key: 'position13', label: 'Integracja ze stroną (API / iframe)' },
  { key: 'position14', label: 'Integracje API (CRM, ERP, CMS)' },
  { key: 'position15', label: 'Priorytet wdrażania zmian przepisów' },
  { key: 'position16', label: 'Priorytetowe wsparcie' },
  { key: 'position17', label: 'Dostęp do roadmapy + wpływ na rozwój' },
] as const
const renderCell = (value: any) => {

  
     if(value==='higherPlans'){
      return 'Dostępne w wyższych planach'
    }
    if(value==='-'){
      return <Image src={LockIcon} width={20} height={20} alt='nie zawiera'/> 
    }
    
  if (typeof value === 'boolean') {
    return value ? <Image src={CheckIcon} width={20} height={20} alt='zawiera'/> : <Image src={LockIcon} width={20} height={20} alt='nie zawiera'/>
  }
 if (typeof value !== 'object' && value === 'contains') {
return <Image src={CheckIcon} width={20} height={20} alt='zawiera'/>
}
  
  if (typeof value === 'object' && value !== null) {
     
      if ('contains' in value && (value.info!=='')&&value.contains===true) return <div className='flex items-center w-full justify-center gap-1'><Image src={CheckIcon} width={20} height={20} alt='zawiera'/> {value.info&&` ${value.info}`}</div>
 if('contains' in value && (value.contains===false)){
      return <Image src={LockIcon} width={20} height={20} alt='nie zawiera'/> 
    }
    if ('contains' in value) return <Image src={CheckIcon} width={20} height={20} alt='zawiera'/>
    if ('info' in value) return value.info
    return <Image src={LockIcon} width={20} height={20} alt='nie zawiera'/>
  }

  return value ?? <Image src={LockIcon} width={20} height={20} alt='nie zawiera'/>
}
    return(
        <div className='overflow-x-auto w-full'>
       <table border={0} cellSpacing={0} cellPadding={0} className='mx-auto w-[1200px] table-fixed border-separate border-spacing-0 overflow-auto'>
 
    <tr className='border border-solid border-lightGrey border-x-0 border-t-0 border-b'>
      <th className='bg-white z-30 left-0 w-[240px] py-[20px] px-3'>
        <p className='!text-black text-left font-medium'>Porównaj plany</p>
        
        <span className='block mt-2 mb-3 text-black w-fit text-left font-medium border border-darkGrey border-solid px-4 py-2.5 rounded-[20px]'>Pakiet roczny -15%</span>
      
      <p className='text-left text-[14px] !text-darkGrey'>Dopasuj abonament do skali Twojego biznesu. Porównaj funkcje we wszystkich pakietach.</p>
      </th>
      {tables.map((plan, index) => (
        <th className='w-[240px] py-[20px] px-3' key={plan.id}>
         {plan.button.label!=="Wybierz Enterprise"&&<>
          <span className='!text-[40px] leading-normal font-bold !text-black'>{plan.monthPricing.monthMonthPrice} zł</span>
          <br/>
          <span>/ miesiąc netto</span>
          </>} 
          {plan.button.label==="Wybierz Enterprise"&&<span className='!text-[24px] leading-normal font-bold !text-black'>Cena <br/> indywidualna</span>}
        
         <Link
      className="mt-6 w-full block transition-all duration:2000 hover:bg-right text-black rounded-lg box-border bg-gradientButton bg-[length:200%_100%] bg-left border border-yellowStroke border-solid border-l-0 border-b-0 font-medium text-[16px] py-[10px] px-6 cursor-pointer"
      href={plan.button.url}
    >
      {plan.button.label}
    </Link>
        </th>
      ))}
    </tr>

    {TABLE_ROWS.map(row => (
      <tr key={row.key}>
        <td className='bg-white z-30 left-0 w-[240px] h-[70px] py-[18px] px-3 text-[14px] leading-[20px] font-medium'>{row.label}</td>

        {tables.map((plan) => (
          <td className='border border-solid border-lightGrey border-x-0 border-t-0 border-b w-[240px] h-[70px] text-center py-[18px] text-[14px] leading-[20px] font-medium' key={plan.id}>
            {renderCell(plan.table?.[row.key])}
          </td>
        ))}
      </tr>
    ))}
</table> 
</div>
    )
}