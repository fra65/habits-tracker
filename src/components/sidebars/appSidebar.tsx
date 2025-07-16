"use client"

import * as React from "react"
import {
  Calendar,
  GalleryVerticalEnd,
  History,
  PieChartIcon,
  Settings2,
  Target,
} from "lucide-react"

import { NavMain } from "./navMain"
import { NavUser } from "./navUser"
import { TeamSwitcher } from "./teamSwitcher"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { useSession } from "next-auth/react"
import { SidebarSkeleton } from "../skeletons/sidebarSkeleton"
import { NavSettings } from "./navSettings"

// Dati statici invariati
const data = {
  teams: [
    {
      name: "Habits Flow",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "Today",
      url: "#",
      icon: Calendar,
      isActive: true,
    },
    {
      title: "Habits",
      url: "#",
      icon: Target,
    },
    {
      title: "History",
      url: "#",
      icon: History
    },
    {
      title: "Statistics",
      url: "#",
      icon: PieChartIcon
    }
  ],
  navSettings: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession()

  const user = React.useMemo(() => {
    if (!session?.user) return null
    return {
      name: session.user.name ?? session.user.username ?? "User",
      email: session.user.email ?? "",
      avatar: session.user.image ?? "/avatars/shadcn.jpg",
    }
  }, [session])

  if (status === "loading") {
    return <SidebarSkeleton />
  }

  if (!user) {
    return <>Utente non autenticato</>
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TeamSwitcher teams={data.teams} />
        <SidebarTrigger style={{ cursor: "pointer" }} />
      </SidebarHeader>

      <SidebarContent
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div>
          <NavMain items={data.navMain} />
        </div>
        <div>
          <NavSettings items={data.navSettings} />
        </div>
      </SidebarContent>

      <SidebarFooter
        style={{
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          
        }}
      >
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
