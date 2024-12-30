"use client";

import { useEffect, useState } from "react";

interface Logro {
    id: number;
    title: string;
    description: string;
}

export default function LogrosList() {
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


            {/* LISTA DE LOGROS */}
            <div className="mt-10 flex flex-col gap-4 px-10 min-w-[700px]">
                
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


