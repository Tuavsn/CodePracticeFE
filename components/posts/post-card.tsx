import { Post } from "@/types/post";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { formatDate } from "@/lib/date-utils";
import { getArchievementIcon, getRoleIcon } from "@/lib/icon-utils";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { stringToSlug } from "@/lib/string-utils";
import ContentDisplay from "../content-display";
import PostCardHeaderActions from "./post-card-header-actions";
import PostCardFooterActions from "./post-card-footer-actions";

interface PostCardProps {
  post: Post;
}

export default function PostCard({
  post,
}: PostCardProps) {

  return (
    <Card className="border-0 rounded-none shadow-none gap-1 hover:bg-gray-70/30 hover:shadow-sm transition-all duration-200 group cursor-pointer relative overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle>
          <div className="flex items-center space-x-3 min-w-0">
            {/* Avatar */}
            <Avatar className="h-12 w-12 rounded-md flex-shrink-0">
              <AvatarImage src={post.author.avatar} alt={post.author.username} />
              <AvatarFallback>{post.author.email}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 py-1 min-w-0">
                {/* Username */}
                <Link 
                  href={`/profile/${post.author.id}`} 
                  className="font-semibold hover:underline hover:text-[#0476D0] truncate"
                >
                  {post.author.username}
                </Link>
                {/* User role */}
                <div className="flex-shrink-0">
                  {getRoleIcon(post.author.role)}
                </div>
                {/* User archievement */}
                <div className="flex-shrink-0">
                  {getArchievementIcon(post.author.achievement)}
                </div>
              </div>
              {/* Created Date */}
              <p className="text-sm text-muted-foreground truncate">{formatDate(post.createdAt)}</p>
            </div>
          </div>
        </CardTitle>
        {/* Card header actions */}
        <CardAction className="flex-shrink-0">
          <PostCardHeaderActions post={post} />
        </CardAction>
      </CardHeader>
      
      {/* Content */}
      <CardContent className="pb-3">
        {/* Post content with image layout */}
        <div className={`${post.thumbnail ? 'md:flex md:gap-4 md:items-start' : ''} min-w-0`}>
          {/* Text content - takes remaining space */}
          <div className={`${post.thumbnail ? "md:flex-1 md:min-w-0 md:overflow-hidden" : ""} min-w-0`}>
            {/* Post title */}
            <Link href={`/posts/${stringToSlug(post.title)}-${post.id}`}>
              <h2 className="text-xl font-semibold mb-2 hover:text-[#0476D0] cursor-pointer line-clamp-2 break-words">
                {post.title}
              </h2>
            </Link>
            
            {/* Post content */}
            <div className="mb-3">
              <ContentDisplay 
                className="text-muted-foreground line-clamp-4" 
                content={post.content} 
              />
            </div>
            
            {/* Topics */}
            <div className="flex flex-wrap gap-2">
              {post.topics.map((topic, index) => (
                <Badge key={index} variant={"secondary"} className="text-xs">
                  #{topic}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Image - fixed size, shows full image */}
          {post.thumbnail && (
            <div className="mt-3 md:mt-0 md:w-64 md:h-48 md:flex-shrink-0">
              <Link href={`/posts/${stringToSlug(post.title)}-${post.id}`}>
                {typeof post.thumbnail === 'string' && (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    width={256}
                    height={192}
                    className="w-full h-full rounded-sm hover:opacity-90 transition-opacity cursor-pointer object-contain bg-gray-50"
                  />
                )}
              </Link>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Card Footer Actions */}
      <CardFooter className="pt-0">
        <PostCardFooterActions post={post} />
      </CardFooter>
    </Card>
  )
}