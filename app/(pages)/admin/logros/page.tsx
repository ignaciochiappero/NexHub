"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
}

export default function AdminUserPage() {
    const [users, setUsers] = useState<User[]>([]);

    // Función para cargar usuarios desde la API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/users");
                if (!response.ok) throw new Error("Error al obtener usuarios");
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            }
        };
        fetchUsers();
    }, []);

    // Función para eliminar un usuario
    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar el usuario");

            // Actualiza el estado para eliminar el usuario del frontend
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            alert("Usuario eliminado correctamente");
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert("Hubo un problema al eliminar el usuario");
        }
    };

    return (
        <div className="mt-20 flex flex-col items-center font-[family-name:var(--blender-bold)]">

            <div className="flex w-screen justify-between px-10 bg-stone-900 p-2">

                <p className="text-3xl">Administrar Usuarios</p>
                
                
                <Link href="/auth/register">
                
                    <button
                        className="bg-blue-600 hover:bg-blue-500 transition-all p-2 rounded-lg">
                            Agregar Logro
                    </button>
                </Link>
            </div>

            {/* Panel de usuarios */}
            <div className="mt-10 grid grid-cols-2 gap-4 px-5">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="bg-stone-800 hover:bg-stone-700 transition-all p-5 rounded-lg flex gap-4 justify-between"
                    >
                        <div className="flex flex-col">
                            <p className="text-lg">{user.name}</p>
                            <p className="text-sm">{user.email}</p>
                        </div>

                        <button
                            onClick={() => handleDelete(user.id)}
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
