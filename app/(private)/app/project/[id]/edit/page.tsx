import React from 'react'
import Form from '../../../form'
import { getProject } from '@/services/project'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

  const project = await getProject(id)
  if(!project) return "Couldn't find the project that you are looking for"
  return (
    <div>
        <Form project={project} />
    </div>
  )
}
