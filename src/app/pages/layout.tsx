import { AppSidebar } from "@/components/sidebars/appSidebar"
import TriggerAndTheme from "@/components/sidebars/triggerAndTheme"
import { SidebarProvider } from "@/components/ui/sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>

      <div className="flex h-screen w-screen">

        <AppSidebar />
        <main className="flex-1">
          <TriggerAndTheme />
          {children}
        </main>

      </div>

    </SidebarProvider>
  )
}