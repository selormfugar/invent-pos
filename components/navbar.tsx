"use client"

import type React from "react"

import Link from "next/navigation"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { usePOS } from "@/context/pos-context"

export default function Navbar() {
  const pathname = usePathname()
  const { isOnline, offlineOrders } = usePOS()

  return (
    <nav className="bg-slate-800 text-white">
      <div className="container mx-auto flex items-center h-12">
        <div className="text-lg font-bold mr-8">BusinessPOS</div>
        <div className="flex-1 flex">
          <NavLink href="/checkout" active={pathname === "/checkout"}>
            Checkout
          </NavLink>
          <NavLink href="/inventory" active={pathname.startsWith("/inventory")}>
            Inventory
          </NavLink>
          <NavLink href="/reports" active={pathname.startsWith("/reports")}>
            Reports
          </NavLink>
        </div>
        <div
          className={cn("px-4 py-1 rounded text-white text-sm font-medium", isOnline ? "bg-green-500" : "bg-red-500")}
        >
          {isOnline ? "Online" : "Offline"}
          {!isOnline && offlineOrders.length > 0 && <span className="ml-1">({offlineOrders.length})</span>}
        </div>
      </div>
    </nav>
  )
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link href={href} className={cn("px-6 py-3 font-medium", active ? "bg-slate-700" : "hover:bg-slate-700")}>
      {children}
    </Link>
  )
}

