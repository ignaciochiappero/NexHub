
import prisma from "@/libs/prisma";
import Image from "next/image";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Heart, MessageCircle } from "lucide-react";

import PostSection from "./components/PostSection";


async function loadData() { 
    const session = await getServerSession(authOptions);

    if(!session) throw new Error("No estas logueado");

    return await prisma.post.findMany({
        orderBy: {
            createdAt: "desc", // Orden descendente
        },
    });
}







async function BlogPage() {

    const posts = await loadData();

        
  return (

    <div className="bg-[#1A1A1A] min-h-screen p-6 pt-40">
      
      <div className="max-w-2xl mx-auto bg-[#353535] rounded-2xl p-4 shadow-lg">
        

        <PostSection />



        {/* Posts Feed */}
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="bg-[#454545] rounded-2xl p-4 mb-4 text-white"
          >
            {/* Post Header */}
            <div className="flex items-center mb-4">
              <Image 
                src="/perfil-n-d.png"
                alt="Profile"
                // src={post.avatar} 
                // alt={post.author} 
                width={40} 
                height={40} 
                className="rounded-full mr-3"
              />
              <div>

                <h3 className="font-bold">
                    Autor: {post.userId}
                    {/* {post.author} */}
                </h3>
                <p className="text-sm text-gray-400">
                    
                    Publicado el: 
                    {/* {post.timestamp} */}
                </p>
              </div>
            </div>

            {/* Post Content */}
            <p className="mb-4">{post.content}</p>

            {/* Optional Post Image */}
            {/* {post.image && (
              <Image 
                src={post.image} 
                alt="Post image" 
                width={500} 
                height={300} 
                className="rounded-xl mb-4 object-cover"
              />
            )} */}

            {/* Post Interactions */}
            <div className="flex justify-start text-gray-300 gap-4">
              <button className="flex items-center hover:text-pink-500">
                <Heart className="mr-2" /> 
                12
                {/* {post.likes} */}
              </button>

              <button className="flex items-center hover:text-blue-500 ">
                <MessageCircle className="mr-2" /> 
                5
                {/* {post.comments} */}
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogPage