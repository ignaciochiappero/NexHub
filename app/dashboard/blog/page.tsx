//app\dashboard\blog\page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/prisma";
import BlogFeed from "./components/BlogFeed";

async function getBlogData() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("No estás logueado");

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
  });

  if (!user) throw new Error("Usuario no encontrado");

  const posts = await prisma.post.findMany({
    include: {
      user: true,
      likes: true,
      comments: {
        include: {
          user: true,
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    currentUser: user,
    posts: posts.map((post) => ({
      ...post,
      isLiked: post.likes.some((like) => like.userId === user.id),
      likesCount: post.likes.length,
      comments: post.comments.map((comment) => ({
        ...comment,
        isLiked: comment.likes.some((like) => like.userId === user.id),
        likesCount: comment.likes.length,
      })),
    })),
  };
}

export default async function BlogPage() {
  const { currentUser, posts } = await getBlogData();

  return (
    <div className="min-h-screen bg-[#1A1A1A] p-6 pt-28 font-[family-name:var(--blender-medium)]">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-blender-mayus text-3xl text-white mb-6">Feed</h1>
        <BlogFeed initialPosts={posts} currentUser={currentUser} />
      </div>
    </div>
  );
}