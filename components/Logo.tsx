import Image from 'next/image'
import React from 'react'

export default function Logo({ small = false }: { small?: boolean }) {
  const size = small ? 40 : 80
  return (
    <div className='flex items-center gap-1.5'>
    <Image src={'/logo.png'} width={size} height={size} alt='Logo' />
    <span className='font-semibold text-2xl capitalize text-zinc-800'>Mira</span>
    </div>
)
}
