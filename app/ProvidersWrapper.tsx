import React from 'react'
import { Toaster } from "@/components/ui/toaster"
export default function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
        <Toaster />
        {children}
    </React.Fragment>
  )
}
