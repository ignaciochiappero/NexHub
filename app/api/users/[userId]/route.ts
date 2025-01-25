// app/api/users/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";
import bcrypt from 'bcryptjs';

type RouteContext = {
  params: Promise<{ userId: string }>;
};



// GET: Obtener un usuario específico
export async function GET(
    req: NextRequest,
    context: RouteContext
) {
  try {
    const { userId } = await context.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        birthday: true,
        location: true,
        company: true,
        role: true,
        position: true,
        createdAt: true,
        lastActive: true
      },
    });

    if (!user) {
      return new NextResponse("Usuario no encontrado", { status: 404 });
    }

    // Formatear la fecha antes de enviarla
    const formattedUser = {
      ...user,
      birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : null,
    };

    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error("[USER_GET_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

// PUT: Actualizar un usuario
export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session ) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const { userId } = await context.params;
    const body = await req.json();
    
    // Preparar los datos para la actualización
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      name: body.name || undefined,
      email: body.email || undefined,
      position: body.position || undefined,
      birthday: body.birthday ? new Date(body.birthday) : undefined,
      location: body.location || undefined,
      company: body.company || undefined,
      image: body.image || undefined,
    };

    // Solo actualizar la contraseña si se proporciona una nueva
    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      updateData.password = hashedPassword;
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          birthday: true,
          location: true,
          company: true,
          role: true,
          position: true,
          createdAt: true,
          lastActive: true
        }
      });

      // Formatear la fecha antes de enviarla
      const formattedUser = {
        ...updatedUser,
        birthday: updatedUser.birthday ? new Date(updatedUser.birthday).toISOString().split('T')[0] : null,
      };

      return NextResponse.json(formattedUser);
    } catch (prismaError) {
      console.error("Error de Prisma:", prismaError);
      return new NextResponse("Error al actualizar el usuario en la base de datos", { status: 500 });
    }
  } catch (error) {
    console.error("[USER_UPDATE_ERROR]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}


// DELETE: Eliminar un usuario
export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { userId } = await context.params;

    const userDeleted = await prisma.user.delete({
      where: { id: parseInt(userId) }
    });

    return new NextResponse(JSON.stringify(userDeleted), { status: 200 });
  } catch (error) {
    console.error("[USER_DELETE_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}