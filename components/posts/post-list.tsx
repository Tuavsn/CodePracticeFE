import PostCard from "./post-card";
import { Card, CardContent } from "../ui/card";
import { PostService } from "@/lib/services/post.service";
import PostCreateSection from "./post-create-section";

export default async function PostList() {

  const posts = await PostService.getPosts();

  await posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
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