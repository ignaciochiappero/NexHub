
//components\navbarCustom\NavbarCustom.tsx

"use client";

import Link from "next/link";

import { signOut, useSession } from "next-auth/react";

function NavbarCustom() {

    //Vamos a extraer la información personal del usuario
    const {data: session} = useSession();
    console.log(session)



  return (
    <div className="flex font-[family-name:var(--blender-bold)] text-lg">

        <ul className="flex gap-2 text-black">
            <li className="bg-white rounded-xl p-2 hover:bg-stone-200 transition-all">
                <Link href="/">
                    Home
                </Link>
            </li>

            <li className="bg-white rounded-xl p-2 hover:bg-stone-200 transition-all">
                <Link href="/blog">
                    Blog
                </Link>
            </li>

            <li className="bg-white rounded-xl p-2 hover:bg-stone-200 transition-all">
                <Link href="/admin/users">
                    Administration
                </Link>
            </li>

            <li className="bg-white rounded-xl p-2 hover:bg-stone-200 transition-all">
                <Link href="/dashboard">
                    Dashboard
                </Link>
            </li>

            {/* Componente personalizado */}
            <li className="bg-yellow-400 rounded-xl p-2 transition-all">
                
                
                {/* Si no hay sesión, mostrar el componente Login */}
                {
                    !session && (
                        <Link href="/auth/login">
                            Login
                        </Link>
                    ) 
                }


                {/* Si hay sesión, mostrar el nombre del usuario */}
                {
                    session && (
                        
                        <Link href="/dashboard/profile">
                            {session?.user?.name}
                        </Link>
    
                        
                    )
                }

            </li>


            {/* Componente LogOut */}
            <li className="bg-red-400 hover:bg-red-500 rounded-xl p-2 transition-all">
                
                <button onClick={() => signOut()}>
                    Log Out
                </button>

            </li>
            
        </ul>


    </div>
  )
}

export default NavbarCustom;