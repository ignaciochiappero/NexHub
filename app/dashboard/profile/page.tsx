

import prisma from "@/libs/prisma";

//para traer el valor del id de la sesion
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";



    async function loadData() { 
        const session = await getServerSession(authOptions);

        if(!session) throw new Error("No estas logueado");

        return await prisma.user.findMany({
    
            //esto es traer los proyectos donde
            //el user id coincida con el id de la sesion
            where: {
                id: parseInt(session.user.id)
            }
        });
    }

async function ProfilePage() {

    const datos = await loadData();
    

    const user = datos[0];


  

    return (
        <div className="mt-40 p-4 font-[family-name:var(--blender-medium)] flex flex-col justify-center">
            
            <p className='text-3xl text-center'>
            
                Perfil
            
            </p>


            <div className="w-full max-w-6xl bg-[#212121] rounded-3xl p-6 grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-6">


                {/* INFO PERFIL */}
                <div className='w-full bg-[#353535] rounded-xl p-4 text-center flex flex-col '>
                
                <span className="text-2xl">{user.name} </span>

                <span>Cargo: </span>

                <span className="mt-2 text-stone-500">{user.email}</span>   


                </div>



            </div>






        </div>
    )
}

export default ProfilePage