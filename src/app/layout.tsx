import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import "./globals.css";
import { SessionProvider } from "next-auth/react"
import { auth } from "auth"

import { cn } from "@/lib/utils"
 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  }>) {

  const session = await auth()
  if (session?.user) {
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    }
  }

  return (
    <html lang="en">
      <body 
        className={
          cn("min-h-screen bg-background font-sans antialiased",fontSans.variable)
        }
      >
        <SessionProvider basePath={"/auth"} session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
