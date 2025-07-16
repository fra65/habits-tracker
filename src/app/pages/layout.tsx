import { AppSidebar } from "@/components/sidebars/appSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>

      <div className="flex h-screen w-screen">

        <AppSidebar />
        <main className="flex-1">
          {children}
        </main>

      </div>

    </SidebarProvider>
  )
}