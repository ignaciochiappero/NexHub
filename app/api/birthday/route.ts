
import { NextResponse } from "next/server"
import { checkAndCreateBirthdayPosts } from "@/utils/birthdayPosts"


import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";

export async function GET() {

    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
  


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