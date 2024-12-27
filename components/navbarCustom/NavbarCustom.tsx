
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
            <li >
                <Link 
                href="/"
                className="bg-white rounded-xl p-2 hover:bg-stone-200 transition-all"
                >
                    Home
                </Link>
            </li>

            <li>
                <Link 
                href="/dashboard/blog"
                className="bg-white rounded-xl p-2 hover:bg-stone-200 transition-all"
                >
                    Blog
                </Link>
            </li>

            <li>
                <Link 
                href="/admin"
                className="bg-white rounded-xl p-2 hover:bg-stone-200 transition-all"
                >
                    Administration
                </Link>
            </li>

            <li >
                <Link 
                href="/dashboard"
                className="bg-white rounded-xl p-2 hover:bg-stone-200 transition-all"
                >
                    Dashboard
                </Link>
            </li>

            {/* Componente personalizado */}
            <li >
                
                
                {/* Si no hay sesión, mostrar el componente Login */}
                {
                    !session && (
                        <Link 
                        href="/auth/login"
                        className="bg-yellow-400 rounded-xl p-2 transition-all"
                        >
                            Login
                        </Link>
                    ) 
                }


                {/* Si hay sesión, mostrar el nombre del usuario */}
                {
                    session && (
                        
                        <Link 
                        href="/dashboard/profile"
                        className="bg-yellow-400 rounded-xl p-2 transition-all"
                        >
                            {session?.user?.name}
                        </Link>
    
                        
                    )
                }

            </li>


            {/* Componente LogOut */}
            <li >
                
                <Link
                href="#"
                className="bg-red-400 hover:bg-red-500 rounded-xl p-2 transition-all h-9"
                >
                
                    <button 
                    onClick={() => signOut()}
                    >
                        Log Out
                    </button>
                
                </Link>

            </li>
            
        </ul>


    </div>
  )
}

export default NavbarCustom;