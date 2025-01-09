"use client";

import { useEffect, useState } from "react";

interface Premio {
    id: number;
    titulo: string;
    descripcion: string;
}

export default function PremiosList() {
    const [premios, setPremios] = useState<Premio[]>([]);

    // Función para cargar usuarios desde la API
    useEffect(() => {
        const fetchPremios = async () => {
            try {
                const response = await fetch("/api/premios");
                if (!response.ok) throw new Error("Error al obtener los premios");
                const data = await response.json();
                setPremios(data);
            } catch (error) {
                console.error("Error al cargar premios:", error);
            }
        };
        fetchPremios();
    }, []);

    // Función para eliminar un usuario
    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/premios/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar el premio");

            // Actualiza el estado para eliminar el usuario del frontend
            setPremios((prevPremios) => prevPremios.filter((premio) => premio.id !== id));
            alert("Premio eliminado correctamente");
        } catch (error) {
            console.error("Error al eliminar premio:", error);
            alert("Hubo un problema al eliminar el premio");
        }
    };

    return (

        <div className="mt-20 flex flex-col items-center font-[family-name:var(--blender-bold)]">


            {/* LISTA DE LOGROS */}
            <div className="mt-10 flex flex-col gap-4 px-10 min-w-[700px]">
                
                {premios.map((premio) => (
                    <div
                        key={premio.id}
                        className="bg-stone-800 hover:bg-stone-700 transition-all p-5 rounded-lg flex gap-4 justify-between"
                    >
                        <div className="flex flex-col">
                            <p className="text-lg">{premio.titulo}</p>
                            <p className="text-sm">{premio.descripcion}</p>
                        </div>

                        <button
                            onClick={() => handleDelete(premio.id)}
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


