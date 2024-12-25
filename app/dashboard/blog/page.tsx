
import prisma from "@/libs/prisma";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


async function loadData() { 
    const session = await getServerSession(authOptions);

    if(!session) throw new Error("No estas logueado");

    return await prisma.user.findMany();
}





async function BlogPage() {

    //const post = await loadData();

        
    return (
        <div className="bg-[#1A1A1A] min-h-screen p-6 pt-40">

            <div className="max-w-2xl mx-auto bg-[#353535] rounded-2xl p-4 shadow-lg">

                {
                    


                }

                

            </div>
        
        </div>
    )
}

export default BlogPage