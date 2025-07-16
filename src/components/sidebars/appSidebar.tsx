'use client'

import * as React from "react"
import {
  Calendar,
  GalleryVerticalEnd,
  History,
  Lock,
  PieChartIcon,
  Settings2,
  Target,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { useSession } from "next-auth/react"
import { SidebarSkeleton } from "../skeletons/sidebarSkeleton"
import { NavMain } from "./navMain"
import { NavUser } from "./navUser"
import { TeamSwitcher } from "./teamSwitcher"
import { NavSettings } from "./navSettings"
import { NavAdmin } from "./navAdmin"

const data = {
  teams: [{ name: "Habits Flow", logo: GalleryVerticalEnd, plan: "Enterprise" }],
  navMain: [
    { title: "Today", url: "#", icon: Calendar, isActive: true },
    { title: "Habits", url: "#", icon: Target },
    { title: "History", url: "#", icon: History },
    { title: "Statistics", url: "#", icon: PieChartIcon },
  ],
  navSettings: [{ title: "Settings", url: "#", icon: Settings2 }],
  navAdmin: [{ title: "ADMIN", url: "#", icon: Lock }],
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
    <Sidebar
      collapsible="icon"
      {...props}
      className="relative overflow-visible" // serve per visualizzare trigger fuori dai bordi
    >
      <SidebarHeader className="flex flex-row items-center justify-between pr-0">
        <TeamSwitcher teams={data.teams} />
        {/* Rimosso SidebarTrigger da header */}
      </SidebarHeader>

      <SidebarContent className="flex flex-col justify-between h-full overflow-hidden">
        <div>
          <NavMain items={data.navMain} />
          {session?.user.role === "ADMIN" && <NavAdmin items={data.navAdmin} />}
        </div>

        <div>
          <NavSettings items={data.navSettings} />
        </div>
      </SidebarContent>

      <SidebarFooter className="w-full mx-auto">
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
