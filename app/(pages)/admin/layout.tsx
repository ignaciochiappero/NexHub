// app/admin/layout.tsx
import { getServerSession } from "next-auth/next"
import { config as authOptions } from "@/auth.config"
import prisma from "@/libs/prisma"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/login")
  }

  // Verificar el rol del usuario
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