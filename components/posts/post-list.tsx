import PostCard from "./post-card";
import { Card, CardContent } from "../ui/card";
import PostCreateSection from "./post-create-section";
import { Post } from "@/types/post";
import DataPagination from "../pagination";
import { PaginationData } from "@/lib/api/api-client";

interface PostListProps {
  paginatedPosts: PaginationData<Post[]>;
}

export default function PostList({ paginatedPosts }: PostListProps) {

  const totalPage = paginatedPosts.totalPages;

  const totalItem = paginatedPosts.totalElements;

  const pageSize = paginatedPosts.size;

  const posts = paginatedPosts.content;

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
      {/* Pagination */}
      <DataPagination
        totalPage={totalPage}
        totalItems={totalItem}
        pageSize={pageSize}
        maxVisiblePages={5}
        showPageInfo={true}
        showItemsCount={true}
        className="my-4"
      />
    </>
  )
}