

//app\(pages)\profile\page.tsx'use client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

  return (
    <div className="mt-40 p-4 font-[family-name:var(--blender-medium)] flex flex-col justify-center items-center">
      <h1 className="text-3xl text-center mb-6">Perfil</h1>
      <div className="w-full max-w-6xl bg-[#212121] rounded-3xl p-6">
        <ProfileForm initialUser={formattedUser} />
      </div>
    </div>
  );
}