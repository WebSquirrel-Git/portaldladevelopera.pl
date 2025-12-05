'use client'
import { Media } from '@/components/Media';
import { Media as MediaType} from '@/payload-types';
import { animate, createScope, onScroll } from 'animejs';
import { RefObject, useEffect, useRef } from 'react';
import Image00 from '@/assets/howItWorksAnimations/00.svg';
import Image01 from '@/assets/howItWorksAnimations/01.svg';
import Image02 from '@/assets/howItWorksAnimations/02.svg';
import Image03 from '@/assets/howItWorksAnimations/03.svg';
import Image04 from '@/assets/howItWorksAnimations/04.svg';
import Image from 'next/image';


interface CardProps{
  index:number;
  image:MediaType
}

export const Card:React.FC<CardProps> = (props) =>{

const {index,image} = props;

 const root:RefObject<any> = useRef(null);
  const scope:RefObject<any> = useRef(null);

useEffect(() => {
  
    scope.current = createScope({ root }).add( self => {
    
      animate(`.animate${index}`, {
      
        autoplay: onScroll({
    container: '.container',
    debug: false,
     onEnter: () => {
    animate(`.animate${index}`, {
      scale: [0, 1],
       opacity:[0,1],
      duration: 700,
    })
}
  })
      });
    });
   
            

    // Properly cleanup all anime.js instances declared inside the scope
    return () => scope.current.revert()

  }, []);

    return(
        <div ref={root} className='relative container xl:w-fit w-full'>
{index===0&&<Image alt='Łatwe logowanie' src={Image00} className={`animate${index} absolute object-contain opacity-0 scale-0 xl:left-[3%] xl:top-[80%] left-[5%] top-[71%] w-[265px]`}/>}
{index===1&&<Image alt='Łatwe logowanie' src={Image01} className={`animate${index} absolute object-contain opacity-0 scale-0 xl:left-[42%] xl:top-[60%] left-[1%] top-[73%] w-[265px]`}/>}
{index===2&&<Image alt='Łatwe logowanie' src={Image02} className={`animate${index} absolute object-contain opacity-0 scale-0 xl:left-[3%] xl:top-[67%] left-[1%] top-[75%] w-[265px]`}/>}
{index===3&&<Image alt='Łatwe logowanie' src={Image03} className={`animate${index} absolute object-contain opacity-0 scale-0 xl:left-[10%] xl:top-[45%]  left-[10%] top-[4%] w-[265px]`}/>}
{index===4&&<Image alt='Łatwe logowanie' src={Image04} className={`animate${index} absolute object-contain opacity-0 scale-0 xl:left-[10%] xl:top-[81%] left-[1%] top-[84%] w-[265px]`}/>}
                    <Media
                      resource={image}
                      className="xl:max-h-[500px] max-w-[590px] xl:w-fit w-full"
                      imgClassName="object-contain w-full h-full"
                    />
                    </div>
    )
}