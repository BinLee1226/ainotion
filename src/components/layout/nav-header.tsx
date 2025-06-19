"use client"

import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react"
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../ui/button";
import { NavUser } from "./nav-user";
import { navigationData } from "@/lib/navigation";

export default function NavHeader() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 避免水合不匹配
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
      <div className="flex items-center gap-2 px-4 flex-1">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">
                首页
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>xxx</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* 主题切换按钮 */}
      <div className="flex items-center gap-2 px-4">
        {mounted ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div
                    key="moon"
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      duration: 0.1
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Moon className="h-[1.2rem] w-[1.2rem]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      duration: 0.1
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Sun className="h-[1.2rem] w-[1.2rem]" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="sr-only">切换主题</span>
            </Button>
          </motion.div>
        ) : (
          <Button variant="outline" size="icon" className="h-9 w-9">
            <div className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">切换主题</span>
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2 pr-4 ">
        <NavUser user={navigationData.user} />
      </div>
    </header>
  )
}
