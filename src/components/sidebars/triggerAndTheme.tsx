'use client'

import { ThemeToggle } from "../button/theme-toggle"
import { SidebarTrigger } from "../ui/sidebar"

import React from 'react'

const TriggerAndTheme = () => {
  return (

    <div className="flex gap-0.5 bg-background">
        <SidebarTrigger />
        <ThemeToggle />
    </div>
  )
}

export default TriggerAndTheme