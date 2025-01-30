import { getServerSession } from "next-auth/next"
import { config as authOptions } from "@/auth.config"
import prisma from "@/libs/prisma"
import { redirect } from "next/navigation"
import { Metadata } from "next";


//METADATA
export const metadata: Metadata = {
  title: "Admin | NexHub",
  description: "Admin Panel Page",
};


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/login")
  }

  // verificar el rol del usuario
  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email as string
    },
    select: {
      role: true
    }
  })

  if (user?.role !== 'ADMIN') {
    redirect("/unauthorized")
  }

  return (
    <div>
      
      {children}
    </div>
  )
}