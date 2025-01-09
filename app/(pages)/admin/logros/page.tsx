"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Logro {
    id: number;
    title: string;
    description: string;
}

export default function AdminLogrosPage() {
    const [logros, setLogros] = useState<Logro[]>([]);

    // Función para cargar usuarios desde la API
    useEffect(() => {
        const fetchLogros = async () => {
            try {
                const response = await fetch("/api/logros");
                if (!response.ok) throw new Error("Error al obtener los logros");
                const data = await response.json();
                setLogros(data);
            } catch (error) {
                console.error("Error al cargar logros:", error);
            }
        };
        fetchLogros();
    }, []);

    // Función para eliminar un usuario
    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/logros/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar el usuario");

            // Actualiza el estado para eliminar el usuario del frontend
            setLogros((prevLogros) => prevLogros.filter((logro) => logro.id !== id));
            alert("Usuario eliminado correctamente");
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert("Hubo un problema al eliminar el usuario");
        }
    };

    return (

        <div className="mt-20 flex flex-col items-center font-[family-name:var(--blender-bold)]">

            <div className="flex w-screen justify-between px-10 bg-stone-900 p-2 mt-10">

                <p className="text-3xl">Administrar Logros</p>
                
                
                <Link href="/admin/logros/panelLogros">
                
                    <button
                        className="bg-blue-600 hover:bg-blue-500 transition-all p-2 rounded-lg">
                            Agregar Logro
                    </button>
                </Link>
            </div>

        
        
        
        {/* BOTONES PANELES */}
        <div className="flex justify-center gap-8 px-4 mt-20">
          
          
          {/* BOTON 1 */}
          <Link
            href="/admin/logros/panelLogros" 
            className="font-[family-name:var(--blender-medium)] group relative h-64 bg-[#353535] rounded-2xl overflow-hidden transition-all duration-700 ease-out hover:bg-[#454545] hover:scale-105 hover:rotate-1 hover:shadow-[0_0_40px_rgba(236,72,153,0.3)] active:scale-95 active:rotate-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-500/50 rounded-2xl transition-all duration-700 group-hover:scale-105 group-hover:rotate-2" />
            
            <div className="relative h-full flex flex-col items-center justify-center gap-4 p-6">
              
              <span className="text-3xl text-white font-bold tracking-wider group-hover:scale-110 transition-transform duration-500">
                Gestión de Logros
              </span>
              <div className="w-16 h-1 bg-pink-500 transform group-hover:scale-x-150 transition-transform duration-500" />
            </div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
          </Link>



          {/* BOTON 2 */}
          <Link
            href="/admin/logros" 
            className="font-[family-name:var(--blender-medium)] group relative h-64 bg-[#353535] rounded-2xl overflow-hidden transition-all duration-700 ease-out hover:bg-[#454545] hover:scale-105 hover:-rotate-1 hover:shadow-[0_0_40px_rgba(234,179,8,0.3)] active:scale-95 active:rotate-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-500/50 rounded-2xl transition-all duration-700 group-hover:scale-105 group-hover:-rotate-2" />
            <div className="relative h-full flex flex-col items-center justify-center gap-4 p-6">
              <span className="text-3xl text-white font-bold tracking-wider group-hover:scale-110 transition-transform duration-500">
                Gestión de Premios
              </span>
              <div className="w-16 h-1 bg-yellow-500 transform group-hover:scale-x-150 transition-transform duration-500" />
            </div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-yellow-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
          </Link>
        </div>


            {/* LISTA DE LOGROS */}
            <div className="mt-10 flex flex-col min-w-[700px] gap-4 px-10">
                {logros.map((logro) => (
                    <div
                        key={logro.id}
                        className="bg-stone-800 hover:bg-stone-700 transition-all p-5 rounded-lg flex gap-4 justify-between"
                    >
                        <div className="flex flex-col">
                            <p className="text-lg">{logro.title}</p>
                            <p className="text-sm">{logro.description}</p>
                        </div>

                        <button
                            onClick={() => handleDelete(logro.id)}
                            className="bg-red-600 hover:bg-red-500 transition-all p-2 rounded-lg"
                        >
                            Eliminar
                        </button>

                        {/* TODO: CREAR BOTON PARA EDITAR USUARIO */}


                    </div>
                ))}
            </div>
        </div>
    );
}
