import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { POSProvider } from "@/context/pos-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BusinessPOS",
  description: "Point of Sale System",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <POSProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 p-4">{children}</main>
              <footer className="p-2 bg-background border-t">
                <div className="container flex justify-end">
                  <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-1 rounded-full text-sm">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    All data synced
                  </div>
                </div>
              </footer>
            </div>
          </POSProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'