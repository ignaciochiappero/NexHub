

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";

const ONLINE_THRESHOLD = 1 * 60 * 1000; // 1 minuto refresca info

export async function GET() {

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new NextResponse(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        birthday: true,
        location: true,
        company: true,
        role: true,
        position:true,
        createdAt: true,
        lastActive: true,
        achievements: {
          select: {
            id: true,
            completed: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const usersWithOnlineStatus = users.map(user => ({
      ...user,
      isOnline: new Date().getTime() - new Date(user.lastActive).getTime() < ONLINE_THRESHOLD,
      projectCount: user.achievements.length,
    }));

    return NextResponse.json(usersWithOnlineStatus);
  } catch (error) {
    console.error("[USERS_GET_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const { name, email, password, birthday, location, company, image, position  } = await req.json();

    if (!name || !email || !password || !birthday|| !position) {
      return new NextResponse("Faltan campos requeridos", { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: "USER",
        position,
        birthday: new Date(birthday),
        location: location || null,
        company: company || null,
        image: image || null,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_POST_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}