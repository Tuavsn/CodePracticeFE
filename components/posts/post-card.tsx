import { Post } from "@/types/post";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { formatDate } from "@/lib/date-utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Share } from "lucide-react";
import { getArchievementIcon, getRoleIcon } from "@/lib/icon-utils";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { useState } from "react";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onBookMark?: (postId: string) => void;
}

export default function PostCard({ post, onLike, onBookMark }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.postReactions.length);

  return (
    <Card className="border-0 rounded-none shadow-none gap-1 hover:bg-gray-70/30 hover:shadow-sm transition-all duration-200 group cursor-pointer relative overflow-hidden">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <Avatar className="h-12 w-12 rounded-md">
              <AvatarImage src={post.user.avatar || '/placeholder.svg'} alt={post.user.username} />
              <AvatarFallback>{post.user.email}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2 py-1">
                {/* Username */}
                <Link href={`/profile/${post.user.id}`} className="font-semibold hover:underline hover:text-[#0476D0]">
                  {post.user.username}
                </Link>
                {/* User role */}
                {getRoleIcon(post.user.role)}
                {/* User archievement */}
                {getArchievementIcon(post.user.achievement)}
              </div>
              {/* Created Date */}
              <p className="text-sm text-muted-foreground">{formatDate(post.createdAt as string)}</p>
            </div>
          </div>
        </CardTitle>
        <CardAction>
          {/* Action button (Report | Hidden | Copy Link) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="cursor-pointer" variant={"ghost"} size={"icon"}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">Report</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Hidden</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Copy Link</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      {/* Content */}
      <CardContent>
        {/* Post content with image layout */}
        <div className={`${post.postImages ? 'md:flex md:gap-4' : ''}`}>
          {/* Text content */}
          <div className={`${post.postImages ? "md:flex-1" : ""}`}>
            {/* Post title */}
            <Link href={`/posts/${post.id}`}>
              <h2 className="text-xl font-semibold mb-2 hover:text-[#0476D0] cursor-pointer">{post.title}</h2>
            </Link>
            {/* Post content */}
            <p className="text-muted-foreground line-clamp-3">{post.content}</p>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant={"secondary"}>
                  #{tag.title}
                </Badge>
              ))}
            </div>
          </div>
          {/* Image - show on top for mobile, right side for desktop */}
          {post.postImages && (
            <div className={`${post.postImages ? 'mt-3 md:mt-0 md:w-80 md:flex-shrink-0' : ''}`}>
              <Link href={`/posts/${post.id}`}>
                {typeof post.postImages[0].imageURL === 'string' && (
                  <Image
                    src={post.postImages[0].imageURL}
                    alt={post.title}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full max-w-60 h-full max-h-60 mx-auto rounded-sm hover:opacity-90 transition-opacity cursor-pointer"
                  />
                )}
              </Link>
            </div>
          )}
        </div>
      </CardContent>
      {/* Footer */}
      <CardFooter className="mt-2">
        {/* Actions */}
        <div className="w-full flex items-center justify-between">
          {/* Post action buttons (Like, Comment & Share) */}
          <div className="flex items-center space-x-4">
            {/* Like Button */}
            <Button className='cursor-pointer' variant={'ghost'}>
              <Heart className="h-4 w-4" />
              {likeCount}
            </Button>
            {/* Comment Button */}
            <Button className='cursor-pointer' variant={'ghost'}>
              <MessageCircle className="h-4 w-4" />
              {post.postComments.length}
            </Button>
            {/* Share Button */}
            <Button className='cursor-pointer' variant={'ghost'}>
              <Share />
              Share Post
            </Button>
          </div>
          {/* Bookmark button */}
          <Button className="cursor-pointer" variant={'ghost'}>
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}