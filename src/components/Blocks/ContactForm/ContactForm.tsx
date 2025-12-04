"use client";

import { cx } from "class-variance-authority";
import React, { useState } from "react";

import styles from "./ContactForm.module.scss";
// import { ContactFormProps } from "./ContactForm.types";
// import useForm from "@/hooks/useForm";
import { z } from "zod";
import { SubmitHandler, useForm, useForm as useHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
// import { getErrorMessage } from "./getErrorMessage";
// import Textarea from "@/components/atoms/TextArea";
// import Checkbox from "@/components/atoms/Checkbox";
// import FormInput from "@/components/atoms/FormInput";
import Link from "next/link";
import { Icon } from '@iconify/react';

interface ContactFormProps{
  submitOnEmail:string
}

const schema = z.object({
  name: z.string().min(3,'Minimalna długość wynosi 3 znaki'),
  email: z.email('Nieprawidłowy adres e-mail. Spróbuj ponownie.'),
  privacyPolicy: z.literal(true,'To pole jest wymagane'),
});
type FormFields = z.infer<typeof schema>

const ContactForm: React.FC<ContactFormProps> = (props) => {
  
  const { submitOnEmail } = props;
   const [status, setStatus] = useState('Wyślij wiadomość')
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      name: '',
      email: '',
      privacyPolicy: undefined,
    },
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { name, email, privacyPolicy } = data
    if(privacyPolicy===true){
 try {
      setStatus('Wysyłanie...')
      const res = await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    "Imię i nazwisko": name,
    "Email": email,
  }),
});

      if (!res.ok) {
        setStatus('Błąd wysyłania')
        if (res.status === 401) {
          throw new Error('Wrong login or password')
        }
        throw new Error('Server error, try again later')
      }
      setStatus('Wiadomość wysłana')

      setTimeout(() => {
        setStatus('Wyślij wiadomość')
        reset()
      }, 3000)
      return res.json()
    } catch (error) {
      console.log(error)
      setError('root', {
        message: `${String(error).replace('Error:', '')}`,
      })
    }
    }else{
      setError('privacyPolicy',{
        message:'To pole jest wymagane'
      })
    }
   
  }
//   const { register, handleSubmit,setError,
//     reset, formState: { errors } } = useHookForm({
//        defaultValues: {
//       name: '',
//       email: '',
//       privacyPolicy:false,
//     },
//     resolver: zodResolver(schema),
//   });
//   const {
//     handleFormSubmit,
//     setRecaptchaToken,
//     isUnknownError,
//     isLoading,
//     isDone,
//     recaptchaRef,
//   } = useForm({
//     submitOnEmail,
//     parseBody: (data) =>
//       JSON.stringify({
//         "Imię i nazwisko": data.name,
//         "Email": data.email,
       
//       }),
//     onSubmit: () => {
//       console.log('OnSubmit Formularz')
//     },
//   });
// const onSubmit = handleSubmit(async (data) => {
 
//     try {
//       await handleFormSubmit({
//         name:data.name,
//         email:data.email
//       });
//     } catch (err) {
//       setError("root", {
//         message: "Błąd podczas wysyłania formularza",
//       });
//     }
//   });
  return (
    <div className="bg-black pt-10 px-4 gap-16 flex flex-col pb-0 2xl:pt-[100px] 2xl:pb-[160px] 2xl:px-[274px] justify-center items-center">
      <div className='flex w-full flex-col xl:flex-row gradient-black-brown p-[20px] pb-8 xl:p-10 border border-solid border-white/10 border-b-0 rounded-xl gap-4 xl:gap-8'>
      <div className="gradient-brown flex items-center justify-center xl:w-20 w-12 xl:h-20 h-12 rounded-[14px] border-[1.77px] border-solid border-white/10 border-b-0">
                    <Icon icon='hugeicons:safe' className="xl:flex hidden xl:w-[42px] w-6 xl:h-[42px] h-6 text-primaryOrange" />
                    <Icon icon='quill:inbox-newsletter' className="xl:hidden flex xl:w-[42px] w-6 xl:h-[42px] h-6 text-primaryOrange" />
                  </div>
      <div className='flex flex-col xl:flex-row w-full justify-between gap-8'>
        <div className='flex flex-col gap-4 xl:w-[500px] shrink-0 max-w-[500px]'>
          <h2 ><b className='gradient-orange-text font-normal'>Panel</b> nie jest dostępny</h2>
          <h3 className='text-[20px] leading-[26px] xl:text-[34px] xl:leading-[40px] text-white'>Zapisz się na listę, 
a powiadomimy Cię o dostępności!</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col xl:p-[20px] w-full gap-8'>
          <div className='flex flex-col gap-6'>
          <div className="flex flex-col gap-1 w-full justify-start items-start">
        <div className="group focus-within:border-primaryOrange w-full flex flex-row h-10 px-3 rounded-lg border border-solid border-darkGrey items-center gap-3">
          <Icon icon="iconamoon:profile" width={16} height={16} className="text-grey group-focus-within:text-primaryOrange" />
          <input
            {...register('name')}
            type="text"
            className="w-full border-0 outline-none bg-transparent placeholder-grey focus-within:bg-transparent text-lightGrey font-light text-[16px] leading-[24px]"
            placeholder="Imię i nazwisko*"
          />
        </div>
        {errors.name && <p className="!text-[#ED2B2B] text-[12px] leading-[12px]">{errors.name.message}</p>}
      </div>
      <div className="flex flex-col gap-1 w-full justify-start items-start">
        <div className="group focus-within:border-primaryOrange w-full flex flex-row h-10 px-3 rounded-lg border border-solid border-darkGrey items-center gap-3">
          <Icon icon="formkit:email" width={16} height={16} className="text-grey group-focus-within:text-primaryOrange" />
          <input
            {...register('email')}
            type="text"
            className="w-full border-0 outline-none bg-transparent placeholder-grey text-lightGrey font-light text-[16px] leading-[24px]"
            placeholder="Adres e-mail*"
          />
        </div>
        {errors.email && <p className="!text-[#ED2B2B] text-[12px] leading-[12px]">{errors.email.message}</p>}
      </div>
      </div>
      <div className="flex flex-col gap-1 w-full justify-start items-start">
      <div className='flex flex-row gap-2 items-center'>
        <input type='checkbox' {...register('privacyPolicy')} className='w-[18px] h-[18px] border-solid border rounded-sm'/>
        <p className='text-lightGrey text-[14px] leading-[20px]'>Akceptuję {" "}
          <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/polityka-prywatnosci`} className='text-primaryOrange text-[14px] leading-[20px]'>politykę prywatności</Link> *</p>
      </div>
       {errors.privacyPolicy && <p className="!text-[#ED2B2B] text-[12px] leading-[12px]">{errors.privacyPolicy.message}</p>}
      </div>
      <button type='submit'
      className="transition-all duration:500 hover:bg-gradientOrange text-black rounded-lg box-border bg-primaryOrange border border-yellowStroke border-solid border-l-0 border-b-0 font-medium text-[18px] py-[18px] px-6 cursor-pointer"
     
    >
    {status}
    </button>
        </form>
      </div>
      </div>
      
    </div>
  );
};

export default ContactForm;
