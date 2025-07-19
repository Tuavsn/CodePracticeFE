'use client'
import CommentList from "@/components/comments/comment-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/date-utils";
import { mockPosts } from "@/lib/mock-data/mock-post";
import { Post } from "@/types/post";
import { ArrowLeft, Bookmark, Edit, Heart, MessageCircle, Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import ContainerLayout from "@/components/layout/container-layout";

export default function PostsDetailPage() {
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post>(mockPosts.find((p) => p.id === postId) || mockPosts[0]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.postReactions.length);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  }

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
      <article>
        <Card className="p-8 mb-8 border-0 gap-2 shadow-2xl">
          {/* Post Header */}
          <div className="flex items-center justify-between">
            {/* Author Info */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.user.avatar || '/placeholder.svg'} alt={post.user.username} />
                <AvatarFallback>{post.user.email}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/profile/${post.user.id}`} className="font-semibold text-lg hover:underline hover:text-[#0476D0]">
                  {post.user.username}
                </Link>
                <p className="text-muted-foreground">
                  {formatDate(post.createdAt as string)}
                  {post.updatedAt !== post.createdAt && " (updated)"}
                </p>
              </div>
            </div>
            {/* Edit Button */}
            <Button variant={"outline"} size={"sm"} onClick={() => setIsUpdateModalOpen(true)} className="cursor-pointer">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          {/* Post Title */}
          <h1 className="text-3xl font-bold">{post.title}</h1>
          {/* Post Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant={"secondary"}>
                #{tag.title}
              </Badge>
            ))}
          </div>
          {/* Content With Images */}
          <div className="prose prose-lg max-w-none">
            {post.postImages && (
              post.postImages.map((image, index) => (
                <Image
                  key={index}
                  src={image.imageURL}
                  alt={image.imageURL}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto rounded-lg mb-6"
                />
              ))
            )}
            <p className="text-lg leading-relaxed">{post.content}</p>
          </div>
          {/* Post Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center space-x-6">
              {/* Like Button */}
              <Button variant={"ghost"} className="cursor-pointer" onClick={handleLike}>
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                {likeCount} Like
              </Button>
              {/* Comment Button */}
              <Button variant={"ghost"} className="cursor-pointer">
                <MessageCircle className="h-4 w-4" />
                {post.postComments.length} Comments
              </Button>
              {/* Share Button */}
              <Button variant={"ghost"} className="cursor-pointer">
                <Share className="h-4 w-4" />
                Share
              </Button>
            </div>
            <Button variant={"ghost"} className="cursor-pointer">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
          {/* Comment Sections */}
          <div id="comments">
            <CommentList postId={postId} />
          </div>
        </Card>
      </article>
    </ContainerLayout>
  )
}