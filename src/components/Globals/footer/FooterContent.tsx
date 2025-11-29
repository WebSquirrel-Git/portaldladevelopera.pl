'use client'
import React from 'react';
import { CMSLink } from '@/components/Link';
import RichText from '@/components/RichText';
import { Page, Post } from '@/payload-types';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/assets/logo/rendpro.png'


interface FooterContentProps{
    id: string;
   title: {
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
     companyNavItems?:
       | {
           link: {
             type?: ('reference' | 'custom') | null;
             newTab?: boolean | null;
             reference?:
               | ({
                   relationTo: 'pages';
                   value: string | Page;
                 } | null)
               | ({
                   relationTo: 'posts';
                   value: string | Post;
                 } | null);
             url?: string | null;
             label: string;
           };
           id?: string | null;
         }[]
       | null;
     regulationsNavItems?:
       | {
           link: {
             type?: ('reference' | 'custom') | null;
             newTab?: boolean | null;
             reference?:
               | ({
                   relationTo: 'pages';
                   value: string | Page;
                 } | null)
               | ({
                   relationTo: 'posts';
                   value: string | Post;
                 } | null);
             url?: string | null;
             label: string;
           };
           id?: string | null;
         }[]
       | null;
     companyInformations: {
       email: string;
       website: {
         label: string;
         url: string;
       };
       facebook?: {
         ikona?: string | null;
         url?: string | null;
       };
       instagram?: {
         ikona?: string | null;
         url?: string | null;
       };
       youtube?: {
         ikona?: string | null;
         url?: string | null;
       };
     };
}

export const FooterContent:React.FC<FooterContentProps> = ({title, companyInformations, companyNavItems, regulationsNavItems})=>{

    return  <div className='flex flex-col w-full gap-8 2xl:gap-[120px]'>
            <div className='flex flex-col 2xl:gap-0 gap-8 2xl:flex-row justify-between w-full'>
                <RichText data={title} className='text-white mx-0'/>
                <div className='flex flex-col sm:gap-1 gap-8 sm:flex-row justify-between w-full'>
                <div className='flex flex-col gap-2 pl-[20px] xl:pl-0 justify-start items-start'>
                    <span className='text-[14px] text-grey'>Firma</span>
                    {companyNavItems?.map((nav)=><CMSLink key={nav.id} {...nav.link} className='text-[16px] text-white'/>)}
                </div>
                <div className='flex flex-col gap-2 pl-[20px] xl:pl-0 justify-start items-start'>
                    <span className='text-[14px] text-grey'>Kontakt</span>
                    <p className='text-[16px] !text-white'>RENDPRO LIMITED</p>
                    <Link className='text-[16px] text-white' href={`mailto:${companyInformations.email?companyInformations.email:""}`}>{companyInformations.email?companyInformations.email:""}</Link>
                    <Link className='text-[16px] text-white' href={companyInformations.website.url?companyInformations.website.url:''}>{companyInformations.website.label?companyInformations.website.label:''}</Link>
                </div>
                 <div className='flex flex-col gap-2 pl-[20px] xl:pl-0 justify-start items-start'>
                    <span className='text-[14px] text-grey'>Firma</span>
                    {regulationsNavItems?.map((nav)=><CMSLink key={nav.id} {...nav.link} className='text-[16px] text-white'/>)}
                </div>
                </div>
            </div>
             <div className='flex 2xl:flex-row 2xl:gap-0 gap-8 flex-col items-start 2xl:items-end xl:items-start xl:justify-between w-full'>
                <div className='flex items-center justify-start flex-row rounded-[20px] gradient-black-brown border border-b-0 border-solid border-white/10 p-3 w-full sm:w-fit gap-[20px]'>
                <div className='flex items-center justify-center w-[74px] h-[74px] bg-white rounded-[10px]'>
                    <Image src={Logo} alt='RendPro' className='w-[66px] h-auto'/>
                </div>
                <p className='text-[18px] leading-[28px] !text-white'>Aplikacja realizowana <br/>przez <b className='gradient-orange-text'>REND.PRO</b></p>
                </div>
                <div className='flex flex-col sm:w-fit w-full xl:flex-row xl:gap-10 gap-3 items-center sm:items-start xl:items-end'>
                    <p className='sm:text-left text-center'><b className='!text-white font-normal'>Copyright © 2025,</b> Panel Dla Dewelopera, Inc.</p>
                <div className='flex flex-row gap-4'>
                   
                   {companyInformations.facebook&&<Link className='w-10 h-10 rounded-[4px] bg-black flex justify-center items-center' href={companyInformations.facebook.url || ''}>
                    <Icon className='text-white w-6 h-6' icon={companyInformations.facebook.ikona||''}/>
                    </Link>} 
                    {companyInformations.instagram&&<Link className='w-10 h-10 rounded-[4px] bg-black flex justify-center items-center' href={companyInformations.instagram.url || ''}>
                    <Icon className='text-white w-6 h-6' icon={companyInformations.instagram.ikona||''}/>
                    </Link>} 
                    {companyInformations.youtube&&<Link className='w-10 h-10 rounded-[4px] bg-black flex justify-center items-center' href={companyInformations.youtube.url || ''}>
                    <Icon className='text-white w-6 h-6' icon={companyInformations.youtube.ikona||''}/>
                    </Link>} 
                </div>
                </div>
             </div>
            </div>
}