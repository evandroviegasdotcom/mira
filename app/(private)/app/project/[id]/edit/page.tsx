import React from 'react'
import Form from '../../../form'
import { getProject } from '@/services/project'

export default async function Page({ params: { id } }: { params: { id: string } }) {
    const project = await getProject(id)
    if(!project) return "Couldn't find the project that you are looking for"
  return (
    <div>
        <Form project={project} />
    </div>
  )
}
