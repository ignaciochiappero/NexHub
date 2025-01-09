//components\dashborard\HeaderDashboard.tsx

"use client";

import { useRouter } from "next/navigation";

function HeaderDashboard() {

    const router = useRouter();


  return (
    <div>
      <div className="flex w-screen justify-between px-10 bg-stone-900 p-2">
        <p className="text-3xl">DashboardPage</p>

        {/* TODO: Esto luego va a redirigir a la pantalla de agregar logro o agregar usuario */}
        <button
          onClick={() => router.push("/dashboard/projects/new")}
          className="bg-blue-600 hover:bg-blue-500 transition-all  p-2 rounded-lg"
        >
          Agregar Proyecto
        </button>
      </div>
    </div>
  );
}

export default HeaderDashboard;
