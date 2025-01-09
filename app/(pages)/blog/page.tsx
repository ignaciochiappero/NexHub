"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Share2 } from 'lucide-react';


// Types for posts
type Post = {
  id: number;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
};

export default function BlogPage() {
  // Initial posts state
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Nacho Chiappero",
      avatar: "/perfil-n-d.png",
      content: "Excited to share my latest project progress! 🚀 #WebDevelopment",
      image: "/marcos/marco1.png",
      likes: 42,
      comments: 7,
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      author: "Nacho Chiappero",
      avatar: "/perfil-n-d.png",
      content: "Learning new technologies every day! Keep growing, keep improving.",
      likes: 28,
      comments: 3,
      timestamp: "1 day ago"
    }
  ]);

  // New post state
  const [newPostContent, setNewPostContent] = useState('');

  // Function to add a new post
  const handlePostCreation = () => {
    if (newPostContent.trim()) {
      const newPost: Post = {
        id: posts.length + 1,
        author: "Nacho Chiappero",
        avatar: "/perfil-n-d.png",
        content: newPostContent,
        likes: 0,
        comments: 0,
        timestamp: "Just now"
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
    }
  };

  return (

    <div className="bg-[#1A1A1A] min-h-screen p-6 pt-40">
      
      <div className="max-w-2xl mx-auto bg-[#353535] rounded-2xl p-4 shadow-lg">
        
        {/* New Post Section */}
        <div className="mb-6 flex items-center space-x-4">
          
          <Image 
            src="/perfil-n-d.png" 
            alt="Profile" 
            width={50} 
            height={50} 
            className="rounded-full"
          />
          <div className="flex-grow">
            <textarea 
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-[#454545] text-white p-3 rounded-xl resize-none"
              rows={3}
            />
            <button 
              onClick={handlePostCreation}
              className="mt-2 bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition"
            >
              Post
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="bg-[#454545] rounded-2xl p-4 mb-4 text-white"
          >
            {/* Post Header */}
            <div className="flex items-center mb-4">
              <Image 
                src={post.avatar} 
                alt={post.author} 
                width={40} 
                height={40} 
                className="rounded-full mr-3"
              />
              <div>
                <h3 className="font-bold">{post.author}</h3>
                <p className="text-sm text-gray-400">{post.timestamp}</p>
              </div>
            </div>

            {/* Post Content */}
            <p className="mb-4">{post.content}</p>

            {/* Optional Post Image */}
            {post.image && (
              <Image 
                src={post.image} 
                alt="Post image" 
                width={500} 
                height={300} 
                className="rounded-xl mb-4 object-cover"
              />
            )}

            {/* Post Interactions */}
            <div className="flex justify-between text-gray-300">
              <button className="flex items-center hover:text-pink-500">
                <Heart className="mr-2" /> {post.likes}
              </button>
              <button className="flex items-center hover:text-blue-500">
                <MessageCircle className="mr-2" /> {post.comments}
              </button>
              <button className="flex items-center hover:text-green-500">
                <Share2 className="mr-2" /> Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}