"use client"
import { CompleteProject } from '@/types/project'
import React, { createContext, useContext } from 'react'

type Props = { project: CompleteProject, children: React.ReactNode }
export default function ProvidersWrapper({ project, children }: Props) {
  return (
    <ProjectContext.Provider value={{ project }}>
        {children}
    </ProjectContext.Provider>
  )
}

type ProjectContext = { project: CompleteProject }
export const ProjectContext = createContext({} as ProjectContext) 
export function useProjectContext() {
  return useContext(ProjectContext)
}