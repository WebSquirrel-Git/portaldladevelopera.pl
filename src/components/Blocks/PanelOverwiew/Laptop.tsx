'use client'
import LaptopImage from '@/assets/laptopAnimations/laptop.png'
import DeweloperzyCard from '@/assets/laptopAnimations/zarzadzaj.svg'
import ZgodnoscCard from '@/assets/laptopAnimations/zgodnosc.svg'
import AktualizacjaCard from '@/assets/laptopAnimations/darmowa-aktualizacja.svg'
import DoswiadczenieCard from '@/assets/laptopAnimations/doswiadczenie.svg'
import AutomatyczneRaportyCard from '@/assets/laptopAnimations/automatyczne-raporty.svg'
import InwestycjeCard from '@/assets/laptopAnimations/tworzenie.svg'
import MenuImage from '@/assets/laptopAnimations/Menu.png'
import HeaderImage from '@/assets/laptopAnimations/header.png'
import DeweloperzyBlock from '@/assets/laptopAnimations/przegląd.png'
import AktualizacjeBlock from '@/assets/laptopAnimations/aktualizacje.png'
import InwestycjeBlock from '@/assets/laptopAnimations/inwestycje.png'
import Image from 'next/image'
import { animate, createScope, spring, createDraggable, onScroll } from 'animejs';
import { RefObject, useEffect, useRef, useState } from 'react';

export const Laptop = () =>{
 const root:RefObject<any> = useRef(null);
  const scope:RefObject<any> = useRef(null);
  const [ rotations, setRotations ] = useState(0);

useEffect(() => {
  
    scope.current = createScope({ root }).add( self => {
    
//DEWELOPERZY
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
         //1
      animate('.deweloperzycard', {
      
        autoplay: onScroll({
    container: '.container',
    debug: false,
     onEnter: () => {
    animate('.deweloperzycard', {
      scale: [0, 1],
       opacity:[0,1],
      duration: 700,
      delay:1000
    })
}
  })
      });

//AKTUALIZACJE
//  animate('.aktualizacjeblock', {
      
//         autoplay: onScroll({
//     container: '.container',
//     debug: false,
//      onEnter: () => {
//     animate('.aktualizacjeblock', {
//       scale: [0, 1],
//       opacity:[0,1],
//       duration: 700,
//       delay:1000
//     })
// }
//   })
//       });
      //3
            animate('.aktualizacjecard', {
      
        autoplay: onScroll({
    container: '.container',
    debug: false,
     onEnter: () => {
    animate('.aktualizacjecard', {
      scale: [0, 1],
      opacity:[0,1],
      duration: 700,
      delay:2000
    })
}
  })
      });

      //INWESTYCJE
       animate('.inwestycjeblock', {
      
        autoplay: onScroll({
    container: '.container',
    debug: false,
     onEnter: () => {
    animate('.inwestycjeblock', {
      scale: [0, 1],
      opacity:[0,1],
      duration: 1000,
      delay:6000
    })
}
  })
      });

      animate('.inwestycjecard', {
      
        autoplay: onScroll({
    container: '.container',
    debug: false,
     onEnter: () => {
    animate('.inwestycjecard', {
      scale: [0, 1],
      opacity:[0,1],
      duration: 700,
      delay:7000
    })
}
  })
      });
   
      //2
            animate('.zgodnoscard', {
      
        autoplay: onScroll({
    container: '.container',
    debug: false,
     onEnter: () => {
    animate('.zgodnoscard', {
      scale: [0, 1],
      opacity:[0,1],
      duration: 700,
      delay:3000
    })
}
  })
      });
      

//4
                  animate('.doswiadczeniecard', {
      
        autoplay: onScroll({
    container: '.container',
    debug: false,
     onEnter: () => {
    animate('.doswiadczeniecard', {
      scale: [0, 1],
      opacity:[0,1],
      duration: 700,
      delay:4000
    })
}
  })
      });
//5
                  animate('.raportycard', {
      
        autoplay: onScroll({
    container: '.container',
    debug: false,
     onEnter: () => {
    animate('.raportycard', {
      scale: [0, 1],
      opacity:[0,1],
      duration: 700,
      delay:5000,
      
    })
}
  })
      });
    });
   

//6
            

    // Properly cleanup all anime.js instances declared inside the scope
    return () => scope.current.revert()

  }, []);

    return(
        <div ref={root} className="relative container">
{/* <Image src={MenuImage} alt="Deweloperzy" className="menu scale-0 absolute h-[72%] object-contain object-left top-[1%] left-[18.5%]" />
<Image src={HeaderImage} alt="Deweloperzy" className="header scale-0 absolute w-[56%] object-contain object-top top-[3%] left-[24%]" /> */}
            <Image src={DeweloperzyBlock} alt="Deweloperzy" className="deweloperzyblock scale-0 opacity-0 absolute w-[15%] object-contain object-top top-[13.8%] left-[24.6%]" />
            <Image src={DeweloperzyCard} alt="Deweloperzy" className="deweloperzycard scale-0 opacity-0 absolute w-[255px] top-[16%] left-[9%]" />
            
             {/* <Image src={AktualizacjeBlock} alt="Deweloperzy" className="aktualizacjeblock scale-0 opacity-0 absolute w-[27.5%] object-contain object-top top-[26%] left-[24%]" /> */}
            <Image src={AktualizacjaCard} alt="Deweloperzy" className="aktualizacjecard scale-0 opacity-0 absolute w-[284px] top-[57%] left-[14%]" />

 <Image src={InwestycjeBlock} alt="Deweloperzy" className="inwestycjeblock scale-0 opacity-0 absolute w-[28.7%] object-contain object-top top-[38%] left-[51.1%]" />
 <Image src={InwestycjeCard} alt="Deweloperzy" className="inwestycjecard scale-0 opacity-0  absolute w-[299px] top-[49%] right-[11%]" />

            <Image src={ZgodnoscCard} alt="Deweloperzy" className="zgodnoscard scale-0 opacity-0 absolute w-[213px] top-[49%] left-[12%]" />
            
             <Image src={DoswiadczenieCard} alt="Deweloperzy" className="doswiadczeniecard scale-0 opacity-0  absolute w-[297px] top-[11%] right-[8%]" />
            <Image src={AutomatyczneRaportyCard} alt="Deweloperzy" className="raportycard scale-0 opacity-0  absolute w-[200px] top-[24%] right-[10%]" />
           
           
            <Image src={LaptopImage} alt="Panel dla Dewelopera" className="w-full h-auto" />
        </div>
    )
}