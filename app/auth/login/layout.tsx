// app/admin/layout.tsx
import { getServerSession } from "next-auth/next"
import { config as authOptions } from "@/auth.config"
import { redirect } from "next/navigation"
import { Metadata } from "next";


//METADATA
export const metadata: Metadata = {
  title: "Login | NexHub",
  description: "Login Page",
};



export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect("/")
  }


  return (
    <div>
      
      {children}
    </div>
  )
}