'use client'
import { Post } from "@/types/post"
import { useState } from "react"
import PostCard from "./post-card";
import { Card, CardContent } from "../ui/card";

interface PostListProps {
  // filter?: PostFilter
  postList: Post[];
}

export default function PostList({
  postList
}: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(postList);

  return (
    <Card className="rounded-none p-0 m-0 backdrop-blur-sm border-0 hover-lift gap-0 shadow-2xl">
      <CardContent className="p-0">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </CardContent>
    </Card>
  )
}