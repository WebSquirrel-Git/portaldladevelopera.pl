'use client'
import LaptopImage from '@/assets/laptopAnimations/laptop-circlebg.png'
import DeweloperzyCard from '@/assets/laptopAnimations/zarzadzaj.svg'
import ZgodnoscCard from '@/assets/laptopAnimations/zgodnosc.svg'
import AktualizacjaCard from '@/assets/laptopAnimations/darmowa-aktualizacja.svg'
import DoswiadczenieCard from '@/assets/laptopAnimations/doswiadczenie.svg'
import AutomatyczneRaportyCard from '@/assets/laptopAnimations/automatyczne-raporty.svg'
import TworzenieInwestycjiCard from '@/assets/laptopAnimations/tworzenie.svg'
import MenuImage from '@/assets/laptopAnimations/Menu.png'
import HeaderImage from '@/assets/laptopAnimations/header.png'
import Image from 'next/image'
import { animate, createScope, spring, createDraggable, onScroll } from 'animejs';
import { RefObject, useEffect, useRef, useState } from 'react';

export const Laptop = () =>{
 const root:RefObject<any> = useRef(null);
  const scope:RefObject<any> = useRef(null);
  const [ rotations, setRotations ] = useState(0);

useEffect(() => {
  
    scope.current = createScope({ root }).add( self => {
    
// //header
//  animate('.header', {
      
//         autoplay: onScroll({
//     container: '.container',
//     debug: true,
//      onEnter: () => {
//     animate('.header', {
//       scaleY: [0, 1],
//       duration: 500,
//     })
// }
//   })
//       });
// //menu
//  animate('.menu', {
      
//         autoplay: onScroll({
//     container: '.container',
//     debug: true,
//      onEnter: () => {
//     animate('.menu', {
//       scaleX: [0, 1],
//       duration: 500,
//       delay:500
//     })
// }
//   })
//       });

      //1
      animate('.deweloperzy', {
      
        autoplay: onScroll({
    container: '.container',
    debug: true,
     onEnter: () => {
    animate('.deweloperzy', {
      scale: [0, 1],
      duration: 700,
    })
}
  })
      });
      //2
            animate('.zgodnosc', {
      
        autoplay: onScroll({
    container: '.container',
    debug: true,
     onEnter: () => {
    animate('.zgodnosc', {
      scale: [0, 1],
      duration: 700,
      delay:600
    })
}
  })
      });
      
//3
            animate('.aktualizacja', {
      
        autoplay: onScroll({
    container: '.container',
    debug: true,
     onEnter: () => {
    animate('.aktualizacja', {
      scale: [0, 1],
      duration: 700,
      delay:1200
    })
}
  })
      });
//4
                  animate('.doswiadczenie', {
      
        autoplay: onScroll({
    container: '.container',
    debug: true,
     onEnter: () => {
    animate('.doswiadczenie', {
      scale: [0, 1],
      duration: 700,
      delay:300
    })
}
  })
      });
//5
                  animate('.raporty', {
      
        autoplay: onScroll({
    container: '.container',
    debug: true,
     onEnter: () => {
    animate('.raporty', {
      scale: [0, 1],
      duration: 700,
      delay:900
    })
}
  })
      });
//6
                  animate('.inwestycje', {
      
        autoplay: onScroll({
    container: '.container',
    debug: true,
     onEnter: () => {
    animate('.inwestycje', {
      scale: [0, 1],
      duration: 700,
      delay:1500
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
<Image src={MenuImage} alt="Deweloperzy" className="menu scale-0 absolute h-[72%] object-contain object-left top-[1%] left-[18.5%]" />
<Image src={HeaderImage} alt="Deweloperzy" className="header scale-0 absolute w-[56%] object-contain object-top top-[3%] left-[24%]" />
            <Image src={DeweloperzyCard} alt="Deweloperzy" className="deweloperzy scale-0 absolute w-[211px] top-[16%] left-[9%]" />
            <Image src={ZgodnoscCard} alt="Deweloperzy" className="zgodnosc scale-0 absolute w-[168px] top-[49%] left-[12%]" />
            <Image src={AktualizacjaCard} alt="Deweloperzy" className="aktualizacja scale-0 absolute w-[238px] top-[57%] left-[14%]" />
             <Image src={DoswiadczenieCard} alt="Deweloperzy" className="doswiadczenie absolute w-[238px] top-[11%] right-[8%]" />
            <Image src={AutomatyczneRaportyCard} alt="Deweloperzy" className="raporty absolute w-[162px] top-[24%] right-[10%]" />
            <Image src={TworzenieInwestycjiCard} alt="Deweloperzy" className="inwestycje absolute w-[248px] top-[49%] right-[11%]" />
           
            <Image src={LaptopImage} alt="Panel dla Dewelopera" className="w-full h-auto" />
        </div>
    )
}