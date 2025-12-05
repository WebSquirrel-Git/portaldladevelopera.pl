'use client'
import LaptopImage from '@/assets/laptopAnimations/laptop.png'
import DeweloperzyCard from '@/assets/laptopAnimations/zarzadzaj.svg'
import ZgodnoscCard from '@/assets/laptopAnimations/zgodnosc.svg'
import AktualizacjaCard from '@/assets/laptopAnimations/darmowa-aktualizacja.svg'
import DoswiadczenieCard from '@/assets/laptopAnimations/doswiadczenie.svg'
import AutomatyczneRaportyCard from '@/assets/laptopAnimations/automatyczne-raporty.svg'
import InwestycjeCard from '@/assets/laptopAnimations/tworzenie.svg'
import DeweloperzyBlock from '@/assets/laptopAnimations/przegląd.png'
import InwestycjeBlock from '@/assets/laptopAnimations/inwestycje.png'
import Image from 'next/image'
import { animate, createScope,  onScroll } from 'animejs';
import { RefObject, useEffect, useRef} from 'react';

export const Laptop = () =>{
 const root:RefObject<any> = useRef(null);
  const scope:RefObject<any> = useRef(null);

useEffect(() => {
  
    scope.current = createScope({ root }).add( self => {
    
//1
 animate('.deweloperzyblock', {
      
        autoplay: onScroll({
    container: '.container',
    debug: false,
     onEnter: () => {
    animate('.deweloperzyblock', {
      scale: [0, 1],
      opacity:[0,1],
      duration: 1000,
    })
}
  })
      });
     animate('.inwestycjeblock', {
      
        autoplay: onScroll({
    container: '.container',
    debug: false,
     onEnter: () => {
    animate('.inwestycjeblock', {
      scale: [0, 1],
      opacity:[0,1],
      duration: 1000,
    })
}
  })
      });

         //2
      animate('.deweloperzycard', {
      
        autoplay: onScroll({
    container: '.container',
    debug: false,
     onEnter: () => {
    animate('.deweloperzycard', {
      scale: [0, 1],
       opacity:[0,1],
      duration: 700,
      delay:1200
    })
}
  })
      });
                 animate('.doswiadczeniecard', {
      
        autoplay: onScroll({
    container: '.container',
    debug: false,
     onEnter: () => {
    animate('.doswiadczeniecard', {
      scale: [0, 1],
      opacity:[0,1],
      duration: 700,
      delay:1200
    })
}
  })
      });
      //3
         animate('.inwestycjecard', {
      
        autoplay: onScroll({
    container: '.container',
    debug: false,
     onEnter: () => {
    animate('.inwestycjecard', {
      scale: [0, 1],
      opacity:[0,1],
      duration: 700,
      delay:2200
    })
}
  })
      });

               animate('.zgodnoscard', {
      
        autoplay: onScroll({
    container: '.container',
    debug: false,
     onEnter: () => {
    animate('.zgodnoscard', {
      scale: [0, 1],
      opacity:[0,1],
      duration: 700,
      delay:2200
    })
}
  })
      });
      //4
            animate('.aktualizacjecard', {
      
        autoplay: onScroll({
    container: '.container',
    debug: false,
     onEnter: () => {
    animate('.aktualizacjecard', {
      scale: [0, 1],
      opacity:[0,1],
      duration: 700,
      delay:3200
    })
}
  })
      });
                  animate('.raportycard', {
      
        autoplay: onScroll({
    container: '.container',
    debug: false,
     onEnter: () => {
    animate('.raportycard', {
      scale: [0, 1],
      opacity:[0,1],
      duration: 700,
      delay:3200,
      
    })
}
  })
      });
    });
   
            

    // Properly cleanup all anime.js instances declared inside the scope
    return () => scope.current.revert()

  }, []);

    return(
        <div ref={root} className="relative container">
            <Image src={DeweloperzyBlock} alt="Zarządzaj Deweloperami" className="deweloperzyblock scale-0 opacity-0 absolute w-[15%] h-fit object-contain object-top top-[13.8%] left-[24.6%]" />
            <Image src={DeweloperzyCard} alt="Zarządzaj Deweloperami" className="deweloperzycard scale-0 opacity-0 absolute w-[107px] sm:w-[178px] xl:w-[255px] top-[5%] sm:top-[16%] left-[9%]" />
            
            
            <Image src={AktualizacjaCard} alt="Darmowa aktualizacja panelu" className="aktualizacjecard scale-0 opacity-0 absolute w-[120px] sm:w-[198px] xl:w-[284px] top-[63%] sm:top-[57%] left-[14%]" />

 <Image src={InwestycjeBlock} alt="Tworzenie inwestycji w 5 minut" className="inwestycjeblock scale-0 opacity-0 absolute w-[28.7%] h-fit object-contain object-top top-[38%] left-[51.1%]" />
 <Image src={InwestycjeCard} alt="Tworzenie inwestycji w 5 minut" className="inwestycjecard scale-0 opacity-0  absolute w-[128px] sm:w-[209px] xl:w-[299px] top-[45%] sm:top-[49%] right-[11%]" />

            <Image src={ZgodnoscCard} alt="100% zgodności z wymogami Ministerstwa Cyfryzacji" className="zgodnoscard scale-0 opacity-0 absolute w-[120px]  sm:w-[150px] xl:w-[213px] top-[30%] sm:top-[36%] xl:top-[42%] left-[12%]" />
            
             <Image src={DoswiadczenieCard} alt="Doświadczenie" className="doswiadczeniecard scale-0 opacity-0  absolute w-[128px] sm:w-[208px] xl:w-[297px] top-[-10%] sm:top-[11%] right-[8%]" />
            <Image src={AutomatyczneRaportyCard} alt="Automatyczne raporty" className="raportycard scale-0 opacity-0  absolute w-[76px] sm:w-[140px] xl:w-[200px] top-[24%] right-[10%]" />
           
           
            <Image src={LaptopImage} alt="Panel dla Dewelopera" className="w-full h-auto" />
        </div>
    )
}