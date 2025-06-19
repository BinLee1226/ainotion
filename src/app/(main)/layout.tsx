import { AppSidebar } from "@/components/layout/app-sidebar"
import NavHeader from "@/components/layout/nav-header"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavHeader />
        <main>
          <ScrollArea className="h-[calc(100vh-5rem)]">
            {children}
          </ScrollArea>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
