//app\dashboard\blog\components\BlogFeed.tsx
"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import CreatePostForm from "./CreatePostForm";

interface BlogFeedProps {
  initialPosts: any[];
  currentUser: any;
}

export default function BlogFeed({ initialPosts, currentUser }: BlogFeedProps) {
  const [posts, setPosts] = useState(initialPosts);

  const handlePostCreated = (newPost: any) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostUpdate = (updatedPost: any) => {
    setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
  };

  const handlePostDelete = (deletedPostId: number) => {
    setPosts(posts.filter(post => post.id !== deletedPostId));
  };

  return (
    <>
      <CreatePostForm currentUser={currentUser} onPostCreated={handlePostCreated} />
      <div className="space-y-6 mt-8">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            onPostUpdate={handlePostUpdate}
            onPostDelete={handlePostDelete}
          />
        ))}
      </div>
    </>
  );
}