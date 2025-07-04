import { mockPosts } from "@/lib/mock-data/mock-post"
import { Post } from "@/types/post"
import { useState } from "react"
import PostCard from "./post-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface PostListProps {
  // filter?: PostFilter
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);

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