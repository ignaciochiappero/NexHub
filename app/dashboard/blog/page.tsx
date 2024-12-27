
import prisma from "@/libs/prisma";
import Image from "next/image";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MessageCircle } from "lucide-react";

import PostSection from "./components/PostSection";
import LikeButton from "./components/LikeButton";

//CARGAR TODOS LOS POST
async function loadData() {
  const session = await getServerSession(authOptions);
  if(!session) throw new Error("No estas logueado");
  
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email }
  });

  if (!user) throw new Error("Usuario no encontrado");

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      likes: true,
    },
  });

  return posts.map(post => ({
    ...post,
    isLiked: post.likes.some(like => like.userId === user.id),
    likesCount: post.likes.length
  }));
}


//Función para formato de fecha
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = Math.abs(now.getTime() - date.getTime());
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  //const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if(minutes < 1) {
    return `hace un momento`;
  }
  else if (minutes < 60) {
      return `hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  } else if (hours < 24) {
      return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  } else {
      return date.toLocaleDateString(); // Devuelve la fecha en formato local
  }
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
                    {post.user.name}
                    {/* {post.author} */}
                </h3>
                <p className="text-sm text-gray-400">
                    
                {formatTimeAgo(new Date(post.createdAt))}
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
              
              <LikeButton 
              postId={post.id}   initialLikes={post.likesCount}  
              initialIsLiked={post.isLiked} />

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