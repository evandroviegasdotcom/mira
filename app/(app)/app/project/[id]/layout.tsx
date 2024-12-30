import React from 'react'
import Navbar from './navbar'
import { getProject } from '@/services/project'

export default async function Layout({ children, params: { id } }: { children: React.ReactNode, params: { id: string } }) {
  const project = await getProject(id)
  if(!project) return null
  return (
    <div className='flex flex-col gap-7'>
      <Navbar project={project} />
      <div>
      {children}
      </div>
    </div>
  )
}
