import React from "react"
// import { useSidebar } from "@/components/ui/sidebar"
import DashboardSection from "@/components/sections/dashboardSection"
import { CreateCategoryForm } from "@/modules/category/components/forms/createCategoryForm"

export default function Page() {
  // const { sidebarWidth } = useSidebar()

  return (

    <>

      <DashboardSection />

      <CreateCategoryForm />

    </>
  )
}
