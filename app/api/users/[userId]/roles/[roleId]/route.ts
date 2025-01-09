// app/api/users/[userId]/roles/[roleId]/route.ts

import prisma from "@/libs/prisma";

export async function POST(req: Request, { params }: { params: { userId: string; roleId: string } }) {
  const userId = parseInt(params.userId);
  const roleId = parseInt(params.roleId);

  try {
    // Verificar si el usuario y el rol existen
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const role = await prisma.role.findUnique({ where: { id: roleId } });

    if (!user || !role) {
      return new Response(JSON.stringify({ error: 'Usuario o rol no encontrado' }), { status: 404 });
    }

    // Asignar el rol al usuario
    const userRole = await prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });

    return new Response(JSON.stringify(userRole), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al asignar el rol al usuario' }), { status: 500 });
  }
}
