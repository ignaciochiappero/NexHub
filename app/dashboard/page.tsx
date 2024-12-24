
//app\dashboard\page.tsx


"use client";

import { useRouter } from "next/navigation";

function DashboardPage() {

  const router = useRouter();


  return (
    <div className="flex items-center justify-center mt-20 font-[family-name:var(--blender-bold)] ">
      

      <div className="flex w-screen justify-between px-10">

        <p className="text-3xl">
          DashboardPage
        </p>

        {/* TODO: Esto luego va a redirigir a la pantalla de agregar logro o agregar usuario */}
        <button 
        onClick={() => router.push("/dashboard/tasks/new")}
        className="bg-blue-600 hover:bg-blue-500 transition-all  p-2 rounded-lg">
          Agregar Tarea
        </button>
      </div>




    
    </div>
  )
}

export default DashboardPage;