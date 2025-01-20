// utils/birthdayPosts.ts
import prisma from "@/libs/prisma"
import { User } from "@/types/user"
import { NextResponse } from "next/server"

export async function checkAndCreateBirthdayPosts() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  try {
    // First check if we already created system birthday posts for today
    const existingSystemPost = await prisma.post.findFirst({
      where: {
        userId: 1, // System user ID
        systemPost: true,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    if (existingSystemPost) {
      console.log('Ya se crearon los posts de cumpleaños para hoy')
      return NextResponse.json({
        message: "Ya se crearon los posts de cumpleaños para hoy",
        created: false
      })
    }

    // If no posts exist for today, proceed with finding birthday users
    const birthdayUsers = await prisma.$queryRaw`
      SELECT * FROM User 
      WHERE MONTH(birthday) = ${today.getMonth() + 1} 
      AND DAY(birthday) = ${today.getDate()}
    ` as User[]

    console.log(`Se encontraron ${birthdayUsers.length} usuarios que cumplen años hoy.`)

    if (birthdayUsers.length === 0) {
      return NextResponse.json({
        message: "No hay cumpleaños para celebrar hoy",
        created: false
      })
    }

    // Create posts for each birthday user in a single transaction
    await prisma.$transaction(async (tx) => {
      for (const user of birthdayUsers) {
        await tx.post.create({
          data: {
            content: `¡Hoy es el cumpleaños de ${user.name}! 🎉🎂 Toda la comunidad le desea un día maravilloso lleno de alegría y celebraciones.`,
            userId: 1, // System user ID
            systemPost: true
          },
        })
        console.log(`Se creó una publicación de cumpleaños para ${user.name}`)
      }
    })

    return NextResponse.json({
      message: `Se crearon ${birthdayUsers.length} publicaciones de cumpleaños`,
      created: true,
      count: birthdayUsers.length
    })
  } catch (error) {
    console.error("Error al verificar y crear publicaciones de cumpleaños:", error)
    throw error
  }
}