import Link from 'next/link'
import React from 'react'

export default function Projects() {
  return (
    <div className='flex flex-col gap-3'>
            <span className='small-title'>PROJECTS</span>
            <Link href="/app/new" className='flex justify-center items-center border py-3 text-sm rounded-none font-medium text-zinc-700'>
                Create a new Project
            </Link>
    </div>
  )
}
