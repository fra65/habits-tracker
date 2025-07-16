"use client"

import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { ThemeToggle } from "../button/theme-toggle"

export function NavTheme() {
  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
          <Collapsible
            key="theme"
            asChild
            defaultOpen={true}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  tooltip="Theme"
                  className="cursor-pointer"
                >
                    <span className="ml-3">Theme</span>
                    <ThemeToggle />
                  <ChevronRight className="ml-auto transition-transform duration-200 cursor-pointer" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}
