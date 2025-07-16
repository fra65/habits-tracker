"use client"

import * as React from "react"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import Link from "next/link"
// import { GalleryVerticalEnd } from "lucide-react" // importa il logo di default, serviva solo come esempio

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const activeTeam = teams[0]

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>


      <SidebarMenuItem>
          {/* Solo label statica senza dropdown */}

        <Link href='/pages/dashboard' className="cursor-pointer">

          <SidebarMenuButton
            size="lg"
            className=""
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <activeTeam.logo className="size-4" />
            </div>
              <span className="truncate font-semibold">{activeTeam.name}</span>
              {/* <span className="truncate text-xs">{activeTeam.plan}</span> */}
          </SidebarMenuButton>

        </Link>

      </SidebarMenuItem>

    </SidebarMenu>
  )
}
