import PostCard from "./post-card";
import { Card, CardContent } from "../ui/card";
import PostCreateSection from "./post-create-section";
import { Post } from "@/types/post";

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <>
      <PostCreateSection />
      <Card className="rounded-none p-0 m-0 backdrop-blur-sm border-0 hover-lift gap-0 shadow-2xl">
        <CardContent className="p-0">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </CardContent>
      </Card>
    </>
  )
}