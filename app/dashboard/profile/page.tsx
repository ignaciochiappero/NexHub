

//app\(pages)\profile\page.tsx'use client';



import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";
import prisma from "@/libs/prisma";
import ProfileForm from "./ProfileForm";

import { redirect } from "next/navigation";

async function loadData() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
     redirect("/auth/login");
  }
  

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(session.user.id)
    }
  });
  
  return user;
}

export default async function ProfilePage() {
  const user = await loadData();
  
  if (!user) {
    return <div>Usuario no encontrado</div>;
  }

  // Format the date adjusting for Argentina timezone
  const date = new Date(user.birthday);
const formattedUser = {
  ...user,
  birthday: new Date(date.getTime() + (date.getTimezoneOffset() * 60000))
};

// No modificamos mucho este archivo ya que es un componente servidor
return (
  <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] pt-20 p-6">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500  text-center font-[family-name:var(--blender-bold)] tracking-wider pb-10">
        Perfil de Usuario
      </h1>
      <div className="w-full bg-[#242424] rounded-2xl p-8 shadow-2xl">
        <ProfileForm initialUser={formattedUser} />
      </div>
    </div>
  </div>
);
}