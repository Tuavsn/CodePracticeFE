import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ContainerLayout from "@/components/layout/container-layout";
import PostDetail from "@/components/posts/post-detail";
import { PostService } from "@/lib/services/post.service";

export default async function PostsDetailPage({
  params
}: {
  params: Promise<{ slug: string[] }>
}) {
  const postParams = (await params).slug[0];

  const postId = postParams.split("-").pop();

  const post = await PostService.getPostById(postId as string);

  const renderBreadCrumb = () => {
    return (
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-gray-600 hover:text-black transition-colors">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-400" />
          <BreadcrumbItem>
            <BreadcrumbLink href="/posts" className="text-gray-600 hover:text-black transition-colors">
              Discuss
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-400" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-black font-medium">
              Slug
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  const renderBackButton = () => {
    return (
      <Button variant={"link"} asChild className="cursor-pointer mb-4">
        <Link href="/posts">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Go Back
        </Link>
      </Button>
    )
  }

  return (
    <ContainerLayout>
      {/* Breadcrumb */}
      {renderBreadCrumb()}
      {/* Back button */}
      {renderBackButton()}
      {/* Post Content */}
      <PostDetail post={post} />
    </ContainerLayout>
  )
}