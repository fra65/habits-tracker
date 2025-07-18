import { AppSidebar } from "@/components/sidebars/appSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>

      <section className="flex h-screen w-screen">

        <AppSidebar />
        <main className="flex-1">
          {/* <TriggerAndTheme /> */}
          {children}
        </main>

      </section>

    </SidebarProvider>
  )
}