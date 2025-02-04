
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import bcrypt from "bcryptjs";

import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";

export async function POST(req: NextRequest) {

  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string
    },
    select: {
      role: true
    }
  })

  if (user?.role !== 'ADMIN') {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }



  try {
    const { name, email, password, birthday, position } = await req.json();

    if (!name || !email || !password || !birthday || !position) {
      return new NextResponse("Faltan campos requeridos", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("El usuario ya existe", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: "USER",
        position,
        password: hashedPassword,
        birthday: new Date(birthday),
      },
    });

    // eliminar la contraseña de la respuesta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}

