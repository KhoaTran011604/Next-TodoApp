"use client"
import { MainProvider } from "context/main"
import { StoreProvider } from "context/store"
import { ThemeProvider } from "context/theme"
import "../../main.css"
import { Navbar } from "@/components/Navbar"
import { useEffect } from "react"
import { AuthProvider, useAuth } from "context/auth"
import { useRouter } from "next/navigation"
import Head from "next/head";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);

  //if (!isAuthenticated) return null; // Hoặc loading...
  return (
    <html lang="en">
      <head>
        <meta name="description" content="Todo APP - NextJs chuẩn SEO" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Todo App - NEXTJS</title>
      </head>
      <body>
        <StoreProvider>
          <ThemeProvider>
            <AuthProvider>
              <MainProvider>
                
                <div>
                  <Navbar/>
                  {children}
                </div>
              </MainProvider>
            </AuthProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}