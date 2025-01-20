// app/api/birthday/route.ts

import { NextResponse } from "next/server"
import { checkAndCreateBirthdayPosts } from "@/utils/birthdayPosts"

export async function GET() {


  try {
    const birthdayPostsCount = await checkAndCreateBirthdayPosts()
    

    
    
    return NextResponse.json({ 
      success: true, 
      message: `Se verificaron las publicaciones de cumpleaños. Se encontraron ${birthdayPostsCount} usuarios.` 
    })


  } catch (error) {
    console.error("Error checking birthday posts:", error)
    return NextResponse.json(
      { error: "Failed to check birthday posts" }, 
      { status: 500 }
    )
  }
}