import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ContainerLayout from "@/components/layout/container-layout";
import { PostService } from "@/lib/services/post.service";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/date-utils";
import Image from "next/image";
import ContentDisplay from "@/components/content-display";
import PostDetailFooterActions from "@/components/posts/post-detail-footer-actions";
import { Badge } from "@/components/ui/badge";
import PostModal from "@/components/posts/post-modal";
import CommentList from "@/components/comments/comment-list";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default async function PostsDetailPage({
  params
}: {
  params: Promise<{ slug: string[] }>
}) {
  const postParams = (await params).slug[0];

  const slugAndId = postParams.split("-");

  const postId = slugAndId.pop();

  const slug = slugAndId.join('-')

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
              {slug}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  const renderBackButton = () => {
    return (
      <Button variant={"link"} asChild className="mb-4">
        <Link href="/posts">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Go Back
        </Link>
      </Button>
    )
  }

  const renderPostContent = () => {
    return (
      <article>
        <Card className="p-8 mb-8 border-0 gap-2 shadow-2xl">
          {/* Post Header */}
          <div className="flex items-center justify-between">
            {/* Author Info */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author.avatar} alt={post.author.username} />
                <AvatarFallback>{post.author.email}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/profile/${post.author.id}`} className="font-semibold text-lg hover:underline hover:text-[#0476D0]">
                  {post.author.username}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {formatDate(post.createdAt.toString())}
                  {post.updatedAt !== post.createdAt && " (updated)"}
                </p>
              </div>
            </div>
          </div>
          {/* Post Title */}
          <h1 className="text-3xl font-bold">{post.title}</h1>
          {/* Post Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {post.topics.map((topic, index) => (
              <Badge key={index} variant={"secondary"}>
                #{topic}
              </Badge>
            ))}
          </div>
          {/* Content With Images */}
          <div className="prose prose-lg max-w-none">
            {post.images && (
              <Carousel className="w-full mb-6">
                <CarouselContent>
                  {post.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full min-h-96"> {/* Chiều cao ảnh */}
                        <Image
                          src={image.url}
                          alt={`Image ${index + 1}`}
                          fill
                          className="w-full h-auto object-contain mb-6"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
            {/* Content Text */}
            <ContentDisplay content={post.content} />
          </div>
          {/* Post Actions */}
          <PostDetailFooterActions post={post} />
          {/* Comment Sections */}
          <div id="comments">
            <CommentList postId={post.id} />
          </div>
        </Card>
      </article>
    )
  }

  return (
    <ContainerLayout>
      {/* Breadcrumb */}
      {renderBreadCrumb()}
      {/* Back button */}
      {renderBackButton()}
      {/* Post Content */}
      {renderPostContent()}
      {/* Post Modal */}
      <PostModal />
    </ContainerLayout>
  )
}