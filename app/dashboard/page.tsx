import HeaderDashboard from "@/components/dashborard/HeaderDashboard";

import prisma from "@/libs/prisma";

import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";

async function loadProjects() {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error("No estas logueado");

  return await prisma.project.findMany({
    where: {
      userId: parseInt(session.user.id),
    },
  });
}

async function DashboardPage() {
  const projects = await loadProjects();

  console.log(projects);

  return (
    <div className="flex flex-col items-center justify-center mt-20 font-[family-name:var(--blender-bold)] ">
      <HeaderDashboard />

      <div className="mt-10 p-4 grid grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-stone-800 hover:bg-stone-700 transition-all p-5 rounded-lg flex flex-col"
          >
            <span className="text-lg">{project.title}</span>

            <span
              className="mt-2 text-sm text-stone-400
              "
            >
              {project.description}
            </span>

            <span
              className="mt-2 text-xs text-stone-400
              "
            >
              Creado por usuario: {project.userId}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
