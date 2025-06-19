import {
  Bookmark,
  BookMarked,
  Frame,
  Github,
  Home,
  PieChart,
  type LucideIcon,
} from "lucide-react"
export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive: boolean
  items?: {
    title: string
    url: string
  }[]
}
export interface NavSecondaryItem {
  title: string
  url: string
  icon: LucideIcon
}
export interface User {
  name: string
  email: string
  avatar: string
}
export interface NavigationData {
  user: User
  navMain: NavItem[]
  navSecondary: NavSecondaryItem[]
  projects: Projects[],
}

export interface Projects {
  name: string
  url: string
  icon: LucideIcon
}

export const navigationData: NavigationData = {
  user: {
    name: "李彬",
    email: "2933812958@qq.com",
    avatar: "/avatar.png",
  },
  navMain: [
    {
      title: "首页",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "我的文档",
      url: "/documents",
      icon: BookMarked,
      isActive: false,
    },
    {
      title: "收藏夹",
      url: "/favorites",
      icon: Bookmark,
      isActive: false,
    },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  navSecondary: [
    {
      title: "GitHub",
      url: "https://github.com/BinLee1226",
      icon: Github,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },

  ],
}