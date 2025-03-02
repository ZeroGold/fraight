"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Truck,
  Package,
  User,
  LogOut,
  BarChart,
  Settings,
  Menu,
  Home,
  MessageSquare,
  CreditCard,
  Bell,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: "driver" | "distributor"
}

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const driverLinks = [
    {
      title: "Dashboard",
      href: "/dashboard/driver",
      icon: Home,
    },
    {
      title: "Available Loads",
      href: "/dashboard/driver?tab=available",
      icon: Package,
    },
    {
      title: "My Loads",
      href: "/dashboard/driver?tab=active",
      icon: Truck,
    },
    {
      title: "Earnings",
      href: "/dashboard/driver/earnings",
      icon: CreditCard,
    },
    {
      title: "Messages",
      href: "/dashboard/driver/messages",
      icon: MessageSquare,
    },
    {
      title: "Profile",
      href: "/dashboard/driver/profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/dashboard/driver/settings",
      icon: Settings,
    },
  ]

  const distributorLinks = [
    {
      title: "Dashboard",
      href: "/dashboard/distributor",
      icon: Home,
    },
    {
      title: "Manage Loads",
      href: "/dashboard/distributor?tab=active",
      icon: Package,
    },
    {
      title: "Analytics",
      href: "/dashboard/distributor/analytics",
      icon: BarChart,
    },
    {
      title: "Payments",
      href: "/dashboard/distributor/payments",
      icon: CreditCard,
    },
    {
      title: "Messages",
      href: "/dashboard/distributor/messages",
      icon: MessageSquare,
    },
    {
      title: "Notifications",
      href: "/dashboard/distributor/notifications",
      icon: Bell,
    },
    {
      title: "Settings",
      href: "/dashboard/distributor/settings",
      icon: Settings,
    },
  ]

  const links = userType === "driver" ? driverLinks : distributorLinks

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setOpen(false)}
                  >
                    <Truck className="h-6 w-6" />
                    <span>Fraight</span>
                  </Link>
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                        pathname === link.href ? "bg-muted" : "hover:bg-muted"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.title}
                    </Link>
                  ))}
                  <Link
                    href="/login"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-red-500 hover:bg-muted"
                    onClick={() => setOpen(false)}
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <Truck className="h-6 w-6" />
              <span className="hidden md:inline">Fraight</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            {links.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-medium ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2 p-4">
            <nav className="grid gap-1 text-sm">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                    pathname === link.href ? "bg-muted" : "hover:bg-muted"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.title}
                </Link>
              ))}
            </nav>
            <div className="mt-auto">
              <Link href="/login" className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-500 hover:bg-muted">
                <LogOut className="h-4 w-4" />
                Logout
              </Link>
            </div>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

